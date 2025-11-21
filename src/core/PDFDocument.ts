import { PDFWriter } from './PDFWriter'
import { PDFDocumentOptions, PAGE_SIZES, BarChartOptions, GroupedBarChartOptions, StackedBarChartOptions, LineChartOptions, MultiLineChartOptions, PieChartOptions, DonutChartOptions, PageNumberOptions, PageSize, Margins, DocumentInfo, PageLayout, PDFSecurityOptions, ImageOptions, TextOptions, TableOptions, CircleOptions, EllipseOptions, PolygonOptions, ArcOptions, SectorOptions, HeaderFooterOptions, BookmarkOptions, FormOptions, FormField, SignatureFieldOptions, Annotation, TextAnnotation, HighlightAnnotation, UnderlineAnnotation, StrikeOutAnnotation, SquareAnnotation, CircleAnnotation as CircleAnnotationType, FreeTextAnnotation, StampAnnotation, InkAnnotation, Watermark, TextWatermark, ImageWatermark, Link, ExternalLink, InternalLink, PageRotation, ExtendedMetadata, FileAttachment, FileAttachmentAnnotation, CustomFont, PDFBaseFont, Gradient, TilingPatternOptions, FormXObjectOptions, FormXObjectPlacementOptions, LayerOptions, TextOutlineOptions, TextRenderingMode, Color, QRCodeOptions } from '../types'
import { BarChart } from '../charts/BarChart'
import { GroupedBarChart } from '../charts/GroupedBarChart'
import { StackedBarChart } from '../charts/StackedBarChart'
import { LineChart } from '../charts/LineChart'
import { MultiLineChart } from '../charts/MultiLineChart'
import { PieChart } from '../charts/PieChart'
import { Table } from '../tables/Table'
import { ImageParser } from '../images/ImageParser'
import { Writable } from 'stream'
import {
  validateRectangle,
  validateCoordinates,
  validateRGBColor,
  validateFontSize,
  validateLineWidth,
  validatePageIndex,
  validateRotation,
  validateOpacity,
  validateNonEmptyString
} from '../utils/validation'

/**
 * PDFDocument - Main API class with multi-page support
 */
export class PDFDocument {
  private writer: PDFWriter
  private width: number
  private height: number
  private margins: Margins
  private outputStream: Writable | null = null
  private isEnded: boolean = false

  constructor(options: PDFDocumentOptions = {}) {
    // Determine page size
    const size = options.size || 'A4'
    let [width, height] = typeof size === 'string' ? PAGE_SIZES[size] : size

    // Apply layout (swap width/height if landscape)
    const layout = options.layout || 'portrait'
    if (layout === 'landscape') {
      [width, height] = [height, width]  // Swap dimensions
    }

    this.width = width
    this.height = height

    // Determine if we should create first page automatically
    const autoFirstPage = options.autoFirstPage !== undefined ? options.autoFirstPage : true

    // Get PDF version
    const pdfVersion = options.pdfVersion || '1.4'

    // Get security options
    const security = options.security

    // Get header/footer options
    const headerFooter = options.headerFooter

    // Get bookmarks
    const bookmarks = options.bookmarks

    // Get form options
    const formOptions = options.form

    // Get signature fields
    const signatureFields = options.signature

    // Get PDF/A options
    const pdfAOptions = options.pdfA

    // Get compression options
    const compressionOptions = options.compression

    this.writer = new PDFWriter(width, height, options.font, options.info, pdfVersion, autoFirstPage, security, headerFooter, bookmarks, formOptions, signatureFields, pdfAOptions, compressionOptions)

    // Set margins
    this.margins = this.normalizeMargins(options.margins || 0)

    // Set page numbering if provided
    if (options.pageNumbers) {
      this.writer.setPageNumberOptions(options.pageNumbers)
    }

    // Set header/footer if provided
    if (options.headerFooter) {
      this.writer.setHeaderFooterOptions(options.headerFooter)
    }

    // Set bookmarks if provided
    if (options.bookmarks) {
      this.writer.setBookmarks(options.bookmarks)
    }
  }

  /**
   * Normalize margins to Margins object
   */
  private normalizeMargins(margins: number | Margins): Margins {
    if (typeof margins === 'number') {
      return {
        top: margins,
        right: margins,
        bottom: margins,
        left: margins
      }
    }
    return margins
  }

  /**
   * Add a new page to the document
   */
  addPage(size?: PageSize | [number, number]): this {
    if (size) {
      const [width, height] = typeof size === 'string' ? PAGE_SIZES[size] : size
      this.writer.addPage(width, height)
    } else {
      this.writer.addPage(this.width, this.height)
    }
    return this
  }

  /**
   * Switch to a specific page (0-indexed)
   */
  switchToPage(pageIndex: number): this {
    this.writer.switchToPage(pageIndex)
    return this
  }

  /**
   * Get current page number (1-indexed)
   */
  getCurrentPageNumber(): number {
    return this.writer.getCurrentPageNumber()
  }

  /**
   * Get total number of pages
   */
  getPageCount(): number {
    return this.writer.getPageCount()
  }

  /**
   * Configure page numbering
   */
  setPageNumbers(options: PageNumberOptions | null): this {
    this.writer.setPageNumberOptions(options)
    return this
  }

  /**
   * Configure headers and footers
   */
  setHeaderFooter(options: HeaderFooterOptions | null): this {
    this.writer.setHeaderFooterOptions(options)
    return this
  }

  /**
   * Set bookmarks/outlines (table of contents)
   * Creates a navigable outline in PDF viewers
   *
   * @param bookmarks - Array of bookmark configurations
   *
   * @example
   * ```typescript
   * doc.setBookmarks([
   *   {
   *     title: 'Chapter 1',
   *     destination: { page: 0, fit: 'FitH', y: 750 },
   *     children: [
   *       { title: 'Section 1.1', destination: { page: 0, fit: 'XYZ', x: 100, y: 500 } },
   *       { title: 'Section 1.2', destination: { page: 1 } }
   *     ]
   *   },
   *   {
   *     title: 'Chapter 2',
   *     destination: { page: 2 },
   *     bold: true,
   *     color: [0.8, 0, 0]
   *   }
   * ])
   * ```
   */
  setBookmarks(bookmarks: BookmarkOptions[]): this {
    this.writer.setBookmarks(bookmarks)
    return this
  }

