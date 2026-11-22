/**
 * List code that is linked into Release hallu.exe and is outside the
 * Blink → Skia paint path and the JS engine (V8 + Node).
 *
 * Reads the ninja link edge. Does not compile, link, or delete anything.
 *
 *   node "docs/stage-3-shrink-hallu-exe/scan-linked-but-unused-by-hallu.mjs"
 *
 * Object-file bytes are pre-ThinLTO. They rank features inside the link.
 * They are larger than the bytes those features occupy in hallu.exe.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = process.env.HALLULIUM_SRC || 'C:\\hallulium\\src';
const OUT = path.join(SRC, 'out', 'Release');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const MD = path.join(HERE, 'linked-into-hallu-exe-but-unused-by-hallu.md');

const KEEP_MODULES = [
  'accessibility',
  'breakout_box',
  'canvas',
  'encoding',
  'exported',
  'media',
  'media_capabilities',
  'media_controls',
  'mediacapturefromelement',
  'mediarecorder',
  'mediasource',
  'mediastream',
  'quota',
  'srcobject',
  'storage',
  'video_rvfc',
  'webaudio',
  'webcodecs',
  'webgpu',
];

const CUT_MODULES = [
  'ad_auction',
  'ai',
  'animationworklet',
  'app_banner',
  'background_fetch',
  'background_sync',
  'badging',
  'battery',
  'beacon',
  'bluetooth',
  'browsing_topics',
  'cache_storage',
  'compute_pressure',
  'contacts_picker',
  'content_extraction',
  'content_index',
  'cookie_store',
  'credentialmanagement',
  'csspaint',
  'device_orientation',
  'device_posture',
  'direct_sockets',
  'document_metadata',
  'document_picture_in_picture',
  'eyedropper',
  'file_system_access',
  'filesystem',
  'font_access',
  'gamepad',
  'handwriting',
  'hid',
  'idle',
  'installation',
  'installedapp',
  'interest_group',
  'launch',
  'locked_mode',
  'managed_device',
  'ml',
  'navigatorcontentutils',
  'nfc',
  'notifications',
  'payments',
  'peerconnection',
  'picture_in_picture',
  'presentation',
  'printing',
  'push_messaging',
  'remoteplayback',
  'screen_details',
  'sensor',
  'serial',
  'service_worker',
  'shapedetection',
  'shared_storage',
  'smart_card',
  'speech',
  'subapps',
  'vibration',
  'wake_lock',
  'web_install',
  'webgl',
  'webmidi',
  'webrtc',
  'webshare',
  'webtransport',
  'webusb',
  'window_controls_overlay',
  'xr',
];

const MODULE_NAMES = [...new Set([...KEEP_MODULES, ...CUT_MODULES])].sort((a, b) => b.length - a.length);

const BINDING_ALIASES = [
  [/webgl/, 'webgl'],
  [/^v8_gpu_/, 'webgpu'],
  [/rtc_/, 'webrtc'],
  [/payment/, 'payments'],
  [/usb_/, 'webusb'],
  [/bluetooth/, 'bluetooth'],
  [/^v8_xr_/, 'xr'],
  [/canvas|image_bitmap|offscreencanvas|path_2d/, 'canvas'],
  [/video_frame|encoded_video|encoded_audio|audio_data|video_encoder|video_decoder|audio_encoder|audio_decoder/, 'webcodecs'],
  [/media_recorder/, 'mediarecorder'],
  [/media_stream|media_track/, 'mediastream'],
  [/audio_|biquad|oscillator|dynamics_compressor|convolver|panner_node|audio_buffer|audio_param|audio_listener|base_audio_context/, 'webaudio'],
  [/notification/, 'notifications'],
  [/service_worker/, 'service_worker'],
  [/credential|public_key|authenticator/, 'credentialmanagement'],
  [/^v8_hid_/, 'hid'],
  [/^v8_serial_/, 'serial'],
  [/^v8_nfc_/, 'nfc'],
  [/midi_/, 'webmidi'],
  [/speech/, 'speech'],
  [/gamepad/, 'gamepad'],
  [/sensor/, 'sensor'],
  [/auction|ad_config|interest_group/, 'ad_auction'],
  [/summarizer|rewriter|^v8_writer|language_model/, 'ai'],
  [/web_printer|printer/, 'printing'],
  [/idb_|indexed_db/, 'indexeddb'],
  [/storage_manager|storage_estimate/, 'storage'],
];
const KEEP_MODULE_SET = new Set(KEEP_MODULES);
const CUT_MODULE_SET = new Set(CUT_MODULES);

const KEEP_PREFIXES = [
  ['base/', 'foundation used by Blink, V8, and the host'],
  ['cc/', 'compositor between Blink and Skia'],
  ['gpu/', 'GPU process used by Skia and WebGPU'],
  ['skia/', 'Skia paint'],
  ['ui/', 'window and aura the host paints in'],
  ['net/', 'loads the document'],
  ['url/', 'URL support used by the loader'],
  ['ipc/', 'process plumbing for the host'],
  ['mojo/', 'process plumbing for the host'],
  ['sandbox/', 'renderer sandbox'],
  ['gin/', 'V8 bindings'],
  ['v8/', 'JS engine'],
  ['content/', 'embed API the host runs'],
  ['media/', 'video and audio playback'],
  ['electron/', 'host shell'],
  ['storage/', 'localStorage'],
  ['services/network/', 'loader'],
  ['services/viz/', 'display compositor'],
  ['services/audio/', 'audio output'],
  ['services/video_capture/', 'capture used by the shader path'],
  ['components/viz/', 'display compositor'],
  ['components/embedder_support/', 'content embed'],
  ['components/services/storage/', 'localStorage'],
  ['third_party/electron_node/', 'Node, part of the JS engine'],
  ['third_party/v8/', 'JS engine'],
  ['third_party/skia/', 'Skia paint'],
  ['third_party/dawn/', 'WebGPU and the Skia Dawn backend'],
  ['third_party/icu/', 'strings for V8 and Blink'],
  ['third_party/zlib/', 'deflate used by the loader and images'],
  ['third_party/abseil-cpp/', 'base library pulled by the paint and JS stacks'],
  ['third_party/boringssl/', 'TLS for the loader'],
  ['third_party/ffmpeg/', 'video decode'],
  ['third_party/libvpx/', 'video decode'],
  ['third_party/libwebp/', 'webp images'],
  ['third_party/libaom/', 'video decode'],
  ['third_party/dav1d/', 'video decode'],
  ['third_party/opus/', 'audio decode'],
  ['third_party/libopus/', 'audio decode'],
  ['third_party/openh264/', 'video decode'],
  ['third_party/libyuv/', 'pixel conversion'],
  ['third_party/libpng/', 'png images'],
  ['third_party/libjpeg_turbo/', 'jpeg images'],
  ['third_party/harfbuzz/', 'text shaping'],
  ['third_party/freetype/', 'fonts'],
  ['third_party/wuffs/', 'image decode'],
  ['third_party/brotli/', 'content decoding'],
  ['third_party/snappy/', 'compression used inside the engine'],
  ['third_party/leveldatabase/', 'localStorage'],
  ['third_party/libc++/', 'C++ runtime'],
  ['third_party/libc++abi/', 'C++ runtime'],
  ['third_party/spirv-tools/', 'shader compiler for Dawn / WebGPU'],
  ['third_party/spirv-headers/', 'shader compiler for Dawn / WebGPU'],
  ['third_party/spirv-cross/', 'shader compiler for Dawn / WebGPU'],
  ['third_party/tint/', 'WGSL compiler for Dawn / WebGPU'],
  ['third_party/vulkan-headers/', 'Vulkan headers used by Dawn'],
  ['third_party/vulkan-utility-libraries/', 'Vulkan helpers used by Dawn'],
  ['third_party/glslang/', 'shader compiler pulled by Dawn'],
  ['crypto/', 'crypto wrapper the loader uses'],
  ['third_party/blink/renderer/core/', 'Blink DOM, CSS, and layout'],
  ['third_party/blink/renderer/platform/', 'Blink platform'],
  ['third_party/blink/renderer/controller/', 'Blink frame control'],
  ['third_party/blink/renderer/bindings/core/', 'V8 bindings for the DOM'],
  ['third_party/blink/public/', 'Blink public API'],
  ['third_party/blink/common/', 'Blink shared types'],
];

const CUT_PREFIXES = [
  ['chrome/', 'Chrome browser product. Electron still compiles pieces of it into the host.'],
  ['extensions/', 'Chrome extensions'],
  ['printing/', 'printing'],
  ['components/printing/', 'printing'],
  ['components/pdf/', 'PDF'],
  ['pdf/', 'PDF'],
  ['third_party/pdfium/', 'PDF'],
  ['third_party/webrtc/', 'WebRTC'],
  ['third_party/angle/', 'ANGLE / GL. Skia in this build uses Dawn. ANGLE is the WebGL backend.'],
  ['third_party/swiftshader/', 'software GL / Vulkan fallback'],
  ['third_party/dawn/src/dawn/native/opengl/', 'Dawn OpenGL backend. Windows WebGPU and Skia use D3D.'],
  ['gpu/command_buffer/client/gles2', 'GLES2 command buffer used by WebGL'],
  ['gpu/command_buffer/service/gles2', 'GLES2 command buffer used by WebGL'],
  ['components/password_manager/', 'Chrome password manager'],
  ['components/autofill/', 'Chrome autofill'],
  ['components/optimization_guide/', 'Chrome optimization guide'],
  ['components/policy/', 'Chrome enterprise policy'],
  ['components/enterprise/', 'Chrome enterprise'],
  ['components/page_load_metrics/', 'Chrome page-load metrics'],
  ['components/signin/', 'Chrome sign-in'],
  ['components/download/', 'Chrome downloads'],
  ['components/user_education/', 'Chrome user education'],
  ['components/attribution_reporting/', 'Chrome attribution reporting'],
  ['components/paint_preview/', 'Chrome paint preview'],
  ['components/performance_manager/', 'Chrome performance manager'],
  ['services/shape_detection/', 'shape detection'],
  ['services/on_device_model/', 'on-device model'],
  ['services/media_session/', 'media session API'],
  ['services/metrics/', 'Chrome metrics'],
  ['device/bluetooth/', 'Bluetooth'],
  ['device/gamepad/', 'gamepad'],
  ['device/fido/', 'FIDO / WebAuthn'],
  ['device/usb/', 'USB'],
  ['device/hid/', 'HID'],
  ['device/serial/', 'serial'],
  ['device/vr/', 'WebXR / VR'],
  ['device/nfc/', 'NFC'],
  ['media/midi/', 'WebMIDI'],
  ['third_party/openscreen/', 'Open Screen / Cast'],
  ['third_party/ink/', 'Chrome ink engine'],
];

function unescapeNinja(s) {
  let out = '';
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== '$') {
      out += s[i];
      continue;
    }
    const n = s[i + 1];
    if (n === undefined) break;
    out += n === '$' ? '$' : n;
    i++;
  }
  return out;
}

function logicalLines(text) {
  const raw = text.split(/\r?\n/);
  const lines = [];
  let cur = '';
  for (const line of raw) {
    cur = cur ? cur + line : line;
    let dollars = 0;
    for (let i = cur.length - 1; i >= 0 && cur[i] === '$'; i--) dollars++;
    if (dollars % 2 === 1) {
      cur = cur.slice(0, -1);
      continue;
    }
    lines.push(cur);
    cur = '';
  }
  if (cur) lines.push(cur);
  return lines;
}

function parseBuilds(text) {
  const builds = [];
  let current = null;
  for (const line of logicalLines(text)) {
    if (line.startsWith('build ')) {
      const unesc = unescapeNinja(line);
      const colon = unesc.indexOf(': ');
      if (colon < 0) {
        current = null;
        continue;
      }
      const outputs = unesc.slice('build '.length, colon).split(/\s+/).filter(Boolean);
      const rest = unesc.slice(colon + 2);
      const space = rest.indexOf(' ');
      const rule = space < 0 ? rest : rest.slice(0, space);
      let inputs = space < 0 ? '' : rest.slice(space + 1);
      const bar = inputs.indexOf(' |');
      if (bar >= 0) inputs = inputs.slice(0, bar);
      current = {
        outputs,
        rule,
        inputs: inputs.split(/\s+/).filter(Boolean),
        vars: {},
      };
      builds.push(current);
      continue;
    }
    if (current && line.startsWith('  ') && line.includes(' =')) {
      const body = line.trim();
      const eq = body.indexOf(' =');
      if (eq > 0) current.vars[body.slice(0, eq).trim()] = unescapeNinja(body.slice(eq + 3).trim());
    } else if (line && !line.startsWith(' ')) {
      current = null;
    }
  }
  return builds;
}

function normSrc(p) {
  let s = p.replace(/\\/g, '/');
  while (s.startsWith('../')) s = s.slice(3);
  if (s.startsWith('./')) s = s.slice(2);
  if (s.toLowerCase().startsWith('out/release/')) s = s.slice('out/release/'.length);
  if (s.startsWith('gen/')) s = s.slice('gen/'.length);
  return s;
}

function isPhone(p) {
  if (p.includes('third_party/libc++/') || p.includes('third_party/electron_node/')) return false;
  if (/(?:^|\/)(?:android|ios)(?:\/|$)/i.test(p)) {
    if (p.includes('/protos/') || p.includes('/proto/') || /\.(pb|mojom)([-.]|$)/.test(p)) return false;
    return true;
  }
  if (/(?:^|[/_.-])(?:android|ios)\.(?:cc|cpp|c|mm|h)$/i.test(p)) return true;
  if (/(?:dawn|webgpu|gpu)\//.test(p) && /(?:Android|IOS)[^/]*\.(?:cpp|cc|h)$/.test(p)) return true;
  return false;
}

function isMacOnly(p) {
  return /(?:^|\/)(?:mac|macos|darwin|cocoa|appkit)(?:\/|$)|(?:^|\/)metal(?:\/|$)|_mac\.mm$|\.mm$/i.test(p);
}

function isWebGL(p) {
  if (p.includes('/modules/webgl/') || p.includes('/webgl/')) return true;
  if (p.includes('bindings/modules/') && p.split('/').pop().includes('webgl')) return true;
  if (p.includes('gpu/command_buffer/') && /gles2/i.test(p)) return true;
  return false;
}

function moduleOf(p) {
  const folder = p.match(/blink\/renderer\/modules\/([^/]+)/);
  if (folder) return folder[1];
  if (!p.includes('blink/renderer/bindings/modules/')) return null;
  const file = p.split('/').pop();
  if (/^v8_(window|document|navigator|worker|dedicated_worker|shared_worker|binding_for_modules|svg_)/.test(file)) {
    return '__shared__';
  }
  const compact = file.replace(/_/g, '');
  for (const name of MODULE_NAMES) {
    if (compact.includes(name.replace(/_/g, ''))) return name;
  }
  for (const [re, name] of BINDING_ALIASES) {
    if (re.test(file)) return name;
  }
  return '__bindings__';
}

function classify(src) {
  let p = normSrc(src);
  if (p.startsWith('obj/')) p = p.slice('obj/'.length);
  if (isWebGL(p)) {
    return { verdict: 'cut', cluster: 'WebGL', why: 'Hallu never opens a WebGL context. Canvas 2D and WebGPU stay.' };
  }
  if (isPhone(p)) {
    return {
      verdict: 'cut',
      cluster: 'iOS and Android',
      why: 'iOS or Android implementation file compiled into this Windows link. Dawn and Blink WebGPU phone backends are not in this link.',
    };
  }
  if (isMacOnly(p)) {
    return {
      verdict: 'mac',
      cluster: 'Mac source inside the Windows link',
      why: 'Unhook from this Windows link if it contributes bytes. Do not delete the source. Mac stays.',
    };
  }
  if (p.includes('/dawn/native/opengl/') || p.includes('/dawn/native/opengl')) {
    return {
      verdict: 'cut',
      cluster: 'Dawn OpenGL backend',
      why: 'This build paints Skia with Dawn. Windows WebGPU uses D3D, not Dawn OpenGL.',
    };
  }
  const mod = moduleOf(p);
  if (mod === '__shared__') {
    return {
      verdict: 'keep',
      cluster: 'blink/bindings shared',
      why: 'Generated Window, Document, and Worker bindings. They get smaller when unused modules are unhooked.',
    };
  }
  if (mod === '__bindings__') {
    return {
      verdict: 'review',
      cluster: 'blink/bindings/modules',
      why: 'Generated module bindings that did not match a keep or cut module.',
    };
  }
  if (mod && KEEP_MODULE_SET.has(mod)) {
    return { verdict: 'keep', cluster: `blink/modules/${mod}`, why: 'Hallu calls this web API, or playback depends on it.' };
  }
  if (mod && CUT_MODULE_SET.has(mod)) {
    return { verdict: 'cut', cluster: `blink/modules/${mod}`, why: 'Blink module Hallu does not call.' };
  }
  if (mod) {
    return { verdict: 'review', cluster: `blink/modules/${mod}`, why: 'Blink module outside the keep and cut sets.' };
  }
  for (const [prefix, why] of CUT_PREFIXES) {
    if (p.startsWith(prefix) || p.includes(`/${prefix}`)) {
      return { verdict: 'cut', cluster: prefix.replace(/\/$/, ''), why };
    }
  }
  for (const [prefix, why] of KEEP_PREFIXES) {
    if (p.startsWith(prefix)) return { verdict: 'keep', cluster: prefix.replace(/\/$/, ''), why };
  }
  const parts = p.split('/');
  const cluster = parts[0] === 'third_party' || parts[0] === 'components' || parts[0] === 'services' || parts[0] === 'device'
    ? `${parts[0]}/${parts[1] || ''}`
    : (parts[0] || 'unknown');
  return {
    verdict: 'review',
    cluster,
    why: 'Linked into hallu.exe, outside the Blink→Skia + V8 + Node keep set, and not a named cut.',
  };
}

function findHalluBuild() {
  const ninjaPath = path.join(OUT, 'obj', 'electron', 'electron_app.ninja');
  const text = fs.readFileSync(ninjaPath, 'utf8');
  const builds = parseBuilds(text);
  const hit = builds.find((b) => b.outputs.some((o) => o.replace(/\\/g, '/').endsWith('/hallu.exe') || o === 'hallu.exe' || o === './hallu.exe'));
  if (!hit) throw new Error('no hallu.exe link edge in obj/electron/electron_app.ninja');
  return hit;
}

function ownerNinja(obj) {
  const slash = obj.replace(/\\/g, '/');
  const dir = path.posix.dirname(slash);
  const parent = path.posix.dirname(dir);
  for (const rel of [`${dir}.ninja`, `${parent}.ninja`]) {
    if (fs.existsSync(path.join(OUT, rel))) return rel;
  }
  return `${dir}.ninja`;
}

function parseThinMembers(absLib) {
  let buf;
  try {
    buf = fs.readFileSync(absLib);
  } catch {
    return null;
  }
  if (buf.length < 8 || buf.toString('ascii', 0, 8) !== '!<thin>\n') return null;
  let off = 8;
  let strtab = '';
  const members = [];
  while (off + 60 <= buf.length) {
    const trimmed = buf.toString('ascii', off, off + 16).trim();
    const size = parseInt(buf.toString('ascii', off + 48, off + 58).trim(), 10);
    const fmag = buf.toString('ascii', off + 58, off + 60);
    if (fmag !== '`\n' || !Number.isFinite(size) || size < 0) break;
    const data = off + 60;
    if (trimmed.startsWith('//')) {
      strtab = buf.toString('utf8', data, data + size);
      off = data + size;
      if (off % 2) off++;
    } else if (trimmed === '/') {
      off = data + size;
      if (off % 2) off++;
    } else if (trimmed.startsWith('/')) {
      const idx = parseInt(trimmed.slice(1), 10);
      const nl = strtab.indexOf('\n', idx);
      const raw = (nl < 0 ? strtab.slice(idx) : strtab.slice(idx, nl)).replace(/\/$/, '');
      if (raw) members.push(raw);
      off = data;
    } else {
      const raw = trimmed.replace(/\/$/, '');
      if (raw) members.push(raw);
      off = data;
    }
  }
  return members;
}

function resolveMember(libRel, member) {
  const base = path.posix.dirname(libRel.replace(/\\/g, '/'));
  const joined = path.posix.normalize(path.posix.join(base, member.replace(/\\/g, '/')));
  if (joined.startsWith('..')) return null;
  return joined;
}

function indexSources(objRels) {
  const wanted = new Set(objRels);
  const found = new Map();
  const byNinja = new Map();
  for (const obj of wanted) {
    const slash = obj.replace(/\\/g, '/');
    const candidate = ownerNinja(slash);
    if (!byNinja.has(candidate)) byNinja.set(candidate, []);
    byNinja.get(candidate).push(slash);
  }
  for (const [rel, objs] of byNinja) {
    const abs = path.join(OUT, rel);
    if (!fs.existsSync(abs)) continue;
    const need = new Set(objs);
    const text = fs.readFileSync(abs, 'utf8');
    for (const line of logicalLines(text)) {
      if (!line.startsWith('build ')) continue;
      const unesc = unescapeNinja(line);
      const colon = unesc.indexOf(': ');
      if (colon < 0) continue;
      const outputs = unesc.slice('build '.length, colon).split(/\s+/);
      const interesting = outputs.filter((o) => need.has(o.replace(/\\/g, '/')));
      if (!interesting.length) continue;
      const rest = unesc.slice(colon + 2);
      const space = rest.indexOf(' ');
      const inputs = (space < 0 ? '' : rest.slice(space + 1)).split(' |')[0].trim().split(/\s+/);
      const src = inputs.find((i) => /\.(cc|c|cpp|cxx|mm|m|S|asm|rc)$/i.test(i)) || inputs[0] || '';
      for (const o of interesting) found.set(o.replace(/\\/g, '/'), src);
    }
  }
  return found;
}

function fileSize(rel) {
  try {
    return fs.statSync(path.join(OUT, rel)).size;
  } catch {
    return 0;
  }
}

function fmt(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

function add(groups, item) {
  const key = `${item.verdict}\0${item.cluster}`;
  let g = groups.get(key);
  if (!g) {
    g = { verdict: item.verdict, cluster: item.cluster, why: item.why, bytes: 0, files: [] };
    groups.set(key, g);
  }
  g.bytes += item.bytes;
  g.files.push(item);
}

function table(rows) {
  const head = '| Cluster | Objects | Pre-LTO size | Why |\n|---|---:|---:|---|';
  const body = rows.map((g) => `| ${g.cluster} | ${g.files.length} | ${fmt(g.bytes)} | ${g.why.replace(/\|/g, '/')} |`);
  return [head, ...body].join('\n');
}

function fileList(groups) {
  const chunks = [];
  for (const g of groups) {
    chunks.push(`### ${g.verdict} / ${g.cluster}`, '', g.why, '');
    const files = [...g.files].sort((a, b) => b.bytes - a.bytes || a.source.localeCompare(b.source));
    for (const f of files) {
      chunks.push(`- \`${f.source}\` — ${fmt(f.bytes)}`);
    }
    chunks.push('');
  }
  return chunks.join('\n');
}

function main() {
  const exe = path.join(OUT, 'hallu.exe');
  const exeSize = fs.statSync(exe).size;
  const build = findHalluBuild();
  const inputs = [];
  for (const token of build.inputs) {
    if (token.startsWith('@')) {
      const rsp = token.slice(1);
      const text = fs.readFileSync(path.join(OUT, rsp), 'utf8');
      for (const part of text.split(/\s+/)) if (part) inputs.push(part.replace(/^"|"$/g, ''));
    } else {
      inputs.push(token);
    }
  }
  const libs = (build.vars.libs || '').split(/\s+/).filter(Boolean);
  const seen = new Set();
  const objs = [];
  const leftovers = [];
  let thinMembers = 0;
  const consider = [...inputs, ...libs];
  for (const token of consider) {
    const rel = token.replace(/\\/g, '/');
    if (seen.has(rel)) continue;
    seen.add(rel);
    if (/\.(obj|o)$/i.test(rel)) {
      objs.push(rel);
      continue;
    }
    if (/\.lib$/i.test(rel)) {
      const members = parseThinMembers(path.join(OUT, rel));
      if (!members) {
        leftovers.push(rel);
        continue;
      }
      for (const member of members) {
        const obj = resolveMember(rel, member);
        if (!obj || seen.has(obj)) continue;
        seen.add(obj);
        objs.push(obj);
        thinMembers++;
      }
      continue;
    }
    leftovers.push(rel);
  }
  console.error(`objects: ${objs.length} (${thinMembers} from thin archives), leftovers ${leftovers.length}`);
  const sources = indexSources(objs);
  console.error(`mapped sources: ${sources.size}`);

  const groups = new Map();
  let objBytes = 0;
  let unmapped = 0;
  for (const obj of objs) {
    const src = sources.get(obj) || '';
    const bytes = fileSize(obj);
    objBytes += bytes;
    if (!src) unmapped++;
    const c = classify(src || obj);
    add(groups, { ...c, source: src ? normSrc(src) : obj, obj, bytes });
  }
  for (const extra of leftovers) {
    const bytes = fileSize(extra);
    if (!bytes) continue;
    const c = classify(extra);
    add(groups, { ...c, source: normSrc(extra), obj: extra, bytes });
  }

  const all = [...groups.values()].sort((a, b) => b.bytes - a.bytes);
  const cuts = all.filter((g) => g.verdict === 'cut');
  const mac = all.filter((g) => g.verdict === 'mac');
  const review = all.filter((g) => g.verdict === 'review');
  const keep = all.filter((g) => g.verdict === 'keep');
  const sum = (list) => list.reduce((n, g) => n + g.bytes, 0);

  const siblingDlls = ['ffmpeg.dll', 'libGLESv2.dll', 'libEGL.dll', 'dxcompiler.dll', 'vk_swiftshader.dll', 'vulkan-1.dll']
    .filter((name) => fs.existsSync(path.join(OUT, name)))
    .map((name) => `- \`${name}\` — ${fmt(fs.statSync(path.join(OUT, name)).size)}`);

  const lines = [
    '# Code linked into hallu.exe that Hallu does not use',
    '',
    'This is the link of `out/Release/hallu.exe`, not a scan of source that ninja never compiled. The earlier unused-by-electron purge deleted the second kind. That shrinks the checkout. This list is the first kind: objects the linker still receives.',
    '',
    'Node is part of the JS engine and stays with V8. The keep set is the closure that paints a window and runs the editor: Blink DOM/CSS/layout, `cc`, viz, the GPU process, Skia through Dawn, canvas 2D, WebGPU, video and audio playback, localStorage, the loader, and the Electron host. WebGL is a cut. Dawn and Blink WebGPU iOS/Android backends are not in this Windows link. Mac, Darwin, Cocoa, and Metal source stays even when a Mac object was linked into this binary.',
    '',
    'Sizes are the `.obj` files the link receives, before ThinLTO. Thin static libraries are opened and their member objects are counted instead of the library index. ThinLTO drops and inlines, so these numbers rank features. They are not the number of bytes that would leave the exe. This build has no linker map.',
    '',
    'Nothing here was deleted. A later cut unhooks one cluster in GN, rebuilds, and checks that `hallu.exe` got smaller and the editor still runs.',
    '',
    '## Binary',
    '',
    `- \`hallu.exe\` — ${fmt(exeSize)}`,
    `- object files in the link — ${objs.length} files, ${fmt(objBytes)} pre-LTO`,
    `- objects with no source mapping — ${unmapped}`,
    '',
    siblingDlls.length ? `DLLs that sit beside the exe, not inside it:\n\n${siblingDlls.join('\n')}` : '',
    '',
    '## Regenerate',
    '',
    '```powershell',
    'node "docs/stage-3-shrink-hallu-exe/scan-linked-but-unused-by-hallu.mjs"',
    '```',
    '',
    `Run from the hallulium docs repo. The script only reads \`${OUT}\`.`,
    '',
    '## Cut candidates',
    '',
    `${fmt(sum(cuts))} pre-LTO across ${cuts.reduce((n, g) => n + g.files.length, 0)} objects.`,
    '',
    table(cuts),
    '',
    '## Mac objects in this Windows link',
    '',
    mac.length
      ? `${fmt(sum(mac))} pre-LTO. Unhook from the Windows link only. Leave the source on disk.`
      : 'None of the linked objects look Mac-only.',
    '',
    mac.length ? table(mac) : '',
    '',
    '## Review',
    '',
    'Linked, outside the keep spine, and not one of the named cuts. Treat these as unused by Hallu until a cluster turns out to be load-bearing for paint, video, or the host.',
    '',
    `${fmt(sum(review))} pre-LTO across ${review.reduce((n, g) => n + g.files.length, 0)} objects.`,
    '',
    table(review),
    '',
    '## Keep spine',
    '',
    'Counted so the complement above is checkable. Not a delete list.',
    '',
    `${fmt(sum(keep))} pre-LTO across ${keep.reduce((n, g) => n + g.files.length, 0)} objects.`,
    '',
    table(keep),
    '',
    '## Files outside the keep spine',
    '',
    fileList([...cuts, ...mac, ...review]),
  ];

  fs.writeFileSync(MD, lines.filter((l) => l !== undefined).join('\n'));
  console.error(`wrote ${MD}`);
  console.error(`cut ${fmt(sum(cuts))}  mac ${fmt(sum(mac))}  review ${fmt(sum(review))}  keep ${fmt(sum(keep))}`);
  for (const g of cuts.slice(0, 25)) console.error(`  cut  ${fmt(g.bytes).padStart(10)}  ${g.cluster}`);
  for (const g of review.slice(0, 25)) console.error(`  rev  ${fmt(g.bytes).padStart(10)}  ${g.cluster}`);
}

main();
