export type CleverPushPluginProps = {
  mode: Mode;
  devTeam?: string;
};

export type Mode = "development" | "production";

export const CLEVERPUSH_PLUGIN_PROPS = [
  "mode",
  "devTeam"
]; 