  /**
   * Add a single bookmark to the outline
   *
   * @param bookmark - Bookmark configuration
   *
   * @example
   * ```typescript
   * doc.addBookmark({
   *   title: 'Introduction',
   *   destination: { page: 0, fit: 'Fit' }
   * })
   * ```
   */
  addBookmark(bookmark: BookmarkOptions): this {
    this.writer.addBookmark(bookmark)
    return this
  }

  /**
   * Add a simple bookmark pointing to the current page
   * Convenience method for quick bookmark creation
   *
   * @param title - Bookmark title
   * @param page - Page number (0-based), defaults to current page
   * @param options - Additional bookmark options (color, bold, italic, children)
   *
   * @example
   * ```typescript
   * doc.addPage()
   * doc.text('Chapter 1', 100, 750, 24)
   * doc.addSimpleBookmark('Chapter 1', 0)
   *
   * doc.addPage()
   * doc.text('Chapter 2', 100, 750, 24)
   * doc.addSimpleBookmark('Chapter 2', 1, { bold: true, color: [0.8, 0, 0] })
   * ```
   */
  addSimpleBookmark(
    title: string,
    page?: number,
    options?: {
      color?: Color
      bold?: boolean
      italic?: boolean
      children?: BookmarkOptions[]
      open?: boolean
    }
  ): this {
    const currentPage = page !== undefined ? page : this.writer['currentPageIndex']

    this.writer.addBookmark({
      title,
      destination: {
        page: currentPage,
        fit: 'FitH',
        y: 750  // Top of page
      },
      ...options
    })
    return this
  }

  /**
   * Set form configuration
   */
  setForm(options: FormOptions): this {
    this.writer.setFormOptions(options)
    return this
  }

  /**
   * Add a form field
   */
  addFormField(field: FormField): this {
    this.writer.addFormField(field)
    return this
  }

  /**
   * Add a signature field
   */
  addSignatureField(field: SignatureFieldOptions): this {
    this.writer.addSignatureField(field)
    return this
  }

  /**
   * Add an annotation to the document
   */
  addAnnotation(annotation: Annotation): this {
    this.writer.addAnnotation(annotation)
    return this
  }

  /**
   * Add a text annotation (sticky note)
   */
  addNote(options: Omit<TextAnnotation, 'type'>): this {
    this.writer.addAnnotation({ ...options, type: 'text' })
    return this
  }

  /**
   * Add a highlight annotation
   */
  addHighlight(options: Omit<HighlightAnnotation, 'type'>): this {
    this.writer.addAnnotation({ ...options, type: 'highlight' })
    return this
  }

  /**
   * Add an underline annotation
   */
  addUnderline(options: Omit<UnderlineAnnotation, 'type'>): this {
    this.writer.addAnnotation({ ...options, type: 'underline' })
    return this
  }

  /**
   * Add a strikeout annotation
   */
  addStrikeOut(options: Omit<StrikeOutAnnotation, 'type'>): this {
    this.writer.addAnnotation({ ...options, type: 'strikeout' })
    return this
  }

  /**
   * Add a square annotation
   */
  addSquareAnnotation(options: Omit<SquareAnnotation, 'type'>): this {
    this.writer.addAnnotation({ ...options, type: 'square' })
    return this
  }

  /**
   * Add a circle annotation
   */
  addCircleAnnotation(options: Omit<CircleAnnotationType, 'type'>): this {
    this.writer.addAnnotation({ ...options, type: 'circle' })
    return this
  }

  /**
   * Add a free text annotation
   */
  addFreeText(options: Omit<FreeTextAnnotation, 'type'>): this {
    this.writer.addAnnotation({ ...options, type: 'freetext' })
    return this
  }

  /**
   * Add a stamp annotation
   */
  addStamp(options: Omit<StampAnnotation, 'type'>): this {
    this.writer.addAnnotation({ ...options, type: 'stamp' })
    return this
  }

  /**
   * Add an ink annotation (freehand drawing)
   */
  addInk(options: Omit<InkAnnotation, 'type'>): this {
    this.writer.addAnnotation({ ...options, type: 'ink' })
    return this
  }

  /**
   * Add a watermark to the document
   */
  addWatermark(watermark: Watermark): this {
    this.writer.addWatermark(watermark)
    return this
  }

  /**
   * Add a text watermark
   */
  addTextWatermark(options: Omit<TextWatermark, 'type'>): this {
    this.writer.addWatermark({ ...options, type: 'text' })
    return this
  }

  /**
   * Add an image watermark
   */
  addImageWatermark(options: Omit<ImageWatermark, 'type'>): this {
    this.writer.addWatermark({ ...options, type: 'image' })
    return this
  }

  /**
   * Add a hyperlink
   */
  addLink(link: Link): this {
    this.writer.addLink(link)
    return this
  }

  /**
   * Add an external hyperlink (URL)
   */
  addExternalLink(options: Omit<ExternalLink, 'type'>): this {
    this.writer.addLink({ ...options, type: 'url' })
    return this
  }

  /**
   * Add an internal hyperlink (page)
   */
  addInternalLink(options: Omit<InternalLink, 'type'>): this {
    this.writer.addLink({ ...options, type: 'page' })
    return this
  }

  /**
   * Rotate a specific page
   * @param pageIndex - Page index (0-indexed)
   * @param rotation - Rotation angle in degrees (0, 90, 180, 270)
   */
  rotatePage(pageIndex: number, rotation: PageRotation): this {
    validatePageIndex(pageIndex, this.writer.getPageCount())
    validateRotation(rotation)
    this.writer.rotatePage(pageIndex, rotation)
    return this
  }

  /**
   * Rotate the current page
   * @param rotation - Rotation angle in degrees (0, 90, 180, 270)
   */
  rotateCurrentPage(rotation: PageRotation): this {
    validateRotation(rotation)
    this.writer.rotateCurrentPage(rotation)
    return this
  }

