/**
 * Global configuration for PDFStudio default values
 *
 * This allows users to customize default metadata strings used throughout
 * the library when explicit values are not provided.
 *
 * @example
 * ```typescript
 * import { PDFStudio } from 'pdfstudio'
 *
 * // Configure once at app startup
 * PDFStudio.configure({
 *   defaultCreator: 'My Company',
 *   defaultProducer: 'My PDF System v2.0',
 *   defaultAnnotationAuthor: 'System'
 * })
 *
 * // All subsequent PDFs will use these defaults
 * const doc = new PDFDocument()
 * // Creator will be 'My Company' instead of 'PDFStudio'
 * ```
 */

/**
 * Configuration options for PDFStudio global defaults
 */
export interface PDFStudioConfig {
  /**
   * Default Creator metadata field
   * Used when DocumentInfo.Creator is not specified
   * @default 'PDFStudio'
   */
  defaultCreator?: string

  /**
   * Default Producer metadata field
   * Used when DocumentInfo.Producer is not specified
   * @default 'PDFStudio PDF Library'
   */
  defaultProducer?: string

  /**
   * Default author for annotations
   * Used when annotation author is not specified
   * @default 'PDFStudio'
   */
  defaultAnnotationAuthor?: string
}

/**
 * Internal global configuration state
 * @internal
 */
let globalConfig: Required<PDFStudioConfig> = {
  defaultCreator: 'PDFStudio',
  defaultProducer: 'PDFStudio PDF Library',
  defaultAnnotationAuthor: 'PDFStudio'
}

/**
 * Configure global defaults for PDFStudio
 *
 * This function allows you to set default values that will be used across
 * all PDF documents when explicit values are not provided.
 *
 * @param config - Partial configuration object with default values
 *
 * @example
 * ```typescript
 * // Set company-wide defaults
 * PDFStudio.configure({
 *   defaultCreator: 'Acme Corporation',
 *   defaultProducer: 'Acme Document System',
 *   defaultAnnotationAuthor: 'Acme Bot'
 * })
 * ```
 *
 * @example
 * ```typescript
 * // Set only some defaults
 * PDFStudio.configure({
 *   defaultCreator: 'My App'
 *   // Other values remain as library defaults
 * })
 * ```
 */
export function configure(config: Partial<PDFStudioConfig>): void {
  globalConfig = {
    ...globalConfig,
    ...config
  }
}

/**
 * Get current global configuration
 * @returns Current global configuration
 * @internal
 */
export function getConfig(): Required<PDFStudioConfig> {
  return { ...globalConfig }
}

/**
 * Reset configuration to library defaults
 *
 * Useful for testing or resetting after configuration changes
 *
 * @example
 * ```typescript
 * PDFStudio.resetConfig()
 * // All defaults are back to 'PDFStudio', 'PDFStudio PDF Library', etc.
 * ```
 */
export function resetConfig(): void {
  globalConfig = {
    defaultCreator: 'PDFStudio',
    defaultProducer: 'PDFStudio PDF Library',
    defaultAnnotationAuthor: 'PDFStudio'
  }
}
