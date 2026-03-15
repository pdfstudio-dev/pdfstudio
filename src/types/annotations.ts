import type { Color } from './graphics';
import type { PDFBaseFont } from './document';

// =======================
// PDF ANNOTATIONS
// =======================

/**
 * Annotation icon for text annotations (sticky notes)
 */
export type AnnotationIcon =
  | 'Comment'
  | 'Help'
  | 'Insert'
  | 'Key'
  | 'NewParagraph'
  | 'Note'
  | 'Paragraph';

/**
 * Stamp annotation types
 */
export type StampType =
  | 'Approved'
  | 'Experimental'
  | 'NotApproved'
  | 'AsIs'
  | 'Expired'
  | 'NotForPublicRelease'
  | 'Confidential'
  | 'Final'
  | 'Sold'
  | 'Departmental'
  | 'ForComment'
  | 'TopSecret'
  | 'ForPublicRelease'
  | 'Draft';

/**
 * Base annotation options
 */
export interface BaseAnnotation {
  page: number; // Page number (0-based)
  author?: string; // Author of the annotation
  subject?: string; // Subject/title of the annotation
  contents?: string; // Text content of the annotation
  color?: Color; // Annotation color
  creationDate?: Date; // Creation date (defaults to now)
  modificationDate?: Date; // Last modification date
  opacity?: number; // Opacity (0-1, default: 1)
}

/**
 * Text annotation (sticky note)
 */
export interface TextAnnotation extends BaseAnnotation {
  type: 'text';
  x: number; // X position
  y: number; // Y position
  icon?: AnnotationIcon; // Icon type (default: 'Note')
  open?: boolean; // Whether note is initially open (default: false)
}

/**
 * Highlight annotation
 */
export interface HighlightAnnotation extends BaseAnnotation {
  type: 'highlight';
  quadPoints: number[]; // Array of quad points [x1,y1,x2,y2,x3,y3,x4,y4,...] for highlighted area
}

/**
 * Underline annotation
 */
export interface UnderlineAnnotation extends BaseAnnotation {
  type: 'underline';
  quadPoints: number[]; // Array of quad points for underlined text
}

/**
 * Strikeout annotation
 */
export interface StrikeOutAnnotation extends BaseAnnotation {
  type: 'strikeout';
  quadPoints: number[]; // Array of quad points for struck-out text
}

/**
 * Square annotation (rectangle markup)
 */
export interface SquareAnnotation extends BaseAnnotation {
  type: 'square';
  x: number; // X position
  y: number; // Y position
  width: number; // Width
  height: number; // Height
  borderWidth?: number; // Border width (default: 1)
  fillColor?: Color; // Fill color (optional)
}

/**
 * Circle annotation
 */
export interface CircleAnnotation extends BaseAnnotation {
  type: 'circle';
  x: number; // Center X
  y: number; // Center Y
  width: number; // Width of bounding box
  height: number; // Height of bounding box
  borderWidth?: number; // Border width (default: 1)
  fillColor?: Color; // Fill color (optional)
}

/**
 * Free text annotation (text box directly on page)
 */
export interface FreeTextAnnotation extends BaseAnnotation {
  type: 'freetext';
  x: number; // X position
  y: number; // Y position
  width: number; // Width
  height: number; // Height
  fontSize?: number; // Font size (default: 12)
  fontColor?: Color; // Font color (default: black)
  backgroundColor?: Color; // Background color (optional)
  borderWidth?: number; // Border width (default: 1)
  align?: 'left' | 'center' | 'right'; // Text alignment (default: 'left')
}

/**
 * Stamp annotation
 */
export interface StampAnnotation extends BaseAnnotation {
  type: 'stamp';
  x: number; // X position
  y: number; // Y position
  width: number; // Width
  height: number; // Height
  stampType: StampType; // Stamp type
  rotation?: number; // Rotation angle in degrees (default: 0)
}

/**
 * Ink annotation (freehand drawing)
 */
