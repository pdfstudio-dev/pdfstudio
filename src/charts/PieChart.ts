import { PDFWriter } from '../core/PDFWriter'
import { PieChartOptions, DonutChartOptions, PieChartData, LegendItem } from '../types'
import { parseColor } from '../utils/colors'
import { validateNonEmptyArray, validateCoordinates, validatePositiveNumber } from '../utils/validation'
import { ChartDataError } from '../errors'
import * as C from './ChartConstants'

/**
 * PieChart - Renders a pie chart or donut chart
 */
export class PieChart {
  private writer: PDFWriter
  private options: PieChartOptions | DonutChartOptions
  private isDonut: boolean

  // Default colors for pie slices
  private static readonly DEFAULT_COLORS = [
    '#3498db',  // Blue
    '#e74c3c',  // Red
    '#2ecc71',  // Green
    '#f39c12',  // Orange
    '#9b59b6',  // Purple
    '#1abc9c',  // Turquoise
    '#34495e',  // Dark gray
    '#e67e22',  // Dark orange
    '#95a5a6',  // Gray
    '#16a085'   // Dark turquoise
  ]

  constructor(writer: PDFWriter, options: PieChartOptions | DonutChartOptions, isDonut: boolean = false) {
    // Validate inputs
    validateNonEmptyArray(options.data, 'data')
    validateCoordinates(options.x, options.y)

    // Validate radius (different field name for donut vs pie)
    if (isDonut && 'outerRadius' in options) {
      validatePositiveNumber(options.outerRadius, 'outerRadius')
      validatePositiveNumber(options.innerRadius, 'innerRadius')
      if (options.innerRadius >= options.outerRadius) {
        throw new ChartDataError(
          `Inner radius (${options.innerRadius}) must be less than outer radius (${options.outerRadius})`,
          'DonutChart',
          'invalid radii'
        )
      }
    } else if ('radius' in options) {
      validatePositiveNumber(options.radius, 'radius')
    }

    // Validate pie data values
    options.data.forEach((slice, index) => {
      if (!Number.isFinite(slice.value) || slice.value < 0) {
        throw new ChartDataError(
          `Pie slice value at index ${index} must be a non-negative finite number, got: ${slice.value}`,
          'PieChart',
          'invalid value'
        )
      }
    })

    // Check that at least one value is positive
    const total = options.data.reduce((sum, slice) => sum + slice.value, 0)
    if (total <= 0) {
      throw new ChartDataError(
        'Total of all pie slice values must be greater than zero',
        'PieChart',
        'zero total'
      )
    }

    this.writer = writer
    this.isDonut = isDonut

    // Calculate default label distance
    let defaultLabelDistance: number
    if (isDonut && 'outerRadius' in options) {
      defaultLabelDistance = options.outerRadius + C.PIE_LABEL_DISTANCE_FROM_EDGE
    } else if ('radius' in options) {
      defaultLabelDistance = options.radius + C.PIE_LABEL_DISTANCE_FROM_EDGE
    } else {
      defaultLabelDistance = C.PIE_LABEL_DISTANCE_FALLBACK
    }

    this.options = {
      colors: PieChart.DEFAULT_COLORS,
      showLabels: true,
      showPercentages: true,
      labelDistance: defaultLabelDistance,
      strokeColor: '#ffffff',
      strokeWidth: C.PIE_STROKE_WIDTH,
      legend: {
        show: true,
        position: 'right',
        fontSize: C.PIE_LEGEND_FONT_SIZE,
        itemSpacing: C.PIE_LEGEND_ITEM_SPACING
      },
      border: {
        show: false,
        color: '#000000',
        width: C.PIE_BORDER_WIDTH_DEFAULT,
        padding: C.PIE_BORDER_PADDING_DEFAULT,
        radius: C.PIE_BORDER_RADIUS_DEFAULT
      },
      ...options
    }
  }

