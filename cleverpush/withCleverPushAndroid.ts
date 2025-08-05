import { ConfigPlugin, withDangerousMod, withAppBuildGradle, withProjectBuildGradle } from '@expo/config-plugins';
import { ExpoConfig } from '@expo/config-types';
import { generateImageAsync } from '@expo/image-utils';
import { CleverPushPluginProps } from '../types/types';
import { resolve } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

const RESOURCE_ROOT_PATH = 'android/app/src/main/res/';

const GOOGLE_SERVICES_CLASSPATH = "classpath(\"com.google.gms:google-services:4.3.3\")";
const GOOGLE_SERVICES_PLUGIN = "apply plugin: 'com.google.gms.google-services'";
const GOOGLE_SERVICES_CONFIG = "googleServices { disableVersionCheck = true }";

const addGoogleServicesClasspathToRootBuildGradle: ConfigPlugin = (config) => {
  return withProjectBuildGradle(config, (config) => {
    if (!config.modResults.contents.includes(GOOGLE_SERVICES_CLASSPATH)) {
      // Find the dependencies block and add the classpath
      const dependenciesIndex = config.modResults.contents.indexOf('dependencies {');
      if (dependenciesIndex !== -1) {
        const beforeDependencies = config.modResults.contents.substring(0, dependenciesIndex);
        const afterDependencies = config.modResults.contents.substring(dependenciesIndex);
        
        // Find the closing brace of dependencies block
        let braceCount = 0;
        let endIndex = -1;
        for (let i = 0; i < afterDependencies.length; i++) {
          if (afterDependencies[i] === '{') braceCount++;
          if (afterDependencies[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
              endIndex = i;
              break;
            }
          }
        }
        
        if (endIndex !== -1) {
          const dependenciesContent = afterDependencies.substring(0, endIndex);
          const afterDependenciesBlock = afterDependencies.substring(endIndex);
          
          // Add the classpath before the closing brace
          const updatedDependencies = dependenciesContent + `    ${GOOGLE_SERVICES_CLASSPATH}\n`;
          config.modResults.contents = beforeDependencies + updatedDependencies + afterDependenciesBlock;
        }
      }
    }
    return config;
  });
};

const addGoogleServicesPluginToAppBuildGradle: ConfigPlugin = (config) => {
  return withAppBuildGradle(config, (config) => {
    // Add the plugin if it doesn't exist
    if (!config.modResults.contents.includes(GOOGLE_SERVICES_PLUGIN)) {
      config.modResults.contents += `\n${GOOGLE_SERVICES_PLUGIN}\n`;
    }
    
    // Add the configuration if it doesn't exist
    if (!config.modResults.contents.includes(GOOGLE_SERVICES_CONFIG)) {
      config.modResults.contents += `${GOOGLE_SERVICES_CONFIG}\n`;
    }
    
    return config;
  });
};

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
  config = addGoogleServicesClasspathToRootBuildGradle(config);
  config = addGoogleServicesPluginToAppBuildGradle(config);
  config = withNotificationIcons(config, props);
  
  return config;
}; 