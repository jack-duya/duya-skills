import {
  argValue,
  ensurePlatformTab,
  ensureSidepanel,
  fail,
  hookCall,
  loadRuntime,
  ok,
  resolvePlatform,
} from "./lib.mjs";

async function main() {
  const runtime = loadRuntime();
  if (!runtime || !runtime.port || !runtime.extensionId) {
    return fail("还没启动浏览器。先运行 node scripts/ensure-chrome.mjs --platform <平台>");
  }
  const platform = resolvePlatform(argValue("--platform", runtime.platform || "douyin"));
  const to = argValue("--path", "");
  if (!platform) return fail("未知平台");
  if (!to) return fail("缺少 --path，例如 /douyin/other/url-transform");

  await ensurePlatformTab(runtime.port, platform.origin);
  const sidepanel = await ensureSidepanel(runtime.port, runtime.extensionId);
  await hookCall(sidepanel.webSocketDebuggerUrl, "navigate", [to]);
  ok({
    platform: platform.code,
    path: to,
    message: `已打开 ${to}。账号管理、采集历史、采集计划、链接转换、关键词拓展、星图/蒲公英转换和邀约都走这一步。`,
  });
}

main().catch((err) => fail(err.message || String(err)));
