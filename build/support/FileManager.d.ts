export declare class FileManager {
    static copyFile(sourcePath: string, targetPath: string): Promise<void>;
    static ensureDirectoryExists(dirPath: string): Promise<void>;
    static readFile(filePath: string): Promise<string>;
    static writeFile(filePath: string, content: string): Promise<void>;
}
