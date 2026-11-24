# False android/ios name matches

Held back from the phone-name cut. `ios` in these names is letters inside another word, not the iOS platform.

A name is a real platform name when it contains `android`, or `ios` as its own token (`ios`, `_ios`, `ios_`), or `ios` plus a version or index (`ios18`, `ios6`, `ddljson_ios0`), or `iosbuild` / `iossim`.

`chrome/android/` is not in this list. It is a real Android tree, and Windows still imports `chrome/android/modules/buildflags.gni`.

Held back: 32 folders and 371 files.

2 more false names sit inside a real Android or iOS folder. They are not kept on their own; deleting that parent still removes them.

## audio (17)

- `components/policy/resources/templates/policy_definitions/Miscellaneous/AudioSandboxEnabled.yaml` — file
- `components/policy/test/data/pref_mapping/AudioSandboxEnabled.json` — file
- `third_party/skia/tools/viewer/AudioSlide.cpp` — file
- `third_party/webrtc/modules/audio_device/linux/pulseaudiosymboltable_linux.cc` — file
- `third_party/webrtc/modules/audio_device/linux/pulseaudiosymboltable_linux.h` — file
- `third_party/webrtc/sdk/objc/api/peerconnection/RTCAudioSource+Private.h` — file
- `third_party/webrtc/sdk/objc/api/peerconnection/RTCAudioSource.h` — file
- `third_party/webrtc/sdk/objc/api/peerconnection/RTCAudioSource.mm` — file
- `third_party/webrtc/sdk/objc/components/audio/RTCAudioSession+Configuration.mm` — file
- `third_party/webrtc/sdk/objc/components/audio/RTCAudioSession+Private.h` — file
- `third_party/webrtc/sdk/objc/components/audio/RTCAudioSession.h` — file
- `third_party/webrtc/sdk/objc/components/audio/RTCAudioSession.mm` — file
- `third_party/webrtc/sdk/objc/components/audio/RTCAudioSessionConfiguration.h` — file
- `third_party/webrtc/sdk/objc/components/audio/RTCAudioSessionConfiguration.m` — file
- `third_party/webrtc/sdk/objc/components/audio/RTCNativeAudioSessionDelegateAdapter.h` — file
- `third_party/webrtc/sdk/objc/components/audio/RTCNativeAudioSessionDelegateAdapter.mm` — file
- `third_party/webrtc/sdk/objc/unittests/RTCAudioSessionTest.mm` — file

## iosfwd (3)

- `third_party/libc++/src/include/__cxx03/iosfwd` — file
- `third_party/libc++/src/include/iosfwd` — file
- `third_party/libc++/src/modules/std/iosfwd.inc` — file

## iosock (2)

- `third_party/rust-toolchain/lib/rustlib/rustc-src/rust/compiler/rustc_target/src/spec/targets/aarch64_unknown_nto_qnx710_iosock.rs` — file
- `third_party/rust-toolchain/lib/rustlib/rustc-src/rust/compiler/rustc_target/src/spec/targets/x86_64_pc_nto_qnx710_iosock.rs` — file

## iostat (8)

- `third_party/perfetto/src/traced/probes/ftrace/test/data/synthetic/events/f2fs/f2fs_iostat` — folder
- `third_party/perfetto/src/traced/probes/ftrace/test/data/synthetic/events/f2fs/f2fs_iostat_latency` — folder
- `components/policy/resources/templates/policy_definitions/UserAndDeviceReporting/ReportDeviceAudioStatus.yaml` — file
- `components/policy/resources/templates/policy_definitions/UserAndDeviceReporting/ReportDeviceAudioStatusCheckingRateMs.yaml` — file
- `components/policy/test/data/pref_mapping/ReportDeviceAudioStatus.json` — file
- `components/policy/test/data/pref_mapping/ReportDeviceAudioStatusCheckingRateMs.json` — file
- `third_party/perfetto/src/trace_processor/importers/ftrace/iostat_tracker.cc` — file
- `third_party/perfetto/src/trace_processor/importers/ftrace/iostat_tracker.h` — file

## iostream (11)

- `third_party/abseil-cpp/absl/random/internal/iostream_state_saver.h` — file
- `third_party/abseil-cpp/absl/random/internal/iostream_state_saver_test.cc` — file
- `third_party/electron_node/deps/LIEF/include/LIEF/iostream.hpp` — file
- `third_party/electron_node/deps/LIEF/src/iostream.cpp` — file
- `third_party/electron_node/deps/v8/third_party/abseil-cpp/absl/random/internal/iostream_state_saver.h` — file
- `third_party/electron_node/deps/v8/third_party/abseil-cpp/absl/random/internal/iostream_state_saver_test.cc` — file
- `third_party/libc++/src/include/__cxx03/iostream` — file
- `third_party/libc++/src/include/iostream` — file
- `third_party/libc++/src/modules/std/iostream.inc` — file
- `third_party/libc++/src/src/iostream.cpp` — file
- `third_party/libc++/src/src/iostream_init.h` — file

