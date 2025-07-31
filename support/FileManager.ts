import * as fs from 'fs';
import * as path from 'path';
import { CleverPushLog } from './CleverPushLog';

export class FileManager {
  static async copyFile(sourcePath: string, targetPath: string): Promise<void> {
    try {
      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      fs.copyFileSync(sourcePath, targetPath);
      CleverPushLog.log(`Copied ${sourcePath} to ${targetPath}`);
    } catch (error) {
      CleverPushLog.error(`Failed to copy file from ${sourcePath} to ${targetPath}:`, error);
      throw error;
    }
  }

  static async ensureDirectoryExists(dirPath: string): Promise<void> {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      CleverPushLog.log(`Created directory: ${dirPath}`);
    }
  }
} 