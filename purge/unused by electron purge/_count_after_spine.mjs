import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const src = process.env.HALLULIUM_SRC || "C:\\hallulium\\src";
const delMd = fs.readFileSync(path.join(dir, "unrelated code purge.md"), "utf8");
const keepMd = fs.readFileSync(
  path.join(dir, "unrelated code purge keep overrides.md"),
  "utf8",
);
const keep = new Set();
for (const line of keepMd.split(/\r?\n/)) {
  const m = line.match(/^([a-zA-Z0-9_./+-]+)\s+\u2190/);
  if (m) keep.add(m[1].replace(/\\/g, "/"));
}
const policy =
  /(^|\/)(mac|macos|darwin|cocoa|appkit|metal|ios(?!_internal)|rust-toolchain|llvm-build|depot_tools|siso|buildtools)(\/|$)/i;

const spinePrefixes = [
  "third_party/dawn/",
  "third_party/skia/",
  "third_party/ffmpeg/",
  "third_party/electron_node/",
  "third_party/node/",
  "third_party/boringssl/",
  "third_party/blink/",
  "third_party/rust/",
  "third_party/zlib/",
  "third_party/libpng/",
  "third_party/libjpeg_turbo/",
  "third_party/harfbuzz-ng/",
  "third_party/freetype/",
  "third_party/icu/",
  "third_party/protobuf/",
  "third_party/abseil-cpp/",
  "third_party/perfetto/",
  "third_party/libc++/",
  "third_party/libc++abi/",
  "third_party/swiftshader/",
  "third_party/vulkan-deps/",
  "third_party/vulkan_memory_allocator/",
  "third_party/angle/",
  "electron/",
  "v8/",
  "base/",
  "cc/",
  "gpu/",
  "media/",
  "net/",
  "mojo/",
  "ui/",
  "gin/",
  "url/",
  "ipc/",
  "crypto/",
  "sandbox/",
  "sql/",
  "storage/",
  "build/",
  "chrome/browser/",
  "chrome/common/",
  "chrome/app/",
  "chrome/gpu/",
  "chrome/renderer/",
  "chrome/utility/",
  "chrome/services/",
  "chrome/child/",
  "chrome/install_static/",
  "chrome/chrome_elf/",
];

function inSpine(rel) {
  if (rel.startsWith("content/") && !rel.startsWith("content/test/")) return true;
  return spinePrefixes.some((p) => rel === p.slice(0, -1) || rel.startsWith(p));
}

const start = delMd.indexOf("```\n");
const end = delMd.lastIndexOf("\n```");
const body = delMd.slice(start + 4, end);
let still = 0;
let afterSpine = 0;
const by2 = new Map();
for (const relRaw of body.split("\n")) {
  const rel = relRaw.trim().replace(/\\/g, "/");
  if (!rel) continue;
  if (keep.has(rel) || policy.test(rel)) continue;
  if (!fs.existsSync(path.join(src, rel))) continue;
  still++;
  if (inSpine(rel)) continue;
  afterSpine++;
  const two = rel.split("/").slice(0, 2).join("/");
  by2.set(two, (by2.get(two) || 0) + 1);
}
console.log(JSON.stringify({ stillOnDisk: still, afterKeepSpine: afterSpine }));
console.log(
  [...by2.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([k, v]) => `${v}\t${k}`)
    .join("\n"),
);