  /**
   * Duplicate a page
   * @param pageIndex - Index of page to duplicate (0-indexed)
   * @returns Index of the new duplicated page
   */
  duplicatePage(pageIndex: number): number {
    return this.writer.duplicatePage(pageIndex)
  }

  /**
   * Reorder pages
   * @param newOrder - Array of page indices in the desired order
   * @example
   * // Reverse page order
   * doc.reorderPages([2, 1, 0])
   * // Move first page to end
   * doc.reorderPages([1, 2, 0])
   */
  reorderPages(newOrder: number[]): this {
    this.writer.reorderPages(newOrder)
    return this
  }

  /**
   * Delete a page
   * @param pageIndex - Index of page to delete (0-indexed)
   */
  deletePage(pageIndex: number): this {
    this.writer.deletePage(pageIndex)
    return this
  }

  /**
   * Enable XMP metadata stream in the PDF
   * This allows rich metadata including custom properties and Dublin Core metadata
   * @example
   * doc.enableXMPMetadata()
   *    .setExtendedMetadata({
   *      description: 'Detailed document description',
   *      language: 'en-US',
   *      rights: 'Copyright 2024 Company Name',
   *      custom: { department: 'Engineering', version: '1.0' }
   *    })
   */
  enableXMPMetadata(): this {
    this.writer.enableXMP()
    return this
  }

  /**
   * Set extended metadata (Dublin Core, custom properties, etc.)
   * @param metadata - Extended metadata options
   * @example
   * doc.setExtendedMetadata({
   *   description: 'Technical specification document',
   *   language: 'en-US',
   *   rights: 'Copyright 2024',
   *   category: 'Technical Documentation',
   *   custom: {
   *     department: 'Engineering',
   *     projectCode: 'PROJ-123',
   *     version: '2.1.0'
   *   }
   * })
   */
  setExtendedMetadata(metadata: ExtendedMetadata): this {
    this.writer.setExtendedMetadata(metadata)
    return this
  }

  /**
   * Update document info (title, author, subject, etc.)
   * @param info - Document info to merge with existing info
   * @example
   * doc.updateInfo({
   *   Title: 'Updated Title',
   *   Author: 'John Doe',
   *   Keywords: 'pdf, document, metadata'
   * })
   */
  updateInfo(info: Partial<DocumentInfo>): this {
    this.writer.updateInfo(info)
    return this
  }

  /**
   * Attach a file to the document (document-level attachment)
   * The file will be embedded in the PDF and accessible via the attachments panel
   * @param attachment - File attachment options
   * @example
   * doc.attachFile({
   *   name: 'data.xlsx',
   *   file: './path/to/data.xlsx',
   *   description: 'Raw data spreadsheet',
   *   mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
   * })
   */
  attachFile(attachment: FileAttachment): this {
    this.writer.addAttachment(attachment)
    return this
  }

  /**
   * Add a file attachment annotation (visible icon on page)
   * Creates a clickable icon on the page that opens the attached file
   * @param annotation - File attachment annotation options
   * @example
   * doc.addFileAnnotation({
   *   name: 'notes.txt',
   *   file: Buffer.from('Important notes here'),
   *   x: 500,
   *   y: 750,
   *   icon: 'Paperclip',
   *   description: 'Additional notes'
   * })
   */
  addFileAnnotation(annotation: FileAttachmentAnnotation): this {
    this.writer.addFileAttachmentAnnotation(annotation)
    return this
  }

  /**
   * Register a custom TrueType/OpenType font for use in the document
   * @param customFont - Custom font options
   * @example
   * doc.registerFont({
   *   name: 'MyFont',
   *   source: './fonts/custom-font.ttf',
   *   subset: false
   * })
   */
  registerFont(customFont: CustomFont): this {
    this.writer.registerCustomFont(customFont)
    return this
  }

  /**
   * Switch to using a custom font for subsequent text
   * @param fontName - Name of the registered custom font
   * @example
   * doc.registerFont({ name: 'MyFont', source: './font.ttf' })
   * doc.useFont('MyFont')
   * doc.text('This text uses MyFont', 100, 700, 16)
   */
  useFont(fontName: string): this {
    this.writer.useCustomFont(fontName)
    return this
  }

  /**
   * Switch back to using a standard base font
   * @param baseFont - Standard PDF base font name
   * @example
   * doc.useBaseFont('Helvetica-Bold')
   * doc.text('Back to standard font', 100, 650, 14)
   */
  useBaseFont(baseFont: PDFBaseFont): this {
    this.writer.useBaseFont(baseFont)
    return this
  }

  /**
   * Get current margins
   */
  getMargins(): Margins {
    return { ...this.margins }
  }

  /**
   * Set new margins
   */
  setMargins(margins: number | Margins): this {
    this.margins = this.normalizeMargins(margins)
    return this
  }

  /**
   * Get content area width (page width - left margin - right margin)
   */
  getContentWidth(): number {
    return this.width - this.margins.left - this.margins.right
  }

  /**
   * Get content area height (page height - top margin - bottom margin)
   */
  getContentHeight(): number {
    return this.height - this.margins.top - this.margins.bottom
  }

  /**
   * Get left edge of content area (x position accounting for left margin)
   */
  getContentX(): number {
    return this.margins.left
  }

  /**
   * Get top edge of content area (y position accounting for top margin)
   */
  getContentY(): number {
    return this.height - this.margins.top
  }

  /**
   * Get bottom edge of content area (y position accounting for bottom margin)
   */
  getContentBottom(): number {
    return this.margins.bottom
  }

  /**
   * Get right edge of content area (x position accounting for right margin)
   */
  getContentRight(): number {
    return this.width - this.margins.right
  }

  /**
   * Get page width
   */
  getPageWidth(): number {
    return this.width
  }

  /**
   * Get page height
   */
  getPageHeight(): number {
    return this.height
  }

  /**
   * Create a bar chart
   */
  barChart(options: BarChartOptions): this {
    const chart = new BarChart(this.writer, options)
    chart.render()
    return this
  }

