export type CleverPushPluginProps = {
    mode: Mode;
    smallIcons?: string[];
    smallIconAccentColor?: string;
    devTeam?: string;
    iPhoneDeploymentTarget?: string;
};
export type Mode = "development" | "production";
export declare const CLEVERPUSH_PLUGIN_PROPS: string[];
