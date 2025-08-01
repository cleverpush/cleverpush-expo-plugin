import { FileManager } from './FileManager';
import { CleverPushLog } from './CleverPushLog';
import {
  BUNDLE_SHORT_VERSION_TEMPLATE_REGEX,
  BUNDLE_VERSION_TEMPLATE_REGEX,
  GROUP_IDENTIFIER_TEMPLATE_REGEX,
  NSE_TARGET_NAME
} from './iosConstants';

// project `ios/CleverPushNotificationServiceExtension` directory
const entitlementsFileName = `CleverPushNotificationServiceExtension.entitlements`;
const plistFileName = `CleverPushNotificationServiceExtension-Info.plist`;

export default class CleverPushNseUpdaterManager {
  private nsePath = '';
  
  constructor(iosPath: string) {
    this.nsePath = `${iosPath}/${NSE_TARGET_NAME}`;
    CleverPushLog.log(`[CleverPush] NSE Updater initialized for path: ${this.nsePath}`);
  }

  async updateNSEEntitlements(groupIdentifier: string): Promise<void> {
    try {
      const entitlementsFilePath = `${this.nsePath}/${entitlementsFileName}`;
      CleverPushLog.log(`[CleverPush] Updating NSE entitlements at: ${entitlementsFilePath}`);
      
      let entitlementsFile = await FileManager.readFile(entitlementsFilePath);
      entitlementsFile = entitlementsFile.replace(GROUP_IDENTIFIER_TEMPLATE_REGEX, groupIdentifier);
      await FileManager.writeFile(entitlementsFilePath, entitlementsFile);
      
      CleverPushLog.log(`[CleverPush] Successfully updated NSE entitlements with group identifier: ${groupIdentifier}`);
    } catch (error) {
      CleverPushLog.error(`[CleverPush] Failed to update NSE entitlements: ${error}`);
      throw error;
    }
  }

  async updateNSEBundleVersion(version: string): Promise<void> {
    try {
      const plistFilePath = `${this.nsePath}/${plistFileName}`;
      CleverPushLog.log(`[CleverPush] Updating NSE bundle version to: ${version}`);
      
      let plistFile = await FileManager.readFile(plistFilePath);
      plistFile = plistFile.replace(BUNDLE_VERSION_TEMPLATE_REGEX, version);
      await FileManager.writeFile(plistFilePath, plistFile);
      
      CleverPushLog.log(`[CleverPush] Successfully updated NSE bundle version to: ${version}`);
    } catch (error) {
      CleverPushLog.error(`[CleverPush] Failed to update NSE bundle version: ${error}`);
      throw error;
    }
  }

  async updateNSEBundleShortVersion(version: string): Promise<void> {
    try {
      const plistFilePath = `${this.nsePath}/${plistFileName}`;
      CleverPushLog.log(`[CleverPush] Updating NSE bundle short version to: ${version}`);
      
      let plistFile = await FileManager.readFile(plistFilePath);
      plistFile = plistFile.replace(BUNDLE_SHORT_VERSION_TEMPLATE_REGEX, version);
      await FileManager.writeFile(plistFilePath, plistFile);
      
      CleverPushLog.log(`[CleverPush] Successfully updated NSE bundle short version to: ${version}`);
    } catch (error) {
      CleverPushLog.error(`[CleverPush] Failed to update NSE bundle short version: ${error}`);
      throw error;
    }
  }
}