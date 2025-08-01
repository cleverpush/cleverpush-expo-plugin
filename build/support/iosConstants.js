"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUNDLE_VERSION_TEMPLATE_REGEX = exports.BUNDLE_SHORT_VERSION_TEMPLATE_REGEX = exports.GROUP_IDENTIFIER_TEMPLATE_REGEX = exports.NSE_PODFILE_REGEX = exports.NSE_PODFILE_SNIPPET = exports.NSE_EXT_FILES = exports.NSE_HEADER_FILE = exports.NSE_SOURCE_FILE = exports.NSE_TARGET_NAME = exports.TARGETED_DEVICE_FAMILY = exports.IPHONEOS_DEPLOYMENT_TARGET = exports.DEFAULT_BUNDLE_VERSION = exports.DEFAULT_BUNDLE_SHORT_VERSION = void 0;
exports.DEFAULT_BUNDLE_SHORT_VERSION = "1.0.0";
exports.DEFAULT_BUNDLE_VERSION = "1";
exports.IPHONEOS_DEPLOYMENT_TARGET = "13.0";
exports.TARGETED_DEVICE_FAMILY = `"1,2"`;
// NSE Configuration
exports.NSE_TARGET_NAME = "CleverPushNotificationServiceExtension";
exports.NSE_SOURCE_FILE = "NotificationService.m";
exports.NSE_HEADER_FILE = "NotificationService.h";
exports.NSE_EXT_FILES = [
    exports.NSE_HEADER_FILE,
    `${exports.NSE_TARGET_NAME}.entitlements`,
    `${exports.NSE_TARGET_NAME}-Info.plist`
];
// Podfile Configuration
exports.NSE_PODFILE_SNIPPET = `
target 'CleverPushNotificationServiceExtension' do
  pod 'CleverPush'
  use_frameworks! :linkage => podfile_properties['ios.useFrameworks'].to_sym if podfile_properties['ios.useFrameworks']
end`;
exports.NSE_PODFILE_REGEX = /target 'CleverPushNotificationServiceExtension'/;
// Template replacement patterns
exports.GROUP_IDENTIFIER_TEMPLATE_REGEX = /{{GROUP_IDENTIFIER}}/gm;
exports.BUNDLE_SHORT_VERSION_TEMPLATE_REGEX = /{{BUNDLE_SHORT_VERSION}}/gm;
exports.BUNDLE_VERSION_TEMPLATE_REGEX = /{{BUNDLE_VERSION}}/gm;
