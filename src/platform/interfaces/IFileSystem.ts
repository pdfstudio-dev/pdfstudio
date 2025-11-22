/**
 * IFileSystem - Abstract interface for file system operations
 * Supports both Node.js (fs) and Browser (FileReader, fetch, Blob)
 */
export interface IFileSystem {
  /**
   * Read file from path or URL
   * Node.js: reads from filesystem
   * Browser: fetches from URL or reads from File object
   */
  readFile(source: string | File | Buffer): Promise<Buffer>

  /**
   * Write file to path or download
   * Node.js: writes to filesystem
   * Browser: triggers download
   */
  writeFile(filename: string, data: Buffer): Promise<void>

  /**
   * Check if file exists
   * Node.js: checks filesystem
   * Browser: always returns false (or check via fetch)
   */
  existsSync(path: string): boolean

  /**
   * Check if running in browser
   */
  isBrowser(): boolean
}
