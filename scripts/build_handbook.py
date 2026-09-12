"""Build the public reading edition from the maintained knowledge chapters."""
from pathlib import Path
import os
import re
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
KNOWLEDGE = ROOT / "skills/duya/knowledge"
OUTPUT = ROOT / "books/渡鸦-商业与线索获客手册.md"
GROUPS = [
    ("商业与获客判断", "commercial", [
        "customer-demand", "positioning-buying-reasons", "product-paths",
        "acquisition-design", "content-judgment-bridge", "diagnosis-playbook", "worked-cases"]),
    ("内容与传播", "content", [
        "content-task-map", "attention-emotion", "reference-transfer", "short-video-craft",
        "xhs-graphic-craft", "wechat-longform", "live-craft", "platform-adaptation"]),
    ("矩阵与线上团队", "operations", [
        "matrix-decisions", "batch-production", "team-design", "recruit-train-incentives", "operations-cases"]),
    ("量子阅读与长期学习", "learning", ["quantum-reading", "method-integration", "learning-cases"]),
]


def rebase_links(body, source):
    def replace(match):
        target = match.group(2)
        parts = urlsplit(target)
        if parts.scheme or target.startswith("//"):
            return match.group(0)
        destination = (source.parent / unquote(parts.path)).resolve() if parts.path else source
        relative = Path(os.path.relpath(destination, OUTPUT.parent)).as_posix()
        if parts.fragment:
            relative += "#" + parts.fragment
        return match.group(1) + relative + ")"
    return re.sub(r"(\]\()([^\s)]+)\)", replace, body)


def render():
    parts = [
        "# 渡鸦 · 商业与线索获客手册\n\n",
        "[返回主页](../README.md) · [怎样使用渡鸦](../docs/新手入门.md) · "
        "[知识库导航](../skills/duya/knowledge/INDEX.md)\n\n",
        "这份手册把 duya-skills 的 23 篇专业知识合为连续阅读版。"
        "先理解客户为什么买，再决定内容怎样讲、渠道怎样做、团队怎样运转。"
        "日常使用渡鸦时无需先读完手册，直接提出问题即可。\n\n",
        "内容包括实践方法、适用条件、改写示例与反例。课程案例与静态示例不代表本产品的实际运行成绩。"
        "出处见[来源说明](../skills/duya/knowledge/SOURCES.md)，"
        "理论与证据边界见[设计依据](../skills/duya/knowledge/design-basis.md)。\n\n",
        "此阅读版由 `scripts/build_handbook.py` 从知识库生成；维护时先修改知识条目，再生成手册，避免两份方法不一致。\n\n",
        "## 阅读目录\n\n",
    ]
    chapters = []
    for group_index, (name, folder, names) in enumerate(GROUPS, 1):
        parts.append(f"**{group_index}. {name}**\n\n")
        for stem in names:
            source = KNOWLEDGE / folder / (stem + ".md")
            body = source.read_text(encoding="utf-8")
            title = body.splitlines()[0].lstrip("# ")
            anchor = "chapter-" + stem
            parts.append(f"- [{title}](#{anchor})\n")
            chapters.append((group_index, name, source, title, anchor, body))
        parts.append("\n")
    previous_group = None
    for group_index, name, source, title, anchor, body in chapters:
        if group_index != previous_group:
            parts.append(f"\n---\n\n## 第{group_index}部分 · {name}\n\n")
            previous_group = group_index
        relative = Path(os.path.relpath(source, OUTPUT.parent)).as_posix()
        body = "\n".join(body.splitlines()[1:]).lstrip()
        body = rebase_links(body, source)
        lines = []
        fence = False
        for line in body.splitlines():
            if line.startswith("```"):
                fence = not fence
            heading = re.match(r"^(#{1,6}) (.*)", line) if not fence else None
            if heading:
                line = "#" * min(6, len(heading.group(1)) + 2) + " " + heading.group(2)
            lines.append(line)
        parts.append(f'<a id="{anchor}"></a>\n\n### {title}\n\n[单篇阅读与维护]({relative})\n\n')
        parts.append("\n".join(lines).rstrip() + "\n\n")
    return "".join(parts).rstrip() + "\n"


if __name__ == "__main__":
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(render(), encoding="utf-8")
    print("Generated reading edition: 23 chapters.")
