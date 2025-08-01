import { ConfigPlugin } from '@expo/config-plugins';
import { ExpoConfig } from '@expo/config-types';
import { CleverPushPluginProps } from '../types/types';
import { withCleverPushAndroid } from './withCleverPushAndroid';
import { withCleverPushIos } from './withCleverPushIos';

const withCleverPush: ConfigPlugin<CleverPushPluginProps> = (config: ExpoConfig, props: CleverPushPluginProps) => {
  if (!props) {
    throw new Error(
      'You are trying to use the CleverPush plugin without any props. Property "mode" is required. Please see https://github.com/cleverpush/cleverpush-expo-plugin for more info.'
    );
  }

  if (!props.mode || (props.mode !== 'development' && props.mode !== 'production')) {
    throw new Error(
      'CleverPush plugin requires a valid "mode" property. Must be either "development" or "production".'
    );
  }

  config = withCleverPushIos(config, props);
  config = withCleverPushAndroid(config, props);

  return config;
};

export default withCleverPush; 