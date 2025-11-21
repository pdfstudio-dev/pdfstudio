/**
 * Bar chart data point
 */
export interface BarChartData {
  label: string
  value: number
}

/**
 * Grouped bar chart data point
 */
export interface GroupedBarChartData {
  label: string
  values: number[]
  series: string[]
}

/**
 * Stacked bar chart data point
 */
export interface StackedBarChartData {
  label: string
  values: number[]
  series: string[]
}

/**
 * Line chart data point
 */
export interface LineChartData {
  label: string
  value: number
}

/**
 * Multi-line chart data series
 */
export interface MultiLineChartData {
  label: string
  values: number[]
  series: string[]
}

/**
 * Pie/Donut chart data point
 */
export interface PieChartData {
  label: string
  value: number
  color?: string  // Optional custom color per slice
}

/**
 * Grid style options
 */
export interface GridStyle {
  color?: string
  width?: number
  dashPattern?: number[]
}

/**
 * Shadow options
 */
export interface ShadowOptions {
  enabled?: boolean
  color?: string
  blur?: number
  offsetX?: number
  offsetY?: number
}

/**
 * Gradient options
 */
export interface GradientOptions {
  enabled?: boolean
  type?: 'linear' | 'radial'
  colors?: string[]
  angle?: number
}

/**
 * Legend options
 */
export interface LegendOptions {
  show?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'right' | 'left'
  fontSize?: number
  itemSpacing?: number
}

/**
 * Legend item
 */
export interface LegendItem {
  label: string
  color: string
}

/**
 * Border options for charts
 */
export interface BorderOptions {
  show?: boolean
  color?: string
  width?: number
  padding?: number
  radius?: number  // Corner radius for rounded borders
}

/**
 * Bar chart configuration options
 */
export interface BarChartOptions {
  data: BarChartData[]
  x: number
  y: number
  width: number
  height: number

  // Colors
  barColor?: string
  barColors?: string[]  // Different color per bar

  // Gradient
  gradient?: GradientOptions

  // Shadow
  shadow?: ShadowOptions

  // Text
  title?: string

  // Display options
  showAxes?: boolean
  showGrid?: boolean
  showLabels?: boolean
  showValues?: boolean

  // Grid customization
  gridStyle?: GridStyle

  // Legend
  legend?: LegendOptions

  // Orientation
  orientation?: 'vertical' | 'horizontal'

  // Border
  border?: BorderOptions  // Border around the entire chart
}

/**
 * Grouped bar chart options
 */
export interface GroupedBarChartOptions {
  data: GroupedBarChartData[]
  x: number
  y: number
  width: number
  height: number
  colors?: string[]
  title?: string
  showAxes?: boolean
  showGrid?: boolean
  showLabels?: boolean
  showValues?: boolean
  gridStyle?: GridStyle
  legend?: LegendOptions
  orientation?: 'vertical' | 'horizontal'
  border?: BorderOptions  // Border around the entire chart
}

/**
 * Stacked bar chart options
 */
export interface StackedBarChartOptions {
  data: StackedBarChartData[]
  x: number
  y: number
  width: number
  height: number
  colors?: string[]
  title?: string
  showAxes?: boolean
  showGrid?: boolean
  showLabels?: boolean
  showValues?: boolean
  gridStyle?: GridStyle
  legend?: LegendOptions
  orientation?: 'vertical' | 'horizontal'
  border?: BorderOptions  // Border around the entire chart
}

/**
 * Line chart configuration options (single line)
 */
export interface LineChartOptions {
  data: LineChartData[]
  x: number
  y: number
  width: number
  height: number

  // Line style
  lineColor?: string
  lineWidth?: number
  smooth?: boolean  // Smooth curves vs straight lines

  // Points
  showPoints?: boolean
  pointSize?: number
  pointColor?: string

  // Fill area under curve
  fillArea?: boolean
  fillColor?: string
  fillOpacity?: number

  // Display options
  title?: string
  showAxes?: boolean
  showGrid?: boolean
  showLabels?: boolean
  showValues?: boolean
  gridStyle?: GridStyle
  border?: BorderOptions  // Border around the entire chart
}

/**
 * Multi-line chart options (multiple series)
 */
export interface MultiLineChartOptions {
  data: MultiLineChartData[]
  x: number
  y: number
  width: number
  height: number

  // Line styles
  colors?: string[]
  lineWidth?: number
  smooth?: boolean

  // Points
  showPoints?: boolean
  pointSize?: number

  // Display options
  title?: string
  showAxes?: boolean
  showGrid?: boolean
  showLabels?: boolean
  showValues?: boolean
  gridStyle?: GridStyle
  legend?: LegendOptions
  border?: BorderOptions  // Border around the entire chart
}

/**
 * Pie chart configuration options
 */
export interface PieChartOptions {
  data: PieChartData[]
  x: number       // Center X
  y: number       // Center Y
  radius: number  // Pie radius

  // Colors
  colors?: string[]  // Colors for each slice (auto-assigned if not in data)

  // Labels
  showLabels?: boolean      // Show labels outside slices
  showPercentages?: boolean // Show percentage on slices
  labelDistance?: number    // Distance from center for labels

  // Display options
  title?: string
  legend?: LegendOptions

  // Style
  strokeColor?: string  // Border color between slices
  strokeWidth?: number  // Border width
  border?: BorderOptions  // Border around the entire chart
}

/**
 * Donut chart configuration options (pie with hole in center)
 */
export interface DonutChartOptions {
  data: PieChartData[]
  x: number          // Center X
  y: number          // Center Y
  outerRadius: number  // Outer radius
  innerRadius: number  // Inner radius (hole size)

  // Colors
  colors?: string[]

  // Labels
  showLabels?: boolean
  showPercentages?: boolean
  labelDistance?: number

  // Display options
  title?: string
  legend?: LegendOptions
  centerText?: string  // Text in center hole

  // Style
  strokeColor?: string
  strokeWidth?: number
  border?: BorderOptions  // Border around the entire chart
}

/**
 * Page number position
 */
export type PageNumberPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

/**
 * Page number format function
 */
export type PageNumberFormat = (current: number, total: number) => string

/**
 * Page numbering options
 */
export interface PageNumberOptions {
  enabled?: boolean
  position?: PageNumberPosition
  format?: PageNumberFormat | string  // Function or template string
  fontSize?: number
  color?: string
  margin?: number  // Distance from edge
  startAt?: number  // Start numbering at specific page
  excludePages?: number[]  // Pages to exclude (0-indexed)
}

