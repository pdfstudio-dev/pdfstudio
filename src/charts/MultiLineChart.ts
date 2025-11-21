import { PDFWriter } from '../core/PDFWriter'
import { MultiLineChartOptions, LegendItem } from '../types'
import { parseColor } from '../utils/colors'
import { validateNonEmptyArray, validateRectangle } from '../utils/validation'
import { ChartDataError } from '../errors'
import * as C from './ChartConstants'

/**
 * MultiLineChart - Renders multiple line series on the same chart
 */
export class MultiLineChart {
  private writer: PDFWriter
  private options: MultiLineChartOptions

  // Default colors for multiple series
  private static readonly DEFAULT_COLORS = [
    '#3498db',  // Blue
    '#e74c3c',  // Red
    '#2ecc71',  // Green
    '#f39c12',  // Orange
    '#9b59b6',  // Purple
    '#1abc9c',  // Turquoise
    '#34495e',  // Dark gray
    '#e67e22'   // Dark orange
  ]

  constructor(writer: PDFWriter, options: MultiLineChartOptions) {
    // Validate inputs
    validateNonEmptyArray(options.data, 'data')
    validateRectangle(options.x, options.y, options.width, options.height)

    // Validate each data point
    options.data.forEach((dataPoint, dataIndex) => {
      if (!dataPoint.values || dataPoint.values.length === 0) {
        throw new ChartDataError(
          `Data point at index ${dataIndex} must have values`,
          'MultiLineChart',
          'empty values array'
        )
      }
      dataPoint.values.forEach((value, valueIndex) => {
        if (!Number.isFinite(value)) {
          throw new ChartDataError(
            `Value at data point ${dataIndex}, index ${valueIndex} must be finite, got: ${value}`,
            'MultiLineChart',
            'invalid value'
          )
        }
      })
    })

    this.writer = writer
    this.options = {
      colors: MultiLineChart.DEFAULT_COLORS,
      lineWidth: C.LINE_CHART_LINE_WIDTH,
      smooth: false,
      showPoints: true,
      pointSize: C.LINE_CHART_POINT_SIZE,
      showAxes: true,
      showGrid: false,
      showLabels: true,
      showValues: false,
      gridStyle: {
        color: '#e0e0e0',
        width: C.LINE_GRID_WIDTH_DEFAULT,
        dashPattern: []
      },
      legend: {
        show: true,
        position: 'top-right',
        fontSize: C.PIE_LEGEND_FONT_SIZE,
        itemSpacing: C.PIE_LEGEND_ITEM_SPACING
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
   * Render the multi-line chart
   */
  render(): void {
    const { data, x, y, width, height, title } = this.options

    // Reserve space for Y-axis labels (40 points)
    const yAxisLabelSpace = C.Y_AXIS_LABEL_SPACE
    const chartX = x + yAxisLabelSpace
    let chartWidth = width - yAxisLabelSpace

    // Reserve space for legend if on right
    const legendSpace = this.options.legend?.show && this.options.legend.position === 'right' ? C.MULTI_LINE_LEGEND_WIDTH : 0
    chartWidth -= legendSpace

    // Reserve space for X-axis labels (20 points)
    const xAxisLabelSpace = C.LINE_X_AXIS_LABEL_SPACE
    const chartY = y
    const chartHeight = height - xAxisLabelSpace

    // Draw title if provided
    if (title) {
      const titleX = chartX + chartWidth / 2 - (title.length * C.TITLE_CHAR_WIDTH)
      this.writer.text(title, titleX, y + height + C.TITLE_VERTICAL_OFFSET, C.TITLE_FONT_SIZE)
    }

    // Get all series data
    const seriesData = this.extractSeriesData(data)

    // Find global max and min values for scaling
    const allValues = seriesData.flatMap(series => series.values)
    const maxValue = Math.max(...allValues)
    const minValue = Math.min(0, ...allValues)
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

    // Draw each series
    seriesData.forEach((series, seriesIndex) => {
      const color = this.options.colors![seriesIndex % this.options.colors!.length]

      // Calculate points for this series
      const points = this.calculatePoints(
        series.values,
        chartX,
        chartY,
        chartWidth,
        chartHeight,
        roundedMax,
        roundedMin
      )

      // Draw line
      this.drawLine(points, color)

      // Draw points
      if (this.options.showPoints) {
        this.drawPoints(points, color)
      }
    })

    // Draw X-axis labels
    if (this.options.showLabels) {
      this.drawXAxisLabels(data, chartX, chartY, chartWidth, chartHeight)
    }

    // Draw border BEFORE legend
    if (this.options.border?.show) {
      this.drawBorder(x, y, width, height)
    }

    // Draw legend
    if (this.options.legend?.show) {
      const legendItems: LegendItem[] = seriesData.map((series, index) => ({
        label: series.name,
        color: this.options.colors![index % this.options.colors!.length]
      }))
      this.drawLegend(legendItems, chartX, chartY, chartWidth, chartHeight)
    }
  }

  /**
   * Extract series data from the data structure
   */
  private extractSeriesData(data: { label: string; values: number[]; series: string[] }[]): { name: string; values: number[] }[] {
    if (data.length === 0) return []

    const seriesCount = data[0].series.length
    const result: { name: string; values: number[] }[] = []

    for (let i = 0; i < seriesCount; i++) {
      result.push({
        name: data[0].series[i],
        values: data.map(d => d.values[i])
      })
    }

    return result
  }

  /**
   * Calculate point positions
   */
  private calculatePoints(
    values: number[],
    chartX: number,
    chartY: number,
    chartWidth: number,
    chartHeight: number,
    maxValue: number,
    minValue: number
  ): { x: number; y: number }[] {
    const points: { x: number; y: number }[] = []
    const valueRange = maxValue - minValue
    const spacing = chartWidth / (values.length - 1)

    values.forEach((value, index) => {
      const pointX = chartX + index * spacing
      const normalizedValue = (value - minValue) / valueRange
      const pointY = chartY + chartHeight - (normalizedValue * chartHeight)

      points.push({ x: pointX, y: pointY })
    })

    return points
  }

  /**
   * Draw line for a series
   */
  private drawLine(points: { x: number; y: number }[], color: string): void {
    if (points.length < 2) return

    const [r, g, b] = parseColor(color)
    this.writer.setStrokeColor(r, g, b)
    this.writer.setLineWidth(this.options.lineWidth!)

    this.writer.moveTo(points[0].x, points[0].y)

    for (let i = 1; i < points.length; i++) {
      this.writer.lineTo(points[i].x, points[i].y)
    }

    this.writer.stroke()
  }

  /**
   * Draw points for a series
   */
  private drawPoints(points: { x: number; y: number }[], color: string): void {
    const [r, g, b] = parseColor(color)
    this.writer.setFillColor(r, g, b)

    const radius = this.options.pointSize!

    points.forEach(point => {
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
    data: { label: string; values: number[]; series: string[] }[],
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

    // Horizontal grid lines
    const steps = C.AXIS_STEPS
    for (let i = 0; i <= steps; i++) {
      const gridY = y + (i / steps) * height
      this.writer.moveTo(x, gridY)
      this.writer.lineTo(x + width, gridY)
      this.writer.stroke()
    }

    // Vertical grid lines
    const spacing = width / (dataPoints - 1)
    for (let i = 0; i < dataPoints; i++) {
      const gridX = x + i * spacing
      this.writer.moveTo(gridX, y)
      this.writer.lineTo(gridX, y + height)
      this.writer.stroke()
    }
  }

  /**
   * Draw axes
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
   * Draw legend
   */
  private drawLegend(
    items: LegendItem[],
    chartX: number,
    chartY: number,
    chartWidth: number,
    chartHeight: number
  ): void {
    const legend = this.options.legend!
    const fontSize = legend.fontSize!
    const itemSpacing = legend.itemSpacing!

    let legendX = chartX
    let legendY = chartY

    // Position legend based on setting
    switch (legend.position) {
      case 'top-right':
        legendX = chartX + chartWidth - C.MULTI_LINE_LEGEND_WIDTH
        legendY = chartY + chartHeight + C.MULTI_LINE_LEGEND_VERTICAL_OFFSET
        break
      case 'top-left':
        legendX = chartX
        legendY = chartY + chartHeight + C.MULTI_LINE_LEGEND_VERTICAL_OFFSET
        break
      case 'right':
        legendX = chartX + chartWidth + C.LEGEND_CHART_SPACING
        legendY = chartY + chartHeight - C.MULTI_LINE_LEGEND_VERTICAL_POSITION
        break
      case 'bottom-right':
        legendX = chartX + chartWidth - C.MULTI_LINE_LEGEND_WIDTH
        legendY = chartY - C.MULTI_LINE_LEGEND_VERTICAL_OFFSET
        break
      case 'bottom-left':
        legendX = chartX
        legendY = chartY - C.MULTI_LINE_LEGEND_VERTICAL_OFFSET
        break
      case 'left':
        legendX = chartX - C.MULTI_LINE_LEGEND_WIDTH
        legendY = chartY + chartHeight - C.MULTI_LINE_LEGEND_VERTICAL_POSITION
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
   * Round to nice value for axis scaling
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
    let minX = x - padding
    let minY = y - padding
    let maxX = x + width + padding
    let maxY = y + height + padding

    // Extend for title if shown
    if (this.options.title) {
      maxY = Math.max(maxY, y + height + C.TITLE_BORDER_EXTENSION)
    }

    // Extend for legend if on right
    if (this.options.legend?.show && this.options.legend.position === 'right') {
      maxX = Math.max(maxX, x + width + C.MULTI_LINE_LEGEND_BORDER_EXTENSION)
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

    // Draw border rectangle
    this.writer.rect(minX, minY, boxWidth, boxHeight)
    this.writer.stroke()
  }
}
