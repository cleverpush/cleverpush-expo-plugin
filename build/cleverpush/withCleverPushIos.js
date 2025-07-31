"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withCleverPushIos = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const iosConstants_1 = require("../support/iosConstants");
const NseUpdaterManager_1 = __importDefault(require("../support/NseUpdaterManager"));
const CleverPushLog_1 = require("../support/CleverPushLog");
const FileManager_1 = require("../support/FileManager");
const withAppEnvironment = (config, cleverpushProps) => {
    return (0, config_plugins_1.withEntitlementsPlist)(config, (newConfig) => {
        if ((cleverpushProps === null || cleverpushProps === void 0 ? void 0 : cleverpushProps.mode) == null) {
            throw new Error(`
        Missing required "mode" key in your app.json or app.config.js file for "cleverpush-expo-plugin".
        "mode" can be either "development" or "production".
        Please see cleverpush-expo-plugin's README.md for more details.`);
        }
        if (!newConfig.modResults) {
            newConfig.modResults = {};
        }
        newConfig.modResults["aps-environment"] = cleverpushProps.mode;
        return newConfig;
    });
};
const withRemoteNotificationsPermissions = (config) => {
    const BACKGROUND_MODE_KEYS = ["remote-notification"];
    return (0, config_plugins_1.withInfoPlist)(config, (newConfig) => {
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
const withAppGroupPermissions = (config) => {
    const APP_GROUP_KEY = "com.apple.security.application-groups";
    return (0, config_plugins_1.withEntitlementsPlist)(config, newConfig => {
        var _a;
        if (!newConfig.modResults) {
            newConfig.modResults = {};
        }
        if (!newConfig.modResults[APP_GROUP_KEY]) {
            newConfig.modResults[APP_GROUP_KEY] = [];
        }
        const modResultsArray = newConfig.modResults[APP_GROUP_KEY];
        const entitlement = `group.${((_a = newConfig === null || newConfig === void 0 ? void 0 : newConfig.ios) === null || _a === void 0 ? void 0 : _a.bundleIdentifier) || ""}.cleverpush`;
        if (modResultsArray.indexOf(entitlement) !== -1) {
            return newConfig;
        }
        modResultsArray.push(entitlement);
        return newConfig;
    });
};
const withCleverPushNSE = (config, props) => {
    const pluginDir = path.join(__dirname, "../../");
    const sourceDir = path.join(pluginDir, "support/serviceExtensionFiles/");
    return (0, config_plugins_1.withDangerousMod)(config, [
        'ios',
        async (config) => {
            var _a, _b, _c, _d, _e;
            const iosPath = path.join(config.modRequest.projectRoot, "ios");
            fs.mkdirSync(`${iosPath}/${iosConstants_1.NSE_TARGET_NAME}`, { recursive: true });
            for (let i = 0; i < iosConstants_1.NSE_EXT_FILES.length; i++) {
                const extFile = iosConstants_1.NSE_EXT_FILES[i];
                const targetFile = `${iosPath}/${iosConstants_1.NSE_TARGET_NAME}/${extFile}`;
                await FileManager_1.FileManager.copyFile(`${sourceDir}${extFile}`, targetFile);
            }
            const sourcePath = (_a = props.iosNSEFilePath) !== null && _a !== void 0 ? _a : `${sourceDir}${iosConstants_1.NSE_SOURCE_FILE}`;
            const targetFile = `${iosPath}/${iosConstants_1.NSE_TARGET_NAME}/${iosConstants_1.NSE_SOURCE_FILE}`;
            await FileManager_1.FileManager.copyFile(`${sourcePath}`, targetFile);
            const nseUpdater = new NseUpdaterManager_1.default(iosPath);
            await nseUpdater.updateNSEEntitlements(`group.${(_b = config.ios) === null || _b === void 0 ? void 0 : _b.bundleIdentifier}.cleverpush`);
            await nseUpdater.updateNSEBundleVersion((_d = (_c = config.ios) === null || _c === void 0 ? void 0 : _c.buildNumber) !== null && _d !== void 0 ? _d : iosConstants_1.DEFAULT_BUNDLE_VERSION);
            await nseUpdater.updateNSEBundleShortVersion((_e = config === null || config === void 0 ? void 0 : config.version) !== null && _e !== void 0 ? _e : iosConstants_1.DEFAULT_BUNDLE_SHORT_VERSION);
            return config;
        },
    ]);
};
const withCleverPushXcodeProject = (config, props) => {
    return (0, config_plugins_1.withXcodeProject)(config, newConfig => {
        var _a, _b;
        const xcodeProject = newConfig.modResults;
        if (!!xcodeProject.pbxTargetByName(iosConstants_1.NSE_TARGET_NAME)) {
            CleverPushLog_1.CleverPushLog.log(`${iosConstants_1.NSE_TARGET_NAME} already exists in project. Skipping...`);
            return newConfig;
        }
        const extGroup = xcodeProject.addPbxGroup([...iosConstants_1.NSE_EXT_FILES, iosConstants_1.NSE_SOURCE_FILE], iosConstants_1.NSE_TARGET_NAME, iosConstants_1.NSE_TARGET_NAME);
        const groups = xcodeProject.hash.project.objects["PBXGroup"];
        Object.keys(groups).forEach(function (key) {
            if (typeof groups[key] === "object" && groups[key].name === undefined && groups[key].path === undefined) {
                xcodeProject.addToPbxGroup(extGroup.uuid, key);
            }
        });
        const projObjects = xcodeProject.hash.project.objects;
        projObjects['PBXTargetDependency'] = projObjects['PBXTargetDependency'] || {};
        projObjects['PBXContainerItemProxy'] = projObjects['PBXTargetDependency'] || {};
        const nseTarget = xcodeProject.addTarget(iosConstants_1.NSE_TARGET_NAME, "app_extension", iosConstants_1.NSE_TARGET_NAME, `${(_a = config.ios) === null || _a === void 0 ? void 0 : _a.bundleIdentifier}.${iosConstants_1.NSE_TARGET_NAME}`);
        xcodeProject.addBuildPhase(["NotificationService.m"], "PBXSourcesBuildPhase", "Sources", nseTarget.uuid);
        xcodeProject.addBuildPhase([], "PBXResourcesBuildPhase", "Resources", nseTarget.uuid);
        const frameworksBuildPhase = xcodeProject.addBuildPhase([], "PBXFrameworksBuildPhase", "Frameworks", nseTarget.uuid);
        const configurations = xcodeProject.pbxXCBuildConfigurationSection();
        for (const key in configurations) {
            if (typeof configurations[key].buildSettings !== "undefined" &&
                configurations[key].buildSettings.PRODUCT_NAME == `"${iosConstants_1.NSE_TARGET_NAME}"`) {
                const buildSettingsObj = configurations[key].buildSettings;
                buildSettingsObj.DEVELOPMENT_TEAM = props === null || props === void 0 ? void 0 : props.devTeam;
                buildSettingsObj.IPHONEOS_DEPLOYMENT_TARGET = (_b = props === null || props === void 0 ? void 0 : props.iPhoneDeploymentTarget) !== null && _b !== void 0 ? _b : iosConstants_1.IPHONEOS_DEPLOYMENT_TARGET;
                buildSettingsObj.TARGETED_DEVICE_FAMILY = iosConstants_1.TARGETED_DEVICE_FAMILY;
                buildSettingsObj.CODE_SIGN_ENTITLEMENTS = `${iosConstants_1.NSE_TARGET_NAME}/${iosConstants_1.NSE_TARGET_NAME}.entitlements`;
                buildSettingsObj.CODE_SIGN_STYLE = "Automatic";
            }
        }
        xcodeProject.addTargetAttribute("DevelopmentTeam", props === null || props === void 0 ? void 0 : props.devTeam, nseTarget);
        xcodeProject.addTargetAttribute("DevelopmentTeam", props === null || props === void 0 ? void 0 : props.devTeam);
        CleverPushLog_1.CleverPushLog.log("NSE target created successfully. IMPORTANT: You must manually add CleverPush.xcframework to the NSE target's Frameworks and Libraries in Xcode for images to display in notifications.");
        return newConfig;
    });
};
const withCleverPushIos = (config, props) => {
    var _a;
    if (((_a = config.ios) === null || _a === void 0 ? void 0 : _a.bundleIdentifier) === undefined) {
        throw new Error(`Missing required iOS bundleIdentifier in config.json: ${JSON.stringify(config)}`);
    }
    config = withAppEnvironment(config, props);
    config = withRemoteNotificationsPermissions(config, props);
    config = withAppGroupPermissions(config, props);
    config = withCleverPushNSE(config, props);
    config = withCleverPushXcodeProject(config, props);
    return config;
};
exports.withCleverPushIos = withCleverPushIos;
