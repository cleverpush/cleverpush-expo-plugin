"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const withCleverPushAndroid_1 = require("./withCleverPushAndroid");
const withCleverPushIos_1 = require("./withCleverPushIos");
const withCleverPush = (config, props) => {
    if (!props) {
        throw new Error('You are trying to use the CleverPush plugin without any props. Property "mode" is required. Please see https://github.com/cleverpush/cleverpush-expo-plugin for more info.');
    }
    if (!props.mode || (props.mode !== 'development' && props.mode !== 'production')) {
        throw new Error('CleverPush plugin requires a valid "mode" property. Must be either "development" or "production".');
    }
    config = (0, withCleverPushIos_1.withCleverPushIos)(config, props);
    config = (0, withCleverPushAndroid_1.withCleverPushAndroid)(config, props);
    return config;
};
exports.default = withCleverPush;
