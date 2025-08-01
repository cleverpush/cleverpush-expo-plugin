export const DEFAULT_BUNDLE_SHORT_VERSION = "1.0.0";
export const DEFAULT_BUNDLE_VERSION = "1";
export const IPHONEOS_DEPLOYMENT_TARGET = "13.0";

export const TARGETED_DEVICE_FAMILY = `"1,2"`;

// NSE Configuration
export const NSE_TARGET_NAME = "CleverPushNotificationServiceExtension";
export const NSE_SOURCE_FILE = "NotificationService.m";
export const NSE_HEADER_FILE = "NotificationService.h";
export const NSE_EXT_FILES = [
  NSE_HEADER_FILE,
  `${NSE_TARGET_NAME}.entitlements`,
  `${NSE_TARGET_NAME}-Info.plist`
];

// Podfile Configuration
export const NSE_PODFILE_SNIPPET = `
target 'CleverPushNotificationServiceExtension' do
  pod 'CleverPush'
  use_frameworks! :linkage => podfile_properties['ios.useFrameworks'].to_sym if podfile_properties['ios.useFrameworks']
end`;

export const NSE_PODFILE_REGEX = /target 'CleverPushNotificationServiceExtension'/;

// Template replacement patterns
export const GROUP_IDENTIFIER_TEMPLATE_REGEX = /{{GROUP_IDENTIFIER}}/gm;
export const BUNDLE_SHORT_VERSION_TEMPLATE_REGEX = /{{BUNDLE_SHORT_VERSION}}/gm;
export const BUNDLE_VERSION_TEMPLATE_REGEX = /{{BUNDLE_VERSION}}/gm; 