  /**
   * Render the pie/donut chart
   */
  render(): void {
    const { data, x, y, title } = this.options

    // Draw title if provided
    if (title) {
      const titleX = x - (title.length * C.TITLE_CHAR_WIDTH)
      const titleY = this.isDonut && 'outerRadius' in this.options
        ? y + this.options.outerRadius + C.TITLE_VERTICAL_OFFSET
        : y + (this.options as PieChartOptions).radius + C.TITLE_VERTICAL_OFFSET
      this.writer.text(title, titleX, titleY, C.TITLE_FONT_SIZE)
    }

    // Calculate total and percentages
    const total = data.reduce((sum, item) => sum + item.value, 0)
    const slices = data.map(item => ({
      ...item,
      percentage: (item.value / total) * 100,
      angle: (item.value / total) * 360
    }))

    // Assign colors
    const coloredSlices = slices.map((slice, index) => ({
      ...slice,
      color: slice.color || this.options.colors![index % this.options.colors!.length]
    }))

    // Draw slices
    let currentAngle = 0
    coloredSlices.forEach((slice, index) => {
      this.drawSlice(
        x,
        y,
        currentAngle,
        slice.angle,
        slice.color,
        slice.label,
        slice.percentage
      )
      currentAngle += slice.angle
    })

    // Draw center text for donut
    if (this.isDonut && 'centerText' in this.options && this.options.centerText) {
      const centerText = this.options.centerText
      const textX = x - (centerText.length * C.PIE_CENTER_TEXT_CHAR_WIDTH)
      const textY = y - C.PIE_CENTER_TEXT_VERTICAL_ADJUST
      this.writer.text(centerText, textX, textY, C.PIE_CENTER_TEXT_FONT_SIZE)
    }

    // Draw border BEFORE legend (test)
    if (this.options.border?.show) {
      this.drawBorder(x, y)
    }

    // Draw legend
    if (this.options.legend?.show) {
      const legendItems: LegendItem[] = coloredSlices.map(slice => ({
        label: slice.label,
        color: slice.color
      }))
      this.drawLegend(legendItems, x, y)
    }
  }

  /**
   * Draw a single pie/donut slice
   */
  private drawSlice(
    centerX: number,
    centerY: number,
    startAngle: number,
    sweepAngle: number,
    color: string,
    label: string,
    percentage: number
  ): void {
    const radius = this.isDonut && 'outerRadius' in this.options
      ? this.options.outerRadius
      : (this.options as PieChartOptions).radius

    const innerRadius = this.isDonut && 'innerRadius' in this.options
      ? this.options.innerRadius
      : 0

    // Set fill color
    const [r, g, b] = parseColor(color)
    this.writer.setFillColor(r, g, b)

    // Draw the slice
    if (this.isDonut && innerRadius > 0) {
      this.drawDonutSlice(centerX, centerY, innerRadius, radius, startAngle, sweepAngle)
    } else {
      this.drawPieSlice(centerX, centerY, radius, startAngle, sweepAngle)
    }

    // Draw border
    if (this.options.strokeWidth! > 0) {
      const [sr, sg, sb] = parseColor(this.options.strokeColor!)
      this.writer.setStrokeColor(sr, sg, sb)
      this.writer.setLineWidth(this.options.strokeWidth!)
      this.writer.stroke()
    }

    // Draw label
    if (this.options.showLabels) {
      const midAngle = startAngle + sweepAngle / 2
      this.drawLabel(centerX, centerY, midAngle, label, percentage)
    }
  }

  /**
   * Draw a pie slice (no hole)
   */
  private drawPieSlice(
    centerX: number,
    centerY: number,
    radius: number,
    startAngle: number,
    sweepAngle: number
  ): void {
    const endAngle = startAngle + sweepAngle
    const startRad = this.degToRad(startAngle)
    const endRad = this.degToRad(endAngle)

    // Calculate start point on the arc
    const startX = centerX + radius * Math.cos(startRad)
    const startY = centerY + radius * Math.sin(startRad)

    // Start at center
    this.writer.moveTo(centerX, centerY)

    // Line to arc start
    this.writer.lineTo(startX, startY)

    // Draw arc from start to end
    this.drawArcRadians(centerX, centerY, radius, startRad, endRad)

    // Close path back to center
    this.writer.closePath()

    // Fill
    this.writer.fill()
  }

