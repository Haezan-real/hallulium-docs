/**
 * Remove Blink modules Hallu does not call from the module list, IDL list,
 * and disk. Does not touch the keep spine (canvas, webgpu, media, storage).
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = process.env.HALLULIUM_SRC || 'C:\\hallulium\\src';

const CUT = [
  'ad_auction', 'ai', 'animationworklet', 'app_banner', 'background_fetch',
  'background_sync', 'badging', 'battery', 'beacon', 'bluetooth',
  'browsing_topics', 'cache_storage', 'compute_pressure', 'contacts_picker',
  'content_extraction', 'content_index', 'cookie_store', 'credentialmanagement',
  'csspaint', 'device_orientation', 'device_posture', 'direct_sockets',
  'document_metadata', 'document_picture_in_picture', 'eyedropper',
  'file_system_access', 'filesystem', 'font_access', 'gamepad', 'handwriting',
  'hid', 'idle', 'installation', 'installedapp', 'launch', 'locked_mode',
  'managed_device', 'ml', 'navigatorcontentutils', 'nfc', 'notifications',
  'payments', 'peerconnection', 'picture_in_picture', 'presentation', 'printing',
  'push_messaging', 'remoteplayback', 'screen_details', 'sensor', 'serial',
  'service_worker', 'shapedetection', 'shared_storage', 'smart_card', 'speech',
  'subapps', 'vibration', 'wake_lock', 'web_install', 'webgl', 'webmidi',
  'webrtc', 'webshare', 'webtransport', 'webusb', 'window_controls_overlay', 'xr',
];

const roots = [
  'third_party/blink',
  'content',
  'electron',
  'components',
  'chrome',
  'gpu',
  'device',
  'services',
  'media',
  'third_party/webrtc_overrides',
].map((rel) => path.join(SRC, rel));

function walk(dir, out) {
  let ents;
  try {
    ents = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const ent of ents) {
    if (ent.name === 'out' || ent.name === '.git' || ent.name === 'node_modules') continue;
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(abs, out);
    else if (ent.name.endsWith('.gn') || ent.name.endsWith('.gni')) out.push(abs);
  }
}

const files = [];
for (const root of roots) walk(root, files);

const needles = CUT.map((name) => `/modules/${name}`);
let removedLines = 0;
let touched = 0;
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  const next = lines.filter((line) => !needles.some((needle) => line.includes(needle)));
  if (next.length !== lines.length) {
    removedLines += lines.length - next.length;
    touched++;
    const eol = text.includes('\r\n') ? '\r\n' : '\n';
    fs.writeFileSync(file, next.join(eol));
  }
}

const modulesDir = path.join(SRC, 'third_party', 'blink', 'renderer', 'modules');
let deleted = 0;
for (const name of CUT) {
  const dir = path.join(modulesDir, name);
  if (!fs.existsSync(dir)) continue;
  fs.rmSync(dir, { recursive: true, force: true });
  deleted++;
}

console.log(`gn files touched: ${touched}`);
console.log(`lines removed: ${removedLines}`);
console.log(`module dirs deleted: ${deleted}`);
