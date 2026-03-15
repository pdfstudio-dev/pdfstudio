/**
 * Color type - hex string or RGB array
 */
export type Color = string | [number, number, number];

// ==================
// IMAGES
// ==================

/**
 * Supported image formats
 */
export type ImageFormat = 'JPEG' | 'PNG';

/**
 * Image positioning and scaling options
 */
export interface ImageOptions {
  // Position
  x?: number;
  y?: number;

  // Size
  width?: number;
  height?: number;
  scale?: number;

  // Fit modes
  fit?: [number, number]; // Fit within dimensions (maintain aspect ratio)
  cover?: [number, number]; // Cover dimensions (maintain aspect ratio, may crop)

  // Alignment (used with fit/cover)
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'center' | 'bottom';

  // Masking
  mask?: string | Buffer; // Path to mask image or mask buffer
  maskOptions?: ImageMaskOptions;
}

/**
 * Internal image information
 */
export interface ImageInfo {
  format: ImageFormat;
  width: number;
  height: number;
  colorSpace: string;
  bitsPerComponent: number;
  data: Buffer;
  filter?: string;
  hasAlpha?: boolean;
  palette?: Buffer;
  transparency?: Buffer;
  interpolate?: boolean;
  maskInfo?: ImageInfo; // Mask image data
  maskOptions?: ImageMaskOptions;
}

// ==================
// VECTOR SHAPES
// ==================

/**
 * Style options for vector shapes
 */
export interface ShapeStyle {
  fillColor?: Color; // Fill color (hex string or RGB array)
  fillGradient?: Gradient; // Fill with gradient instead of solid color
  strokeColor?: Color; // Stroke/border color
  strokeWidth?: number; // Border width in points
  opacity?: number; // Fill opacity (0-1)
  strokeOpacity?: number; // Stroke opacity (0-1)
  dashPattern?: number[]; // Dash pattern for stroke [dash, gap, dash, gap...]
}

/**
 * Circle options
 */
export interface CircleOptions extends ShapeStyle {
  x: number; // Center X
  y: number; // Center Y
  radius: number; // Radius in points
}

/**
 * Ellipse options
 */
export interface EllipseOptions extends ShapeStyle {
  x: number; // Center X
  y: number; // Center Y
  radiusX: number; // Horizontal radius
  radiusY: number; // Vertical radius
  rotation?: number; // Rotation angle in degrees (optional)
}

/**
 * Polygon options
 */
export interface PolygonOptions extends ShapeStyle {
  x: number; // Center X
  y: number; // Center Y
  radius: number; // Radius (distance from center to vertex)
  sides: number; // Number of sides (3 = triangle, 6 = hexagon, etc.)
  rotation?: number; // Rotation angle in degrees (0 = point at top)
}

/**
 * Arc options (curved line, not filled)
 */
export interface ArcOptions extends Omit<ShapeStyle, 'fillColor' | 'opacity'> {
  x: number; // Center X
  y: number; // Center Y
  radius: number; // Radius
  startAngle: number; // Start angle in degrees (0 = right/east)
  endAngle: number; // End angle in degrees
  counterclockwise?: boolean; // Direction (default: false = clockwise)
}

/**
 * Sector options (pie slice shape, filled)
 */
export interface SectorOptions extends ShapeStyle {
  x: number; // Center X
  y: number; // Center Y
  radius: number; // Radius
  startAngle: number; // Start angle in degrees
  endAngle: number; // End angle in degrees
  counterclockwise?: boolean; // Direction (default: false = clockwise)
}

/**
 * Point for custom paths
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Bezier curve control points
 */
export interface BezierCurve {
  cp1x: number; // Control point 1 X
  cp1y: number; // Control point 1 Y
  cp2x?: number; // Control point 2 X (cubic only)
  cp2y?: number; // Control point 2 Y (cubic only)
  x: number; // End point X
  y: number; // End point Y
}

/**
 * Custom path options
 */
export interface PathOptions extends ShapeStyle {
  points: Point[]; // Array of points for the path
  closed?: boolean; // Close the path (connect last to first)
  curves?: BezierCurve[]; // Optional Bezier curves between points
}

// ==================
// GRADIENTS
// ==================

/**
 * Gradient color stop
 */
export interface ColorStop {
  offset: number; // Position (0-1)
  color: Color; // Color at this position
}

/**
 * Linear gradient options
 */
export interface LinearGradientOptions {
  x0: number; // Start point X
  y0: number; // Start point Y
  x1: number; // End point X
  y1: number; // End point Y
  colorStops: ColorStop[]; // Color stops (at least 2)
}

/**
 * Radial gradient options
 */
export interface RadialGradientOptions {
  x0: number; // Start circle center X
  y0: number; // Start circle center Y
  r0: number; // Start circle radius
  x1: number; // End circle center X
  y1: number; // End circle center Y
  r1: number; // End circle radius
  colorStops: ColorStop[]; // Color stops (at least 2)
}

/**
 * Gradient type
 */
export type Gradient = LinearGradientOptions | RadialGradientOptions;