// ==================
// HEADERS & FOOTERS
// ==================

/**
 * Header/Footer alignment
 */
export type HeaderFooterAlign = 'left' | 'center' | 'right'

/**
 * Page rule for conditional content
 */
export type PageRule = 'all' | 'first' | 'notFirst' | 'odd' | 'even'

/**
 * Header/Footer content - can be text or function
 */
export type HeaderFooterContent = string | ((pageNumber: number, totalPages: number) => string)

/**
 * Image in header/footer
 */
export interface HeaderFooterImage {
  source: string | Buffer  // Path or buffer
  width?: number
  height?: number
  align?: HeaderFooterAlign
}

/**
 * Text item in header/footer
 */
export interface HeaderFooterText {
  content: HeaderFooterContent
  align?: HeaderFooterAlign
  fontSize?: number
  font?: PDFBaseFont
  color?: string
}

/**
 * Header configuration
 */
export interface HeaderOptions {
  enabled?: boolean
  height?: number  // Reserved space for header
  margin?: number  // Margin from top edge

  // Text content (can have left, center, right)
  left?: HeaderFooterContent
  center?: HeaderFooterContent
  right?: HeaderFooterContent

  // Advanced text with styling
  text?: HeaderFooterText[]

  // Images
  image?: HeaderFooterImage

  // Styling
  fontSize?: number
  font?: PDFBaseFont
  color?: string

  // Lines/borders
  line?: boolean  // Draw a line below header
  lineWidth?: number
  lineColor?: string

  // Page rules
  pages?: PageRule  // Which pages to show on (default: 'all')
  excludePages?: number[]  // Specific pages to exclude (0-indexed)
}

/**
 * Footer configuration
 */
export interface FooterOptions {
  enabled?: boolean
  height?: number  // Reserved space for footer
  margin?: number  // Margin from bottom edge

  // Text content (can have left, center, right)
  left?: HeaderFooterContent
  center?: HeaderFooterContent
  right?: HeaderFooterContent

  // Advanced text with styling
  text?: HeaderFooterText[]

  // Images
  image?: HeaderFooterImage

  // Styling
  fontSize?: number
  font?: PDFBaseFont
  color?: string

  // Lines/borders
  line?: boolean  // Draw a line above footer
  lineWidth?: number
  lineColor?: string

  // Page rules
  pages?: PageRule  // Which pages to show on (default: 'all')
  excludePages?: number[]  // Specific pages to exclude (0-indexed)
}

/**
 * Combined header and footer options
 */
export interface HeaderFooterOptions {
  header?: HeaderOptions
  footer?: FooterOptions
}

/**
 * PDF font encoding options
 */
export type PDFEncoding =
  | 'WinAnsiEncoding'      // Western European (default)
  | 'MacRomanEncoding'     // Mac Roman
  | 'StandardEncoding'     // PDF Standard
  | 'MacExpertEncoding'    // Mac Expert
  | 'PDFDocEncoding'       // PDF Doc Encoding

/**
 * PDF base font options (Type1 standard fonts)
 */
export type PDFBaseFont =
  | 'Helvetica'
  | 'Helvetica-Bold'
  | 'Helvetica-Oblique'
  | 'Helvetica-BoldOblique'
  | 'Times-Roman'
  | 'Times-Bold'
  | 'Times-Italic'
  | 'Times-BoldItalic'
  | 'Courier'
  | 'Courier-Bold'
  | 'Courier-Oblique'
  | 'Courier-BoldOblique'
  | 'Symbol'
  | 'ZapfDingbats'

/**
 * Custom font source (TrueType/OpenType)
 */
export interface CustomFont {
  name: string              // Font name to use in document (e.g., 'MyCustomFont')
  source: string | Buffer   // Path to .ttf/.otf file or Buffer
  subset?: boolean          // Enable font subsetting to reduce file size (default: false)
}

/**
 * Font configuration options
 */
export interface FontOptions {
  baseFont?: PDFBaseFont
  encoding?: PDFEncoding
  customFont?: CustomFont   // Custom TrueType/OpenType font
}

/**
 * Margin configuration
 */
export interface Margins {
  top: number
  right: number
  bottom: number
  left: number
}

/**
 * Page layout orientation
 */
export type PageLayout = 'portrait' | 'landscape'

/**
 * Standard page size names
 */
export type PageSize =
  // ISO A Series
  | 'A3'
  | 'A4'
  | 'A5'
  | 'A6'
  // ISO B Series
  | 'B4'
  | 'B5'
  // North American
  | 'Letter'          // Carta (US)
  | 'Legal'           // Oficio (US)
  | 'Tabloid'         // Tabloide
  | 'Ledger'          // Ledger (Tabloid landscape)
  | 'Executive'       // Ejecutivo
  | 'HalfLetter'      // Media Carta
  | 'Statement'       // Statement (Half Letter)
  // Other
  | 'Folio'           // Folio

/**
 * Document metadata information
 */
export interface DocumentInfo {
  Title?: string          // Document title
  Author?: string         // Author name
  Subject?: string        // Document subject
  Keywords?: string       // Keywords for search
  Creator?: string        // Application that created the document
  Producer?: string       // PDF producer
  CreationDate?: Date     // Creation date (auto-generated if not provided)
  ModDate?: Date          // Modification date (auto-generated if not provided)
  displayTitle?: boolean  // Display title in viewer window (default: false)
  extendedMetadata?: ExtendedMetadata  // Extended metadata (XMP, Dublin Core, custom properties)
}

/**
 * PDF security permissions
 */
export interface PDFPermissions {
  printing?: 'lowResolution' | 'highResolution' | false  // Allow printing (default: 'highResolution')
  modifying?: boolean      // Allow modifying the document (default: true)
  copying?: boolean        // Allow copying text and graphics (default: true)
  annotating?: boolean     // Allow adding annotations (default: true)
  fillingForms?: boolean   // Allow filling form fields (default: true)
  contentAccessibility?: boolean  // Allow content extraction for accessibility (default: true)
  documentAssembly?: boolean  // Allow assembling document (default: true)
}

/**
 * PDF security options
 */
export interface PDFSecurityOptions {
  userPassword?: string    // Password required to open the document
  ownerPassword?: string   // Password required to change permissions
  permissions?: PDFPermissions  // Granular permissions
}

