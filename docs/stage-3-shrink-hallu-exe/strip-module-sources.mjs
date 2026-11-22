import fs from 'node:fs';

const file = 'C:/hallulium/src/third_party/blink/renderer/modules/BUILD.gn';
const cut = new Set(
  'ad_auction ai animationworklet app_banner background_fetch background_sync badging battery beacon bluetooth browsing_topics cache_storage compute_pressure contacts_picker content_extraction content_index cookie_store credentialmanagement csspaint device_orientation device_posture direct_sockets document_metadata document_picture_in_picture eyedropper file_system_access filesystem font_access gamepad handwriting hid idle installation installedapp launch locked_mode managed_device ml navigatorcontentutils nfc notifications payments peerconnection picture_in_picture presentation printing push_messaging remoteplayback screen_details sensor serial service_worker shapedetection shared_storage smart_card speech subapps vibration wake_lock web_install webgl webmidi webrtc webshare webtransport webusb window_controls_overlay xr'.split(' '),
);
const text = fs.readFileSync(file, 'utf8');
const eol = text.includes('\r\n') ? '\r\n' : '\n';
let removed = 0;
const next = text.split(/\r?\n/).filter((line) => {
  const match = line.match(/"([a-z0-9_]+)\//);
  if (match && cut.has(match[1])) {
    removed++;
    return false;
  }
  return true;
});
fs.writeFileSync(file, next.join(eol));
console.log('removed', removed);
