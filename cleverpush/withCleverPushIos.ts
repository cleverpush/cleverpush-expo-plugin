import { ConfigPlugin, withEntitlementsPlist, withInfoPlist, withXcodeProject, withDangerousMod } from "@expo/config-plugins";
import * as fs from 'fs';
import * as path from 'path';
import { CleverPushPluginProps } from "../types/types";
import {
  DEFAULT_BUNDLE_SHORT_VERSION,
  DEFAULT_BUNDLE_VERSION,
  IPHONEOS_DEPLOYMENT_TARGET,
  TARGETED_DEVICE_FAMILY
} from "../support/iosConstants";

import { CleverPushLog } from "../support/CleverPushLog";
import { FileManager } from "../support/FileManager";

const withAppEnvironment: ConfigPlugin<CleverPushPluginProps> = (
  config,
  cleverpushProps
) => {
  return withEntitlementsPlist(config, (newConfig) => {
    if (cleverpushProps?.mode == null) {
      throw new Error(`
        Missing required "mode" key in your app.json or app.config.js file for "cleverpush-expo-plugin".
        "mode" can be either "development" or "production".
        Please see cleverpush-expo-plugin's README.md for more details.`
      );
    }
    
    if (!newConfig.modResults) {
      newConfig.modResults = {};
    }
    
    newConfig.modResults["aps-environment"] = cleverpushProps.mode;
    return newConfig;
  });
};

const withRemoteNotificationsPermissions: ConfigPlugin<CleverPushPluginProps> = (
  config
) => {
  const BACKGROUND_MODE_KEYS = ["remote-notification"];
  return withInfoPlist(config, (newConfig) => {
    if (!Array.isArray(newConfig.modResults.UIBackgroundModes)) {
      newConfig.modResults.UIBackgroundModes = [];
    }
    for (const key of BACKGROUND_MODE_KEYS) {
      if (!newConfig.modResults.UIBackgroundModes.includes(key)) {
        newConfig.modResults.UIBackgroundModes.push(key);
      }
    }

    return newConfig;
  });
};

const withAppGroupPermissions: ConfigPlugin<CleverPushPluginProps> = (
  config
) => {
  const APP_GROUP_KEY = "com.apple.security.application-groups";
  return withEntitlementsPlist(config, newConfig => {
    if (!newConfig.modResults) {
      newConfig.modResults = {};
    }
    
    if (!newConfig.modResults[APP_GROUP_KEY]) {
      newConfig.modResults[APP_GROUP_KEY] = [];
    }
    const modResultsArray = (newConfig.modResults[APP_GROUP_KEY] as Array<any>);
    const entitlement = `group.${newConfig?.ios?.bundleIdentifier || ""}.cleverpush`;
    if (modResultsArray.indexOf(entitlement) !== -1) {
      return newConfig;
    }
    modResultsArray.push(entitlement);

    return newConfig;
  });
};





export const withCleverPushIos: ConfigPlugin<CleverPushPluginProps> = (
  config,
  props
) => {
  if (config.ios?.bundleIdentifier === undefined) {
    throw new Error(
      `Missing required iOS bundleIdentifier in config.json: ${JSON.stringify(
        config
      )}`
    );
  }

  config = withAppEnvironment(config, props);
  config = withRemoteNotificationsPermissions(config, props);
  config = withAppGroupPermissions(config, props);
  
  return config;
}; 