/**
 * PDF Document configuration options
 */
export interface PDFDocumentOptions {
  size?: PageSize | [number, number]
  layout?: PageLayout     // Page orientation: 'portrait' or 'landscape' (default: 'portrait')
  margins?: number | Margins  // Single number for all sides, or individual margins
  pageNumbers?: PageNumberOptions
  headerFooter?: HeaderFooterOptions  // Headers and footers configuration
  font?: FontOptions
  info?: DocumentInfo     // Document metadata
  autoFirstPage?: boolean // Automatically create first page (default: true)
  pdfVersion?: string     // PDF version: '1.3', '1.4', '1.5', '1.6', '1.7' (default: '1.4')
  security?: PDFSecurityOptions  // Security and encryption options
  bookmarks?: BookmarkOptions[]  // Document bookmarks/outlines (table of contents)
  form?: FormOptions      // Interactive form fields (AcroForm)
  signature?: SignatureFieldOptions[]  // Digital signature fields
  pdfA?: PDFAOptions      // PDF/A compliance options
  compression?: CompressionOptions  // Compression and optimization options
}

/**
 * Page size definitions in points (1 point = 1/72 inch)
 *
 * Common sizes:
 * - Letter (Carta): 8.5" × 11" (US standard)
 * - Legal (Oficio): 8.5" × 14" (US legal)
 * - A4: 210mm × 297mm (ISO standard)
 */
export const PAGE_SIZES: Record<PageSize, [number, number]> = {
  // ISO A Series (portrait)
  A3: [841.89, 1190.55],      // 297mm × 420mm
  A4: [595.28, 841.89],       // 210mm × 297mm
  A5: [419.53, 595.28],       // 148mm × 210mm
  A6: [297.64, 419.53],       // 105mm × 148mm

  // ISO B Series (portrait)
  B4: [708.66, 1000.63],      // 250mm × 353mm
  B5: [498.90, 708.66],       // 176mm × 250mm

  // North American (portrait)
  Letter: [612, 792],          // 8.5" × 11" (Carta)
  Legal: [612, 1008],          // 8.5" × 14" (Oficio)
  Tabloid: [792, 1224],        // 11" × 17" (Tabloide)
  Ledger: [1224, 792],         // 17" × 11" (Tabloid landscape)
  Executive: [522, 756],       // 7.25" × 10.5" (Ejecutivo)
  HalfLetter: [396, 612],      // 5.5" × 8.5" (Media Carta)
  Statement: [396, 612],       // 5.5" × 8.5" (same as HalfLetter)

  // Other
  Folio: [612, 936]            // 8.5" × 13"
} as const

/**
 * Color type - hex string or RGB array
 */
export type Color = string | [number, number, number]

// ==================
// IMAGES
// ==================

/**
 * Supported image formats
 */
export type ImageFormat = 'JPEG' | 'PNG'

/**
 * Image positioning and scaling options
 */
export interface ImageOptions {
  // Position
  x?: number
  y?: number

  // Size
  width?: number
  height?: number
  scale?: number

  // Fit modes
  fit?: [number, number]      // Fit within dimensions (maintain aspect ratio)
  cover?: [number, number]    // Cover dimensions (maintain aspect ratio, may crop)

  // Alignment (used with fit/cover)
  align?: 'left' | 'center' | 'right'
  valign?: 'top' | 'center' | 'bottom'

  // Masking
  mask?: string | Buffer       // Path to mask image or mask buffer
  maskOptions?: ImageMaskOptions
}

/**
 * Internal image information
 */
export interface ImageInfo {
  format: ImageFormat
  width: number
  height: number
  colorSpace: string
  bitsPerComponent: number
  data: Buffer
  filter?: string
  hasAlpha?: boolean
  palette?: Buffer
  transparency?: any
  interpolate?: boolean
  maskInfo?: ImageInfo        // Mask image data
  maskOptions?: ImageMaskOptions
}

// ==================
// TEXT
// ==================

/**
 * Text alignment options
 */
export type TextAlign = 'left' | 'center' | 'right' | 'justify'

/**
 * Vertical text alignment
 */
export type TextVAlign = 'top' | 'center' | 'bottom'

/**
 * Advanced text options
 */
export interface TextOptions {
  // Position
  x?: number
  y?: number

  // Size constraints
  width?: number
  height?: number

  // Font
  font?: PDFBaseFont        // Font family (e.g. 'Helvetica-Bold', 'Times-Italic')
  fontSize?: number         // Font size in points

  // Alignment
  align?: TextAlign
  valign?: TextVAlign

  // Line spacing
  lineGap?: number           // Extra space between lines (default: 0)
  lineHeight?: number        // Total line height (overrides lineGap)

  // Character and word spacing
  characterSpacing?: number  // Extra space between characters
  wordSpacing?: number       // Extra space between words

  // Text decoration
  underline?: boolean
  strike?: boolean

  // Link
  link?: string             // URL for clickeable text

  // Flow control
  continued?: boolean       // Continue on same line (for inline style changes)

  // Paragraph
  indent?: number           // First line indent
  paragraphGap?: number     // Space after paragraph

  // Advanced
  ellipsis?: boolean | string  // Add ellipsis if text doesn't fit
}

// ==================
// TABLES
// ==================

/**
 * Table cell alignment
 */
export type CellAlign = 'left' | 'center' | 'right'
export type CellVAlign = 'top' | 'middle' | 'bottom'

/**
 * Table cell data
 */
export type TableCell = string | number | {
  content: string | number
  align?: CellAlign
  valign?: CellVAlign
  colSpan?: number
  rowSpan?: number
  backgroundColor?: string
  textColor?: string
  fontSize?: number
  bold?: boolean
}

/**
 * Table row data
 */
export type TableRow = TableCell[]

/**
 * Column definition
 */
export interface TableColumn {
  header: string
  width?: number | 'auto' | '*'  // Fixed width, auto-size, or proportional
  align?: CellAlign
  valign?: CellVAlign
}

/**
 * Table border style
 */
export interface TableBorderStyle {
  color?: string
  width?: number
  style?: 'solid' | 'dashed' | 'dotted'
}

/**
 * Table border configuration
 */
