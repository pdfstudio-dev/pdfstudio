import { ImageParser } from '../../src/images/ImageParser';
import { ImageError } from '../../src/errors';
import { PlatformFactory } from '../../src/platform';
import * as pako from 'pako';

// Mock PlatformFactory so load() uses our buffer directly
jest.mock('../../src/platform', () => ({
  PlatformFactory: {
    getFileSystem: jest.fn(),
  },
}));

/**
 * Helper: configure the mock so PlatformFactory.getFileSystem().readFile
 * resolves with the given buffer.
 */
function mockReadFile(buffer: Buffer): void {
  (PlatformFactory.getFileSystem as jest.Mock).mockReturnValue({
    readFile: jest.fn().mockResolvedValue(buffer),
  });
}

// ---------------------------------------------------------------------------
// Minimal image buffer builders
// ---------------------------------------------------------------------------

/**
 * Build a minimal JPEG buffer with a SOF0 marker encoding width, height,
 * bits per component, and number of color components.
 */
function buildJPEGBuffer(opts: {
  width: number;
  height: number;
  bitsPerComponent?: number;
  components?: number;
}): Buffer {
  const { width, height, bitsPerComponent = 8, components = 3 } = opts;

  // SOF0 segment: marker (2) + length (2) + precision (1) + height (2) + width (2) + components (1)
  const segmentLength = 8 + components * 3; // length field includes itself
  const sof0 = Buffer.alloc(2 + 2 + 1 + 2 + 2 + 1 + components * 3);
  let pos = 0;
  // Marker
  sof0[pos++] = 0xff;
  sof0[pos++] = 0xc0;
  // Length (big-endian)
  sof0[pos++] = (segmentLength >> 8) & 0xff;
  sof0[pos++] = segmentLength & 0xff;
  // Precision (bits per component)
  sof0[pos++] = bitsPerComponent;
  // Height (big-endian)
  sof0[pos++] = (height >> 8) & 0xff;
  sof0[pos++] = height & 0xff;
  // Width (big-endian)
  sof0[pos++] = (width >> 8) & 0xff;
  sof0[pos++] = width & 0xff;
  // Number of components
  sof0[pos++] = components;
  // Component specs (id, sampling, quant table) – filler
  for (let i = 0; i < components; i++) {
    sof0[pos++] = i + 1;
    sof0[pos++] = 0x11;
    sof0[pos++] = 0;
  }

  // JPEG header: FF D8 FF (SOI + start of first marker byte)
  const header = Buffer.from([0xff, 0xd8]);
  return Buffer.concat([header, sof0]);
}

/**
 * Build a minimal PNG buffer with IHDR and a single IDAT chunk containing
 * valid deflate-compressed pixel data, followed by IEND.
 */