  /**
   * Draw a donut slice (with hole)
   */
  private drawDonutSlice(
    centerX: number,
    centerY: number,
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    sweepAngle: number
  ): void {
    const endAngle = startAngle + sweepAngle

    // Convert to radians
    const startRad = this.degToRad(startAngle)
    const endRad = this.degToRad(endAngle)

    // Calculate all four corner points of the donut slice
    const outerStartX = centerX + outerRadius * Math.cos(startRad)
    const outerStartY = centerY + outerRadius * Math.sin(startRad)

    const outerEndX = centerX + outerRadius * Math.cos(endRad)
    const outerEndY = centerY + outerRadius * Math.sin(endRad)

    const innerStartX = centerX + innerRadius * Math.cos(startRad)
    const innerStartY = centerY + innerRadius * Math.sin(startRad)

    const innerEndX = centerX + innerRadius * Math.cos(endRad)
    const innerEndY = centerY + innerRadius * Math.sin(endRad)

    // Build the path as a closed shape
    // Start at outer start
    this.writer.moveTo(outerStartX, outerStartY)

    // Draw outer arc from start to end (forward)
    this.drawArcRadians(centerX, centerY, outerRadius, startRad, endRad)

    // Line to inner end
    this.writer.lineTo(innerEndX, innerEndY)

    // Draw inner arc from end to start (backward)
    // We need to go backwards, so we'll manually build the segments in reverse order
    this.drawArcRadiansReverse(centerX, centerY, innerRadius, startRad, endRad)

    // Close path back to start
    this.writer.closePath()

    // Fill
    this.writer.fill()
  }

  /**
   * Draw an arc using bezier curve approximation (works in degrees)
   * PDF doesn't have native arc operator, so we approximate with cubic bezier curves
   */
  private drawArc(
    centerX: number,
    centerY: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ): void {
    const startRad = this.degToRad(startAngle)
    const endRad = this.degToRad(endAngle)
    this.drawArcRadians(centerX, centerY, radius, startRad, endRad)
  }

  /**
   * Draw an arc using bezier curve approximation (works in radians)
   * Draws arc forward from startAngleRad to endAngleRad
   */
  private drawArcRadians(
    centerX: number,
    centerY: number,
    radius: number,
    startAngleRad: number,
    endAngleRad: number
  ): void {
    // Calculate the angular difference
    let angleDiff = endAngleRad - startAngleRad

    // Determine direction and number of segments
    const absAngleDiff = Math.abs(angleDiff)

    // Split into segments (max 90 degrees = π/2 radians each)
    const segments = Math.ceil(absAngleDiff / C.PIE_MAX_ARC_SEGMENT)
    const angleStep = angleDiff / segments

    // Draw each segment
    for (let i = 0; i < segments; i++) {
      const a1 = startAngleRad + i * angleStep
      const a2 = startAngleRad + (i + 1) * angleStep

      this.drawBezierArcSegment(centerX, centerY, radius, a1, a2)
    }
  }

  /**
   * Draw an arc in reverse direction (from end back to start)
   * For donut inner ring: goes from endAngleRad back to startAngleRad
   */
  private drawArcRadiansReverse(
    centerX: number,
    centerY: number,
    radius: number,
    startAngleRad: number,
    endAngleRad: number
  ): void {
    // Go from end to start (negative direction)
    const angleDiff = startAngleRad - endAngleRad
    const absAngleDiff = Math.abs(angleDiff)

    // Split into segments (max 90 degrees = π/2 radians each)
    const segments = Math.ceil(absAngleDiff / C.PIE_MAX_ARC_SEGMENT)
    const angleStep = angleDiff / segments

    // Draw each segment going backwards
    for (let i = 0; i < segments; i++) {
      const a1 = endAngleRad + i * angleStep
      const a2 = endAngleRad + (i + 1) * angleStep

      this.drawBezierArcSegment(centerX, centerY, radius, a1, a2)
    }
  }

