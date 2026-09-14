# 可见功能目录

只覆盖侧栏可见功能。隐藏采集、页面一键下载/复制、飞书同步都不做。

采集走 `runTask(type, condition, false, path)`。`path` 用下表「侧栏 path」。关键词字段一律传 `keywords` 数组；`collectBy` 除 B 站用 `keywords` 外，其余用 `keyword`。

## 抖音 `douyin`  origin `https://www.douyin.com`

| 入口 | type | collectBy | 主要字段 | path |
|---|---|---|---|---|
| 采集达人数据 | `author` | `links` / `keyword` | `urls` 或 `keywords` + `limit` | `/douyin/batch-collect/author` |
| 采集视频数据 | `aweme` | `links` / `author-links` / `keyword` | `urls` 或 `keywords` + `limit`；达人链接加 `limitPerId` | `/douyin/batch-collect/aweme` |
| 采集评论数据 | `comment` | （无，按链接） | `urls` + `limit`（每条视频评论数） | `/douyin/batch-collect/comment` |
| 链接转换 | 导航 | 短链/长链 | `urls` | `/douyin/other/url-transform` |
| 关键词拓展 | 导航 | 搜索联想词、推荐组合词 | `keywords` | `/douyin/other/related-words` |

## 小红书 `xiaohongshu`  origin `https://www.xiaohongshu.com`

| 入口 | type | collectBy | 主要字段 | path |
|---|---|---|---|---|
| 采集博主数据 | `blogger` | `links` / `keyword` | `urls` 或 `keywords` + `limit` | `/xiaohongshu/batch-collect/blogger` |
| 采集笔记数据 | `note` | `links` / `author-links` / `keyword` | `urls` 或 `keywords` + `limit` | `/xiaohongshu/batch-collect/note` |
| 采集评论数据 | `comment` | （无） | `urls` + `limit` | `/xiaohongshu/batch-collect/comment` |
| 链接转换 | 导航 | 短链/长链 | `urls` | `/xiaohongshu/other/url-transform` |
| 关键词拓展 | 导航 | 搜索联想词、推荐组合词 | `keywords` | `/xiaohongshu/other/related-words` |

## 快手 `kuaishou`  origin `https://www.kuaishou.com`

| 入口 | type | collectBy | 主要字段 | path |
|---|---|---|---|---|
| 采集达人数据 | `author` | `links` / `keyword` | `urls` 或 `keywords` + `limit` | `/kuaishou/batch-collect/author` |
| 采集视频数据 | `photo` | `links` / `author-links` / `keyword` | `urls` 或 `keywords` + `limit` | `/kuaishou/batch-collect/photo` |
| 采集评论数据 | `comment` | （无） | `urls` + `limit` | `/kuaishou/batch-collect/comment` |
| 链接转换 | 导航 | 短链/长链 | `urls` | `/kuaishou/other/url-transform` |

## B 站 `bilibili`  origin `https://www.bilibili.com`

| 入口 | type | collectBy | 主要字段 | path |
|---|---|---|---|---|
| 采集 UP 主数据 | `uploader` | `links` / `keywords` | `urls` 或 `keywords` + `limit` | `/bilibili/batch-collect/uploader` |
| 采集视频数据 | `video` | `links` / `author-links` / `keywords` | `urls` 或 `keywords` + `limit` | `/bilibili/batch-collect/video` |
| 采集评论数据 | `comment` | （无） | `urls` + `limit` | `/bilibili/batch-collect/comment` |
| 链接转换 | 导航 | 短链/长链 | `urls` | `/bilibili/other/url-transform` |

## TikTok `tiktok`  origin `https://www.tiktok.com`

| 入口 | type | collectBy | 主要字段 | path |
|---|---|---|---|---|
| 采集达人数据 | `author` | `links` / `keyword` | `urls` 或 `keywords` + `limit` | `/tiktok/batch-collect/author` |
| 采集视频数据 | `aweme` | `links` / `author-links` / `keyword` | `urls` 或 `keywords` + `limit` | `/tiktok/batch-collect/aweme` |
| 采集评论数据 | `comment` | （无） | `urls` + `limit` | `/tiktok/batch-collect/comment` |
| 短链解析 | 导航 | 通用短链 | `urls` | `/general/short-url/parse` |

## 巨量星图 `xingtu`  origin `https://www.xingtu.cn`

| 入口 | type | collectBy | 主要字段 | path |
|---|---|---|---|---|
| 采集达人数据 | `author` | `links` / `keyword` | `urls` 或 `keywords` + `limit` | `/xingtu/batch-collect/author` |
| 采集视频数据 | `aweme` | `links` / `author-links` | `urls` + 可选 `limitPerId` | `/xingtu/batch-collect/aweme` |
| 达人 UID 转星图链接 | 导航 | 转换 | 文本 | `/xingtu/other/id-transform` |

## 小红书蒲公英 `pgy.xiaohongshu`  origin `https://pgy.xiaohongshu.com`

| 入口 | type | collectBy | 主要字段 | path |
|---|---|---|---|---|
| 采集博主数据 | `blogger` | `links` / `keyword` | `urls` 或 `keywords` + `limit` | `/pgy.xiaohongshu/batch-collect/blogger` |
| 采集笔记数据 | `note` | `links` / `author-links` | `urls` + 可选 `limitPerId` | `/pgy.xiaohongshu/batch-collect/note` |
| 笔记 ID 转链接 | 导航 | 转换 | 文本 | `/pgy.xiaohongshu/other/id-transform` |
| 批量发起邀约 | 导航 | 邀约 | 表单 | `/pgy.xiaohongshu/other/batch-invite` |
| 批量添加合作 | 导航 | 合作 | 表单 | `/pgy.xiaohongshu/other/batch-order` |

## 公共项（各平台首页都有）

| 入口 | 动作 | path |
|---|---|---|
| 账号管理 | 导航 | `/general/data-center/account` |
| 采集历史 | 导航 | `/general/data-center/collect-history` |
| 采集计划 | 导航 | `/general/data-center/task-alarm` |

公共项仍要先打开对应平台网页，插件用当前标签判断平台。

## 映射例子

- 「抖音搜视频 美食 20 条」→ `douyin` + `aweme` + `collectBy: keyword` + `keywords: ["美食"]` + `limit: 20`
- 「用这几个达人链接采作品」→ 对应平台视频 type + `collectBy: author-links` + `urls`
- 「B 站按关键词采 UP 主」→ `bilibili` + `uploader` + `collectBy: keywords`
- 「打开抖音采集历史」→ 导航 `/general/data-center/collect-history`，当前标签必须是抖音
