import { spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const SKILL_ROOT = path.resolve(__dirname, "..");
export const HOOK_MARKER = "window.__moyaclawCollect";
export const DEFAULT_DEBUG_PORT = 19222;
export const SIDEPANEL_WAIT_MS = 90000;

export function workRoot() {
  if (process.env.MOYACLAW_COLLECT_HOME) return process.env.MOYACLAW_COLLECT_HOME;
  if (process.platform === "win32") {
    return path.join(process.env.LOCALAPPDATA || os.homedir(), "moyaclaw-collect");
  }
  return path.join(os.homedir(), ".moyaclaw-collect");
}

export function runtimePath() {
  return path.join(workRoot(), "runtime.json");
}

export function catalog() {
  return JSON.parse(
    fs.readFileSync(path.join(SKILL_ROOT, "catalog.json"), "utf8"),
  );
}

export function defaultExtensionSource() {
  const candidates = [
    process.env.MOYACLAW_EXTENSION_DIR,
    path.join(SKILL_ROOT, "extension"),
  ].filter(Boolean);
  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, "manifest.json"))) return dir;
  }
  throw new Error("未找到墨界采集助手。请设置 MOYACLAW_EXTENSION_DIR，或把未打包的插件目录放到本 skill 的 extension/ 下。");
}

export function extensionWorkDir() {
  return path.join(workRoot(), "moyaclaw-extension");
}

export function profileDir(kind) {
  if (kind === "user") {
    if (process.env.MOYACLAW_CHROME_USER_DATA) return process.env.MOYACLAW_CHROME_USER_DATA;
    if (process.platform === "darwin") {
      return path.join(os.homedir(), "Library", "Application Support", "Google", "Chrome");
    }
    if (process.platform === "linux") {
      return path.join(os.homedir(), ".config", "google-chrome");
    }
    return path.join(process.env.LOCALAPPDATA || "", "Google", "Chrome", "User Data");
  }
  return process.env.MOYACLAW_CHROME_PROFILE
    || path.join(workRoot(), "chrome-profile");
}

export function loadRuntime() {
  try {
    return JSON.parse(fs.readFileSync(runtimePath(), "utf8"));
  } catch {
    return null;
  }
}

export function saveRuntime(data) {
  fs.mkdirSync(workRoot(), { recursive: true });
  fs.writeFileSync(runtimePath(), `${JSON.stringify(data, null, 2)}\n`);
}

export function fail(message, extra) {
  const out = { ok: false, error: message, ...extra };
  console.log(JSON.stringify(out, null, 2));
  process.exitCode = 1;
  return out;
}

export function ok(data) {
  const out = { ok: true, ...data };
  console.log(JSON.stringify(out, null, 2));
  return out;
}

export function resolvePlatform(input) {
  const raw = String(input || "").trim();
  if (!raw) return null;
  const cat = catalog();
  if (cat.platforms[raw]) return { code: raw, ...cat.platforms[raw] };
  const lower = raw.toLowerCase();
  for (const [code, meta] of Object.entries(cat.platforms)) {
    if (code.toLowerCase() === lower) return { code, ...meta };
    if ((meta.aliases || []).some((a) => String(a).toLowerCase() === lower)) {
      return { code, ...meta };
    }
  }
  return null;
}

export function keywordCollectBy(platformCode) {
  const map = catalog().keywordCollectBy || {};
  return map[platformCode] || map["*"] || "keyword";
}

export function findChrome() {
  if (process.env.MOYACLAW_CHROME_EXE && fs.existsSync(process.env.MOYACLAW_CHROME_EXE)) {
    return process.env.MOYACLAW_CHROME_EXE;
  }
  const candidates = process.platform === "darwin"
    ? ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"]
    : process.platform === "linux"
      ? ["/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", "/usr/bin/chromium-browser"]
      : [
          path.join(process.env.PROGRAMFILES || "C:\\Program Files", "Google", "Chrome", "Application", "chrome.exe"),
          path.join(process.env["PROGRAMFILES(X86)"] || "C:\\Program Files (x86)", "Google", "Chrome", "Application", "chrome.exe"),
          path.join(process.env.LOCALAPPDATA || "", "Google", "Chrome", "Application", "chrome.exe"),
        ];
  return candidates.find((p) => p && fs.existsSync(p)) || null;
}