  /**
   * Create a grouped bar chart
   */
  groupedBarChart(options: GroupedBarChartOptions): this {
    const chart = new GroupedBarChart(this.writer, options)
    chart.render()
    return this
  }

  /**
   * Create a stacked bar chart
   */
  stackedBarChart(options: StackedBarChartOptions): this {
    const chart = new StackedBarChart(this.writer, options)
    chart.render()
    return this
  }

  /**
   * Create a line chart (single line)
   */
  lineChart(options: LineChartOptions): this {
    const chart = new LineChart(this.writer, options)
    chart.render()
    return this
  }

  /**
   * Create a multi-line chart (multiple series)
   */
  multiLineChart(options: MultiLineChartOptions): this {
    const chart = new MultiLineChart(this.writer, options)
    chart.render()
    return this
  }

  /**
   * Create a pie chart
   */
  pieChart(options: PieChartOptions): this {
    const chart = new PieChart(this.writer, options, false)
    chart.render()
    return this
  }

  /**
   * Create a donut chart (pie with hole in center)
   */
  donutChart(options: DonutChartOptions): this {
    const chart = new PieChart(this.writer, options, true)
    chart.render()
    return this
  }

  /**
   * Create a table
   */
  table(options: TableOptions): this {
    const table = new Table(this.writer, options)
    table.render()
    return this
  }

  /**
   * Add text to the document (simple)
   */
  text(text: string, x: number, y: number, fontSize?: number): this
  /**
   * Add text with advanced options (word wrap, alignment, etc.)
   */
  text(text: string, options: TextOptions & { x: number, y: number }): this
  text(text: string, xOrOptions: number | (TextOptions & { x: number, y: number }), y?: number, fontSize?: number): this {
    if (typeof xOrOptions === 'number') {
      // Simple API: text(text, x, y, fontSize)
      this.writer.text(text, xOrOptions, y!, fontSize)
    } else {
      // Advanced API: text(text, { x, y, fontSize, font, ...options })
      const { x, y: yPos, fontSize: fs, font, ...options } = xOrOptions
      this.writer.text(text, x, yPos, fs || 12, font || 'Helvetica', options)
    }
    return this
  }

  /**
   * Measure the width of a string with the current font settings
   * @param text Text to measure
   * @param fontSize Font size in points (uses current font size if not specified)
   * @param font Font name (uses current font if not specified)
   * @returns Width in points
   */
  widthOfString(text: string, fontSize?: number, font?: PDFBaseFont): number {
    return this.writer.widthOfString(text, fontSize, font)
  }

  /**
   * Measure the height of a string (line height) with the current font settings
   * @param text Text to measure (currently unused, but included for API compatibility)
   * @param fontSize Font size in points (uses current font size if not specified)
   * @param lineGap Additional gap between lines (default: 0)
   * @returns Height in points
   */
  heightOfString(text: string = '', fontSize?: number, lineGap: number = 0): number {
    return this.writer.heightOfString(text, fontSize, lineGap)
  }

  /**
   * Draw a rectangle
   */
  rect(x: number, y: number, width: number, height: number): this {
    validateRectangle(x, y, width, height)
    this.writer.rect(x, y, width, height)
    return this
  }

  /**
   * Set fill color (RGB, 0-1 range)
   */
  setFillColor(r: number, g: number, b: number): this {
    validateRGBColor(r, g, b)
    this.writer.setFillColor(r, g, b)
    return this
  }

  /**
   * Set stroke color (RGB, 0-1 range)
   */
  setStrokeColor(r: number, g: number, b: number): this {
    validateRGBColor(r, g, b)
    this.writer.setStrokeColor(r, g, b)
    return this
  }

  /**
   * Fill the current path
   */
  fill(): this {
    this.writer.fill()
    return this
  }

  /**
   * Stroke the current path
   */
  stroke(): this {
    this.writer.stroke()
    return this
  }

  /**
   * Fill and stroke the current path
   */
  fillAndStroke(): this {
    this.writer.fillAndStroke()
    return this
  }

  /**
   * Clip to the current path using non-zero winding rule (use as a mask)
   * After clipping, all subsequent drawing operations will only be visible inside the clipping region
   * Use with saveGraphicsState() and restoreGraphicsState() to restore previous clipping
   *
   * @example
   * ```typescript
   * doc.saveGraphicsState()
   *    .rect(100, 100, 200, 200)
   *    .clip()
   *    .fillColor('blue')
   *    .circle({ x: 200, y: 200, radius: 150 })
   *    .fill()  // Only visible inside the rectangle
   *    .restoreGraphicsState()
   * ```
   */
  clip(): this {
    this.writer.clip()
    return this
  }

  /**
   * Clip to the current path using even-odd rule
   * Even-odd rule is useful for paths with holes or self-intersecting paths
   *
   * @example
   * ```typescript
   * // Create a donut shape (circle with hole)
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
   * // Now draw something that will only appear in the donut
   * doc.fillColor('red').rect(100, 100, 200, 200).fill()
   * doc.restoreGraphicsState()
   * ```
   */
  clipEvenOdd(): this {
    this.writer.clipEvenOdd()
    return this
  }

  /**
   * Convenience method: Clip to a rectangle
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param width - Width
   * @param height - Height
   *
   * @example
   * ```typescript
   * doc.saveGraphicsState()
   *    .clipRect(100, 100, 200, 200)
   *    .fillColor('green')
   *    .circle({ x: 200, y: 200, radius: 150 })
   *    .fill()
   *    .restoreGraphicsState()
   * ```
   */
  clipRect(x: number, y: number, width: number, height: number): this {
    this.writer.clipRect(x, y, width, height)
    return this
  }

  /**
   * Convenience method: Clip to a circle
   * @param x - Center X coordinate
   * @param y - Center Y coordinate
   * @param radius - Radius
   *
   * @example
   * ```typescript
   * doc.saveGraphicsState()
   *    .clipCircle(200, 200, 100)
   *    .fillWithGradient({
   *      x0: 100, y0: 100, x1: 300, y1: 300,
   *      colorStops: [
   *        { offset: 0, color: [1, 0, 0] },
   *        { offset: 1, color: [0, 0, 1] }
   *      ]
   *    })
   *    .rect(100, 100, 200, 200)
   *    .fill()
   *    .restoreGraphicsState()
   * ```
   */
  clipCircle(x: number, y: number, radius: number): this {
    this.writer.clipCircle(x, y, radius)
    return this
  }

