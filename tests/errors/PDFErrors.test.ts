import {
  PDFStudioError,
  ValidationError,
  FontError,
  ImageError,
  ChartDataError,
  PageError,
  PDFGenerationError,
  CompressionError,
  EncryptionError,
} from '../../src/errors';

describe('Error Classes', () => {
  describe('PDFStudioError', () => {
    it('should create error with message', () => {
      const error = new PDFStudioError('Test error');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(PDFStudioError);
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('PDFStudioError');
    });

    it('should include error code', () => {
      const error = new PDFStudioError('Test error', 'TEST_CODE');
      expect(error.code).toBe('TEST_CODE');
    });

    it('should have stack trace', () => {
      const error = new PDFStudioError('Test error');
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('PDFStudioError');
    });
  });

  describe('ValidationError', () => {
    it('should create validation error with message', () => {
      const error = new ValidationError('Invalid value');
      expect(error).toBeInstanceOf(PDFStudioError);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.message).toBe('Invalid value');
      expect(error.name).toBe('ValidationError');
      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should include parameter name and value', () => {
      const error = new ValidationError('Width must be positive', 'width', -10);
      expect(error.parameterName).toBe('width');
      expect(error.value).toBe(-10);
    });

    it('should work without parameter name and value', () => {
      const error = new ValidationError('Generic validation error');
      expect(error.parameterName).toBeUndefined();
      expect(error.value).toBeUndefined();
    });
  });

  describe('FontError', () => {
    it('should create font error with message', () => {
      const error = new FontError('Font not found');
      expect(error).toBeInstanceOf(PDFStudioError);
      expect(error).toBeInstanceOf(FontError);
      expect(error.message).toBe('Font not found');
      expect(error.name).toBe('FontError');
      expect(error.code).toBe('FONT_ERROR');
    });

    it('should include font name and cause', () => {
      const cause = new Error('File not found');
      const error = new FontError('Failed to load font', 'Arial', cause);
      expect(error.fontName).toBe('Arial');
      expect(error.cause).toBe(cause);
    });

    it('should work without font name and cause', () => {
      const error = new FontError('Generic font error');
      expect(error.fontName).toBeUndefined();
      expect(error.cause).toBeUndefined();
    });
  });

  describe('ImageError', () => {
    it('should create image error with message', () => {
      const error = new ImageError('Invalid image format');
      expect(error).toBeInstanceOf(PDFStudioError);
      expect(error).toBeInstanceOf(ImageError);
      expect(error.message).toBe('Invalid image format');
      expect(error.name).toBe('ImageError');
      expect(error.code).toBe('IMAGE_ERROR');
    });

    it('should include image source and cause', () => {
      const cause = new Error('Corrupt data');
      const error = new ImageError('Failed to parse image', 'image.png', cause);
      expect(error.imageSource).toBe('image.png');
      expect(error.cause).toBe(cause);
    });
  });

  describe('ChartDataError', () => {
    it('should create chart data error with message', () => {
      const error = new ChartDataError('Empty data array');
      expect(error).toBeInstanceOf(PDFStudioError);
      expect(error).toBeInstanceOf(ChartDataError);
      expect(error.message).toBe('Empty data array');
      expect(error.name).toBe('ChartDataError');
      expect(error.code).toBe('CHART_DATA_ERROR');
    });

    it('should include chart type and data issue', () => {
      const error = new ChartDataError('Invalid values', 'BarChart', 'negative values');
      expect(error.chartType).toBe('BarChart');
      expect(error.dataIssue).toBe('negative values');
    });
  });

  describe('PageError', () => {
    it('should create page error with message', () => {
      const error = new PageError('Invalid page index');
      expect(error).toBeInstanceOf(PDFStudioError);
      expect(error).toBeInstanceOf(PageError);
      expect(error.message).toBe('Invalid page index');
      expect(error.name).toBe('PageError');
      expect(error.code).toBe('PAGE_ERROR');
    });

    it('should include page index', () => {
      const error = new PageError('Page out of range', 999);
      expect(error.pageIndex).toBe(999);
    });
  });

  describe('PDFGenerationError', () => {
    it('should create PDF generation error with message', () => {
      const error = new PDFGenerationError('Failed to generate PDF');
      expect(error).toBeInstanceOf(PDFStudioError);
      expect(error).toBeInstanceOf(PDFGenerationError);
      expect(error.message).toBe('Failed to generate PDF');
      expect(error.name).toBe('PDFGenerationError');
      expect(error.code).toBe('PDF_GENERATION_ERROR');
    });

    it('should include cause', () => {
      const cause = new Error('Disk full');
      const error = new PDFGenerationError('Write failed', cause);
      expect(error.cause).toBe(cause);
    });
  });

  describe('CompressionError', () => {
    it('should create compression error with message', () => {
      const error = new CompressionError('Compression failed');
      expect(error).toBeInstanceOf(PDFStudioError);
      expect(error).toBeInstanceOf(CompressionError);
      expect(error.message).toBe('Compression failed');
      expect(error.name).toBe('CompressionError');
      expect(error.code).toBe('COMPRESSION_ERROR');
    });

    it('should include cause', () => {
      const cause = new Error('Invalid data');
      const error = new CompressionError('Failed to compress', cause);
      expect(error.cause).toBe(cause);
    });
  });

  describe('EncryptionError', () => {
    it('should create encryption error with message', () => {
      const error = new EncryptionError('Encryption failed');
      expect(error).toBeInstanceOf(PDFStudioError);
      expect(error).toBeInstanceOf(EncryptionError);
      expect(error.message).toBe('Encryption failed');
      expect(error.name).toBe('EncryptionError');
      expect(error.code).toBe('ENCRYPTION_ERROR');
    });

    it('should include cause', () => {
      const cause = new Error('Invalid key');
      const error = new EncryptionError('Key generation failed', cause);
      expect(error.cause).toBe(cause);
    });
  });

  describe('Error Hierarchy', () => {
    it('should maintain proper instanceof chain', () => {
      const errors = [
        new ValidationError('test'),
        new FontError('test'),
        new ImageError('test'),
        new ChartDataError('test'),
        new PageError('test'),
        new PDFGenerationError('test'),
        new CompressionError('test'),
        new EncryptionError('test'),
      ];

      errors.forEach((error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(PDFStudioError);
      });
    });

    it('should have unique error codes', () => {
      const errors = [
        new PDFStudioError('test', 'BASE'),
        new ValidationError('test'),
        new FontError('test'),
        new ImageError('test'),
        new ChartDataError('test'),
        new PageError('test'),
        new PDFGenerationError('test'),
        new CompressionError('test'),
        new EncryptionError('test'),
      ];

      const codes = errors.map((e) => e.code);
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBe(codes.length);
    });
  });
});
