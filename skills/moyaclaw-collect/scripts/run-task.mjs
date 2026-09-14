import {
  argValue,
  catalog,
  ensurePlatformTab,
  ensureSidepanel,
  fail,
  hookCall,
  keywordCollectBy,
  loadRuntime,
  ok,
  parseList,
  resolvePlatform,
  sleep,
} from "./lib.mjs";

function buildCondition() {
  const collectBy = argValue("--collect-by", "");
  const keywords = parseList(argValue("--keywords", ""));
  const urls = parseList(argValue("--urls", ""));
  const limit = argValue("--limit", "");
  const limitPerId = argValue("--limit-per-id", "");
  const name = argValue("--name", "");
  const extraRaw = argValue("--condition-json", "");
  const condition = extraRaw ? JSON.parse(extraRaw) : {};
  if (collectBy) condition.collectBy = collectBy;
  if (keywords.length) condition.keywords = keywords;
  if (urls.length) condition.urls = urls;
  if (limit) condition.limit = Number(limit);
  if (limitPerId) condition.limitPerId = Number(limitPerId);
  if (name) condition.name = name;
  return condition;
}

function validate(platformCode, type, condition) {
  const blocked = catalog().outOfScope || [];
  if (blocked.includes(type)) {
    throw new Error(`类型 ${type} 不在可见功能范围内`);
  }
  if (condition.collectBy === "keyword" || condition.collectBy === "keywords") {
    if (!condition.keywords || !condition.keywords.length) {
      throw new Error("关键词采集需要 --keywords");
    }
    const expected = keywordCollectBy(platformCode);
    if (condition.collectBy !== expected) {
      condition.collectBy = expected;
    }
  }
  if ((condition.collectBy === "links" || condition.collectBy === "author-links" || type === "comment")
    && (!condition.urls || !condition.urls.length)
    && condition.collectBy !== "keyword"
    && condition.collectBy !== "keywords") {
    throw new Error("链接采集需要 --urls");
  }
  return condition;
}

async function main() {
  const runtime = loadRuntime();
  if (!runtime || !runtime.port || !runtime.extensionId) {
    return fail("还没启动浏览器。先运行 node scripts/ensure-chrome.mjs --platform <平台>");
  }
  const platform = resolvePlatform(argValue("--platform", runtime.platform || "douyin"));
  const type = argValue("--type", "");
  const pathName = argValue("--path", "");
  if (!platform) return fail("未知平台");
  if (!type) return fail("缺少 --type，见 catalog.md");

  let condition = buildCondition();
  condition = validate(platform.code, type, condition);
  if (!condition.name) {
    condition.name = `${platform.name}-${type}`;
  }

  await ensurePlatformTab(runtime.port, platform.origin);
  const sidepanel = await ensureSidepanel(runtime.port, runtime.extensionId);
  const ws = sidepanel.webSocketDebuggerUrl;

  const current = await hookCall(ws, "getPlatform");
  if (!current || current.code !== platform.code) {
    return fail(`当前标签不是${platform.name}，请保持 ${platform.origin} 在前台后再采集。`, {
      current,
    });
  }

  const auth = await hookCall(ws, "getPlatformAccount");
  if (!auth || !auth.account) {
    return fail(`请先登录${platform.name}。可运行 node scripts/login-check.mjs --platform ${platform.code}`);
  }

  const task = await hookCall(ws, "runTask", [type, condition, false, pathName || undefined]);
  if (!task) {
    return fail("runTask 没有创建任务。常见原因：当前页不属于该平台，或 type 不存在。");
  }

  const waitMs = Number(argValue("--wait", "0"));
  let snapshot = await hookCall(ws, "getTaskSnapshot");
  const startedAt = Date.now();
  while (waitMs > 0 && snapshot && !["completed", "failed", "paused"].includes(snapshot.status)) {
    if (Date.now() - startedAt > waitMs) break;
    await sleep(2000);
    snapshot = await hookCall(ws, "getTaskSnapshot");
  }

  ok({
    platform: platform.code,
    type,
    condition,
    path: pathName || null,
    task: snapshot,
    waiting: waitMs > 0,
    message: snapshot && snapshot.status === "completed"
      ? "采集完成，可在侧栏任务页导出。"
      : "任务已下发到墨界采集助手侧栏，采集过程由插件自己执行。",
  });
}

main().catch((err) => fail(err.message || String(err)));
