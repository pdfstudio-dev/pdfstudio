/**
 * Bar chart data point
 */
export interface BarChartData {
  label: string;
  value: number;
}

/**
 * Grouped bar chart data point
 */
export interface GroupedBarChartData {
  label: string;
  values: number[];
  series: string[];
}

/**
 * Stacked bar chart data point
 */
export interface StackedBarChartData {
  label: string;
  values: number[];
  series: string[];
}

/**
 * Line chart data point
 */
export interface LineChartData {
  label: string;
  value: number;
}

/**
 * Multi-line chart data series
 */
export interface MultiLineChartData {
  label: string;
  values: number[];
  series: string[];
}

/**
 * Pie/Donut chart data point
 */
export interface PieChartData {
  label: string;
  value: number;
  color?: string; // Optional custom color per slice
}

/**
 * Grid style options
 */
export interface GridStyle {
  color?: string;
  width?: number;
  dashPattern?: number[];
}

/**
 * Shadow options
 */
export interface ShadowOptions {
  enabled?: boolean;
  color?: string;
  blur?: number;
  offsetX?: number;
  offsetY?: number;
}

/**
 * Gradient options
 */
export interface GradientOptions {
  enabled?: boolean;
  type?: 'linear' | 'radial';
  colors?: string[];
  angle?: number;
}

/**
 * Legend options
 */
export interface LegendOptions {
  show?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'right' | 'left';
  fontSize?: number;
  fontColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  padding?: number;
  itemSpacing?: number;
}

/**
 * Legend item
 */
export interface LegendItem {
  label: string;
  color: string;
}

/**
 * Border options for charts
 */
export interface BorderOptions {
  show?: boolean;
  color?: string;
  width?: number;
  padding?: number;
  radius?: number; // Corner radius for rounded borders
}

/**
 * Bar chart configuration options
 */
export interface BarChartOptions {
  data: BarChartData[];
  x: number;
  y: number;
  width: number;
  height: number;

  // Colors
  barColor?: string;
  barColors?: string[]; // Different color per bar

  // Gradient
  gradient?: GradientOptions;

  // Shadow
  shadow?: ShadowOptions;

  // Text
  title?: string;

  // Display options
  showAxes?: boolean;
  showGrid?: boolean;
  showLabels?: boolean;
  showValues?: boolean;

  // Grid customization
  gridStyle?: GridStyle;

  // Legend
  legend?: LegendOptions;

  // Orientation
  orientation?: 'vertical' | 'horizontal';

  // Border
  border?: BorderOptions; // Border around the entire chart
}

/**
 * Grouped bar chart options
 */
export interface GroupedBarChartOptions {
  data: GroupedBarChartData[];
  x: number;
  y: number;
  width: number;
  height: number;
  colors?: string[];
  title?: string;
  showAxes?: boolean;
  showGrid?: boolean;
  showLabels?: boolean;
  showValues?: boolean;
  gridStyle?: GridStyle;
  legend?: LegendOptions;
  orientation?: 'vertical' | 'horizontal';
  border?: BorderOptions;
}

/**
 * Stacked bar chart options
 */
export interface StackedBarChartOptions {
  data: StackedBarChartData[];
  x: number;
  y: number;
  width: number;
  height: number;
  colors?: string[];
  title?: string;
  showAxes?: boolean;
  showGrid?: boolean;
  showLabels?: boolean;
  showValues?: boolean;
  showPercentages?: boolean;
  gridStyle?: GridStyle;
  legend?: LegendOptions;
  orientation?: 'vertical' | 'horizontal';
  border?: BorderOptions;
}

/**
 * Line chart options
 */
export interface LineChartOptions {
  data: LineChartData[];
  x: number;
  y: number;
  width: number;
  height: number;

  // Colors
  lineColor?: string;
  fillColor?: string; // Fill area under line
  pointColor?: string;

  // Gradient
  gradient?: GradientOptions;

  // Shadow
  shadow?: ShadowOptions;

  // Line style
  lineWidth?: number;
  pointSize?: number;
  showPoints?: boolean;
  curved?: boolean; // Smooth/curved line
  smooth?: boolean; // Alias for curved
  fillArea?: boolean; // Fill area under the line
  fillOpacity?: number; // Opacity of the fill area

  // Display options
  title?: string;
  showAxes?: boolean;
  showGrid?: boolean;
  showLabels?: boolean;
  showValues?: boolean;

  // Grid customization
  gridStyle?: GridStyle;

  // Legend
  legend?: LegendOptions;

  // Border
  border?: BorderOptions;
}

/**
 * Multi-line chart options
 */
export interface MultiLineChartOptions {
  data: MultiLineChartData[];
  x: number;
  y: number;
  width: number;
  height: number;
  colors?: string[];
  lineWidth?: number;
  pointSize?: number;
  showPoints?: boolean;
  curved?: boolean;
  smooth?: boolean;
  title?: string;
  showAxes?: boolean;
  showGrid?: boolean;
  showLabels?: boolean;
  showValues?: boolean;
  gridStyle?: GridStyle;
  legend?: LegendOptions;
  border?: BorderOptions;
}

/**
 * Pie chart options
 */
export interface PieChartOptions {
  data: PieChartData[];
  x: number;
  y: number;
  radius: number;
  colors?: string[];

  // Labels
  showLabels?: boolean;
  showPercentages?: boolean;
  labelDistance?: number;

  // Display options
  title?: string;
  legend?: LegendOptions;

  // Style
  strokeColor?: string;
  strokeWidth?: number;
  border?: BorderOptions; // Border around the entire chart
}

/**
 * Donut chart options (extends PieChart)
 */
export interface DonutChartOptions {
  data: PieChartData[];
  x: number;
  y: number;
  outerRadius: number;
  innerRadius: number;
  colors?: string[];

  // Labels
  showLabels?: boolean;
  showPercentages?: boolean;
  labelDistance?: number;

  // Display options
  title?: string;
  legend?: LegendOptions;
  centerText?: string; // Text in center hole

  // Style
  strokeColor?: string;
  strokeWidth?: number;
  border?: BorderOptions; // Border around the entire chart
}
