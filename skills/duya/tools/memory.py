#!/usr/bin/env python3
"""Small local project memory. Standard library, atomic writes, revision checks."""
import argparse
import datetime as dt
import json
import os
from pathlib import Path
import re
import sys
import tempfile
import uuid
from contextlib import contextmanager

SCHEMA = 1
MAX_BYTES = 10 * 1024 * 1024
KINDS = {"fact", "decision", "preference", "content", "method"}
STATUSES = {"confirmed", "hypothesis", "adopted", "rejected", "draft", "candidate", "retired"}
FIELDS = {"key", "kind", "status", "title", "body", "sources", "tags"}


class MemoryError(Exception):
    def __init__(self, code, message):
        super().__init__(message)
        self.code = code


def utc():
    return dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")


def slug(value, label):
    if not isinstance(value, str) or not re.fullmatch(r"[\w-]{1,80}", value, re.UNICODE):
        raise MemoryError("invalid_name", label + " must be 1–80 letters, numbers, underscores or hyphens.")
    return value


def read_json(path):
    try:
        if path.stat().st_size > MAX_BYTES:
            raise MemoryError("too_large", "JSON exceeds 10 MiB; split large material into referenced files.")
        return json.loads(path.read_text(encoding="utf-8-sig"))
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        raise MemoryError("unreadable_json", "Cannot read JSON: " + str(path)) from exc


def validate_fields(data, partial=False):
    if not isinstance(data, dict) or set(data) - FIELDS:
        raise MemoryError("invalid_input", "Input must be an object using only: " + ", ".join(sorted(FIELDS)))
    required = {"kind", "status", "title", "body"}
    if not partial and not required <= set(data):
        raise MemoryError("missing_fields", "kind, status, title and body are required.")
    for field in ("title", "body"):
        if field in data and (not isinstance(data[field], str) or not data[field].strip()):
            raise MemoryError("invalid_input", field + " must be a nonempty string.")
    if "title" in data and len(data["title"]) > 300:
        raise MemoryError("invalid_input", "title exceeds 300 characters.")
    if "body" in data and len(data["body"]) > 100000:
        raise MemoryError("invalid_input", "body exceeds 100000 characters; use a file reference.")
    if "kind" in data and data["kind"] not in KINDS:
        raise MemoryError("invalid_kind", "Unknown record kind.")
    if "status" in data and data["status"] not in STATUSES:
        raise MemoryError("invalid_status", "Unknown record status.")
    if "key" in data:
        slug(data["key"], "key")
    for field in ("sources", "tags"):
        if field in data and (not isinstance(data[field], list) or len(data[field]) > 100 or
                              any(not isinstance(x, str) or len(x) > 2000 for x in data[field])):
            raise MemoryError("invalid_input", field + " must be a list of at most 100 short strings.")
    return dict(data)