  /**
   * Convenience method: Clip to an SVG path
   * @param pathString - SVG path string (e.g., "M 100,100 L 200,200 Z")
   *
   * @example
   * ```typescript
   * const starPath = 'M 200,150 L 210,180 L 240,180 ...'
   * doc.saveGraphicsState()
   *    .clipPath(starPath)
   *    .fillColor('yellow')
   *    .rect(150, 100, 100, 100)
   *    .fill()
   *    .restoreGraphicsState()
   * ```
   */
  clipPath(pathString: string): this {
    this.writer.clipPath(pathString)
    return this
  }

  /**
   * Set line dash pattern
   * @param pattern - array of dash/gap lengths (e.g., [5, 10])
   * @param phase - offset into the pattern (default 0)
   */
  dash(pattern: number[], phase: number = 0): this {
    this.writer.dash(pattern, phase)
    return this
  }

  /**
   * Remove line dash pattern (solid lines)
   */
  undash(): this {
    this.writer.undash()
    return this
  }

  /**
   * Set line width
   */
  setLineWidth(width: number): this {
    validateLineWidth(width)
    this.writer.setLineWidth(width)
    return this
  }

  /**
   * Set line cap style (how line ends are drawn)
   * @param cap - Line cap style: 0=butt (default), 1=round, 2=square
   * @example
   * ```typescript
   * doc.setLineCap(1)  // Round caps
   *    .setLineWidth(10)
   *    .moveTo(100, 100)
   *    .lineTo(200, 100)
   *    .stroke()
   * ```
   */
  setLineCap(cap: 0 | 1 | 2): this {
    this.writer.setLineCap(cap)
    return this
  }

  /**
   * Set line join style (how lines connect)
   * @param join - Line join style: 0=miter (default), 1=round, 2=bevel
   * @example
   * ```typescript
   * doc.setLineJoin(1)  // Round joins
   *    .setLineWidth(10)
   *    .moveTo(100, 100)
   *    .lineTo(150, 150)
   *    .lineTo(200, 100)
   *    .stroke()
   * ```
   */
  setLineJoin(join: 0 | 1 | 2): this {
    this.writer.setLineJoin(join)
    return this
  }

  /**
   * Set dash pattern for lines
   * @param pattern - Array of dash/gap lengths (empty array for solid line)
   * @param phase - Offset into the dash pattern (default: 0)
   * @example
   * ```typescript
   * // Dashed line
   * doc.setDashPattern([5, 3])
   *    .moveTo(100, 100)
   *    .lineTo(200, 100)
   *    .stroke()
   *
   * // Dot-dash pattern
   * doc.setDashPattern([10, 5, 2, 5])
   *
   * // Reset to solid
   * doc.setDashPattern([])
   * ```
   */
  setDashPattern(pattern: number[], phase?: number): this {
    this.writer.setDashPattern(pattern, phase)
    return this
  }

  /**
   * Set miter limit (maximum length of mitered line joins)
   * @param limit - Miter limit (default: 10)
   * @example
   * ```typescript
   * doc.setMiterLimit(5)
   *    .setLineJoin(0)  // Miter join
   * ```
   */
  setMiterLimit(limit: number): this {
    this.writer.setMiterLimit(limit)
    return this
  }

  /**
   * Save the current graphics state (for transformations, styling, etc.)
   * Use restore() to return to this state
   */
  saveGraphicsState(): this {
    this.writer.saveGraphicsState()
    return this
  }

  /**
   * Restore the previous graphics state
   */
  restoreGraphicsState(): this {
    this.writer.restoreGraphicsState()
    return this
  }

  /**
   * Apply a transformation matrix
   */
  transform(a: number, b: number, c: number, d: number, e: number, f: number): this {
    this.writer.transform(a, b, c, d, e, f)
    return this
  }

  /**
   * Rotate the coordinate system
   * @param angle - rotation angle in degrees
   */
  rotate(angle: number): this {
    this.writer.rotate(angle)
    return this
  }

  /**
   * Scale the coordinate system
   * @param sx - horizontal scale factor
   * @param sy - vertical scale factor (defaults to sx)
   */
  scale(sx: number, sy?: number): this {
    this.writer.scale(sx, sy)
    return this
  }

  /**
   * Translate (move) the coordinate system
   * @param x - horizontal translation
   * @param y - vertical translation
   */
  translate(x: number, y: number): this {
    this.writer.translate(x, y)
    return this
  }

  /**
   * Move to position
   */
  moveTo(x: number, y: number): this {
    validateCoordinates(x, y)
    this.writer.moveTo(x, y)
    return this
  }

  /**
   * Line to position
   */
  lineTo(x: number, y: number): this {
    validateCoordinates(x, y)
    this.writer.lineTo(x, y)
    return this
  }

  /**
   * Close the current path
   */
  closePath(): this {
    this.writer.closePath()
    return this
  }