export interface TableBorders {
  top?: boolean | TableBorderStyle
  bottom?: boolean | TableBorderStyle
  left?: boolean | TableBorderStyle
  right?: boolean | TableBorderStyle
  horizontal?: boolean | TableBorderStyle  // Internal horizontal lines
  vertical?: boolean | TableBorderStyle    // Internal vertical lines
  header?: boolean | TableBorderStyle      // Separator after header
}

/**
 * Table header style
 */
export interface TableHeaderStyle {
  backgroundColor?: string
  textColor?: string
  fontSize?: number
  bold?: boolean
  align?: CellAlign
  valign?: CellVAlign
  height?: number
}

/**
 * Table options
 */
export interface TableOptions {
  // Position
  x: number
  y: number
  width?: number  // Total table width (if not provided, uses columns widths)

  // Data
  columns?: TableColumn[]  // Column definitions
  headers?: string[]       // Simple header strings (alternative to columns)
  rows: TableRow[]        // Table data

  // Header style
  headerStyle?: TableHeaderStyle

  // Row styling
  rowHeight?: number
  alternateRowColor?: string  // Color for alternating rows (zebra striping)

  // Cell styling
  cellPadding?: number
  fontSize?: number
  textColor?: string

  // Borders
  borders?: TableBorders | boolean  // true = all borders, false = no borders

  // Default alignment
  defaultAlign?: CellAlign
  defaultVAlign?: CellVAlign

  // Auto page breaks
  autoPageBreak?: boolean  // If true, table will automatically continue on new pages (default: false)
  bottomMargin?: number    // Bottom margin for page breaks (default: 50)
  repeatHeader?: boolean   // If true, header will be repeated on each new page (default: true)
}

// ==================
// GRADIENTS
// ==================

/**
 * Gradient color stop
 */
export interface ColorStop {
  offset: number   // Position (0-1)
  color: Color     // Color at this position
}

/**
 * Linear gradient options
 */
export interface LinearGradientOptions {
  x0: number          // Start point X
  y0: number          // Start point Y
  x1: number          // End point X
  y1: number          // End point Y
  colorStops: ColorStop[]  // Color stops (at least 2)
}

/**
 * Radial gradient options
 */
export interface RadialGradientOptions {
  x0: number          // Start circle center X
  y0: number          // Start circle center Y
  r0: number          // Start circle radius
  x1: number          // End circle center X
  y1: number          // End circle center Y
  r1: number          // End circle radius
  colorStops: ColorStop[]  // Color stops (at least 2)
}

/**
 * Gradient type
 */
export type Gradient = LinearGradientOptions | RadialGradientOptions

// ==================
// PATTERNS
// ==================

/**
 * Pattern draw function - receives a drawing context to create the pattern content
 */
export type PatternDrawFunction = (ctx: {
  moveTo: (x: number, y: number) => void
  lineTo: (x: number, y: number) => void
  rect: (x: number, y: number, width: number, height: number) => void
  circle: (x: number, y: number, radius: number) => void
  setFillColor: (r: number, g: number, b: number) => void
  setStrokeColor: (r: number, g: number, b: number) => void
  setLineWidth: (width: number) => void
  fill: () => void
  stroke: () => void
  fillAndStroke: () => void
}) => void

/**
 * Tiling pattern options (Type 1 Pattern)
 */
export interface TilingPatternOptions {
  width: number          // Pattern cell width
  height: number         // Pattern cell height
  xStep?: number         // Horizontal spacing (defaults to width)
  yStep?: number         // Vertical spacing (defaults to height)
  draw: PatternDrawFunction  // Function to draw the pattern content
  colored?: boolean      // Whether pattern is colored (default: true)
}

// ==================
// VECTOR SHAPES
// ==================

/**
 * Style options for vector shapes
 */
export interface ShapeStyle {
  fillColor?: Color      // Fill color (hex string or RGB array)
  fillGradient?: Gradient // Fill with gradient instead of solid color
  strokeColor?: Color    // Stroke/border color
  strokeWidth?: number   // Border width in points
  opacity?: number       // Fill opacity (0-1)
  strokeOpacity?: number // Stroke opacity (0-1)
  dashPattern?: number[] // Dash pattern for stroke [dash, gap, dash, gap...]
}

/**
 * Circle options
 */
export interface CircleOptions extends ShapeStyle {
  x: number      // Center X
  y: number      // Center Y
  radius: number // Radius in points
}

/**
 * Ellipse options
 */
export interface EllipseOptions extends ShapeStyle {
  x: number       // Center X
  y: number       // Center Y
  radiusX: number // Horizontal radius
  radiusY: number // Vertical radius
  rotation?: number // Rotation angle in degrees (optional)
}

/**
 * Polygon options
 */
export interface PolygonOptions extends ShapeStyle {
  x: number      // Center X
  y: number      // Center Y
  radius: number // Radius (distance from center to vertex)
  sides: number  // Number of sides (3 = triangle, 6 = hexagon, etc.)
  rotation?: number // Rotation angle in degrees (0 = point at top)
}

/**
 * Arc options (curved line, not filled)
 */
export interface ArcOptions extends Omit<ShapeStyle, 'fillColor' | 'opacity'> {
  x: number         // Center X
  y: number         // Center Y
  radius: number    // Radius
  startAngle: number // Start angle in degrees (0 = right/east)
  endAngle: number   // End angle in degrees
  counterclockwise?: boolean // Direction (default: false = clockwise)
}

/**
 * Sector options (pie slice shape, filled)
 */
export interface SectorOptions extends ShapeStyle {
  x: number         // Center X
  y: number         // Center Y
  radius: number    // Radius
  startAngle: number // Start angle in degrees
  endAngle: number   // End angle in degrees
  counterclockwise?: boolean // Direction (default: false = clockwise)
}

/**
 * Point for custom paths
 */
export interface Point {
  x: number
  y: number
}

/**
 * Bezier curve control points
 */
export interface BezierCurve {
  cp1x: number  // Control point 1 X
  cp1y: number  // Control point 1 Y
  cp2x?: number // Control point 2 X (cubic only)
  cp2y?: number // Control point 2 Y (cubic only)
  x: number     // End point X
  y: number     // End point Y
}

/**
 * Custom path options
 */
export interface PathOptions extends ShapeStyle {
  points: Point[]           // Array of points for the path
  closed?: boolean          // Close the path (connect last to first)
  curves?: BezierCurve[]    // Optional Bezier curves between points
}

// =======================
// BOOKMARKS / OUTLINES
// =======================