class Store:
    def __init__(self, root, project):
        self.root = Path(root).expanduser().resolve()
        plugin = Path(__file__).resolve().parents[1]
        if self.root == plugin or plugin in self.root.parents:
            raise MemoryError("volatile_root", "Memory must be outside the plugin installation directory.")
        self.project = slug(project, "project")
        self.folder = (self.root / self.project).resolve()
        if self.folder.parent != self.root:
            raise MemoryError("path_escape", "Project path escapes the memory root.")
        self.path = self.folder / "records.json"
        self.lock = self.folder / ".write-lock"
        for path in (self.path, self.lock):
            if path.is_symlink():
                raise MemoryError("path_escape", "Memory files must not be symbolic links.")

    def read(self):
        if not self.path.exists():
            return {"schema_version": SCHEMA, "project": self.project, "records": []}
        data = read_json(self.path)
        if (not isinstance(data, dict) or data.get("schema_version") != SCHEMA or
                data.get("project") != self.project or not isinstance(data.get("records"), list)):
            raise MemoryError("unsupported_store", "Unsupported or mismatched memory schema; no data was changed.")
        ids, keys = set(), set()
        for record in data["records"]:
            if not isinstance(record, dict):
                raise MemoryError("invalid_store", "Invalid memory record.")
            validate_fields({k: v for k, v in record.items() if k in FIELDS})
            recid = record.get("id")
            if (not isinstance(recid, str) or not re.fullmatch(r"[a-f0-9]{32}", recid) or recid in ids or
                    not isinstance(record.get("revision"), int) or record["revision"] < 1 or
                    any(not isinstance(record.get(k), str) for k in ("created_at", "updated_at"))):
                raise MemoryError("invalid_store", "Invalid id, revision or timestamp in memory.")
            ids.add(recid)
            if record.get("key"):
                if record["key"] in keys:
                    raise MemoryError("invalid_store", "Duplicate record key.")
                keys.add(record["key"])
        return data

    @contextmanager
    def writing(self):
        self.folder.mkdir(parents=True, exist_ok=True)
        token = uuid.uuid4().hex
        try:
            fd = os.open(str(self.lock), os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
        except FileExistsError as exc:
            raise MemoryError("busy", "Another writer holds this project lock. Retry after it finishes; do not remove a live lock.") from exc
        try:
            with os.fdopen(fd, "w", encoding="utf-8") as stream:
                json.dump({"pid": os.getpid(), "token": token, "created_at": utc()}, stream)
            yield
        finally:
            try:
                if read_json(self.lock).get("token") == token:
                    self.lock.unlink()
            except (OSError, MemoryError):
                pass

    def write(self, data):
        raw = (json.dumps(data, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
        if len(raw) > MAX_BYTES:
            raise MemoryError("too_large", "Project memory exceeds 10 MiB; reference large files instead.")
        fd, temp = tempfile.mkstemp(prefix=".records-", suffix=".tmp", dir=self.folder)
        try:
            with os.fdopen(fd, "wb") as stream:
                stream.write(raw)
                stream.flush()
                os.fsync(stream.fileno())
            os.replace(temp, self.path)
        finally:
            if os.path.exists(temp):
                os.unlink(temp)

    def put(self, payload, expected=0):
        payload = validate_fields(payload)
        with self.writing():
            data = self.read()
            old = next((r for r in data["records"] if payload.get("key") and r.get("key") == payload["key"]), None)
            actual = old["revision"] if old else 0
            if expected != actual:
                raise MemoryError("revision_conflict", "Expected revision %s, actual %s. Read the latest record before changing it." % (expected, actual))
            now = utc()
            record = {"id": old["id"] if old else uuid.uuid4().hex,
                      "revision": actual + 1, "created_at": old["created_at"] if old else now,
                      "updated_at": now, "sources": [], "tags": [], **payload}
            if old:
                data["records"][data["records"].index(old)] = record
            else:
                data["records"].append(record)
            self.write(data)
            return record

    def update(self, recid, payload, expected):
        payload = validate_fields(payload, partial=True)
        if not payload:
            raise MemoryError("invalid_input", "Empty update.")
        with self.writing():
            data = self.read()
            old = self.lookup(data, recid)
            if old["revision"] != expected:
                raise MemoryError("revision_conflict", "Revision changed. Read the current record before updating it.")
            merged = {**old, **payload, "revision": old["revision"] + 1, "updated_at": utc()}
            if merged.get("key") and any(r["id"] != recid and r.get("key") == merged["key"] for r in data["records"]):
                raise MemoryError("duplicate_key", "Another record has this key.")
            validate_fields({k: v for k, v in merged.items() if k in FIELDS})
            data["records"][data["records"].index(old)] = merged
            self.write(data)
            return merged

    @staticmethod
    def lookup(data, recid):
        result = next((r for r in data["records"] if r["id"] == recid), None)
        if result is None:
            raise MemoryError("not_found", "No matching record in this project.")
        return result

    def forget(self, recid, expected):
        with self.writing():
            data = self.read()
            record = self.lookup(data, recid)
            if record["revision"] != expected:
                raise MemoryError("revision_conflict", "Revision changed. Read the record before forgetting it.")
            data["records"].remove(record)
            self.write(data)
            return {"forgotten_id": recid, "retained_history": False}

    def search(self, query="", kind=None, status=None, limit=10):
        terms = query.casefold().split()
        found = []
        for record in self.read()["records"]:
            if kind and record["kind"] != kind or status and record["status"] != status:
                continue
            content = " ".join([record["title"], record["body"], *record.get("tags", [])]).casefold()
            if terms and not all(term in content for term in terms):
                continue
            preview = record["body"]
            if terms:
                pos = preview.casefold().find(terms[0])
                if pos >= 0:
                    preview = preview[max(0, pos - 100):]
            found.append({k: record[k] for k in ("id", "revision", "kind", "status", "title", "updated_at")})
            found[-1].update({"key": record.get("key"), "excerpt": preview[:500]})
        found.sort(key=lambda r: (r["updated_at"], r["id"]), reverse=True)
        return {"total": len(found), "results": found[:limit], "search_mode": "all-space-separated-substrings"}


def parser():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--root", default=os.environ.get("DUYA_MEMORY_HOME", str(Path.home() / ".duya" / "memory")))
    p.add_argument("--project", required=True, help="Stable project alias; never infer the client from a previous unrelated task.")
    commands = p.add_subparsers(dest="command", required=True)
    commands.add_parser("info")
    search = commands.add_parser("search")
    search.add_argument("--query", default="")
    search.add_argument("--kind", choices=sorted(KINDS))
    search.add_argument("--status", choices=sorted(STATUSES))
    search.add_argument("--limit", type=int, default=10)
    get = commands.add_parser("get")
    get.add_argument("--id", required=True)
    put = commands.add_parser("put")
    put.add_argument("--input", required=True, help="UTF-8 JSON file; use '-' to read stdin.")
    put.add_argument("--expect-revision", type=int, default=0)
    update = commands.add_parser("update")
    update.add_argument("--id", required=True)
    update.add_argument("--input", required=True)
    update.add_argument("--expect-revision", type=int, required=True)
    forget = commands.add_parser("forget")
    forget.add_argument("--id", required=True)
    forget.add_argument("--expect-revision", type=int, required=True)
    return p


def main():
    args = parser().parse_args()
    try:
        store = Store(args.root, args.project)
        if args.command == "info":
            result = {"root": str(store.root), "project": store.project, "path": str(store.path),
                      "exists": store.path.exists(), "record_count": len(store.read()["records"])}
        elif args.command == "search":
            if not 1 <= args.limit <= 100:
                raise MemoryError("invalid_limit", "limit must be 1–100.")
            result = store.search(args.query, args.kind, args.status, args.limit)
        elif args.command == "get":
            result = store.lookup(store.read(), args.id)
        elif args.command in ("put", "update"):
            if args.input == "-":
                raw = sys.stdin.buffer.read(MAX_BYTES + 1)
                if len(raw) > MAX_BYTES:
                    raise MemoryError("too_large", "Input exceeds 10 MiB.")
                payload = json.loads(raw.decode("utf-8-sig"))
            else:
                payload = read_json(Path(args.input))
            result = store.put(payload, args.expect_revision) if args.command == "put" else store.update(args.id, payload, args.expect_revision)
        else:
            result = store.forget(args.id, args.expect_revision)
        print(json.dumps({"ok": True, "project": store.project, "result": result}, ensure_ascii=False, indent=2))
        return 0
    except (MemoryError, OSError, UnicodeError, ValueError, TypeError) as exc:
        print(json.dumps({"ok": False, "error": getattr(exc, "code", "operation_failed"), "message": str(exc)}, ensure_ascii=False))
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