export function unpackedExtensionId(dir) {
  const abs = path.resolve(String(dir || "").trim());
  const hex = crypto.createHash("sha256").update(Buffer.from(abs, "utf16le")).digest("hex").slice(0, 32);
  return hex.replace(/[0-9a-f]/g, (ch) => String.fromCharCode(97 + parseInt(ch, 16)));
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

export function syncExtension(sourceDir, destDir) {
  const src = path.resolve(sourceDir);
  const dest = path.resolve(destDir);
  if (!fs.existsSync(path.join(src, "manifest.json"))) {
    throw new Error(`扩展目录无效：${src}`);
  }
  const srcJs = path.join(src, "chunks", "sidepanel-D1aMPzcy.js");
  const destJs = path.join(dest, "chunks", "sidepanel-D1aMPzcy.js");
  const needCopy = !fs.existsSync(destJs)
    || fs.statSync(srcJs).mtimeMs > fs.statSync(destJs).mtimeMs;
  if (needCopy) copyDir(src, dest);
  patchSidepanelHook(dest);
  return dest;
}

export function patchSidepanelHook(extDir) {
  const jsPath = path.join(extDir, "chunks", "sidepanel-D1aMPzcy.js");
  let text = fs.readFileSync(jsPath, "utf8");
  if (text.includes(HOOK_MARKER)) return { patched: false, path: jsPath };
  const hook = fs.readFileSync(path.join(__dirname, "hook-snippet.js"), "utf8").trim();
  const needle = "W7.createRoot(Kre).render(d.jsx(z7, { router: zre }));";
  if (!text.includes(needle)) {
    throw new Error("sidepanel 源码已变化，找不到挂载点，无法注入 runTask 钩子");
  }
  text = text.replace(needle, `${hook}\n  ${needle}`);
  fs.writeFileSync(jsPath, text);
  return { patched: true, path: jsPath };
}

export function prepareProfile(userDataDir, extensionId) {
  const defaultDir = path.join(userDataDir, "Default");
  fs.mkdirSync(defaultDir, { recursive: true });
  const prefsPath = path.join(defaultDir, "Preferences");
  let prefs = {};
  try {
    prefs = JSON.parse(fs.readFileSync(prefsPath, "utf8"));
  } catch {}
  if (!prefs.extensions || typeof prefs.extensions !== "object") prefs.extensions = {};
  if (!prefs.extensions.ui || typeof prefs.extensions.ui !== "object") prefs.extensions.ui = {};
  prefs.extensions.ui.developer_mode = true;
  if (extensionId) {
    const existing = Array.isArray(prefs.extensions.pinned_extensions)
      ? prefs.extensions.pinned_extensions.map(String)
      : [];
    prefs.extensions.pinned_extensions = [...new Set([extensionId, ...existing])];
  }
  fs.writeFileSync(prefsPath, `${JSON.stringify(prefs)}\n`);
}

export function chromeRunningWithProfile(userDataDir) {
  const lock = path.join(userDataDir, "SingletonLock");
  const lockWin = path.join(userDataDir, "lockfile");
  const portFile = path.join(userDataDir, "DevToolsActivePort");
  return fs.existsSync(lock) || fs.existsSync(lockWin) || fs.existsSync(portFile);
}

export async function jsonGet(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.json();
}

export async function debugPortAlive(port) {
  try {
    await jsonGet(`http://127.0.0.1:${port}/json/version`);
    return true;
  } catch {
    return false;
  }
}

export function readDebugPort(userDataDir) {
  const file = path.join(userDataDir, "DevToolsActivePort");
  if (!fs.existsSync(file)) return 0;
  const first = fs.readFileSync(file, "utf8").trim().split(/\r?\n/)[0];
  return Number(first) || 0;
}

export async function findLiveDebugPort(userDataDir, preferredPort = DEFAULT_DEBUG_PORT) {
  if (preferredPort && await debugPortAlive(preferredPort)) return preferredPort;
  const fromFile = readDebugPort(userDataDir);
  if (fromFile && await debugPortAlive(fromFile)) return fromFile;
  return 0;
}

export async function waitForDebugPort(userDataDir, timeoutMs = 20000, preferredPort = DEFAULT_DEBUG_PORT) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const port = await findLiveDebugPort(userDataDir, preferredPort);
    if (port) return port;
    await sleep(300);
  }
  throw new Error("Chrome 调试口未就绪。若要用当前已打开的 Chrome，请先关掉它再让 skill 拉起。");
}

export function launchChrome({ chromeExe, userDataDir, extensionDir, port, extraArgs, startUrls, disableOtherExtensions }) {
  const args = [
    `--user-data-dir=${userDataDir}`,
    `--remote-debugging-port=${port}`,
    "--remote-allow-origins=*",
    "--no-first-run",
    "--no-default-browser-check",
    `--load-extension=${extensionDir}`,
    "--disable-features=DisableLoadExtensionCommandLineSwitch",
    "--enable-unsafe-extension-debugging",
    "--remote-debugging-address=127.0.0.1",
  ];
  if (disableOtherExtensions) {
    args.push(`--disable-extensions-except=${extensionDir}`);
  }
  args.push(...(extraArgs || []));
  args.push(...(startUrls && startUrls.length ? startUrls : ["about:blank"]));
  const child = spawn(chromeExe, args, {
    detached: true,
    stdio: "ignore",
    windowsHide: false,
  });
  child.unref();
  return child.pid;
}

export async function listTargets(port) {
  return jsonGet(`http://127.0.0.1:${port}/json/list`);
}

export async function browserWebSocket(port) {
  const ver = await jsonGet(`http://127.0.0.1:${port}/json/version`);
  return ver.webSocketDebuggerUrl;
}