/**
 * Bookmark destination fit type
 * - 'Fit': Fit entire page in window
 * - 'FitH': Fit page width, specific Y coordinate at top
 * - 'FitV': Fit page height, specific X coordinate at left
 * - 'FitB': Fit bounding box of page content
 * - 'XYZ': Specific location with optional zoom
 */
export type BookmarkFit = 'Fit' | 'FitH' | 'FitV' | 'FitB' | 'XYZ'

/**
 * Bookmark destination
 */
export interface BookmarkDestination {
  page: number              // Page index (0-based)
  fit?: BookmarkFit        // How to display the page (default: 'Fit')
  x?: number               // X coordinate for FitV, XYZ
  y?: number               // Y coordinate for FitH, XYZ
  zoom?: number            // Zoom level for XYZ (e.g., 1.0 = 100%, 1.5 = 150%)
}

/**
 * Bookmark options
 */
export interface BookmarkOptions {
  title: string                      // Bookmark title
  destination?: BookmarkDestination  // Where this bookmark points to
  children?: BookmarkOptions[]       // Child bookmarks (nested structure)
  open?: boolean                     // Whether children are initially visible (default: true)
  color?: Color                      // Bookmark text color (optional)
  bold?: boolean                     // Bold text (optional)
  italic?: boolean                   // Italic text (optional)
}

// =======================
// PDF FORMS (AcroForms)
// =======================

/**
 * Base form field options
 */
export interface BaseFormField {
  name: string                  // Unique field name
  page: number                  // Page index (0-based) where field appears
  x: number                     // X position
  y: number                     // Y position
  width: number                 // Field width
  height: number                // Field height
  required?: boolean            // Whether field is required (default: false)
  readOnly?: boolean            // Whether field is read-only (default: false)
  tooltip?: string              // Tooltip text (appears on hover)
  backgroundColor?: Color       // Background color
  borderColor?: Color           // Border color
  borderWidth?: number          // Border width (default: 1)
  fontSize?: number             // Font size for text (default: 12)
  fontColor?: Color             // Text color (default: black)
  font?: PDFBaseFont            // Font family (default: Helvetica)
}

/**
 * Text field options
 */
export interface TextFieldOptions extends BaseFormField {
  type: 'text'
  defaultValue?: string         // Default text value
  maxLength?: number            // Maximum number of characters
  multiline?: boolean           // Multi-line text area (default: false)
  password?: boolean            // Password field (shows dots/asterisks)
  align?: 'left' | 'center' | 'right'  // Text alignment (default: 'left')
  placeholder?: string          // Placeholder text
}

/**
 * Checkbox field options
 */
export interface CheckboxFieldOptions extends BaseFormField {
  type: 'checkbox'
  defaultValue?: boolean        // Default checked state (default: false)
  checkmarkColor?: Color        // Color of checkmark (default: black)
}

/**
 * Radio button option
 */
export interface RadioOption {
  value: string                 // Option value
  x: number                     // X position
  y: number                     // Y position
  label?: string                // Label text next to radio button
  labelOffsetX?: number         // Label horizontal offset from radio (default: 20)
  labelOffsetY?: number         // Label vertical offset (default: 0)
}

/**
 * Radio button group options
 */
export interface RadioButtonFieldOptions extends Omit<BaseFormField, 'x' | 'y' | 'width' | 'height'> {
  type: 'radio'
  options: RadioOption[]        // Radio button options
  defaultValue?: string         // Default selected value
  size?: number                 // Size of radio button (default: 12)
  buttonColor?: Color           // Color of radio button
  selectedColor?: Color         // Color when selected (default: black)
}

/**
 * Dropdown/combo box field options
 */
export interface DropdownFieldOptions extends BaseFormField {
  type: 'dropdown'
  options: string[]             // List of options
  defaultValue?: string         // Default selected value
  editable?: boolean            // Allow custom text entry (combo box)
}

/**
 * Button field options
 */
export interface ButtonFieldOptions extends BaseFormField {
  type: 'button'
  label: string                 // Button label text
  action?: 'submit' | 'reset' | 'custom'  // Button action
  submitUrl?: string            // URL to submit form data to (for submit action)
  backgroundColor?: Color       // Button background color
  labelColor?: Color            // Button label color
}

/**
 * Union type for all form fields
 */
export type FormField =
  | TextFieldOptions
  | CheckboxFieldOptions
  | RadioButtonFieldOptions
  | DropdownFieldOptions
  | ButtonFieldOptions

/**
 * Form configuration options
 */
export interface FormOptions {
  fields?: FormField[]          // Form fields
  submitUrl?: string            // Default submit URL
  needAppearances?: boolean     // Generate field appearances (default: true)
}

/**
 * Digital Signature Options
 */
export interface SignatureFieldOptions {
  name: string                  // Field name
  page: number                  // Page index (0-based)
  x: number                     // X position
  y: number                     // Y position
  width: number                 // Field width
  height: number                // Field height
  reason?: string               // Reason for signing
  location?: string             // Location of signing
  contactInfo?: string          // Contact information
  showLabels?: boolean          // Show signature labels (default: true)
  borderColor?: Color           // Border color
  borderWidth?: number          // Border width
}

export interface CertificateInfo {
  privateKey: string | Buffer   // Private key in PEM format
  certificate: string | Buffer  // Certificate in PEM format
  password?: string             // Password for private key (if encrypted)
}

export interface SignatureOptions {
  certificate: CertificateInfo  // Certificate and private key
  reason?: string               // Reason for signing
  location?: string             // Location of signing
  contactInfo?: string          // Contact information
  timestamp?: boolean           // Add timestamp (requires TSA server)
  timestampServer?: string      // Timestamp server URL
}

// =======================
// PDF/A COMPLIANCE
// =======================

/**
 * PDF/A conformance levels
 * - PDF/A-1b: Basic visual appearance preservation (PDF 1.4)
 * - PDF/A-2b: Modern standard with improved features (PDF 1.7)
 * - PDF/A-3b: Allows embedded files of any format (PDF 1.7)
 */
export type PDFAConformanceLevel = 'PDF/A-1b' | 'PDF/A-2b' | 'PDF/A-3b'

/**
 * PDF/A color profile options
 */
export type PDFAColorProfile = 'sRGB' | 'Adobe RGB' | 'CMYK'

/**
 * PDF/A compliance options
 */