  /**
   * Draw a single arc segment (<= 90 degrees) using bezier curve
   * Uses the standard 4-point bezier approximation of a circular arc
   * Reference: https://pomax.github.io/bezierinfo/#circles_cubic
   */
  private drawBezierArcSegment(
    centerX: number,
    centerY: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ): void {
    // Calculate the total sweep angle
    const sweepAngle = endAngle - startAngle

    // Avoid zero or very small angles
    if (Math.abs(sweepAngle) < C.PIE_MIN_ANGLE_THRESHOLD) {
      const x2 = centerX + radius * Math.cos(endAngle)
      const y2 = centerY + radius * Math.sin(endAngle)
      this.writer.addContent(`${x2} ${y2} l`)
      return
    }

    // Standard formula for control point distance
    // k = (4/3) * tan(sweep/4)
    const k = C.PIE_BEZIER_K_FACTOR * Math.tan(sweepAngle / 4)

    // Start point (already set by moveTo or previous curve)
    const x1 = centerX + radius * Math.cos(startAngle)
    const y1 = centerY + radius * Math.sin(startAngle)

    // End point
    const x4 = centerX + radius * Math.cos(endAngle)
    const y4 = centerY + radius * Math.sin(endAngle)

    // First control point: start point + k * perpendicular direction
    const x2 = x1 - k * radius * Math.sin(startAngle)
    const y2 = y1 + k * radius * Math.cos(startAngle)

    // Second control point: end point - k * perpendicular direction
    const x3 = x4 + k * radius * Math.sin(endAngle)
    const y3 = y4 - k * radius * Math.cos(endAngle)

    // Draw cubic bezier curve
    // PDF operator: x1 y1 x2 y2 x3 y3 c (where x3,y3 is end point)
    this.writer.addContent(`${x2} ${y2} ${x3} ${y3} ${x4} ${y4} c`)
  }

  /**
   * Draw label for a slice
   */
  private drawLabel(
    centerX: number,
    centerY: number,
    midAngle: number,
    label: string,
    percentage: number
  ): void {
    const angleRad = this.degToRad(midAngle)
    const labelDistance = this.options.labelDistance!

    const labelX = centerX + labelDistance * Math.cos(angleRad) - (label.length * C.PIE_LABEL_CHAR_WIDTH)
    const labelY = centerY + labelDistance * Math.sin(angleRad) - C.PIE_LABEL_VERTICAL_OFFSET

    // Draw label text
    this.writer.text(label, labelX, labelY, C.PIE_LABEL_FONT_SIZE)

    // Draw percentage if enabled
    if (this.options.showPercentages) {
      const percentText = `${percentage.toFixed(1)}%`
      const percentX = labelX + (label.length * C.PIE_LABEL_CHAR_WIDTH)
      this.writer.text(percentText, percentX, labelY - C.PIE_PERCENTAGE_VERTICAL_OFFSET, C.PIE_PERCENTAGE_FONT_SIZE)
    }
  }

  /**
   * Draw legend
   */
  private drawLegend(items: LegendItem[], chartX: number, chartY: number): void {
    const legend = this.options.legend!
    const fontSize = legend.fontSize!
    const itemSpacing = legend.itemSpacing!

    const radius = this.isDonut && 'outerRadius' in this.options
      ? this.options.outerRadius
      : (this.options as PieChartOptions).radius

    let legendX = chartX
    let legendY = chartY

    // Position legend based on setting
    switch (legend.position) {
      case 'right':
        legendX = chartX + radius + C.PIE_LEGEND_RIGHT_OFFSET
        legendY = chartY + (items.length * (fontSize + itemSpacing)) / 2
        break
      case 'left':
        legendX = chartX - radius - C.PIE_LEGEND_LEFT_OFFSET
        legendY = chartY + (items.length * (fontSize + itemSpacing)) / 2
        break
      case 'top-right':
        legendX = chartX + radius + C.PIE_LEGEND_RIGHT_OFFSET
        legendY = chartY + radius + C.PIE_LEGEND_VERTICAL_SPACING
        break
      case 'top-left':
        legendX = chartX - radius - C.PIE_LEGEND_LEFT_OFFSET
        legendY = chartY + radius + C.PIE_LEGEND_VERTICAL_SPACING
        break
      case 'bottom-right':
        legendX = chartX + radius + C.PIE_LEGEND_RIGHT_OFFSET
        legendY = chartY - radius
        break
      case 'bottom-left':
        legendX = chartX - radius - C.PIE_LEGEND_LEFT_OFFSET
        legendY = chartY - radius
        break
    }

    // Draw each legend item
    items.forEach((item, index) => {
      const itemY = legendY - (index * (fontSize + itemSpacing))

      // Draw color box
      const [r, g, b] = parseColor(item.color)
      this.writer.setFillColor(r, g, b)
      this.writer.rect(legendX, itemY - C.PIE_LEGEND_BOX_VERTICAL_ADJUST, C.PIE_LEGEND_BOX_WIDTH, C.PIE_LEGEND_BOX_HEIGHT)
      this.writer.fill()

      // Draw label
      this.writer.text(item.label, legendX + C.PIE_LEGEND_LABEL_OFFSET, itemY, fontSize)
    })
  }