## iosurface (16)

- `gpu/command_buffer/service/shared_image/iosurface_image_backing.h` — file
- `gpu/command_buffer/service/shared_image/iosurface_image_backing.mm` — file
- `gpu/command_buffer/service/shared_image/iosurface_image_backing_factory.h` — file
- `gpu/command_buffer/service/shared_image/iosurface_image_backing_factory.mm` — file
- `gpu/command_buffer/service/shared_image/iosurface_image_backing_factory_unittest.cc` — file
- `third_party/angle/extensions/EGL_ANGLE_iosurface_client_buffer.txt` — file
- `third_party/angle/src/libANGLE/renderer/gl/cgl/IOSurfaceSurfaceCGL.cpp` — file
- `third_party/angle/src/libANGLE/renderer/gl/cgl/IOSurfaceSurfaceCGL.h` — file
- `third_party/angle/src/libANGLE/renderer/metal/IOSurfaceSurfaceMtl.h` — file
- `third_party/angle/src/libANGLE/renderer/metal/IOSurfaceSurfaceMtl.mm` — file
- `third_party/angle/src/libANGLE/renderer/vulkan/mac/IOSurfaceSurfaceVkMac.h` — file
- `third_party/angle/src/libANGLE/renderer/vulkan/mac/IOSurfaceSurfaceVkMac.mm` — file
- `third_party/dawn/src/dawn/common/IOSurfaceUtils.cpp` — file
- `third_party/dawn/src/dawn/common/IOSurfaceUtils.h` — file
- `third_party/webrtc/modules/desktop_capture/mac/desktop_frame_iosurface.h` — file
- `third_party/webrtc/modules/desktop_capture/mac/desktop_frame_iosurface.mm` — file

## kiosk (304)

