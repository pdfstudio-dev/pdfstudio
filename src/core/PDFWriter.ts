import * as fs from 'fs'
import * as pako from 'pako'
import * as crypto from 'crypto'
import { PageNumberOptions, PageNumberFormat, PDFEncoding, PDFBaseFont, FontOptions, DocumentInfo, PDFSecurityOptions, ImageInfo, ImageOptions, TextOptions, TextAlign, Color, CircleOptions, EllipseOptions, PolygonOptions, ArcOptions, SectorOptions, BezierCurve, Point, HeaderFooterOptions, HeaderOptions, FooterOptions, HeaderFooterContent, PageRule, Gradient, LinearGradientOptions, RadialGradientOptions, ColorStop, TilingPatternOptions, BookmarkOptions, BookmarkDestination, FormOptions, FormField, SignatureFieldOptions, PDFAOptions, Annotation, Watermark, Link, PageRotation, ExtendedMetadata, CompressionOptions, FileAttachment, FileAttachmentAnnotation, CustomFont, FormXObjectOptions, FormXObjectPlacementOptions, LayerOptions, TextOutlineOptions, TextRenderingMode, QRCodeOptions } from '../types'
import { PDFEncryption } from '../security/PDFEncryption'
import { ImageParser } from '../images/ImageParser'
import { TextMeasure } from '../text/TextMeasure'
import { generateXMPMetadata } from '../utils/xmp'
import { FontManager, FontInfo } from '../fonts/FontManager'
import { SVGPathConverter } from '../utils/SVGPathParser'
import { QRCodeGenerator } from '../qrcode/QRCodeGenerator'
import { CompressionError } from '../errors'
import { logger } from '../utils/logger'
import { getConfig } from '../config/defaults'
import {
  ImageManager,
  GradientManager,
  AnnotationManager,
  WatermarkManager,
  LayerManager,
  PatternManager,
  GraphicsStateManager
} from './managers'

/**
 * PDF Object
 */
interface PDFObject {
  id: number
  data: string
}

/**
 * Link annotation
 */
interface LinkAnnotation {
  x: number
  y: number
  width: number
  height: number
  url: string
}

/**
 * Page data
 */
interface PageData {
  content: string[]
  width: number
  height: number
  annotations: LinkAnnotation[]
  linkAnnots?: number[]  // IDs of link annotations for this page
  rotation?: number      // Page rotation in degrees (0, 90, 180, 270)
}

/**
 * PDFWriter - Handles low-level PDF generation with multi-page support
 */
export class PDFWriter {
  private defaultPageWidth: number
  private defaultPageHeight: number
  private pages: PageData[] = []
  private currentPageIndex: number = 0
  private pageNumberOptions: PageNumberOptions | null = null
  private headerFooterOptions: HeaderFooterOptions | null = null
  private encoding: PDFEncoding
  private baseFont: PDFBaseFont
  private info: DocumentInfo
  private pdfVersion: string
  private documentId: string
  private encryption: PDFEncryption | null = null

  // Resource managers
  private imageManager: ImageManager = new ImageManager()
  private gradientManager: GradientManager = new GradientManager()
  private annotationManager: AnnotationManager = new AnnotationManager()
  private watermarkManager: WatermarkManager = new WatermarkManager()
  private layerManager: LayerManager = new LayerManager()
  private patternManager: PatternManager = new PatternManager()
  private graphicsStateManager: GraphicsStateManager = new GraphicsStateManager()

  private fonts: Map<PDFBaseFont, number> = new Map()  // Map font name to font index (F1, F2, etc.)
  private nextFontId: number = 1
  private fontManager: FontManager = new FontManager()  // Handles custom TrueType/OpenType fonts
  private customFonts: Map<string, number> = new Map()  // Map custom font name to font index
  private currentCustomFont: string | null = null  // Currently active custom font
  private bookmarks: BookmarkOptions[] = []  // Document bookmarks/outlines
  private formFields: FormField[] = []  // Form fields
  private formOptions: FormOptions = {}  // Form configuration
  private signatureFields: SignatureFieldOptions[] = []  // Signature fields
  private pdfAOptions: PDFAOptions | null = null  // PDF/A compliance options
  private enableXMPMetadata: boolean = false  // Enable XMP metadata stream (independent of PDF/A)
  private compressionOptions: CompressionOptions = {}  // Compression and optimization options
  private attachments: FileAttachment[] = []  // Document-level file attachments
  private currentX: number = 0
  private currentY: number = 0
  private currentFontSize: number = 12
  private textContinued: boolean = false

  // Graphics state management for transformations
  private graphicsStateStack: string[] = []  // Stack for save/restore
  private currentPath: string[] = []  // Current path being built
  private pathStarted: boolean = false  // Whether a path has been started

  // Form XObjects (Templates)
  private formXObjects: Map<string, { id: number; xobject: FormXObjectOptions; name: string }> = new Map()  // Map Form XObject name to ID and data
  private nextFormXObjectId: number = 1

  constructor(
    width: number,
    height: number,
    fontOptions?: FontOptions,
    info?: DocumentInfo,
    pdfVersion: string = '1.4',
    autoFirstPage: boolean = true,
    security?: PDFSecurityOptions,
    headerFooter?: HeaderFooterOptions,
    bookmarks?: BookmarkOptions[],
    formOptions?: FormOptions,
    signatureFields?: SignatureFieldOptions[],
    pdfAOptions?: PDFAOptions,
    compressionOptions?: CompressionOptions
  ) {
    this.defaultPageWidth = width
    this.defaultPageHeight = height
    this.encoding = fontOptions?.encoding || 'WinAnsiEncoding'
    this.baseFont = fontOptions?.baseFont || 'Helvetica'

    // Handle PDF/A compliance
    if (pdfAOptions) {
      this.pdfAOptions = pdfAOptions

      // Override PDF version based on conformance level
      if (pdfAOptions.conformanceLevel === 'PDF/A-1b') {
        this.pdfVersion = '1.4'  // PDF/A-1 requires PDF 1.4
      } else if (pdfAOptions.conformanceLevel === 'PDF/A-2b' || pdfAOptions.conformanceLevel === 'PDF/A-3b') {
        this.pdfVersion = '1.7'  // PDF/A-2 and PDF/A-3 require PDF 1.7
      } else {
        this.pdfVersion = '1.4'  // Default fallback
      }

      // PDF/A does not allow encryption
      if (security && (security.userPassword || security.ownerPassword)) {
        logger.warn('PDF/A compliance does not allow encryption. Security options will be ignored.', 'PDFWriter')
        security = undefined  // Disable security
      }
    } else {
      this.pdfVersion = pdfVersion
    }

    // Generate document ID (random 16 bytes as hex)
    this.documentId = crypto.randomBytes(16).toString('hex')

    // Set document info with defaults from global config
    const config = getConfig()
    this.info = {
      Creator: config.defaultCreator,
      Producer: config.defaultProducer,
      CreationDate: new Date(),
      ModDate: new Date(),
      ...info
    }

    // Initialize encryption if security options provided (and PDF/A is not enabled)
    if (security && (security.userPassword || security.ownerPassword)) {
      this.encryption = new PDFEncryption(security, this.pdfVersion, this.documentId)
    }

    // Store header/footer options
    if (headerFooter) {
      this.headerFooterOptions = headerFooter
    }

    // Store bookmarks
    if (bookmarks) {
      this.bookmarks = bookmarks
    }

    // Store form options and fields
    if (formOptions) {
      this.formOptions = formOptions
      if (formOptions.fields) {
        this.formFields = formOptions.fields
      }
    }

    if (signatureFields) {
      this.signatureFields = signatureFields
    }

    // Store compression options
    if (compressionOptions) {
      this.compressionOptions = {
        compressStreams: compressionOptions.compressStreams !== false,  // Default true
        compressionLevel: compressionOptions.compressionLevel ?? 6,      // Default 6
        ...compressionOptions
      }
    } else {
      // Default compression settings
      this.compressionOptions = {
        compressStreams: true,
        compressionLevel: 6
      }
    }

    // Create first page automatically if enabled
    if (autoFirstPage) {
      this.addPage(width, height)
    }
  }

  /**
   * Escape special characters and encode accented characters for PDF
   */
  private escapePDFString(text: string): string {
    let result = ''

    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      const code = text.charCodeAt(i)

      // Escape special PDF characters
      if (char === '(') {
        result += '\\('
      } else if (char === ')') {
        result += '\\)'
      } else if (char === '\\') {
        result += '\\\\'
      } else if (code < 32 || code > 126) {
        // Non-ASCII character - use octal notation
        // Convert to 3-digit octal
        result += '\\' + code.toString(8).padStart(3, '0')
      } else {
        // Regular ASCII character
        result += char
      }
    }

