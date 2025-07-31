import { ConfigPlugin, withDangerousMod, withStringsXml } from '@expo/config-plugins';
import { generateImageAsync } from '@expo/image-utils';
import { CleverPushPluginProps } from '../types/types';
import { resolve } from 'path';
import { existsSync, mkdirSync } from 'fs';

const RESOURCE_ROOT_PATH = 'android/app/src/main/res/';

const SMALL_ICON_DIRS_TO_SIZE: { [name: string]: number } = {
  'drawable-mdpi': 24,
  'drawable-hdpi': 36,
  'drawable-xhdpi': 48,
  'drawable-xxhdpi': 72,
  'drawable-xxxhdpi': 96
};

const withNotificationIcons: ConfigPlugin<CleverPushPluginProps> = (
  config,
  cleverpushProps
) => {
  if (!cleverpushProps.smallIcons && !config.notification?.icon) {
    return config;
  }

  return withDangerousMod(config, [
    'android',
    async (config) => {
      if (config.notification?.icon) {
        await saveIconAsync(config.notification.icon, config.modRequest.projectRoot, SMALL_ICON_DIRS_TO_SIZE);
      }

      if (cleverpushProps.smallIcons) {
        await saveIconsArrayAsync(config.modRequest.projectRoot, cleverpushProps.smallIcons, SMALL_ICON_DIRS_TO_SIZE);
      }
      
      return config;
    },
  ]);
};

const withNotificationColor: ConfigPlugin<CleverPushPluginProps> = (
  config,
  cleverpushProps
) => {
  if (!cleverpushProps.smallIconAccentColor) {
    return config;
  }

  return withStringsXml(config, (config) => {
    const strings = config.modResults;
    
    const stringEntry = {
      $: { name: 'cleverpush_notification_accent_color' },
      _: cleverpushProps.smallIconAccentColor!,
    };

    if (strings.resources.string) {
      const existingEntry = strings.resources.string.find(
        (entry: any) => entry.$?.name === 'cleverpush_notification_accent_color'
      );
      if (!existingEntry) {
        strings.resources.string.push(stringEntry);
      }
    } else {
      strings.resources.string = [stringEntry];
    }

    return config;
  });
};

async function saveIconAsync(
  iconPath: string,
  projectRoot: string,
  iconDirToSize: { [name: string]: number }
): Promise<void> {
  await saveIconsArrayAsync(projectRoot, [iconPath], iconDirToSize);
}

async function saveIconsArrayAsync(
  projectRoot: string,
  iconPaths: string[],
  iconDirToSize: { [name: string]: number }
): Promise<void> {
  await Promise.all(
    iconPaths.map(async (iconPath: string) => {
      await Promise.all(
        Object.keys(iconDirToSize).map(async (iconDir: string) => {
          const size = iconDirToSize[iconDir];
          const dpiFolderPath = resolve(projectRoot, RESOURCE_ROOT_PATH, iconDir);
          
          if (!existsSync(dpiFolderPath)) {
            mkdirSync(dpiFolderPath, { recursive: true });
          }

          const iconOutputPath = resolve(dpiFolderPath, 'cleverpush_notification_icon.png');
          
          await generateImageAsync(
            { projectRoot, cacheType: 'cleverpush-icon' },
            {
              src: iconPath,
              width: size,
              height: size,
              resizeMode: 'cover',
              backgroundColor: 'transparent',
            }
          );
        })
      );
    })
  );
}

export const withCleverPushAndroid: ConfigPlugin<CleverPushPluginProps> = (
  config,
  props
) => {
  config = withNotificationIcons(config, props);
  
  config = withNotificationColor(config, props);
  
  return config;
}; 