- `chrome/browser/ash/policy/reporting/metrics_reporting/kiosk_heartbeat` — folder
- `chrome/browser/extensions/api/enterprise_kiosk_input` — folder
- `chrome/test/data/chromeos/app_mode/apps_and_extensions/enterprise_kiosk_test_app` — folder
- `chrome/test/data/chromeos/app_mode/apps_and_extensions/kiosk_base_test_app` — folder
- `chrome/test/data/chromeos/app_mode/apps_and_extensions/kiosk_test_app` — folder
- `chrome/test/data/chromeos/app_mode/apps_and_extensions/multi_app_kiosk` — folder
- `chrome/test/data/chromeos/app_mode/apps_and_extensions/non_kiosk_enabled_app` — folder
- `chrome/test/data/chromeos/app_mode/apps_and_extensions/offline_enabled_kiosk_app` — folder
- `chrome/test/data/extensions/api_test/bluetooth_low_energy/create_service_kiosk_session_only` — folder
- `chrome/test/data/extensions/api_test/bluetooth_low_energy/create_service_no_kiosk_mode` — folder
- `chrome/test/data/extensions/api_test/bluetooth_low_energy/register_advertisement_kiosk_session_only` — folder
- `chrome/test/data/extensions/api_test/bluetooth_low_energy/register_advertisement_no_kiosk_mode` — folder
- `chrome/test/data/extensions/api_test/file_system/get_volume_list_not_kiosk_session` — folder
- `chrome/test/data/extensions/api_test/file_system/request_file_system_not_kiosk_session` — folder
- `chrome/test/data/extensions/api_test/video_capture/camera_pan_tilt_zoom_kiosk_session_only` — folder
- `chrome/test/data/extensions/api_test/video_capture/camera_pan_tilt_zoom_no_kiosk_session` — folder
- `chrome/test/data/extensions/kiosk` — folder
- `chrome/test/data/extensions/kiosk/kiosk_only` — folder
- `chromeos/components/kiosk` — folder
- `components/policy/resources/templates/policy_definitions/Kiosk` — folder
- `extensions/browser/kiosk` — folder
- `extensions/test/data/api_test/cec_private/non_kiosk_api_not_available` — folder
- `third_party/blink/renderer/extensions/chromeos/kiosk` — folder
- `tools/metrics/histograms/metadata/kiosk` — folder
- `chrome/browser/apps/app_service/chrome_app_deprecation/chrome_app_deprecation_kiosk_browsertest.cc` — file
- `chrome/browser/ash/app_mode/arcvm_app/kiosk_arcvm_app_data.cc` — file
- `chrome/browser/ash/app_mode/arcvm_app/kiosk_arcvm_app_data.h` — file
- `chrome/browser/ash/app_mode/arcvm_app/kiosk_arcvm_app_launcher.cc` — file
- `chrome/browser/ash/app_mode/arcvm_app/kiosk_arcvm_app_launcher.h` — file
- `chrome/browser/ash/app_mode/arcvm_app/kiosk_arcvm_app_manager.cc` — file
- `chrome/browser/ash/app_mode/arcvm_app/kiosk_arcvm_app_manager.h` — file
- `chrome/browser/ash/app_mode/arcvm_app/kiosk_arcvm_app_service.cc` — file
- `chrome/browser/ash/app_mode/arcvm_app/kiosk_arcvm_app_service.h` — file
- `chrome/browser/ash/app_mode/arcvm_app/kiosk_arcvm_app_service_factory.cc` — file
- `chrome/browser/ash/app_mode/arcvm_app/kiosk_arcvm_app_service_factory.h` — file
- `chrome/browser/ash/app_mode/arcvm_app/kiosk_arcvm_app_service_unittest.cc` — file
- `chrome/browser/ash/app_mode/consumer_kiosk_test_helper.cc` — file
- `chrome/browser/ash/app_mode/consumer_kiosk_test_helper.h` — file
- `chrome/browser/ash/app_mode/fake_kiosk_app_launcher.cc` — file
- `chrome/browser/ash/app_mode/fake_kiosk_app_launcher.h` — file
- `chrome/browser/ash/app_mode/fake_kiosk_controller.cc` — file
- `chrome/browser/ash/app_mode/fake_kiosk_controller.h` — file
- `chrome/browser/ash/app_mode/isolated_web_app/kiosk_iwa_data.cc` — file
- `chrome/browser/ash/app_mode/isolated_web_app/kiosk_iwa_data.h` — file
- `chrome/browser/ash/app_mode/isolated_web_app/kiosk_iwa_data_unittest.cc` — file
- `chrome/browser/ash/app_mode/isolated_web_app/kiosk_iwa_launcher.cc` — file
- `chrome/browser/ash/app_mode/isolated_web_app/kiosk_iwa_launcher.h` — file
- `chrome/browser/ash/app_mode/isolated_web_app/kiosk_iwa_manager.cc` — file
- `chrome/browser/ash/app_mode/isolated_web_app/kiosk_iwa_manager.h` — file
- `chrome/browser/ash/app_mode/isolated_web_app/kiosk_iwa_manager_unittest.cc` — file
- `chrome/browser/ash/app_mode/isolated_web_app/kiosk_iwa_policy_util.cc` — file
- `chrome/browser/ash/app_mode/isolated_web_app/kiosk_iwa_policy_util.h` — file
- `chrome/browser/ash/app_mode/kiosk_app.cc` — file
- `chrome/browser/ash/app_mode/kiosk_app.h` — file
- `chrome/browser/ash/app_mode/kiosk_app_data.cc` — file
- `chrome/browser/ash/app_mode/kiosk_app_data.h` — file
- `chrome/browser/ash/app_mode/kiosk_app_data_base.cc` — file
- `chrome/browser/ash/app_mode/kiosk_app_data_base.h` — file
- `chrome/browser/ash/app_mode/kiosk_app_data_delegate.h` — file
- `chrome/browser/ash/app_mode/kiosk_app_icon_loader.cc` — file
- `chrome/browser/ash/app_mode/kiosk_app_icon_loader.h` — file
- `chrome/browser/ash/app_mode/kiosk_app_launch_error.cc` — file
- `chrome/browser/ash/app_mode/kiosk_app_launch_error.h` — file
- `chrome/browser/ash/app_mode/kiosk_app_launch_error_unittest.cc` — file
- `chrome/browser/ash/app_mode/kiosk_app_launcher.cc` — file
- `chrome/browser/ash/app_mode/kiosk_app_launcher.h` — file
- `chrome/browser/ash/app_mode/kiosk_app_manager_base.cc` — file
- `chrome/browser/ash/app_mode/kiosk_app_manager_base.h` — file
- `chrome/browser/ash/app_mode/kiosk_app_manager_observer.h` — file
- `chrome/browser/ash/app_mode/kiosk_app_types.cc` — file
- `chrome/browser/ash/app_mode/kiosk_app_types.h` — file
- `chrome/browser/ash/app_mode/kiosk_app_update_install_gate.cc` — file
- `chrome/browser/ash/app_mode/kiosk_app_update_install_gate.h` — file
- `chrome/browser/ash/app_mode/kiosk_app_update_service.cc` — file
- `chrome/browser/ash/app_mode/kiosk_app_update_service.h` — file
- `chrome/browser/ash/app_mode/kiosk_app_update_service_browsertest.cc` — file
- `chrome/browser/ash/app_mode/kiosk_app_update_service_factory.cc` — file
- `chrome/browser/ash/app_mode/kiosk_app_update_service_factory.h` — file
- `chrome/browser/ash/app_mode/kiosk_chrome_app_manager.cc` — file
- `chrome/browser/ash/app_mode/kiosk_chrome_app_manager.h` — file
- `chrome/browser/ash/app_mode/kiosk_chrome_app_manager_browsertest.cc` — file
- `chrome/browser/ash/app_mode/kiosk_controller.cc` — file
- `chrome/browser/ash/app_mode/kiosk_controller.h` — file
- `chrome/browser/ash/app_mode/kiosk_controller_impl.cc` — file
- `chrome/browser/ash/app_mode/kiosk_controller_impl.h` — file
- `chrome/browser/ash/app_mode/kiosk_crash_restore_browsertest.cc` — file
- `chrome/browser/ash/app_mode/kiosk_cryptohome_remover.cc` — file
- `chrome/browser/ash/app_mode/kiosk_cryptohome_remover.h` — file
- `chrome/browser/ash/app_mode/kiosk_external_update_validator.cc` — file
- `chrome/browser/ash/app_mode/kiosk_external_update_validator.h` — file
- `chrome/browser/ash/app_mode/kiosk_external_updater.cc` — file
- `chrome/browser/ash/app_mode/kiosk_external_updater.h` — file
- `chrome/browser/ash/app_mode/kiosk_guest_view_browsertest.cc` — file
- `chrome/browser/ash/app_mode/kiosk_launch_state.cc` — file
- `chrome/browser/ash/app_mode/kiosk_launch_state.h` — file
- `chrome/browser/ash/app_mode/kiosk_mode_idle_app_name_notification.cc` — file
- `chrome/browser/ash/app_mode/kiosk_mode_idle_app_name_notification.h` — file
- `chrome/browser/ash/app_mode/kiosk_network_state_observer.cc` — file
- `chrome/browser/ash/app_mode/kiosk_network_state_observer.h` — file
- `chrome/browser/ash/app_mode/kiosk_network_state_observer_browsertest.cc` — file
- `chrome/browser/ash/app_mode/kiosk_profile_load_failed_observer.h` — file
- `chrome/browser/ash/app_mode/kiosk_system_session.cc` — file
- `chrome/browser/ash/app_mode/kiosk_system_session.h` — file
- `chrome/browser/ash/app_mode/kiosk_test_helper.cc` — file
- `chrome/browser/ash/app_mode/kiosk_test_helper.h` — file
- `chrome/browser/ash/app_mode/kiosk_troubleshooting_tools_browsertest.cc` — file
- `chrome/browser/ash/app_mode/kiosk_web_app_launcher_base.cc` — file
- `chrome/browser/ash/app_mode/kiosk_web_app_launcher_base.h` — file
- `chrome/browser/ash/app_mode/test/ephemeral_kiosk_browsertest.cc` — file
- `chrome/browser/ash/app_mode/test/kiosk_accessibility_extension_browsertest.cc` — file
- `chrome/browser/ash/app_mode/test/kiosk_arcvm_app_manager_browsertest.cc` — file
- `chrome/browser/ash/app_mode/test/kiosk_auto_login_bailout_browsertest.cc` — file
- `chrome/browser/ash/app_mode/test/kiosk_browsertest.cc` — file
- `chrome/browser/ash/app_mode/test/kiosk_chrome_app_browsertest.cc` — file
- `chrome/browser/ash/app_mode/test/kiosk_chrome_app_offline_network_prompt_browsertest.cc` — file
- `chrome/browser/ash/app_mode/test/kiosk_chrome_app_update_browsertest.cc` — file
- `chrome/browser/ash/app_mode/test/kiosk_chrome_app_usb_update_browsertest.cc` — file
- `chrome/browser/ash/app_mode/test/kiosk_file_system_volumes_browsertest.cc` — file
- `chrome/browser/ash/app_mode/test/kiosk_identity_browsertest.cc` — file
- `chrome/browser/ash/app_mode/test/kiosk_installed_apps_browsertest.cc` — file
- `chrome/browser/ash/app_mode/test/kiosk_iwa_allowlist_browsertest.cc` — file
- `chrome/browser/ash/app_mode/test/kiosk_iwa_browsertest.cc` — file
- `chrome/browser/ash/app_mode/test/kiosk_iwa_device_attributes_browsertest.cc` — file
- `chrome/browser/ash/app_mode/test/kiosk_iwa_permissions_browsertest.cc` — file
- `chrome/browser/ash/app_mode/test/kiosk_iwa_version_management_browsertest.cc` — file
- `chrome/browser/ash/app_mode/test/kiosk_misconfigured_user_browsertest.cc` — file
- `chrome/browser/ash/app_mode/test/kiosk_mixin.cc` — file
- `chrome/browser/ash/app_mode/test/kiosk_mixin.h` — file
- `chrome/browser/ash/app_mode/test/kiosk_multi_chrome_app_browsertest.cc` — file
- `chrome/browser/ash/app_mode/test/kiosk_self_hosted_chrome_app_browsertest.cc` — file
- `chrome/browser/ash/app_mode/test/kiosk_settings_browsertest.cc` — file
- `chrome/browser/ash/app_mode/test/kiosk_test_utils.cc` — file
- `chrome/browser/ash/app_mode/test/kiosk_test_utils.h` — file
- `chrome/browser/ash/app_mode/test/kiosk_untrusted_cros_settings_browsertest.cc` — file
- `chrome/browser/ash/app_mode/test/kiosk_web_app_offline_enabled_browsertest.cc` — file
- `chrome/browser/ash/app_mode/test/new_windows_in_kiosk_allowed_browsertest.cc` — file
- `chrome/browser/ash/app_mode/test_kiosk_extension_builder.cc` — file
- `chrome/browser/ash/app_mode/test_kiosk_extension_builder.h` — file
- `chrome/browser/ash/app_mode/web_app/kiosk_web_app_data.cc` — file
- `chrome/browser/ash/app_mode/web_app/kiosk_web_app_data.h` — file
- `chrome/browser/ash/app_mode/web_app/kiosk_web_app_data_browsertest.cc` — file
- `chrome/browser/ash/app_mode/web_app/kiosk_web_app_manager.cc` — file
- `chrome/browser/ash/app_mode/web_app/kiosk_web_app_manager.h` — file
- `chrome/browser/ash/app_mode/web_app/kiosk_web_app_manager_unittest.cc` — file
- `chrome/browser/ash/app_mode/web_app/kiosk_web_app_service_launcher.cc` — file
- `chrome/browser/ash/app_mode/web_app/kiosk_web_app_service_launcher.h` — file
- `chrome/browser/ash/app_mode/web_app/kiosk_web_app_service_launcher_unittest.cc` — file
- `chrome/browser/ash/arc/instance_throttle/arcvm_kiosk_mode_throttle_observer.cc` — file
- `chrome/browser/ash/arc/instance_throttle/arcvm_kiosk_mode_throttle_observer.h` — file
- `chrome/browser/ash/dbus/kiosk_info_service_provider.cc` — file
- `chrome/browser/ash/dbus/kiosk_info_service_provider.h` — file
- `chrome/browser/ash/dbus/org.chromium.KioskAppService.conf` — file
- `chrome/browser/ash/login/app_mode/kiosk_launch_controller.cc` — file
- `chrome/browser/ash/login/app_mode/kiosk_launch_controller.h` — file
- `chrome/browser/ash/login/app_mode/kiosk_launch_controller_unittest.cc` — file
- `chrome/browser/ash/login/app_mode/test/auto_launched_kiosk_browsertest.cc` — file
- `chrome/browser/ash/login/app_mode/test/kiosk_accelerator_browsertest.cc` — file
- `chrome/browser/ash/login/app_mode/test/kiosk_apps_mixin.cc` — file
- `chrome/browser/ash/login/app_mode/test/kiosk_apps_mixin.h` — file
- `chrome/browser/ash/login/app_mode/test/kiosk_block_tablet_mode_browsertest.cc` — file
- `chrome/browser/ash/login/app_mode/test/kiosk_enterprise_input_api_browsertest.cc` — file
- `chrome/browser/ash/login/app_mode/test/kiosk_remote_command_browsertest.cc` — file
- `chrome/browser/ash/login/app_mode/test/kiosk_sku_browsertest.cc` — file
- `chrome/browser/ash/login/app_mode/test/web_kiosk_browser_permissions_browsertest.cc` — file
- `chrome/browser/ash/login/app_mode/test/web_kiosk_device_attributes_browsertest.cc` — file
- `chrome/browser/ash/login/app_mode/test/web_kiosk_media_ui_browsertest.cc` — file
- `chrome/browser/ash/notifications/kiosk_external_update_notification.cc` — file
- `chrome/browser/ash/notifications/kiosk_external_update_notification.h` — file
- `chrome/browser/ash/policy/reporting/metrics_reporting/kiosk_heartbeat/kiosk_heartbeat_telemetry_events_browsertest.cc` — file
- `chrome/browser/ash/policy/reporting/metrics_reporting/kiosk_heartbeat/kiosk_heartbeat_telemetry_sampler.cc` — file
- `chrome/browser/ash/policy/reporting/metrics_reporting/kiosk_heartbeat/kiosk_heartbeat_telemetry_sampler.h` — file
- `chrome/browser/ash/policy/reporting/metrics_reporting/kiosk_heartbeat/kiosk_heartbeat_telemetry_sampler_unittest.cc` — file
- `chrome/browser/ash/test/kiosk_app_logged_in_browser_test_mixin.cc` — file
- `chrome/browser/ash/test/kiosk_app_logged_in_browser_test_mixin.h` — file
- `chrome/browser/ash/test/web_kiosk_app_logged_in_browser_test_mixin.cc` — file
- `chrome/browser/ash/test/web_kiosk_app_logged_in_browser_test_mixin.h` — file
- `chrome/browser/chromeos/app_mode/chrome_kiosk_app_installer.cc` — file
- `chrome/browser/chromeos/app_mode/chrome_kiosk_app_installer.h` — file
- `chrome/browser/chromeos/app_mode/chrome_kiosk_app_launcher.cc` — file
- `chrome/browser/chromeos/app_mode/chrome_kiosk_app_launcher.h` — file
- `chrome/browser/chromeos/app_mode/chrome_kiosk_app_launcher_unittest.cc` — file
- `chrome/browser/chromeos/app_mode/chrome_kiosk_external_loader_broker.cc` — file
- `chrome/browser/chromeos/app_mode/chrome_kiosk_external_loader_broker.h` — file
- `chrome/browser/chromeos/app_mode/chrome_kiosk_external_loader_broker_unittest.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_app_external_loader.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_app_external_loader.h` — file
- `chrome/browser/chromeos/app_mode/kiosk_app_level_logs_browsertest.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_app_level_logs_manager.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_app_level_logs_manager.h` — file
- `chrome/browser/chromeos/app_mode/kiosk_app_level_logs_manager_wrapper.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_app_level_logs_manager_wrapper.h` — file
- `chrome/browser/chromeos/app_mode/kiosk_app_level_logs_manager_wrapper_unittest.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_app_level_logs_saver.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_app_level_logs_saver.h` — file
- `chrome/browser/chromeos/app_mode/kiosk_app_level_logs_saver_unittest.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_app_service_launcher.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_app_service_launcher.h` — file
- `chrome/browser/chromeos/app_mode/kiosk_app_service_launcher_unittest.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_app_windows_logs_collector.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_app_windows_logs_collector.h` — file
- `chrome/browser/chromeos/app_mode/kiosk_app_windows_logs_collector_unittest.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_browser_logs_collector.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_browser_logs_collector.h` — file
- `chrome/browser/chromeos/app_mode/kiosk_browser_logs_collector_unittest.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_browser_session.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_browser_session.h` — file
- `chrome/browser/chromeos/app_mode/kiosk_browser_session_unittest.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_browser_window_handler.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_browser_window_handler.h` — file
- `chrome/browser/chromeos/app_mode/kiosk_metrics_service.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_metrics_service.h` — file
- `chrome/browser/chromeos/app_mode/kiosk_policies.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_policies.h` — file
- `chrome/browser/chromeos/app_mode/kiosk_policies_unittest.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_service_workers_logs_collector.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_service_workers_logs_collector.h` — file
- `chrome/browser/chromeos/app_mode/kiosk_service_workers_logs_collector_unittest.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_session_plugin_handler.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_session_plugin_handler.h` — file
- `chrome/browser/chromeos/app_mode/kiosk_session_plugin_handler_delegate.h` — file
- `chrome/browser/chromeos/app_mode/kiosk_session_plugin_handler_unittest.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_settings_navigation_throttle.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_settings_navigation_throttle.h` — file
- `chrome/browser/chromeos/app_mode/kiosk_troubleshooting_controller.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_troubleshooting_controller.h` — file
- `chrome/browser/chromeos/app_mode/kiosk_troubleshooting_controller_ash.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_troubleshooting_controller_ash.h` — file
- `chrome/browser/chromeos/app_mode/kiosk_web_app_browser_controller.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_web_app_browser_controller.h` — file
- `chrome/browser/chromeos/app_mode/kiosk_web_app_install_util.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_web_app_install_util.h` — file
- `chrome/browser/chromeos/app_mode/kiosk_web_app_update_observer.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_web_app_update_observer.h` — file
- `chrome/browser/chromeos/app_mode/kiosk_web_contents_observer.cc` — file
- `chrome/browser/chromeos/app_mode/kiosk_web_contents_observer.h` — file
- `chrome/browser/chromeos/app_mode/kiosk_web_contents_observer_unittest.cc` — file
- `chrome/browser/extensions/api/enterprise_kiosk_input/enterprise_kiosk_input_api.cc` — file
- `chrome/browser/extensions/api/enterprise_kiosk_input/enterprise_kiosk_input_api.h` — file
- `chrome/browser/extensions/api/enterprise_kiosk_input/enterprise_kiosk_input_unittest.cc` — file
- `chrome/browser/extensions/chrome_kiosk_delegate.h` — file
- `chrome/browser/extensions/chrome_kiosk_delegate_chromeos.cc` — file
- `chrome/browser/extensions/chrome_kiosk_delegate_non_chromeos.cc` — file
- `chrome/browser/resources/chromeos/login/screens/common/enable_kiosk.ts` — file
- `chrome/browser/ui/ash/login/kiosk_app_menu_controller.cc` — file
- `chrome/browser/ui/ash/login/kiosk_app_menu_controller.h` — file
- `chrome/common/extensions/api/enterprise_kiosk_input.webidl` — file
- `chrome/common/extensions/manifest_tests/extension_manifests_kiosk_unittest.cc` — file
- `chrome/test/data/extensions/kiosk/kiosk_only.crx` — file
- `chrome/test/data/extensions/kiosk/kiosk_only.pem` — file
- `chrome/test/data/extensions/manifest_tests/kiosk_default_platform_app.json` — file
- `chrome/test/data/extensions/manifest_tests/kiosk_disabled_platform_app.json` — file
- `chrome/test/data/extensions/manifest_tests/kiosk_enabled_extension.json` — file
- `chrome/test/data/extensions/manifest_tests/kiosk_enabled_hosted_app.json` — file
- `chrome/test/data/extensions/manifest_tests/kiosk_enabled_invalid.json` — file
- `chrome/test/data/extensions/manifest_tests/kiosk_enabled_packaged_app.json` — file
- `chrome/test/data/extensions/manifest_tests/kiosk_enabled_platform_app.json` — file
- `chrome/test/data/extensions/manifest_tests/kiosk_only_extension.json` — file
- `chrome/test/data/extensions/manifest_tests/kiosk_only_hosted_app.json` — file
- `chrome/test/data/extensions/manifest_tests/kiosk_only_invalid.json` — file
- `chrome/test/data/extensions/manifest_tests/kiosk_only_not_enabled.json` — file
- `chrome/test/data/extensions/manifest_tests/kiosk_only_packaged_app.json` — file
- `chrome/test/data/extensions/manifest_tests/kiosk_only_platform_app.json` — file
- `chrome/test/data/webui/chromeos/settings/os_a11y_page/os_a11y_page_kiosk_mode_test.ts` — file
- `components/policy/resources/templates/policy_definitions/Kiosk/AllowKioskAppControlChromeVersion.yaml` — file
- `components/policy/resources/templates/policy_definitions/Kiosk/KioskActiveWiFiCredentialsScopeChangeEnabled.yaml` — file
- `components/policy/resources/templates/policy_definitions/Kiosk/KioskApplicationLogCollectionEnabled.yaml` — file
- `components/policy/resources/templates/policy_definitions/Kiosk/KioskChromeAppsForceAllowed.yaml` — file
- `components/policy/resources/templates/policy_definitions/Kiosk/KioskTroubleshootingToolsEnabled.yaml` — file
- `components/policy/resources/templates/policy_definitions/Kiosk/KioskWebAppOfflineEnabled.yaml` — file
- `components/policy/resources/templates/policy_definitions/Kiosk/NewWindowsInKioskAllowed.yaml` — file
- `components/policy/resources/templates/policy_definitions/Miscellaneous/KioskBrowserPermissionsAllowedForOrigins.yaml` — file
- `components/policy/resources/templates/policy_definitions/Miscellaneous/KioskCRXManifestUpdateURLIgnored.yaml` — file
- `components/policy/test/data/pref_mapping/AllowKioskAppControlChromeVersion.json` — file
- `components/policy/test/data/pref_mapping/KioskActiveWiFiCredentialsScopeChangeEnabled.json` — file
- `components/policy/test/data/pref_mapping/KioskApplicationLogCollectionEnabled.json` — file
- `components/policy/test/data/pref_mapping/KioskBrowserPermissionsAllowedForOrigins.json` — file
- `components/policy/test/data/pref_mapping/KioskChromeAppsForceAllowed.json` — file
- `components/policy/test/data/pref_mapping/KioskCRXManifestUpdateURLIgnored.json` — file
- `components/policy/test/data/pref_mapping/KioskTroubleshootingToolsEnabled.json` — file
- `components/policy/test/data/pref_mapping/KioskWebAppOfflineEnabled.json` — file
- `components/policy/test/data/pref_mapping/NewWindowsInKioskAllowed.json` — file
- `electron/shell/browser/extensions/electron_kiosk_delegate.cc` — file
- `electron/shell/browser/extensions/electron_kiosk_delegate.h` — file
- `extensions/browser/kiosk/kiosk_delegate.h` — file
- `extensions/common/manifest_handlers/kiosk_mode_info.cc` — file
- `extensions/common/manifest_handlers/kiosk_mode_info.h` — file
- `extensions/common/manifest_handlers/kiosk_mode_info_unittest.cc` — file
- `extensions/shell/browser/delegates/shell_kiosk_delegate.cc` — file
- `extensions/shell/browser/delegates/shell_kiosk_delegate.h` — file
- `extensions/test/data/manifest_tests/kiosk_always_update.json` — file
- `extensions/test/data/manifest_tests/kiosk_always_update_false.json` — file
- `extensions/test/data/manifest_tests/kiosk_always_update_invalid.json` — file
- `extensions/test/data/manifest_tests/kiosk_required_platform_version.json` — file
- `extensions/test/data/manifest_tests/kiosk_required_platform_version_empty.json` — file
- `extensions/test/data/manifest_tests/kiosk_required_platform_version_invalid.json` — file
- `extensions/test/data/manifest_tests/kiosk_required_platform_version_not_present.json` — file
- `extensions/test/data/manifest_tests/kiosk_secondary_app_multi_apps.json` — file
- `extensions/test/data/manifest_tests/kiosk_secondary_app_multi_apps_repeated_entries.json` — file
- `extensions/test/data/manifest_tests/kiosk_secondary_app_no_secondary_app.json` — file
- `third_party/blink/renderer/extensions/chromeos/kiosk/cros_kiosk.cc` — file
- `third_party/blink/renderer/extensions/chromeos/kiosk/cros_kiosk.h` — file
- `third_party/blink/renderer/extensions/chromeos/kiosk/cros_kiosk.idl` — file
- `tools/json_schema_compiler/test/converted_schemas/enterprise_kiosk_input.idl` — file
- `tools/json_schema_compiler/test/converted_schemas/enterprise_kiosk_input.webidl` — file