export interface InkAnnotation extends BaseAnnotation {
  type: 'ink';
  inkLists: number[][][]; // Array of stroke paths, each containing [x,y] points
  borderWidth?: number; // Line width (default: 1)
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
  | InkAnnotation;

// =======================
// WATERMARKS
// =======================

/**
 * Watermark position preset
 */
export type WatermarkPosition =
  | 'center' // Center of page
  | 'top-left' // Top left corner
  | 'top-center' // Top center
  | 'top-right' // Top right corner
  | 'middle-left' // Middle left
  | 'middle-right' // Middle right
  | 'bottom-left' // Bottom left corner
  | 'bottom-center' // Bottom center
  | 'bottom-right' // Bottom right corner
  | 'diagonal' // Diagonal across page
  | 'custom'; // Custom x, y position

/**
 * Base watermark options
 */
export interface BaseWatermark {
  pages?: number[] | 'all'; // Pages to apply watermark (default: 'all')
  opacity?: number; // Opacity 0-1 (default: 0.3)
  rotation?: number; // Rotation in degrees (default: 0)
  position?: WatermarkPosition; // Position preset (default: 'center')
  x?: number; // Custom X position (when position='custom')
  y?: number; // Custom Y position (when position='custom')
  layer?: 'background' | 'foreground'; // Render behind or in front of content (default: 'background')
}

/**
 * Text watermark options
 */
export interface TextWatermark extends BaseWatermark {
  type: 'text';
  text: string; // Watermark text
  fontSize?: number; // Font size (default: 48)
  font?: PDFBaseFont; // Font (default: 'Helvetica-Bold')
  color?: Color; // Text color (default: gray)
}

/**
 * Image watermark options
 */
export interface ImageWatermark extends BaseWatermark {
  type: 'image';
  source: string | Buffer; // Image path or buffer
  width?: number; // Image width (default: auto)
  height?: number; // Image height (default: auto)
  scale?: number; // Scale factor (default: 1)
}

/**
 * Union type for all watermark types
 */
export type Watermark = TextWatermark | ImageWatermark;

// =======================
// HYPERLINKS
// =======================

/**
 * Link border style
 */
export interface LinkBorderStyle {
  width?: number; // Border width in points (default: 0 = invisible)
  style?: 'solid' | 'dashed' | 'beveled' | 'inset' | 'underline'; // Border style (default: 'solid')
  color?: Color; // Border color (default: [0, 0, 1] = blue)
}

/**
 * Base link options
 */
export interface BaseLink {
  page?: number; // Page number (0-indexed) where link appears (default: current page)
  x: number; // X position of clickable area
  y: number; // Y position of clickable area
  width: number; // Width of clickable area
  height: number; // Height of clickable area
  border?: LinkBorderStyle; // Border style (default: invisible)
  highlight?: 'none' | 'invert' | 'outline' | 'push'; // Visual effect on click (default: 'invert')
}

/**
 * External link (URL) options
 */
export interface ExternalLink extends BaseLink {
  type: 'url';
  url: string; // URL to link to (e.g., 'https://example.com')
}

/**
 * Internal link (page) options
 */
export interface InternalLink extends BaseLink {
  type: 'page';
  targetPage: number; // Target page number (0-indexed)
  fit?: 'Fit' | 'FitH' | 'FitV' | 'XYZ'; // How to display target page (default: 'Fit')
  zoom?: number; // Zoom level (for 'XYZ' fit, default: null = inherit)
  top?: number; // Y coordinate for 'FitH' or 'XYZ'
  left?: number; // X coordinate for 'FitV' or 'XYZ'
}

/**
 * GoTo link (named destination) options
 * Navigate to a named destination in the document (PDFKit compatible)
 */
export interface GoToLink extends BaseLink {
  type: 'goto';
  destination: string; // Name of the destination to navigate to
}

/**
 * Union type for all link types
 */
export type Link = ExternalLink | InternalLink | GoToLink;

/**
 * Named destination definition
 * Creates an anchor point that can be navigated to via goTo links
 */
export interface NamedDestination {
  name: string; // Unique name for this destination
  page: number; // Page number (0-indexed)
  x?: number; // X coordinate (default: 0)
  y?: number; // Y coordinate (default: top of page)
  fit?: 'Fit' | 'FitH' | 'FitV' | 'XYZ'; // How to display (default: 'XYZ')
  zoom?: number; // Zoom level (default: null = inherit)
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
export type BookmarkFit = 'Fit' | 'FitH' | 'FitV' | 'FitB' | 'XYZ';

/**
 * Bookmark destination
 */
export interface BookmarkDestination {
  page: number; // Page index (0-based)
  fit?: BookmarkFit; // How to display the page (default: 'Fit')
  x?: number; // X coordinate for FitV, XYZ
  y?: number; // Y coordinate for FitH, XYZ
  zoom?: number; // Zoom level for XYZ (e.g., 1.0 = 100%, 1.5 = 150%)
}

/**
 * Bookmark options
 */
export interface BookmarkOptions {
  title: string; // Bookmark title
  destination?: BookmarkDestination; // Where this bookmark points to
  children?: BookmarkOptions[]; // Child bookmarks (nested structure)
  open?: boolean; // Whether children are initially visible (default: true)
  color?: Color; // Bookmark text color (optional)
  bold?: boolean; // Bold text (optional)
  italic?: boolean; // Italic text (optional)
}

// =======================
// PDF FORMS (AcroForms)
// =======================

/**
 * Base form field options
 */
export interface BaseFormField {
  name: string; // Unique field name
  page: number; // Page index (0-based) where field appears
  x: number; // X position
  y: number; // Y position
  width: number; // Field width
  height: number; // Field height
  required?: boolean; // Whether field is required (default: false)
  readOnly?: boolean; // Whether field is read-only (default: false)
  tooltip?: string; // Tooltip text (appears on hover)
  backgroundColor?: Color; // Background color
  borderColor?: Color; // Border color
  borderWidth?: number; // Border width (default: 1)
  fontSize?: number; // Font size for text (default: 12)
  fontColor?: Color; // Text color (default: black)
  font?: PDFBaseFont; // Font family (default: Helvetica)
}

/**
 * Text field options
 */
export interface TextFieldOptions extends BaseFormField {
  type: 'text';
  defaultValue?: string; // Default text value
  maxLength?: number; // Maximum number of characters
  multiline?: boolean; // Multi-line text area (default: false)
  password?: boolean; // Password field (shows dots/asterisks)
  align?: 'left' | 'center' | 'right'; // Text alignment (default: 'left')
  placeholder?: string; // Placeholder text
}

/**
 * Checkbox field options
 */
export interface CheckboxFieldOptions extends BaseFormField {
  type: 'checkbox';
  defaultValue?: boolean; // Default checked state (default: false)
  checkmarkColor?: Color; // Color of checkmark (default: black)
}

/**
 * Radio button option
 */
export interface RadioOption {
  value: string; // Option value
  x: number; // X position
  y: number; // Y position
  label?: string; // Label text next to radio button
  labelOffsetX?: number; // Label horizontal offset from radio (default: 20)
  labelOffsetY?: number; // Label vertical offset (default: 0)
}

/**
 * Radio button group options
 */
export interface RadioButtonFieldOptions extends Omit<
  BaseFormField,
  'x' | 'y' | 'width' | 'height'
> {
  type: 'radio';
  options: RadioOption[]; // Radio button options
  defaultValue?: string; // Default selected value
  size?: number; // Size of radio button (default: 12)
  buttonColor?: Color; // Color of radio button
  selectedColor?: Color; // Color when selected (default: black)
}

/**
 * Dropdown/combo box field options
 */
export interface DropdownFieldOptions extends BaseFormField {
  type: 'dropdown';
  options: string[]; // List of options
  defaultValue?: string; // Default selected value
  editable?: boolean; // Allow custom text entry (combo box)
}

/**
 * Button field options
 */
export interface ButtonFieldOptions extends BaseFormField {
  type: 'button';
  label: string; // Button label text
  action?: 'submit' | 'reset' | 'custom'; // Button action
  submitUrl?: string; // URL to submit form data to (for submit action)
  backgroundColor?: Color; // Button background color
  labelColor?: Color; // Button label color
}

/**
 * Union type for all form fields
 */
export type FormField =
  | TextFieldOptions
  | CheckboxFieldOptions
  | RadioButtonFieldOptions
  | DropdownFieldOptions
  | ButtonFieldOptions;

/**
 * Form configuration options
 */
export interface FormOptions {
  fields?: FormField[]; // Form fields
  submitUrl?: string; // Default submit URL
  needAppearances?: boolean; // Generate field appearances (default: true)
}

/**
 * Digital Signature Options
 */
export interface SignatureFieldOptions {
  name: string; // Field name
  page: number; // Page index (0-based)
  x: number; // X position
  y: number; // Y position
  width: number; // Field width
  height: number; // Field height
  reason?: string; // Reason for signing
  location?: string; // Location of signing
  contactInfo?: string; // Contact information
  showLabels?: boolean; // Show signature labels (default: true)
  borderColor?: Color; // Border color
  borderWidth?: number; // Border width
}

export interface CertificateInfo {
  privateKey: string | Buffer; // Private key in PEM format
  certificate: string | Buffer; // Certificate in PEM format
  password?: string; // Password for private key (if encrypted)
}

export interface SignatureOptions {
  certificate: CertificateInfo; // Certificate and private key
  reason?: string; // Reason for signing
  location?: string; // Location of signing
  contactInfo?: string; // Contact information
  timestamp?: boolean; // Add timestamp (requires TSA server)
  timestampServer?: string; // Timestamp server URL
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
export type PDFAConformanceLevel = 'PDF/A-1b' | 'PDF/A-2b' | 'PDF/A-3b';

/**
 * PDF/A color profile options
 */
export type PDFAColorProfile = 'sRGB' | 'Adobe RGB' | 'CMYK';

/**
 * PDF/A compliance options
 */
export interface PDFAOptions {
  conformanceLevel: PDFAConformanceLevel; // PDF/A standard level (default: 'PDF/A-1b')
  colorProfile?: PDFAColorProfile; // Color profile (default: 'sRGB')
  outputIntent?: {
    identifier?: string; // Registry identifier (default: 'sRGB IEC61966-2.1')
    condition?: string; // Human-readable condition
    info?: string; // Additional information
  };
}

// =======================
// METADATA & PROPERTIES
// =======================

/**
 * Custom metadata key-value pairs
 * Used for XMP metadata and custom properties
 */
export interface CustomMetadata {
  [key: string]: string | number | boolean | Date;
}

/**
 * Extended document metadata options
 */
export interface ExtendedMetadata {
  // Dublin Core metadata
  description?: string; // Document description
  language?: string; // Language code (e.g., 'en-US', 'es-ES')
  rights?: string; // Copyright/rights information

