# duya-skills · 渡鸦

简体中文 | [English](README.en.md)

> 面向经营者与流量团队的商业与线索获客 Skills。把你的生意、素材和卡点交给墨涅斯，拿到有依据的判断、能执行的方案和能直接用的内容。

[![Version](https://img.shields.io/badge/version-0.3.0-6D28D9.svg?style=flat-square)](VERSION)
[![Skills](https://img.shields.io/badge/Skills-1%20入口%20%2F%2012%20能力-7C3AED.svg?style=flat-square)](docs/新手入门.md#skill-全目录)
[![Knowledge](https://img.shields.io/badge/知识库-23%20篇-0F766E.svg?style=flat-square)](skills/duya/knowledge/INDEX.md)
[![License](https://img.shields.io/badge/license-CC%20BY--NC%204.0-16A34A.svg?style=flat-square)](LICENSE)

**支持：Codex、Claude Code、Cursor，以及能够加载完整 Skills 目录的 Agent。** 不同客户端的入口与 MCP 配置方式见[安装指南](docs/安装指南.md)。

duya-skills 由[渡鸦](https://github.com/jack-duya)维护。以商业与获客知识为专业基础，用**万流归因诀：由果推因、由因解果**看清真正的问题，再完成内容创作、矩阵安排与团队设计。当前提供 **1 个自然对话入口、12 项内部能力和 23 篇专业知识**。

**v0.3.0 更新：** 公众号能力加入写作后排版与已有文章纯排版，提供 **12 套原创主题**、可复制正文 HTML、浏览器预览和检查报告。商业判断、模板研究、矩阵团队与本地记忆继续沿用同一个入口。[查看排版教程](docs/公众号排版.md) · [浏览 12 套主题](https://jack-duya.github.io/duya-skills/wechat-gallery/)

[快速开始](#快速开始) · [安装](#安装) · [能力一览](#能力一览) · [公开方法手册](#公开方法手册) · [完整使用教程](docs/新手入门.md) · [更新记录](CHANGELOG.md)

![渡鸦的任务判断与能力组合](docs/skill-link-map.svg)

## duya-skills 解决什么问题

直接描述你在做什么、卡在哪里，或把现有作品交过来。墨涅斯会利用已知背景，判断该先理清原因还是直接制作，完成本轮需要的成果。你不用先学习内部模块，也不用为了提问补齐一套业务报表。

| 真实处境 | 你会得到 |
|---|---|
| 有产品，却不知道该找谁、客户为什么愿意买 | 客户处境、购买理由、定位和产品承接建议 |
| 想从零做线上获客，不知道选平台还是先搞矩阵 | 与生意和资源匹配的平台、内容形式与起步安排 |
| 发了不少作品，播放有了，合适咨询却不多 | 对人群、内容与路径的判断，及具体能改的地方 |
| 觉得账号不够，准备买号、加设备、继续铺量 | 重新判断限制，比较自营、合作分发和内容改进 |
| 小红书写得像说明书，短视频讲得像上课 | 有场景、有看点的图文、标题、完整脚本或文章 |
| 公众号文章已经写好，排版费时又没有统一风格 | 按文章选择主题，保留原文，生成可预览和复制的排版 |
| 找到了爆款，却不知道怎么改成自己的内容 | 真实模板检索、机制拆解、相邻赛道迁移与成稿 |
| 老板天天改稿、员工不知道拍什么 | 矩阵生产方式、岗位分工、取材和训练安排 |
| 读了很多课，知识还是接不到业务上 | 量子阅读、方法整合、适用条件与可恢复的记录 |

## 快速开始

安装后，在 Codex 中直接输入：

```text
$duya 我做本地装修，施工视频同行看得多，业主咨询少。
我想增加账号，但老板不擅长长口播。
帮我判断先解决什么，再给一条现有素材能拍的视频。
```

你会得到当前判断、选择理由和实际稿件。已有材料会继续沿用；缺少信息时，只补问真正影响本轮工作的部分。

已经知道要做什么，就直接把任务说清楚：

```text
$duya 帮我找家政保洁的参考模板，写一篇小红书图文。
$duya 这个短视频开头太像讲课，改成业主愿意听的，不改事实。
$duya 给我写一篇公众号文章，讲小团队为什么不该只用产量考核剪辑。
$duya 这篇文章不改文字，自动选主题，输出可复制到公众号的 HTML：……
$duya 三家门店都有现场素材，老板和一位剪辑怎么做内容矩阵？
$duya 读这份课程，提炼能用于我生意的方法，并说明哪些情况不适用。
```

Claude Code 直接安装 Skill 后使用 `/duya`；通过下方插件市场安装后使用 `/duya:duya`。其他客户端使用其 Skill 选择方式。12 项内部能力都由同一入口完成，无需再安装 12 个独立命令。

## 能力一览

| 工作目标 | 对应能力 | 常见产出 |
|---|---|---|
| 找对客户，说明为什么值得买 | [客户与商业定位](skills/duya/internal/duya-positioning/GUIDE.md) | 客户处境、购买理由、定位与产品取舍 |
| 从零开始或调整已有获客路线 | [获客体系搭建](skills/duya/internal/duya-acquisition/GUIDE.md) | 平台、形式、准备工作与起步方案 |
| 排查播放、咨询、账号或投入问题 | [获客问题诊断](skills/duya/internal/duya-diagnose/GUIDE.md) | 原因判断、条件与实际改法 |
| 想清楚接下来讲什么 | [选题与内容规划](skills/duya/internal/duya-content-plan/GUIDE.md) | 泛垂直、信任、购买判断与咨询选题 |
| 研究爆款和相邻赛道 | [模板与内容研究](skills/duya/internal/duya-research/GUIDE.md) | 模板正文、结构机制、迁移条件 |
| 写得好看，也让客户看得懂 | [线索短视频](skills/duya/internal/duya-video/GUIDE.md) | 完整脚本、开头、镜头与素材安排 |
| 写标题、单图、笔记与搜索内容 | [小红书与图文](skills/duya/internal/duya-xhs/GUIDE.md) | 标题、封面、正文和必要互动设计 |
| 用长文讲清问题，完成写作与排版 | [公众号写作与排版](skills/duya/internal/duya-wechat/GUIDE.md) | 完整文章、12 套主题、正文 HTML、预览与检查报告 |
| 设计直播内容或改已有回放 | [获客直播](skills/duya/internal/duya-live/GUIDE.md) | 主题串、讲稿、过渡与具体修改 |
| 把内容做成可持续的分发与生产 | [矩阵与批量生产](skills/duya/internal/duya-matrix/GUIDE.md) | 自营/合作选择、图文与短视频生产安排 |
| 先招谁，谁来判断，怎样培养 | [线上获客团队](skills/duya/internal/duya-team/GUIDE.md) | 角色、工作样本、交接与训练方案 |
| 理解课程，积累可复用的方法 | [量子阅读与学习](skills/duya/internal/duya-learning/GUIDE.md) | 深读、反例、方法整合与长期保存 |

每项能力的适用时机、可复制的提问和主要结果，见[新手入门与 Skill 全目录](docs/新手入门.md#skill-全目录)。

### 公众号写作与排版

可以写好文章后一起排版，也可以把已定稿的文章直接交过来。12 套原创主题分别适合简报、方案、故事、观点、教程、问答、品牌、清单、访谈与长读，差异包括构图、章节、引用、字体和阅读节奏。没有指定风格时，渡鸦根据文章选一套直接完成。

一次排版生成三个文件：**正文 `.html`、预览 `.preview.html`、检查报告 `.report.json`**。打开预览页复制正文，再粘贴到公众号编辑器；复制按钮不可用时可选中正文手动复制。发布前仍需在编辑器和手机预览中检查样式、图片与表格。

本地排版工具使用 **Python 3.10+ 标准库**，无需额外安装 pip 依赖；客户端需要文件读写和 Python 执行能力。你仍然只使用 `duya` 一个入口。

[查看完整排版教程](docs/公众号排版.md) · [在线比较 12 套主题](https://jack-duya.github.io/duya-skills/wechat-gallery/)

## 安装

### 推荐：Codex、Claude Code、Cursor 与其他支持 Skills 的 Agent

在终端执行：

```bash
npx -y skills add jack-duya/duya-skills -g --skill duya
```

按提示选择正在使用的 Agent。安装后重新开启对话，选中 `duya`，或用客户端对应的命令开始。

该命令安装完整 Skill、知识库与工具。**模板 MCP 需要单独添加到客户端**，配置只需一个 HTTP 地址，步骤见[安装指南](docs/安装指南.md#模板-mcp-配置)。不配置在线模板库，也可以使用本地知识完成判断和创作。

### Claude Code 插件市场

希望将 Skill 与模板 MCP 作为插件一起加载时，可以使用：

```bash
claude plugin marketplace add jack-duya/duya-skills
claude plugin install duya@duya-skills
```

安装后重新打开会话，用 `/duya:duya` 提问。插件包含同一个主入口、全部内部能力与知识，以及模板库 MCP 配置。

完整步骤、成功检查和常见故障见[安装指南](docs/安装指南.md)。

### 更新

通过 Skills CLI 安装时，可以重新执行安装命令，只选择 `duya`；提示已有安装时确认更新此项即可：

```bash
npx -y skills add jack-duya/duya-skills -g --skill duya
```

插件市场的更新方式见[更新与卸载](docs/安装指南.md#更新与卸载)。你的项目记忆默认在 `~/.duya/memory/`，独立于安装目录。更新完成后开启新对话。变更内容见[版本记录](CHANGELOG.md)。

## duya-skills 怎样工作

```text
真实问题、材料或明确的制作任务
             ↓
墨涅斯读取已知背景，判断本轮需要什么
             ↓
需要时重新定义问题，按需读取专业方法与模板
             ↓
组合有关能力，完成判断、方案或成稿
             ↓
沿用你的补充与纠正；有必要时保存到本地
```

万流归因诀帮助从结果回到原因，再从原因选择解法；商业与获客知识提供判断依据。只改标题就直接改标题，确实需要扩矩阵就设计扩张。没有每次必须走完的固定链路。

## 知识库与本地记录

公开包包含 **23 篇详细知识**，覆盖商业判断、内容表达、矩阵团队与方法学习。

- 查看完整范围与导航：[专业知识库](skills/duya/knowledge/INDEX.md)。
- 理解内核：[墨涅斯的判断](skills/duya/references/monies-persona.md)与[万流归因诀](skills/duya/references/wanliu-kernel.md)。
- 查看来源及证据边界：[来源说明](skills/duya/knowledge/SOURCES.md)。
- 找模板：直接提问，Agent 可调用渡鸦图文模板库，获取正文与图片链接。
- 保留重要背景：说“记住这个决定”“接着上次”“把这个偏好改掉”，支持本地文件工具的环境可以实际保存、恢复和修正。

记忆默认保存在你自己的 `~/.duya/memory/`，按项目区分。你给了结果就利用，没给就没有；普通使用不要求登记作品、线索和成交，也没有作业入口。具体能力见[记忆说明](skills/duya/references/memory.md)。

## 公开方法手册

把可复用知识整理为一份适合连续阅读的手册：

- [Markdown 阅读版](books/渡鸦-商业与线索获客手册.md)：商业、内容、矩阵团队与学习方法，含条件、案例与反例。
- [实际使用案例](docs/使用案例.md)：从用户问题到判断、稿件与组织安排。

手册方便阅读，Skill 按任务读取具体知识。原始课程全文、客户资料和个人记忆不随公开包发布。

![渡鸦的知识组织与长期学习](docs/knowledge-pipeline.svg)

## 共同贡献者

由[渡鸦](https://github.com/jack-duya)维护。欢迎用真实问题、具体改稿和可核验的案例帮助完善这套方法；贡献方式见 [CONTRIBUTING.md](CONTRIBUTING.md)。

页面与教程结构参考 [dontbesilent2025/dbskill](https://github.com/dontbesilent2025/dbskill)，感谢其公开分享。渡鸦的业务定位、使用方式、文档与图示已重新编写，来源关系见[致谢与引用](NOTICE.md)。

## 作者与支持

作者：**渡鸦 · jack-duya** · [GitHub 主页](https://github.com/jack-duya)

使用问题和改进建议，可[提交 Issue](https://github.com/jack-duya/duya-skills/issues)。描述你给了什么材料、哪一段不符合预期，以及希望怎样改变即可；公开反馈前请隐去客户隐私。

商业使用或合作授权，请通过 GitHub 主页所列联系方式联系渡鸦。

## 许可证

本项目中渡鸦拥有权利的内容采用 [CC BY-NC 4.0](LICENSE)。

- 允许遵守许可证条件的学习、研究、分享、修改和非商业使用。
- 分享或改编时保留来源署名、许可证链接，并说明修改。
- 商业用途请联系渡鸦获得授权；第三方资料的权利仍属于相应权利人。

Skills 提供判断与执行方法，内容质量、线索质量和经营结果应分别判断。模板表现与静态案例不构成获客效果保证。
