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
    return fail("还没启动浏览器。先运行 node scripts/ensure-chrome.mjs");
  }
  const platform = resolvePlatform(argValue("--platform", runtime.platform || "douyin"));
  if (!platform) return fail("未知平台");

  await ensurePlatformTab(runtime.port, platform.origin);
  const sidepanel = await ensureSidepanel(runtime.port, runtime.extensionId);
  const ws = sidepanel.webSocketDebuggerUrl;
  await hookCall(ws, "refreshAuth").catch(() => {});
  await new Promise((r) => setTimeout(r, 800));
  const user = await hookCall(ws, "getUser");
  const platformAccount = await hookCall(ws, "getPlatformAccount");
  const current = await hookCall(ws, "getPlatform");
  const needMoyaclawLogin = !user || user.loggedIn === false;
  const needPlatformLogin = !platformAccount || !platformAccount.account;
  if (needMoyaclawLogin) {
    await hookCall(ws, "navigate", ["/general/data-center/account"]).catch(() => {});
  }
  ok({
    moyaclawUser: user,
    platform: current,
    platformAccount,
    needMoyaclawLogin,
    needPlatformLogin,
    message: needMoyaclawLogin
      ? "请在已打开的采集侧栏登录墨界账号。"
      : needPlatformLogin
        ? `请在 ${platform.origin} 登录${platform.name}账号，然后重试检查。`
        : "墨界账号和平台账号都已就绪。",
  });
}

main().catch((err) => fail(err.message || String(err)));
