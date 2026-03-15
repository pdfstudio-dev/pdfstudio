import { FontManager, FontInfo } from '../../src/fonts/FontManager';
import {
  getFontMetrics,
  measureText,
  HELVETICA_WIDTHS,
  TIMES_WIDTHS,
  COURIER_WIDTHS,
} from '../../src/fonts/StandardFontMetrics';

// Helper to create a mock FontInfo for testing methods that don't call fontkit
function createMockFontInfo(overrides: Partial<FontInfo> = {}): FontInfo {
  return {
    name: 'TestFont',
    fontData: Buffer.from('fake-font-data'),
    font: {
      bbox: { minX: -100, minY: -200, maxX: 1000, maxY: 800 },
      italicAngle: 0,
      ascent: 800,
      descent: -200,
      capHeight: 700,
      unitsPerEm: 1000,
      numGlyphs: 100,
      layout: jest.fn().mockReturnValue({ advanceWidth: 5000 }),
      glyphsForString: jest.fn().mockImplementation((char: string) => {
        const code = char.charCodeAt(0);
        return [{ id: code, advanceWidth: 500 }];
      }),
      getGlyph: jest.fn().mockImplementation((id: number) => ({ id, advanceWidth: 500 })),
      createSubset: jest.fn().mockReturnValue({
        includeGlyph: jest.fn(),
        encode: jest.fn().mockReturnValue(new Uint8Array([0, 1, 2, 3])),
      }),
    } as unknown as FontInfo['font'],
    subset: false,
    usedChars: new Set<number>(),
    usedGlyphs: new Set<number>(),
    ...overrides,
  };
}

