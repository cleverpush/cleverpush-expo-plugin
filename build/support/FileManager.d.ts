export declare class FileManager {
    static copyFile(sourcePath: string, targetPath: string): Promise<void>;
    static ensureDirectoryExists(dirPath: string): Promise<void>;
}
