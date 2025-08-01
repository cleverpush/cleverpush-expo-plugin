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
exports.FileManager = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const CleverPushLog_1 = require("./CleverPushLog");
class FileManager {
    static async copyFile(sourcePath, targetPath) {
        try {
            const targetDir = path.dirname(targetPath);
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }
            fs.copyFileSync(sourcePath, targetPath);
            CleverPushLog_1.CleverPushLog.log(`Copied ${sourcePath} to ${targetPath}`);
        }
        catch (error) {
            CleverPushLog_1.CleverPushLog.error(`Failed to copy file from ${sourcePath} to ${targetPath}:`, error);
            throw error;
        }
    }
    static async ensureDirectoryExists(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            CleverPushLog_1.CleverPushLog.log(`Created directory: ${dirPath}`);
        }
    }
    static async readFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            CleverPushLog_1.CleverPushLog.log(`Read file: ${filePath}`);
            return content;
        }
        catch (error) {
            CleverPushLog_1.CleverPushLog.error(`Failed to read file ${filePath}:`, error);
            throw error;
        }
    }
    static async writeFile(filePath, content) {
        try {
            const targetDir = path.dirname(filePath);
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }
            fs.writeFileSync(filePath, content, 'utf8');
            CleverPushLog_1.CleverPushLog.log(`Wrote file: ${filePath}`);
        }
        catch (error) {
            CleverPushLog_1.CleverPushLog.error(`Failed to write file ${filePath}:`, error);
            throw error;
        }
    }
}
exports.FileManager = FileManager;
