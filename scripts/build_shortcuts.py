"""Build thin, real Skill entrypoints from Duya's single shortcut registry."""
import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CORE = ROOT / 'skills/duya'


def generated_files():
    entries = json.loads((CORE / 'references/shortcuts.json').read_text(encoding='utf-8'))['entries']
    files = {}
    for entry in entries:
        name, title = entry['name'], entry['title']
        content = f'''---
name: {name}
description: {json.dumps(entry['description'], ensure_ascii=False)}
metadata:
  duya_component: true
---

# 渡鸦 · {title}

这是渡鸦的直接快捷入口，与同级 `duya` 共用主人格、业务知识和工具。

1. 实际读取 [渡鸦主提示词](../duya/SKILL.md)，沿用墨涅斯判断、当前对话背景与用户已经确定的范围。
2. 本轮已选择“{title}”，继续读取并执行 [对应工作方法](../duya/{entry['guide']})。直接完成用户要的判断、稿件、文件或动作，不把推荐另一个命令当作交付。
3. 只有本轮确有必要的前置判断或后续制作，才按主提示词组合其他能力；不用重复询问已有背景。

共同核心位于当前快捷入口目录旁的 `duya`，按实际安装路径解析上述链接，不依赖开发者电脑上的绝对地址。若核心缺失，说明当前只装了快捷入口，需要安装完整渡鸦包；先用宿主的技能清单定位已经存在的 `duya`，不要假装已经读到方法或工具。

示例：`{entry['example']}`
'''
        files[ROOT / 'skills' / name / 'SKILL.md'] = content
        files[ROOT / 'skills' / name / 'agents/openai.yaml'] = (
            'interface:\n'
            f'  display_name: {json.dumps("渡鸦 · " + title, ensure_ascii=False)}\n'
            f'  short_description: {json.dumps(entry["description"].split("。")[0] + "。", ensure_ascii=False)}\n'
            f'  default_prompt: {json.dumps("用 $" + name + "，" + entry["example"], ensure_ascii=False)}\n'
            'policy:\n  allow_implicit_invocation: true\n')
    package = {'schema_version':1, 'version':(ROOT / 'VERSION').read_text().strip(),
               'repository':'jack-duya/duya-skills', 'branch':'main',
               'components':['duya'] + [e['name'] for e in entries]}
    files[CORE / 'package.json'] = json.dumps(package, ensure_ascii=False, indent=2) + '\n'
    return files


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    mismatched = []
    for path, content in generated_files().items():
        if args.check:
            if not path.is_file() or path.read_text(encoding='utf-8') != content:
                mismatched.append(str(path.relative_to(ROOT)))
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(content.encode('utf-8'))
    if mismatched:
        raise SystemExit('Shortcut files out of sync: ' + ', '.join(mismatched))
    print('PASS: 12 business shortcuts and 1 updater entry match their registry.' if args.check
          else 'Generated 12 business shortcuts, 1 updater entry and package metadata.')


if __name__ == '__main__':
    main()
