"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const withCleverPushAndroid_1 = require("./withCleverPushAndroid");
const withCleverPushIos_1 = require("./withCleverPushIos");
const withCleverPush = (config, props) => {
    var _a;
    if (!props) {
        throw new Error('You are trying to use the CleverPush plugin without any props. Property "mode" is required. Please see https://github.com/cleverpush/cleverpush-expo-plugin for more info.');
    }
    if (!props.mode || (props.mode !== 'development' && props.mode !== 'production')) {
        throw new Error('CleverPush plugin requires a valid "mode" property. Must be either "development" or "production".');
    }
    if (((_a = config.ios) === null || _a === void 0 ? void 0 : _a.bundleIdentifier) && !props.devTeam) {
        throw new Error('CleverPush plugin requires "devTeam" property for automatic NSE installation. ' +
            'Please add your iOS development team ID to enable automatic NSE installation. ' +
            'Example: { mode: "development", devTeam: "KWJDGZUQ72" }');
    }
    config = (0, withCleverPushIos_1.withCleverPushIos)(config, props);
    config = (0, withCleverPushAndroid_1.withCleverPushAndroid)(config, props);
    return config;
};
exports.default = withCleverPush;
