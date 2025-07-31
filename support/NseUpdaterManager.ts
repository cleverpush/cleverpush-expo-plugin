import * as fs from 'fs';
import * as path from 'path';
import { CleverPushLog } from './CleverPushLog';

export default class NseUpdaterManager {
  private iosPath: string;

  constructor(iosPath: string) {
    this.iosPath = iosPath;
  }

  async updateNSEEntitlements(appGroup: string): Promise<void> {
    const entitlementsPath = path.join(this.iosPath, 'CleverPushNotificationServiceExtension', 'CleverPushNotificationServiceExtension.entitlements');
    
    try {
      let entitlementsContent = fs.readFileSync(entitlementsPath, 'utf8');
      
      entitlementsContent = entitlementsContent.replace(
        /group\.\$\(PRODUCT_BUNDLE_IDENTIFIER\)\.cleverpush/g,
        appGroup
      );
      
      fs.writeFileSync(entitlementsPath, entitlementsContent);
      CleverPushLog.log('Updated NSE entitlements with app group:', appGroup);
    } catch (error) {
      CleverPushLog.error('Failed to update NSE entitlements:', error);
      throw error;
    }
  }

  async updateNSEBundleVersion(buildNumber: string): Promise<void> {
    const infoPlistPath = path.join(this.iosPath, 'CleverPushNotificationServiceExtension', 'CleverPushNotificationServiceExtension-Info.plist');
    
    try {
      let plistContent = fs.readFileSync(infoPlistPath, 'utf8');
      
      plistContent = plistContent.replace(
        /<key>CFBundleVersion<\/key>\s*<string>.*<\/string>/,
        `<key>CFBundleVersion</key>\n\t<string>${buildNumber}</string>`
      );
      
      fs.writeFileSync(infoPlistPath, plistContent);
      CleverPushLog.log('Updated NSE bundle version to:', buildNumber);
    } catch (error) {
      CleverPushLog.error('Failed to update NSE bundle version:', error);
      throw error;
    }
  }

  async updateNSEBundleShortVersion(shortVersion: string): Promise<void> {
    const infoPlistPath = path.join(this.iosPath, 'CleverPushNotificationServiceExtension', 'CleverPushNotificationServiceExtension-Info.plist');
    
    try {
      let plistContent = fs.readFileSync(infoPlistPath, 'utf8');
      
      plistContent = plistContent.replace(
        /<key>CFBundleShortVersionString<\/key>\s*<string>.*<\/string>/,
        `<key>CFBundleShortVersionString</key>\n\t<string>${shortVersion}</string>`
      );
      
      fs.writeFileSync(infoPlistPath, plistContent);
      CleverPushLog.log('Updated NSE bundle short version to:', shortVersion);
    } catch (error) {
      CleverPushLog.error('Failed to update NSE bundle short version:', error);
      throw error;
    }
  }
} 