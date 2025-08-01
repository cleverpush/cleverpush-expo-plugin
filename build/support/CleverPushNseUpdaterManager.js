"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FileManager_1 = require("./FileManager");
const CleverPushLog_1 = require("./CleverPushLog");
const iosConstants_1 = require("./iosConstants");
// project `ios/CleverPushNotificationServiceExtension` directory
const entitlementsFileName = `CleverPushNotificationServiceExtension.entitlements`;
const plistFileName = `CleverPushNotificationServiceExtension-Info.plist`;
class CleverPushNseUpdaterManager {
    constructor(iosPath) {
        this.nsePath = '';
        this.nsePath = `${iosPath}/${iosConstants_1.NSE_TARGET_NAME}`;
        CleverPushLog_1.CleverPushLog.log(`[CleverPush] NSE Updater initialized for path: ${this.nsePath}`);
    }
    async updateNSEEntitlements(groupIdentifier) {
        try {
            const entitlementsFilePath = `${this.nsePath}/${entitlementsFileName}`;
            CleverPushLog_1.CleverPushLog.log(`[CleverPush] Updating NSE entitlements at: ${entitlementsFilePath}`);
            let entitlementsFile = await FileManager_1.FileManager.readFile(entitlementsFilePath);
            entitlementsFile = entitlementsFile.replace(iosConstants_1.GROUP_IDENTIFIER_TEMPLATE_REGEX, groupIdentifier);
            await FileManager_1.FileManager.writeFile(entitlementsFilePath, entitlementsFile);
            CleverPushLog_1.CleverPushLog.log(`[CleverPush] Successfully updated NSE entitlements with group identifier: ${groupIdentifier}`);
        }
        catch (error) {
            CleverPushLog_1.CleverPushLog.error(`[CleverPush] Failed to update NSE entitlements: ${error}`);
            throw error;
        }
    }
    async updateNSEBundleVersion(version) {
        try {
            const plistFilePath = `${this.nsePath}/${plistFileName}`;
            CleverPushLog_1.CleverPushLog.log(`[CleverPush] Updating NSE bundle version to: ${version}`);
            let plistFile = await FileManager_1.FileManager.readFile(plistFilePath);
            plistFile = plistFile.replace(iosConstants_1.BUNDLE_VERSION_TEMPLATE_REGEX, version);
            await FileManager_1.FileManager.writeFile(plistFilePath, plistFile);
            CleverPushLog_1.CleverPushLog.log(`[CleverPush] Successfully updated NSE bundle version to: ${version}`);
        }
        catch (error) {
            CleverPushLog_1.CleverPushLog.error(`[CleverPush] Failed to update NSE bundle version: ${error}`);
            throw error;
        }
    }
    async updateNSEBundleShortVersion(version) {
        try {
            const plistFilePath = `${this.nsePath}/${plistFileName}`;
            CleverPushLog_1.CleverPushLog.log(`[CleverPush] Updating NSE bundle short version to: ${version}`);
            let plistFile = await FileManager_1.FileManager.readFile(plistFilePath);
            plistFile = plistFile.replace(iosConstants_1.BUNDLE_SHORT_VERSION_TEMPLATE_REGEX, version);
            await FileManager_1.FileManager.writeFile(plistFilePath, plistFile);
            CleverPushLog_1.CleverPushLog.log(`[CleverPush] Successfully updated NSE bundle short version to: ${version}`);
        }
        catch (error) {
            CleverPushLog_1.CleverPushLog.error(`[CleverPush] Failed to update NSE bundle short version: ${error}`);
            throw error;
        }
    }
}
exports.default = CleverPushNseUpdaterManager;
