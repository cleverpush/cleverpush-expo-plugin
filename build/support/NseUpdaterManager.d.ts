export default class NseUpdaterManager {
    private iosPath;
    constructor(iosPath: string);
    updateNSEEntitlements(appGroup: string): Promise<void>;
    updateNSEBundleVersion(buildNumber: string): Promise<void>;
    updateNSEBundleShortVersion(shortVersion: string): Promise<void>;
}