function buildPNGBuffer(opts: {
  width: number;
  height: number;
  bitDepth?: number;
  colorType?: number;
}): Buffer {
  const { width, height, bitDepth = 8, colorType = 2 } = opts;

  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // --- IHDR chunk ---
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = bitDepth;
  ihdrData[9] = colorType;
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = buildPNGChunk('IHDR', ihdrData);

  // --- IDAT chunk ---
  // Build raw scanline data: each row has a filter byte (0 = None) + pixel bytes
  let bytesPerPixel: number;
  if (colorType === 0) bytesPerPixel = 1;
  else if (colorType === 2) bytesPerPixel = 3;
  else if (colorType === 4) bytesPerPixel = 2;
  else if (colorType === 6) bytesPerPixel = 4;
  else bytesPerPixel = 3;

  const scanlineLength = 1 + width * bytesPerPixel; // filter byte + pixel data
  const rawData = Buffer.alloc(height * scanlineLength);
  // All zeros: filter=None, pixel data=0 — valid minimal image
  const compressedData = Buffer.from(pako.deflate(rawData));
  const idatChunk = buildPNGChunk('IDAT', compressedData);

  // --- IEND chunk ---
  const iendChunk = buildPNGChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

/**
 * Build a raw PNG chunk: length (4) + type (4) + data + CRC (4).
 * CRC is set to 0 for simplicity — the parser does not validate it.
 */
function buildPNGChunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4); // zeroed CRC; parser skips validation
  return Buffer.concat([length, typeBuffer, data, crc]);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ImageParser', () => {
  // ─── Format Detection ───

  describe('Format Detection (via load)', () => {
    it('should throw on an empty buffer', async () => {
      // Arrange
      const emptyBuffer = Buffer.alloc(0);
      mockReadFile(emptyBuffer);

      // Act & Assert
      await expect(ImageParser.load('empty.bin')).rejects.toThrow('Unknown image format');
    });

    it('should throw on a buffer with unsupported/invalid magic bytes', async () => {
      // Arrange
      const garbage = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04]);
      mockReadFile(garbage);

      // Act & Assert
      await expect(ImageParser.load('garbage.bin')).rejects.toThrow(
        'Unknown image format. Only JPEG and PNG are supported.'
      );
    });

    it('should throw on a buffer that is too small to match any signature', async () => {
      // Arrange
      const tiny = Buffer.from([0xff]);
      mockReadFile(tiny);

      // Act & Assert
      await expect(ImageParser.load('tiny.bin')).rejects.toThrow('Unknown image format');
    });
  });

  // ─── JPEG Parsing ───

  describe('JPEG Parsing', () => {
    it('should parse dimensions from a minimal JPEG with SOF0 marker', async () => {
      // Arrange
      const jpegBuffer = buildJPEGBuffer({ width: 640, height: 480 });
      mockReadFile(jpegBuffer);

      // Act
      const info = await ImageParser.load('test.jpg');

      // Assert
      expect(info.format).toBe('JPEG');
      expect(info.width).toBe(640);
      expect(info.height).toBe(480);
      expect(info.bitsPerComponent).toBe(8);
      expect(info.colorSpace).toBe('DeviceRGB');
      expect(info.filter).toBe('DCTDecode');
      expect(info.data).toEqual(jpegBuffer);
    });

    it('should detect DeviceGray color space for single-component JPEG', async () => {
      // Arrange
      const jpegBuffer = buildJPEGBuffer({
        width: 100,
        height: 200,
        components: 1,
      });
      mockReadFile(jpegBuffer);

      // Act
      const info = await ImageParser.load('gray.jpg');

      // Assert
      expect(info.colorSpace).toBe('DeviceGray');
    });

    it('should detect DeviceCMYK color space for 4-component JPEG', async () => {
      // Arrange
      const jpegBuffer = buildJPEGBuffer({
        width: 50,
        height: 50,
        components: 4,
      });
      mockReadFile(jpegBuffer);

      // Act
      const info = await ImageParser.load('cmyk.jpg');

      // Assert
      expect(info.colorSpace).toBe('DeviceCMYK');
    });

    it('should throw when no SOF marker is found (truncated JPEG)', async () => {
      // Arrange — valid JPEG header but no SOF marker
      const truncated = Buffer.from([0xff, 0xd8, 0xff, 0xe0]);
      mockReadFile(truncated);

      // Act & Assert
      await expect(ImageParser.load('truncated.jpg')).rejects.toThrow(
        'Could not determine JPEG dimensions'
      );
    });
  });

  // ─── PNG Parsing ───

  describe('PNG Parsing', () => {
    it('should parse dimensions from a minimal RGB PNG', async () => {
      // Arrange
      const pngBuffer = buildPNGBuffer({ width: 320, height: 240 });
      mockReadFile(pngBuffer);

      // Act
      const info = await ImageParser.load('test.png');

      // Assert
      expect(info.format).toBe('PNG');
      expect(info.width).toBe(320);
      expect(info.height).toBe(240);
      expect(info.bitsPerComponent).toBe(8);
      expect(info.colorSpace).toBe('DeviceRGB');
      expect(info.filter).toBe('FlateDecode');
      expect(info.hasAlpha).toBe(false);
    });

    it('should parse a grayscale PNG (colorType 0)', async () => {
      // Arrange
      const pngBuffer = buildPNGBuffer({
        width: 10,
        height: 10,
        colorType: 0,
      });
      mockReadFile(pngBuffer);

      // Act
      const info = await ImageParser.load('gray.png');

      // Assert
      expect(info.colorSpace).toBe('DeviceGray');
      expect(info.hasAlpha).toBe(false);
    });

    it('should detect alpha for RGBA PNG (colorType 6)', async () => {
      // Arrange
      const pngBuffer = buildPNGBuffer({
        width: 4,
        height: 4,
        colorType: 6,
      });
      mockReadFile(pngBuffer);

      // Act
      const info = await ImageParser.load('rgba.png');

      // Assert
      expect(info.hasAlpha).toBe(true);
      expect(info.colorSpace).toBe('DeviceRGB');
    });

    it('should throw when PNG has no IDAT chunks', async () => {
      // Arrange — PNG with IHDR but no IDAT
      const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
      const ihdrData = Buffer.alloc(13);
      ihdrData.writeUInt32BE(10, 0); // width
      ihdrData.writeUInt32BE(10, 4); // height
      ihdrData[8] = 8; // bitDepth
      ihdrData[9] = 2; // colorType RGB
      const ihdrChunk = buildPNGChunk('IHDR', ihdrData);
      const iendChunk = buildPNGChunk('IEND', Buffer.alloc(0));
      const pngNoIdat = Buffer.concat([signature, ihdrChunk, iendChunk]);
      mockReadFile(pngNoIdat);

      // Act & Assert
      await expect(ImageParser.load('no-idat.png')).rejects.toThrow('No IDAT chunks found in PNG');
    });
  });

  // ─── Error Handling ───

  describe('Error Handling', () => {
    it('should reject with an error on unsupported format', async () => {
      // Arrange — GIF magic bytes
      const gifBuffer = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]);
      mockReadFile(gifBuffer);

      // Act & Assert
      await expect(ImageParser.load('image.gif')).rejects.toThrow(
        'Unknown image format. Only JPEG and PNG are supported.'
      );
    });

    it('should reject when JPEG data is truncated (no SOF marker found)', async () => {
      // Arrange — JPEG header followed by an APP0 marker with no SOF
      const buf = Buffer.alloc(20, 0);
      buf[0] = 0xff;
      buf[1] = 0xd8;
      buf[2] = 0xff;
      buf[3] = 0xe0; // APP0 marker
      buf[4] = 0x00;
      buf[5] = 0x10; // length = 16
      mockReadFile(buf);

      // Act & Assert
      await expect(ImageParser.load('bad.jpg')).rejects.toThrow(
        'Could not determine JPEG dimensions'
      );
    });
  });
});