    return result
  }

  /**
   * Format date to PDF date format: D:YYYYMMDDHHmmSS
   */
  private formatPDFDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `D:${year}${month}${day}${hours}${minutes}${seconds}`
  }

  /**
   * Generate Info dictionary data
   */
  private generateInfoDictionary(): string {
    const entries: string[] = []

    if (this.info.Title) {
      entries.push(`  /Title (${this.escapePDFString(this.info.Title)})`)
    }
    if (this.info.Author) {
      entries.push(`  /Author (${this.escapePDFString(this.info.Author)})`)
    }
    if (this.info.Subject) {
      entries.push(`  /Subject (${this.escapePDFString(this.info.Subject)})`)
    }
    if (this.info.Keywords) {
      entries.push(`  /Keywords (${this.escapePDFString(this.info.Keywords)})`)
    }
    if (this.info.Creator) {
      entries.push(`  /Creator (${this.escapePDFString(this.info.Creator)})`)
    }
    if (this.info.Producer) {
      entries.push(`  /Producer (${this.escapePDFString(this.info.Producer)})`)
    }
    if (this.info.CreationDate) {
      entries.push(`  /CreationDate (${this.formatPDFDate(this.info.CreationDate)})`)
    }
    if (this.info.ModDate) {
      entries.push(`  /ModDate (${this.formatPDFDate(this.info.ModDate)})`)
    }

    return `<<\n${entries.join('\n')}\n>>`
  }

  /**
   * Set page numbering options
   */
  setPageNumberOptions(options: PageNumberOptions | null): void {
    this.pageNumberOptions = options
  }

  /**
   * Set header and footer options
   */
  setHeaderFooterOptions(options: HeaderFooterOptions | null): void {
    this.headerFooterOptions = options
  }

  /**
   * Set bookmarks/outlines
   */
  setBookmarks(bookmarks: BookmarkOptions[]): void {
    this.bookmarks = bookmarks
  }

  /**
   * Add a bookmark
   */
  addBookmark(bookmark: BookmarkOptions): void {
    this.bookmarks.push(bookmark)
  }

  /**
   * Set form configuration
   */
  setFormOptions(options: FormOptions): void {
    this.formOptions = options
    if (options.fields) {
      this.formFields = options.fields
    }
  }

  /**
   * Add a form field
   */
  addFormField(field: FormField): void {
    this.formFields.push(field)
  }

  /**
   * Add a signature field
   */
  addSignatureField(field: SignatureFieldOptions): void {
    this.signatureFields.push(field)
  }

  /**
   * Add an annotation
   */
  addAnnotation(annotation: Annotation): void {
    this.annotationManager.addAnnotation(annotation)
  }

  /**
   * Add a watermark
   */
  addWatermark(watermark: Watermark): void {
    this.watermarkManager.addWatermark(watermark)
  }

  /**
   * Add a hyperlink
   */
  addLink(link: Link): void {
    // If page is not specified, set it to current page index
    if (link.page === undefined) {
      link.page = this.currentPageIndex
    }
    this.annotationManager.addLink(link)
  }

  /**
   * Add a document-level file attachment
   */
  addAttachment(attachment: FileAttachment): void {
    this.attachments.push(attachment)
  }

  /**
   * Add a file attachment annotation (visible on page)
   */
  addFileAttachmentAnnotation(annotation: FileAttachmentAnnotation): void {
    // If page is not specified, set it to current page index
    if (annotation.page === undefined) {
      annotation.page = this.currentPageIndex
    }
    this.annotationManager.addAttachmentAnnotation(annotation)
  }

  /**
   * Register a custom TrueType/OpenType font
   */
  registerCustomFont(customFont: CustomFont): void {
    // Load font using FontManager
    const fontInfo = this.fontManager.loadFont(customFont)

    // Register font with next available ID
    if (!this.customFonts.has(customFont.name)) {
      this.customFonts.set(customFont.name, this.nextFontId++)
    }
  }

  /**
   * Set active custom font
   */
  useCustomFont(fontName: string): void {
    const fontInfo = this.fontManager.getFont(fontName)
    if (!fontInfo) {
      throw new Error(`Custom font not registered: ${fontName}. Call registerCustomFont() first.`)
    }
    this.currentCustomFont = fontName
  }

  /**
   * Switch back to base font
   */
  useBaseFont(baseFont: PDFBaseFont): void {
    this.currentCustomFont = null
    this.baseFont = baseFont
  }

  /**
   * Rotate a specific page
   * @param pageIndex - Page index (0-indexed)
   * @param rotation - Rotation angle in degrees (0, 90, 180, 270)
   */
  rotatePage(pageIndex: number, rotation: PageRotation): void {
    if (pageIndex >= 0 && pageIndex < this.pages.length) {
      this.pages[pageIndex].rotation = rotation
    }
  }

  /**
   * Rotate the current page
   * @param rotation - Rotation angle in degrees (0, 90, 180, 270)
   */
  rotateCurrentPage(rotation: PageRotation): void {
    this.pages[this.currentPageIndex].rotation = rotation
  }

  /**
   * Duplicate a page
   * @param pageIndex - Index of page to duplicate (0-indexed)
   * @returns Index of the new duplicated page
   */
  duplicatePage(pageIndex: number): number {
    if (pageIndex < 0 || pageIndex >= this.pages.length) {
      throw new Error(`Invalid page index: ${pageIndex}`)
    }

    const originalPage = this.pages[pageIndex]

    // Create a deep copy of the page
    const duplicatedPage: PageData = {
      content: [...originalPage.content],
      width: originalPage.width,
      height: originalPage.height,
      annotations: [...originalPage.annotations],
      linkAnnots: originalPage.linkAnnots ? [...originalPage.linkAnnots] : undefined,
      rotation: originalPage.rotation
    }

    // Add the duplicated page after the original
    this.pages.splice(pageIndex + 1, 0, duplicatedPage)

    return pageIndex + 1
  }

  /**
   * Reorder pages
   * @param newOrder - Array of page indices in the desired order
   */
  reorderPages(newOrder: number[]): void {
    if (newOrder.length !== this.pages.length) {
      throw new Error(`New order must contain exactly ${this.pages.length} page indices`)
    }

    // Validate that all indices are valid and unique
    const indices = new Set(newOrder)
    if (indices.size !== newOrder.length) {
      throw new Error('Duplicate page indices in new order')
    }

    for (const index of newOrder) {
      if (index < 0 || index >= this.pages.length) {
        throw new Error(`Invalid page index: ${index}`)
      }
    }

    // Create new pages array in the specified order
    const reorderedPages = newOrder.map(index => this.pages[index])
    this.pages = reorderedPages

    // Reset current page index to 0 after reordering
    this.currentPageIndex = 0
  }

  /**
   * Delete a page
   * @param pageIndex - Index of page to delete (0-indexed)
   */
  deletePage(pageIndex: number): void {
    if (pageIndex < 0 || pageIndex >= this.pages.length) {
      throw new Error(`Invalid page index: ${pageIndex}`)
    }

    if (this.pages.length === 1) {
      throw new Error('Cannot delete the only page in the document')
    }

    // Remove the page
    this.pages.splice(pageIndex, 1)

    // Adjust current page index if necessary
    if (this.currentPageIndex >= this.pages.length) {
      this.currentPageIndex = this.pages.length - 1
    }
  }

  /**
   * Enable XMP metadata stream in the PDF
   * This allows rich metadata including custom properties
   */
  enableXMP(): void {
    this.enableXMPMetadata = true
  }

  /**
   * Set extended metadata
   * @param metadata - Extended metadata options
   */
  setExtendedMetadata(metadata: ExtendedMetadata): void {
    this.info.extendedMetadata = {
      ...this.info.extendedMetadata,
      ...metadata
    }
  }

  /**
   * Update document info
   * @param info - Document info to merge with existing info
   */
  updateInfo(info: Partial<DocumentInfo>): void {
    this.info = {
      ...this.info,
      ...info,
      ModDate: new Date()  // Update modification date
    }
  }

  /**
   * Add a new page
   */
  addPage(width?: number, height?: number): void {
    this.pages.push({
      content: [],
      width: width || this.defaultPageWidth,
      height: height || this.defaultPageHeight,
      annotations: []
    })
    this.currentPageIndex = this.pages.length - 1
  }

  /**
   * Switch to a specific page (0-indexed)
   */
  switchToPage(pageIndex: number): void {
    if (pageIndex >= 0 && pageIndex < this.pages.length) {
      this.currentPageIndex = pageIndex
    } else {
      throw new Error(`Page index ${pageIndex} out of bounds. Total pages: ${this.pages.length}`)
    }
  }

  /**
   * Get current page number (1-indexed)
   */
  getCurrentPageNumber(): number {
    return this.currentPageIndex + 1
  }

  /**
   * Get total number of pages
   */
  getPageCount(): number {
    return this.pages.length
  }

  /**
   * Get current page width
   */
  getCurrentPageWidth(): number {
    return this.pages[this.currentPageIndex]?.width || this.defaultPageWidth
  }

  /**
   * Get current page height
   */
  getCurrentPageHeight(): number {
    return this.pages[this.currentPageIndex]?.height || this.defaultPageHeight
  }

  /**
   * Add content to the current page
   */
  addContent(content: string): void {
    this.pages[this.currentPageIndex].content.push(content)
  }

  /**
   * Draw a rectangle
   */
  rect(x: number, y: number, width: number, height: number): void {
    this.addContent(`${x} ${y} ${width} ${height} re`)
  }

  /**
   * Set fill color (RGB, 0-1 range)
   */
  setFillColor(r: number, g: number, b: number): void {
    this.addContent(`${r} ${g} ${b} rg`)
  }

  /**
   * Set stroke color (RGB, 0-1 range)
   */
  setStrokeColor(r: number, g: number, b: number): void {
    this.addContent(`${r} ${g} ${b} RG`)
  }

  /**
   * Fill the current path
   */
  fill(): void {
    this.addContent('f')
  }

  /**
   * Stroke the current path
   */
  stroke(): void {
    this.addContent('S')
  }

  /**
   * Fill and stroke the current path
   */
  fillAndStroke(): void {
    this.addContent('B')
  }

  /**
   * Clip to the current path using non-zero winding rule (use as a mask for subsequent operations)
   * After clipping, all subsequent drawing operations will only be visible inside the clipping region
   * Use with saveGraphicsState() and restoreGraphicsState() to restore previous clipping
   *
   * @example
   * ```typescript
   * doc.saveGraphicsState()
   * doc.rect(100, 100, 200, 200)
   * doc.clip()
   * doc.fillColor('blue')
   * doc.circle({ x: 200, y: 200, radius: 150 })
   * doc.fill()  // Only visible inside the rectangle
   * doc.restoreGraphicsState()
   * ```
   */
  clip(): void {
    this.addContent('W n')
  }

  /**
   * Clip to the current path using even-odd rule
   * Even-odd rule is useful for paths with holes or self-intersecting paths
   *
   * @example
   * ```typescript
   * doc.saveGraphicsState()
   * // Outer circle
   * doc.moveTo(200 + 100, 200)
   * for (let i = 0; i <= 36; i++) {
   *   const angle = (i / 36) * 2 * Math.PI
   *   doc.lineTo(200 + 100 * Math.cos(angle), 200 + 100 * Math.sin(angle))
   * }
   * // Inner circle (creates a hole)
   * doc.moveTo(200 + 50, 200)
   * for (let i = 0; i <= 36; i++) {
   *   const angle = (i / 36) * 2 * Math.PI
   *   doc.lineTo(200 + 50 * Math.cos(angle), 200 + 50 * Math.sin(angle))
   * }
   * doc.clipEvenOdd()
   * doc.restoreGraphicsState()
   * ```
   */
  clipEvenOdd(): void {
    this.addContent('W* n')
  }

  /**
   * Convenience method: Clip to a rectangle
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param width - Width
   * @param height - Height
   */
  clipRect(x: number, y: number, width: number, height: number): void {
    this.rect(x, y, width, height)
    this.clip()
  }

  /**
   * Convenience method: Clip to a circle
   * @param x - Center X coordinate
   * @param y - Center Y coordinate
   * @param radius - Radius
   */
  clipCircle(x: number, y: number, radius: number): void {
    // Draw circle using four Bezier curves
    const k = 0.5522848
    const ox = radius * k
    const oy = radius * k

    this.moveTo(x + radius, y)
    this.bezierCurveTo(x + radius, y + oy, x + ox, y + radius, x, y + radius)
    this.bezierCurveTo(x - ox, y + radius, x - radius, y + oy, x - radius, y)
    this.bezierCurveTo(x - radius, y - oy, x - ox, y - radius, x, y - radius)
    this.bezierCurveTo(x + ox, y - radius, x + radius, y - oy, x + radius, y)
    this.clip()
  }

  /**
   * Convenience method: Clip to an SVG path
   * @param pathString - SVG path string (e.g., "M 100,100 L 200,200 Z")
   */
  clipPath(pathString: string): void {
    this.path(pathString)
    this.clip()
  }

  /**
   * Set line dash pattern
   * @param pattern - array of dash/gap lengths (e.g., [5, 10] = 5pt dash, 10pt gap)
   * @param phase - offset into the pattern (default 0)
   */
  dash(pattern: number[], phase: number = 0): void {
    const patternStr = pattern.join(' ')
    this.addContent(`[${patternStr}] ${phase} d`)
  }

  /**
   * Remove line dash pattern (solid lines)
   */
  undash(): void {
    this.addContent('[] 0 d')
  }

  /**
   * Set blend mode for subsequent drawing operations
   * @param mode - Blend mode name (Normal, Multiply, Screen, Overlay, Darken, Lighten, etc.)
   */
  blendMode(mode: string): void {
    // Valid PDF blend modes
    const validModes = [
      'Normal', 'Multiply', 'Screen', 'Overlay', 'Darken', 'Lighten',
      'ColorDodge', 'ColorBurn', 'HardLight', 'SoftLight',
      'Difference', 'Exclusion', 'Hue', 'Saturation', 'Color', 'Luminosity'
    ]

    if (!validModes.includes(mode)) {
      logger.warn(`Invalid blend mode: ${mode}. Using Normal.`, 'PDFWriter')
      mode = 'Normal'
    }

    this.graphicsStateManager.setBlendMode(mode)
    this.applyExtGState()
  }

  /**
   * Set opacity for subsequent drawing operations
   * @param opacity - Opacity value (0-1, where 0 is transparent and 1 is opaque)
   */
  opacity(opacity: number): void {
    if (opacity < 0 || opacity > 1) {
      logger.warn(`Invalid opacity: ${opacity}. Must be between 0 and 1. Using 1.`, 'PDFWriter')
      opacity = 1
    }

    this.graphicsStateManager.setOpacity(opacity)
    this.applyExtGState()
  }

  /**
   * Apply current ExtGState (blend mode and opacity)
   * Creates or reuses an ExtGState object
   */
  private applyExtGState(): void {
    // Create a hash key for current ExtGState
    const hash = `BM:${this.graphicsStateManager.getBlendMode()}|OP:${this.graphicsStateManager.getOpacity().toFixed(3)}`

    // Check if we already have this ExtGState
    let gsId = this.graphicsStateManager.getExtGState(hash)

    if (!gsId) {
      // Create new ExtGState
      gsId = this.graphicsStateManager.registerExtGState(hash)
    }

    // Apply ExtGState in content stream
    this.addContent(`/GS${gsId} gs`)
  }

  /**
   * Set line width
   */
  setLineWidth(width: number): void {
    this.addContent(`${width} w`)
  }

  /**
   * Set line cap style (how line ends are drawn)
   * @param cap - Line cap style: 0=butt, 1=round, 2=square
   * @example
   * ```typescript
   * writer.setLineCap(1)  // Round cap
   * writer.moveTo(100, 100)
   * writer.lineTo(200, 100)
   * writer.stroke()
   * ```
   */
  setLineCap(cap: 0 | 1 | 2): void {
    this.addContent(`${cap} J`)
  }

  /**
   * Set line join style (how lines connect)
   * @param join - Line join style: 0=miter, 1=round, 2=bevel
   * @example
   * ```typescript
   * writer.setLineJoin(1)  // Round join
   * writer.moveTo(100, 100)
   * writer.lineTo(150, 150)
   * writer.lineTo(200, 100)
   * writer.stroke()
   * ```
   */
  setLineJoin(join: 0 | 1 | 2): void {
    this.addContent(`${join} j`)
  }

  /**
   * Set dash pattern for lines
   * @param pattern - Array of dash/gap lengths (empty array for solid line)
   * @param phase - Offset into the dash pattern (default: 0)
   * @example
   * ```typescript
   * // Dashed line: 5 units dash, 3 units gap
   * writer.setDashPattern([5, 3])
   *
   * // Dot-dash pattern
   * writer.setDashPattern([10, 5, 2, 5])
   *
   * // Solid line (no dashes)
   * writer.setDashPattern([])
   * ```
   */
  setDashPattern(pattern: number[], phase: number = 0): void {
    if (pattern.length === 0) {
      this.addContent('[] 0 d')
    } else {
      this.addContent(`[${pattern.join(' ')}] ${phase} d`)
    }
  }

  /**
   * Set miter limit (maximum length of mitered line joins)
   * @param limit - Miter limit (default: 10)
   * @example
   * ```typescript
   * writer.setMiterLimit(5)
   * writer.setLineJoin(0)  // Miter join
   * ```
   */
  setMiterLimit(limit: number): void {
    this.addContent(`${limit} M`)
  }

  /**
   * Save the current graphics state (push to stack)
   * Use with restoreGraphicsState() to isolate transformations and styling
   */
  saveGraphicsState(): void {
    this.addContent('q')
  }

  /**
   * Restore the previous graphics state (pop from stack)
   */
  restoreGraphicsState(): void {
    this.addContent('Q')
  }

  /**
   * Round very small numbers to zero to avoid floating point errors in PDF
   * @param num - number to round
   * @returns rounded number
   */
  private roundPDFNumber(num: number): number {
    // Round numbers smaller than 1e-10 to zero
    if (Math.abs(num) < 1e-10) {
      return 0
    }
    // Round to 6 decimal places to avoid excessive precision
    return Math.round(num * 1000000) / 1000000
  }

  /**
   * Apply a transformation matrix
   * @param a - horizontal scaling
   * @param b - horizontal skewing
   * @param c - vertical skewing
   * @param d - vertical scaling
   * @param e - horizontal translation
   * @param f - vertical translation
   */
  transform(a: number, b: number, c: number, d: number, e: number, f: number): void {
    // Round numbers to avoid floating point errors
    const ra = this.roundPDFNumber(a)
    const rb = this.roundPDFNumber(b)
    const rc = this.roundPDFNumber(c)
    const rd = this.roundPDFNumber(d)
    const re = this.roundPDFNumber(e)
    const rf = this.roundPDFNumber(f)

    // Only output transformation if it's not an identity matrix
    // Identity matrix is: [1, 0, 0, 1, 0, 0]
    const isIdentity = (ra === 1 && rb === 0 && rc === 0 && rd === 1 && re === 0 && rf === 0)

    if (!isIdentity) {
      this.addContent(`${ra} ${rb} ${rc} ${rd} ${re} ${rf} cm`)
    }
  }

  /**
   * Rotate the coordinate system
   * @param angle - rotation angle in degrees (clockwise)
   */
  rotate(angle: number): void {
    const rad = (angle * Math.PI) / 180
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)
    this.transform(cos, sin, -sin, cos, 0, 0)
  }

  /**
   * Scale the coordinate system
   * @param sx - horizontal scale factor
   * @param sy - vertical scale factor (defaults to sx if not provided)
   */
  scale(sx: number, sy?: number): void {
    const scaleY = sy !== undefined ? sy : sx
    this.transform(sx, 0, 0, scaleY, 0, 0)
  }

  /**
   * Translate (move) the coordinate system
   * @param x - horizontal translation
   * @param y - vertical translation
   */
  translate(x: number, y: number): void {
    this.transform(1, 0, 0, 1, x, y)
  }

  /**
   * Move to position
   */
  moveTo(x: number, y: number): void {
    this.addContent(`${x} ${y} m`)
  }

  /**
   * Line to position
   */
  lineTo(x: number, y: number): void {
    this.addContent(`${x} ${y} l`)
  }

  /**
   * Draw a cubic Bezier curve
   * @param cp1x - first control point x
   * @param cp1y - first control point y
   * @param cp2x - second control point x
   * @param cp2y - second control point y
   * @param x - end point x
   * @param y - end point y
   */
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
    this.addContent(`${cp1x} ${cp1y} ${cp2x} ${cp2y} ${x} ${y} c`)
  }

  /**
   * Close the current path (connect back to start point)
   */
  closePath(): void {
    this.addContent('h')
  }

  /**
   * Parse and draw an SVG path string
   * @param pathString - SVG path string (e.g., "M 100,100 L 200,200 C 250,150 300,150 350,200 Z")
   */
  path(pathString: string): void {
    const converter = new SVGPathConverter()

    converter.convert(pathString, {
      moveTo: (x, y) => this.moveTo(x, y),
      lineTo: (x, y) => this.lineTo(x, y),
      bezierCurveTo: (cp1x, cp1y, cp2x, cp2y, x, y) => this.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y),
      quadraticCurveTo: (cpx, cpy, x, y) => this.quadraticCurveTo(cpx, cpy, x, y),
      closePath: () => this.closePath()
    })
  }

  /**
   * Set fill pattern to a gradient for the next fill operation
   * @param gradient - Linear or radial gradient configuration
   * @example
   * ```typescript
   * // Linear gradient
   * writer.fillWithGradient({
   *   x0: 100, y0: 100, x1: 200, y1: 200,
   *   colorStops: [
   *     { offset: 0, color: [1, 0, 0] },
   *     { offset: 1, color: [0, 0, 1] }
   *   ]
   * })
   * writer.rect(100, 100, 100, 100)
   * writer.fill()
   * ```
   */
  fillWithGradient(gradient: Gradient): void {
    const patternName = this.registerGradient(gradient)
    this.addContent('/Pattern cs')
    this.addContent(`/${patternName} scn`)
  }

  /**
   * Convenience method: Draw a rectangle filled with a gradient
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param width - Width
   * @param height - Height
   * @param gradient - Linear or radial gradient
   */
  rectWithGradient(x: number, y: number, width: number, height: number, gradient: Gradient): void {
    this.rect(x, y, width, height)
    this.fillWithGradient(gradient)
    this.fill()
  }

  /**
   * Create a hash for a pattern (for caching)
   */
  private hashPattern(pattern: TilingPatternOptions): string {
    return `${pattern.width}_${pattern.height}_${pattern.xStep || pattern.width}_${pattern.yStep || pattern.height}_${pattern.draw.toString()}`
  }

  /**
   * Register a pattern and get its pattern name
   */
  private registerPattern(pattern: TilingPatternOptions): string {
    const hash = this.hashPattern(pattern)

    if (this.patternManager.hasPattern(hash)) {
      const id = this.patternManager.getPattern(hash)!.id
      return `Pat${id}`
    }

    const id = this.patternManager.registerPattern(hash, pattern)
    return `Pat${id}`
  }

  /**
   * Set fill pattern to a tiling pattern for the next fill operation
   * @param pattern - Tiling pattern configuration
   * @example
   * ```typescript
   * writer.fillWithPattern({
   *   width: 20,
   *   height: 20,
   *   draw: (ctx) => {
   *     ctx.setFillColor(1, 0, 0)
   *     ctx.circle(10, 10, 5)
   *     ctx.fill()
   *   }
   * })
   * writer.rect(100, 100, 200, 200)
   * writer.fill()
   * ```
   */
  fillWithPattern(pattern: TilingPatternOptions): void {
    const patternName = this.registerPattern(pattern)
    this.addContent('/Pattern cs')
    this.addContent(`/${patternName} scn`)
  }

  /**
   * Convenience method: Draw a rectangle filled with a pattern
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param width - Width
   * @param height - Height
   * @param pattern - Tiling pattern
   */
  rectWithPattern(x: number, y: number, width: number, height: number, pattern: TilingPatternOptions): void {
    this.rect(x, y, width, height)
    this.fillWithPattern(pattern)
    this.fill()
  }

  /**
   * Create a Form XObject (reusable template/graphic)
   * @param options - Form XObject configuration
   * @returns The name of the created Form XObject (e.g., 'Logo', 'Header', 'XObj1')
   * @example
   * ```typescript
   * // Create a logo template
   * const logoName = writer.createFormXObject({
   *   width: 100,
   *   height: 100,
   *   name: 'CompanyLogo',
   *   draw: (ctx) => {
   *     ctx.setFillColor(0, 0.5, 1)
   *     ctx.circle(50, 50, 40)
   *     ctx.fill()
   *     ctx.setFillColor(1, 1, 1)
   *     ctx.text('ACME', 25, 45, 20)
   *   }
   * })
   *
   * // Use it multiple times
   * writer.useFormXObject(logoName, { x: 50, y: 700, scale: 0.5 })
   * writer.useFormXObject(logoName, { x: 450, y: 700, scale: 0.5 })
   * ```
   */
  createFormXObject(options: FormXObjectOptions): string {
    // Generate name if not provided
    const name = options.name || `XObj${this.nextFormXObjectId}`

    // Check if already exists
    if (this.formXObjects.has(name)) {
      return name
    }

    const id = this.nextFormXObjectId++
    this.formXObjects.set(name, { id, xobject: options, name })
    return name
  }

  /**
   * Place/use a Form XObject on the current page
   * @param name - Name of the Form XObject (returned by createFormXObject)
   * @param placement - Positioning and transformation options
   * @example
   * ```typescript
   * // Place at specific position
   * writer.useFormXObject('Logo', { x: 50, y: 700 })
   *
   * // Place with scaling
   * writer.useFormXObject('Logo', { x: 50, y: 700, scale: 0.5 })
   *
   * // Place with rotation
   * writer.useFormXObject('Logo', { x: 250, y: 400, rotate: 45 })
   *
   * // Place with custom dimensions
   * writer.useFormXObject('Logo', { x: 50, y: 700, width: 200, height: 150 })
   * ```
   */
  useFormXObject(name: string, placement?: FormXObjectPlacementOptions): void {
    const xobject = this.formXObjects.get(name)
    if (!xobject) {
      throw new Error(`Form XObject '${name}' not found. Create it first with createFormXObject()`)
    }

    const opts = placement || {}
    const x = opts.x || 0
    const y = opts.y || 0

    // Calculate transformation matrix
    let scaleX = opts.scaleX || opts.scale || 1
    let scaleY = opts.scaleY || opts.scale || 1

    // If width/height specified, calculate scale factors
    if (opts.width) {
      scaleX = opts.width / xobject.xobject.width
    }
    if (opts.height) {
      scaleY = opts.height / xobject.xobject.height
    }

    const rotation = opts.rotate || 0
    const opacity = opts.opacity || 1

    // Save graphics state
    this.saveGraphicsState()

    // Apply opacity if needed
    if (opacity < 1) {
      this.opacity(opacity)
    }

    // Apply transformations
    // Order: translate -> rotate -> scale
    this.translate(x, y)

    if (rotation !== 0) {
      this.rotate(rotation)
    }

    if (scaleX !== 1 || scaleY !== 1) {
      this.scale(scaleX, scaleY)
    }

    // Place the Form XObject using the Do operator
    this.addContent(`/${name} Do`)

    // Restore graphics state
    this.restoreGraphicsState()
  }

  /**
   * Set text rendering mode
   * @param mode - Text rendering mode (0-7)
   * @example
   * ```typescript
   * // Outline text (stroke only)
   * writer.setTextRenderingMode(1)
   * writer.text('OUTLINED TEXT', 100, 700, 48)
   *
   * // Fill and stroke
   * writer.setTextRenderingMode(2)
   * writer.text('FILLED & STROKED', 100, 650, 48)
   * ```
   */
  setTextRenderingMode(mode: TextRenderingMode): void {
    this.addContent(`${mode} Tr`)
  }

  /**
   * Draw text with outline (stroke)
   * @param options - Text outline configuration
   * @example
   * ```typescript
   * writer.textOutline({
   *   text: 'OUTLINED',
   *   x: 100,
   *   y: 700,
   *   fontSize: 48,
   *   strokeColor: [0, 0, 0],
   *   fillColor: [1, 1, 1],
   *   lineWidth: 2
   * })
   * ```
   */
  textOutline(options: TextOutlineOptions): void {
    const fontSize = options.fontSize || 12
    const font = options.font || 'Helvetica'
    const fontId = this.getFontId(font as PDFBaseFont)
    const lineWidth = options.lineWidth || 1
    const renderingMode = options.renderingMode || 2  // Fill then stroke

    const escapedText = this.escapePDFString(options.text)

    this.addContent('BT')
    this.addContent(`/${fontId} ${fontSize} Tf`)
    this.addContent(`${options.x} ${options.y} Td`)

    // Set rendering mode
    this.addContent(`${renderingMode} Tr`)

    // Set line width for stroke
    this.addContent(`${lineWidth} w`)

    // Set fill color
    if (options.fillColor) {
      const [r, g, b] = Array.isArray(options.fillColor) ? options.fillColor : this.parseColor(options.fillColor)
      this.addContent(`${r} ${g} ${b} rg`)
    }

    // Set stroke color
    if (options.strokeColor) {
      const [r, g, b] = Array.isArray(options.strokeColor) ? options.strokeColor : this.parseColor(options.strokeColor)
      this.addContent(`${r} ${g} ${b} RG`)
    }

    this.addContent(`(${escapedText}) Tj`)
    this.addContent('ET')

    // Reset rendering mode to default (fill)
    this.addContent('0 Tr')
  }

  /**
   * Begin a transparency group (isolated blend group)
   * @param isolated - Whether group is isolated from backdrop (default: true)
   * @param knockout - Whether group uses knockout blending (default: false)
   * @example
   * ```typescript
   * writer.beginTransparencyGroup()
   * writer.setFillColor(1, 0, 0)
   * writer.circle(150, 400, 50)
   * writer.fill()
   * writer.setFillColor(0, 0, 1)
   * writer.circle(180, 400, 50)
   * writer.fill()
   * writer.endTransparencyGroup()
   * ```
   */
  beginTransparencyGroup(isolated: boolean = true, knockout: boolean = false): void {
    // Save graphics state
    this.saveGraphicsState()

    // Begin transparency group using XObject stream
    // Note: This is a simplified implementation
    // Full implementation would create a Form XObject with /Group dictionary
    this.addContent('q')  // Save state

    // Set blend mode to Normal for isolated groups
    if (isolated) {
      this.blendMode('Normal')
    }
  }

  /**
   * End the current transparency group
   * @example
   * ```typescript
   * writer.beginTransparencyGroup()
   * // ... drawing operations ...
   * writer.endTransparencyGroup()
   * ```
   */
  endTransparencyGroup(): void {
    this.addContent('Q')  // Restore state
    this.restoreGraphicsState()
  }

  /**
   * Create a layer (Optional Content Group) that can be toggled on/off in PDF viewers
   * @param options - Layer configuration
   * @returns The layer name
   * @example
   * ```typescript
   * // Create layers
   * writer.createLayer({ name: 'Background', visible: true })
   * writer.createLayer({ name: 'Watermark', visible: false })
   * writer.createLayer({ name: 'Draft', visible: true, printable: false })
   *
   * // Draw content on specific layers
   * writer.beginLayer('Background')
   * writer.setFillColor(0.9, 0.9, 0.9)
   * writer.rect(0, 0, 612, 792)
   * writer.fill()
   * writer.endLayer()
   *
   * writer.beginLayer('Watermark')
   * writer.text('CONFIDENTIAL', 200, 400, 48)
   * writer.endLayer()
   * ```
   */
  createLayer(options: LayerOptions): string {
    const name = options.name

    // Check if layer already exists
    if (this.layerManager.hasLayer(name)) {
      return name
    }

    this.layerManager.registerLayer(name, options)
    return name
  }

  /**
   * Begin drawing on a specific layer (all subsequent content will be on this layer)
   * @param layerName - Name of the layer (must be created with createLayer first)
   * @example
   * ```typescript
   * writer.createLayer({ name: 'Text', visible: true })
   * writer.beginLayer('Text')
   * writer.text('This text is on the Text layer', 100, 700, 14)
   * writer.endLayer()
   * ```
   */
  beginLayer(layerName: string): void {
    if (!this.layerManager.hasLayer(layerName)) {
      throw new Error(`Layer '${layerName}' not found. Create it first with createLayer()`)
    }

    if (this.layerManager.getCurrentLayer() !== null) {
      throw new Error(`Already in layer '${this.layerManager.getCurrentLayer()}'. Call endLayer() first.`)
    }

    const layer = this.layerManager.getLayer(layerName)!
    this.layerManager.setCurrentLayer(layerName)

    // Add Begin Marked Content (BMC) with OC (Optional Content) property
    this.addContent(`/OC /OC${layer.id} BDC`)
  }

  /**
   * End the current layer
   * @example
   * ```typescript
   * writer.beginLayer('Background')
   * // ... draw content ...
   * writer.endLayer()
   * ```
   */
  endLayer(): void {
    if (this.layerManager.getCurrentLayer() === null) {
      throw new Error('No active layer. Call beginLayer() first.')
    }

    // Add End Marked Content (EMC)
    this.addContent('EMC')
    this.layerManager.setCurrentLayer(null)
  }

  /**
   * Add text to the PDF (simple version)
   */
  text(text: string, x: number, y: number, fontSize?: number, font?: string): void
  text(text: string, x: number, y: number, fontSize: number, font: string, options: TextOptions): void
  text(text: string, x: number, y: number, fontSize?: number, font?: string, options?: TextOptions): void {
    fontSize = fontSize || 12
    font = font || 'Helvetica'

    // Track character usage for custom fonts (for subsetting and ToUnicode)
    if (this.currentCustomFont) {
      const fontInfo = this.fontManager.getFont(this.currentCustomFont)
      if (fontInfo) {
        this.fontManager.trackCharacterUsage(fontInfo, text)
      }
    }

    // Use custom font or default font
    const fontId = this.currentCustomFont
      ? this.getActiveFontId()
      : this.getFontId(font as PDFBaseFont)

    // If no options, use simple text rendering
    if (!options) {
      this.addContent('BT')
      this.addContent(`/${fontId} ${fontSize} Tf`)
      this.addContent(`${x} ${y} Td`)
      const escapedText = this.escapePDFString(text)
      this.addContent(`(${escapedText}) Tj`)
      this.addContent('ET')
      return
    }

    // Advanced text rendering with options
    this.renderAdvancedText(text, x, y, fontSize, font, options)
  }

  /**
   * Render text with advanced options (word wrap, alignment, etc.)
   */
  private renderAdvancedText(
    text: string,
    x: number,
    y: number,
    fontSize: number,
    font: string,
    options: TextOptions
  ): void {
    const baseFont = font as PDFBaseFont
    // Use custom font if active, otherwise use specified font
    const fontId = this.currentCustomFont
      ? this.getActiveFontId()
      : this.getFontId(baseFont)
    const width = options.width
    const align = options.align || 'left'
    const lineGap = options.lineGap || 0
    const lineHeight = options.lineHeight || TextMeasure.calculateLineHeight(fontSize, lineGap)

    // Calculate lines (with word wrap if width is specified)
    let lines: string[]
    if (width) {
      lines = TextMeasure.wrapText(text, width, fontSize, baseFont)
    } else {
      lines = [text]
    }

    // Calculate starting Y position based on vertical alignment
    let currentY = y
    if (options.valign && options.height) {
      const totalHeight = lines.length * lineHeight
      switch (options.valign) {
        case 'center':
          currentY = y + (options.height - totalHeight) / 2
          break
        case 'bottom':
          currentY = y + options.height - totalHeight
          break
        // 'top' is default, no change needed
      }
    }

    // Render each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      let lineX = x

      // Apply first line indent
      if (i === 0 && options.indent) {
        lineX += options.indent
      }

      // Calculate X position based on alignment
      if (align !== 'left' && width) {
        const lineWidth = TextMeasure.measureText(line, fontSize, baseFont)

        switch (align) {
          case 'center':
            lineX = x + (width - lineWidth) / 2
            break
          case 'right':
            lineX = x + width - lineWidth
            break
          case 'justify':
            // Justify only if not the last line and line has multiple words
            if (i < lines.length - 1 && line.trim().includes(' ')) {
              this.renderJustifiedLine(line, x, currentY, width, fontSize, baseFont, fontId)
              currentY -= lineHeight
              continue
            }
            break
        }
      }

      // Render the line
      this.addContent('BT')
      this.addContent(`/${fontId} ${fontSize} Tf`)

      // Apply character and word spacing if specified
      if (options.characterSpacing) {
        this.addContent(`${options.characterSpacing} Tc`)
      }
      if (options.wordSpacing) {
        this.addContent(`${options.wordSpacing} Tw`)
      }

      this.addContent(`${lineX} ${currentY} Td`)
      const escapedText = this.escapePDFString(line)
      this.addContent(`(${escapedText}) Tj`)
      this.addContent('ET')

      // Draw underline if requested
      if (options.underline) {
        const lineWidth = TextMeasure.measureText(line, fontSize, baseFont)
        const underlineY = currentY - fontSize * 0.15
        this.setLineWidth(fontSize * 0.05)
        this.moveTo(lineX, underlineY)
        this.lineTo(lineX + lineWidth, underlineY)
        this.stroke()
      }

      // Draw strikethrough if requested
      if (options.strike) {
        const lineWidth = TextMeasure.measureText(line, fontSize, baseFont)
        const strikeY = currentY + fontSize * 0.3
        this.setLineWidth(fontSize * 0.05)
        this.moveTo(lineX, strikeY)
        this.lineTo(lineX + lineWidth, strikeY)
        this.stroke()
      }

      // Add link annotation if requested
      if (options.link) {
        const lineWidth = TextMeasure.measureText(line, fontSize, baseFont)
        this.pages[this.currentPageIndex].annotations.push({
          x: lineX,
          y: currentY,
          width: lineWidth,
          height: fontSize,
          url: options.link
        })
      }

      currentY -= lineHeight
    }

    // Update current position for continued text
    this.currentX = x
    this.currentY = currentY
    this.currentFontSize = fontSize
  }

  /**
   * Render a justified line of text
   */
  private renderJustifiedLine(
    line: string,
    x: number,
    y: number,
    width: number,
    fontSize: number,
    font: PDFBaseFont,
    fontId: string
  ): void {
    const words = line.trim().split(/\s+/)
    if (words.length <= 1) {
      // Can't justify single word, render normally
      this.addContent('BT')
      this.addContent(`/${fontId} ${fontSize} Tf`)
      this.addContent(`${x} ${y} Td`)
      const escapedText = this.escapePDFString(line)
      this.addContent(`(${escapedText}) Tj`)
      this.addContent('ET')
      return
    }

    // Calculate total width of words without spaces
    let wordsWidth = 0
    for (const word of words) {
      wordsWidth += TextMeasure.measureText(word, fontSize, font)
    }

    // Calculate space width to distribute
    const totalSpaceWidth = width - wordsWidth
    const spaceWidth = totalSpaceWidth / (words.length - 1)

    // Render words with calculated spacing
    let currentX = x
    this.addContent('BT')
    this.addContent(`/${fontId} ${fontSize} Tf`)

    for (let i = 0; i < words.length; i++) {
      const word = words[i]

      this.addContent(`${currentX} ${y} Td`)
      const escapedWord = this.escapePDFString(word)
      this.addContent(`(${escapedWord}) Tj`)

      if (i < words.length - 1) {
        const wordWidth = TextMeasure.measureText(word, fontSize, font)
        currentX += wordWidth + spaceWidth
        // Reset position for next word
        this.addContent('ET')
        this.addContent('BT')
        this.addContent(`/${fontId} ${fontSize} Tf`)
      }
    }

    this.addContent('ET')
  }

  /**
   * Measure the width of a string with the current font settings
   * @param text Text to measure
   * @param fontSize Font size in points (uses current font size if not specified)
   * @param font Font name (uses current font if not specified)
   * @returns Width in points
   */
  widthOfString(text: string, fontSize?: number, font?: PDFBaseFont): number {
    const size = fontSize !== undefined ? fontSize : this.currentFontSize
    const fontName = font !== undefined ? font : this.baseFont
    return TextMeasure.measureText(text, size, fontName)
  }

  /**
   * Measure the height of a string (line height) with the current font settings
   * @param text Text to measure (currently unused, but included for API compatibility)
   * @param fontSize Font size in points (uses current font size if not specified)
   * @param lineGap Additional gap between lines (default: 0)
   * @returns Height in points
   */
  heightOfString(text: string = '', fontSize?: number, lineGap: number = 0): number {
    const size = fontSize !== undefined ? fontSize : this.currentFontSize
    return TextMeasure.calculateLineHeight(size, lineGap)
  }

  /**
   * Embed an image and return its name for use in content streams
   */
  embedImage(source: string | Buffer): string {
    // Create a hash key for the image to avoid duplicates
    const key = typeof source === 'string' ? source : source.toString('base64').substring(0, 100)

    // Check if image already embedded
    if (this.imageManager.hasImage(key)) {
      const img = this.imageManager.getImage(key)!
      return `Im${img.id}`
    }

    // Parse the image
    const imageInfo = ImageParser.load(source)

    // Register the image
    const imageId = this.imageManager.registerImage(key, imageInfo)

    return `Im${imageId}`
  }

  /**
   * Embed an ImageInfo object (used when mask info is already attached)
   */
  embedImageInfo(imageInfo: ImageInfo): string {
    // Create a hash key based on the image data
    const key = imageInfo.data.toString('base64').substring(0, 100)

    // Check if image already embedded
    if (this.imageManager.hasImage(key)) {
      const img = this.imageManager.getImage(key)!
      return `Im${img.id}`
    }

    // Register the image
    const imageId = this.imageManager.registerImage(key, imageInfo)

    return `Im${imageId}`
  }

  /**
   * Get or register a font and return its PDF identifier (F1, F2, etc.)
   */
  private getFontId(font: PDFBaseFont): string {
    // Check if font already registered
    if (this.fonts.has(font)) {
      const fontIndex = this.fonts.get(font)!
      return `F${fontIndex}`
    }

    // Register new font
    const fontIndex = this.nextFontId++
    this.fonts.set(font, fontIndex)
    return `F${fontIndex}`
  }

  /**
   * Get font ID for current active font (base or custom)
   */
  private getActiveFontId(): string {
    // Priority: custom font > base font
    if (this.currentCustomFont) {
      const fontIndex = this.customFonts.get(this.currentCustomFont)
      if (fontIndex !== undefined) {
        return `F${fontIndex}`
      }
    }
    return this.getFontId(this.baseFont)
  }

  /**
   * Draw an image on the current page
   */
  drawImage(imageName: string, x: number, y: number, width: number, height: number): void {
    // Save graphics state
    this.addContent('q')

    // Transform matrix: width 0 0 height x y cm
    // PDF images are 1x1 unit squares, we need to scale and position them
    this.addContent(`${width} 0 0 ${height} ${x} ${y} cm`)

    // Paint the image
    this.addContent(`/${imageName} Do`)

    // Restore graphics state
    this.addContent('Q')
  }

  /**
   * Add QR code to the current page
   * @param options - QR code configuration options
   */
  async qrCode(options: QRCodeOptions): Promise<void> {
    // Generate QR code as PNG buffer
    const qrBuffer = await QRCodeGenerator.generate(options)

    // Parse the QR code image
    const imageInfo = ImageParser.load(qrBuffer)

    // CRITICAL: QR codes must NOT have interpolation (causes blurriness)
    imageInfo.interpolate = false

    // Store image and get ID
    const imageKey = `qr_${this.imageManager.getNextImageId()}`
    const imageId = this.imageManager.registerImage(imageKey, imageInfo)

    // Calculate dimensions
    const size = options.size || 100

    // Draw QR code on page using image drawing
    this.drawImage(`Im${imageId}`, options.x, options.y, size, size)
  }

  /**
   * Render page numbers on all pages
   */
  private renderPageNumbers(): void {
    if (!this.pageNumberOptions || !this.pageNumberOptions.enabled) {
      return
    }

    const options = this.pageNumberOptions
    const totalPages = this.pages.length
    const fontSize = options.fontSize || 10
    const margin = options.margin || 30
    const startAt = options.startAt || 1
    const excludePages = options.excludePages || []

    // Parse color (default: black)
    let r = 0, g = 0, b = 0
    if (options.color) {
      if (options.color.startsWith('#')) {
        const hex = options.color.replace('#', '')
        r = parseInt(hex.substring(0, 2), 16) / 255
        g = parseInt(hex.substring(2, 4), 16) / 255
        b = parseInt(hex.substring(4, 6), 16) / 255
      }
    }

    // Save current page index
    const originalPageIndex = this.currentPageIndex

    // Render page number on each page
    this.pages.forEach((pageData, pageIndex) => {
      // Skip if page is excluded
      if (excludePages.includes(pageIndex)) {
        return
      }

      // Skip if before startAt
      if (pageIndex + 1 < startAt) {
        return
      }

      // Switch to this page
      this.currentPageIndex = pageIndex

      // Calculate page number text
      const currentPageNumber = pageIndex + 1
      let pageText: string

      if (typeof options.format === 'function') {
        // Custom format function
        pageText = options.format(currentPageNumber, totalPages)
      } else if (typeof options.format === 'string') {
        // Template string with {current} and {total} placeholders
        pageText = options.format
          .replace('{current}', currentPageNumber.toString())
          .replace('{total}', totalPages.toString())
      } else {
        // Default format: "Page X of Y"
        pageText = `Page ${currentPageNumber} of ${totalPages}`
      }

      // Calculate position
      let x: number, y: number

      const position = options.position || 'bottom-center'

      // Approximate text width (very rough estimation)
      const charWidth = fontSize * 0.5
      const textWidth = pageText.length * charWidth

      switch (position) {
        case 'top-left':
          x = margin
          y = pageData.height - margin
          break
        case 'top-center':
          x = (pageData.width - textWidth) / 2
          y = pageData.height - margin
          break
        case 'top-right':
          x = pageData.width - textWidth - margin
          y = pageData.height - margin
          break
        case 'bottom-left':
          x = margin
          y = margin
          break
        case 'bottom-center':
          x = (pageData.width - textWidth) / 2
          y = margin
          break
        case 'bottom-right':
          x = pageData.width - textWidth - margin
          y = margin
          break
      }

      // Add page number text
      const escapedPageText = this.escapePDFString(pageText)
      const pageNumberFontId = this.getFontId('Helvetica')  // Page numbers use Helvetica
      this.addContent('BT')
      this.addContent(`${r} ${g} ${b} rg`)  // Set text color
      this.addContent(`/${pageNumberFontId} ${fontSize} Tf`)
      this.addContent(`${x} ${y} Td`)
      this.addContent(`(${escapedPageText}) Tj`)
      this.addContent('ET')
    })

    // Restore original page index
    this.currentPageIndex = originalPageIndex
  }

  /**
   * Check if header/footer should be rendered on a specific page
   */
  private shouldRenderOnPage(pageIndex: number, totalPages: number, pageRule?: PageRule, excludePages?: number[]): boolean {
    // Check if page is excluded
    if (excludePages && excludePages.includes(pageIndex)) {
      return false
    }

    // Check page rule
    const rule = pageRule || 'all'
    const pageNumber = pageIndex + 1  // 1-indexed page number

    switch (rule) {
      case 'all':
        return true
      case 'first':
        return pageNumber === 1
      case 'notFirst':
        return pageNumber !== 1
      case 'odd':
        return pageNumber % 2 === 1
      case 'even':
        return pageNumber % 2 === 0
      default:
        return true
    }
  }

  /**
   * Evaluate header/footer content (string or function)
   */
  private evaluateContent(content: HeaderFooterContent, pageNumber: number, totalPages: number): string {
    if (typeof content === 'function') {
      return content(pageNumber, totalPages)
    }
    return content
  }

  /**
   * Render headers on all pages
   */
  private renderHeaders(): void {
    if (!this.headerFooterOptions?.header?.enabled) {
      return
    }

    const header = this.headerFooterOptions.header
    const totalPages = this.pages.length
    const originalPageIndex = this.currentPageIndex

    // Default values
    const margin = header.margin || 30
    const fontSize = header.fontSize || 10
    const font = header.font || 'Helvetica'
    const fontId = this.getFontId(font)

    // Parse color (default: black)
    let r = 0, g = 0, b = 0
    if (header.color) {
      ;[r, g, b] = this.parseColor(header.color)
    }

    // Render header on each page
    this.pages.forEach((pageData, pageIndex) => {
      if (!this.shouldRenderOnPage(pageIndex, totalPages, header.pages, header.excludePages)) {
        return
      }

      // Switch to this page
      this.currentPageIndex = pageIndex
      const pageNumber = pageIndex + 1
      const y = pageData.height - margin

      // Render left, center, right text
      if (header.left) {
        const text = this.evaluateContent(header.left, pageNumber, totalPages)
        const escapedText = this.escapePDFString(text)
        this.addContent('BT')
        this.addContent(`${r.toFixed(4)} ${g.toFixed(4)} ${b.toFixed(4)} rg`)
        this.addContent(`/${fontId} ${fontSize} Tf`)
        this.addContent(`${margin} ${y} Td`)
        this.addContent(`(${escapedText}) Tj`)
        this.addContent('ET')
      }

      if (header.center) {
        const text = this.evaluateContent(header.center, pageNumber, totalPages)
        const escapedText = this.escapePDFString(text)
        const charWidth = fontSize * 0.5
        const textWidth = text.length * charWidth
        const x = (pageData.width - textWidth) / 2
        this.addContent('BT')
        this.addContent(`${r.toFixed(4)} ${g.toFixed(4)} ${b.toFixed(4)} rg`)
        this.addContent(`/${fontId} ${fontSize} Tf`)
        this.addContent(`${x.toFixed(2)} ${y} Td`)
        this.addContent(`(${escapedText}) Tj`)
        this.addContent('ET')
      }

      if (header.right) {
        const text = this.evaluateContent(header.right, pageNumber, totalPages)
        const escapedText = this.escapePDFString(text)
        const charWidth = fontSize * 0.5
        const textWidth = text.length * charWidth
        const x = pageData.width - textWidth - margin
        this.addContent('BT')
        this.addContent(`${r.toFixed(4)} ${g.toFixed(4)} ${b.toFixed(4)} rg`)
        this.addContent(`/${fontId} ${fontSize} Tf`)
        this.addContent(`${x.toFixed(2)} ${y} Td`)
        this.addContent(`(${escapedText}) Tj`)
        this.addContent('ET')
      }

      // Render advanced text items
      if (header.text) {
        header.text.forEach(textItem => {
          const text = this.evaluateContent(textItem.content, pageNumber, totalPages)
          const escapedText = this.escapePDFString(text)
          const itemFontSize = textItem.fontSize || fontSize
          const itemFont = textItem.font || font
          const itemFontId = this.getFontId(itemFont)

          // Parse item color
          let ir = r, ig = g, ib = b
          if (textItem.color) {
            ;[ir, ig, ib] = this.parseColor(textItem.color)
          }

          const charWidth = itemFontSize * 0.5
          const textWidth = text.length * charWidth
          let x: number

          const align = textItem.align || 'left'
          switch (align) {
            case 'left':
              x = margin
              break
            case 'center':
              x = (pageData.width - textWidth) / 2
              break
            case 'right':
              x = pageData.width - textWidth - margin
              break
          }

          this.addContent('BT')
          this.addContent(`${ir.toFixed(4)} ${ig.toFixed(4)} ${ib.toFixed(4)} rg`)
          this.addContent(`/${itemFontId} ${itemFontSize} Tf`)
          this.addContent(`${x.toFixed(2)} ${y} Td`)
          this.addContent(`(${escapedText}) Tj`)
          this.addContent('ET')
        })
      }

      // Draw line below header if requested
      if (header.line) {
        const lineY = y - (fontSize + 5)
        const lineWidth = header.lineWidth || 0.5
        let lr = 0, lg = 0, lb = 0
        if (header.lineColor) {
          ;[lr, lg, lb] = this.parseColor(header.lineColor)
        }

        this.addContent(`${lineWidth} w`)
        this.addContent(`${lr.toFixed(4)} ${lg.toFixed(4)} ${lb.toFixed(4)} RG`)
        this.addContent(`${margin} ${lineY.toFixed(2)} m`)
        this.addContent(`${(pageData.width - margin).toFixed(2)} ${lineY.toFixed(2)} l`)
        this.addContent('S')
      }
    })

    // Restore original page index
    this.currentPageIndex = originalPageIndex
  }

  /**
   * Render footers on all pages
   */
  private renderFooters(): void {
    if (!this.headerFooterOptions?.footer?.enabled) {
      return
    }

    const footer = this.headerFooterOptions.footer
    const totalPages = this.pages.length
    const originalPageIndex = this.currentPageIndex

    // Default values
    const margin = footer.margin || 30
    const fontSize = footer.fontSize || 10
    const font = footer.font || 'Helvetica'
    const fontId = this.getFontId(font)

    // Parse color (default: black)
    let r = 0, g = 0, b = 0
    if (footer.color) {
      ;[r, g, b] = this.parseColor(footer.color)
    }

    // Render footer on each page
    this.pages.forEach((pageData, pageIndex) => {
      if (!this.shouldRenderOnPage(pageIndex, totalPages, footer.pages, footer.excludePages)) {
        return
      }

      // Switch to this page
      this.currentPageIndex = pageIndex
      const pageNumber = pageIndex + 1
      const y = margin

      // Render left, center, right text
      if (footer.left) {
        const text = this.evaluateContent(footer.left, pageNumber, totalPages)
        const escapedText = this.escapePDFString(text)
        this.addContent('BT')
        this.addContent(`${r.toFixed(4)} ${g.toFixed(4)} ${b.toFixed(4)} rg`)
        this.addContent(`/${fontId} ${fontSize} Tf`)
        this.addContent(`${margin} ${y} Td`)
        this.addContent(`(${escapedText}) Tj`)
        this.addContent('ET')
      }

      if (footer.center) {
        const text = this.evaluateContent(footer.center, pageNumber, totalPages)
        const escapedText = this.escapePDFString(text)
        const charWidth = fontSize * 0.5
        const textWidth = text.length * charWidth
        const x = (pageData.width - textWidth) / 2
        this.addContent('BT')
        this.addContent(`${r.toFixed(4)} ${g.toFixed(4)} ${b.toFixed(4)} rg`)
        this.addContent(`/${fontId} ${fontSize} Tf`)
        this.addContent(`${x.toFixed(2)} ${y} Td`)
        this.addContent(`(${escapedText}) Tj`)
        this.addContent('ET')
      }

      if (footer.right) {
        const text = this.evaluateContent(footer.right, pageNumber, totalPages)
        const escapedText = this.escapePDFString(text)
        const charWidth = fontSize * 0.5
        const textWidth = text.length * charWidth
        const x = pageData.width - textWidth - margin
        this.addContent('BT')
        this.addContent(`${r.toFixed(4)} ${g.toFixed(4)} ${b.toFixed(4)} rg`)
        this.addContent(`/${fontId} ${fontSize} Tf`)
        this.addContent(`${x.toFixed(2)} ${y} Td`)
        this.addContent(`(${escapedText}) Tj`)
        this.addContent('ET')
      }

      // Render advanced text items
      if (footer.text) {
        footer.text.forEach(textItem => {
          const text = this.evaluateContent(textItem.content, pageNumber, totalPages)
          const escapedText = this.escapePDFString(text)
          const itemFontSize = textItem.fontSize || fontSize
          const itemFont = textItem.font || font
          const itemFontId = this.getFontId(itemFont)

          // Parse item color
          let ir = r, ig = g, ib = b
          if (textItem.color) {
            ;[ir, ig, ib] = this.parseColor(textItem.color)
          }

          const charWidth = itemFontSize * 0.5
          const textWidth = text.length * charWidth
          let x: number

          const align = textItem.align || 'left'
          switch (align) {
            case 'left':
              x = margin
              break
            case 'center':
              x = (pageData.width - textWidth) / 2
              break
            case 'right':
              x = pageData.width - textWidth - margin
              break
          }

          this.addContent('BT')
          this.addContent(`${ir.toFixed(4)} ${ig.toFixed(4)} ${ib.toFixed(4)} rg`)
          this.addContent(`/${itemFontId} ${itemFontSize} Tf`)
          this.addContent(`${x.toFixed(2)} ${y} Td`)
          this.addContent(`(${escapedText}) Tj`)
          this.addContent('ET')
        })
      }

      // Draw line above footer if requested
      if (footer.line) {
        const lineY = y + fontSize + 5
        const lineWidth = footer.lineWidth || 0.5
        let lr = 0, lg = 0, lb = 0
        if (footer.lineColor) {
          ;[lr, lg, lb] = this.parseColor(footer.lineColor)
        }

        this.addContent(`${lineWidth} w`)
        this.addContent(`${lr.toFixed(4)} ${lg.toFixed(4)} ${lb.toFixed(4)} RG`)
        this.addContent(`${margin} ${lineY.toFixed(2)} m`)
        this.addContent(`${(pageData.width - margin).toFixed(2)} ${lineY.toFixed(2)} l`)
        this.addContent('S')
      }
    })

    // Restore original page index
    this.currentPageIndex = originalPageIndex
  }

  /**
   * Render watermarks on pages
   */
  private renderWatermarks(): void {
    if (this.watermarkManager.getWatermarkCount() === 0) {
      return
    }

    const originalPageIndex = this.currentPageIndex

    this.watermarkManager.getAllWatermarks().forEach(watermark => {
      // Determine which pages to apply watermark
      const pages = watermark.pages || 'all'
      const targetPages = pages === 'all'
        ? Array.from({ length: this.pages.length }, (_, i) => i)
        : pages

      // Defaults
      const opacity = watermark.opacity !== undefined ? watermark.opacity : 0.3
      const rotation = watermark.rotation || 0
      const position = watermark.position || 'center'
      const layer = watermark.layer || 'background'

      targetPages.forEach(pageIndex => {
        if (pageIndex < 0 || pageIndex >= this.pages.length) {
          return // Skip invalid page indices
        }

        this.currentPageIndex = pageIndex
        const pageData = this.pages[pageIndex]
        const pageWidth = pageData.width
        const pageHeight = pageData.height

        if (watermark.type === 'text') {
          // Text watermark
          const text = watermark.text
          const fontSize = watermark.fontSize || 48
          const font = watermark.font || 'Helvetica-Bold'
          const fontId = this.getFontId(font)

          // Parse color (default: gray)
          const color = watermark.color || [0.5, 0.5, 0.5]
          const [r, g, b] = Array.isArray(color) ? color : this.parseColor(color)

          // Calculate text dimensions (approximate)
          const charWidth = fontSize * 0.6
          const textWidth = text.length * charWidth

          // Calculate position
          let x: number, y: number

          if (position === 'custom' && watermark.x !== undefined && watermark.y !== undefined) {
            x = watermark.x
            y = watermark.y
          } else {
            const coords = this.calculateWatermarkPosition(position, pageWidth, pageHeight, textWidth, fontSize)
            x = coords.x
            y = coords.y
          }

          // Save graphics state
          if (layer === 'background') {
            // Insert watermark at the beginning of page content
            pageData.content.unshift('q')
          } else {
            this.addContent('q')
          }

          // Build watermark commands
          const commands: string[] = []

          // Set transparency
          commands.push(`/GS1 gs`) // We'll need to add ExtGState for opacity

          // Set color
          commands.push(`${r.toFixed(4)} ${g.toFixed(4)} ${b.toFixed(4)} rg`)

          // Rotation and positioning
          if (rotation !== 0 || position === 'diagonal') {
            const angle = position === 'diagonal' ? 45 : rotation
            const rad = (angle * Math.PI) / 180
            const cos = Math.cos(rad).toFixed(4)
            const sin = Math.sin(rad).toFixed(4)

            // For diagonal, center the rotated text
            if (position === 'diagonal') {
              x = pageWidth / 2
              y = pageHeight / 2
            }

            // Apply transformation matrix for rotation
            commands.push(`${cos} ${sin} ${-sin} ${cos} ${x.toFixed(2)} ${y.toFixed(2)} cm`)
            commands.push('BT')
            commands.push(`/${fontId} ${fontSize} Tf`)
            commands.push(`0 0 Td`)
            commands.push(`(${this.escapePDFString(text)}) Tj`)
            commands.push('ET')
          } else {
            commands.push('BT')
            commands.push(`/${fontId} ${fontSize} Tf`)
            commands.push(`${x.toFixed(2)} ${y.toFixed(2)} Td`)
            commands.push(`(${this.escapePDFString(text)}) Tj`)
            commands.push('ET')
          }

          // Restore graphics state
          commands.push('Q')

          if (layer === 'background') {
            // Insert at beginning (after the 'q')
            pageData.content.splice(1, 0, ...commands)
          } else {
            commands.forEach(cmd => this.addContent(cmd))
          }

        } else if (watermark.type === 'image') {
          // Image watermark
          const imageKey = typeof watermark.source === 'string'
            ? watermark.source
            : watermark.source.toString('base64')

          // Load image if not already loaded
          if (!this.imageManager.hasImage(imageKey)) {
            try {
              const imageInfo = ImageParser.load(watermark.source)
              this.imageManager.registerImage(imageKey, imageInfo)
            } catch (error) {
              logger.error(
                'Failed to load watermark image',
                'PDFWriter',
                { error: error instanceof Error ? error.message : 'Unknown error' }
              )
              return
            }
          }

          const imageData = this.imageManager.getImage(imageKey)!
          const imageInfo = imageData.info

          // Calculate dimensions
          let width = watermark.width
          let height = watermark.height
          const scale = watermark.scale || 1

          if (!width && !height) {
            width = imageInfo.width * scale
            height = imageInfo.height * scale
          } else if (width && !height) {
            height = (width / imageInfo.width) * imageInfo.height
          } else if (!width && height) {
            width = (height / imageInfo.height) * imageInfo.width
          }

          width = width! * scale
          height = height! * scale

          // Calculate position
          let x: number, y: number

          if (position === 'custom' && watermark.x !== undefined && watermark.y !== undefined) {
            x = watermark.x
            y = watermark.y
          } else {
            const coords = this.calculateWatermarkPosition(position, pageWidth, pageHeight, width, height)
            x = coords.x
            y = coords.y
          }

          // Save graphics state
          if (layer === 'background') {
            pageData.content.unshift('q')
          } else {
            this.addContent('q')
          }

          const commands: string[] = []

          // Set transparency (we'll add opacity support in ExtGState)
          commands.push(`/GS1 gs`)

          // Position and scale image
          if (rotation !== 0 || position === 'diagonal') {
            const angle = position === 'diagonal' ? 45 : rotation
            const rad = (angle * Math.PI) / 180
            const cos = Math.cos(rad).toFixed(4)
            const sin = Math.sin(rad).toFixed(4)

            if (position === 'diagonal') {
              x = pageWidth / 2 - width / 2
              y = pageHeight / 2 - height / 2
            }

            // Apply transformation
            commands.push(`${cos} ${sin} ${-sin} ${cos} ${x.toFixed(2)} ${y.toFixed(2)} cm`)
            commands.push(`${width.toFixed(2)} 0 0 ${height.toFixed(2)} 0 0 cm`)
          } else {
            commands.push(`${width.toFixed(2)} 0 0 ${height.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} cm`)
          }

          commands.push(`/Im${imageData.id} Do`)
          commands.push('Q')

          if (layer === 'background') {
            pageData.content.splice(1, 0, ...commands)
          } else {
            commands.forEach(cmd => this.addContent(cmd))
          }
        }
      })
    })

    // Restore original page index
    this.currentPageIndex = originalPageIndex
  }

  /**
   * Calculate watermark position based on preset
   */
  private calculateWatermarkPosition(
    position: string,
    pageWidth: number,
    pageHeight: number,
    contentWidth: number,
    contentHeight: number
  ): { x: number; y: number } {
    const margin = 50

    switch (position) {
      case 'center':
        return {
          x: (pageWidth - contentWidth) / 2,
          y: (pageHeight - contentHeight) / 2
        }
      case 'top-left':
        return { x: margin, y: pageHeight - contentHeight - margin }
      case 'top-center':
        return { x: (pageWidth - contentWidth) / 2, y: pageHeight - contentHeight - margin }
      case 'top-right':
        return { x: pageWidth - contentWidth - margin, y: pageHeight - contentHeight - margin }
      case 'middle-left':
        return { x: margin, y: (pageHeight - contentHeight) / 2 }
      case 'middle-right':
        return { x: pageWidth - contentWidth - margin, y: (pageHeight - contentHeight) / 2 }
      case 'bottom-left':
        return { x: margin, y: margin }
      case 'bottom-center':
        return { x: (pageWidth - contentWidth) / 2, y: margin }
      case 'bottom-right':
        return { x: pageWidth - contentWidth - margin, y: margin }
      case 'diagonal':
        return {
          x: (pageWidth - contentWidth) / 2,
          y: (pageHeight - contentHeight) / 2
        }
      default:
        return {
          x: (pageWidth - contentWidth) / 2,
          y: (pageHeight - contentHeight) / 2
        }
    }
  }

  // ==================
  // VECTOR SHAPES
  // ==================

  /**
   * Parse color from hex string or RGB array to RGB array
   */
  private parseColor(color: Color): [number, number, number] {
    if (typeof color === 'string') {
      // Parse hex color (e.g., '#FF0000' or 'FF0000')
      const hex = color.replace('#', '')
      const r = parseInt(hex.substring(0, 2), 16) / 255
      const g = parseInt(hex.substring(2, 4), 16) / 255
      const b = parseInt(hex.substring(4, 6), 16) / 255
      return [r, g, b]
    }
    return color
  }

  /**
   * Create a hash key for a gradient (for caching)
   */
  private hashGradient(gradient: Gradient): string {
    const isLinear = 'x0' in gradient && 'x1' in gradient
    if (isLinear) {
      const g = gradient as LinearGradientOptions
      return `L_${g.x0}_${g.y0}_${g.x1}_${g.y1}_${JSON.stringify(g.colorStops)}`
    } else {
      const g = gradient as RadialGradientOptions
      return `R_${g.x0}_${g.y0}_${g.r0}_${g.x1}_${g.y1}_${g.r1}_${JSON.stringify(g.colorStops)}`
    }
  }

  /**
   * Register a gradient and get its pattern name
   */
  private registerGradient(gradient: Gradient): string {
    const hash = this.hashGradient(gradient)

    if (this.gradientManager.hasGradient(hash)) {
      const id = this.gradientManager.getGradient(hash)!.id
      return `P${id}`
    }

    const id = this.gradientManager.registerGradient(hash, gradient)
    return `P${id}`
  }

  /**
   * Apply shape styling (fill and stroke)
   */
  private applyShapeStyle(
    fillColor?: Color,
    strokeColor?: Color,
    strokeWidth?: number,
    dashPattern?: number[],
    fillGradient?: Gradient
  ): void {
    // Set dash pattern if provided
    if (dashPattern && dashPattern.length > 0) {
      const pattern = dashPattern.join(' ')
      this.addContent(`[${pattern}] 0 d`)
    }

    // Set stroke width
    if (strokeWidth !== undefined && strokeColor) {
      this.setLineWidth(strokeWidth)
    }

    // Handle gradient fill
    if (fillGradient) {
      const patternName = this.registerGradient(fillGradient)

      // Set pattern color space and apply pattern
      this.addContent('/Pattern cs')
      this.addContent(`/${patternName} scn`)

      if (strokeColor) {
        // Fill with gradient and stroke
        const [sr, sg, sb] = this.parseColor(strokeColor)
        this.addContent(`${sr.toFixed(4)} ${sg.toFixed(4)} ${sb.toFixed(4)} RG`)
        this.addContent('B')  // Fill and stroke
      } else {
        // Fill with gradient only
        this.addContent('f')  // Fill
      }
    } else if (fillColor && strokeColor) {
      // Both fill and stroke (solid colors)
      const [fr, fg, fb] = this.parseColor(fillColor)
      const [sr, sg, sb] = this.parseColor(strokeColor)
      this.addContent(`${fr.toFixed(4)} ${fg.toFixed(4)} ${fb.toFixed(4)} rg`)  // Fill color
      this.addContent(`${sr.toFixed(4)} ${sg.toFixed(4)} ${sb.toFixed(4)} RG`)  // Stroke color
      this.addContent('B')  // Fill and stroke
    } else if (fillColor) {
      // Fill only
      const [r, g, b] = this.parseColor(fillColor)
      this.addContent(`${r.toFixed(4)} ${g.toFixed(4)} ${b.toFixed(4)} rg`)
      this.addContent('f')  // Fill
    } else if (strokeColor) {
      // Stroke only
      const [r, g, b] = this.parseColor(strokeColor)
      this.addContent(`${r.toFixed(4)} ${g.toFixed(4)} ${b.toFixed(4)} RG`)
      this.addContent('S')  // Stroke
    }

    // Reset dash pattern
    if (dashPattern && dashPattern.length > 0) {
      this.addContent('[] 0 d')
    }
  }

  /**
   * Draw a circle
   */
  circle(options: CircleOptions): void {
    const { x, y, radius, fillColor, fillGradient, strokeColor, strokeWidth, dashPattern } = options

    // Circle approximation using Bezier curves
    // Magic number for approximating a circle with cubic Bezier curves
    const k = 0.5522847498

    const ox = radius * k  // Control point offset for x
    const oy = radius * k  // Control point offset for y

    // Move to start point (right side of circle)
    this.addContent(`${(x + radius).toFixed(2)} ${y.toFixed(2)} m`)

    // Top-right arc
    this.addContent(`${(x + radius).toFixed(2)} ${(y + oy).toFixed(2)} ${(x + ox).toFixed(2)} ${(y + radius).toFixed(2)} ${x.toFixed(2)} ${(y + radius).toFixed(2)} c`)
    // Top-left arc
    this.addContent(`${(x - ox).toFixed(2)} ${(y + radius).toFixed(2)} ${(x - radius).toFixed(2)} ${(y + oy).toFixed(2)} ${(x - radius).toFixed(2)} ${y.toFixed(2)} c`)
    // Bottom-left arc
    this.addContent(`${(x - radius).toFixed(2)} ${(y - oy).toFixed(2)} ${(x - ox).toFixed(2)} ${(y - radius).toFixed(2)} ${x.toFixed(2)} ${(y - radius).toFixed(2)} c`)
    // Bottom-right arc
    this.addContent(`${(x + ox).toFixed(2)} ${(y - radius).toFixed(2)} ${(x + radius).toFixed(2)} ${(y - oy).toFixed(2)} ${(x + radius).toFixed(2)} ${y.toFixed(2)} c`)

    // Close path
    this.addContent('h')

    // Apply styling
    this.applyShapeStyle(fillColor, strokeColor, strokeWidth, dashPattern, fillGradient)
  }

  /**
   * Draw an ellipse
   */
  ellipse(options: EllipseOptions): void {
    const { x, y, radiusX, radiusY, rotation = 0, fillColor, fillGradient, strokeColor, strokeWidth, dashPattern } = options

    const k = 0.5522847498
    const ox = radiusX * k
    const oy = radiusY * k

    // If rotation is specified, save graphics state and rotate
    if (rotation !== 0) {
      this.addContent('q')  // Save state
      const rad = (rotation * Math.PI) / 180
      const cos = parseFloat(Math.cos(rad).toFixed(6))
      const sin = parseFloat(Math.sin(rad).toFixed(6))
      // Transformation matrix: translate to center, rotate, translate back
      this.addContent(`1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} cm`)  // Translate to center
      this.addContent(`${cos} ${sin} ${-sin} ${cos} 0 0 cm`)  // Rotate
      this.addContent(`1 0 0 1 ${(-x).toFixed(2)} ${(-y).toFixed(2)} cm`)  // Translate back
    }

    // Move to start point (right side of ellipse)
    this.addContent(`${(x + radiusX).toFixed(2)} ${y.toFixed(2)} m`)

    // Top-right arc
    this.addContent(`${(x + radiusX).toFixed(2)} ${(y + oy).toFixed(2)} ${(x + ox).toFixed(2)} ${(y + radiusY).toFixed(2)} ${x.toFixed(2)} ${(y + radiusY).toFixed(2)} c`)
    // Top-left arc
    this.addContent(`${(x - ox).toFixed(2)} ${(y + radiusY).toFixed(2)} ${(x - radiusX).toFixed(2)} ${(y + oy).toFixed(2)} ${(x - radiusX).toFixed(2)} ${y.toFixed(2)} c`)
    // Bottom-left arc
    this.addContent(`${(x - radiusX).toFixed(2)} ${(y - oy).toFixed(2)} ${(x - ox).toFixed(2)} ${(y - radiusY).toFixed(2)} ${x.toFixed(2)} ${(y - radiusY).toFixed(2)} c`)
    // Bottom-right arc
    this.addContent(`${(x + ox).toFixed(2)} ${(y - radiusY).toFixed(2)} ${(x + radiusX).toFixed(2)} ${(y - oy).toFixed(2)} ${(x + radiusX).toFixed(2)} ${y.toFixed(2)} c`)

    // Close path
    this.addContent('h')

    // Apply styling
    this.applyShapeStyle(fillColor, strokeColor, strokeWidth, dashPattern, fillGradient)

    // Restore graphics state if rotated
    if (rotation !== 0) {
      this.addContent('Q')  // Restore state
    }
  }

  /**
   * Draw a regular polygon
   */
  polygon(options: PolygonOptions): void {
    const { x, y, radius, sides, rotation = 0, fillColor, fillGradient, strokeColor, strokeWidth, dashPattern } = options

    if (sides < 3) {
      throw new Error('Polygon must have at least 3 sides')
    }

    // Calculate vertices
    const angleStep = (2 * Math.PI) / sides
    const startAngle = (rotation * Math.PI) / 180 - Math.PI / 2  // Start at top

    // Move to first vertex
    const x0 = x + radius * Math.cos(startAngle)
    const y0 = y + radius * Math.sin(startAngle)
    this.addContent(`${x0.toFixed(2)} ${y0.toFixed(2)} m`)

    // Draw lines to other vertices
    for (let i = 1; i <= sides; i++) {
      const angle = startAngle + angleStep * i
      const xi = x + radius * Math.cos(angle)
      const yi = y + radius * Math.sin(angle)
      this.addContent(`${xi.toFixed(2)} ${yi.toFixed(2)} l`)
    }

    // Close path
    this.addContent('h')

    // Apply styling
    this.applyShapeStyle(fillColor, strokeColor, strokeWidth, dashPattern, fillGradient)
  }

  /**
   * Draw an arc (curved line, not filled)
   */
  arc(options: ArcOptions): void {
    const { x, y, radius, startAngle, endAngle, counterclockwise = false, strokeColor, strokeWidth, dashPattern } = options

    // Convert angles to radians
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    // Calculate arc using Bezier curves
    // For simplicity, we'll approximate with a single cubic Bezier if the arc is <= 90 degrees
    // Otherwise, split into multiple segments

    let currentAngle = startRad
    const targetAngle = endRad
    const direction = counterclockwise ? -1 : 1

    // Move to start point
    const x0 = x + radius * Math.cos(startRad)
    const y0 = y + radius * Math.sin(startRad)
    this.addContent(`${x0.toFixed(2)} ${y0.toFixed(2)} m`)

    // Draw arc in segments
    while (Math.abs(targetAngle - currentAngle) > 0.01) {
      const remainingAngle = targetAngle - currentAngle
      const segmentAngle = Math.min(Math.abs(remainingAngle), Math.PI / 2) * direction
      const nextAngle = currentAngle + segmentAngle

      // Calculate control points for cubic Bezier
      const q2 = (4 / 3) * Math.tan(segmentAngle / 4)

      const cp1x = x + radius * (Math.cos(currentAngle) - q2 * Math.sin(currentAngle))
      const cp1y = y + radius * (Math.sin(currentAngle) + q2 * Math.cos(currentAngle))
      const cp2x = x + radius * (Math.cos(nextAngle) + q2 * Math.sin(nextAngle))
      const cp2y = y + radius * (Math.sin(nextAngle) - q2 * Math.cos(nextAngle))
      const endX = x + radius * Math.cos(nextAngle)
      const endY = y + radius * Math.sin(nextAngle)

      this.addContent(`${cp1x.toFixed(2)} ${cp1y.toFixed(2)} ${cp2x.toFixed(2)} ${cp2y.toFixed(2)} ${endX.toFixed(2)} ${endY.toFixed(2)} c`)

      currentAngle = nextAngle
    }

    // Stroke only (arcs are not filled)
    if (dashPattern && dashPattern.length > 0) {
      const pattern = dashPattern.join(' ')
      this.addContent(`[${pattern}] 0 d`)
    }

    if (strokeWidth !== undefined) {
      this.setLineWidth(strokeWidth)
    }

    if (strokeColor) {
      const [r, g, b] = this.parseColor(strokeColor)
      this.addContent(`${r.toFixed(4)} ${g.toFixed(4)} ${b.toFixed(4)} RG`)
    }

    this.addContent('S')

    if (dashPattern && dashPattern.length > 0) {
      this.addContent('[] 0 d')
    }
  }

  /**
   * Draw a sector (pie slice)
   */
  sector(options: SectorOptions): void {
    const { x, y, radius, startAngle, endAngle, counterclockwise = false, fillColor, fillGradient, strokeColor, strokeWidth, dashPattern } = options

    // Convert angles to radians
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    // Move to center
    this.addContent(`${x.toFixed(2)} ${y.toFixed(2)} m`)

    // Line to start of arc
    const x0 = x + radius * Math.cos(startRad)
    const y0 = y + radius * Math.sin(startRad)
    this.addContent(`${x0.toFixed(2)} ${y0.toFixed(2)} l`)

    // Draw arc (similar to arc() method)
    let currentAngle = startRad
    const targetAngle = endRad
    const direction = counterclockwise ? -1 : 1

    while (Math.abs(targetAngle - currentAngle) > 0.01) {
      const remainingAngle = targetAngle - currentAngle
      const segmentAngle = Math.min(Math.abs(remainingAngle), Math.PI / 2) * direction
      const nextAngle = currentAngle + segmentAngle

      const q2 = (4 / 3) * Math.tan(segmentAngle / 4)

      const cp1x = x + radius * (Math.cos(currentAngle) - q2 * Math.sin(currentAngle))
      const cp1y = y + radius * (Math.sin(currentAngle) + q2 * Math.cos(currentAngle))
      const cp2x = x + radius * (Math.cos(nextAngle) + q2 * Math.sin(nextAngle))
      const cp2y = y + radius * (Math.sin(nextAngle) - q2 * Math.cos(nextAngle))
      const endX = x + radius * Math.cos(nextAngle)
      const endY = y + radius * Math.sin(nextAngle)

      this.addContent(`${cp1x.toFixed(2)} ${cp1y.toFixed(2)} ${cp2x.toFixed(2)} ${cp2y.toFixed(2)} ${endX.toFixed(2)} ${endY.toFixed(2)} c`)

      currentAngle = nextAngle
    }

    // Close path (line back to center)
    this.addContent('h')

    // Apply styling
    this.applyShapeStyle(fillColor, strokeColor, strokeWidth, dashPattern, fillGradient)
  }

  /**
   * Draw a cubic Bezier curve
   */
  curveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
    this.addContent(`${cp1x} ${cp1y} ${cp2x} ${cp2y} ${x} ${y} c`)
  }

  /**
   * Draw a quadratic Bezier curve
   */
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
    // PDF doesn't have native quadratic Bezier, convert to cubic
    // Get current point (we need to track this)
    // For now, we'll use a simplified version
    this.addContent(`${cpx} ${cpy} ${x} ${y} v`)
  }

  /**
   * Generate the final PDF as a Buffer
   */
  generate(): Buffer {
    // Render watermarks, page numbers, headers, and footers before generating PDF
    this.renderWatermarks()
    this.renderPageNumbers()
    this.renderHeaders()
    this.renderFooters()
    const objects: PDFObject[] = []
    let currentObjectId = 1

    // Reserve IDs for Info object
    const infoObjectId = currentObjectId++

    // Object 1 (now 2): Catalog
    const catalogId = currentObjectId++

    // Object 2 (now 3): Pages (will contain all page references)
    const pageObjectIds: number[] = []
    const pagesObjectId = currentObjectId++

    // Reserve object IDs for pages, content streams, resources, and fonts
    const firstPageObjectId = currentObjectId

    // For each page we need: Page object, Content stream, Resources object
    const pageObjectsCount = this.pages.length * 3
    currentObjectId = firstPageObjectId + pageObjectsCount

    // Fallback: if no fonts registered, register default Helvetica
    if (this.fonts.size === 0) {
      this.getFontId('Helvetica')
    }

    // Reserve object IDs for all fonts
    const fontObjectIds = new Map<PDFBaseFont, number>()
    this.fonts.forEach((fontIndex, fontName) => {
      fontObjectIds.set(fontName, currentObjectId++)
    })

    // Reserve object IDs for custom fonts (each needs 4 objects: Font, FontDescriptor, FontFile2, ToUnicode)
    const customFontObjectIds = new Map<string, { fontId: number; descriptorId: number; fileId: number; toUnicodeId: number }>()
    this.customFonts.forEach((fontIndex, fontName) => {
      customFontObjectIds.set(fontName, {
        fontId: currentObjectId++,
        descriptorId: currentObjectId++,
        fileId: currentObjectId++,
        toUnicodeId: currentObjectId++
      })
    })

    // Reserve object IDs for image XObjects
    const imageObjectIds = new Map<number, number>()
    this.imageManager.getAllImages().forEach((value, key) => {
      imageObjectIds.set(value.id, currentObjectId++)
    })

    // Reserve object IDs for gradients (each needs a Shading and a Pattern)
    const gradientShadingIds = new Map<string, number>()
    const gradientPatternIds = new Map<string, number>()
    this.gradientManager.getAllGradients().forEach((value, hash) => {
      gradientShadingIds.set(hash, currentObjectId++)
      gradientPatternIds.set(hash, currentObjectId++)
    })

    // Reserve object IDs for tiling patterns
    const tilingPatternIds = new Map<string, number>()
    this.patternManager.getAllPatterns().forEach((value, hash) => {
      tilingPatternIds.set(hash, currentObjectId++)
    })

    // Reserve object IDs for Form XObjects
    const formXObjectIds = new Map<string, number>()
    this.formXObjects.forEach((value, name) => {
      formXObjectIds.set(name, currentObjectId++)
    })

    // Reserve object IDs for Optional Content Groups (Layers)
    const layerObjectIds = new Map<string, number>()
    this.layerManager.getAllLayers().forEach((value, name) => {
      layerObjectIds.set(name, currentObjectId++)
    })

    // Reserve object IDs for OCProperties dictionary (if we have layers)
    let ocPropertiesId = 0
    if (this.layerManager.getLayerCount() > 0) {
      ocPropertiesId = currentObjectId++
    }

    // Reserve object IDs for annotations (one object per annotation)
    const annotationObjectIds = new Map<number, number[]>()
    this.pages.forEach((pageData, pageIndex) => {
      const annotIds: number[] = []
      pageData.annotations.forEach(() => {
        annotIds.push(currentObjectId++)
      })
      annotationObjectIds.set(pageIndex, annotIds)
    })

    // Reserve object IDs for advanced annotations (text, highlight, etc.)
    const advancedAnnotationIds: number[] = []
    this.annotationManager.getAllAnnotations().forEach(() => {
      advancedAnnotationIds.push(currentObjectId++)
    })

    // Reserve object IDs for form fields and signature fields
    let acroFormId: number | null = null
    const fieldObjectIds: number[] = []
    const signatureObjectIds: number[] = []

    if (this.formFields.length > 0 || this.signatureFields.length > 0) {
      acroFormId = currentObjectId++

      // Reserve an object ID for each form field (and widget annotation)
      this.formFields.forEach(() => {
        fieldObjectIds.push(currentObjectId++)
      })

      // Reserve an object ID for each signature field (and widget annotation)
      this.signatureFields.forEach(() => {
        signatureObjectIds.push(currentObjectId++)
      })
    }

    // Reserve object IDs for new annotations (text, highlight, etc.)
    const newAnnotationObjectIds: number[] = []
    this.annotationManager.getAllAnnotations().forEach(() => {
      newAnnotationObjectIds.push(currentObjectId++)
    })

    // Reserve object IDs for bookmarks/outlines
    let outlinesRootId: number | null = null
    const bookmarkObjectIds = new Map<BookmarkOptions, number>()

    if (this.bookmarks.length > 0) {
      outlinesRootId = currentObjectId++

      // Recursively count and reserve IDs for all bookmarks
      const reserveBookmarkIds = (bookmarks: BookmarkOptions[]) => {
        bookmarks.forEach(bookmark => {
          bookmarkObjectIds.set(bookmark, currentObjectId++)
          if (bookmark.children) {
            reserveBookmarkIds(bookmark.children)
          }
        })
      }

      reserveBookmarkIds(this.bookmarks)
    }

    // Reserve object IDs for file attachments
    let namesTreeId: number | null = null
    const attachmentFileSpecIds: number[] = []
    const attachmentEmbeddedFileIds: number[] = []
    const attachmentAnnotationIds: number[] = []

    // Document-level attachments
    if (this.attachments.length > 0) {
      namesTreeId = currentObjectId++  // Names dictionary
      this.attachments.forEach(() => {
        attachmentFileSpecIds.push(currentObjectId++)  // FileSpec
        attachmentEmbeddedFileIds.push(currentObjectId++)  // EmbeddedFile stream
      })
    }

    // Page-level file attachment annotations
    if (this.annotationManager.getAllAttachmentAnnotations().length > 0) {
      this.annotationManager.getAllAttachmentAnnotations().forEach(() => {
        attachmentAnnotationIds.push(currentObjectId++)  // Annotation
        attachmentFileSpecIds.push(currentObjectId++)  // FileSpec
        attachmentEmbeddedFileIds.push(currentObjectId++)  // EmbeddedFile stream
      })
    }

    // Reserve object IDs for ExtGState objects (blend modes and opacity)
    const extGStateObjectIds = new Map<string, number>()
    this.graphicsStateManager.getAllExtGStates().forEach((gsId, hash) => {
      extGStateObjectIds.set(hash, currentObjectId++)
    })

    // Reserve object IDs for XMP metadata and PDF/A compliance objects
    let metadataObjectId: number | null = null
    let outputIntentId: number | null = null

    // Enable XMP metadata if PDF/A is enabled OR if explicitly requested
    if (this.pdfAOptions || this.enableXMPMetadata) {
      metadataObjectId = currentObjectId++  // XMP Metadata stream
    }

    // OutputIntent is only for PDF/A
    if (this.pdfAOptions) {
      outputIntentId = currentObjectId++    // OutputIntent dictionary
    }

    // Create Info dictionary
    objects.push({
      id: infoObjectId,
      data: this.generateInfoDictionary()
    })

    // Create Catalog with Info reference and optional ViewerPreferences
    let catalogData = `<<\n  /Type /Catalog\n  /Pages ${pagesObjectId} 0 R`

    // Add AcroForm reference if form fields exist
    if (acroFormId) {
      catalogData += `\n  /AcroForm ${acroFormId} 0 R`
    }

    // Add Outlines reference if bookmarks exist
    if (outlinesRootId) {
      catalogData += `\n  /Outlines ${outlinesRootId} 0 R`
      catalogData += `\n  /PageMode /UseOutlines`  // Show bookmarks panel by default
    }

    // Add Names dictionary reference if attachments exist
    if (namesTreeId) {
      catalogData += `\n  /Names ${namesTreeId} 0 R`
    }

    // Add ViewerPreferences if displayTitle is true
    if (this.info.displayTitle) {
      catalogData += `\n  /ViewerPreferences <<\n    /DisplayDocTitle true\n  >>`
    }

    // Add PDF/A compliance references
    if (metadataObjectId) {
      catalogData += `\n  /Metadata ${metadataObjectId} 0 R`
    }

    if (outputIntentId) {
      catalogData += `\n  /OutputIntents [${outputIntentId} 0 R]`
    }

    // Add OCProperties if layers exist
    if (ocPropertiesId > 0) {
      catalogData += `\n  /OCProperties ${ocPropertiesId} 0 R`
    }

    catalogData += `\n>>`

    objects.push({
      id: catalogId,
      data: catalogData
    })

    // Create hyperlink objects (before pages, so they can be referenced in Annots)
    if (this.annotationManager.getAllLinks().length > 0) {
      const linkObjectIds: number[] = []
      this.annotationManager.getAllLinks().forEach(() => {
        linkObjectIds.push(currentObjectId++)
      })

      this.annotationManager.getAllLinks().forEach((link, index) => {
        const linkObjectId = linkObjectIds[index]
        const page = link.page !== undefined ? link.page : this.currentPageIndex
        const pageObjId = firstPageObjectId + (page * 3) + 2

        // Calculate rectangle (x, y, x+width, y+height)
        const rect = [link.x, link.y, link.x + link.width, link.y + link.height]

        // Border style
        const borderWidth = link.border?.width !== undefined ? link.border.width : 0
        const borderColor = link.border?.color || [0, 0, 1]
        const borderColorArray = Array.isArray(borderColor) ? borderColor : this.parseColor(borderColor)

        // Highlight mode
        const highlight = link.highlight || 'invert'
        const highlightMap = {
          'none': 'N',
          'invert': 'I',
          'outline': 'O',
          'push': 'P'
        }
        const H = highlightMap[highlight]

        let linkDict = `<<
  /Type /Annot
  /Subtype /Link
  /Rect [${rect.join(' ')}]
  /Border [0 0 ${borderWidth}]
  /C [${borderColorArray.join(' ')}]
  /H /${H}
  /P ${pageObjId} 0 R`

        if (link.type === 'url') {
          // External link (URL)
          const uri = this.escapePDFString(link.url)
          linkDict += `\n  /A <<\n    /S /URI\n    /URI (${uri})\n  >>`
        } else if (link.type === 'page') {
          // Internal link (page)
          const targetPageObjId = firstPageObjectId + (link.targetPage * 3) + 2
          const fit = link.fit || 'Fit'

          let dest = `[${targetPageObjId} 0 R /`
          switch (fit) {
            case 'Fit':
              dest += 'Fit]'
              break
            case 'FitH':
              dest += `FitH ${link.top !== undefined ? link.top : 'null'}]`
              break
            case 'FitV':
              dest += `FitV ${link.left !== undefined ? link.left : 'null'}]`
              break
            case 'XYZ':
              const x = link.left !== undefined ? link.left : 'null'
              const y = link.top !== undefined ? link.top : 'null'
              const zoom = link.zoom !== undefined ? link.zoom : 'null'
              dest += `XYZ ${x} ${y} ${zoom}]`
              break
            default:
              dest += 'Fit]'
          }

          linkDict += `\n  /Dest ${dest}`
        }

        linkDict += '\n>>'

        objects.push({
          id: linkObjectId,
          data: linkDict
        })

        // Add link to page's Annots array
        const pageData = this.pages[page]
        if (!pageData.linkAnnots) {
          pageData.linkAnnots = []
        }
        pageData.linkAnnots.push(linkObjectId)
      })
    }

    // Create content streams, resources, and page objects for each page
    this.pages.forEach((pageData, pageIndex) => {
      const content = pageData.content.join('\n')

      // Apply compression based on settings
      let contentStreamData: Buffer
      let filter = ''

      if (this.compressionOptions.compressStreams !== false) {
        // Compress with configured level (0-9)
        const level = this.compressionOptions.compressionLevel ?? 6
        try {
          const compressedContent = pako.deflate(content, { level })
          contentStreamData = Buffer.from(compressedContent)
          filter = '/Filter /FlateDecode\n  '
        } catch (error) {
          throw new CompressionError(
            `Failed to compress page ${pageIndex + 1} content stream: ${error instanceof Error ? error.message : 'Unknown error'}`,
            error instanceof Error ? error : undefined
          )
        }
      } else {
        // No compression
        contentStreamData = Buffer.from(content, 'binary')
      }

      const contentStreamId = firstPageObjectId + (pageIndex * 3)
      const resourcesId = contentStreamId + 1
      const pageObjectId = contentStreamId + 2

      pageObjectIds.push(pageObjectId)

      // Content Stream
      objects.push({
        id: contentStreamId,
        data: `<<\n  /Length ${contentStreamData.length}\n  ${filter}>>\nstream\n${contentStreamData.toString('binary')}\nendstream`
      })

      // Resources
      let resourcesData = `<<\n  /Font <<`

      // Add all registered base fonts
      this.fonts.forEach((fontIndex, fontName) => {
        const fontObjId = fontObjectIds.get(fontName)!
        resourcesData += `\n    /F${fontIndex} ${fontObjId} 0 R`
      })

      // Add all registered custom fonts
      this.customFonts.forEach((fontIndex, fontName) => {
        const fontIds = customFontObjectIds.get(fontName)!
        resourcesData += `\n    /F${fontIndex} ${fontIds.fontId} 0 R`
      })

      resourcesData += `\n  >>`

      // Add XObject dictionary if there are images
      if (this.imageManager.getImageCount() > 0) {
        resourcesData += `\n  /XObject <<`
        this.imageManager.getAllImages().forEach((value, key) => {
          const imageObjectId = imageObjectIds.get(value.id)!
          resourcesData += `\n    /Im${value.id} ${imageObjectId} 0 R`
        })
        resourcesData += `\n  >>`
      }

      // Add Pattern dictionary if there are gradients or tiling patterns
      if (this.gradientManager.getGradientCount() > 0 || this.patternManager.getPatternCount() > 0) {
        resourcesData += `\n  /Pattern <<`
        // Add gradient patterns
        this.gradientManager.getAllGradients().forEach((value, hash) => {
          const patternObjectId = gradientPatternIds.get(hash)!
          resourcesData += `\n    /P${value.id} ${patternObjectId} 0 R`
        })
        // Add tiling patterns
        this.patternManager.getAllPatterns().forEach((value, hash) => {
          const patternObjectId = tilingPatternIds.get(hash)!
          resourcesData += `\n    /Pat${value.id} ${patternObjectId} 0 R`
        })
        resourcesData += `\n  >>`
      }

      // Add ExtGState dictionary if there are blend modes or opacity
      if (this.graphicsStateManager.getExtGStateCount() > 0) {
        resourcesData += `\n  /ExtGState <<`
        this.graphicsStateManager.getAllExtGStates().forEach((gsId, hash) => {
          const gsObjectId = extGStateObjectIds.get(hash)!
          resourcesData += `\n    /GS${gsId} ${gsObjectId} 0 R`
        })
        resourcesData += `\n  >>`
      }

      // Add XObject dictionary if there are Form XObjects
      if (this.formXObjects.size > 0) {
        resourcesData += `\n  /XObject <<`
        this.formXObjects.forEach((value, name) => {
          const xobjectId = formXObjectIds.get(name)!
          resourcesData += `\n    /${name} ${xobjectId} 0 R`
        })
        resourcesData += `\n  >>`
      }

      // Add Properties dictionary for Optional Content Groups (Layers)
      if (this.layerManager.getLayerCount() > 0) {
        resourcesData += `\n  /Properties <<`
        this.layerManager.getAllLayers().forEach((value, name) => {
          const layerId = layerObjectIds.get(name)!
          resourcesData += `\n    /OC${value.id} ${layerId} 0 R`
        })
        resourcesData += `\n  >>`
      }

      resourcesData += `\n>>`

      objects.push({
        id: resourcesId,
        data: resourcesData
      })

      // Page object
      let pageDict = `<<\n  /Type /Page\n  /Parent ${pagesObjectId} 0 R\n  /MediaBox [0 0 ${pageData.width} ${pageData.height}]\n  /Contents ${contentStreamId} 0 R\n  /Resources ${resourcesId} 0 R`

      // Add rotation if set
      if (pageData.rotation && pageData.rotation !== 0) {
        pageDict += `\n  /Rotate ${pageData.rotation}`
      }

      // Add annotations if any (links)
      const annotIds = annotationObjectIds.get(pageIndex) || []

      // Add form field widgets for this page
      const pageFormFieldIds: number[] = []
      this.formFields.forEach((field, index) => {
        if (field.page === pageIndex) {
          pageFormFieldIds.push(fieldObjectIds[index])
        }
      })

      // Add signature field widgets for this page
      const pageSignatureFieldIds: number[] = []
      this.signatureFields.forEach((field, index) => {
        if (field.page === pageIndex) {
          pageSignatureFieldIds.push(signatureObjectIds[index])
        }
      })

      // Add new annotations for this page
      const pageNewAnnotationIds: number[] = []
      this.annotationManager.getAllAnnotations().forEach((annot, index) => {
        if (annot.page === pageIndex) {
          pageNewAnnotationIds.push(newAnnotationObjectIds[index])
        }
      })

      // Add hyperlinks for this page
      const pageLinkAnnotIds = pageData.linkAnnots || []

      // Combine all annotations (links + form fields + signature fields + new annotations + hyperlinks)
      const allAnnotIds = [...annotIds, ...pageFormFieldIds, ...pageSignatureFieldIds, ...pageNewAnnotationIds, ...pageLinkAnnotIds]
      if (allAnnotIds.length > 0) {
        const annotsArray = allAnnotIds.map(id => `${id} 0 R`).join(' ')
        pageDict += `\n  /Annots [${annotsArray}]`
      }

      pageDict += `\n>>`

      objects.push({
        id: pageObjectId,
        data: pageDict
      })
    })

    // Font objects (shared by all pages) with configurable encoding
    this.fonts.forEach((fontIndex, fontName) => {
      const fontObjId = fontObjectIds.get(fontName)!
      objects.push({
        id: fontObjId,
        data: `<<\n  /Type /Font\n  /Subtype /Type1\n  /BaseFont /${fontName}\n  /Encoding /${this.encoding}\n>>`
      })
    })

    // Custom TrueType/OpenType font objects
    this.customFonts.forEach((fontIndex, fontName) => {
      const fontInfo = this.fontManager.getFont(fontName)
      if (!fontInfo) return

      const fontIds = customFontObjectIds.get(fontName)!

      // 1. FontFile2 stream (embedded font data, compressed)
      const fontFileStream = this.fontManager.generateFontFileStream(fontInfo)
      objects.push({
        id: fontIds.fileId,
        data: `<<\n  /Length ${fontFileStream.length}\n  /Length1 ${fontFileStream.length1}\n  /Filter /FlateDecode\n>>\nstream\n${fontFileStream.data.toString('binary')}\nendstream`
      })

      // 2. FontDescriptor
      const fontDescriptor = this.fontManager.generateFontDescriptor(fontInfo, fontIds.fileId)
      objects.push({
        id: fontIds.descriptorId,
        data: fontDescriptor
      })

      // 3. ToUnicode CMap (for better text selection and copy-paste)
      const toUnicodeCMap = this.fontManager.generateToUnicodeCMap(fontInfo)
      objects.push({
        id: fontIds.toUnicodeId,
        data: `<<\n  /Length ${toUnicodeCMap.length}\n>>\nstream\n${toUnicodeCMap}\nendstream`
      })

      // 4. Font Dictionary (with ToUnicode reference)
      const fontDictionary = this.fontManager.generateFontDictionary(fontInfo, fontIds.descriptorId)
      // Add ToUnicode reference to font dictionary
      const fontDictWithToUnicode = fontDictionary.replace(
        /\/Encoding \/WinAnsiEncoding\n>>/,
        `/Encoding /WinAnsiEncoding\n  /ToUnicode ${fontIds.toUnicodeId} 0 R\n>>`
      )
      objects.push({
        id: fontIds.fontId,
        data: fontDictWithToUnicode
      })
    })

    // ExtGState objects (blend modes and opacity)
    this.graphicsStateManager.getAllExtGStates().forEach((gsId, hash) => {
      const gsObjectId = extGStateObjectIds.get(hash)!

      // Parse hash to extract blend mode and opacity
      // Hash format: "BM:BlendMode|OP:0.500"
      const parts = hash.split('|')
      const blendMode = parts[0].split(':')[1]
      const opacity = parseFloat(parts[1].split(':')[1])

      // Create ExtGState dictionary
      let gsDict = `<<\n  /Type /ExtGState`

      // Add blend mode if not Normal
      if (blendMode !== 'Normal') {
        gsDict += `\n  /BM /${blendMode}`
      }

      // Add opacity (both fill and stroke)
      if (opacity !== 1.0) {
        gsDict += `\n  /ca ${opacity.toFixed(3)}`  // Stroke/fill opacity for non-stroke operations
        gsDict += `\n  /CA ${opacity.toFixed(3)}`  // Stroke opacity
      }

      gsDict += `\n>>`

      objects.push({
        id: gsObjectId,
        data: gsDict
      })
    })

    // Pages object
    const kidsArray = pageObjectIds.map(id => `${id} 0 R`).join(' ')
    objects.push({
      id: pagesObjectId,
      data: `<<\n  /Type /Pages\n  /Kids [${kidsArray}]\n  /Count ${this.pages.length}\n>>`
    })

    // Create image XObjects
    this.imageManager.getAllImages().forEach((value, key) => {
      const imageObjectId = imageObjectIds.get(value.id)!
      const img = value.info

      // Handle mask image if present (create separate object for mask)
      let maskObjectId: number | null = null
      if (img.maskInfo) {
        maskObjectId = currentObjectId++
        const maskImg = img.maskInfo
        const maskType = img.maskOptions?.type || 'luminosity'
        const inverted = img.maskOptions?.inverted || false

        // Build mask image XObject
        let maskDict = `<<
  /Type /XObject
  /Subtype /Image
  /Width ${maskImg.width}
  /Height ${maskImg.height}
  /ColorSpace /DeviceGray
  /BitsPerComponent ${maskImg.bitsPerComponent}`

        if (maskType === 'stencil') {
          // Stencil mask (ImageMask = true)
          maskDict += `\n  /ImageMask true`
          if (inverted) {
            maskDict += `\n  /Decode [1 0]`
          } else {
            maskDict += `\n  /Decode [0 1]`
          }
        } else {
          // Luminosity mask
          if (inverted) {
            maskDict += `\n  /Decode [1 0]`
          }
        }

        // Add filter if present
        if (maskImg.filter) {
          maskDict += `\n  /Filter /${maskImg.filter}`
        }

        maskDict += `\n  /Length ${maskImg.data.length}`
        maskDict += `\n>>`
        maskDict += `\nstream\n${maskImg.data.toString('binary')}\nendstream`

        objects.push({
          id: maskObjectId,
          data: maskDict
        })
      }

      // Build the image XObject
      let imageDict = `<<
  /Type /XObject
  /Subtype /Image
  /Width ${img.width}
  /Height ${img.height}
  /ColorSpace /${img.colorSpace}
  /BitsPerComponent ${img.bitsPerComponent}`

      // Add filter if present
      if (img.filter) {
        imageDict += `\n  /Filter /${img.filter}`
      }

      // Add mask reference if present
      if (maskObjectId !== null) {
        const maskType = img.maskOptions?.type || 'luminosity'
        if (maskType === 'stencil') {
          imageDict += `\n  /Mask ${maskObjectId} 0 R`
        } else {
          imageDict += `\n  /SMask ${maskObjectId} 0 R`
        }
      }

      // Add interpolation (anti-aliasing for scaling)
      // For QR codes and binary images, interpolation should be false to prevent blurriness
      const shouldInterpolate = img.interpolate !== false // Default to true if not specified
      imageDict += `\n  /Interpolate ${shouldInterpolate}`

      // Add data length
      imageDict += `\n  /Length ${img.data.length}`
      imageDict += `\n>>`

      // Add stream data
      imageDict += `\nstream\n${img.data.toString('binary')}\nendstream`

      objects.push({
        id: imageObjectId,
        data: imageDict
      })
    })

    // Create gradient shading and pattern objects
    this.gradientManager.getAllGradients().forEach((value, hash) => {
      const { id, gradient } = value
      const shadingId = gradientShadingIds.get(hash)!
      const patternId = gradientPatternIds.get(hash)!

      // Determine if linear or radial
      const isLinear = 'x1' in gradient && !('r0' in gradient)

      if (isLinear) {
        // Linear (Axial) Gradient - Type 2
        const g = gradient as LinearGradientOptions

        // Build color function for gradient stops
        // For simplicity, we'll use exponential interpolation for 2 stops
        // For more stops, we'd need stitching functions
        const stops = g.colorStops

        if (stops.length === 2) {
          // Simple 2-color gradient
          const [r0, g0, b0] = this.parseColor(stops[0].color)
          const [r1, g1, b1] = this.parseColor(stops[1].color)

          // Shading dictionary (Type 2 - Axial)
          const shadingDict = `<<
  /ShadingType 2
  /ColorSpace /DeviceRGB
  /Coords [${g.x0} ${g.y0} ${g.x1} ${g.y1}]
  /Function <<
    /FunctionType 2
    /Domain [0 1]
    /C0 [${r0.toFixed(4)} ${g0.toFixed(4)} ${b0.toFixed(4)}]
    /C1 [${r1.toFixed(4)} ${g1.toFixed(4)} ${b1.toFixed(4)}]
    /N 1
  >>
  /Extend [true true]
>>`

          objects.push({
            id: shadingId,
            data: shadingDict
          })
        } else {
          // Multiple color stops - use stitching function
          const functions: string[] = []
          const bounds: number[] = []
          const encode: number[] = []

          for (let i = 0; i < stops.length - 1; i++) {
            const [r0, g0, b0] = this.parseColor(stops[i].color)
            const [r1, g1, b1] = this.parseColor(stops[i + 1].color)

            functions.push(`<<
      /FunctionType 2
      /Domain [0 1]
      /C0 [${r0.toFixed(4)} ${g0.toFixed(4)} ${b0.toFixed(4)}]
      /C1 [${r1.toFixed(4)} ${g1.toFixed(4)} ${b1.toFixed(4)}]
      /N 1
    >>`)

            if (i < stops.length - 2) {
              bounds.push(stops[i + 1].offset)
            }
            encode.push(0, 1)
          }

          const shadingDict = `<<
  /ShadingType 2
  /ColorSpace /DeviceRGB
  /Coords [${g.x0} ${g.y0} ${g.x1} ${g.y1}]
  /Function <<
    /FunctionType 3
    /Domain [0 1]
    /Functions [
${functions.join('\n')}
    ]
    /Bounds [${bounds.join(' ')}]
    /Encode [${encode.join(' ')}]
  >>
  /Extend [true true]
>>`

          objects.push({
            id: shadingId,
            data: shadingDict
          })
        }
      } else {
        // Radial Gradient - Type 3
        const g = gradient as RadialGradientOptions
        const stops = g.colorStops

        if (stops.length === 2) {
          // Simple 2-color gradient
          const [r0, g0, b0] = this.parseColor(stops[0].color)
          const [r1, g1, b1] = this.parseColor(stops[1].color)

          const shadingDict = `<<
  /ShadingType 3
  /ColorSpace /DeviceRGB
  /Coords [${g.x0} ${g.y0} ${g.r0} ${g.x1} ${g.y1} ${g.r1}]
  /Function <<
    /FunctionType 2
    /Domain [0 1]
    /C0 [${r0.toFixed(4)} ${g0.toFixed(4)} ${b0.toFixed(4)}]
    /C1 [${r1.toFixed(4)} ${g1.toFixed(4)} ${b1.toFixed(4)}]
    /N 1
  >>
  /Extend [true true]
>>`

          objects.push({
            id: shadingId,
            data: shadingDict
          })
        } else {
          // Multiple color stops
          const functions: string[] = []
          const bounds: number[] = []
          const encode: number[] = []

          for (let i = 0; i < stops.length - 1; i++) {
            const [r0, g0, b0] = this.parseColor(stops[i].color)
            const [r1, g1, b1] = this.parseColor(stops[i + 1].color)

            functions.push(`<<
      /FunctionType 2
      /Domain [0 1]
      /C0 [${r0.toFixed(4)} ${g0.toFixed(4)} ${b0.toFixed(4)}]
      /C1 [${r1.toFixed(4)} ${g1.toFixed(4)} ${b1.toFixed(4)}]
      /N 1
    >>`)

            if (i < stops.length - 2) {
              bounds.push(stops[i + 1].offset)
            }
            encode.push(0, 1)
          }

          const shadingDict = `<<
  /ShadingType 3
  /ColorSpace /DeviceRGB
  /Coords [${g.x0} ${g.y0} ${g.r0} ${g.x1} ${g.y1} ${g.r1}]
  /Function <<
    /FunctionType 3
    /Domain [0 1]
    /Functions [
${functions.join('\n')}
    ]
    /Bounds [${bounds.join(' ')}]
    /Encode [${encode.join(' ')}]
  >>
  /Extend [true true]
>>`

          objects.push({
            id: shadingId,
            data: shadingDict
          })
        }
      }

      // Create Pattern dictionary (Type 2 - Shading pattern)
      const patternDict = `<<
  /Type /Pattern
  /PatternType 2
  /Shading ${shadingId} 0 R
>>`

      objects.push({
        id: patternId,
        data: patternDict
      })
    })

    // Create tiling pattern objects (Type 1 - Tiling pattern)
    this.patternManager.getAllPatterns().forEach((value, hash) => {
      const { id, pattern } = value
      const patternObjectId = tilingPatternIds.get(hash)!

      const xStep = pattern.xStep || pattern.width
      const yStep = pattern.yStep || pattern.height
      const colored = pattern.colored !== false  // Default to true

      // Create a temporary content stream for the pattern
      const patternContent: string[] = []
      const patternCtx = {
        moveTo: (x: number, y: number) => {
          patternContent.push(`${x} ${y} m`)
        },
        lineTo: (x: number, y: number) => {
          patternContent.push(`${x} ${y} l`)
        },
        rect: (x: number, y: number, width: number, height: number) => {
          patternContent.push(`${x} ${y} ${width} ${height} re`)
        },
        circle: (x: number, y: number, radius: number) => {
          // Draw circle using four Bezier curves
          const k = 0.5522848
          const ox = radius * k
          const oy = radius * k

          patternContent.push(`${x + radius} ${y} m`)
          patternContent.push(`${x + radius} ${y + oy} ${x + ox} ${y + radius} ${x} ${y + radius} c`)
          patternContent.push(`${x - ox} ${y + radius} ${x - radius} ${y + oy} ${x - radius} ${y} c`)
          patternContent.push(`${x - radius} ${y - oy} ${x - ox} ${y - radius} ${x} ${y - radius} c`)
          patternContent.push(`${x + ox} ${y - radius} ${x + radius} ${y - oy} ${x + radius} ${y} c`)
        },
        setFillColor: (r: number, g: number, b: number) => {
          patternContent.push(`${r} ${g} ${b} rg`)
        },
        setStrokeColor: (r: number, g: number, b: number) => {
          patternContent.push(`${r} ${g} ${b} RG`)
        },
        setLineWidth: (width: number) => {
          patternContent.push(`${width} w`)
        },
        fill: () => {
          patternContent.push('f')
        },
        stroke: () => {
          patternContent.push('S')
        },
        fillAndStroke: () => {
          patternContent.push('B')
        }
      }

      // Execute the draw function
      pattern.draw(patternCtx)

      const contentStream = patternContent.join('\n')
      const contentLength = contentStream.length

      // Create the pattern dictionary
      const patternDict = `<<
  /Type /Pattern
  /PatternType 1
  /PaintType ${colored ? '1' : '2'}
  /TilingType 1
  /BBox [0 0 ${pattern.width} ${pattern.height}]
  /XStep ${xStep}
  /YStep ${yStep}
  /Resources <<
    /ProcSet [/PDF]
  >>
  /Length ${contentLength}
>>
stream
${contentStream}
endstream`

      objects.push({
        id: patternObjectId,
        data: patternDict
      })
    })

    // Create Form XObject objects (Type 1 XObject - Form)
    this.formXObjects.forEach((value, name) => {
      const { id, xobject } = value
      const xobjectId = formXObjectIds.get(name)!

      // Create a temporary content stream for the Form XObject
      const xobjectContent: string[] = []
      const xobjectCtx = {
        // Path construction
        moveTo: (x: number, y: number) => {
          xobjectContent.push(`${x} ${y} m`)
        },
        lineTo: (x: number, y: number) => {
          xobjectContent.push(`${x} ${y} l`)
        },
        bezierCurveTo: (cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) => {
          xobjectContent.push(`${cp1x} ${cp1y} ${cp2x} ${cp2y} ${x} ${y} c`)
        },
        quadraticCurveTo: (cpx: number, cpy: number, x: number, y: number) => {
          // Convert quadratic to cubic Bezier
          // Q(t) = P0(1-t)² + P1·2(1-t)t + P2·t²
          // C(t) = P0(1-t)³ + CP1·3(1-t)²t + CP2·3(1-t)t² + P2·t³
          // CP1 = P0 + 2/3(P1 - P0)
          // CP2 = P2 + 2/3(P1 - P2)
          // We need to get the current point - for simplicity, we'll use the v operator
          xobjectContent.push(`${cpx} ${cpy} ${x} ${y} v`)
        },
        rect: (x: number, y: number, width: number, height: number) => {
          xobjectContent.push(`${x} ${y} ${width} ${height} re`)
        },
        circle: (x: number, y: number, radius: number) => {
          // Draw circle using four Bezier curves
          const k = 0.5522848
          const ox = radius * k
          const oy = radius * k

          xobjectContent.push(`${x + radius} ${y} m`)
          xobjectContent.push(`${x + radius} ${y + oy} ${x + ox} ${y + radius} ${x} ${y + radius} c`)
          xobjectContent.push(`${x - ox} ${y + radius} ${x - radius} ${y + oy} ${x - radius} ${y} c`)
          xobjectContent.push(`${x - radius} ${y - oy} ${x - ox} ${y - radius} ${x} ${y - radius} c`)
          xobjectContent.push(`${x + ox} ${y - radius} ${x + radius} ${y - oy} ${x + radius} ${y} c`)
        },
        ellipse: (x: number, y: number, radiusX: number, radiusY: number) => {
          // Draw ellipse using four Bezier curves
          const k = 0.5522848
          const ox = radiusX * k
          const oy = radiusY * k

          xobjectContent.push(`${x + radiusX} ${y} m`)
          xobjectContent.push(`${x + radiusX} ${y + oy} ${x + ox} ${y + radiusY} ${x} ${y + radiusY} c`)
          xobjectContent.push(`${x - ox} ${y + radiusY} ${x - radiusX} ${y + oy} ${x - radiusX} ${y} c`)
          xobjectContent.push(`${x - radiusX} ${y - oy} ${x - ox} ${y - radiusY} ${x} ${y - radiusY} c`)
          xobjectContent.push(`${x + ox} ${y - radiusY} ${x + radiusX} ${y - oy} ${x + radiusX} ${y} c`)
        },
        path: (svgPath: string) => {
          // Parse and convert SVG path
          const converter = new SVGPathConverter()
          converter.convert(svgPath, {
            moveTo: (x, y) => xobjectContent.push(`${x} ${y} m`),
            lineTo: (x, y) => xobjectContent.push(`${x} ${y} l`),
            bezierCurveTo: (cp1x, cp1y, cp2x, cp2y, x, y) => xobjectContent.push(`${cp1x} ${cp1y} ${cp2x} ${cp2y} ${x} ${y} c`),
            quadraticCurveTo: (cpx, cpy, x, y) => xobjectContent.push(`${cpx} ${cpy} ${x} ${y} v`),
            closePath: () => xobjectContent.push('h')
          })
        },

        // Path operations
        closePath: () => {
          xobjectContent.push('h')
        },
        fill: () => {
          xobjectContent.push('f')
        },
        stroke: () => {
          xobjectContent.push('S')
        },
        fillAndStroke: () => {
          xobjectContent.push('B')
        },
        clip: () => {
          xobjectContent.push('W n')
        },

        // Colors
        setFillColor: (r: number, g: number, b: number) => {
          xobjectContent.push(`${r} ${g} ${b} rg`)
        },
        setStrokeColor: (r: number, g: number, b: number) => {
          xobjectContent.push(`${r} ${g} ${b} RG`)
        },

        // Graphics state
        setLineWidth: (width: number) => {
          xobjectContent.push(`${width} w`)
        },
        setLineCap: (cap: 0 | 1 | 2) => {
          xobjectContent.push(`${cap} J`)
        },
        setLineJoin: (join: 0 | 1 | 2) => {
          xobjectContent.push(`${join} j`)
        },
        setDashPattern: (pattern: number[], phase: number = 0) => {
          xobjectContent.push(`[${pattern.join(' ')}] ${phase} d`)
        },
        setOpacity: (opacity: number) => {
          xobjectContent.push(`/GS_alpha gs`)
          xobjectContent.push(`${opacity} ca`)
          xobjectContent.push(`${opacity} CA`)
        },

        // Text (simplified version)
        // Note: Uses Helvetica font which must be available in the page resources
        text: (text: string, x: number, y: number, fontSize: number = 12) => {
          const escapedText = this.escapePDFString(text)
          // Ensure Helvetica is registered
          const fontId = this.getFontId('Helvetica')
          xobjectContent.push('BT')
          xobjectContent.push(`/${fontId} ${fontSize} Tf`)
          xobjectContent.push(`${x} ${y} Td`)
          xobjectContent.push(`(${escapedText}) Tj`)
          xobjectContent.push('ET')
        },

        // Transformations
        translate: (x: number, y: number) => {
          xobjectContent.push(`1 0 0 1 ${x} ${y} cm`)
        },
        rotate: (angle: number) => {
          const rad = (angle * Math.PI) / 180
          const cos = Math.cos(rad)
          const sin = Math.sin(rad)
          xobjectContent.push(`${cos} ${sin} ${-sin} ${cos} 0 0 cm`)
        },
        scale: (sx: number, sy?: number) => {
          const scaleY = sy !== undefined ? sy : sx
          xobjectContent.push(`${sx} 0 0 ${scaleY} 0 0 cm`)
        },

        // State
        saveGraphicsState: () => {
          xobjectContent.push('q')
        },
        restoreGraphicsState: () => {
          xobjectContent.push('Q')
        }
      }

      // Execute the draw function
      xobject.draw(xobjectCtx)

      const contentStream = xobjectContent.join('\n')
      const contentLength = contentStream.length

      // Create the Form XObject dictionary
      // Note: We use a minimal Resources dictionary. Fonts and other resources
      // will be inherited from the page's Resources dictionary when the XObject is used.
      const xobjectDict = `<<
  /Type /XObject
  /Subtype /Form
  /BBox [0 0 ${xobject.width} ${xobject.height}]
  /Resources <<
    /ProcSet [/PDF /Text /ImageB /ImageC /ImageI]
  >>
  /Length ${contentLength}
>>
stream
${contentStream}
endstream`

      objects.push({
        id: xobjectId,
        data: xobjectDict
      })
    })

    // Create Optional Content Group (OCG/Layer) objects
    this.layerManager.getAllLayers().forEach((value, name) => {
      const { id, options } = value
      const layerId = layerObjectIds.get(name)!

      // Build intent array
      let intentStr = '/View'
      if (options.intent) {
        if (Array.isArray(options.intent)) {
          intentStr = `[${options.intent.map(i => `/${i}`).join(' ')}]`
        } else {
          intentStr = `/${options.intent}`
        }
      }

      // Build OCG dictionary
      const ocgDict = `<<
  /Type /OCG
  /Name (${this.escapePDFString(options.name)})
  /Intent ${intentStr}
>>`

      objects.push({
        id: layerId,
        data: ocgDict
      })
    })

    // Create OCProperties dictionary (if we have layers)
    if (this.layerManager.getLayerCount() > 0 && ocPropertiesId > 0) {
      // Build arrays of OCGs
      const ocgsRefs: string[] = []
      const onOCGs: string[] = []
      const offOCGs: string[] = []

      this.layerManager.getAllLayers().forEach((value, name) => {
        const layerId = layerObjectIds.get(name)!
        ocgsRefs.push(`${layerId} 0 R`)

        const visible = value.options.visible !== false  // Default to true
        if (visible) {
          onOCGs.push(`${layerId} 0 R`)
        } else {
          offOCGs.push(`${layerId} 0 R`)
        }
      })

      // Build usage dictionary arrays
      const printOCGs: string[] = []
      const exportOCGs: string[] = []

      this.layerManager.getAllLayers().forEach((value, name) => {
        const layerId = layerObjectIds.get(name)!
        const printable = value.options.printable !== undefined ? value.options.printable : (value.options.visible !== false)
        const exportable = value.options.exportable !== false

        if (printable) {
          printOCGs.push(`${layerId} 0 R`)
        }
        if (exportable) {
          exportOCGs.push(`${layerId} 0 R`)
        }
      })

      const ocPropertiesDict = `<<
  /OCGs [${ocgsRefs.join(' ')}]
  /D <<
    /Name (Default)
    /BaseState /ON
    /ON [${onOCGs.join(' ')}]
    ${offOCGs.length > 0 ? `/OFF [${offOCGs.join(' ')}]` : ''}
    /Order [${ocgsRefs.join(' ')}]
  >>
>>`

      objects.push({
        id: ocPropertiesId,
        data: ocPropertiesDict
      })
    }

    // Create link annotation objects
    this.pages.forEach((pageData, pageIndex) => {
      const annotIds = annotationObjectIds.get(pageIndex) || []
      pageData.annotations.forEach((annot, annotIndex) => {
        const annotObjectId = annotIds[annotIndex]

        // Create link annotation
        // Note: PDF coordinates are bottom-left origin
        const rect = [
          annot.x,
          annot.y,
          annot.x + annot.width,
          annot.y + annot.height
        ]

        const annotDict = `<<
  /Type /Annot
  /Subtype /Link
  /Rect [${rect.join(' ')}]
  /Border [0 0 0]
  /A <<
    /S /URI
    /URI (${this.escapePDFString(annot.url)})
  >>
>>`

        objects.push({
          id: annotObjectId,
          data: annotDict
        })
      })
    })

    // Create new annotation objects (text, highlight, etc.)
    this.annotationManager.getAllAnnotations().forEach((annot, index) => {
      const annotObjectId = newAnnotationObjectIds[index]
      const pageObjId = firstPageObjectId + (annot.page * 3) + 2

      // Common properties
      const now = annot.creationDate || new Date()
      const modDate = annot.modificationDate || now
      const author = annot.author ? this.escapePDFString(annot.author) : this.escapePDFString(getConfig().defaultAnnotationAuthor)
      const contents = annot.contents ? this.escapePDFString(annot.contents) : ''
      const subject = annot.subject ? this.escapePDFString(annot.subject) : ''

      // Parse color
      const color = annot.color || [1, 1, 0]  // Default yellow
      const colorArray = Array.isArray(color) ? color : this.parseColor(color)

      let annotDict = ''

      switch (annot.type) {
        case 'text': {
          // Text annotation (sticky note)
          const icon = annot.icon || 'Note'
          const open = annot.open ? 'true' : 'false'
          const rect = [annot.x, annot.y, annot.x + 20, annot.y + 20]  // Standard icon size

          annotDict = `<<
  /Type /Annot
  /Subtype /Text
  /Rect [${rect.join(' ')}]
  /Contents (${contents})
  /P ${pageObjId} 0 R
  /Name /${icon}
  /Open ${open}
  /C [${colorArray.join(' ')}]
  /T (${author})
  /Subj (${subject})
  /CreationDate (${this.formatPDFDate(now)})
  /M (${this.formatPDFDate(modDate)})
>>`
          break
        }

        case 'highlight':
        case 'underline':
        case 'strikeout': {
          // Text markup annotations
          const subtypeMap = {
            'highlight': 'Highlight',
            'underline': 'Underline',
            'strikeout': 'StrikeOut'
          }
          const subtype = subtypeMap[annot.type]

          // QuadPoints define the highlighted area
          const quadPoints = annot.quadPoints.join(' ')

          // Calculate bounding rect from quadPoints
          const xs = annot.quadPoints.filter((_, i) => i % 2 === 0)
          const ys = annot.quadPoints.filter((_, i) => i % 2 === 1)
          const minX = Math.min(...xs)
          const minY = Math.min(...ys)
          const maxX = Math.max(...xs)
          const maxY = Math.max(...ys)
          const rect = [minX, minY, maxX, maxY]

          annotDict = `<<
  /Type /Annot
  /Subtype /${subtype}
  /Rect [${rect.join(' ')}]
  /QuadPoints [${quadPoints}]
  /Contents (${contents})
  /P ${pageObjId} 0 R
  /C [${colorArray.join(' ')}]
  /T (${author})
  /Subj (${subject})
  /CreationDate (${this.formatPDFDate(now)})
  /M (${this.formatPDFDate(modDate)})
>>`
          break
        }

        case 'square':
        case 'circle': {
          // Shape annotations
          const subtype = annot.type === 'square' ? 'Square' : 'Circle'
          const borderWidth = annot.borderWidth || 1
          const rect = annot.type === 'square'
            ? [annot.x, annot.y, annot.x + annot.width, annot.y + annot.height]
            : [annot.x - annot.width/2, annot.y - annot.height/2, annot.x + annot.width/2, annot.y + annot.height/2]

          annotDict = `<<
  /Type /Annot
  /Subtype /${subtype}
  /Rect [${rect.join(' ')}]
  /Contents (${contents})
  /P ${pageObjId} 0 R
  /C [${colorArray.join(' ')}]
  /BS << /W ${borderWidth} /S /S >>
  /T (${author})
  /Subj (${subject})
  /CreationDate (${this.formatPDFDate(now)})
  /M (${this.formatPDFDate(modDate)})`

          if (annot.fillColor) {
            const fillColorArray = Array.isArray(annot.fillColor) ? annot.fillColor : this.parseColor(annot.fillColor)
            annotDict += `\n  /IC [${fillColorArray.join(' ')}]`
          }

          annotDict += `\n>>`
          break
        }

        case 'freetext': {
          // Free text annotation
          const fontSize = annot.fontSize || 12
          const align = annot.align || 'left'
          const borderWidth = annot.borderWidth || 1
          const rect = [annot.x, annot.y, annot.x + annot.width, annot.y + annot.height]

          const fontColor = annot.fontColor || [0, 0, 0]
          const fontColorArray = Array.isArray(fontColor) ? fontColor : this.parseColor(fontColor)

          // Quadding: 0 = left, 1 = center, 2 = right
          const quadding = align === 'center' ? 1 : (align === 'right' ? 2 : 0)

          annotDict = `<<
  /Type /Annot
  /Subtype /FreeText
  /Rect [${rect.join(' ')}]
  /Contents (${contents})
  /P ${pageObjId} 0 R
  /DA (/Helvetica ${fontSize} Tf ${fontColorArray.join(' ')} rg)
  /Q ${quadding}
  /BS << /W ${borderWidth} /S /S >>`

          if (annot.backgroundColor) {
            const bgColorArray = Array.isArray(annot.backgroundColor) ? annot.backgroundColor : this.parseColor(annot.backgroundColor)
            annotDict += `\n  /C [${bgColorArray.join(' ')}]`
          }

          annotDict += `
  /T (${author})
  /Subj (${subject})
  /CreationDate (${this.formatPDFDate(now)})
  /M (${this.formatPDFDate(modDate)})
>>`
          break
        }

        case 'stamp': {
          // Stamp annotation
          const rect = [annot.x, annot.y, annot.x + annot.width, annot.y + annot.height]
          const rotation = annot.rotation || 0

          annotDict = `<<
  /Type /Annot
  /Subtype /Stamp
  /Rect [${rect.join(' ')}]
  /Contents (${contents})
  /P ${pageObjId} 0 R
  /Name /${annot.stampType}
  /C [${colorArray.join(' ')}]
  /T (${author})
  /Subj (${subject})
  /CreationDate (${this.formatPDFDate(now)})
  /M (${this.formatPDFDate(modDate)})`

          if (rotation !== 0) {
            annotDict += `\n  /Rotate ${rotation}`
          }

          annotDict += `\n>>`
          break
        }

        case 'ink': {
          // Ink annotation (freehand drawing)
          const borderWidth = annot.borderWidth || 1

          // InkList is array of strokes, each stroke is array of points
          const inkListStr = annot.inkLists.map(stroke => {
            const points = stroke.flat().join(' ')
            return `[${points}]`
          }).join(' ')

          // Calculate bounding rect
          const allPoints = annot.inkLists.flat()
          const xs = allPoints.map(p => p[0])
          const ys = allPoints.map(p => p[1])
          const minX = Math.min(...xs)
          const minY = Math.min(...ys)
          const maxX = Math.max(...xs)
          const maxY = Math.max(...ys)
          const rect = [minX, minY, maxX, maxY]

          annotDict = `<<
  /Type /Annot
  /Subtype /Ink
  /Rect [${rect.join(' ')}]
  /InkList [${inkListStr}]
  /Contents (${contents})
  /P ${pageObjId} 0 R
  /C [${colorArray.join(' ')}]
  /BS << /W ${borderWidth} /S /S >>
  /T (${author})
  /Subj (${subject})
  /CreationDate (${this.formatPDFDate(now)})
  /M (${this.formatPDFDate(modDate)})
>>`
          break
        }
      }

      if (annotDict) {
        objects.push({
          id: annotObjectId,
          data: annotDict
        })
      }
    })

    // Create bookmark/outline objects
    if (outlinesRootId && this.bookmarks.length > 0) {
      // Helper to generate destination array
      const generateDestination = (dest: BookmarkDestination | undefined): string => {
        if (!dest) {
          // Default: first page, fit to window
          return `[${firstPageObjectId + 2} 0 R /Fit]`
        }

        const pageObjId = firstPageObjectId + (dest.page * 3) + 2
        const fit = dest.fit || 'Fit'

        switch (fit) {
          case 'Fit':
            return `[${pageObjId} 0 R /Fit]`
          case 'FitH':
            return `[${pageObjId} 0 R /FitH ${dest.y !== undefined ? dest.y : 'null'}]`
          case 'FitV':
            return `[${pageObjId} 0 R /FitV ${dest.x !== undefined ? dest.x : 'null'}]`
          case 'FitB':
            return `[${pageObjId} 0 R /FitB]`
          case 'XYZ':
            const x = dest.x !== undefined ? dest.x : 'null'
            const y = dest.y !== undefined ? dest.y : 'null'
            const zoom = dest.zoom !== undefined ? dest.zoom : 'null'
            return `[${pageObjId} 0 R /XYZ ${x} ${y} ${zoom}]`
          default:
            return `[${pageObjId} 0 R /Fit]`
        }
      }

      // Recursive function to generate bookmark objects
      const generateBookmarkObjects = (
        bookmarks: BookmarkOptions[],
        parentId: number | null,
        level: number = 0
      ): number[] => {
        const bookmarkIds: number[] = []

        bookmarks.forEach((bookmark, index) => {
          const bookmarkId = bookmarkObjectIds.get(bookmark)!
          bookmarkIds.push(bookmarkId)

          // Get prev and next sibling IDs
          const prevId = index > 0 ? bookmarkObjectIds.get(bookmarks[index - 1])! : null
          const nextId = index < bookmarks.length - 1 ? bookmarkObjectIds.get(bookmarks[index + 1])! : null

          // Build bookmark object
          let bookmarkData = `<<
  /Title (${this.escapePDFString(bookmark.title)})`

          // Parent reference
          if (parentId) {
            bookmarkData += `\n  /Parent ${parentId} 0 R`
          }

          // Prev/Next references
          if (prevId) {
            bookmarkData += `\n  /Prev ${prevId} 0 R`
          }
          if (nextId) {
            bookmarkData += `\n  /Next ${nextId} 0 R`
          }

          // Destination
          if (bookmark.destination) {
            bookmarkData += `\n  /Dest ${generateDestination(bookmark.destination)}`
          }

          // Children
          if (bookmark.children && bookmark.children.length > 0) {
            const childIds = generateBookmarkObjects(bookmark.children, bookmarkId, level + 1)
            bookmarkData += `\n  /First ${childIds[0]} 0 R`
            bookmarkData += `\n  /Last ${childIds[childIds.length - 1]} 0 R`

            // Count (positive if open, negative if closed)
            const count = bookmark.open !== false ? childIds.length : -childIds.length
            bookmarkData += `\n  /Count ${count}`
          }

          // Color (optional)
          if (bookmark.color) {
            const [r, g, b] = this.parseColor(bookmark.color)
            bookmarkData += `\n  /C [${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)}]`
          }

          // Flags (bold/italic)
          if (bookmark.bold || bookmark.italic) {
            let flags = 0
            if (bookmark.italic) flags |= 1
            if (bookmark.bold) flags |= 2
            bookmarkData += `\n  /F ${flags}`
          }

          bookmarkData += `\n>>`

          objects.push({
            id: bookmarkId,
            data: bookmarkData
          })
        })

        return bookmarkIds
      }

      // Generate all bookmark objects
      const rootBookmarkIds = generateBookmarkObjects(this.bookmarks, outlinesRootId, 0)

      // Create Outlines root object
      const outlinesData = `<<
  /Type /Outlines
  /First ${rootBookmarkIds[0]} 0 R
  /Last ${rootBookmarkIds[rootBookmarkIds.length - 1]} 0 R
  /Count ${rootBookmarkIds.length}
>>`

      objects.push({
        id: outlinesRootId,
        data: outlinesData
      })
    }

    // Create file attachment objects
    // Document-level attachments
    if (this.attachments.length > 0 && namesTreeId) {
      this.attachments.forEach((attachment, index) => {
        const embeddedFileId = attachmentEmbeddedFileIds[index]
        const fileSpecId = attachmentFileSpecIds[index]

        // Load file data
        let fileData: Buffer
        if (typeof attachment.file === 'string') {
          fileData = fs.readFileSync(attachment.file)
        } else {
          fileData = attachment.file
        }

        // Compress file data
        let compressedBuffer: Buffer
        try {
          const compressedData = pako.deflate(fileData)
          compressedBuffer = Buffer.from(compressedData)
        } catch (error) {
          throw new CompressionError(
            `Failed to compress file attachment '${attachment.name}': ${error instanceof Error ? error.message : 'Unknown error'}`,
            error instanceof Error ? error : undefined
          )
        }

        // Get file info
        const fileName = this.escapePDFString(attachment.name)
        const description = attachment.description ? this.escapePDFString(attachment.description) : fileName
        const mimeType = attachment.mimeType || 'application/octet-stream'
        const creationDate = attachment.creationDate || new Date()
        const modDate = attachment.modificationDate || creationDate

        // Create EmbeddedFile stream
        const embeddedFileData = `<<
  /Type /EmbeddedFile
  /Subtype /${mimeType.replace('/', '#2F')}
  /Length ${compressedBuffer.length}
  /Filter /FlateDecode
  /Params <<
    /Size ${fileData.length}
    /CreationDate (${this.formatPDFDate(creationDate)})
    /ModDate (${this.formatPDFDate(modDate)})
  >>
>>
stream
${compressedBuffer.toString('binary')}
endstream`

        objects.push({
          id: embeddedFileId,
          data: embeddedFileData
        })

        // Create FileSpec dictionary
        const fileSpecData = `<<
  /Type /Filespec
  /F (${fileName})
  /UF (${fileName})
  /Desc (${description})
  /EF <<
    /F ${embeddedFileId} 0 R
  >>
>>`

        objects.push({
          id: fileSpecId,
          data: fileSpecData
        })
      })

      // Create Names dictionary
      const namesArray = this.attachments.map((attachment, index) => {
        const fileName = this.escapePDFString(attachment.name)
        const fileSpecId = attachmentFileSpecIds[index]
        return `(${fileName}) ${fileSpecId} 0 R`
      }).join(' ')

      const namesData = `<<
  /EmbeddedFiles <<
    /Names [${namesArray}]
  >>
>>`

      objects.push({
        id: namesTreeId,
        data: namesData
      })
    }

    // Page-level file attachment annotations
    if (this.annotationManager.getAllAttachmentAnnotations().length > 0) {
      const attachmentOffset = this.attachments.length

      this.annotationManager.getAllAttachmentAnnotations().forEach((annotation, index) => {
        const annotationId = attachmentAnnotationIds[index]
        const embeddedFileId = attachmentEmbeddedFileIds[attachmentOffset + index]
        const fileSpecId = attachmentFileSpecIds[attachmentOffset + index]

        // Load file data
        let fileData: Buffer
        if (typeof annotation.file === 'string') {
          fileData = fs.readFileSync(annotation.file)
        } else {
          fileData = annotation.file
        }

        // Compress file data
        let compressedBuffer: Buffer
        try {
          const compressedData = pako.deflate(fileData)
          compressedBuffer = Buffer.from(compressedData)
        } catch (error) {
          throw new CompressionError(
            `Failed to compress file attachment annotation '${annotation.name}': ${error instanceof Error ? error.message : 'Unknown error'}`,
            error instanceof Error ? error : undefined
          )
        }

        // Get file info
        const fileName = this.escapePDFString(annotation.name)
        const description = annotation.description ? this.escapePDFString(annotation.description) : fileName
        const mimeType = annotation.mimeType || 'application/octet-stream'
        const icon = annotation.icon || 'PushPin'

        // Create EmbeddedFile stream
        const embeddedFileData = `<<
  /Type /EmbeddedFile
  /Subtype /${mimeType.replace('/', '#2F')}
  /Length ${compressedBuffer.length}
  /Filter /FlateDecode
  /Params <<
    /Size ${fileData.length}
  >>
>>
stream
${compressedBuffer.toString('binary')}
endstream`

        objects.push({
          id: embeddedFileId,
          data: embeddedFileData
        })

        // Create FileSpec dictionary
        const fileSpecData = `<<
  /Type /Filespec
  /F (${fileName})
  /UF (${fileName})
  /EF <<
    /F ${embeddedFileId} 0 R
  >>
>>`

        objects.push({
          id: fileSpecId,
          data: fileSpecData
        })

        // Create FileAttachment annotation
        const page = annotation.page !== undefined ? annotation.page : this.currentPageIndex
        const pageObjId = firstPageObjectId + (page * 3) + 2

        const annotationData = `<<
  /Type /Annot
  /Subtype /FileAttachment
  /Rect [${annotation.x} ${annotation.y} ${annotation.x + 20} ${annotation.y + 20}]
  /Contents (${description})
  /FS ${fileSpecId} 0 R
  /Name /${icon}
  /P ${pageObjId} 0 R
>>`

        objects.push({
          id: annotationId,
          data: annotationData
        })

        // Add annotation to page's Annots array
        const pageData = this.pages[page]
        if (!pageData.linkAnnots) {
          pageData.linkAnnots = []
        }
        pageData.linkAnnots.push(annotationId)
      })
    }

    // Create AcroForm and field objects
    if (acroFormId && (this.formFields.length > 0 || this.signatureFields.length > 0)) {
      const needAppearances = this.formOptions.needAppearances !== false

      this.formFields.forEach((field, index) => {
        const fieldId = fieldObjectIds[index]
        const pageObjId = firstPageObjectId + (field.page * 3) + 2

        // Build field dictionary based on type
        let fieldData = ''

        if (field.type === 'text') {
          // Text field - needs font properties
          const fontId = field.font ? this.getFontId(field.font) : this.getFontId(this.baseFont)
          const fontSize = field.fontSize || 12
          const [r, g, b] = field.fontColor ? this.parseColor(field.fontColor) : [0, 0, 0]
          const borderColor = field.borderColor ? this.parseColor(field.borderColor) : [0, 0, 0]
          const bgColor = field.backgroundColor ? this.parseColor(field.backgroundColor) : [1, 1, 1]
          const borderWidth = field.borderWidth !== undefined ? field.borderWidth : 1
          // Text field
          const align = field.align === 'center' ? 1 : field.align === 'right' ? 2 : 0

          fieldData = `<<
  /Type /Annot
  /Subtype /Widget
  /Rect [${field.x} ${field.y} ${field.x + field.width} ${field.y + field.height}]
  /FT /Tx
  /T (${this.escapePDFString(field.name)})
  /V (${field.defaultValue ? this.escapePDFString(field.defaultValue) : ''})
  /DV (${field.defaultValue ? this.escapePDFString(field.defaultValue) : ''})
  /DA (/F${fontId} ${fontSize} Tf ${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg)
  /P ${pageObjId} 0 R
  /MK <<
    /BG [${bgColor[0].toFixed(3)} ${bgColor[1].toFixed(3)} ${bgColor[2].toFixed(3)}]
    /BC [${borderColor[0].toFixed(3)} ${borderColor[1].toFixed(3)} ${borderColor[2].toFixed(3)}]
  >>
  /BS << /W ${borderWidth} /S /S >>
  /Q ${align}
  /F 4`

          if (field.maxLength) {
            fieldData += `\n  /MaxLen ${field.maxLength}`
          }

          // Flags
          let flags = 0
          if (field.multiline) flags |= 4096  // Multiline
          if (field.password) flags |= 8192   // Password
          if (field.readOnly) flags |= 1      // ReadOnly
          if (field.required) flags |= 2      // Required
          if (flags > 0) {
            fieldData += `\n  /Ff ${flags}`
          }

          if (field.tooltip) {
            fieldData += `\n  /TU (${this.escapePDFString(field.tooltip)})`
          }

          fieldData += `\n>>`

        } else if (field.type === 'checkbox') {
          // Checkbox field - needs font properties for /DA
          const fontId = field.font ? this.getFontId(field.font) : this.getFontId(this.baseFont)
          const fontSize = field.fontSize || 12
          const borderColor = field.borderColor ? this.parseColor(field.borderColor) : [0, 0, 0]
          const bgColor = field.backgroundColor ? this.parseColor(field.backgroundColor) : [1, 1, 1]
          const borderWidth = field.borderWidth !== undefined ? field.borderWidth : 1

          const checked = field.defaultValue ? '/Yes' : '/Off'
          const checkColor = field.checkmarkColor ? this.parseColor(field.checkmarkColor) : [0, 0, 0]

          fieldData = `<<
  /Type /Annot
  /Subtype /Widget
  /Rect [${field.x} ${field.y} ${field.x + field.width} ${field.y + field.height}]
  /FT /Btn
  /T (${this.escapePDFString(field.name)})
  /V ${checked}
  /DV ${checked}
  /AS ${checked}
  /DA (/F${fontId} ${fontSize} Tf ${checkColor[0].toFixed(3)} ${checkColor[1].toFixed(3)} ${checkColor[2].toFixed(3)} rg)
  /P ${pageObjId} 0 R
  /MK <<
    /BG [${bgColor[0].toFixed(3)} ${bgColor[1].toFixed(3)} ${bgColor[2].toFixed(3)}]
    /BC [${borderColor[0].toFixed(3)} ${borderColor[1].toFixed(3)} ${borderColor[2].toFixed(3)}]
    /CA (4)
  >>
  /BS << /W ${borderWidth} /S /S >>
  /H /P
  /F 4`

          // Flags for checkboxes
          let flags = 0
          if (field.readOnly) flags |= 1
          if (field.required) flags |= 2
          if (flags > 0) {
            fieldData += `\n  /Ff ${flags}`
          }

          if (field.tooltip) {
            fieldData += `\n  /TU (${this.escapePDFString(field.tooltip)})`
          }

          fieldData += `\n>>`

        } else if (field.type === 'radio') {
          // Radio button group
          // For simplicity, we'll create a parent field with child widgets
          const selectedValue = field.defaultValue || ''

          // We would need multiple objects for radio buttons (one parent + children)
          // For now, simplified implementation
          fieldData = `<<
  /Type /Annot
  /Subtype /Widget
  /FT /Btn
  /Ff 49152
  /T (${this.escapePDFString(field.name)})
  /V /${selectedValue || 'Off'}
  /P ${pageObjId} 0 R
>>`

        } else if (field.type === 'dropdown') {
          // Dropdown field (Choice field) - needs font properties for /DA
          const fontId = field.font ? this.getFontId(field.font) : this.getFontId(this.baseFont)
          const fontSize = field.fontSize || 12
          const [r, g, b] = field.fontColor ? this.parseColor(field.fontColor) : [0, 0, 0]
          const borderColor = field.borderColor ? this.parseColor(field.borderColor) : [0, 0, 0]
          const bgColor = field.backgroundColor ? this.parseColor(field.backgroundColor) : [1, 1, 1]
          const borderWidth = field.borderWidth !== undefined ? field.borderWidth : 1

          const optionsArray = field.options.map(opt => `(${this.escapePDFString(opt)})`).join(' ')
          const defaultVal = field.defaultValue ? this.escapePDFString(field.defaultValue) : ''

          fieldData = `<<
  /Type /Annot
  /Subtype /Widget
  /Rect [${field.x} ${field.y} ${field.x + field.width} ${field.y + field.height}]
  /FT /Ch
  /T (${this.escapePDFString(field.name)})
  /Opt [${optionsArray}]
  /V (${defaultVal})
  /DV (${defaultVal})
  /DA (/F${fontId} ${fontSize} Tf ${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg)
  /P ${pageObjId} 0 R
  /MK <<
    /BG [${bgColor[0].toFixed(3)} ${bgColor[1].toFixed(3)} ${bgColor[2].toFixed(3)}]
    /BC [${borderColor[0].toFixed(3)} ${borderColor[1].toFixed(3)} ${borderColor[2].toFixed(3)}]
  >>
  /BS << /W ${borderWidth} /S /S >>
  /F 4`

          let flags = 131072  // Combo flag
          if (field.editable) flags |= 262144  // Edit flag
          if (field.readOnly) flags |= 1
          if (field.required) flags |= 2
          fieldData += `\n  /Ff ${flags}`

          if (field.tooltip) {
            fieldData += `\n  /TU (${this.escapePDFString(field.tooltip)})`
          }

          fieldData += `\n>>`

        } else if (field.type === 'button') {
          // Button field
          const btnBgColor = field.backgroundColor ? this.parseColor(field.backgroundColor) : [0.8, 0.8, 0.8]
          const btnBorderColor = field.borderColor ? this.parseColor(field.borderColor) : [0, 0, 0]
          const btnBorderWidth = field.borderWidth !== undefined ? field.borderWidth : 1

          fieldData = `<<
  /Type /Annot
  /Subtype /Widget
  /Rect [${field.x} ${field.y} ${field.x + field.width} ${field.y + field.height}]
  /FT /Btn
  /Ff 65536
  /T (${this.escapePDFString(field.name)})
  /MK <<
    /BG [${btnBgColor[0].toFixed(3)} ${btnBgColor[1].toFixed(3)} ${btnBgColor[2].toFixed(3)}]
    /BC [${btnBorderColor[0].toFixed(3)} ${btnBorderColor[1].toFixed(3)} ${btnBorderColor[2].toFixed(3)}]
    /CA (${this.escapePDFString(field.label)})
  >>
  /BS << /W ${btnBorderWidth} /S /S >>
  /H /P
  /F 4
  /P ${pageObjId} 0 R`

          if (field.action === 'submit' && field.submitUrl) {
            fieldData += `\n  /A <<
    /S /SubmitForm
    /F (${this.escapePDFString(field.submitUrl)})
  >>`
          } else if (field.action === 'reset') {
            fieldData += `\n  /A <<
    /S /ResetForm
  >>`
          }

          fieldData += `\n>>`
        }

        objects.push({
          id: fieldId,
          data: fieldData
        })
      })

      // Create signature field objects
      this.signatureFields.forEach((field, index) => {
        const fieldId = signatureObjectIds[index]
        const pageObjId = firstPageObjectId + (field.page * 3) + 2

        const borderColor = field.borderColor ? this.parseColor(field.borderColor) : [0, 0, 0.8]
        const borderWidth = field.borderWidth !== undefined ? field.borderWidth : 2
        const showLabels = field.showLabels !== false

        // Build signature field dictionary with visible border
        let sigFieldData = `<<
  /Type /Annot
  /Subtype /Widget
  /Rect [${field.x} ${field.y} ${field.x + field.width} ${field.y + field.height}]
  /FT /Sig
  /T (${this.escapePDFString(field.name)})
  /P ${pageObjId} 0 R
  /F 4
  /BS << /W ${borderWidth} /S /S >>
  /MK <<
    /BG [1 1 1]
    /BC [${borderColor[0].toFixed(3)} ${borderColor[1].toFixed(3)} ${borderColor[2].toFixed(3)}]
    /CA (Click to Sign)
  >>
  /DA (/Helvetica 10 Tf 0 0 0 rg)`

        if (field.reason) {
          sigFieldData += `\n  /Reason (${this.escapePDFString(field.reason)})`
        }

        if (field.location) {
          sigFieldData += `\n  /Location (${this.escapePDFString(field.location)})`
        }

        if (field.contactInfo) {
          sigFieldData += `\n  /ContactInfo (${this.escapePDFString(field.contactInfo)})`
        }

        sigFieldData += `\n>>`

        objects.push({
          id: fieldId,
          data: sigFieldData
        })
      })

      // Create AcroForm dictionary with default resources
      const allFieldRefs = [...fieldObjectIds, ...signatureObjectIds].map(id => `${id} 0 R`).join(' ')

      // Build DR (Default Resources) with fonts
      let drFonts = ''
      this.fonts.forEach((fontIndex, fontName) => {
        const fontObjId = fontObjectIds.get(fontName)!
        drFonts += `\n    /F${fontIndex} ${fontObjId} 0 R`
      })

      const acroFormData = `<<
  /Fields [${allFieldRefs}]
  /NeedAppearances true
  /DR <<
    /Font <<${drFonts}
    >>
  >>
>>`

      objects.push({
        id: acroFormId,
        data: acroFormData
      })
    }

    // Add XMP Metadata stream (for PDF/A or when explicitly enabled)
    if (metadataObjectId && (this.pdfAOptions || this.enableXMPMetadata)) {
      // Create XMP Metadata stream
      const conformanceLevel = this.pdfAOptions?.conformanceLevel
      const xmpMetadata = generateXMPMetadata(this.info, conformanceLevel)
      const xmpBuffer = Buffer.from(xmpMetadata, 'utf-8')

      const metadataData = `<<
  /Type /Metadata
  /Subtype /XML
  /Length ${xmpBuffer.length}
>>
stream
${xmpBuffer.toString('binary')}
endstream`

      objects.push({
        id: metadataObjectId,
        data: metadataData
      })
    }

    // Add PDF/A OutputIntent (only for PDF/A)
    if (this.pdfAOptions && outputIntentId) {

      // Create OutputIntent for color space
      const colorProfile = this.pdfAOptions.colorProfile || 'sRGB'
      const identifier = this.pdfAOptions.outputIntent?.identifier || 'sRGB IEC61966-2.1'
      const condition = this.pdfAOptions.outputIntent?.condition || 'sRGB'
      const info = this.pdfAOptions.outputIntent?.info || ''

      let outputIntentData = `<<
  /Type /OutputIntent
  /S /GTS_PDFA1
  /OutputConditionIdentifier (${this.escapePDFString(identifier)})
  /OutputCondition (${this.escapePDFString(condition)})`

      if (info) {
        outputIntentData += `\n  /Info (${this.escapePDFString(info)})`
      }

      outputIntentData += `\n  /RegistryName (http://www.color.org)
>>`

      objects.push({
        id: outputIntentId,
        data: outputIntentData
      })
    }

    // Add Encrypt object if encryption is enabled
    let encryptObjectId: number | null = null
    if (this.encryption && this.encryption.isEnabled()) {
      encryptObjectId = currentObjectId++
      const encDict = this.encryption.getEncryptionDictionary()

      // Convert O and U to hex strings
      const OHex = '<' + encDict.O.toString('hex').toUpperCase() + '>'
      const UHex = '<' + encDict.U.toString('hex').toUpperCase() + '>'

      const encryptData = `<<
  /Filter /Standard
  /V ${encDict.V}
  /R ${encDict.R}
  /O ${OHex}
  /U ${UHex}
  /P ${encDict.P}
  /Length 128
>>`

      objects.push({
        id: encryptObjectId,
        data: encryptData
      })
    }

    // Sort objects by ID to ensure proper order
    objects.sort((a, b) => a.id - b.id)

    // Build PDF
    return this.buildPDF(objects, catalogId, infoObjectId, encryptObjectId)
  }

  /**
   * Encrypt literal strings in a PDF object
   * Strings are enclosed in parentheses: (string)
   */
  private encryptStringsInObject(objData: string, objectId: number): string {
    if (!this.encryption) return objData

    let result = ''
    let i = 0

    while (i < objData.length) {
      // Look for literal string start
      if (objData[i] === '(') {
        // Find the matching closing parenthesis (handle escaped parentheses)
        let depth = 1
        let j = i + 1
        let stringContent = ''

        while (j < objData.length && depth > 0) {
          if (objData[j] === '\\' && j + 1 < objData.length) {
            // Escaped character
            stringContent += objData[j] + objData[j + 1]
            j += 2
          } else if (objData[j] === '(') {
            stringContent += objData[j]
            depth++
            j++
          } else if (objData[j] === ')') {
            depth--
            if (depth > 0) {
              stringContent += objData[j]
            }
            j++
          } else {
            stringContent += objData[j]
            j++
          }
        }

        // Encrypt the string content
        const stringBuffer = Buffer.from(stringContent, 'latin1')
        const encryptedBuffer = this.encryption.encryptData(stringBuffer, objectId, 0)

        // Convert to hex string
        const hexString = '<' + encryptedBuffer.toString('hex') + '>'
        result += hexString

        i = j
      } else {
        result += objData[i]
        i++
      }
    }

    return result
  }

  /**
   * Build the final PDF file
   */
  private buildPDF(objects: PDFObject[], catalogId: number, infoObjectId: number, encryptObjectId: number | null): Buffer {
    const buffers: Buffer[] = []

    // PDF Header with customizable version
    buffers.push(Buffer.from(`%PDF-${this.pdfVersion}\n`, 'latin1'))
    buffers.push(Buffer.from('%âãÏÓ\n', 'latin1')) // Binary marker

    // Track byte offsets for xref table
    const offsets: number[] = [0] // object 0 is always 0

    let currentOffset = buffers.reduce((sum, buf) => sum + buf.length, 0)

    // Write objects
    for (const obj of objects) {
      offsets[obj.id] = currentOffset

      const objHeader = Buffer.from(`${obj.id} 0 obj\n`, 'latin1')
      const objFooter = Buffer.from('\nendobj\n', 'latin1')

      // Check if obj.data contains binary stream (contains "stream\n")
      if (obj.data.includes('stream\n')) {
        // Split at stream boundary
        const streamIndex = obj.data.indexOf('stream\n')
        let beforeStream = obj.data.substring(0, streamIndex + 7) // Include "stream\n"
        const afterStreamIndex = obj.data.indexOf('\nendstream')
        let streamData = obj.data.substring(streamIndex + 7, afterStreamIndex)
        const afterStream = obj.data.substring(afterStreamIndex)

        // Encrypt stream if encryption is enabled and this is not the encrypt object itself
        if (this.encryption && this.encryption.isEnabled() && obj.id !== encryptObjectId) {
          const streamBuffer = Buffer.from(streamData, 'binary')
          const encryptedBuffer = this.encryption.encryptData(streamBuffer, obj.id, 0)
          streamData = encryptedBuffer.toString('binary')

          // Update the Length in the dictionary
          const lengthMatch = beforeStream.match(/\/Length\s+(\d+)/)
          if (lengthMatch) {
            const newLength = encryptedBuffer.length
            beforeStream = beforeStream.replace(/\/Length\s+\d+/, `/Length ${newLength}`)
          }
        }

        buffers.push(objHeader)
        buffers.push(Buffer.from(beforeStream, 'latin1'))
        buffers.push(Buffer.from(streamData, 'binary'))  // Binary stream data (possibly encrypted)
        buffers.push(Buffer.from(afterStream, 'latin1'))
        buffers.push(objFooter)

        currentOffset += objHeader.length + beforeStream.length + streamData.length + afterStream.length + objFooter.length
      } else {
        // Regular text object - encrypt strings if encryption is enabled
        let objDataStr = obj.data

        if (this.encryption && this.encryption.isEnabled() && obj.id !== encryptObjectId) {
          // Encrypt literal strings (text between parentheses)
          objDataStr = this.encryptStringsInObject(objDataStr, obj.id)
        }

        const objData = Buffer.from(objDataStr, 'latin1')
        buffers.push(objHeader)
        buffers.push(objData)
        buffers.push(objFooter)

        currentOffset += objHeader.length + objData.length + objFooter.length
      }
    }

    // xref table
    const xrefOffset = currentOffset
    buffers.push(Buffer.from('xref\n', 'latin1'))
    buffers.push(Buffer.from(`0 ${objects.length + 1}\n`, 'latin1'))
    buffers.push(Buffer.from('0000000000 65535 f \n', 'latin1'))

    for (let i = 1; i <= objects.length; i++) {
      const offset = offsets[i] || 0
      buffers.push(Buffer.from(`${offset.toString().padStart(10, '0')} 00000 n \n`, 'latin1'))
    }

    // Trailer
    buffers.push(Buffer.from('trailer\n', 'latin1'))

    // Build trailer dictionary
    let trailerDict = `<<\n  /Size ${objects.length + 1}\n  /Root ${catalogId} 0 R\n  /Info ${infoObjectId} 0 R`

    // Add Encrypt reference if encryption is enabled
    if (encryptObjectId !== null) {
      trailerDict += `\n  /Encrypt ${encryptObjectId} 0 R`

      // Add ID array (required for encrypted documents)
      const idHex = '<' + this.documentId.toUpperCase() + '>'
      trailerDict += `\n  /ID [${idHex} ${idHex}]`
    }

    trailerDict += `\n>>`
    buffers.push(Buffer.from(trailerDict + '\n', 'latin1'))

    buffers.push(Buffer.from('startxref\n', 'latin1'))
    buffers.push(Buffer.from(xrefOffset.toString() + '\n', 'latin1'))
    buffers.push(Buffer.from('%%EOF', 'latin1'))

    return Buffer.concat(buffers)
  }

  /**
   * Save PDF to file
   */
  save(filepath: string): void {
    const buffer = this.generate()
    fs.writeFileSync(filepath, buffer)
  }
}
