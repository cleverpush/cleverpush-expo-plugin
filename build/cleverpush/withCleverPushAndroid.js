"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withCleverPushAndroid = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const image_utils_1 = require("@expo/image-utils");
const path_1 = require("path");
const fs_1 = require("fs");
const RESOURCE_ROOT_PATH = 'android/app/src/main/res/';
const SMALL_ICON_DIRS_TO_SIZE = {
    'drawable-mdpi': 24,
    'drawable-hdpi': 36,
    'drawable-xhdpi': 48,
    'drawable-xxhdpi': 72,
    'drawable-xxxhdpi': 96
};
const withNotificationIcons = (config, cleverpushProps) => {
    var _a;
    if (!cleverpushProps.smallIcons && !((_a = config.notification) === null || _a === void 0 ? void 0 : _a.icon)) {
        return config;
    }
    return (0, config_plugins_1.withDangerousMod)(config, [
        'android',
        async (config) => {
            var _a;
            if ((_a = config.notification) === null || _a === void 0 ? void 0 : _a.icon) {
                await saveIconAsync(config.notification.icon, config.modRequest.projectRoot, SMALL_ICON_DIRS_TO_SIZE);
            }
            if (cleverpushProps.smallIcons) {
                await saveIconsArrayAsync(config.modRequest.projectRoot, cleverpushProps.smallIcons, SMALL_ICON_DIRS_TO_SIZE);
            }
            return config;
        },
    ]);
};
const withNotificationColor = (config, cleverpushProps) => {
    if (!cleverpushProps.smallIconAccentColor) {
        return config;
    }
    return (0, config_plugins_1.withStringsXml)(config, (config) => {
        const strings = config.modResults;
        const stringEntry = {
            $: { name: 'cleverpush_notification_accent_color' },
            _: cleverpushProps.smallIconAccentColor,
        };
        if (strings.resources.string) {
            const existingEntry = strings.resources.string.find((entry) => { var _a; return ((_a = entry.$) === null || _a === void 0 ? void 0 : _a.name) === 'cleverpush_notification_accent_color'; });
            if (!existingEntry) {
                strings.resources.string.push(stringEntry);
            }
        }
        else {
            strings.resources.string = [stringEntry];
        }
        return config;
    });
};
async function saveIconAsync(iconPath, projectRoot, iconDirToSize) {
    await saveIconsArrayAsync(projectRoot, [iconPath], iconDirToSize);
}
async function saveIconsArrayAsync(projectRoot, iconPaths, iconDirToSize) {
    await Promise.all(iconPaths.map(async (iconPath) => {
        await Promise.all(Object.keys(iconDirToSize).map(async (iconDir) => {
            const size = iconDirToSize[iconDir];
            const dpiFolderPath = (0, path_1.resolve)(projectRoot, RESOURCE_ROOT_PATH, iconDir);
            if (!(0, fs_1.existsSync)(dpiFolderPath)) {
                (0, fs_1.mkdirSync)(dpiFolderPath, { recursive: true });
            }
            const iconOutputPath = (0, path_1.resolve)(dpiFolderPath, 'cleverpush_notification_icon.png');
            await (0, image_utils_1.generateImageAsync)({ projectRoot, cacheType: 'cleverpush-icon' }, {
                src: iconPath,
                width: size,
                height: size,
                resizeMode: 'cover',
                backgroundColor: 'transparent',
            });
        }));
    }));
}
const withCleverPushAndroid = (config, props) => {
    config = withNotificationIcons(config, props);
    config = withNotificationColor(config, props);
    return config;
};
exports.withCleverPushAndroid = withCleverPushAndroid;
