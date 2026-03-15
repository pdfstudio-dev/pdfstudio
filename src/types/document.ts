import type { Color } from './graphics';

/**
 * Page number position
 */
export type PageNumberPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/**
 * Page number format function
 */
export type PageNumberFormat = (current: number, total: number) => string;

/**
 * Page numbering options
 */
export interface PageNumberOptions {
  enabled?: boolean;
  position?: PageNumberPosition;
  format?: PageNumberFormat | string; // Function or template string
  fontSize?: number;
  color?: string;
  margin?: number; // Distance from edge
  startAt?: number; // Start numbering at specific page
  excludePages?: number[]; // Pages to exclude (0-indexed)
}

// ==================
// HEADERS & FOOTERS
// ==================

/**
 * Header/Footer alignment
 */
export type HeaderFooterAlign = 'left' | 'center' | 'right';

/**
 * Page rule for conditional content
 */
export type PageRule = 'all' | 'first' | 'notFirst' | 'odd' | 'even';

/**
 * Header/Footer content - can be text or function
 */
export type HeaderFooterContent = string | ((pageNumber: number, totalPages: number) => string);

/**
 * Image in header/footer
 */
export interface HeaderFooterImage {
  source: string | Buffer; // Path or buffer
  width?: number;
  height?: number;
  align?: HeaderFooterAlign;
}

/**
 * Text item in header/footer
 */
export interface HeaderFooterText {
  content: HeaderFooterContent;
  align?: HeaderFooterAlign;
  fontSize?: number;
  font?: PDFBaseFont;
  color?: string;
}

/**
 * Header configuration
 */
export interface HeaderOptions {
  enabled?: boolean;
  height?: number; // Reserved space for header
  margin?: number; // Margin from top edge

  // Text content (can have left, center, right)
  left?: HeaderFooterContent;
  center?: HeaderFooterContent;
  right?: HeaderFooterContent;

  // Advanced text with styling
  text?: HeaderFooterText[];

  // Images
  image?: HeaderFooterImage;

  // Styling
  fontSize?: number;
  font?: PDFBaseFont;
  color?: string;

  // Lines/borders
  line?: boolean; // Draw a line below header
  lineWidth?: number;
  lineColor?: string;

  // Page rules
  pages?: PageRule; // Which pages to show on (default: 'all')
  excludePages?: number[]; // Specific pages to exclude (0-indexed)
}

/**
 * Footer configuration
 */
export interface FooterOptions {
  enabled?: boolean;
  height?: number; // Reserved space for footer
  margin?: number; // Margin from bottom edge

  // Text content (can have left, center, right)
  left?: HeaderFooterContent;
  center?: HeaderFooterContent;
  right?: HeaderFooterContent;

  // Advanced text with styling
  text?: HeaderFooterText[];

  // Images
  image?: HeaderFooterImage;

  // Styling
  fontSize?: number;
  font?: PDFBaseFont;
  color?: string;

  // Lines/borders
  line?: boolean; // Draw a line above footer
  lineWidth?: number;
  lineColor?: string;

  // Page rules
  pages?: PageRule; // Which pages to show on (default: 'all')
  excludePages?: number[]; // Specific pages to exclude (0-indexed)
}

/**
 * Combined header and footer options
 */
export interface HeaderFooterOptions {
  header?: HeaderOptions;
  footer?: FooterOptions;
}

/**
 * PDF font encoding options
 */
export type PDFEncoding =
  | 'WinAnsiEncoding' // Western European (default)
  | 'MacRomanEncoding' // Mac Roman
  | 'StandardEncoding' // PDF Standard
  | 'MacExpertEncoding' // Mac Expert
  | 'PDFDocEncoding'; // PDF Doc Encoding

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
  | 'ZapfDingbats';

/**
 * Custom font source (TrueType/OpenType)
 */
export interface CustomFont {
  name: string; // Font name to use in document (e.g., 'MyCustomFont')
  source: string | Buffer; // Path to .ttf/.otf file or Buffer
  subset?: boolean; // Enable font subsetting to reduce file size (default: false)
}

/**
 * Font configuration options
 */
export interface FontOptions {
  baseFont?: PDFBaseFont;
  encoding?: PDFEncoding;
  customFont?: CustomFont; // Custom TrueType/OpenType font
}

/**
 * Margin configuration
 */
export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Page layout orientation
 */
