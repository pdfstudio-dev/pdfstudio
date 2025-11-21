/**
 * Custom error classes for PDFStudio
 * Provides better error messages and error handling
 */

/**
 * Base error class for all PDFStudio errors
 */
export class PDFStudioError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message)
    this.name = 'PDFStudioError'
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

/**
 * Thrown when invalid input parameters are provided
 */
export class ValidationError extends PDFStudioError {
  constructor(
    message: string,
    public readonly parameterName?: string,
    public readonly value?: any
  ) {
    super(message, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

/**
 * Thrown when font operations fail
 */
export class FontError extends PDFStudioError {
  constructor(
    message: string,
    public readonly fontName?: string,
    public readonly cause?: Error
  ) {
    super(message, 'FONT_ERROR')
    this.name = 'FontError'
  }
}

/**
 * Thrown when image parsing or processing fails
 */
export class ImageError extends PDFStudioError {
  constructor(
    message: string,
    public readonly imageSource?: string,
    public readonly cause?: Error
  ) {
    super(message, 'IMAGE_ERROR')
    this.name = 'ImageError'
  }
}

/**
 * Thrown when chart data is invalid
 */
export class ChartDataError extends PDFStudioError {
  constructor(
    message: string,
    public readonly chartType?: string,
    public readonly dataIssue?: string
  ) {
    super(message, 'CHART_DATA_ERROR')
    this.name = 'ChartDataError'
  }
}

/**
 * Thrown when page operations fail
 */
export class PageError extends PDFStudioError {
  constructor(
    message: string,
    public readonly pageIndex?: number,
    public readonly totalPages?: number
  ) {
    super(message, 'PAGE_ERROR')
    this.name = 'PageError'
  }
}

/**
 * Thrown when PDF generation fails
 */
export class PDFGenerationError extends PDFStudioError {
  constructor(message: string, public readonly cause?: Error) {
    super(message, 'PDF_GENERATION_ERROR')
    this.name = 'PDFGenerationError'
  }
}

/**
 * Thrown when compression/decompression fails
 */
export class CompressionError extends PDFStudioError {
  constructor(message: string, public readonly cause?: Error) {
    super(message, 'COMPRESSION_ERROR')
    this.name = 'CompressionError'
  }
}

/**
 * Thrown when encryption/decryption fails
 */
export class EncryptionError extends PDFStudioError {
  constructor(message: string, public readonly cause?: Error) {
    super(message, 'ENCRYPTION_ERROR')
    this.name = 'EncryptionError'
  }
}
