import { ConfigPlugin, withEntitlementsPlist, withInfoPlist, withXcodeProject, withDangerousMod } from "@expo/config-plugins";
import { ExpoConfig } from '@expo/config-types';
import * as fs from 'fs';
import * as path from 'path';
import { CleverPushPluginProps } from "../types/types";
import {
  DEFAULT_BUNDLE_SHORT_VERSION,
  DEFAULT_BUNDLE_VERSION,
  IPHONEOS_DEPLOYMENT_TARGET,
  TARGETED_DEVICE_FAMILY,
  NSE_TARGET_NAME,
  NSE_SOURCE_FILE,
  NSE_EXT_FILES
} from "../support/iosConstants";

import { CleverPushLog } from "../support/CleverPushLog";
import { FileManager } from "../support/FileManager";
import CleverPushNseUpdaterManager from "../support/CleverPushNseUpdaterManager";
import { updatePodfile } from "../support/updatePodfile";
import assert from 'assert';

const withAppEnvironment: ConfigPlugin<CleverPushPluginProps> = (
  config: ExpoConfig,
  cleverpushProps: CleverPushPluginProps
) => {
  return withEntitlementsPlist(config, (newConfig: any) => {
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
  config: ExpoConfig
) => {
  const BACKGROUND_MODE_KEYS = ["remote-notification"];
  return withInfoPlist(config, (newConfig: any) => {
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
  config: ExpoConfig
) => {
  const APP_GROUP_KEY = "com.apple.security.application-groups";
  return withEntitlementsPlist(config, (newConfig: any) => {
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

const withCleverPushPodfile: ConfigPlugin<CleverPushPluginProps> = (config: ExpoConfig, props: CleverPushPluginProps) => {
  return withDangerousMod(config, [
    'ios',
    async (config: any) => {
      try {
        CleverPushLog.log(`[CleverPush] Starting Podfile update process`);
        const iosRoot = path.join(config.modRequest.projectRoot, "ios");
        await updatePodfile(iosRoot);
      } catch (err) {
        CleverPushLog.error(`[CleverPush] Podfile update failed: ${err}`);
      }
      return config;
    },
  ]);
};

const withCleverPushNSE: ConfigPlugin<CleverPushPluginProps> = (config: ExpoConfig, props: CleverPushPluginProps) => {
  let pluginDir: string;
  try {
    pluginDir = require.resolve("cleverpush-expo-plugin/package.json");
  } catch (error) {
    pluginDir = path.join(__dirname, "../../package.json");
  }
  const sourceDir = path.join(path.dirname(pluginDir), "build/support/serviceExtensionFiles/");

  return withDangerousMod(config, [
    'ios',
    async (config: any) => {
      try {
        CleverPushLog.log(`[CleverPush] Starting NSE setup process`);
        const iosPath = path.join(config.modRequest.projectRoot, "ios");

        CleverPushLog.log(`[CleverPush] Creating NSE directory: ${iosPath}/${NSE_TARGET_NAME}`);
        fs.mkdirSync(`${iosPath}/${NSE_TARGET_NAME}`, { recursive: true });

        for (let i = 0; i < NSE_EXT_FILES.length; i++) {
          const extFile = NSE_EXT_FILES[i];
          const sourcePath = `${sourceDir}${extFile}`;
          const targetFile = `${iosPath}/${NSE_TARGET_NAME}/${extFile}`;
          
          CleverPushLog.log(`[CleverPush] Copying NSE file: ${extFile}`);
          await FileManager.copyFile(sourcePath, targetFile);
        }

        const sourcePath = props.iosNSEFilePath ?? `${sourceDir}${NSE_SOURCE_FILE}`;
        const targetFile = `${iosPath}/${NSE_TARGET_NAME}/${NSE_SOURCE_FILE}`;
        
        CleverPushLog.log(`[CleverPush] Copying NSE source file: ${NSE_SOURCE_FILE}`);
        await FileManager.copyFile(sourcePath, targetFile);
        CleverPushLog.log(`[CleverPush] Updating NSE configuration files`);
        const nseUpdater = new CleverPushNseUpdaterManager(iosPath);
        await nseUpdater.updateNSEEntitlements(`group.${config.ios?.bundleIdentifier}.cleverpush`);
        await nseUpdater.updateNSEBundleVersion(config.ios?.buildNumber ?? DEFAULT_BUNDLE_VERSION);
        await nseUpdater.updateNSEBundleShortVersion(config?.version ?? DEFAULT_BUNDLE_SHORT_VERSION);

        CleverPushLog.log(`[CleverPush] NSE setup completed successfully`);
      } catch (error) {
        CleverPushLog.error(`[CleverPush] NSE setup failed: ${error}`);
        throw error;
      }

      return config;
    },
  ]);
};

const withCleverPushXcodeProject: ConfigPlugin<CleverPushPluginProps> = (config: ExpoConfig, props: CleverPushPluginProps) => {
  return withXcodeProject(config, (newConfig: any) => {
    try {
      CleverPushLog.log(`[CleverPush] Starting Xcode project configuration`);
      const xcodeProject = newConfig.modResults;

      if (!!xcodeProject.pbxTargetByName(NSE_TARGET_NAME)) {
        CleverPushLog.log(`[CleverPush] ${NSE_TARGET_NAME} already exists in project. Skipping...`);
        return newConfig;
      }

      CleverPushLog.log(`[CleverPush] Creating NSE target and group`);

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
      CleverPushLog.log(`[CleverPush] Adding NSE target to Xcode project`);
      const nseTarget = xcodeProject.addTarget(NSE_TARGET_NAME, "app_extension", NSE_TARGET_NAME, `${config.ios?.bundleIdentifier}.${NSE_TARGET_NAME}`);
      xcodeProject.addBuildPhase(
        ["NotificationService.m"],
        "PBXSourcesBuildPhase",
        "Sources",
        nseTarget.uuid
      );
      xcodeProject.addBuildPhase([], "PBXResourcesBuildPhase", "Resources", nseTarget.uuid);

      xcodeProject.addBuildPhase(
        [],
        "PBXFrameworksBuildPhase",
        "Frameworks",
        nseTarget.uuid
      );

      CleverPushLog.log(`[CleverPush] Adding CleverPush.xcframework to NSE target`);
      try {
        const mainAppTarget = xcodeProject.getFirstTarget();
        const frameworks = xcodeProject.hash.project.objects.PBXBuildFile || {};
        
        let cleverPushFrameworkFileRef = null;
        Object.keys(frameworks).forEach(key => {
          const framework = frameworks[key];
          if (framework.fileRef && framework.fileRef_comment && 
              (framework.fileRef_comment.includes('CleverPush.xcframework') || 
               framework.fileRef_comment.includes('CleverPush'))) {
            cleverPushFrameworkFileRef = framework.fileRef;
            CleverPushLog.log(`[CleverPush] Found existing CleverPush framework reference: ${framework.fileRef_comment}`);
          }
        });

        if (cleverPushFrameworkFileRef) {
          const frameworkBuildFile = xcodeProject.addFramework(cleverPushFrameworkFileRef, { target: nseTarget.uuid });
          CleverPushLog.log(`[CleverPush] Successfully added CleverPush framework to NSE target`);
        } else {
          CleverPushLog.log(`[CleverPush] CleverPush framework not found in main target. This is expected if using CocoaPods.`);
          CleverPushLog.log(`[CleverPush] CleverPush framework will be linked via Podfile for NSE target.`);
        }
      } catch (frameworkError) {
        CleverPushLog.log(`[CleverPush] Framework linking handled via Podfile: ${frameworkError}`);
      }


      CleverPushLog.log(`[CleverPush] Configuring NSE target build settings`);
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
      
      CleverPushLog.log(`[CleverPush] Xcode project configuration completed successfully`);
    } catch (error) {
      CleverPushLog.error(`[CleverPush] Xcode project configuration failed: ${error}`);
      throw error;
    }
    
    return newConfig;
  });
};

export const withCleverPushIos: ConfigPlugin<CleverPushPluginProps> = (
  config: ExpoConfig,
  props: CleverPushPluginProps
) => {
  assert(config.ios?.bundleIdentifier, "Missing 'ios.bundleIdentifier' in app config.");

  CleverPushLog.log(`[CleverPush] Starting iOS configuration for bundle: ${config.ios.bundleIdentifier}`);

  config = withAppEnvironment(config, props);
  config = withRemoteNotificationsPermissions(config, props);
  config = withAppGroupPermissions(config, props);
  config = withCleverPushPodfile(config, props);
  config = withCleverPushNSE(config, props);
  config = withCleverPushXcodeProject(config, props);
  
  CleverPushLog.log(`[CleverPush] iOS configuration completed successfully`);
  return config;
}; 