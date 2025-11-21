/**
 * PDFStudio - Modern PDF generation library with bar chart support
 * @packageDocumentation
 */

export { PDFDocument } from './core/PDFDocument'

// Configuration
export { configure, resetConfig } from './config/defaults'
export type { PDFStudioConfig } from './config/defaults'

export {
  // Chart types
  BarChartOptions,
  BarChartData,
  GroupedBarChartOptions,
  GroupedBarChartData,
  StackedBarChartOptions,
  StackedBarChartData,
  LineChartOptions,
  LineChartData,
  MultiLineChartOptions,
  MultiLineChartData,
  PieChartOptions,
  PieChartData,
  DonutChartOptions,
  GridStyle,
  ShadowOptions,
  GradientOptions,
  LegendOptions,
  LegendItem,
  BorderOptions,

  // Document types
  PDFDocumentOptions,
  DocumentInfo,
  PageSize,
  PageLayout,
  Margins,
  PageNumberOptions,
  PageNumberPosition,
  PageNumberFormat,

  // Security types
  PDFSecurityOptions,
  PDFPermissions,

  // Hyperlink types
  Link,
  ExternalLink,
  InternalLink,
  LinkBorderStyle,

  // Page operation types
  PageRotation,

  // Metadata types
  CustomMetadata,
  ExtendedMetadata,

  // Compression types
  ImageQuality,
  CompressionLevel,
  CompressionOptions,

  // Attachment types
  FileAttachment,
  FileAttachmentAnnotation,

  // Font types
  FontOptions,
  PDFBaseFont,
  PDFEncoding,
  CustomFont,

  // Image types
  ImageOptions,
  ImageFormat,

  // QR Code types
  QRCodeOptions,
  QRCodeData,
  QRCodeLogoOptions,
  QRCodeErrorCorrectionLevel,

  // Text types
  TextOptions,
  TextAlign,
  TextVAlign,

  // Table types
  TableOptions,
  TableColumn,
  TableRow,
  TableCell,
  TableBorders,
  TableBorderStyle,
  TableHeaderStyle,
  CellAlign,
  CellVAlign,

  // Constants
  PAGE_SIZES
} from './types'
