import * as fs from 'fs';
import { IFileSystem } from '../interfaces/IFileSystem';
import { ValidationError } from '../../errors';

/**
 * NodeFileSystem - Node.js implementation using fs module
 */
export class NodeFileSystem implements IFileSystem {
  async readFile(source: string | File | Buffer): Promise<Buffer> {
    if (Buffer.isBuffer(source)) {
      return source;
    }

    if (typeof source === 'string') {
      return fs.readFileSync(source);
    }

    throw new ValidationError(
      'File objects are not supported in Node.js. Use file path or Buffer.',
      'source'
    );
  }

  async writeFile(filename: string, data: Buffer): Promise<void> {
    fs.writeFileSync(filename, data);
  }

  existsSync(path: string): boolean {
    return fs.existsSync(path);
  }

  isBrowser(): boolean {
    return false;
  }
}
