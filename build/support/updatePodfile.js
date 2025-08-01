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
exports.updatePodfile = updatePodfile;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const CleverPushLog_1 = require("./CleverPushLog");
const iosConstants_1 = require("./iosConstants");
async function updatePodfile(iosPath) {
    const podfilePath = path.join(iosPath, 'Podfile');
    try {
        CleverPushLog_1.CleverPushLog.log(`[CleverPush] Checking for Podfile at: ${podfilePath}`);
        if (!fs.existsSync(podfilePath)) {
            CleverPushLog_1.CleverPushLog.log(`[CleverPush] Podfile not found at ${podfilePath}, skipping NSE Podfile update`);
            return;
        }
        let podfileContent = fs.readFileSync(podfilePath, 'utf8');
        // Check if CleverPush NSE target already exists
        if (iosConstants_1.NSE_PODFILE_REGEX.test(podfileContent)) {
            CleverPushLog_1.CleverPushLog.log(`[CleverPush] CleverPushNotificationServiceExtension target already exists in Podfile`);
            return;
        }
        // Add CleverPush NSE target to the end of the file
        CleverPushLog_1.CleverPushLog.log(`[CleverPush] Adding CleverPush NSE target to Podfile`);
        podfileContent += iosConstants_1.NSE_PODFILE_SNIPPET;
        fs.writeFileSync(podfilePath, podfileContent);
        CleverPushLog_1.CleverPushLog.log(`[CleverPush] Successfully updated Podfile with CleverPush NSE target`);
    }
    catch (error) {
        CleverPushLog_1.CleverPushLog.error(`[CleverPush] Failed to update Podfile: ${error}`);
        // Don't throw error to avoid breaking the build - Podfile update is optional
    }
}
