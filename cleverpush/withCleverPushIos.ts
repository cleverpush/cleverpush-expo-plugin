import { ConfigPlugin, withEntitlementsPlist, withInfoPlist, withXcodeProject, withDangerousMod } from "@expo/config-plugins";
import * as fs from 'fs';
import * as path from 'path';
import { CleverPushPluginProps } from "../types/types";
import {
  DEFAULT_BUNDLE_SHORT_VERSION,
  DEFAULT_BUNDLE_VERSION,
  IPHONEOS_DEPLOYMENT_TARGET,
  NSE_TARGET_NAME,
  NSE_SOURCE_FILE,
  NSE_EXT_FILES,
  TARGETED_DEVICE_FAMILY
} from "../support/iosConstants";
import NseUpdaterManager from "../support/NseUpdaterManager";
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

const withCleverPushNSE: ConfigPlugin<CleverPushPluginProps> = (config, props) => {
  const pluginDir = path.join(__dirname, "../../")
  const sourceDir = path.join(pluginDir, "support/serviceExtensionFiles/")

  return withDangerousMod(config, [
    'ios',
    async config => {
      const iosPath = path.join(config.modRequest.projectRoot, "ios")

      fs.mkdirSync(`${iosPath}/${NSE_TARGET_NAME}`, { recursive: true });

      for (let i = 0; i < NSE_EXT_FILES.length; i++) {
        const extFile = NSE_EXT_FILES[i];
        const targetFile = `${iosPath}/${NSE_TARGET_NAME}/${extFile}`;
        await FileManager.copyFile(`${sourceDir}${extFile}`, targetFile);
      }

      const sourcePath = props.iosNSEFilePath ?? `${sourceDir}${NSE_SOURCE_FILE}`
      const targetFile = `${iosPath}/${NSE_TARGET_NAME}/${NSE_SOURCE_FILE}`;
      await FileManager.copyFile(`${sourcePath}`, targetFile);

      const nseUpdater = new NseUpdaterManager(iosPath);
      await nseUpdater.updateNSEEntitlements(`group.${config.ios?.bundleIdentifier}.cleverpush`)
      await nseUpdater.updateNSEBundleVersion(config.ios?.buildNumber ?? DEFAULT_BUNDLE_VERSION);
      await nseUpdater.updateNSEBundleShortVersion(config?.version ?? DEFAULT_BUNDLE_SHORT_VERSION);

      return config;
    },
  ]);
}

const withCleverPushXcodeProject: ConfigPlugin<CleverPushPluginProps> = (config, props) => {
  return withXcodeProject(config, newConfig => {
    const xcodeProject = newConfig.modResults

    if (!!xcodeProject.pbxTargetByName(NSE_TARGET_NAME)) {
      CleverPushLog.log(`${NSE_TARGET_NAME} already exists in project. Skipping...`);
      return newConfig;
    }

    const extGroup = xcodeProject.addPbxGroup([...NSE_EXT_FILES, NSE_SOURCE_FILE], NSE_TARGET_NAME, NSE_TARGET_NAME);

    const groups = xcodeProject.hash.project.objects["PBXGroup"];
    Object.keys(groups).forEach(function(key) {
      if (typeof groups[key] === "object" && groups[key].name === undefined && groups[key].path === undefined) {
        xcodeProject.addToPbxGroup(extGroup.uuid, key);
      }
    });

    const projObjects = xcodeProject.hash.project.objects;
    projObjects['PBXTargetDependency'] = projObjects['PBXTargetDependency'] || {};
    projObjects['PBXContainerItemProxy'] = projObjects['PBXTargetDependency'] || {};

    const nseTarget = xcodeProject.addTarget(NSE_TARGET_NAME, "app_extension", NSE_TARGET_NAME, `${config.ios?.bundleIdentifier}.${NSE_TARGET_NAME}`);

    xcodeProject.addBuildPhase(
      ["NotificationService.m"],
      "PBXSourcesBuildPhase",
      "Sources",
      nseTarget.uuid
    );
    xcodeProject.addBuildPhase([], "PBXResourcesBuildPhase", "Resources", nseTarget.uuid);

    const frameworksBuildPhase = xcodeProject.addBuildPhase(
      [],
      "PBXFrameworksBuildPhase",
      "Frameworks",
      nseTarget.uuid
    );

    const configurations = xcodeProject.pbxXCBuildConfigurationSection();
    for (const key in configurations) {
      if (
        typeof configurations[key].buildSettings !== "undefined" &&
        configurations[key].buildSettings.PRODUCT_NAME == `"${NSE_TARGET_NAME}"`
      ) {
        const buildSettingsObj = configurations[key].buildSettings;
        buildSettingsObj.DEVELOPMENT_TEAM = props?.devTeam;
        buildSettingsObj.IPHONEOS_DEPLOYMENT_TARGET = props?.iPhoneDeploymentTarget ?? IPHONEOS_DEPLOYMENT_TARGET;
        buildSettingsObj.TARGETED_DEVICE_FAMILY = TARGETED_DEVICE_FAMILY;
        buildSettingsObj.CODE_SIGN_ENTITLEMENTS = `${NSE_TARGET_NAME}/${NSE_TARGET_NAME}.entitlements`;
        buildSettingsObj.CODE_SIGN_STYLE = "Automatic";
      }
    }

    xcodeProject.addTargetAttribute("DevelopmentTeam", props?.devTeam, nseTarget);
    xcodeProject.addTargetAttribute("DevelopmentTeam", props?.devTeam);
    
    CleverPushLog.log("NSE target created successfully. IMPORTANT: You must manually add CleverPush.xcframework to the NSE target's Frameworks and Libraries in Xcode for images to display in notifications.");
    
    return newConfig;
  })
}

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
  config = withCleverPushNSE(config, props);
  config = withCleverPushXcodeProject(config, props);
  
  return config;
}; 