## netbios (12)

- `third_party/rust-toolchain/lib/rustlib/src/rust/library/vendor/windows-sys-0.60.2/src/Windows/Win32/NetworkManagement/NetBios` — folder
- `third_party/rust/chromium_crates_io/vendor/windows-sys-v0_52/src/Windows/Win32/NetworkManagement/NetBios` — folder
- `chrome/browser/ash/smb_client/discovery/fake_netbios_client.cc` — file
- `chrome/browser/ash/smb_client/discovery/fake_netbios_client.h` — file
- `chrome/browser/ash/smb_client/discovery/netbios_client.cc` — file
- `chrome/browser/ash/smb_client/discovery/netbios_client.h` — file
- `chrome/browser/ash/smb_client/discovery/netbios_client_interface.h` — file
- `chrome/browser/ash/smb_client/discovery/netbios_host_locator.cc` — file
- `chrome/browser/ash/smb_client/discovery/netbios_host_locator.h` — file
- `chrome/browser/ash/smb_client/discovery/netbios_host_locator_unittest.cc` — file
- `components/policy/resources/templates/policy_definitions/NetworkFileShares/NetBiosShareDiscoveryEnabled.yaml` — file
- `components/policy/test/data/pref_mapping/NetBiosShareDiscoveryEnabled.json` — file

