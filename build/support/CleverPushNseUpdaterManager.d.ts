export default class CleverPushNseUpdaterManager {
    private nsePath;
    constructor(iosPath: string);
    updateNSEEntitlements(groupIdentifier: string): Promise<void>;
    updateNSEBundleVersion(version: string): Promise<void>;
    updateNSEBundleShortVersion(version: string): Promise<void>;
}
