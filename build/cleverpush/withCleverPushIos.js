"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withCleverPushIos = void 0;
const config_plugins_1 = require("@expo/config-plugins");
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
const withCleverPushIos = (config, props) => {
    var _a;
    if (((_a = config.ios) === null || _a === void 0 ? void 0 : _a.bundleIdentifier) === undefined) {
        throw new Error(`Missing required iOS bundleIdentifier in config.json: ${JSON.stringify(config)}`);
    }
    config = withAppEnvironment(config, props);
    config = withRemoteNotificationsPermissions(config, props);
    config = withAppGroupPermissions(config, props);
    return config;
};
exports.withCleverPushIos = withCleverPushIos;