## scenario (18)

- `components/performance_manager/public/scenarios` — folder
- `components/performance_manager/scenarios` — folder
- `components/performance_manager/public/scenarios/process_performance_scenarios.h` — file
- `components/performance_manager/scenario_api/performance_scenarios.cc` — file
- `components/performance_manager/scenario_api/performance_scenarios.h` — file
- `components/performance_manager/scenario_api/performance_scenarios_unittest.cc` — file
- `components/performance_manager/scenarios/browser_performance_scenarios.cc` — file
- `components/performance_manager/scenarios/browser_performance_scenarios.h` — file
- `components/performance_manager/scenarios/browser_performance_scenarios_unittest.cc` — file
- `components/performance_manager/scenarios/process_performance_scenarios.cc` — file
- `components/performance_manager/scenarios/process_performance_scenarios_unittest.cc` — file
- `components/tracing/common/tracing_scenarios_config.cc` — file
- `components/tracing/common/tracing_scenarios_config.h` — file
- `content/browser/resources/traces_internals/tracing_scenarios_config.css` — file
- `content/browser/resources/traces_internals/tracing_scenarios_config.html.ts` — file
- `content/browser/resources/traces_internals/tracing_scenarios_config.ts` — file
- `tools/mac/power/scenarios.py` — file
- `tools/metrics/histograms/update_debug_scenarios.py` — file

