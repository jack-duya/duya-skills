#!/usr/bin/env python3
"""Read-only Streamable HTTP client for the duya template library (stdlib only)."""

import argparse
import http.client
import json
import os
import socket
import sys
import time
import urllib.error
import urllib.parse
import urllib.request


DEFAULT_URL = "http://43.242.194.25:3170/mcp"
MAX_RESPONSE_BYTES = 10 * 1024 * 1024
TOOL_NAMES = {
    "recommend": "recommend_templates_tool",
    "tracks": "list_tracks_tool",
    "get": "get_template_tool",
}


class MCPError(Exception):
    def __init__(self, code, message, details=None):
        super().__init__(message)
        self.code = code
        self.details = details


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise MCPError("http_redirect", "MCP endpoint redirected; use its confirmed endpoint URL.")


class TemplateMCP:
    def __init__(self, url=DEFAULT_URL, timeout=20, deadline=75):
        parsed = urllib.parse.urlsplit(url)
        if parsed.scheme not in ("http", "https") or not parsed.hostname or parsed.username or parsed.password:
            raise MCPError("invalid_endpoint", "Use an HTTP(S) endpoint without credentials in the URL.")
        self.url = url
        self.timeout = timeout
        self.expires = time.monotonic() + deadline
        self.session_id = None
        self.protocol = None
        self.server = None
        self.next_id = 0
        self.opener = urllib.request.build_opener(NoRedirect())

    def remaining(self):
        left = self.expires - time.monotonic()
        if left <= 0:
            raise MCPError("deadline", "The read-only MCP command exceeded its time budget.")
        return left

    @staticmethod
    def decode_json(raw):
        try:
            return json.loads(raw.decode("utf-8-sig"))
        except (UnicodeDecodeError, json.JSONDecodeError) as exc:
            raise MCPError("invalid_json", "MCP returned invalid UTF-8 JSON.") from exc

    @staticmethod
    def matching_response(message, request_id):
        if isinstance(message, list):
            return next((item for item in message if isinstance(item, dict) and item.get("id") == request_id), None)
        if isinstance(message, dict) and message.get("id") == request_id:
            return message
        return None

    def read_sse(self, response, request_id):
        # SSE is a RESPONSE representation of Streamable HTTP. No /sse endpoint,
        # GET event connection, endpoint event, or legacy message-post URL is used.
        data = []
        total = 0
        while True:
            self.remaining()
            raw = response.readline(MAX_RESPONSE_BYTES - total + 1)
            self.remaining()
            total += len(raw)
            if total > MAX_RESPONSE_BYTES:
                raise MCPError("response_too_large", "MCP response exceeded 10 MiB.")
            if not raw:
                if data:
                    message = self.decode_json("\n".join(data).encode("utf-8"))
                    match = self.matching_response(message, request_id)
                    if match is not None:
                        return match
                raise MCPError("missing_response", "MCP event stream ended before a matching response.")
            try:
                line = raw.decode("utf-8-sig").rstrip("\r\n")
            except UnicodeDecodeError as exc:
                raise MCPError("invalid_utf8", "MCP event stream is not valid UTF-8.") from exc
            if line == "":
                if data:
                    message = self.decode_json("\n".join(data).encode("utf-8"))
                    data = []
                    match = self.matching_response(message, request_id)
                    if match is not None:
                        return match
            elif line.startswith("data:"):
                value = line[5:]
                data.append(value[1:] if value.startswith(" ") else value)
            # event, id, retry and comments are not JSON-RPC responses.

    def post(self, method, params=None, notification=False):
        payload = {"jsonrpc": "2.0", "method": method}
        if not notification:
            self.next_id += 1
            payload["id"] = self.next_id
        if params is not None:
            payload["params"] = params
        headers = {"Content-Type": "application/json", "Accept": "application/json, text/event-stream"}
        if self.session_id:
            headers["Mcp-Session-Id"] = self.session_id
        if self.protocol:
            headers["MCP-Protocol-Version"] = self.protocol
        request = urllib.request.Request(self.url, json.dumps(payload, ensure_ascii=False).encode("utf-8"), headers, method="POST")
        try:
            with self.opener.open(request, timeout=min(self.timeout, self.remaining())) as response:
                if response.headers.get("Mcp-Session-Id"):
                    self.session_id = response.headers["Mcp-Session-Id"]
                if notification:
                    if response.status not in (200, 202, 204):
                        raise MCPError("notification_rejected", "MCP initialization notification was rejected.")
                    return None
                content_type = response.headers.get("Content-Type", "").split(";", 1)[0].strip().lower()
                if content_type == "text/event-stream":
                    message = self.read_sse(response, payload["id"])
                elif content_type == "application/json":
                    raw = response.read(MAX_RESPONSE_BYTES + 1)
                    self.remaining()
                    if len(raw) > MAX_RESPONSE_BYTES:
                        raise MCPError("response_too_large", "MCP response exceeded 10 MiB.")
                    message = self.matching_response(self.decode_json(raw), payload["id"])
                    if message is None:
                        raise MCPError("missing_response", "MCP JSON response has no matching request id.")
                else:
                    raise MCPError("unexpected_content_type", "Expected application/json or text/event-stream.", content_type)
        except urllib.error.HTTPError as exc:
            raise MCPError("http_error", "MCP endpoint returned HTTP %s." % exc.code) from exc
        except (urllib.error.URLError, TimeoutError, socket.timeout, ConnectionError, OSError, http.client.HTTPException) as exc:
            raise MCPError("connection_error", "Could not complete the MCP request.", str(exc)) from exc
        if message.get("jsonrpc") != "2.0":
            raise MCPError("protocol_error", "The response is not JSON-RPC 2.0.")
        if "error" in message:
            raise MCPError("rpc_error", "MCP returned a JSON-RPC error.", message["error"])
        if "result" not in message:
            raise MCPError("protocol_error", "MCP response is missing result.")
        return message["result"]

    def initialize(self):
        result = self.post("initialize", {
            "protocolVersion": "2025-03-26",
            "capabilities": {},
            "clientInfo": {"name": "duya-template-readonly", "version": "0.1.0"},
        })
        if not isinstance(result, dict) or not isinstance(result.get("protocolVersion"), str):
            raise MCPError("invalid_initialize", "MCP initialization is missing a protocol version.")
        self.protocol = result["protocolVersion"]
        self.server = result.get("serverInfo", {})
        self.post("notifications/initialized", notification=True)
        return result

    def list_tools(self):
        tools = []
        cursor = None
        seen = set()
        for _ in range(20):
            page = self.post("tools/list", {"cursor": cursor} if cursor else {})
            if not isinstance(page, dict) or not isinstance(page.get("tools"), list):
                raise MCPError("invalid_tool_list", "MCP tools/list returned an invalid list.")
            tools.extend(page["tools"])
            cursor = page.get("nextCursor")
            if not cursor:
                return tools
            if cursor in seen:
                raise MCPError("pagination_loop", "MCP repeated its tools/list cursor.")
            seen.add(cursor)
        raise MCPError("pagination_limit", "MCP tools/list exceeded 20 pages.")

    def call(self, command, arguments):
        # Public CLI deliberately exposes only the three read-only library tools.
        name = TOOL_NAMES[command]
        tool = next((item for item in self.list_tools() if item.get("name") == name), None)
        if tool is None:
            raise MCPError("tool_unavailable", "Required library tool is not advertised: " + name)
        schema = tool.get("inputSchema", {})
        properties = schema.get("properties", {})
        if any(key not in properties for key in arguments) or any(key not in arguments for key in schema.get("required", [])):
            raise MCPError("schema_changed", "Library input schema changed; inspect the tools command before retrying.", schema)
        result = self.post("tools/call", {"name": name, "arguments": arguments})
        if not isinstance(result, dict):
            raise MCPError("invalid_tool_result", "MCP returned a non-object tool result.")
        if result.get("isError"):
            raise MCPError("tool_error", "The template tool reported failure.", result)
        decoded = decode_tool_result(result)
        if isinstance(decoded, dict) and decoded.get("error"):
            raise MCPError("library_error", "The template library reported failure.", decoded)
        if not isinstance(decoded, dict):
            raise MCPError("invalid_library_result", "Expected a library JSON object; inspect the returned content.", decoded)
        if command == "get" and decoded.get("id") != arguments.get("template_id"):
            raise MCPError("invalid_library_result", "The library did not return the requested template id.", decoded)
        expected_list = {"recommend": "templates", "tracks": "tracks"}.get(command)
        if expected_list and not isinstance(decoded.get(expected_list), list):
            raise MCPError("invalid_library_result", "The library response is missing its result list.", decoded)
        return result