  // Custom properties
  custom?: CustomMetadata; // Custom key-value pairs

  // Additional XMP properties
  category?: string; // Document category
  contentType?: string; // Content type/format
  identifier?: string; // Unique identifier (ISBN, DOI, etc.)
  source?: string; // Source document/reference
  relation?: string; // Related document reference
  coverage?: string; // Spatial or temporal coverage

  // PDF-specific metadata
  trapped?: 'True' | 'False' | 'Unknown'; // Trapping status
  gts_pdfxVersion?: string; // PDF/X version
  gts_pdfxConformance?: string; // PDF/X conformance
}

// =======================
// COMPRESSION & OPTIMIZATION
// =======================

/**
 * Image compression quality
 */
export type ImageQuality = 'low' | 'medium' | 'high' | 'maximum';

/**
 * Stream compression level (using zlib/Flate)
 */
export type CompressionLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * Compression and optimization options
 */
export interface CompressionOptions {
  // Image compression
  compressImages?: boolean; // Enable image compression (default: false)
  imageQuality?: ImageQuality; // Image quality level (default: 'high')
  maxImageWidth?: number; // Max image width in pixels (default: no limit)
  maxImageHeight?: number; // Max image height in pixels (default: no limit)

  // Stream compression
  compressStreams?: boolean; // Enable stream compression with Flate (default: true)
  compressionLevel?: CompressionLevel; // Compression level 0-9 (default: 6)

