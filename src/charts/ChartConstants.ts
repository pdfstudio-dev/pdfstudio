/**
 * ChartConstants - Named constants for chart rendering
 * Replaces magic numbers with descriptive names for better maintainability
 */

// ============================================================================
// SPACING & MARGINS
// ============================================================================

/** Space reserved for Y-axis labels (vertical charts) */
export const Y_AXIS_LABEL_SPACE = 40

/** Space reserved for label area (horizontal charts) */
export const HORIZONTAL_LABEL_SPACE = 120

/** Bottom space for X-axis labels (horizontal charts) */
export const HORIZONTAL_BOTTOM_SPACE = 30

/** Spacing between vertical bars */
export const VERTICAL_BAR_SPACING = 20

/** Spacing between horizontal bars */
export const HORIZONTAL_BAR_SPACING = 15

/** Offset for labels below vertical bars */
export const VERTICAL_LABEL_BOTTOM_OFFSET = 25

/** Offset for values above vertical bars */
export const VERTICAL_VALUE_TOP_OFFSET = 10

/** Small offset for general positioning */
export const SMALL_OFFSET = 5

// ============================================================================
// TEXT & FONT SIZES
// ============================================================================

/** Font size for chart titles */
export const TITLE_FONT_SIZE = 16

/** Font size for data labels and values */
export const LABEL_FONT_SIZE = 11

/** Font size for axis scale numbers */
export const SCALE_FONT_SIZE = 9

/** Estimated character width for title text (in points) */
export const TITLE_CHAR_WIDTH = 4.5

/** Estimated character width for labels (in points) */
export const LABEL_CHAR_WIDTH = 3

/** Estimated character width for scale values (in points) */
export const SCALE_CHAR_WIDTH = 2.5

// ============================================================================
// TITLE & POSITIONING
// ============================================================================

/** Vertical offset for title above chart */
export const TITLE_VERTICAL_OFFSET = 50

/** Horizontal offset for Y-axis scale labels */
export const Y_AXIS_SCALE_LABEL_OFFSET = 35

/** Vertical offset for X-axis scale labels */
export const X_AXIS_SCALE_LABEL_OFFSET = 15

/** Vertical adjustment for scale label alignment */
export const SCALE_LABEL_VERTICAL_ADJUST = 3

// ============================================================================
// GRADIENTS & EFFECTS
// ============================================================================

/** Number of steps for gradient rendering (smooth gradients) */
export const GRADIENT_STEPS = 20

/** Default shadow offset X */
export const SHADOW_OFFSET_X = 2

/** Default shadow offset Y */
export const SHADOW_OFFSET_Y = 2

/** Shadow color (gray) as RGB 0-1 */
export const SHADOW_COLOR_GRAY = 0.7

// ============================================================================
// GRID & AXES
// ============================================================================

/** Number of steps/ticks on axes */
export const AXIS_STEPS = 5

/** Line width for grid lines */
export const GRID_LINE_WIDTH = 1

/** Line width for main axes */
export const AXES_LINE_WIDTH = 2

/** Tick mark length on axes */
export const TICK_MARK_LENGTH = 5

// ============================================================================
// LEGEND
// ============================================================================

/** Default legend width */
export const LEGEND_WIDTH = 100

/** Default legend padding */
export const LEGEND_PADDING = 10

/** Spacing between legend and chart */
export const LEGEND_CHART_SPACING = 20

/** Reduction in legend box size relative to font size */
export const LEGEND_BOX_SIZE_REDUCTION = 2

// ============================================================================
// BORDER & EXTENSIONS
// ============================================================================

/** Extension for title when calculating border */
export const TITLE_BORDER_EXTENSION = 60

/** Extension for legend when calculating border */
export const LEGEND_BORDER_EXTENSION = 60

// ============================================================================
// PIE CHART
// ============================================================================

/** Default distance from pie edge to labels */
export const PIE_LABEL_DISTANCE_FROM_EDGE = 30

/** Default fallback label distance */
export const PIE_LABEL_DISTANCE_FALLBACK = 100

/** Font size for pie slice percentages */
export const PIE_PERCENTAGE_FONT_SIZE = 9

/** Font size for pie slice labels */
export const PIE_LABEL_FONT_SIZE = 10

/** Font size for pie center text */
export const PIE_CENTER_TEXT_FONT_SIZE = 12

/** Estimated character width for pie labels */
export const PIE_LABEL_CHAR_WIDTH = 2.5

/** Center text vertical adjustment */
export const PIE_CENTER_TEXT_VERTICAL_ADJUST = 5