## smbios (2)

- `third_party/depot_tools/external_bin/gsutil/gsutil_5.35/gsutil/third_party/google-auth-library-python/tests/compute_engine/data/smbios_product_name` — file
- `third_party/depot_tools/external_bin/gsutil/gsutil_5.35/gsutil/third_party/google-auth-library-python/tests/compute_engine/data/smbios_product_name_non_google` — file

## termios (10)

- `third_party/llvm-libc/src/src/termios` — folder
- `third_party/llvm-libc/src/test/src/termios` — folder
- `third_party/llvm-libc/src/include/llvm-libc-macros/linux/termios-macros.h` — file
- `third_party/llvm-libc/src/include/llvm-libc-macros/termios-macros.h` — file
- `third_party/llvm-libc/src/include/llvm-libc-types/struct_termios.h` — file
- `third_party/llvm-libc/src/include/termios.h.def` — file
- `third_party/llvm-libc/src/include/termios.yaml` — file
- `third_party/llvm-libc/src/src/termios/linux/kernel_termios.h` — file
- `third_party/llvm-libc/src/test/src/termios/termios_test.cpp` — file
- `third_party/llvm-libc/src/utils/docgen/termios.yaml` — file

## Inside a real phone folder (2)

- `third_party/perfetto/src/traced/probes/ftrace/test/data/android_raven_AOSP.MASTER_5.10.43/events/f2fs/f2fs_iostat` — folder
- `third_party/webrtc/sdk/android/api/org/webrtc/AudioSource.java` — file
