import { PDFWriter } from '../core/PDFWriter'
import { LineChartOptions } from '../types'
import { parseColor } from '../utils/colors'
import { validateNonEmptyArray, validateRectangle } from '../utils/validation'
import { ChartDataError } from '../errors'
import * as C from './ChartConstants'

/**
 * LineChart - Renders a line chart with optional points and area fill
 */
export class LineChart {
  private writer: PDFWriter
  private options: LineChartOptions

  constructor(writer: PDFWriter, options: LineChartOptions) {
    // Validate inputs
    validateNonEmptyArray(options.data, 'data')
    validateRectangle(options.x, options.y, options.width, options.height)

    // Validate data values
    options.data.forEach((item, index) => {
      if (!Number.isFinite(item.value)) {
        throw new ChartDataError(
          `Data value at index ${index} must be finite, got: ${item.value}`,
          'LineChart',
          'invalid value'
        )
      }
    })

    this.writer = writer
    this.options = {
      lineColor: '#3498db',
      lineWidth: C.LINE_CHART_LINE_WIDTH,
      smooth: false,
      showPoints: true,
      pointSize: C.LINE_CHART_POINT_SIZE,
      pointColor: '#3498db',
      fillArea: false,
      fillColor: '#3498db',
      fillOpacity: C.LINE_FILL_OPACITY_DEFAULT,
      showAxes: true,
      showGrid: false,
      showLabels: true,
      showValues: false,
      gridStyle: {
        color: '#e0e0e0',
        width: C.LINE_GRID_WIDTH_DEFAULT,
        dashPattern: []
      },
      border: {
        show: false,
        color: '#000000',
        width: C.LINE_BORDER_WIDTH_DEFAULT,
        padding: C.LINE_BORDER_PADDING_DEFAULT
      },
      ...options
    }
  }

  /**
   * Render the line chart
   */
  render(): void {
    const { data, x, y, width, height, title } = this.options

    // Reserve space for Y-axis labels (40 points)
    const yAxisLabelSpace = C.Y_AXIS_LABEL_SPACE
    const chartX = x + yAxisLabelSpace
    const chartWidth = width - yAxisLabelSpace

    // Reserve space for X-axis labels (20 points)
    const xAxisLabelSpace = C.LINE_X_AXIS_LABEL_SPACE
    const chartY = y
    const chartHeight = height - xAxisLabelSpace

    // Draw title if provided
    if (title) {
      const titleX = chartX + chartWidth / 2 - (title.length * C.TITLE_CHAR_WIDTH)
      this.writer.text(title, titleX, y + height + C.TITLE_VERTICAL_OFFSET, C.TITLE_FONT_SIZE)
    }

    // Find max and min values for scaling
    const values = data.map(d => d.value)
    const maxValue = Math.max(...values)
    const minValue = Math.min(0, ...values)  // Include 0 or go negative
    const roundedMax = this.roundToNice(maxValue)
    const roundedMin = minValue < 0 ? -this.roundToNice(Math.abs(minValue)) : 0

    // Draw grid if enabled
    if (this.options.showGrid) {
      this.drawGrid(chartX, chartY, chartWidth, chartHeight, data.length, roundedMax, roundedMin)
    }

    // Draw axes
    if (this.options.showAxes) {
      this.drawYAxisScale(chartX, chartY, chartHeight, roundedMax, roundedMin)
      this.drawAxes(chartX, chartY, chartWidth, chartHeight)
    }

    // Calculate point positions
    const points = this.calculatePoints(data, chartX, chartY, chartWidth, chartHeight, roundedMax, roundedMin)

    // Fill area under curve if enabled
    if (this.options.fillArea) {
      this.drawFilledArea(points, chartY, chartHeight)
    }

    // Draw the line
    this.drawLine(points)

    // Draw points if enabled
    if (this.options.showPoints) {
      this.drawPoints(points)
    }

    // Draw X-axis labels
    if (this.options.showLabels) {
      this.drawXAxisLabels(data, chartX, chartY, chartWidth, chartHeight)
    }

    // Draw values on points if enabled
    if (this.options.showValues) {
      this.drawValues(data, points)
    }

    // Draw border around entire chart
    if (this.options.border?.show) {
      this.drawBorder(x, y, width, height)
    }
  }

