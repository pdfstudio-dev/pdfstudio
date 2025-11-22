import * as fs from 'fs'
import { IFileSystem } from '../interfaces/IFileSystem'

/**
 * NodeFileSystem - Node.js implementation using fs module
 */
export class NodeFileSystem implements IFileSystem {
  async readFile(source: string | File | Buffer): Promise<Buffer> {
    if (Buffer.isBuffer(source)) {
      return source
    }

    if (typeof source === 'string') {
      return fs.readFileSync(source)
    }

    throw new Error('File objects are not supported in Node.js. Use file path or Buffer.')
  }

  async writeFile(filename: string, data: Buffer): Promise<void> {
    fs.writeFileSync(filename, data)
  }

  existsSync(path: string): boolean {
    return fs.existsSync(path)
  }

  isBrowser(): boolean {
    return false
  }
}
