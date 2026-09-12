"""Check packaging and documentation without network or user configuration changes."""
from pathlib import Path
from collections import Counter
import ast
import json
import re
import sys
import unicodedata
from urllib.parse import unquote, urlsplit
import xml.etree.ElementTree as ET
from build_handbook import render, OUTPUT

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "skills/duya"
errors = []


def require(condition, message):
    if not condition:
        errors.append(message)


def readable(path):
    return path.relative_to(ROOT).as_posix()


def prose(text):
    return re.sub(r"^(`{3,}|~{3,}).*?^\1\s*$", "", text, flags=re.M | re.S)


def anchors(text):
    text = prose(text)
    result = set(re.findall(r'<a\s+(?:id|name)="([^"]+)"', text))
    counts = Counter()
    for title in re.findall(r"^#{1,6}\s+(.+?)\s*#*\s*$", text, re.M):
        title = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", title)
        slug = "".join(c for c in title.lower() if c in "-_ " or not unicodedata.category(c).startswith(("P", "S")))
        slug = slug.replace(" ", "-")
        number = counts[slug]
        counts[slug] += 1
        result.add(slug + (f"-{number}" if number else ""))
    return result


files = [p for p in ROOT.rglob("*") if p.is_file() and not any(
    part in {".git", "__pycache__", ".test-output", "node_modules"} for part in p.relative_to(ROOT).parts)]
markdown = [p for p in files if p.suffix == ".md"]
texts = {p: p.read_text(encoding="utf-8") for p in markdown}
anchor_cache = {p: anchors(t) for p, t in texts.items()}
links = 0
for source, text in texts.items():
    for target in re.findall(r"\]\(([^\s)]+)\)", prose(text)):
        parts = urlsplit(target)
        if parts.scheme or target.startswith("//"):
            continue
        destination = (source.parent / unquote(parts.path)).resolve() if parts.path else source
        label = readable(source)
        links += 1
        require(destination.is_relative_to(ROOT), f"Link outside repository: {label}")
        require(destination.exists(), f"Missing link in {label}: {target}")
        if source.is_relative_to(SKILL):
            require(destination.is_relative_to(SKILL), f"Skill dependency outside portable folder: {label}: {target}")
        if parts.fragment and destination in anchor_cache:
            require(unquote(parts.fragment) in anchor_cache[destination], f"Missing anchor in {label}: {target}")
    require(not re.search(r"[DF]:[\\/]自营|C:[\\/]Users[\\/]Administrator", text, re.I), f"Developer path in {readable(source)}")

require(len(list(SKILL.parent.rglob("SKILL.md"))) == 1, "Expected exactly one registered SKILL.md")
require(len(list((SKILL / "internal").glob("*/GUIDE.md"))) == 12, "Expected 12 internal guides")
knowledge = [p for area in ["commercial", "content", "operations", "learning"] for p in (SKILL / "knowledge" / area).glob("*.md")]
require(len(knowledge) == 23, "Expected 23 knowledge chapters")
require(texts[SKILL / "SKILL.md"].startswith("---\nname: duya\n"), "Main Skill frontmatter/name mismatch")
require(not (SKILL / "knowledge/source-texts").exists(), "Raw source archive must stay outside public package")
require(not (SKILL / "knowledge/source-images").exists(), "Raw course slides must stay outside public package")

version = (ROOT / "VERSION").read_text(encoding="utf-8").strip()
manifests = {}
for path in files:
    if path.suffix == ".json":
        try:
            manifests[path] = json.loads(path.read_text(encoding="utf-8"))
        except (ValueError, UnicodeError):
            errors.append("Invalid JSON: " + readable(path))
    if path.suffix == ".py":
        try:
            ast.parse(path.read_text(encoding="utf-8"), filename=readable(path))
        except SyntaxError as exc:
            errors.append(f"Python syntax in {readable(path)}:{exc.lineno}")
    if path.suffix == ".svg":
        try:
            document = ET.parse(path)
            require(document.getroot().attrib.get("viewBox") == "0 0 1200 900", "Unexpected SVG dimensions: " + readable(path))
        except ET.ParseError:
            errors.append("Invalid SVG: " + readable(path))

plugin = manifests.get(ROOT / ".claude-plugin/plugin.json", {})
marketplace = manifests.get(ROOT / ".claude-plugin/marketplace.json", {})
require(plugin.get("name") == "duya" and plugin.get("version") == version, "Plugin name/version mismatch")
require(marketplace.get("name") == "duya-skills", "Marketplace name mismatch")
entries = marketplace.get("plugins", [])
require(len(entries) == 1 and entries[0].get("source") == "./" and entries[0].get("version") == version, "Marketplace entry mismatch")
root_mcp = manifests.get(ROOT / ".mcp.json", {})
require(root_mcp == manifests.get(SKILL / ".mcp.json"), "MCP example differs from root configuration")
require(root_mcp.get("mcpServers", {}).get("moyaclaw-template-mcp") == {
    "type": "http", "url": "http://43.242.194.25:3170/mcp"}, "MCP endpoint/transport mismatch")
require((ROOT / "LICENSE").exists(), "Missing LICENSE")
require((ROOT / "legacy/企业阿米巴模式架构师.txt").exists(), "Missing preserved legacy file")
require(OUTPUT.exists() and OUTPUT.read_text(encoding="utf-8") == render(), "Handbook out of sync: run python scripts/build_handbook.py")

if errors:
    print("FAILED:")
    for error in errors:
        print("- " + error)
    sys.exit(1)
print(f"PASS: {len(markdown)} Markdown files, {links} local links and anchors; 1 Skill, 12 guides, 23 knowledge chapters.")
print("PASS: portable dependencies, JSON/manifests/MCP, Python syntax, SVG XML, public source boundary, generated handbook.")