  /**
   * Calculate point positions for all data points
   */
  private calculatePoints(
    data: { label: string; value: number }[],
    chartX: number,
    chartY: number,
    chartWidth: number,
    chartHeight: number,
    maxValue: number,
    minValue: number
  ): { x: number; y: number }[] {
    const points: { x: number; y: number }[] = []
    const valueRange = maxValue - minValue
    const spacing = chartWidth / (data.length - 1)

    data.forEach((item, index) => {
      const pointX = chartX + index * spacing
      const normalizedValue = (item.value - minValue) / valueRange
      const pointY = chartY + chartHeight - (normalizedValue * chartHeight)

      points.push({ x: pointX, y: pointY })
    })

    return points
  }

  /**
   * Draw the line connecting all points
   */
  private drawLine(points: { x: number; y: number }[]): void {
    if (points.length < 2) return

    const [r, g, b] = parseColor(this.options.lineColor!)
    this.writer.setStrokeColor(r, g, b)
    this.writer.setLineWidth(this.options.lineWidth!)

    // Start at first point
    this.writer.moveTo(points[0].x, points[0].y)

    if (this.options.smooth && points.length > 2) {
      // Draw smooth curves using quadratic bezier curves
      for (let i = 0; i < points.length - 1; i++) {
        const current = points[i]
        const next = points[i + 1]

        // Control point is midpoint
        const cpX = (current.x + next.x) / 2
        const cpY = (current.y + next.y) / 2

        // For PDF, we'll approximate with line segments for now
        // (True bezier curves require more complex PDF operators)
        const segments = C.LINE_SMOOTH_CURVE_SEGMENTS
        for (let s = 0; s <= segments; s++) {
          const t = s / segments
          const x = current.x + t * (next.x - current.x)
          const y = current.y + t * (next.y - current.y)
          this.writer.lineTo(x, y)
        }
      }
    } else {
      // Draw straight lines
      for (let i = 1; i < points.length; i++) {
        this.writer.lineTo(points[i].x, points[i].y)
      }
    }

    this.writer.stroke()
  }

  /**
   * Draw filled area under the curve
   */
  private drawFilledArea(points: { x: number; y: number }[], chartY: number, chartHeight: number): void {
    if (points.length < 2) return

    const baseY = chartY + chartHeight
    const [r, g, b] = parseColor(this.options.fillColor!)
    this.writer.setFillColor(r * this.options.fillOpacity!, g * this.options.fillOpacity!, b * this.options.fillOpacity!)

    // Start at bottom-left
    this.writer.moveTo(points[0].x, baseY)

    // Go up to first point
    this.writer.lineTo(points[0].x, points[0].y)

    // Draw along the line
    for (let i = 1; i < points.length; i++) {
      this.writer.lineTo(points[i].x, points[i].y)
    }

    // Go down to baseline
    this.writer.lineTo(points[points.length - 1].x, baseY)

    // Close path
    this.writer.lineTo(points[0].x, baseY)

    this.writer.fill()
  }

  /**
   * Draw points (dots) at each data point
   */
  private drawPoints(points: { x: number; y: number }[]): void {
    const [r, g, b] = parseColor(this.options.pointColor!)
    this.writer.setFillColor(r, g, b)

    const radius = this.options.pointSize!

    points.forEach(point => {
      // Draw circle as a filled rectangle (simplified - PDF circles need arc operators)
      // For now, draw small filled squares
      this.writer.rect(
        point.x - radius,
        point.y - radius,
        radius * 2,
        radius * 2
      )
      this.writer.fill()
    })
  }

  /**
   * Draw X-axis labels
   */
  private drawXAxisLabels(
    data: { label: string; value: number }[],
    chartX: number,
    chartY: number,
    chartWidth: number,
    chartHeight: number
  ): void {
    const spacing = chartWidth / (data.length - 1)

    data.forEach((item, index) => {
      const labelX = chartX + index * spacing - (item.label.length * C.SCALE_CHAR_WIDTH)
      const labelY = chartY + chartHeight + C.X_AXIS_SCALE_LABEL_OFFSET

      this.writer.text(item.label, labelX, labelY, C.LINE_LABEL_FONT_SIZE)
    })
  }

