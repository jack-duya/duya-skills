---
name: moyaclaw-collect
description: 挂载墨界采集助手 3.5.2，并按侧栏可见功能采集抖音、小红书、快手、B站、TikTok、巨量星图、蒲公英数据。用于关键词采集、链接采集、评论采集、链接转换、关键词拓展、账号管理、采集历史和采集计划。用户提到采集、墨界、达人、笔记、UP主或这些平台时使用。
---

# 墨界采集

一个总 skill。挂上墨界采集助手后，按平台、任务类型和采集方式下发任务。不要按平台拆成多个 skill。

墨界采集助手 3.5.2 已经放在本 skill 的 `extension/` 里。新用户拿到 skill 后直接跑脚本即可，不必再单独找插件。只有要用另一份插件时，才设置 `MOYACLAW_EXTENSION_DIR`。

## 范围

只做 [catalog.md](catalog.md) 里的侧栏可见入口，包括各采集页上的关键词采集。

不做：合集/收藏、小红书专辑、隐藏搜索页、作品页一键下载或复制、飞书同步。

## 工作流

先确认平台、采集对象、关键词或链接。不够就问，不要空跑。

然后按顺序执行脚本，cwd 为本 skill 根目录：

1. 挂扩展并打开平台页

```bash
node scripts/ensure-chrome.mjs --platform douyin
```

默认使用独立 Chrome 配置，不会改用户正在用的 Chrome。不能对已经打开、没有调试口的用户 Chrome 静默装插件。用户坚持用自己的 Chrome 时，先让用户完全退出 Chrome，再加 `--profile user`。

2. 检查登录

```bash
node scripts/login-check.mjs --platform douyin
```

墨界账号或平台账号没登，只提示用户在已打开的独立 Chrome 窗口里登，不要替用户填密码。登录后再跑一次检查。没登平台时不要强行采集。

3. 采集用 `run-task`；转换、历史、计划、邀约用 `navigate`

```bash
node scripts/run-task.mjs --platform douyin --type aweme --collect-by keyword --keywords 美食 --limit 20 --path /douyin/batch-collect/aweme
node scripts/navigate.mjs --platform douyin --path /douyin/other/url-transform
```

选 type 和 path 时读 [catalog.md](catalog.md)。B 站关键词的 `collectBy` 是 `keywords`，其他平台是 `keyword`。链接采集传 `--urls`，一行一个或逗号分隔。

## 调用规则

- 必须先有对应平台标签，否则插件会提示当前页不属于该平台。
- 采集由插件的 `runTask` 执行；本 skill 只负责挂扩展、打开侧栏、下发参数。
- 默认 `--profile dedicated`，工作目录是用户目录下的 `moyaclaw-collect`。脚本会复制扩展并注入调用钩子，不改插件源目录。
- 不能装进正在运行且未开调试口的 Chrome。
- 任务下发后由插件跑。需要等结果时给 `run-task.mjs` 加 `--wait 120000`。
- 账号管理、采集历史、采集计划也要先打开对应平台网页再导航。

## 环境变量

| 变量 | 用途 |
|---|---|
| `MOYACLAW_EXTENSION_DIR` | 可选。覆盖内置插件目录 |
| `MOYACLAW_CHROME_EXE` | Chrome 可执行文件 |
| `MOYACLAW_COLLECT_HOME` | 工作目录 |
