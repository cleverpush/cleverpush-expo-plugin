import * as fs from 'fs';
import * as path from 'path';
import { CleverPushLog } from './CleverPushLog';
import { NSE_PODFILE_REGEX, NSE_PODFILE_SNIPPET } from './iosConstants';

export async function updatePodfile(iosPath: string): Promise<void> {
  const podfilePath = path.join(iosPath, 'Podfile');

  try {
    CleverPushLog.log(`[CleverPush] Checking for Podfile at: ${podfilePath}`);
    
    if (!fs.existsSync(podfilePath)) {
      CleverPushLog.log(`[CleverPush] Podfile not found at ${podfilePath}, skipping NSE Podfile update`);
      return;
    }

    let podfileContent = fs.readFileSync(podfilePath, 'utf8');

    if (NSE_PODFILE_REGEX.test(podfileContent)) {
      CleverPushLog.log(`[CleverPush] CleverPushNotificationServiceExtension target already exists in Podfile`);
      return;
    }
    CleverPushLog.log(`[CleverPush] Adding CleverPush NSE target to Podfile`);
    podfileContent += NSE_PODFILE_SNIPPET;

    fs.writeFileSync(podfilePath, podfileContent);
    CleverPushLog.log(`[CleverPush] Successfully updated Podfile with CleverPush NSE target`);
  } catch (error) {
    CleverPushLog.error(`[CleverPush] Failed to update Podfile: ${error}`);
  }
}