export async function openTarget(port, url) {
  const browserWs = await browserWebSocket(port);
  const created = await cdpCall(browserWs, "Target.createTarget", { url });
  const targetId = created && created.targetId;
  const started = Date.now();
  while (Date.now() - started < 8000) {
    const targets = await listTargets(port);
    const tab = (targets || []).find((t) => t.id === targetId)
      || (targets || []).find((t) => String(t.url || "").startsWith(url));
    if (tab) return tab;
    await sleep(200);
  }
  return { id: targetId, url };
}

export function extractExtensionId(targets) {
  for (const t of targets || []) {
    const url = String(t.url || t.devtoolsFrontendUrl || "");
    const m = url.match(/chrome-extension:\/\/([a-p]{32})/);
    if (m) return m[1];
  }
  return "";
}

export async function waitForExtensionId(port, timeoutMs = 20000, predictedId = "") {
  const started = Date.now();
  let asked = false;
  while (Date.now() - started < timeoutMs) {
    const targets = await listTargets(port).catch(() => []);
    const id = extractExtensionId(targets);
    if (id) return { id, targets };
    if (!asked && predictedId && Date.now() - started > 1500) {
      asked = true;
      await openTarget(port, `chrome-extension://${predictedId}/sidepanel.html`).catch(() => {});
      await openTarget(port, "chrome://extensions").catch(() => {});
    }
    await sleep(300);
  }
  throw new Error("扩展未加载。请确认 Chrome 已用 --load-extension 启动，并允许未打包扩展。");
}

export async function findTarget(port, predicate) {
  const targets = await listTargets(port);
  return (targets || []).find(predicate) || null;
}

export async function ensureSidepanel(port, extensionId) {
  const url = `chrome-extension://${extensionId}/sidepanel.html`;
  let tab = await findTarget(port, (t) => String(t.url || "").startsWith(url));
  if (!tab) tab = await openTarget(port, url);
  const started = Date.now();
  while (Date.now() - started < SIDEPANEL_WAIT_MS) {
    const live = await findTarget(port, (t) => String(t.url || "").startsWith(url));
    if (live && live.webSocketDebuggerUrl) {
      try {
        const ready = await cdpEval(
          live.webSocketDebuggerUrl,
          "!!(window.__moyaclawCollect && window.__moyaclawCollect.ready)",
        );
        if (ready) {
          await cdpEval(
            live.webSocketDebuggerUrl,
            `(() => {
              const nodes = [...document.querySelectorAll("button")];
              const btn = nodes.find((n) => (n.innerText || "").includes("我已阅读并同意"));
              if (btn) btn.click();
              return true;
            })()`,
          ).catch(() => {});
          return live;
        }
      } catch {}
    }
    await sleep(400);
  }
  throw new Error("采集侧栏未就绪。请确认扩展已加载，并已注入 __moyaclawCollect 钩子。");
}

export async function ensurePlatformTab(port, origin) {
  const host = new URL(origin).hostname;
  let tab = await findTarget(port, (t) => {
    const url = String(t.url || "");
    return t.type === "page" && url.includes(host) && !url.startsWith("chrome");
  });
  if (!tab) tab = await openTarget(port, origin);
  const ws = tab.webSocketDebuggerUrl;
  if (ws) {
    try {
      await cdpCall(ws, "Page.bringToFront");
    } catch {}
  }
  return tab;
}

export async function cdpCall(wsUrl, method, params = {}, timeoutMs = 15000) {
  const ws = new WebSocket(wsUrl);
  const id = Math.floor(Math.random() * 1e9);
  const result = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      try { ws.close(); } catch {}
      reject(new Error(`CDP timeout ${method}`));
    }, timeoutMs);
    ws.addEventListener("open", () => {
      ws.send(JSON.stringify({ id, method, params }));
    });
    ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(String(ev.data));
      if (msg.id !== id) return;
      clearTimeout(timer);
      ws.close();
      if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
      else resolve(msg.result);
    });
    ws.addEventListener("error", () => {
      clearTimeout(timer);
      reject(new Error(`CDP socket error ${method}`));
    });
  });
  return result;
}

export async function cdpEval(wsUrl, expression, awaitPromise = true) {
  const result = await cdpCall(wsUrl, "Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise,
  });
  if (result && result.exceptionDetails) {
    const text = result.exceptionDetails.text
      || (result.exceptionDetails.exception && result.exceptionDetails.exception.description)
      || "evaluation failed";
    throw new Error(text);
  }
  return result && result.result ? result.result.value : undefined;
}

export async function hookCall(wsUrl, method, args = []) {
  const payload = JSON.stringify(args);
  const expr = `(async () => {
    const api = window.__moyaclawCollect;
    if (!api) throw new Error("采集钩子未就绪");
    const fn = api[${JSON.stringify(method)}];
    if (typeof fn !== "function") throw new Error("钩子没有 " + ${JSON.stringify(method)});
    return await fn.apply(api, ${payload});
  })()`;
  return cdpEval(wsUrl, expr, true);
}

export function parseList(value) {
  if (Array.isArray(value)) return value.map(String).map((s) => s.trim()).filter(Boolean);
  return String(value || "")
    .split(/[\r\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function argValue(flag, fallback) {
  const idx = process.argv.indexOf(flag);
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return fallback;
}

export function hasFlag(flag) {
  return process.argv.includes(flag);
}

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
