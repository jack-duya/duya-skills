import {
  DEFAULT_DEBUG_PORT,
  argValue,
  catalog,
  chromeRunningWithProfile,
  defaultExtensionSource,
  ensurePlatformTab,
  ensureSidepanel,
  extensionWorkDir,
  fail,
  findChrome,
  findLiveDebugPort,
  launchChrome,
  ok,
  prepareProfile,
  profileDir,
  resolvePlatform,
  saveRuntime,
  syncExtension,
  unpackedExtensionId,
  waitForDebugPort,
  waitForExtensionId,
} from "./lib.mjs";

async function main() {
  const profileKind = argValue("--profile", "dedicated");
  const platform = resolvePlatform(argValue("--platform", "douyin"));
  let sourceDir;
  try {
    sourceDir = argValue("--extension") || defaultExtensionSource();
  } catch (error) {
    return fail(error.message || String(error));
  }
  const port = Number(argValue("--port", DEFAULT_DEBUG_PORT));
  const chromeExe = findChrome();
  if (!chromeExe) return fail("未找到 Google Chrome。请安装官方 Chrome，或设置 MOYACLAW_CHROME_EXE。");
  if (!platform) return fail("未知平台，见 catalog.md");

  const extDir = syncExtension(sourceDir, extensionWorkDir());
  const userDataDir = profileDir(profileKind);
  const predictedId = unpackedExtensionId(extDir);
  prepareProfile(userDataDir, predictedId);

  let debugPort = await findLiveDebugPort(userDataDir, port);
  let launched = false;
  if (!debugPort) {
    if (profileKind === "user" && chromeRunningWithProfile(userDataDir)) {
      return fail("当前用户 Chrome 正在运行且没有调试口，不能静默装插件。请先完全退出 Chrome，或改用 --profile dedicated。");
    }
    launchChrome({
      chromeExe,
      userDataDir,
      extensionDir: extDir,
      port,
      disableOtherExtensions: profileKind === "dedicated",
      startUrls: [platform.origin, "about:blank"],
    });
    launched = true;
    debugPort = await waitForDebugPort(userDataDir, 20000, port);
  }

  const { id: extensionId } = await waitForExtensionId(debugPort, 20000, predictedId);
  const platformTab = await ensurePlatformTab(debugPort, platform.origin);
  const sidepanel = await ensureSidepanel(debugPort, extensionId);
  const runtime = {
    port: debugPort,
    profileKind,
    profileDir: userDataDir,
    extensionDir: extDir,
    extensionSource: sourceDir,
    extensionId,
    chromeExe,
    launched,
    platform: platform.code,
    platformTab: platformTab.url,
    sidepanelUrl: sidepanel.url,
  };
  saveRuntime(runtime);
  ok({
    ...runtime,
    platforms: Object.keys(catalog().platforms),
    note: "扩展已挂到独立 Chrome 配置。不能对已经打开、没有调试口的用户 Chrome 静默装插件。",
  });
}

main().catch((err) => fail(err.message || String(err)));
