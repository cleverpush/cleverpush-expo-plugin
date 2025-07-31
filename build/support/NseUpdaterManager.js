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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const CleverPushLog_1 = require("./CleverPushLog");
class NseUpdaterManager {
    constructor(iosPath) {
        this.iosPath = iosPath;
    }
    async updateNSEEntitlements(appGroup) {
        const entitlementsPath = path.join(this.iosPath, 'CleverPushNotificationServiceExtension', 'CleverPushNotificationServiceExtension.entitlements');
        try {
            let entitlementsContent = fs.readFileSync(entitlementsPath, 'utf8');
            entitlementsContent = entitlementsContent.replace(/group\.\$\(PRODUCT_BUNDLE_IDENTIFIER\)\.cleverpush/g, appGroup);
            fs.writeFileSync(entitlementsPath, entitlementsContent);
            CleverPushLog_1.CleverPushLog.log('Updated NSE entitlements with app group:', appGroup);
        }
        catch (error) {
            CleverPushLog_1.CleverPushLog.error('Failed to update NSE entitlements:', error);
            throw error;
        }
    }
    async updateNSEBundleVersion(buildNumber) {
        const infoPlistPath = path.join(this.iosPath, 'CleverPushNotificationServiceExtension', 'CleverPushNotificationServiceExtension-Info.plist');
        try {
            let plistContent = fs.readFileSync(infoPlistPath, 'utf8');
            plistContent = plistContent.replace(/<key>CFBundleVersion<\/key>\s*<string>.*<\/string>/, `<key>CFBundleVersion</key>\n\t<string>${buildNumber}</string>`);
            fs.writeFileSync(infoPlistPath, plistContent);
            CleverPushLog_1.CleverPushLog.log('Updated NSE bundle version to:', buildNumber);
        }
        catch (error) {
            CleverPushLog_1.CleverPushLog.error('Failed to update NSE bundle version:', error);
            throw error;
        }
    }
    async updateNSEBundleShortVersion(shortVersion) {
        const infoPlistPath = path.join(this.iosPath, 'CleverPushNotificationServiceExtension', 'CleverPushNotificationServiceExtension-Info.plist');
        try {
            let plistContent = fs.readFileSync(infoPlistPath, 'utf8');
            plistContent = plistContent.replace(/<key>CFBundleShortVersionString<\/key>\s*<string>.*<\/string>/, `<key>CFBundleShortVersionString</key>\n\t<string>${shortVersion}</string>`);
            fs.writeFileSync(infoPlistPath, plistContent);
            CleverPushLog_1.CleverPushLog.log('Updated NSE bundle short version to:', shortVersion);
        }
        catch (error) {
            CleverPushLog_1.CleverPushLog.error('Failed to update NSE bundle short version:', error);
            throw error;
        }
    }
}
exports.default = NseUpdaterManager;