describe('FontManager', () => {
  let fontManager: FontManager;

  beforeEach(() => {
    fontManager = new FontManager();
  });

  describe('constructor', () => {
    it('should create an instance with empty loaded fonts', () => {
      // Arrange & Act - done in beforeEach

      // Assert
      expect(fontManager.getAllFonts().size).toBe(0);
    });
  });

  describe('getFont', () => {
    it('should return undefined for a non-existent font', () => {
      // Act
      const result = fontManager.getFont('NonExistentFont');

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('getAllFonts', () => {
    it('should return an empty map initially', () => {
      // Act
      const fonts = fontManager.getAllFonts();

      // Assert
      expect(fonts).toBeInstanceOf(Map);
      expect(fonts.size).toBe(0);
    });
  });

  describe('trackCharacterUsage', () => {
    it('should track character codes in usedChars set', () => {
      // Arrange
      const fontInfo = createMockFontInfo();

      // Act
      fontManager.trackCharacterUsage(fontInfo, 'ABC');

      // Assert
      expect(fontInfo.usedChars.has(65)).toBe(true); // 'A'
      expect(fontInfo.usedChars.has(66)).toBe(true); // 'B'
      expect(fontInfo.usedChars.has(67)).toBe(true); // 'C'
      expect(fontInfo.usedChars.size).toBe(3);
    });

    it('should track glyph IDs in usedGlyphs set', () => {
      // Arrange
      const fontInfo = createMockFontInfo();

      // Act
      fontManager.trackCharacterUsage(fontInfo, 'AB');

      // Assert
      expect(fontInfo.usedGlyphs.size).toBe(2);
    });

    it('should not duplicate characters already tracked', () => {
      // Arrange
      const fontInfo = createMockFontInfo();

      // Act
      fontManager.trackCharacterUsage(fontInfo, 'AAA');

      // Assert
      expect(fontInfo.usedChars.size).toBe(1);
      expect(fontInfo.usedChars.has(65)).toBe(true);
    });

    it('should handle empty string gracefully', () => {
      // Arrange
      const fontInfo = createMockFontInfo();

      // Act
      fontManager.trackCharacterUsage(fontInfo, '');

      // Assert
      expect(fontInfo.usedChars.size).toBe(0);
      expect(fontInfo.usedGlyphs.size).toBe(0);
    });

    it('should handle glyphsForString errors gracefully', () => {
      // Arrange
      const fontInfo = createMockFontInfo();
      (fontInfo.font.glyphsForString as jest.Mock).mockImplementation(() => {
        throw new Error('Unsupported character');
      });

      // Act & Assert - should not throw
      expect(() => fontManager.trackCharacterUsage(fontInfo, 'X')).not.toThrow();
      // Character code is still tracked even if glyph lookup fails
      expect(fontInfo.usedChars.has(88)).toBe(true);
    });
  });

  describe('generateToUnicodeCMap', () => {
    it('should return minimal CMap when no characters are used', () => {
      // Arrange
      const fontInfo = createMockFontInfo();

      // Act
      const cmap = fontManager.generateToUnicodeCMap(fontInfo);

      // Assert
      expect(cmap).toContain('begincmap');
      expect(cmap).toContain('endcmap');
      expect(cmap).toContain('/CIDInit');
      expect(cmap).toContain('/CIDSystemInfo');
      expect(cmap).toContain('begincodespacerange');
      expect(cmap).toContain('endcodespacerange');
      expect(cmap).toContain('beginbfrange');
      expect(cmap).toContain('endbfrange');
    });

    it('should generate CMap with tracked characters', () => {
      // Arrange
      const fontInfo = createMockFontInfo();
      fontInfo.usedChars.add(65); // 'A'
      fontInfo.usedChars.add(66); // 'B'
      fontInfo.usedChars.add(67); // 'C'

      // Act
      const cmap = fontManager.generateToUnicodeCMap(fontInfo);

      // Assert
      expect(cmap).toContain('begincmap');
      expect(cmap).toContain('endcmap');
      expect(cmap).toContain('beginbfrange');
      expect(cmap).toContain('endbfrange');
      // A-C are consecutive, should form a single range
      expect(cmap).toContain('1 beginbfrange');
    });

    it('should group non-consecutive characters into separate ranges', () => {
      // Arrange
      const fontInfo = createMockFontInfo();
      fontInfo.usedChars.add(65); // 'A'
      fontInfo.usedChars.add(90); // 'Z'

      // Act
      const cmap = fontManager.generateToUnicodeCMap(fontInfo);

      // Assert
      expect(cmap).toContain('2 beginbfrange');
    });

    it('should contain Adobe CMap metadata', () => {
      // Arrange
      const fontInfo = createMockFontInfo();
      fontInfo.usedChars.add(72); // 'H'

      // Act
      const cmap = fontManager.generateToUnicodeCMap(fontInfo);

      // Assert
      expect(cmap).toContain('/Registry (Adobe)');
      expect(cmap).toContain('/Ordering (UCS)');
      expect(cmap).toContain('/CMapName /Adobe-Identity-UCS def');
      expect(cmap).toContain('/CMapType 2 def');
    });
  });

  describe('generateFontDescriptor', () => {
    it('should return string containing /Type /FontDescriptor', () => {
      // Arrange
      const fontInfo = createMockFontInfo();

      // Act
      const descriptor = fontManager.generateFontDescriptor(fontInfo, 10);

      // Assert
      expect(descriptor).toContain('/Type /FontDescriptor');
    });

    it('should include sanitized font name', () => {
      // Arrange
      const fontInfo = createMockFontInfo({ name: 'My Custom Font' });

      // Act
      const descriptor = fontManager.generateFontDescriptor(fontInfo, 10);

      // Assert
      expect(descriptor).toContain('/FontName /MyCustomFont');
    });

    it('should include font bounding box', () => {
      // Arrange
      const fontInfo = createMockFontInfo();

      // Act
      const descriptor = fontManager.generateFontDescriptor(fontInfo, 10);

      // Assert
      expect(descriptor).toContain('/FontBBox [-100 -200 1000 800]');
    });

    it('should include ascent and descent values', () => {
      // Arrange
      const fontInfo = createMockFontInfo();

      // Act
      const descriptor = fontManager.generateFontDescriptor(fontInfo, 10);

      // Assert
      expect(descriptor).toContain('/Ascent 800');
      expect(descriptor).toContain('/Descent -200');
    });

    it('should reference the font file object ID', () => {
      // Arrange
      const fontInfo = createMockFontInfo();

      // Act
      const descriptor = fontManager.generateFontDescriptor(fontInfo, 42);

      // Assert
      expect(descriptor).toContain('/FontFile2 42 0 R');
    });

    it('should include CapHeight', () => {
      // Arrange
      const fontInfo = createMockFontInfo();

      // Act
      const descriptor = fontManager.generateFontDescriptor(fontInfo, 10);

      // Assert
      expect(descriptor).toContain('/CapHeight 700');
    });

    it('should include ItalicAngle', () => {
      // Arrange
      const fontInfo = createMockFontInfo();

      // Act
      const descriptor = fontManager.generateFontDescriptor(fontInfo, 10);

      // Assert
      expect(descriptor).toContain('/ItalicAngle 0');
    });
  });

  describe('generateFontDictionary', () => {
    it('should return string containing /Type /Font', () => {
      // Arrange
      const fontInfo = createMockFontInfo();

      // Act
      const dict = fontManager.generateFontDictionary(fontInfo, 10);

      // Assert
      expect(dict).toContain('/Type /Font');
    });

    it('should specify TrueType subtype', () => {
      // Arrange
      const fontInfo = createMockFontInfo();

      // Act
      const dict = fontManager.generateFontDictionary(fontInfo, 10);

      // Assert
      expect(dict).toContain('/Subtype /TrueType');
    });

    it('should include sanitized base font name', () => {
      // Arrange
      const fontInfo = createMockFontInfo({ name: 'Open Sans' });

      // Act
      const dict = fontManager.generateFontDictionary(fontInfo, 10);

      // Assert
      expect(dict).toContain('/BaseFont /OpenSans');
    });

    it('should reference font descriptor object ID', () => {
      // Arrange
      const fontInfo = createMockFontInfo();

      // Act
      const dict = fontManager.generateFontDictionary(fontInfo, 55);

      // Assert
      expect(dict).toContain('/FontDescriptor 55 0 R');
    });

    it('should include character range 0-255', () => {
      // Arrange
      const fontInfo = createMockFontInfo();

      // Act
      const dict = fontManager.generateFontDictionary(fontInfo, 10);

      // Assert
      expect(dict).toContain('/FirstChar 0');
      expect(dict).toContain('/LastChar 255');
    });

    it('should include /Widths array', () => {
      // Arrange
      const fontInfo = createMockFontInfo();

      // Act
      const dict = fontManager.generateFontDictionary(fontInfo, 10);

      // Assert
      expect(dict).toContain('/Widths [');
    });

    it('should use WinAnsiEncoding', () => {
      // Arrange
      const fontInfo = createMockFontInfo();

      // Act
      const dict = fontManager.generateFontDictionary(fontInfo, 10);

      // Assert
      expect(dict).toContain('/Encoding /WinAnsiEncoding');
    });
  });

  describe('getTextWidth', () => {
    it('should calculate text width using font layout', () => {
      // Arrange
      const fontInfo = createMockFontInfo();
      (fontInfo.font.layout as jest.Mock).mockReturnValue({ advanceWidth: 3000 });

      // Act
      const width = fontManager.getTextWidth(fontInfo, 'Hello', 12);

      // Assert
      // (3000 / 1000) * 12 = 36
      expect(width).toBe(36);
    });

    it('should call font.layout with the provided text', () => {
      // Arrange
      const fontInfo = createMockFontInfo();

      // Act
      fontManager.getTextWidth(fontInfo, 'Test', 10);

      // Assert
      expect(fontInfo.font.layout).toHaveBeenCalledWith('Test');
    });

    it('should scale width proportionally with font size', () => {
      // Arrange
      const fontInfo = createMockFontInfo();
      (fontInfo.font.layout as jest.Mock).mockReturnValue({ advanceWidth: 2000 });

      // Act
      const width10 = fontManager.getTextWidth(fontInfo, 'Hi', 10);
      const width20 = fontManager.getTextWidth(fontInfo, 'Hi', 20);

      // Assert
      expect(width20).toBe(width10 * 2);
    });
  });

  describe('generateSubsettedFont', () => {
    it('should return full font when subset is disabled', () => {
      // Arrange
      const fontData = Buffer.from('full-font-data');
      const fontInfo = createMockFontInfo({ subset: false, fontData });
      fontInfo.usedGlyphs.add(1);

      // Act
      const result = fontManager.generateSubsettedFont(fontInfo);

      // Assert
      expect(result.isSubset).toBe(false);
      expect(result.data).toBe(fontData);
    });

    it('should return full font when no glyphs are used', () => {
      // Arrange
      const fontData = Buffer.from('full-font-data');
      const fontInfo = createMockFontInfo({ subset: true, fontData });

      // Act
      const result = fontManager.generateSubsettedFont(fontInfo);

      // Assert
      expect(result.isSubset).toBe(false);
      expect(result.data).toBe(fontData);
    });

    it('should attempt subsetting when enabled and glyphs are used', () => {
      // Arrange
      const fontInfo = createMockFontInfo({ subset: true });
      fontInfo.usedGlyphs.add(1);
      fontInfo.usedGlyphs.add(2);

      // Act
      const result = fontManager.generateSubsettedFont(fontInfo);

      // Assert
      expect(result.isSubset).toBe(true);
      expect(result.data).toBeInstanceOf(Buffer);
    });

    it('should call createSubset and includeGlyph for each used glyph', () => {
      // Arrange
      const fontInfo = createMockFontInfo({ subset: true });
      fontInfo.usedGlyphs.add(10);
      fontInfo.usedGlyphs.add(20);

      // Act
      fontManager.generateSubsettedFont(fontInfo);

      // Assert
      expect(fontInfo.font.createSubset).toHaveBeenCalled();
      const subset = (fontInfo.font.createSubset as jest.Mock).mock.results[0].value;
      expect(subset.includeGlyph).toHaveBeenCalledTimes(2);
    });

    it('should fall back to full font when subsetting fails', () => {
      // Arrange
      const fontData = Buffer.from('full-font-data');
      const fontInfo = createMockFontInfo({ subset: true, fontData });
      fontInfo.usedGlyphs.add(1);
      (fontInfo.font.createSubset as jest.Mock).mockImplementation(() => {
        throw new Error('Subsetting failed');
      });

      // Act
      const result = fontManager.generateSubsettedFont(fontInfo);

      // Assert
      expect(result.isSubset).toBe(false);
      expect(result.data).toBe(fontData);
    });
  });

  describe('generateFontFileStream', () => {
    it('should return compressed data with correct lengths', () => {
      // Arrange
      const fontData = Buffer.from('some-font-data-for-compression');
      const fontInfo = createMockFontInfo({ fontData });

      // Act
      const result = fontManager.generateFontFileStream(fontInfo);

      // Assert
      expect(result.data).toBeInstanceOf(Buffer);
      expect(result.length).toBe(result.data.length);
      expect(result.length1).toBe(fontData.length);
    });

    it('should compress the font data (output smaller or different from input)', () => {
      // Arrange
      // Use a larger buffer to ensure compression has an effect
      const fontData = Buffer.alloc(1000, 'A');
      const fontInfo = createMockFontInfo({ fontData });

      // Act
      const result = fontManager.generateFontFileStream(fontInfo);

      // Assert
      expect(result.length1).toBe(1000);
      // Compressed data for a repetitive buffer should be smaller
      expect(result.length).toBeLessThan(result.length1);
    });
  });

  describe('loadFont', () => {
    it('should throw for an invalid font source type', async () => {
      // Arrange
      const customFont = {
        name: 'InvalidFont',
        source: 12345 as unknown as string,
      };

      // Act & Assert
      await expect(fontManager.loadFont(customFont)).rejects.toThrow('Invalid font source');
    });

    it('should throw FontError for invalid font data buffer', async () => {
      // Arrange
      const customFont = {
        name: 'BadFont',
        source: Buffer.from('not-a-real-font'),
      };

      // Act & Assert
      await expect(fontManager.loadFont(customFont)).rejects.toThrow();
    });
  });
});

describe('StandardFontMetrics', () => {
  describe('getFontMetrics', () => {
    it('should return Helvetica widths for Helvetica font', () => {
      // Act
      const metrics = getFontMetrics('Helvetica');

      // Assert
      expect(metrics).toBe(HELVETICA_WIDTHS);
    });

    it('should return Helvetica widths for Helvetica-Bold', () => {
      // Act
      const metrics = getFontMetrics('Helvetica-Bold');

      // Assert
      expect(metrics).toBe(HELVETICA_WIDTHS);
    });

    it('should return Times widths for Times-Roman', () => {
      // Act
      const metrics = getFontMetrics('Times-Roman');

      // Assert
      expect(metrics).toBe(TIMES_WIDTHS);
    });

    it('should return Times widths for Times-Bold', () => {
      // Act
      const metrics = getFontMetrics('Times-Bold');

      // Assert
      expect(metrics).toBe(TIMES_WIDTHS);
    });

    it('should return Courier widths for Courier', () => {
      // Act
      const metrics = getFontMetrics('Courier');

      // Assert
      expect(metrics).toBe(COURIER_WIDTHS);
    });

    it('should return Courier widths for Courier-Bold', () => {
      // Act
      const metrics = getFontMetrics('Courier-Bold');

      // Assert
      expect(metrics).toBe(COURIER_WIDTHS);
    });

    it('should default to Helvetica widths for unknown fonts', () => {
      // Act
      const metrics = getFontMetrics('UnknownFont');

      // Assert
      expect(metrics).toBe(HELVETICA_WIDTHS);
    });

    it('should be case-insensitive', () => {
      // Act & Assert
      expect(getFontMetrics('COURIER')).toBe(COURIER_WIDTHS);
      expect(getFontMetrics('times-roman')).toBe(TIMES_WIDTHS);
      expect(getFontMetrics('HELVETICA')).toBe(HELVETICA_WIDTHS);
    });
  });

  describe('measureText', () => {
    it('should return 0 for empty string', () => {
      // Act
      const width = measureText('', 'Helvetica');

      // Assert
      expect(width).toBe(0);
    });

    it('should measure single character correctly', () => {
      // Act
      const width = measureText('A', 'Helvetica');

      // Assert
      expect(width).toBe(HELVETICA_WIDTHS['A']); // 667
    });

    it('should measure multi-character string', () => {
      // Act
      const width = measureText('Hi', 'Helvetica');

      // Assert
      expect(width).toBe(HELVETICA_WIDTHS['H'] + HELVETICA_WIDTHS['i']); // 722 + 222 = 944
    });

    it('should use 500 as default width for unknown characters', () => {
      // Act - use a character not in the widths table
      const width = measureText('\u00FF', 'Helvetica');

      // Assert
      expect(width).toBe(500);
    });

    it('should produce consistent widths for Courier (monospaced)', () => {
      // Act
      const widthA = measureText('A', 'Courier');
      const widthZ = measureText('z', 'Courier');
      const widthSpace = measureText(' ', 'Courier');

      // Assert
      expect(widthA).toBe(600);
      expect(widthZ).toBe(600);
      expect(widthSpace).toBe(600);
    });

    it('should calculate width for a complete word', () => {
      // Arrange
      const text = 'Hello';
      const expected =
        HELVETICA_WIDTHS['H'] +
        HELVETICA_WIDTHS['e'] +
        HELVETICA_WIDTHS['l'] +
        HELVETICA_WIDTHS['l'] +
        HELVETICA_WIDTHS['o'];

      // Act
      const width = measureText(text, 'Helvetica');

      // Assert
      expect(width).toBe(expected);
    });
  });

  describe('width tables', () => {
    it('should have Helvetica widths for all printable ASCII', () => {
      // Assert - spot check key characters
      expect(HELVETICA_WIDTHS[' ']).toBe(278);
      expect(HELVETICA_WIDTHS['A']).toBe(667);
      expect(HELVETICA_WIDTHS['a']).toBe(556);
      expect(HELVETICA_WIDTHS['0']).toBe(556);
    });

    it('should have Times widths for all printable ASCII', () => {
      // Assert - spot check key characters
      expect(TIMES_WIDTHS[' ']).toBe(250);
      expect(TIMES_WIDTHS['A']).toBe(722);
      expect(TIMES_WIDTHS['a']).toBe(444);
      expect(TIMES_WIDTHS['0']).toBe(500);
    });

    it('should have all Courier widths equal to 600', () => {
      // Assert
      for (const char of Object.keys(COURIER_WIDTHS)) {
        expect(COURIER_WIDTHS[char]).toBe(600);
      }
    });
  });
});