  /**
   * Add an image to the document
   */
  image(source: string | Buffer, options?: ImageOptions): this
  image(source: string | Buffer, x?: number, y?: number, options?: ImageOptions): this
  image(source: string | Buffer, xOrOptions?: number | ImageOptions, y?: number, options?: ImageOptions): this {
    // Parse arguments
    let x: number | undefined
    let opts: ImageOptions = {}

    if (typeof xOrOptions === 'number') {
      x = xOrOptions
      opts = options || {}
    } else if (xOrOptions) {
      opts = xOrOptions
      x = opts.x
      y = opts.y
    }

    // Load image to get dimensions
    const imageInfo = ImageParser.load(source)

    // Handle mask if provided
    if (opts.mask) {
      const maskInfo = ImageParser.load(opts.mask)
      imageInfo.maskInfo = maskInfo
      imageInfo.maskOptions = opts.maskOptions
    }

    const originalWidth = imageInfo.width
    const originalHeight = imageInfo.height

    // Calculate final dimensions based on options
    let finalWidth = originalWidth
    let finalHeight = originalHeight
    let finalX = x || opts.x || 0
    let finalY = y || opts.y || 0

    // Apply scaling modes
    if (opts.scale) {
      // Scale uniformly
      finalWidth = originalWidth * opts.scale
      finalHeight = originalHeight * opts.scale
    } else if (opts.width && opts.height) {
      // Explicit dimensions (may distort)
      finalWidth = opts.width
      finalHeight = opts.height
    } else if (opts.width) {
      // Scale to width (maintain aspect ratio)
      const ratio = opts.width / originalWidth
      finalWidth = opts.width
      finalHeight = originalHeight * ratio
    } else if (opts.height) {
      // Scale to height (maintain aspect ratio)
      const ratio = opts.height / originalHeight
      finalWidth = originalWidth * ratio
      finalHeight = opts.height
    } else if (opts.fit) {
      // Fit within dimensions (maintain aspect ratio)
      const [maxWidth, maxHeight] = opts.fit
      const widthRatio = maxWidth / originalWidth
      const heightRatio = maxHeight / originalHeight
      const ratio = Math.min(widthRatio, heightRatio)
      finalWidth = originalWidth * ratio
      finalHeight = originalHeight * ratio

      // Apply alignment
      if (opts.align === 'center') {
        finalX += (maxWidth - finalWidth) / 2
      } else if (opts.align === 'right') {
        finalX += maxWidth - finalWidth
      }

      if (opts.valign === 'center') {
        finalY += (maxHeight - finalHeight) / 2
      } else if (opts.valign === 'bottom') {
        finalY += maxHeight - finalHeight
      }
    } else if (opts.cover) {
      // Cover dimensions (maintain aspect ratio, may crop)
      const [coverWidth, coverHeight] = opts.cover
      const widthRatio = coverWidth / originalWidth
      const heightRatio = coverHeight / originalHeight
      const ratio = Math.max(widthRatio, heightRatio)
      finalWidth = originalWidth * ratio
      finalHeight = originalHeight * ratio

      // Apply alignment for cropping
      if (opts.align === 'center') {
        finalX += (coverWidth - finalWidth) / 2
      } else if (opts.align === 'right') {
        finalX += coverWidth - finalWidth
      }

      if (opts.valign === 'center') {
        finalY += (coverHeight - finalHeight) / 2
      } else if (opts.valign === 'bottom') {
        finalY += coverHeight - finalHeight
      }
    }

    // Embed the image and get its name
    // Use embedImageInfo instead of embedImage to preserve mask information
    const imageName = this.writer.embedImageInfo(imageInfo)

    // Draw the image
    this.writer.drawImage(imageName, finalX, finalY, finalWidth, finalHeight)

    return this
  }

  /**
   * Add a QR code to the document
   * @param options - QR code configuration
   * @example
   * // Simple URL QR code
   * await doc.qrCode({
   *   x: 100,
   *   y: 700,
   *   size: 150,
   *   data: 'https://example.com'
   * })
   *
   * // vCard QR code
   * await doc.qrCode({
   *   x: 300,
   *   y: 700,
   *   size: 150,
   *   data: {
   *     vcard: {
   *       firstName: 'John',
   *       lastName: 'Doe',
   *       email: 'john@example.com',
   *       phone: '+1234567890'
   *     }
   *   },
   *   foregroundColor: '#0066cc',
   *   errorCorrectionLevel: 'H'
   * })
   */
  async qrCode(options: QRCodeOptions): Promise<this> {
    await this.writer.qrCode(options)
    return this
  }

  /**
   * Draw a circle
   */
  circle(options: CircleOptions): this {
    this.writer.circle(options)
    return this
  }

  /**
   * Draw an ellipse
   */
  ellipse(options: EllipseOptions): this {
    this.writer.ellipse(options)
    return this
  }

  /**
   * Draw a regular polygon (triangle, hexagon, etc.)
   */
  polygon(options: PolygonOptions): this {
    this.writer.polygon(options)
    return this
  }

  /**
   * Draw an arc (curved line)
   */
  arc(options: ArcOptions): this {
    this.writer.arc(options)
    return this
  }

  /**
   * Draw a sector (pie slice)
   */
  sector(options: SectorOptions): this {
    this.writer.sector(options)
    return this
  }