export type PageLayout = 'portrait' | 'landscape';

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
  | 'Letter' // Carta (US)
  | 'Legal' // Oficio (US)
  | 'Tabloid' // Tabloide
  | 'Ledger' // Ledger (Tabloid landscape)
  | 'Executive' // Ejecutivo
  | 'HalfLetter' // Media Carta
  | 'Statement' // Statement (Half Letter)
  // Other
  | 'Folio'; // Folio

/**
 * Document metadata information
 */
export interface DocumentInfo {
  Title?: string; // Document title
  Author?: string; // Author name
  Subject?: string; // Document subject
  Keywords?: string; // Keywords for search
  Creator?: string; // Application that created the document
  Producer?: string; // PDF producer
  CreationDate?: Date; // Creation date (auto-generated if not provided)
  ModDate?: Date; // Modification date (auto-generated if not provided)
  displayTitle?: boolean; // Display title in viewer window (default: false)
  extendedMetadata?: import('./annotations').ExtendedMetadata; // Extended metadata (XMP, Dublin Core, custom properties)
}

/**
 * Page size definitions in points (1 point = 1/72 inch)
 *
 * Common sizes:
 * - Letter (Carta): 8.5" x 11" (US standard)
 * - Legal (Oficio): 8.5" x 14" (US legal)
 * - A4: 210mm x 297mm (ISO standard)
 */
export const PAGE_SIZES: Record<PageSize, [number, number]> = {
  // ISO A Series (portrait)
  A3: [841.89, 1190.55], // 297mm × 420mm
  A4: [595.28, 841.89], // 210mm × 297mm
  A5: [419.53, 595.28], // 148mm × 210mm
  A6: [297.64, 419.53], // 105mm × 148mm

  // ISO B Series (portrait)
  B4: [708.66, 1000.63], // 250mm × 353mm
  B5: [498.9, 708.66], // 176mm × 250mm

  // North American (portrait)
  Letter: [612, 792], // 8.5" × 11" (Carta)
  Legal: [612, 1008], // 8.5" × 14" (Oficio)
  Tabloid: [792, 1224], // 11" × 17" (Tabloide)
  Ledger: [1224, 792], // 17" × 11" (Tabloid landscape)
  Executive: [522, 756], // 7.25" × 10.5" (Ejecutivo)
  HalfLetter: [396, 612], // 5.5" × 8.5" (Media Carta)
  Statement: [396, 612], // 5.5" × 8.5" (same as HalfLetter)

  // Other
  Folio: [612, 936], // 8.5" × 13"
} as const;

/**
 * PDF security permissions
 */
export interface PDFPermissions {
  printing?: 'lowResolution' | 'highResolution' | false; // Allow printing (default: 'highResolution')
  modifying?: boolean; // Allow modifying the document (default: true)
  copying?: boolean; // Allow copying text and graphics (default: true)
  annotating?: boolean; // Allow adding annotations (default: true)
  fillingForms?: boolean; // Allow filling form fields (default: true)
  contentAccessibility?: boolean; // Allow content extraction for accessibility (default: true)
  documentAssembly?: boolean; // Allow assembling document (default: true)
}

/**
 * PDF security options
 */
export interface PDFSecurityOptions {
  userPassword?: string; // Password required to open the document
  ownerPassword?: string; // Password required to change permissions
  permissions?: PDFPermissions; // Granular permissions
}

/**
 * PDF Document configuration options
 */
export interface PDFDocumentOptions {
  size?: PageSize | [number, number];
  layout?: PageLayout; // Page orientation: 'portrait' or 'landscape' (default: 'portrait')
  margins?: number | Margins; // Single number for all sides, or individual margins
  pageNumbers?: PageNumberOptions;
  headerFooter?: HeaderFooterOptions; // Headers and footers configuration
  font?: FontOptions;
  info?: DocumentInfo; // Document metadata
  autoFirstPage?: boolean; // Automatically create first page (default: true)
  pdfVersion?: string; // PDF version: '1.3', '1.4', '1.5', '1.6', '1.7' (default: '1.4')
  security?: PDFSecurityOptions; // Security and encryption options
  bookmarks?: import('./annotations').BookmarkOptions[]; // Document bookmarks/outlines (table of contents)
  form?: import('./annotations').FormOptions; // Interactive form fields (AcroForm)
  signature?: import('./annotations').SignatureFieldOptions[]; // Digital signature fields
  pdfA?: import('./annotations').PDFAOptions; // PDF/A compliance options
  compression?: import('./annotations').CompressionOptions; // Compression and optimization options
}

/**
 * Page rotation angle in degrees (clockwise)
 * Valid values: 0, 90, 180, 270
 */
export type PageRotation = 0 | 90 | 180 | 270;
