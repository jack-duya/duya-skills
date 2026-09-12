# duya-skills · Duya

[简体中文](README.md) | English

> Business and lead acquisition Skills for business owners and content teams. Give Monies your business context, materials, or current obstacle, and get a reasoned decision, a practical plan, or finished content.

[![Version](https://img.shields.io/badge/version-0.2.0-6D28D9.svg?style=flat-square)](VERSION)
[![Capabilities](https://img.shields.io/badge/1%20entry-12%20capabilities-7C3AED.svg?style=flat-square)](docs/新手入门.md#skill-全目录)
[![License](https://img.shields.io/badge/license-CC%20BY--NC%204.0-16A34A.svg?style=flat-square)](LICENSE)

**For Codex, Claude Code, Cursor, and Agents that can load complete Skill directories.** Detailed methods and the full tutorial are currently in Chinese.

Maintained by [Duya](https://github.com/jack-duya). The professional foundation is business and lead acquisition knowledge. The Wanliu reasoning method works backward from an observed result to plausible causes, then turns that understanding into action. The package includes **one conversational entry, 12 internal capabilities, and 23 knowledge documents**.

**v0.2.0:** Rebuilt business and acquisition methods, detailed knowledge, a real template MCP, matrix and team design, reading and learning, and editable local project memory.

[Quick start](#quick-start) · [Installation](#installation) · [Capabilities](#capabilities) · [Public handbook](#public-handbook) · [Full tutorial](docs/新手入门.md) · [Changes](CHANGELOG.md)

![Duya task and capability map](docs/skill-link-map.svg)

## What duya-skills helps with

| Your situation | What you get |
|---|---|
| You have a product but cannot explain who needs it or why they would buy | Customer situations, buying reasons, positioning, and product fit |
| You want to start acquiring customers online | Platform and format choices, preparation, and a practical starting plan |
| Content gets views but few suitable inquiries | A diagnosis and concrete changes to audience, content, or the acquisition path |
| You want more accounts, equipment, or distribution | A comparison of actual constraints and suitable ways to expand |
| Your writing sounds generic or overly technical | Finished image posts, short-video scripts, headlines, or articles |
| You found popular content but cannot adapt it | Template retrieval, mechanism analysis, and a grounded adaptation |
| The owner rewrites everything and staff do not know what to film | Roles, material collection, production, and training arrangements |
| Courses and previous decisions are difficult to reuse | Reading, method integration, and recoverable local records |

## Quick start

After installing, ask in Codex:

```text
$duya I run a local renovation company. Our construction videos attract other
contractors, but few homeowners ask about our services. I want more accounts,
but the owner dislikes long talking-head recordings. Diagnose what to improve
first and write one video we can produce with our existing material.
```

For a specific task, ask directly:

```text
$duya Find a cleaning-service template and write a Xiaohongshu image post.
$duya Rewrite this video opening without changing the facts.
$duya Design content production for three stores and one editor.
$duya Read this course and extract methods that apply to my business.
```

Claude Code direct Skill installation uses `/duya`; marketplace installation uses `/duya:duya`. Internal capabilities are methods selected by the entry, not 12 separate commands.

## Capabilities

| Task | Capability |
|---|---|
| Customers, buying reasons, and product fit | [Positioning](skills/duya/internal/duya-positioning/GUIDE.md) |
| Build an online acquisition approach | [Acquisition](skills/duya/internal/duya-acquisition/GUIDE.md) |
| Diagnose content, inquiry, or resource problems | [Diagnosis](skills/duya/internal/duya-diagnose/GUIDE.md) |
| Plan topics and complementary content | [Content planning](skills/duya/internal/duya-content-plan/GUIDE.md) |
| Research and adapt templates | [Research](skills/duya/internal/duya-research/GUIDE.md) |
| Write lead-oriented short videos | [Video](skills/duya/internal/duya-video/GUIDE.md) |
| Write headlines and image posts | [Xiaohongshu](skills/duya/internal/duya-xhs/GUIDE.md) |
| Develop a complete long-form argument | [WeChat articles](skills/duya/internal/duya-wechat/GUIDE.md) |
| Plan or improve a livestream | [Livestreaming](skills/duya/internal/duya-live/GUIDE.md) |
| Organize scalable content and distribution | [Matrix production](skills/duya/internal/duya-matrix/GUIDE.md) |
| Design roles, hiring samples, and training | [Teams](skills/duya/internal/duya-team/GUIDE.md) |
| Read, compare, and retain useful methods | [Learning](skills/duya/internal/duya-learning/GUIDE.md) |

See the [full capability directory](docs/新手入门.md#skill-全目录) for examples and expected deliverables.

## Installation

### Skills CLI

```bash
npx -y skills add jack-duya/duya-skills -g --skill duya
```

Select your Agent, then start a new conversation. This installs the complete Skill, knowledge, and local tools. Add the template MCP separately using the [installation guide](docs/安装指南.md#模板-mcp-配置).

### Claude Code marketplace

```bash
claude plugin marketplace add jack-duya/duya-skills
claude plugin install duya@duya-skills
```

This plugin includes the same Skill and the template MCP configuration. Restart the session and use `/duya:duya`.

### Updates

For Skills CLI installations, repeat the installation command and select only `duya`. Marketplace update instructions are in the [guide](docs/安装指南.md#更新与卸载). Local memory is kept separately at `~/.duya/memory/`.

## How it works

```text
Your task or material
         ↓
Monies uses context to identify the current need
         ↓
Reframe when necessary; load relevant knowledge and templates
         ↓
Complete a decision, plan, or piece of content
         ↓
Use your corrections and save useful context when appropriate
```

A small edit stays small. A valid expansion request gets an expansion plan. There is no mandatory workflow to complete before receiving useful work.

## Knowledge and local records

The [knowledge library](skills/duya/knowledge/INDEX.md) covers business, content, operations, and learning. [Source notes](skills/duya/knowledge/SOURCES.md) distinguish source claims, examples, and new recommendations.

The template MCP returns relevant text and image URLs. Local file tools can save, retrieve, correct, and delete project records. This is actual file storage, not background model training. You do not need a publication log, CRM, or complete sales dataset to use the Skill.

## Public handbook

- [Business and lead acquisition handbook](books/渡鸦-商业与线索获客手册.md), in Chinese.
- [Worked usage examples](docs/使用案例.md), in Chinese.

Original course texts, private client files, and personal memory are not distributed in the public package.

![Knowledge and learning map](docs/knowledge-pipeline.svg)

## Contributors

Maintained by [Duya](https://github.com/jack-duya). Concrete examples and corrections are welcome; see [CONTRIBUTING.md](CONTRIBUTING.md).

The page and tutorial organization is inspired by [dontbesilent2025/dbskill](https://github.com/dontbesilent2025/dbskill). Duya's positioning, descriptions, examples, and diagrams have been rewritten. See [NOTICE.md](NOTICE.md).

## Author and support

Author: **Duya · jack-duya** · [GitHub profile](https://github.com/jack-duya)

Report usage problems through [Issues](https://github.com/jack-duya/duya-skills/issues). For commercial licensing, contact Duya through the contact information on the GitHub profile.

## License

Duya-owned materials are licensed under [CC BY-NC 4.0](LICENSE). Attribution and noncommercial conditions apply; commercial use requires separate permission. Third-party rights remain with their respective owners.

These methods and examples are not guarantees of traffic, leads, or revenue.
