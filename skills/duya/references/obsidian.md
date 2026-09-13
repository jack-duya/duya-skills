# 将量子阅读保存到 Obsidian

这项能力把已经整理好的知识写成真实 Markdown 笔记、索引和笔记链接。它负责存储，不代替阅读、判断、来源核实或方法迁移。用户没有选择知识库时，先确认保存位置；不要因为发现了某个库就自动向里面写入。

## 查看已有库候选

```text
python -B -X utf8 "<duya目录>/tools/obsidian.py" discover
```

只读取 Obsidian 的注册记录：Windows 的 `%APPDATA%/obsidian/obsidian.json`、macOS 的 `~/Library/Application Support/obsidian/obsidian.json`、Linux 的 `$XDG_CONFIG_HOME/obsidian/obsidian.json` 或 `~/.config/obsidian/obsidian.json`。不扫描磁盘、不安装 Obsidian、不修改注册记录。结果只是候选，可能已失效，不等于用户已授权写入某个库。

## 准备输入

将已完成的阅读产物整理成 UTF-8 JSON。不要为了填字段补造资料、理论、效果或笔记之间的关系。

```json
{
  "schema_version": 1,
  "index_title": "本次阅读索引",
  "notes": [
    {
      "id": "source-note",
      "title": "来源-用户提供的材料",
      "kind": "source",
      "body": "这里放已经完成、经过核对的阅读正文。",
      "sources": [{"title": "用户提供的材料", "locator": "已实际阅读的章节"}],
      "boundaries": ["这里只保留材料明确支持的结论。"],
      "tags": ["量子阅读", "来源"],
      "links": [{"target": "method-note", "reason": "填写材料支持这条方法的具体依据。"}]
    },
    {
      "id": "method-note",
      "title": "方法-已完成的业务判断",
      "kind": "method",
      "body": "这里放方法的操作步骤、适用条件和反例。",
      "sources": [{"title": "用户提供的材料", "locator": "对应原文位置"}],
      "links": [{"target": "source-note", "reason": "回查原始依据。"}]
    }
  ]
}
```

上述文字仅说明字段格式，不能直接作为用户材料的分析结果。完整可运行示例见 [演示 bundle](../assets/learning/demo-bundle.json)。

`title` 会生成笔记最外层的一级标题。新写的方法正文 `body` 通常从引言或二级标题开始，避免重复两个同名一级标题；保存原文快照时可以保留原题，工具不会擅自删改原文。

字段约定：

| 字段 | 要求 |
|---|---|
| `schema_version` | 固定 `1` |
| `index_title` | 可选；指定时生成同名 `.md`。省略时生成带内容摘要的“量子阅读索引”，避免不同批次共用一个索引文件 |
| `notes` | 1—100 条笔记 |
| `id` | 同批唯一的小写英文字母开头标识；可含数字和短横线，最多 64 字符 |
| `title` | 真实笔记标题，同时作为文件名；不要带 `.md`。保留中文、空格与 Unicode；不接受 Windows 非法字符或会破坏 wikilink 的 `[]#^` |
| `kind` | `source`、`concept`、`method`、`case`、`application`、`question` |
| `body` | 已完成的 Markdown 正文，不自动改写，单条最多 300,000 字符 |
| `sources` | 至少一个已提供来源；每项 `title` 必填，`url`、`path`、`locator` 可选。标题型来源不等于已经在线核实；本工具不联网 |
| `boundaries` | 可选字符串数组，记录已知适用条件、不确定性、缺失证据；不填时如实标记未提供独立边界字段 |
| `tags` | 可选数组；中文、英文、数字、下划线、短横线及 `/` 层级，不加 `#`、空格，不用纯数字标签 |
| `links` | 可选同批关系；每项只有 `target`（已存在的同批 `id`）、`reason`（依据）。不根据名称相似自动生成关系 |
| `existing_links` | 可选既有笔记关系；每项只有 `path`（库根相对 `.md` 路径）、`reason`。目标必须真实存在，不能用猜测的笔记名 |

例如已有笔记关系：

```json
{"path":"已有知识/购买理由.md","reason":"正文第二节补充了这次方法的购买决策条件。"}
```

路径使用正斜杠，以库根为基准。正文中如果已经含有 wikilink，同样必须能定位到本批计划笔记或库内真实文件；未核实的标题锚点、块锚点不直接通过。更稳妥的做法是把关系集中写进 `links` 与 `existing_links`。

## 保存

```text
python -B -X utf8 "<duya目录>/tools/obsidian.py" save --vault "<用户明确选择的现有目录>" --folder "渡鸦知识库" --input "<bundle.json>"
```

如果用户明确指定了一个尚不存在的普通导出目录，例如“存到 `D:/我的资料/读书笔记`”，Agent 可以先按该地址创建普通目录，再调用 `save`。不需要让用户手工建目录，也不需要重复确认已经明确的位置。工具自身要求 `--vault` 已存在，不会自动创建或注册新的 Obsidian 库配置。

生成结构：

```text
用户的知识库/
└── 渡鸦知识库/
    ├── 来源-用户提供的材料.md
    ├── 方法-已完成的业务判断.md
    └── 本次阅读索引.md
```

实际链接类似 `[[渡鸦知识库/方法-已完成的业务判断|方法-已完成的业务判断]]`。索引链接本批全部笔记，每条关系保留输入提供的依据。来源、适用边界与关系附在笔记正文之后；未填写的作者、课程内容或实际业务效果不会自动出现。

工具不依赖 MCP、Obsidian 插件或联网，也不修改 `.obsidian` 配置。普通现有目录也能导出；返回 `confirmed_obsidian: false` 和 `mode: markdown-export`，如实说明尚未确认这是 Obsidian 库。之后可由用户在 Obsidian 中打开该文件夹。

## 冲突和保存结果

- 文件不存在：新建。
- 文件存在且内容逐字节一致：保持原样，重复执行幂等。
- 任一文件已有不同内容：整批在写入前停止，保留已有笔记；不要擅自追加编号或覆盖。用户要更新旧知识时，先读取旧文并明确合并内容，再进行单独的已授权编辑。
- 中途写入失败：只回退本次新建文件，不删除已有笔记；如果新建文件已被其他人改变或回退失败，明确报告遗留文件，不声称完整恢复。

返回 JSON 包含入口、每个文件的相对路径、SHA-256、创建或复用状态。工具实际读回所有文件核对，只有通过后才返回 `verified: true`。仍需区分“文件已保存”“Obsidian 已打开”“知识已经被理解和验证”，不能把三件事混为一谈。

边界：不扫描全库、不自动同步、不保存用户库路径到技能、不修改既有总索引、不写入 `.git`、`.obsidian` 或当前技能安装目录，不跟随符号链接或 Windows reparse point。用户个人记忆 `~/.duya/memory` 与此 Markdown 知识库是两种独立存储。