def decode_tool_result(result):
    """Preserve text when a tool's result:string is not itself JSON."""
    value = result.get("structuredContent")
    if value is None:
        texts = [block["text"] for block in result.get("content", []) if isinstance(block, dict) and block.get("type") == "text" and isinstance(block.get("text"), str)]
        value = "\n".join(texts) if texts else result
    for _ in range(4):
        if isinstance(value, dict) and set(value) == {"result"}:
            value = value["result"]
        elif isinstance(value, str):
            try:
                value = json.loads(value)
            except json.JSONDecodeError:
                break
        else:
            break
    return value


def select_tracks(data, terms=None, limit=None):
    """Filter locally after receiving the complete library response; keep its total."""
    if not terms and limit is None:
        return data
    terms = [term.strip().casefold() for term in (terms or [])]
    selected = []
    for item in data["tracks"]:
        if not isinstance(item, dict):
            continue
        aliases = item.get("aliases", [])
        values = [item.get("canonical", ""), item.get("key", "")]
        values.extend(aliases if isinstance(aliases, list) else [aliases])
        searchable = "\n".join(str(value) for value in values).casefold()
        if not terms or any(term in searchable for term in terms):
            selected.append(item)
    returned = selected if limit is None else selected[:limit]
    return {**data, "tracks": returned, "matched_count": len(selected),
            "returned_count": len(returned),
            "local_filter": {"match_any": terms, "limit": limit}}