export interface PDFAOptions {
  conformanceLevel: PDFAConformanceLevel  // PDF/A standard level (default: 'PDF/A-1b')
  colorProfile?: PDFAColorProfile         // Color profile (default: 'sRGB')
  outputIntent?: {
    identifier?: string                   // Registry identifier (default: 'sRGB IEC61966-2.1')
    condition?: string                    // Human-readable condition
    info?: string                         // Additional information
  }
}

// =======================
// PDF ANNOTATIONS
// =======================

/**
 * Annotation icon for text annotations (sticky notes)
 */
export type AnnotationIcon = 'Comment' | 'Help' | 'Insert' | 'Key' | 'NewParagraph' | 'Note' | 'Paragraph'

/**
 * Stamp annotation types
 */
export type StampType = 'Approved' | 'Experimental' | 'NotApproved' | 'AsIs' | 'Expired' | 'NotForPublicRelease' | 'Confidential' | 'Final' | 'Sold' | 'Departmental' | 'ForComment' | 'TopSecret' | 'ForPublicRelease' | 'Draft'

/**
 * Base annotation options
 */
export interface BaseAnnotation {
  page: number           // Page number (0-based)
  author?: string        // Author of the annotation
  subject?: string       // Subject/title of the annotation
  contents?: string      // Text content of the annotation
  color?: Color          // Annotation color
  creationDate?: Date    // Creation date (defaults to now)
  modificationDate?: Date // Last modification date
  opacity?: number       // Opacity (0-1, default: 1)
}

/**
 * Text annotation (sticky note)
 */
export interface TextAnnotation extends BaseAnnotation {
  type: 'text'
  x: number              // X position
  y: number              // Y position
  icon?: AnnotationIcon  // Icon type (default: 'Note')
  open?: boolean         // Whether note is initially open (default: false)
}

/**
 * Highlight annotation
 */
export interface HighlightAnnotation extends BaseAnnotation {
  type: 'highlight'
  quadPoints: number[]   // Array of quad points [x1,y1,x2,y2,x3,y3,x4,y4,...] for highlighted area
}

/**
 * Underline annotation
 */
export interface UnderlineAnnotation extends BaseAnnotation {
  type: 'underline'
  quadPoints: number[]   // Array of quad points for underlined text
}

/**
 * Strikeout annotation
 */
export interface StrikeOutAnnotation extends BaseAnnotation {
  type: 'strikeout'
  quadPoints: number[]   // Array of quad points for struck-out text
}

/**
 * Square annotation (rectangle markup)
 */
export interface SquareAnnotation extends BaseAnnotation {
  type: 'square'
  x: number              // X position
  y: number              // Y position
  width: number          // Width
  height: number         // Height
  borderWidth?: number   // Border width (default: 1)
  fillColor?: Color      // Fill color (optional)
}

/**
 * Circle annotation
 */
export interface CircleAnnotation extends BaseAnnotation {
  type: 'circle'
  x: number              // Center X
  y: number              // Center Y
  width: number          // Width of bounding box
  height: number         // Height of bounding box
  borderWidth?: number   // Border width (default: 1)
  fillColor?: Color      // Fill color (optional)
}

/**
 * Free text annotation (text box directly on page)
 */
export interface FreeTextAnnotation extends BaseAnnotation {
  type: 'freetext'
  x: number              // X position
  y: number              // Y position
  width: number          // Width
  height: number         // Height
  fontSize?: number      // Font size (default: 12)
  fontColor?: Color      // Font color (default: black)
  backgroundColor?: Color // Background color (optional)
  borderWidth?: number   // Border width (default: 1)
  align?: 'left' | 'center' | 'right' // Text alignment (default: 'left')
}

/**
 * Stamp annotation
 */
export interface StampAnnotation extends BaseAnnotation {
  type: 'stamp'
  x: number              // X position
  y: number              // Y position
  width: number          // Width
  height: number         // Height
  stampType: StampType   // Stamp type
  rotation?: number      // Rotation angle in degrees (default: 0)
}

/**
 * Ink annotation (freehand drawing)
 */
export interface InkAnnotation extends BaseAnnotation {
  type: 'ink'
  inkLists: number[][][] // Array of stroke paths, each containing [x,y] points
  borderWidth?: number   // Line width (default: 1)
}

/**
 * Union type for all annotation types
 */
export type Annotation =
  | TextAnnotation
  | HighlightAnnotation
  | UnderlineAnnotation
  | StrikeOutAnnotation
  | SquareAnnotation
  | CircleAnnotation
  | FreeTextAnnotation
  | StampAnnotation
  | InkAnnotation

// =======================
// WATERMARKS
// =======================

/**
 * Watermark position preset
 */
export type WatermarkPosition =
  | 'center'           // Center of page
  | 'top-left'         // Top left corner
  | 'top-center'       // Top center
  | 'top-right'        // Top right corner
  | 'middle-left'      // Middle left
  | 'middle-right'     // Middle right
  | 'bottom-left'      // Bottom left corner
  | 'bottom-center'    // Bottom center
  | 'bottom-right'     // Bottom right corner
  | 'diagonal'         // Diagonal across page
  | 'custom'           // Custom x, y position

/**
 * Base watermark options
 */
export interface BaseWatermark {
  pages?: number[] | 'all'  // Pages to apply watermark (default: 'all')
  opacity?: number          // Opacity 0-1 (default: 0.3)
  rotation?: number         // Rotation in degrees (default: 0)
  position?: WatermarkPosition // Position preset (default: 'center')
  x?: number                // Custom X position (when position='custom')
  y?: number                // Custom Y position (when position='custom')
  layer?: 'background' | 'foreground' // Render behind or in front of content (default: 'background')
}

/**
 * Text watermark options
 */
export interface TextWatermark extends BaseWatermark {
  type: 'text'
  text: string              // Watermark text
  fontSize?: number         // Font size (default: 48)
  font?: PDFBaseFont        // Font (default: 'Helvetica-Bold')
  color?: Color             // Text color (default: gray)
}

/**
 * Image watermark options
 */
export interface ImageWatermark extends BaseWatermark {
  type: 'image'
  source: string | Buffer   // Image path or buffer
  width?: number            // Image width (default: auto)
  height?: number           // Image height (default: auto)
  scale?: number            // Scale factor (default: 1)
}

/**
 * Union type for all watermark types
 */
export type Watermark = TextWatermark | ImageWatermark

