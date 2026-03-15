import type { PDFBaseFont } from './document';

// ==================
// TEXT
// ==================

/**
 * Text alignment options
 */
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

/**
 * Vertical text alignment
 */
export type TextVAlign = 'top' | 'center' | 'bottom';

/**
 * Advanced text options
 */
export interface TextOptions {
  // Position
  x?: number;
  y?: number;

  // Size constraints
  width?: number;
  height?: number;

  // Font
  font?: PDFBaseFont; // Font family (e.g. 'Helvetica-Bold', 'Times-Italic')
  fontSize?: number; // Font size in points

  // Alignment
  align?: TextAlign;
  valign?: TextVAlign;

  // Line spacing
  lineGap?: number; // Extra space between lines (default: 0)
  lineHeight?: number; // Total line height (overrides lineGap)

  // Character and word spacing
  characterSpacing?: number; // Extra space between characters
  wordSpacing?: number; // Extra space between words

  // Text decoration
  underline?: boolean;
  strike?: boolean;

  // Link
  link?: string; // URL for clickeable text
  goTo?: string; // Navigate to named destination (PDFKit compatible)
  destination?: string; // Create a named destination at this text position (PDFKit compatible)

  // Flow control
  continued?: boolean; // Continue on same line (for inline style changes)

  // Paragraph
  indent?: number; // First line indent
  paragraphGap?: number; // Space after paragraph

  // Transformation
  rotation?: number; // Rotate text in degrees (clockwise, PDFKit compatible)

  // Multi-column layout (PDFKit compatible)
  columns?: number; // Number of columns to flow text into
  columnGap?: number; // Gap between columns in points (default: 18, which is 1/4 inch)

  // Advanced
  ellipsis?: boolean | string; // Add ellipsis if text doesn't fit
}

// ==================
// LISTS
// ==================

/**
 * List bullet style (PDFKit compatible)
 */
export type BulletStyle =
  | 'disc'
  | 'circle'
  | 'square'
  | 'decimal'
  | 'lower-alpha'
  | 'upper-alpha'
  | 'lower-roman'
  | 'upper-roman'
  | string; // string for custom bullets

/**
 * List options (PDFKit compatible)
 */
export interface ListOptions {
  x?: number; // X position (default: current X)
  y?: number; // Y position (default: current Y)
  width?: number; // Maximum width for list items
  font?: PDFBaseFont; // Font for list items
  fontSize?: number; // Font size (default: 12)
  bulletStyle?: BulletStyle; // Bullet style (default: 'disc')
  bulletIndent?: number; // Indent for bullets (default: 0)
  textIndent?: number; // Indent for text after bullet (default: 20)
  lineGap?: number; // Space between lines (default: 0)
  bulletGap?: number; // Space between bullet and text (default: 10)
  listGap?: number; // Space between list items (default: 5)
}

// ==================
// TABLES
// ==================

/**
 * Table cell alignment
 */
export type CellAlign = 'left' | 'center' | 'right';
export type CellVAlign = 'top' | 'middle' | 'bottom';

/**
 * Table cell data
 */
export type TableCell =
  | string
  | number
  | {
      content: string | number;
      align?: CellAlign;
      valign?: CellVAlign;
      colSpan?: number;
      rowSpan?: number;
      backgroundColor?: string;
      textColor?: string;
      fontSize?: number;
      bold?: boolean;
    };

/**
 * Table row data
 */
export type TableRow = TableCell[];

/**
 * Column definition
 */
export interface TableColumn {
  header: string;
  width?: number | 'auto' | '*'; // Fixed width, auto-size, or proportional
  align?: CellAlign;
  valign?: CellVAlign;
}

/**
 * Table border style
 */
export interface TableBorderStyle {
  color?: string;
  width?: number;
  style?: 'solid' | 'dashed' | 'dotted';
}

/**
 * Table border configuration
 */
export interface TableBorders {
  top?: boolean | TableBorderStyle;
  bottom?: boolean | TableBorderStyle;
  left?: boolean | TableBorderStyle;
  right?: boolean | TableBorderStyle;
  horizontal?: boolean | TableBorderStyle; // Internal horizontal lines
  vertical?: boolean | TableBorderStyle; // Internal vertical lines
  header?: boolean | TableBorderStyle; // Separator after header
}

/**
 * Table header style
 */
export interface TableHeaderStyle {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  bold?: boolean;
  align?: CellAlign;
  valign?: CellVAlign;
  height?: number;
}

/**
 * Table options
 */
export interface TableOptions {
  // Position
  x: number;
  y: number;
  width?: number; // Total table width (if not provided, uses columns widths)

  // Data
  columns?: TableColumn[]; // Column definitions
  headers?: string[]; // Simple header strings (alternative to columns)
  rows: TableRow[]; // Table data

  // Header style
  headerStyle?: TableHeaderStyle;

  // Row styling
  rowHeight?: number;
  alternateRowColor?: string; // Color for alternating rows (zebra striping)

  // Cell styling
  cellPadding?: number;
  fontSize?: number;
  textColor?: string;

  // Borders
  borders?: TableBorders | boolean; // true = all borders, false = no borders

  // Default alignment
  defaultAlign?: CellAlign;
  defaultVAlign?: CellVAlign;

  // Auto page breaks
  autoPageBreak?: boolean; // If true, table will automatically continue on new pages (default: false)
  bottomMargin?: number; // Bottom margin for page breaks (default: 50)
  repeatHeader?: boolean; // If true, header will be repeated on each new page (default: true)
}