/** Percentage text vertical offset from label */
export const PIE_PERCENTAGE_VERTICAL_OFFSET = 12

/** Default stroke width for pie slices */
export const PIE_STROKE_WIDTH = 2

/** Right legend horizontal offset from pie edge */
export const PIE_LEGEND_RIGHT_OFFSET = 40

/** Left legend horizontal offset from pie edge */
export const PIE_LEGEND_LEFT_OFFSET = 120

/** Legend vertical spacing */
export const PIE_LEGEND_VERTICAL_SPACING = 20

/** Legend color box width */
export const PIE_LEGEND_BOX_WIDTH = 12

/** Legend color box height */
export const PIE_LEGEND_BOX_HEIGHT = 8

/** Legend color box vertical adjustment */
export const PIE_LEGEND_BOX_VERTICAL_ADJUST = 3

/** Legend label horizontal offset from box */
export const PIE_LEGEND_LABEL_OFFSET = 18

/** Maximum arc segment angle in radians (90 degrees) */
export const PIE_MAX_ARC_SEGMENT = Math.PI / 2

/** Bezier curve control point factor for circular arcs */
export const PIE_BEZIER_K_FACTOR = 4 / 3

/** Minimum angle threshold for arc rendering */
export const PIE_MIN_ANGLE_THRESHOLD = 0.0001

/** Border calculation padding for labels */
export const PIE_BORDER_LABEL_HORIZONTAL_PADDING = 40

/** Border calculation padding for labels (vertical) */
export const PIE_BORDER_LABEL_VERTICAL_PADDING = 20

/** Default legend font size */
export const PIE_LEGEND_FONT_SIZE = 10

/** Default legend item spacing */
export const PIE_LEGEND_ITEM_SPACING = 5

/** Default border width */
export const PIE_BORDER_WIDTH_DEFAULT = 1

/** Default border padding */
export const PIE_BORDER_PADDING_DEFAULT = 10

/** Default border radius */
export const PIE_BORDER_RADIUS_DEFAULT = 0

/** Center text character width estimate */
export const PIE_CENTER_TEXT_CHAR_WIDTH = 3

/** Label vertical offset */
export const PIE_LABEL_VERTICAL_OFFSET = 5

/** Legend vertical space margin for border calculation */
export const PIE_LEGEND_VERTICAL_SPACE_MARGIN = 50

/** Legend border extension for left/right positioning */
export const PIE_LEGEND_BORDER_EXTENSION = 180

/** Minimum radius for rounded rectangle corners */
export const PIE_MIN_ROUNDED_RECT_RADIUS = 1

// ============================================================================
// LINE CHART
// ============================================================================

/** Default point size for line chart points */
export const LINE_CHART_POINT_SIZE = 4

/** Default line width for line charts */
export const LINE_CHART_LINE_WIDTH = 2

/** Default fill opacity for area under line */
export const LINE_FILL_OPACITY_DEFAULT = 0.2

/** Default grid line width */
export const LINE_GRID_WIDTH_DEFAULT = 0.5

/** Default border width */
export const LINE_BORDER_WIDTH_DEFAULT = 1

/** Default border padding */
export const LINE_BORDER_PADDING_DEFAULT = 10

/** X-axis label space (bottom margin) */
export const LINE_X_AXIS_LABEL_SPACE = 20

/** Number of segments for smooth curve approximation */
export const LINE_SMOOTH_CURVE_SEGMENTS = 10

/** Font size for X-axis labels */
export const LINE_LABEL_FONT_SIZE = 10

/** Vertical offset for value labels above points */
export const LINE_VALUE_VERTICAL_OFFSET = 10

// ============================================================================
// MULTI-LINE CHART
// ============================================================================

/** Width reserved for legend on right side */
export const MULTI_LINE_LEGEND_WIDTH = 100

/** Vertical offset for top/bottom legends */
export const MULTI_LINE_LEGEND_VERTICAL_OFFSET = 30

/** Vertical position offset for right/left legends */
export const MULTI_LINE_LEGEND_VERTICAL_POSITION = 20

/** Border extension for right-side legend */
export const MULTI_LINE_LEGEND_BORDER_EXTENSION = 120

// ============================================================================
// GROUPED BAR CHART
// ============================================================================

/** Spacing between groups of bars */
export const GROUPED_BAR_GROUP_SPACING = 30

/** Spacing between bars within a group */
export const GROUPED_BAR_SPACING = 5

// ============================================================================
// STACKED BAR CHART
// ============================================================================

/** Spacing between stacked bars */
export const STACKED_BAR_SPACING = 20