  // Font optimization
  subsetFonts?: boolean; // Subset embedded fonts (default: false)

  // Object optimization
  deduplicateObjects?: boolean; // Remove duplicate objects (default: false)
  removeUnusedObjects?: boolean; // Remove unreferenced objects (default: false)
}

// =======================
// FILE ATTACHMENTS
// =======================

/**
 * File attachment options (document-level)
 */
export interface FileAttachment {
  name: string; // File name (e.g., 'document.pdf', 'data.xlsx')
  file: string | Buffer; // File path or Buffer data
  description?: string; // Optional description
  mimeType?: string; // MIME type (e.g., 'application/pdf', 'text/plain')
  creationDate?: Date; // File creation date
  modificationDate?: Date; // File modification date
}

/**
 * File attachment annotation options (page-level)
 */
export interface FileAttachmentAnnotation {
  name: string; // File name
  file: string | Buffer; // File path or Buffer data
  x: number; // X position on page
  y: number; // Y position on page
  page?: number; // Page number (0-indexed, default: current page)
  icon?: 'Graph' | 'PushPin' | 'Paperclip' | 'Tag'; // Annotation icon (default: 'PushPin')
  description?: string; // Optional description
  mimeType?: string; // MIME type
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
export type QRCodeErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

/**
 * QR Code logo/center image options
 */
export interface QRCodeLogoOptions {
  source: string | Buffer; // Image path or buffer (PNG, JPEG)
  width?: number; // Logo width in pixels (default: 20% of QR size)
  height?: number; // Logo height in pixels (default: 20% of QR size)
  margin?: number; // Margin around logo (default: 2 pixels)
  backgroundColor?: string; // Background color behind logo (default: white)
  borderRadius?: number; // Border radius for logo background (default: 0)
}

/**
 * QR Code data type helpers
 */
export interface QRCodeData {
  /** Plain text or custom data */
  text?: string;

