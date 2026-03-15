import { QRCodeGenerator } from '../../src/qrcode/QRCodeGenerator';

describe('QRCodeGenerator', () => {
  describe('calculateOptimalSize', () => {
    it('should return a positive number', () => {
      const size = QRCodeGenerator.calculateOptimalSize('hello');
      expect(size).toBeGreaterThan(0);
    });

    it('should return larger size for longer data with larger target', () => {
      const smallTarget = QRCodeGenerator.calculateOptimalSize('hi', 50);
      const largeTarget = QRCodeGenerator.calculateOptimalSize('hi', 200);
      expect(largeTarget).toBeGreaterThan(smallTarget);
    });

    it('should use default target size of 100', () => {
      const size = QRCodeGenerator.calculateOptimalSize('hi');
      expect(size).toBeGreaterThanOrEqual(100);
    });
  });

  describe('generate', () => {
    it('should return a Buffer for simple text data', async () => {
      const buffer = await QRCodeGenerator.generate({
        data: 'Hello World',
        x: 0,
        y: 0,
      });
      expect(Buffer.isBuffer(buffer)).toBe(true);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('should return a Buffer for URL data', async () => {
      const buffer = await QRCodeGenerator.generate({
        data: { url: 'https://example.com' },
        x: 0,
        y: 0,
      });
      expect(Buffer.isBuffer(buffer)).toBe(true);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('should produce a valid PNG', async () => {
      const buffer = await QRCodeGenerator.generate({
        data: 'test',
        x: 0,
        y: 0,
      });
      // PNG magic bytes: 0x89 0x50 0x4E 0x47 (i.e. \x89PNG)
      expect(buffer[0]).toBe(0x89);
      expect(buffer[1]).toBe(0x50); // P
      expect(buffer[2]).toBe(0x4e); // N
      expect(buffer[3]).toBe(0x47); // G
    });

    it('should throw on empty object data with no valid fields', async () => {
      await expect(
        QRCodeGenerator.generate({
          data: {} as any,
          x: 0,
          y: 0,
        })
      ).rejects.toThrow('No valid QR code data provided');
    });
  });
});
