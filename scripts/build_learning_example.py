"""Build the public Quantum Reading example with the shipped storage tool."""
import argparse
import io
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
CORE = ROOT / 'skills/duya'
OUTPUT = ROOT / 'docs/learning-example'
ARCHIVE = ROOT / 'docs/quantum-reading-example.zip'
BUNDLE = CORE / 'assets/learning/demo-bundle.json'
FOLDER = '渡鸦知识库'


def build(destination):
    destination.mkdir(parents=True, exist_ok=True)
    run = subprocess.run([sys.executable, '-B', '-X', 'utf8', str(CORE / 'tools/obsidian.py'),
                          'save', '--vault', str(destination), '--folder', FOLDER,
                          '--input', str(BUNDLE)], capture_output=True, text=True, encoding='utf-8')
    if run.returncode:
        raise RuntimeError(run.stdout + run.stderr)
    bundle = json.loads(BUNDLE.read_text(encoding='utf-8'))
    (destination / '原始教学材料.md').write_bytes((CORE / 'assets/learning/sample-source.md').read_bytes())
    lines = [
        '# 量子阅读 · 可打开的示例知识库\n\n',
        '这是由渡鸦随包保存工具实际生成的教学笔记，不是客户项目或获客效果报告。'
        '包含 5 篇知识笔记、1 篇索引，以及供回查的原始教学材料。\n\n',
        '## 先看这里\n\n',
        '- 在 Obsidian 选择“打开文件夹为仓库 / Open folder as vault”，选本目录。无需额外插件。\n',
        f'- 打开 [量子阅读示例索引]({FOLDER}/量子阅读示例索引.md)。笔记中的 `[[…]]` 在 Obsidian 中成为内部链接。\n',
        '- 点击关系图可以查看笔记连接；打开某篇方法后，用局部关系图查看邻近关系。\n',
        '- 未使用 Obsidian 时，直接打开下面的 Markdown 文件即可；GitHub 不把 Wikilink 显示为普通链接。\n\n',
        '## 全部文件\n\n',
        '- [原始教学材料](原始教学材料.md)\n',
    ]
    for note in bundle['notes']:
        lines.append(f'- [{note["title"]}]({FOLDER}/{note["title"]}.md)\n')
    lines += [
        '\n## 试一次知识复用\n\n',
        '对渡鸦说：“从这个目录找到按读者处境选择内容入口的方法，读原笔记。'
        '客户现在已在问服务范围，请根据我给的服务清单写直接回复。”\n\n',
        'Agent 应读取方法正文与当前服务清单，再写回复。示例没有真实商家清单，不能从中编出任何商户能力。\n\n',
        '本目录由 `scripts/build_learning_example.py` 根据公开教学原文与知识包生成，'
        '使用普通 Markdown 和库内链接；没有私有客户资料、账户信息或预装 `.obsidian` 配置。\n',
    ]
    (destination / 'README.md').write_bytes(''.join(lines).encode('utf-8'))
    return {p.relative_to(destination).as_posix(): p.read_bytes()
            for p in sorted(destination.rglob('*')) if p.is_file()}


def archive_bytes(files):
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, 'w', compression=zipfile.ZIP_DEFLATED) as package:
        for name, data in sorted(files.items()):
            item = zipfile.ZipInfo('duya-quantum-reading-example/' + name, (2026, 9, 13, 0, 0, 0))
            item.compress_type = zipfile.ZIP_DEFLATED
            item.external_attr = 0o100644 << 16
            package.writestr(item, data)
    return buffer.getvalue()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    with tempfile.TemporaryDirectory(prefix='duya-learning-example-') as temporary:
        expected = build(Path(temporary) / 'example')
    if args.check:
        actual = {p.relative_to(OUTPUT).as_posix(): p.read_bytes()
                  for p in OUTPUT.rglob('*') if p.is_file()}
        if actual != expected or not ARCHIVE.is_file() or ARCHIVE.read_bytes() != archive_bytes(expected):
            raise SystemExit('Learning example differs from the current bundle or storage tool; rebuild it.')
        print('PASS: example notes and downloadable ZIP match the actual storage tool output.')
    else:
        # Only create/update this dedicated generated directory; never delete unknown files.
        for name, data in expected.items():
            output = OUTPUT / name
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_bytes(data)
        ARCHIVE.write_bytes(archive_bytes(expected))
        print(f'Generated {len(expected)} example files and reproducible ZIP.')


if __name__ == '__main__':
    main()