  /**
   * Draw a cubic Bezier curve to the specified point
   */
  curveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): this {
    this.writer.curveTo(cp1x, cp1y, cp2x, cp2y, x, y)
    return this
  }

  /**
   * Draw a cubic Bezier curve (alias for curveTo, compatible with HTML5 Canvas API)
   */
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): this {
    this.writer.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
    return this
  }

  /**
   * Draw a quadratic Bezier curve to the specified point
   */
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): this {
    this.writer.quadraticCurveTo(cpx, cpy, x, y)
    return this
  }

  /**
   * Parse and draw an SVG path string
   * @param pathString - SVG path string (e.g., "M 100,100 L 200,200 C 250,150 300,150 350,200 Z")
   * @example
   * ```typescript
   * doc.path('M 100,100 L 200,200 Q 250,150 300,200 Z')
   *    .fill()
   * ```
   */
  path(pathString: string): this {
    this.writer.path(pathString)
    return this
  }

  /**
   * Set fill pattern to a gradient for subsequent fill operations
   * @param gradient - Linear or radial gradient configuration
   * @example
   * ```typescript
   * // Linear gradient (top to bottom)
   * doc.fillWithGradient({
   *   x0: 100, y0: 200,  // Start point
   *   x1: 100, y1: 100,  // End point
   *   colorStops: [
   *     { offset: 0, color: [1, 0, 0] },    // Red at top
   *     { offset: 0.5, color: [1, 1, 0] },  // Yellow in middle
   *     { offset: 1, color: [0, 0, 1] }     // Blue at bottom
   *   ]
   * })
   * doc.rect(100, 100, 200, 100).fill()
   *
   * // Radial gradient
   * doc.fillWithGradient({
   *   x0: 200, y0: 200, r0: 0,    // Inner circle (center, no radius)
   *   x1: 200, y1: 200, r1: 100,  // Outer circle
   *   colorStops: [
   *     { offset: 0, color: [1, 1, 1] },   // White at center
   *     { offset: 1, color: [0, 0, 0] }    // Black at edge
   *   ]
   * })
   * doc.circle({ x: 200, y: 200, radius: 100 }).fill()
   * ```
   */
  fillWithGradient(gradient: Gradient): this {
    this.writer.fillWithGradient(gradient)
    return this
  }

  /**
   * Draw a rectangle filled with a gradient (convenience method)
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param width - Width
   * @param height - Height
   * @param gradient - Linear or radial gradient
   * @example
   * ```typescript
   * doc.rectWithGradient(100, 100, 200, 150, {
   *   x0: 100, y0: 100,
   *   x1: 300, y1: 250,
   *   colorStops: [
   *     { offset: 0, color: [1, 0, 0] },
   *     { offset: 1, color: [0, 0, 1] }
   *   ]
   * })
   * ```
   */
  rectWithGradient(x: number, y: number, width: number, height: number, gradient: Gradient): this {
    this.writer.rectWithGradient(x, y, width, height, gradient)
    return this
  }

  /**
   * Set fill pattern to a tiling pattern for subsequent fill operations
   * @param pattern - Tiling pattern configuration
   * @example
   * ```typescript
   * // Polka dot pattern
   * doc.fillWithPattern({
   *   width: 20,
   *   height: 20,
   *   draw: (ctx) => {
   *     ctx.setFillColor(1, 0, 0)
   *     ctx.circle(10, 10, 4)
   *     ctx.fill()
   *   }
   * })
   * doc.rect(100, 100, 200, 150).fill()
   *
   * // Striped pattern
   * doc.fillWithPattern({
   *   width: 10,
   *   height: 10,
   *   draw: (ctx) => {
   *     ctx.setFillColor(0, 0, 1)
   *     ctx.rect(0, 0, 5, 10)
   *     ctx.fill()
   *   }
   * })
   * doc.circle({ x: 300, y: 300, radius: 50 }).fill()
   * ```
   */
  fillWithPattern(pattern: TilingPatternOptions): this {
    this.writer.fillWithPattern(pattern)
    return this
  }

  /**
   * Draw a rectangle filled with a pattern (convenience method)
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param width - Width
   * @param height - Height
   * @param pattern - Tiling pattern
   * @example
   * ```typescript
   * doc.rectWithPattern(100, 100, 200, 150, {
   *   width: 15,
   *   height: 15,
   *   draw: (ctx) => {
   *     ctx.setStrokeColor(0.5, 0.5, 0.5)
   *     ctx.setLineWidth(1)
   *     ctx.rect(0, 0, 15, 15)
   *     ctx.stroke()
   *   }
   * })
   * ```
   */
  rectWithPattern(x: number, y: number, width: number, height: number, pattern: TilingPatternOptions): this {
    this.writer.rectWithPattern(x, y, width, height, pattern)
    return this
  }

  /**
   * Create a Form XObject (reusable template/graphic) that can be placed multiple times
   * @param options - Form XObject configuration with width, height, and draw function
   * @returns The name of the created Form XObject (e.g., 'Logo', 'Header', 'XObj1')
   * @example
   * ```typescript
   * // Create a company logo template
   * const logo = doc.createFormXObject({
   *   width: 100,
   *   height: 100,
   *   name: 'CompanyLogo',
   *   draw: (ctx) => {
   *     // Draw blue circle
   *     ctx.setFillColor(0, 0.5, 1)
   *     ctx.circle(50, 50, 40)
   *     ctx.fill()
   *
   *     // Add white text
   *     ctx.setFillColor(1, 1, 1)
   *     ctx.text('ACME', 25, 45, 20)
   *   }
   * })
   *
   * // Use the logo multiple times on different pages
   * doc.useFormXObject(logo, { x: 50, y: 700, scale: 0.5 })
   * doc.addPage()
   * doc.useFormXObject(logo, { x: 450, y: 700, scale: 0.5 })
   * ```
   */
  createFormXObject(options: FormXObjectOptions): string {
    return this.writer.createFormXObject(options)
  }

  /**
   * Place/use a Form XObject on the current page with optional transformations
   * @param name - Name of the Form XObject (returned by createFormXObject)
   * @param placement - Positioning, scaling, rotation, and opacity options
   * @example
   * ```typescript
   * // Create a template
   * const header = doc.createFormXObject({
   *   width: 500,
   *   height: 50,
   *   name: 'PageHeader',
   *   draw: (ctx) => {
   *     ctx.setFillColor(0.9, 0.9, 0.9)
   *     ctx.rect(0, 0, 500, 50)
   *     ctx.fill()
   *     ctx.setFillColor(0, 0, 0)
   *     ctx.text('My Document', 10, 25, 16)
   *   }
   * })
   *
   * // Place at specific position
   * doc.useFormXObject(header, { x: 50, y: 750 })
   *
   * // Place with scaling
   * doc.useFormXObject(header, { x: 50, y: 50, scale: 0.8 })
   *
   * // Place with rotation
   * doc.useFormXObject(header, { x: 300, y: 400, rotate: 45 })
   *
   * // Place with custom dimensions
   * doc.useFormXObject(header, { x: 50, y: 700, width: 400, height: 40 })
   *
   * // Place with opacity
   * doc.useFormXObject(header, { x: 50, y: 700, opacity: 0.5 })
   * ```
   */
  useFormXObject(name: string, placement?: FormXObjectPlacementOptions): this {
    this.writer.useFormXObject(name, placement)
    return this
  }

  /**
   * Set text rendering mode
   * @param mode - Text rendering mode (0=fill, 1=stroke, 2=fill+stroke, etc.)
   * @example
   * ```typescript
   * // Outline text
   * doc.setTextRenderingMode(1)
   *    .setStrokeColor(0, 0, 0)
   *    .setLineWidth(1)
   *    .text('OUTLINED', 100, 700, 48)
   * ```
   */
  setTextRenderingMode(mode: TextRenderingMode): this {
    this.writer.setTextRenderingMode(mode)
    return this
  }

  /**
   * Draw text with outline (stroked text)
   * @param options - Text outline configuration
   * @example
   * ```typescript
   * doc.textOutline({
   *   text: 'OUTLINED TEXT',
   *   x: 100,
   *   y: 700,
   *   fontSize: 48,
   *   strokeColor: [0, 0, 0],
   *   fillColor: [1, 1, 1],
   *   lineWidth: 2
   * })
   * ```
   */
  textOutline(options: TextOutlineOptions): this {
    this.writer.textOutline(options)
    return this
  }

  /**
   * Begin a transparency group (isolated blend group)
   * @param isolated - Whether group is isolated from backdrop (default: true)
   * @param knockout - Whether group uses knockout blending (default: false)
   * @example
   * ```typescript
   * doc.beginTransparencyGroup()
   *    .setFillColor(1, 0, 0)
   *    .circle({ x: 150, y: 400, radius: 50, fillColor: [1, 0, 0] })
   *    .setFillColor(0, 0, 1)
   *    .circle({ x: 180, y: 400, radius: 50, fillColor: [0, 0, 1] })
   *    .endTransparencyGroup()
   * ```
   */
  beginTransparencyGroup(isolated?: boolean, knockout?: boolean): this {
    this.writer.beginTransparencyGroup(isolated, knockout)
    return this
  }

  /**
   * End the current transparency group
   * @example
   * ```typescript
   * doc.beginTransparencyGroup()
   *    // ... drawing operations ...
   *    .endTransparencyGroup()
   * ```
   */
  endTransparencyGroup(): this {
    this.writer.endTransparencyGroup()
    return this
  }

  /**
   * Create a layer (Optional Content Group) that can be toggled on/off in PDF viewers
   * @param options - Layer configuration
   * @returns The layer name
   * @example
   * ```typescript
   * // Create layers for different content types
   * doc.createLayer({ name: 'Background', visible: true })
   * doc.createLayer({ name: 'Text', visible: true })
   * doc.createLayer({ name: 'Images', visible: true })
   * doc.createLayer({ name: 'Watermark', visible: false })
   *
   * // Layer visible on screen but not when printing
   * doc.createLayer({
   *   name: 'ScreenOnly',
   *   visible: true,
   *   printable: false
   * })
   *
   * // Draw content on specific layers
   * doc.beginLayer('Background')
   *    .fillColor([0.9, 0.9, 0.9])
   *    .rect(0, 0, 612, 792)
   *    .fill()
   *    .endLayer()
   *
   * doc.beginLayer('Watermark')
   *    .text('DRAFT', 200, 400, 72)
   *    .endLayer()
   * ```
   */
  createLayer(options: LayerOptions): string {
    return this.writer.createLayer(options)
  }

  /**
   * Begin drawing on a specific layer (all subsequent drawing operations will be on this layer)
   * @param layerName - Name of the layer (must be created with createLayer first)
   * @example
   * ```typescript
   * doc.createLayer({ name: 'Text', visible: true })
   *
   * doc.beginLayer('Text')
   *    .text('This text is on the Text layer', 100, 700, 14)
   *    .text('So is this text', 100, 680, 14)
   *    .endLayer()
   *
   * // Back to default (no layer)
   * doc.text('This text is NOT on any layer', 100, 660, 14)
   * ```
   */
  beginLayer(layerName: string): this {
    this.writer.beginLayer(layerName)
    return this
  }

  /**
   * End the current layer and return to drawing without layers
   * @example
   * ```typescript
   * doc.beginLayer('Background')
   *    .rect(0, 0, 612, 792)
   *    .fill()
   *    .endLayer()  // End the Background layer
   *
   * // Now drawing outside of any layer
   * doc.text('Regular content', 100, 700, 14)
   * ```
   */
  endLayer(): this {
    this.writer.endLayer()
    return this
  }

  /**
   * Set the blend mode for subsequent drawing operations
   * @param mode - Blend mode (Normal, Multiply, Screen, Overlay, Darken, Lighten, ColorDodge, ColorBurn, HardLight, SoftLight, Difference, Exclusion, Hue, Saturation, Color, Luminosity)
   * @example
   * ```typescript
   * doc.blendMode('Multiply')
   *    .fillColor('red')
   *    .rect(100, 100, 100, 100)
   *    .fill()
   * ```
   */
  blendMode(mode: string): this {
    this.writer.blendMode(mode)
    return this
  }

  /**
   * Set the opacity for subsequent drawing operations
   * @param opacity - Opacity value (0-1, where 0 is transparent and 1 is opaque)
   * @example
   * ```typescript
   * doc.opacity(0.5)
   *    .fillColor('blue')
   *    .circle(200, 200, 50)
   *    .fill()
   * ```
   */
  opacity(opacity: number): this {
    validateOpacity(opacity)
    this.writer.opacity(opacity)
    return this
  }

  /**
   * Save the PDF to a file
   */
  save(filepath: string): void {
    this.writer.save(filepath)
  }

  /**
   * Generate the PDF as a Buffer
   */
  toBuffer(): Buffer {
    return this.writer.generate()
  }

  /**
   * Pipe the PDF output to a writable stream (compatible with PDFKit API)
   * @param stream - Writable stream (e.g., fs.createWriteStream(), http response)
   * @returns this document for chaining
   */
  pipe(stream: Writable): this {
    this.outputStream = stream
    return this
  }

  /**
   * Finalize the PDF and write to the output stream (if piped)
   * Compatible with PDFKit API
   */
  end(): void {
    if (this.isEnded) {
      throw new Error('Document has already been ended')
    }

    this.isEnded = true

    // Generate the PDF
    const pdfBuffer = this.writer.generate()

    // If piped to a stream, write the buffer
    if (this.outputStream) {
      this.outputStream.write(pdfBuffer)
      this.outputStream.end()
    }
  }
}
