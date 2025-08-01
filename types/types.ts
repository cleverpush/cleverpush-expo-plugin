export type CleverPushPluginProps = {
  mode: Mode;
  smallIcons?: string[];
  smallIconAccentColor?: string;
  devTeam?: string;
  iPhoneDeploymentTarget?: string;
  iosNSEFilePath?: string;
};

export type Mode = "development" | "production";

export const CLEVERPUSH_PLUGIN_PROPS = [
  "mode", 
  "smallIcons", 
  "smallIconAccentColor",
  "devTeam",
  "iPhoneDeploymentTarget",
  "iosNSEFilePath"
]; 