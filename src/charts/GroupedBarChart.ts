import { PDFWriter } from '../core/PDFWriter'
import { GroupedBarChartOptions } from '../types'
import { parseColor } from '../utils/colors'
import { validateNonEmptyArray, validateRectangle } from '../utils/validation'
import { ChartDataError } from '../errors'
import * as C from './ChartConstants'

/**
 * GroupedBarChart - Renders grouped bar charts
 */
export class GroupedBarChart {
  private writer: PDFWriter
  private options: GroupedBarChartOptions

  constructor(writer: PDFWriter, options: GroupedBarChartOptions) {
    // Validate inputs
    validateNonEmptyArray(options.data, 'data')
    validateRectangle(options.x, options.y, options.width, options.height)

    // Validate all data groups and values
    options.data.forEach((group, groupIndex) => {
      if (!group.values || group.values.length === 0) {
        throw new ChartDataError(
          `Data group at index ${groupIndex} must have values`,
          'GroupedBarChart',
          'empty values array'
        )
      }
      group.values.forEach((value, valueIndex) => {
        if (!Number.isFinite(value)) {
          throw new ChartDataError(
            `Data value at group ${groupIndex}, index ${valueIndex} must be finite, got: ${value}`,
            'GroupedBarChart',
            'invalid value'
          )
        }
      })
    })

    this.writer = writer
    this.options = {
      colors: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'],
      showAxes: true,
      showGrid: false,
      showLabels: true,
      showValues: false,
      orientation: 'vertical',
      border: {
        show: false,
        color: '#000000',
        width: 1,
        padding: 10
      },
      ...options
    }
  }

  /**
   * Render the grouped bar chart
   */
  render(): void {
    const { data, x, y, width, height, title } = this.options

    const yAxisLabelSpace = C.Y_AXIS_LABEL_SPACE
    const chartX = x + yAxisLabelSpace
    const chartWidth = width - yAxisLabelSpace

    // Draw title
    if (title) {
      const titleX = chartX + chartWidth / 2 - (title.length * C.TITLE_CHAR_WIDTH)
      this.writer.text(title, titleX, y + height + C.TITLE_VERTICAL_OFFSET, C.TITLE_FONT_SIZE)
    }

    // Find max value
    const maxValue = Math.max(...data.flatMap(d => d.values))
    const roundedMax = this.roundToNice(maxValue)

    // Draw axes
    if (this.options.showAxes) {
      this.drawYAxisScale(chartX, y, height, roundedMax)
      this.drawAxes(chartX, y, chartWidth, height)
    }

    // Calculate dimensions
    const groupCount = data.length
    const seriesCount = data[0]?.values.length || 0
    const groupSpacing = C.GROUPED_BAR_GROUP_SPACING
    const barSpacing = C.GROUPED_BAR_SPACING
    const totalGroupSpacing = (groupCount - 1) * groupSpacing
    const availableWidth = chartWidth - totalGroupSpacing
    const groupWidth = availableWidth / groupCount
    const barWidth = (groupWidth - (seriesCount - 1) * barSpacing) / seriesCount

    // Draw bars
    data.forEach((group, groupIndex) => {
      const groupX = chartX + groupIndex * (groupWidth + groupSpacing)

      group.values.forEach((value, seriesIndex) => {
        const barHeight = (value / roundedMax) * height
        const barX = groupX + seriesIndex * (barWidth + barSpacing)
        const barY = y

        const color = this.options.colors![seriesIndex % this.options.colors!.length]
        const barColor = parseColor(color)

        this.writer.setFillColor(barColor[0], barColor[1], barColor[2])
        this.writer.rect(barX, barY, barWidth, barHeight)
        this.writer.fill()

        // Draw value if enabled
        if (this.options.showValues) {
          const valueStr = value.toString()
          const valueX = barX + barWidth / 2 - (valueStr.length * 2.5)
          this.writer.text(valueStr, valueX, barY + barHeight + 8, 9)
        }
      })

      // Draw group label
      if (this.options.showLabels) {
        const labelX = groupX + groupWidth / 2 - (group.label.length * 3)
        this.writer.text(group.label, labelX, y - 25, 11)
      }
    })

    // Draw border BEFORE legend
    if (this.options.border?.show) {
      this.drawBorder(x, y, width, height)
    }

    // Draw legend
    if (this.options.legend?.show && data[0]) {
      this.drawLegend(chartX, y, chartWidth, height, data[0].series)
    }
  }

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

  private drawYAxisScale(x: number, y: number, height: number, maxValue: number): void {
    const steps = 5
    const stepValue = maxValue / steps

    for (let i = 0; i <= steps; i++) {
      const value = Math.round(i * stepValue)
      const yPos = y + (height * i / steps)

      this.writer.text(value.toString(), x - 35, yPos - 3, 9)

      this.writer.setStrokeColor(0, 0, 0)
      this.writer.setLineWidth(1)
      this.writer.moveTo(x - 5, yPos)
      this.writer.lineTo(x, yPos)
      this.writer.stroke()

      if (this.options.showGrid && i > 0) {
        this.writer.setStrokeColor(0.9, 0.9, 0.9)
        this.writer.setLineWidth(0.5)
        this.writer.moveTo(x, yPos)
        this.writer.lineTo(x + this.options.width - 40, yPos)
        this.writer.stroke()
      }
    }
  }

  private drawAxes(x: number, y: number, width: number, height: number): void {
    this.writer.setStrokeColor(0, 0, 0)
    this.writer.setLineWidth(2)

    this.writer.moveTo(x, y)
    this.writer.lineTo(x, y + height)
    this.writer.stroke()

    this.writer.moveTo(x, y)
    this.writer.lineTo(x + width, y)
    this.writer.stroke()
  }

  private drawLegend(chartX: number, chartY: number, chartWidth: number, chartHeight: number, series: string[]): void {
    const legendX = chartX + chartWidth - 120
    const legendY = chartY + chartHeight + 20

    series.forEach((label, index) => {
      const itemY = legendY + index * 15
      const color = parseColor(this.options.colors![index % this.options.colors!.length])

      // Draw color box
      this.writer.setFillColor(color[0], color[1], color[2])
      this.writer.rect(legendX, itemY, 8, 8)
      this.writer.fill()

      // Draw label
      this.writer.text(label, legendX + 13, itemY, 10)
    })
  }

  /**
   * Draw border around the entire chart
   */
  private drawBorder(x: number, y: number, width: number, height: number): void {
    const border = this.options.border!
    const padding = border.padding!

    // Calculate bounding box for entire chart area
    let minX = x - padding
    let minY = y - padding - 30  // Extra space for labels below
    let maxX = x + width + padding
    let maxY = y + height + padding

    // Extend for title if shown
    if (this.options.title) {
      maxY = Math.max(maxY, y + height + 60)
    }

    // Extend for legend if shown
    if (this.options.legend?.show) {
      const legendHeight = 60  // Approximate legend space
      maxY = Math.max(maxY, y + height + legendHeight)
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