// ==================
// PATTERNS
// ==================

/**
 * Pattern draw function - receives a drawing context to create the pattern content
 */
export type PatternDrawFunction = (ctx: {
  moveTo: (x: number, y: number) => void;
  lineTo: (x: number, y: number) => void;
  rect: (x: number, y: number, width: number, height: number) => void;
  circle: (x: number, y: number, radius: number) => void;
  setFillColor: (r: number, g: number, b: number) => void;
  setStrokeColor: (r: number, g: number, b: number) => void;
  setLineWidth: (width: number) => void;
  fill: () => void;
  stroke: () => void;
  fillAndStroke: () => void;
}) => void;

/**
 * Tiling pattern options (Type 1 Pattern)
 */
export interface TilingPatternOptions {
  width: number; // Pattern cell width
  height: number; // Pattern cell height
  xStep?: number; // Horizontal spacing (defaults to width)
  yStep?: number; // Vertical spacing (defaults to height)
  draw: PatternDrawFunction; // Function to draw the pattern content
  colored?: boolean; // Whether pattern is colored (default: true)
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
export type TextRenderingMode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * Text outline options (stroked text)
 */
export interface TextOutlineOptions {
  text: string;
  x: number;
  y: number;
  fontSize?: number;
  font?: import('./document').PDFBaseFont;
  strokeColor?: Color;
  fillColor?: Color;
  lineWidth?: number;
  renderingMode?: TextRenderingMode;
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
  type?: 'luminosity' | 'stencil';

  /**
   * Whether to invert the mask (swap transparent/opaque)
   */
  inverted?: boolean;
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
export type LayerIntent = 'View' | 'Design' | 'All';

/**
 * Layer (Optional Content Group) options
 */
export interface LayerOptions {
  name: string; // Layer name (e.g., 'Background', 'Text', 'Images')
  visible?: boolean; // Initial visibility (default: true)
  locked?: boolean; // Whether layer can be toggled by user (default: false)
  intent?: LayerIntent | LayerIntent[]; // Usage intent (default: 'View')
  printable?: boolean; // Whether layer appears when printing (default: same as visible)
  exportable?: boolean; // Whether layer is included in exports (default: true)
}

/**
 * Layer state for a specific usage context
 */
export interface LayerState {
  layerName: string;
  visible: boolean;
}

// =======================
// FORM XOBJECTS / TEMPLATES
// =======================

/**
 * Form XObject drawing context - provides drawing commands for template content
 */
export type FormXObjectDrawFunction = (ctx: {
  // Path construction
  moveTo: (x: number, y: number) => void;
  lineTo: (x: number, y: number) => void;
  bezierCurveTo: (
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x: number,
    y: number
  ) => void;
  quadraticCurveTo: (cpx: number, cpy: number, x: number, y: number) => void;
  rect: (x: number, y: number, width: number, height: number) => void;
  circle: (x: number, y: number, radius: number) => void;
  ellipse: (x: number, y: number, radiusX: number, radiusY: number) => void;
  path: (svgPath: string) => void;

  // Path operations
  closePath: () => void;
  fill: () => void;
  stroke: () => void;
  fillAndStroke: () => void;
  clip: () => void;

  // Colors
  setFillColor: (r: number, g: number, b: number) => void;
  setStrokeColor: (r: number, g: number, b: number) => void;

  // Graphics state
  setLineWidth: (width: number) => void;
  setLineCap: (cap: 0 | 1 | 2) => void; // 0=butt, 1=round, 2=square
  setLineJoin: (join: 0 | 1 | 2) => void; // 0=miter, 1=round, 2=bevel
  setDashPattern: (pattern: number[], phase?: number) => void;
  setOpacity: (opacity: number) => void;

  // Text
  text: (text: string, x: number, y: number, fontSize?: number) => void;

  // Transformations
  translate: (x: number, y: number) => void;
  rotate: (angle: number) => void;
  scale: (sx: number, sy?: number) => void;

  // State
  saveGraphicsState: () => void;
  restoreGraphicsState: () => void;
}) => void;

/**
 * Form XObject options - defines a reusable template/graphic
 */
export interface FormXObjectOptions {
  width: number; // Width of the form XObject bounding box
  height: number; // Height of the form XObject bounding box
  draw: FormXObjectDrawFunction; // Function that draws the template content
  name?: string; // Optional custom name (auto-generated if not provided)
}

/**
 * Form XObject placement options - controls how template is placed on page
 */
export interface FormXObjectPlacementOptions {
  x?: number; // X position (default: 0)
  y?: number; // Y position (default: 0)
  width?: number; // Target width (scales the XObject, default: original width)
  height?: number; // Target height (scales the XObject, default: original height)
  scale?: number; // Uniform scale factor (alternative to width/height)
  scaleX?: number; // Horizontal scale factor
  scaleY?: number; // Vertical scale factor
  rotate?: number; // Rotation angle in degrees (clockwise)
  opacity?: number; // Opacity 0-1 (default: 1)
}