// =======================
// HYPERLINKS
// =======================

/**
 * Link border style
 */
export interface LinkBorderStyle {
  width?: number        // Border width in points (default: 0 = invisible)
  style?: 'solid' | 'dashed' | 'beveled' | 'inset' | 'underline'  // Border style (default: 'solid')
  color?: Color         // Border color (default: [0, 0, 1] = blue)
}

/**
 * Base link options
 */
export interface BaseLink {
  page?: number         // Page number (0-indexed) where link appears (default: current page)
  x: number             // X position of clickable area
  y: number             // Y position of clickable area
  width: number         // Width of clickable area
  height: number        // Height of clickable area
  border?: LinkBorderStyle  // Border style (default: invisible)
  highlight?: 'none' | 'invert' | 'outline' | 'push'  // Visual effect on click (default: 'invert')
}

/**
 * External link (URL) options
 */
export interface ExternalLink extends BaseLink {
  type: 'url'
  url: string           // URL to link to (e.g., 'https://example.com')
}

/**
 * Internal link (page) options
 */
export interface InternalLink extends BaseLink {
  type: 'page'
  targetPage: number    // Target page number (0-indexed)
  fit?: 'Fit' | 'FitH' | 'FitV' | 'XYZ'  // How to display target page (default: 'Fit')
  zoom?: number         // Zoom level (for 'XYZ' fit, default: null = inherit)
  top?: number          // Y coordinate for 'FitH' or 'XYZ'
  left?: number         // X coordinate for 'FitV' or 'XYZ'
}

/**
 * Union type for all link types
 */
export type Link = ExternalLink | InternalLink

// =======================
// PAGE OPERATIONS
// =======================

/**
 * Page rotation angle in degrees (clockwise)
 * Valid values: 0, 90, 180, 270
 */
export type PageRotation = 0 | 90 | 180 | 270

// =======================
// METADATA & PROPERTIES
// =======================

/**
 * Custom metadata key-value pairs
 * Used for XMP metadata and custom properties
 */
export interface CustomMetadata {
  [key: string]: string | number | boolean | Date
}

/**
 * Extended document metadata options
 */
export interface ExtendedMetadata {
  // Dublin Core metadata
  description?: string      // Document description
  language?: string         // Language code (e.g., 'en-US', 'es-ES')
  rights?: string          // Copyright/rights information

  // Custom properties
  custom?: CustomMetadata  // Custom key-value pairs

  // Additional XMP properties
  category?: string        // Document category
  contentType?: string     // Content type/format
  identifier?: string      // Unique identifier (ISBN, DOI, etc.)
  source?: string          // Source document/reference
  relation?: string        // Related document reference
  coverage?: string        // Spatial or temporal coverage

  // PDF-specific metadata
  trapped?: 'True' | 'False' | 'Unknown'  // Trapping status
  gts_pdfxVersion?: string                 // PDF/X version
  gts_pdfxConformance?: string            // PDF/X conformance
}

// =======================
// COMPRESSION & OPTIMIZATION
// =======================

/**
 * Image compression quality
 */
export type ImageQuality = 'low' | 'medium' | 'high' | 'maximum'

/**
 * Stream compression level (using zlib/Flate)
 */
export type CompressionLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

/**
 * Compression and optimization options
 */
export interface CompressionOptions {
  // Image compression
  compressImages?: boolean          // Enable image compression (default: false)
  imageQuality?: ImageQuality       // Image quality level (default: 'high')
  maxImageWidth?: number            // Max image width in pixels (default: no limit)
  maxImageHeight?: number           // Max image height in pixels (default: no limit)

  // Stream compression
  compressStreams?: boolean         // Enable stream compression with Flate (default: true)
  compressionLevel?: CompressionLevel  // Compression level 0-9 (default: 6)

  // Font optimization
  subsetFonts?: boolean            // Subset embedded fonts (default: false)

  // Object optimization
  deduplicateObjects?: boolean     // Remove duplicate objects (default: false)
  removeUnusedObjects?: boolean    // Remove unreferenced objects (default: false)
}

// =======================
// FILE ATTACHMENTS
// =======================

/**
 * File attachment options (document-level)
 */
export interface FileAttachment {
  name: string              // File name (e.g., 'document.pdf', 'data.xlsx')
  file: string | Buffer     // File path or Buffer data
  description?: string      // Optional description
  mimeType?: string         // MIME type (e.g., 'application/pdf', 'text/plain')
  creationDate?: Date       // File creation date
  modificationDate?: Date   // File modification date
}

/**
 * File attachment annotation options (page-level)
 */
export interface FileAttachmentAnnotation {
  name: string              // File name
  file: string | Buffer     // File path or Buffer data
  x: number                 // X position on page
  y: number                 // Y position on page
  page?: number             // Page number (0-indexed, default: current page)
  icon?: 'Graph' | 'PushPin' | 'Paperclip' | 'Tag'  // Annotation icon (default: 'PushPin')
  description?: string      // Optional description
  mimeType?: string         // MIME type
}

// =======================
// ADVANCED TEXT FEATURES
// =======================

/**
 * Text rendering mode
 * - 0: Fill (default)
 * - 1: Stroke
 * - 2: Fill then stroke
 * - 3: Invisible (for clipping)
 * - 4: Fill and add to clipping path
 * - 5: Stroke and add to clipping path
 * - 6: Fill, stroke, and add to clipping path
 * - 7: Add to clipping path (no fill or stroke)
 */
export type TextRenderingMode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

/**
 * Text outline options (stroked text)
 */
export interface TextOutlineOptions {
  text: string
  x: number
  y: number
  fontSize?: number
  font?: PDFBaseFont
  strokeColor?: Color
  fillColor?: Color
  lineWidth?: number
  renderingMode?: TextRenderingMode
}

// =======================
// IMAGE MASKS
// =======================

/**
 * Image mask options
 */
export interface ImageMaskOptions {
  /**
   * Mask type:
   * - 'luminosity': Use luminosity of mask image (0=transparent, 255=opaque)
   * - 'stencil': Binary mask (1-bit, 0=transparent, 1=opaque)
   */
  type?: 'luminosity' | 'stencil'

  /**
   * Whether to invert the mask (swap transparent/opaque)
   */
  inverted?: boolean
}

// =======================
// OPTIONAL CONTENT GROUPS (LAYERS)
// =======================