  /**
   * Draw values above/below points
   */
  private drawValues(
    data: { label: string; value: number }[],
    points: { x: number; y: number }[]
  ): void {
    data.forEach((item, index) => {
      const point = points[index]
      const valueText = item.value.toString()
      const valueX = point.x - (valueText.length * C.SCALE_CHAR_WIDTH)
      const valueY = point.y - C.LINE_VALUE_VERTICAL_OFFSET

      this.writer.text(valueText, valueX, valueY, C.SCALE_FONT_SIZE)
    })
  }

  /**
   * Draw Y-axis scale labels
   */
  private drawYAxisScale(
    x: number,
    y: number,
    height: number,
    maxValue: number,
    minValue: number
  ): void {
    const steps = C.AXIS_STEPS
    const valueRange = maxValue - minValue
    const stepValue = valueRange / steps

    for (let i = 0; i <= steps; i++) {
      const value = minValue + (i * stepValue)
      const labelY = y + height - (i / steps) * height
      const labelText = value.toFixed(0)
      const labelX = x - C.Y_AXIS_SCALE_LABEL_OFFSET

      this.writer.text(labelText, labelX, labelY - C.SCALE_LABEL_VERTICAL_ADJUST, C.SCALE_FONT_SIZE)
    }
  }

  /**
   * Draw grid lines
   */
  private drawGrid(
    x: number,
    y: number,
    width: number,
    height: number,
    dataPoints: number,
    maxValue: number,
    minValue: number
  ): void {
    const gridStyle = this.options.gridStyle!
    const [r, g, b] = parseColor(gridStyle.color!)

    this.writer.setStrokeColor(r, g, b)
    this.writer.setLineWidth(gridStyle.width!)

    // Horizontal grid lines (for Y values)
    const steps = C.AXIS_STEPS
    for (let i = 0; i <= steps; i++) {
      const gridY = y + (i / steps) * height
      this.writer.moveTo(x, gridY)
      this.writer.lineTo(x + width, gridY)
      this.writer.stroke()
    }

    // Vertical grid lines (for X values)
    const spacing = width / (dataPoints - 1)
    for (let i = 0; i < dataPoints; i++) {
      const gridX = x + i * spacing
      this.writer.moveTo(gridX, y)
      this.writer.lineTo(gridX, y + height)
      this.writer.stroke()
    }
  }

  /**
   * Draw X and Y axes
   */
  private drawAxes(x: number, y: number, width: number, height: number): void {
    this.writer.setStrokeColor(0, 0, 0)
    this.writer.setLineWidth(C.GRID_LINE_WIDTH)

    // Y-axis
    this.writer.moveTo(x, y)
    this.writer.lineTo(x, y + height)
    this.writer.stroke()

    // X-axis
    this.writer.moveTo(x, y + height)
    this.writer.lineTo(x + width, y + height)
    this.writer.stroke()
  }

  /**
   * Round a number to a "nice" value for axis scaling
   */
  private roundToNice(value: number): number {
    const magnitude = Math.pow(10, Math.floor(Math.log10(value)))
    const normalized = value / magnitude

    let nice: number
    if (normalized <= 1) nice = 1
    else if (normalized <= 2) nice = 2
    else if (normalized <= 5) nice = 5
    else nice = 10

    return nice * magnitude
  }

  /**
   * Draw border around the entire chart
   */
  private drawBorder(x: number, y: number, width: number, height: number): void {
    const border = this.options.border!
    const padding = border.padding!

    // Calculate bounding box for entire chart area
    const minX = x - padding
    const minY = y - padding
    const maxX = x + width + padding
    const maxY = y + height + padding

    // Extend for title if shown
    if (this.options.title) {
      const titleHeight = C.TITLE_BORDER_EXTENSION
      const titleY = y + height + titleHeight
      // maxY already includes height, so extend if title goes beyond
      if (titleY > maxY) {
        // Title is below, no need to extend maxY more
      }
    }

    const boxWidth = maxX - minX
    const boxHeight = maxY - minY

    // Validate bounding box
    if (boxWidth <= 0 || boxHeight <= 0) {
      return
    }

    // Set stroke style
    const [r, g, b] = parseColor(border.color!)
    this.writer.setStrokeColor(r, g, b)
    this.writer.setLineWidth(border.width!)

    // Draw border (always rectangular for line charts)
    this.writer.rect(minX, minY, boxWidth, boxHeight)
    this.writer.stroke()
  }
}