  /**
   * Draw border around the entire chart
   */
  private drawBorder(chartX: number, chartY: number): void {
    const border = this.options.border!
    const padding = border.padding!

    // Calculate radius
    const radius = this.isDonut && 'outerRadius' in this.options
      ? this.options.outerRadius
      : (this.options as PieChartOptions).radius

    // Calculate bounding box
    let minX = chartX - radius
    let maxX = chartX + radius
    let minY = chartY - radius
    let maxY = chartY + radius

    // Extend for labels if shown
    if (this.options.showLabels) {
      const labelDistance = this.options.labelDistance!
      minX = Math.min(minX, chartX - labelDistance - C.PIE_BORDER_LABEL_HORIZONTAL_PADDING)
      maxX = Math.max(maxX, chartX + labelDistance + C.PIE_BORDER_LABEL_HORIZONTAL_PADDING)
      minY = Math.min(minY, chartY - labelDistance - C.PIE_BORDER_LABEL_VERTICAL_PADDING)
      maxY = Math.max(maxY, chartY + labelDistance + C.PIE_BORDER_LABEL_VERTICAL_PADDING)
    }

    // Extend for legend if shown
    if (this.options.legend?.show) {
      const legend = this.options.legend
      const fontSize = legend.fontSize || C.PIE_LEGEND_FONT_SIZE
      const itemSpacing = legend.itemSpacing || C.PIE_LEGEND_ITEM_SPACING
      const numItems = this.options.data.length

      // Be generous with legend space - add 50pt margin vertically
      const legendVerticalSpace = numItems * (fontSize + itemSpacing) + C.PIE_LEGEND_VERTICAL_SPACE_MARGIN

      switch (legend.position) {
        case 'right':
        case 'top-right':
        case 'bottom-right':
          // Extend right and vertically
          maxX = Math.max(maxX, chartX + radius + C.PIE_LEGEND_BORDER_EXTENSION)
          minY = Math.min(minY, chartY - legendVerticalSpace / 2)
          maxY = Math.max(maxY, chartY + legendVerticalSpace / 2)
          break
        case 'left':
        case 'top-left':
        case 'bottom-left':
          // Extend left and vertically
          minX = Math.min(minX, chartX - radius - C.PIE_LEGEND_BORDER_EXTENSION)
          minY = Math.min(minY, chartY - legendVerticalSpace / 2)
          maxY = Math.max(maxY, chartY + legendVerticalSpace / 2)
          break
      }
    }

    // Extend for title if shown
    if (this.options.title) {
      maxY = Math.max(maxY, chartY + radius + C.TITLE_BORDER_EXTENSION)
    }

    // Apply padding
    minX -= padding
    minY -= padding
    maxX += padding
    maxY += padding

    const boxWidth = maxX - minX
    const boxHeight = maxY - minY

    // Validate bounding box - ensure positive dimensions
    if (boxWidth <= 0 || boxHeight <= 0) {
      return
    }

    // Set stroke style
    const [r, g, b] = parseColor(border.color!)
    this.writer.setStrokeColor(r, g, b)
    this.writer.setLineWidth(border.width!)

    // Draw border
    if (border.radius && border.radius > 0) {
      // Rounded rectangle
      this.drawRoundedRect(minX, minY, boxWidth, boxHeight, border.radius)
    } else {
      // Regular rectangle
      this.writer.rect(minX, minY, boxWidth, boxHeight)
      this.writer.stroke()
    }
  }

  /**
   * Draw rounded rectangle
   * Simplified version using small line segments to approximate rounded corners
   */
  private drawRoundedRect(x: number, y: number, width: number, height: number, radius: number): void {
    const r = Math.min(radius, width / 2, height / 2)

    // If radius is too small, just draw a regular rectangle
    if (r < C.PIE_MIN_ROUNDED_RECT_RADIUS) {
      this.writer.rect(x, y, width, height)
      this.writer.stroke()
      return
    }

    // Draw rectangle with straight corners for now (safe fallback)
    // TODO: Implement proper rounded corners without bezier arcs
    this.writer.rect(x, y, width, height)
    this.writer.stroke()
  }

  /**
   * Convert degrees to radians
   */
  private degToRad(degrees: number): number {
    return degrees * Math.PI / 180
  }
}
