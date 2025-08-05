import { ConfigPlugin, withDangerousMod } from '@expo/config-plugins';
import { ExpoConfig } from '@expo/config-types';
import { generateImageAsync } from '@expo/image-utils';
import { CleverPushPluginProps } from '../types/types';
import { resolve } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

const RESOURCE_ROOT_PATH = 'android/app/src/main/res/';

const SMALL_ICON_DIRS_TO_SIZE: { [name: string]: number } = {
  'drawable-mdpi': 24,
  'drawable-hdpi': 36,
  'drawable-xhdpi': 48,
  'drawable-xxhdpi': 72,
  'drawable-xxxhdpi': 96
};

const withNotificationIcons: ConfigPlugin<CleverPushPluginProps> = (
  config: ExpoConfig,
  cleverpushProps: CleverPushPluginProps
) => {
  if (!config.notification?.icon) {
    return config;
  }

  return withDangerousMod(config, [
    'android',
    async (config: any) => {
      if (config.notification?.icon) {
        await saveIconAsync(config.notification.icon, config.modRequest.projectRoot, SMALL_ICON_DIRS_TO_SIZE);
      }
      
      return config;
    },
  ]);
};

async function saveIconAsync(
  iconPath: string,
  projectRoot: string,
  iconDirToSize: { [name: string]: number }
): Promise<void> {
  await Promise.all(
    Object.keys(iconDirToSize).map(async (iconDir: string) => {
      const size = iconDirToSize[iconDir];
      const dpiFolderPath = resolve(projectRoot, RESOURCE_ROOT_PATH, iconDir);
      
      if (!existsSync(dpiFolderPath)) {
        mkdirSync(dpiFolderPath, { recursive: true });
      }

      const iconOutputPath = resolve(dpiFolderPath, 'cleverpush_notification_icon.png');
      
      const { source } = await generateImageAsync(
        { projectRoot, cacheType: 'cleverpush-icon' },
        {
          src: iconPath,
          width: size,
          height: size,
          resizeMode: 'cover',
          backgroundColor: 'transparent',
        }
      );
      
      writeFileSync(iconOutputPath, source);
    })
  );
}

export const withCleverPushAndroid: ConfigPlugin<CleverPushPluginProps> = (
  config: ExpoConfig,
  props: CleverPushPluginProps
) => {
  config = withNotificationIcons(config, props);
  
  return config;
}; 