def build_parser():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", default=os.environ.get("DUYA_TEMPLATE_MCP_URL", DEFAULT_URL))
    parser.add_argument("--timeout", type=float, default=20, help="Socket timeout in seconds (1–60).")
    parser.add_argument("--deadline", type=float, default=75, help="Command time budget in seconds (1–180).")
    parser.add_argument("--raw", action="store_true", help="Include the original MCP tool result.")
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("initialize", help="Initialize a session and show server capabilities.")
    sub.add_parser("tools", help="Initialize and retrieve current tools/list schemas.")
    tracks = sub.add_parser("tracks", help="List tracks; optionally filter canonical names and aliases locally.")
    tracks.add_argument("--match", action="append", default=[], help="Substring to match; repeat for OR matching.")
    tracks.add_argument("--limit", type=int, help="Return at most this many matching tracks (1–1000).")
    recommend = sub.add_parser("recommend", help="Retrieve candidates for a generic business need.")
    recommend.add_argument("--query", required=True)
    recommend.add_argument("--limit", type=int, default=5)
    recommend.add_argument("--platform")
    get = sub.add_parser("get", help="Fetch full text and image URLs for an observed template id.")
    get.add_argument("--id", dest="template_id", required=True)
    return parser


def main(argv=None):
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8")
    parser = build_parser()
    args = parser.parse_args(argv)
    if not 1 <= args.timeout <= 60 or not 1 <= args.deadline <= 180:
        parser.error("--timeout must be 1–60; --deadline must be 1–180.")
    if args.command == "recommend" and (not args.query.strip() or not 1 <= args.limit <= 20):
        parser.error("recommend needs a nonempty query and --limit 1–20.")
    if args.command == "get" and not args.template_id.strip():
        parser.error("get needs a nonempty --id returned by the library.")
    if args.command == "tracks" and (any(not term.strip() for term in args.match) or
                                     (args.limit is not None and not 1 <= args.limit <= 1000)):
        parser.error("tracks needs nonempty --match terms and --limit 1–1000.")
    try:
        client = TemplateMCP(args.url, args.timeout, args.deadline)
        initialization = client.initialize()
        output = {"ok": True, "command": args.command, "server": client.server, "protocol_version": client.protocol, "session_used": bool(client.session_id)}
        if args.command == "initialize":
            output["data"] = initialization
        elif args.command == "tools":
            output["data"] = client.list_tools()
        else:
            arguments = {}
            if args.command == "recommend":
                arguments = {"query": args.query, "limit": args.limit}
                if args.platform:
                    arguments["platform"] = args.platform
            elif args.command == "get":
                arguments = {"template_id": args.template_id}
            result = client.call(args.command, arguments)
            data = decode_tool_result(result)
            if args.command == "tracks":
                data = select_tracks(data, args.match, args.limit)
            output.update({"tool": TOOL_NAMES[args.command], "arguments": arguments, "data": data})
            if args.raw:
                output["raw_result"] = result
        print(json.dumps(output, ensure_ascii=False, indent=2))
        return 0
    except MCPError as exc:
        print(json.dumps({"ok": False, "command": args.command, "error": {"code": exc.code, "message": str(exc), "details": exc.details}}, ensure_ascii=False, indent=2))
        return 2


if __name__ == "__main__":
    sys.exit(main())
