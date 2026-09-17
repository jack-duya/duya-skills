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
        if name == 'duya-content-plan':
            content += '''
## 直接这样使用

```text
$duya-content-plan 我想讲“报价便宜不一定省钱”。从这个想法深挖一个值得讲透的判断，再发展成完整视频稿。
$duya-content-plan 这篇核心观点和正文已定，只优化开头，让准备购买的人愿意继续看。
$duya-content-plan 这篇改了几轮，越改越偏。先看我保留和否决过什么，找回真正要表达的判断，再修需要改的部分。
$duya-content-plan 用这些真实素材规划一组有区别的选题，说明为什么值得讲，并把第一条写完整。
```

给想法、材料、已有稿件或相关对话即可，不用先填写流程表。沿用已确定的方向；只有会改变核心表达或目标人群的分歧，才集中确认。只要选题就交选题，要完整稿就继续完成，不要求你另外切换命令。
'''
        if name == 'duya-learning':
            content += '''
## 直接这样使用

```text
$duya-learning 读这份课程，讲透关键方法和适用条件，给一个完整应用案例。
$duya-learning 把这些资料整理为可检索的知识库，存到我指定的 Obsidian 库，保留来源并建立有理由的双向链接。
$duya-learning 从上次保存的知识库找到相关方法，先读原笔记，再帮我解决这次问题。
```

提供文件、文件夹、可访问链接或直接贴正文即可；已有业务背景沿用。深读按“审查材料 → 提炼判断 → 应用与反例 → 整理和复用”完成，不要求用户逐阶段输入下一步。

你会拿到清楚解释、带条件的方法、完整案例及需要的知识文件。选择 Obsidian 时实际保存 Markdown、索引与内部链接；没有 Obsidian 也能拿到普通 Markdown 知识库。保存位置不明确时才确认，不覆盖同名旧笔记冒充更新。

- [查看完整教学原文](../duya/assets/learning/sample-source.md)与[完整知识包示例](../duya/assets/learning/demo-bundle.json)：来源、方法、概念、两种成稿和待确认问题。
- [Obsidian 的实际保存与再次检索](../duya/references/obsidian.md)。
- [用户教程、效果图与可下载示例库](https://github.com/jack-duya/duya-skills/blob/main/docs/量子阅读.md)。
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