/**
 * Layer (Optional Content Group) usage intent
 * - 'View': For viewing on screen
 * - 'Design': For design/editing purposes
 * - 'All': For all purposes
 */
export type LayerIntent = 'View' | 'Design' | 'All'

/**
 * Layer (Optional Content Group) options
 */
export interface LayerOptions {
  name: string                    // Layer name (e.g., 'Background', 'Text', 'Images')
  visible?: boolean              // Initial visibility (default: true)
  locked?: boolean               // Whether layer can be toggled by user (default: false)
  intent?: LayerIntent | LayerIntent[]  // Usage intent (default: 'View')
  printable?: boolean            // Whether layer appears when printing (default: same as visible)
  exportable?: boolean           // Whether layer is included in exports (default: true)
}

/**
 * Layer state for a specific usage context
 */
export interface LayerState {
  layerName: string
  visible: boolean
}

// =======================
// FORM XOBJECTS / TEMPLATES
// =======================

/**
 * Form XObject drawing context - provides drawing commands for template content
 */
export type FormXObjectDrawFunction = (ctx: {
  // Path construction
  moveTo: (x: number, y: number) => void
  lineTo: (x: number, y: number) => void
  bezierCurveTo: (cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) => void
  quadraticCurveTo: (cpx: number, cpy: number, x: number, y: number) => void
  rect: (x: number, y: number, width: number, height: number) => void
  circle: (x: number, y: number, radius: number) => void
  ellipse: (x: number, y: number, radiusX: number, radiusY: number) => void
  path: (svgPath: string) => void

  // Path operations
  closePath: () => void
  fill: () => void
  stroke: () => void
  fillAndStroke: () => void
  clip: () => void

  // Colors
  setFillColor: (r: number, g: number, b: number) => void
  setStrokeColor: (r: number, g: number, b: number) => void

  // Graphics state
  setLineWidth: (width: number) => void
  setLineCap: (cap: 0 | 1 | 2) => void  // 0=butt, 1=round, 2=square
  setLineJoin: (join: 0 | 1 | 2) => void  // 0=miter, 1=round, 2=bevel
  setDashPattern: (pattern: number[], phase?: number) => void
  setOpacity: (opacity: number) => void

  // Text
  text: (text: string, x: number, y: number, fontSize?: number) => void

  // Transformations
  translate: (x: number, y: number) => void
  rotate: (angle: number) => void
  scale: (sx: number, sy?: number) => void

  // State
  saveGraphicsState: () => void
  restoreGraphicsState: () => void
}) => void

/**
 * Form XObject options - defines a reusable template/graphic
 */
export interface FormXObjectOptions {
  width: number                    // Width of the form XObject bounding box
  height: number                   // Height of the form XObject bounding box
  draw: FormXObjectDrawFunction    // Function that draws the template content
  name?: string                    // Optional custom name (auto-generated if not provided)
}

/**
 * Form XObject placement options - controls how template is placed on page
 */
export interface FormXObjectPlacementOptions {
  x?: number              // X position (default: 0)
  y?: number              // Y position (default: 0)
  width?: number          // Target width (scales the XObject, default: original width)
  height?: number         // Target height (scales the XObject, default: original height)
  scale?: number          // Uniform scale factor (alternative to width/height)
  scaleX?: number         // Horizontal scale factor
  scaleY?: number         // Vertical scale factor
  rotate?: number         // Rotation angle in degrees (clockwise)
  opacity?: number        // Opacity 0-1 (default: 1)
}

// =======================
// QR CODES
// =======================

/**
 * QR Code error correction level
 * Higher levels can recover from more damage but result in larger QR codes
 * - L: Low (~7% recovery)
 * - M: Medium (~15% recovery) - Default
 * - Q: Quartile (~25% recovery)
 * - H: High (~30% recovery) - Best for QR codes with logo in center
 */
export type QRCodeErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

/**
 * QR Code logo/center image options
 */
export interface QRCodeLogoOptions {
  source: string | Buffer       // Image path or buffer (PNG, JPEG)
  width?: number                // Logo width in pixels (default: 20% of QR size)
  height?: number               // Logo height in pixels (default: 20% of QR size)
  margin?: number               // Margin around logo (default: 2 pixels)
  backgroundColor?: string      // Background color behind logo (default: white)
  borderRadius?: number         // Border radius for logo background (default: 0)
}

/**
 * QR Code data type helpers
 */
export interface QRCodeData {
  /** Plain text or custom data */
  text?: string

  /** URL/Link */
  url?: string

  /** Email address with optional subject and body */
  email?: {
    address: string
    subject?: string
    body?: string
  }

  /** Phone number */
  phone?: string

  /** SMS with optional message */
  sms?: {
    phone: string
    message?: string
  }

  /** WiFi network credentials */
  wifi?: {
    ssid: string              // Network name
    password: string          // Network password
    encryption?: 'WPA' | 'WEP' | 'nopass'  // Security type (default: WPA)
    hidden?: boolean          // Hidden network (default: false)
  }

  /** vCard contact information */
  vcard?: {
    firstName: string
    lastName: string
    organization?: string
    title?: string
    phone?: string
    email?: string
    url?: string
    address?: {
      street?: string
      city?: string
      state?: string
      zip?: string
      country?: string
    }
  }

  /** Geographic coordinates */
  geo?: {
    latitude: number
    longitude: number
  }

  /** Calendar event */
  event?: {
    title: string
    location?: string
    startDate: Date
    endDate?: Date
    description?: string
  }
}

/**
 * QR Code options
 */
export interface QRCodeOptions {
  // Position (required)
  x: number                              // X position on page
  y: number                              // Y position on page

  // Size
  size?: number                          // QR code size in points (default: 100)

  // Data (provide one)
  data: string | QRCodeData              // QR code data

  // Visual customization
  foregroundColor?: string               // QR code color (default: black)
  backgroundColor?: string               // Background color (default: white)

  // Quality & error correction
  errorCorrectionLevel?: QRCodeErrorCorrectionLevel  // Error correction (default: M, use H for logo)
  margin?: number                        // Quiet zone margin in modules (default: 4)

  // Logo/Center image
  logo?: QRCodeLogoOptions               // Custom logo in center

  // Advanced options
  version?: number                       // QR code version 1-40 (auto if not specified)
  maskPattern?: number                   // Mask pattern 0-7 (auto if not specified)
}