  /** URL/Link */
  url?: string;

  /** Email address with optional subject and body */
  email?: {
    address: string;
    subject?: string;
    body?: string;
  };

  /** Phone number */
  phone?: string;

  /** SMS with optional message */
  sms?: {
    phone: string;
    message?: string;
  };

  /** WiFi network credentials */
  wifi?: {
    ssid: string; // Network name
    password: string; // Network password
    encryption?: 'WPA' | 'WEP' | 'nopass'; // Security type (default: WPA)
    hidden?: boolean; // Hidden network (default: false)
  };

  /** vCard contact information */
  vcard?: {
    firstName: string;
    lastName: string;
    organization?: string;
    title?: string;
    phone?: string;
    email?: string;
    url?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
    };
  };

  /** Geographic coordinates */
  geo?: {
    latitude: number;
    longitude: number;
  };

  /** Calendar event */
  event?: {
    title: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
    description?: string;
  };
}

/**
 * QR Code options
 */
export interface QRCodeOptions {
  // Position (required)
  x: number; // X position on page
  y: number; // Y position on page

  // Size
  size?: number; // QR code size in points (default: 100)

  // Data (provide one)
  data: string | QRCodeData; // QR code data

  // Visual customization
  foregroundColor?: string; // QR code color (default: black)
  backgroundColor?: string; // Background color (default: white)

  // Quality & error correction
  errorCorrectionLevel?: QRCodeErrorCorrectionLevel; // Error correction (default: M, use H for logo)
  margin?: number; // Quiet zone margin in modules (default: 4)

  // Logo/Center image
  logo?: QRCodeLogoOptions; // Custom logo in center

  // Advanced options
  version?: number; // QR code version 1-40 (auto if not specified)
  maskPattern?: number; // Mask pattern 0-7 (auto if not specified)
}
