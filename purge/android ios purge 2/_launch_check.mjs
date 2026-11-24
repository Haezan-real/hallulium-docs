import { execFileSync, spawn } from "node:child_process";
import { openSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const exe = "C:\\hallulium\\src\\out\\Release\\hallu.exe";
const cwd = "C:\\Users\\zeela\\Desktop\\very important shit\\code\\hallu\\bin";
const port = 9334;
const out = openSync(join(tmpdir(), "hallu_release_launch_out.txt"), "w");
const err = openSync(join(tmpdir(), "hallu_release_launch_err.txt"), "w");

const child = spawn(
  exe,
  [
    "main.cjs",
    `--remote-debugging-port=${port}`,
    "--disable-features=CalculateNativeWinOcclusion",
    "--disable-renderer-backgrounding",
    "--disable-backgrounding-occluded-windows",
  ],
  {
    cwd,
    env: {
      ...process.env,
      ELECTRON_DEV: "true",
      HALLU_LIVE_TEST: "1",
    },
    stdio: ["ignore", out, err],
    windowsHide: true,
  },
);

async function closeWindow() {
  try {
    await evaluate("window.electronAPI?.closeWindow(), true");
  } catch {}
}

function killTree() {
  try {
    execFileSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], { stdio: "ignore" });
  } catch {}
}

async function pageTarget() {
  for (let i = 0; i < 90; i++) {
    try {
      const list = await fetch(`http://127.0.0.1:${port}/json`).then((r) => r.json());
      const page = list.find((t) => t.type === "page" && !String(t.url).startsWith("devtools://"));
      if (page?.webSocketDebuggerUrl) return page;
    } catch {}
    await delay(500);
  }
  throw new Error("no page target");
}

function connect(wsUrl) {
  return new Promise((resolveOpen, rejectOpen) => {
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => resolveOpen(ws);
    ws.onerror = () => rejectOpen(new Error("could not connect"));
  });
}

async function evaluate(expression) {
  const page = await pageTarget();
  const ws = await connect(page.webSocketDebuggerUrl);
  return await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      ws.close();
      reject(new Error("evaluate timed out"));
    }, 15000);
    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.id !== 1) return;
      clearTimeout(timer);
      ws.close();
      if (data.result?.exceptionDetails) {
        reject(new Error(data.result.exceptionDetails.text || "page threw"));
        return;
      }
      resolve(data.result?.result?.value);
    };
    ws.send(JSON.stringify({
      id: 1,
      method: "Runtime.evaluate",
      params: { expression, returnByValue: true, awaitPromise: true },
    }));
  });
}

let ready = false;
let title = "";
let url = "";
let error = "";
try {
  for (let i = 0; i < 90; i++) {
    try {
      await fetch(`http://127.0.0.1:${port}/json/version`);
      break;
    } catch {
      await delay(500);
    }
  }
  for (let i = 0; i < 90; i++) {
    const value = await evaluate(
      "({ title: document.title, url: location.href, ready: !!document.querySelector('.widget-hub-ball') })",
    );
    title = value?.title ?? "";
    url = value?.url ?? "";
    ready = !!value?.ready;
    if (ready) break;
    await delay(500);
  }
} catch (e) {
  error = String(e?.message || e);
} finally {
  await closeWindow();
  await delay(1500);
  killTree();
  await delay(500);
}

console.log(JSON.stringify({ ready, title, url, pid: child.pid, error }));
if (!ready) process.exit(1);
