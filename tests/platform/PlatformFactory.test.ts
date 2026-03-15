import { PlatformFactory } from '../../src/platform/PlatformFactory';

describe('PlatformFactory', () => {
  afterEach(() => {
    PlatformFactory.reset();
  });

  describe('isBrowser', () => {
    it('should return false in Node.js environment', () => {
      expect(PlatformFactory.isBrowser()).toBe(false);
    });
  });

  describe('getFileSystem', () => {
    it('should return an object with readFile, writeFile, and existsSync methods', () => {
      const fs = PlatformFactory.getFileSystem();
      expect(typeof fs.readFile).toBe('function');
      expect(typeof fs.writeFile).toBe('function');
      expect(typeof fs.existsSync).toBe('function');
    });

    it('should return the same instance on multiple calls (singleton)', () => {
      const fs1 = PlatformFactory.getFileSystem();
      const fs2 = PlatformFactory.getFileSystem();
      expect(fs1).toBe(fs2);
    });
  });

  describe('getImageProcessor', () => {
    it('should return an object with load and create methods', () => {
      const processor = PlatformFactory.getImageProcessor();
      expect(typeof processor.load).toBe('function');
      expect(typeof processor.create).toBe('function');
    });
  });

  describe('reset', () => {
    it('should clear cached instances', () => {
      const fsBefore = PlatformFactory.getFileSystem();
      PlatformFactory.reset();
      const fsAfter = PlatformFactory.getFileSystem();
      expect(fsBefore).not.toBe(fsAfter);
    });

    it('should cause getFileSystem to return a new instance after reset', () => {
      const fs1 = PlatformFactory.getFileSystem();
      PlatformFactory.reset();
      const fs2 = PlatformFactory.getFileSystem();
      expect(fs1).not.toBe(fs2);
    });
  });
});
