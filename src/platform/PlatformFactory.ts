import { IFileSystem } from './interfaces/IFileSystem'
import { IImageProcessor } from './interfaces/IImageProcessor'

/**
 * PlatformFactory - Auto-detects environment and returns appropriate implementation
 */
export class PlatformFactory {
  private static fileSystem: IFileSystem | null = null
  private static imageProcessor: IImageProcessor | null = null

  /**
   * Detect if running in browser
   */
  static isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined'
  }

  /**
   * Get FileSystem implementation for current platform
   */
  static getFileSystem(): IFileSystem {
    if (this.fileSystem) {
      return this.fileSystem
    }

    if (this.isBrowser()) {
      // Dynamic import for browser implementation
      const { BrowserFileSystem } = require('./browser/BrowserFileSystem')
      this.fileSystem = new BrowserFileSystem()
    } else {
      // Dynamic import for Node.js implementation
      const { NodeFileSystem } = require('./node/NodeFileSystem')
      this.fileSystem = new NodeFileSystem()
    }

    return this.fileSystem!
  }

  /**
   * Get ImageProcessor implementation for current platform
   */
  static getImageProcessor(): IImageProcessor {
    if (this.imageProcessor) {
      return this.imageProcessor
    }

    if (this.isBrowser()) {
      // Dynamic import for browser implementation
      const { BrowserImageProcessor } = require('./browser/BrowserImageProcessor')
      this.imageProcessor = new BrowserImageProcessor()
    } else {
      // Dynamic import for Node.js implementation
      const { NodeImageProcessor } = require('./node/NodeImageProcessor')
      this.imageProcessor = new NodeImageProcessor()
    }

    return this.imageProcessor!
  }

  /**
   * Reset cached instances (useful for testing)
   */
  static reset(): void {
    this.fileSystem = null
    this.imageProcessor = null
  }
}
