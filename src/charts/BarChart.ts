import { PDFWriter } from '../core/PDFWriter'
import { BarChartOptions, LegendItem } from '../types'
import { parseColor } from '../utils/colors'
import { validateNonEmptyArray, validateRectangle } from '../utils/validation'
import { ChartDataError } from '../errors'
import * as C from './ChartConstants'

/**
 * BarChart - Renders a vertical or horizontal bar chart
 */
export class BarChart {
  private writer: PDFWriter
  private options: BarChartOptions

  constructor(writer: PDFWriter, options: BarChartOptions) {
    // Validate inputs
    validateNonEmptyArray(options.data, 'data')
    validateRectangle(options.x, options.y, options.width, options.height)

    // Validate all data values are finite
    options.data.forEach((item, index) => {
      if (!Number.isFinite(item.value)) {
        throw new ChartDataError(
          `Data value at index ${index} must be a finite number, got: ${item.value}`,
          'BarChart',
          'invalid value'
        )
      }
    })

    this.writer = writer
    this.options = {
      barColor: '#3498db',
      showAxes: true,
      showGrid: false,
      showLabels: true,
      showValues: true,
      orientation: 'vertical',
      gridStyle: {
        color: '#e0e0e0',
        width: 0.5,
        dashPattern: []
      },
      shadow: {
        enabled: false,
        color: 'rgba(0,0,0,0.3)',
        blur: 5,
        offsetX: 2,
        offsetY: 2
      },
      gradient: {
        enabled: false,
        type: 'linear',
        colors: ['#3498db', '#2980b9'],
        angle: 90
      },
      legend: {
        show: false,
        position: 'top-right',
        fontSize: 10,
        itemSpacing: 5
      },
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
   * Render the bar chart
   */
  render(): void {
    if (this.options.orientation === 'horizontal') {
      this.renderHorizontal()
    } else {
      this.renderVertical()
    }

    // Draw border around entire chart
    if (this.options.border?.show) {
      this.drawBorder()
    }
  }

  /**
   * Render vertical bar chart
   */
  private renderVertical(): void {
    const { data, x, y, width, height, title } = this.options

    // Reserve space for Y-axis labels
    const yAxisLabelSpace = C.Y_AXIS_LABEL_SPACE
    const chartX = x + yAxisLabelSpace
    const chartWidth = width - yAxisLabelSpace

    // Draw title if provided (above the chart)
    if (title) {
      const titleX = chartX + chartWidth / 2 - (title.length * C.TITLE_CHAR_WIDTH)
      this.writer.text(title, titleX, y + height + C.TITLE_VERTICAL_OFFSET, C.TITLE_FONT_SIZE)
    }

    // Find max value for scaling
    const maxValue = Math.max(...data.map(d => d.value))
    const roundedMax = this.roundToNice(maxValue)

    // Draw Y-axis scale and grid
    if (this.options.showAxes) {
      this.drawYAxisScale(chartX, y, height, roundedMax)
      this.drawAxes(chartX, y, chartWidth, height)
    }

    // Calculate bar dimensions with better spacing
    const barCount = data.length
    const barSpacing = C.VERTICAL_BAR_SPACING
    const totalSpacing = (barCount - 1) * barSpacing
    const availableWidth = chartWidth - totalSpacing
    const barWidth = availableWidth / barCount

    // Draw bars
    data.forEach((item, index) => {
      const barHeight = (item.value / roundedMax) * height
      const barX = chartX + index * (barWidth + barSpacing)
      const barY = y

      // Get color for this bar
      const barColor = this.getBarColor(index)

      this.drawBar(barX, barY, barWidth, barHeight, barColor, index)

      // Draw label (below the chart)
      if (this.options.showLabels) {
        const labelX = barX + barWidth / 2 - (item.label.length * C.LABEL_CHAR_WIDTH)
        this.writer.text(item.label, labelX, y - C.VERTICAL_LABEL_BOTTOM_OFFSET, C.LABEL_FONT_SIZE)
      }

      // Draw value (above the bar)
      if (this.options.showValues) {
        const valueStr = item.value.toString()
        const valueX = barX + barWidth / 2 - (valueStr.length * C.LABEL_CHAR_WIDTH)
        this.writer.text(valueStr, valueX, barY + barHeight + C.VERTICAL_VALUE_TOP_OFFSET, C.LABEL_FONT_SIZE)
      }
    })

    // Draw legend if enabled
    if (this.options.legend?.show && this.options.barColors) {
      this.drawLegend(chartX, y, chartWidth, height)
    }
  }

  /**
   * Render horizontal bar chart
   */
  private renderHorizontal(): void {
    const { data, x, y, width, height, title } = this.options

    // Reserve space for label area and bottom space for X-axis labels
    const labelSpace = C.HORIZONTAL_LABEL_SPACE
    const bottomSpace = C.HORIZONTAL_BOTTOM_SPACE
    const chartX = x + labelSpace
    const chartWidth = width - labelSpace
    const chartHeight = height - bottomSpace
    const chartY = y + bottomSpace

    // Draw title if provided (above the chart)
    if (title) {
      const titleX = chartX + chartWidth / 2 - (title.length * C.TITLE_CHAR_WIDTH)
      this.writer.text(title, titleX, chartY + chartHeight + C.TITLE_VERTICAL_OFFSET, C.TITLE_FONT_SIZE)
    }

    // Find max value for scaling
    const maxValue = Math.max(...data.map(d => d.value))
    const roundedMax = this.roundToNice(maxValue)

    // Draw X-axis scale and grid
    if (this.options.showAxes) {
      this.drawXAxisScale(chartX, chartY, chartWidth, chartHeight, roundedMax)
      this.drawHorizontalAxes(chartX, chartY, chartWidth, chartHeight)
    }

    // Calculate bar dimensions
    const barCount = data.length
    const barSpacing = C.HORIZONTAL_BAR_SPACING
    const totalSpacing = (barCount - 1) * barSpacing
    const availableHeight = chartHeight - totalSpacing
    const barHeight = availableHeight / barCount

    // Draw bars
    data.forEach((item, index) => {
      const barWidth = (item.value / roundedMax) * chartWidth
      const barY = chartY + index * (barHeight + barSpacing)
      const barX = chartX

      // Get color for this bar
      const barColor = this.getBarColor(index)

      this.drawHorizontalBar(barX, barY, barWidth, barHeight, barColor, index)

      // Draw label (to the left)
      if (this.options.showLabels) {
        const labelX = x + C.SMALL_OFFSET
        const labelY = barY + barHeight / 2 - C.SMALL_OFFSET
        this.writer.text(item.label, labelX, labelY, C.LABEL_FONT_SIZE)
      }

      // Draw value (at the end of bar)
      if (this.options.showValues) {
        const valueStr = item.value.toString()
        const valueX = barX + barWidth + C.SMALL_OFFSET
        const valueY = barY + barHeight / 2 - C.SMALL_OFFSET
        this.writer.text(valueStr, valueX, valueY, C.LABEL_FONT_SIZE)
      }
    })

    // Draw legend if enabled
    if (this.options.legend?.show && this.options.barColors) {
      this.drawLegend(chartX, chartY, chartWidth, chartHeight)
    }
  }

  /**
   * Get color for bar at index
   */
  private getBarColor(index: number): string {
    if (this.options.barColors && this.options.barColors.length > 0) {
      return this.options.barColors[index % this.options.barColors.length]
    }
    return this.options.barColor || '#3498db'
  }

  /**
   * Round value to a nice number for scale
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
   * Draw X-axis scale with numbers (for horizontal charts)
   */
  private drawXAxisScale(x: number, y: number, width: number, height: number, maxValue: number): void {
    const steps = C.AXIS_STEPS
    const stepValue = maxValue / steps

    for (let i = 0; i <= steps; i++) {
      const value = Math.round(i * stepValue)
      const xPos = x + (width * i / steps)

      // Draw scale number (below X-axis)
      const valueStr = value.toString()
      this.writer.text(valueStr, xPos - (valueStr.length * C.SCALE_CHAR_WIDTH), y - C.X_AXIS_SCALE_LABEL_OFFSET, C.SCALE_FONT_SIZE)

      // Draw tick mark
      this.writer.setStrokeColor(0, 0, 0)
      this.writer.setLineWidth(C.GRID_LINE_WIDTH)
      this.writer.moveTo(xPos, y)
      this.writer.lineTo(xPos, y - C.TICK_MARK_LENGTH)
      this.writer.stroke()

      // Draw grid line
      if (this.options.showGrid && i > 0) {
        const gridColor = parseColor(this.options.gridStyle?.color || '#e0e0e0')
        this.writer.setStrokeColor(gridColor[0], gridColor[1], gridColor[2])
        this.writer.setLineWidth(this.options.gridStyle?.width || 0.5)

        this.writer.moveTo(xPos, y)
        this.writer.lineTo(xPos, y + height)
        this.writer.stroke()
      }
    }
  }

  /**
   * Draw Y-axis scale with numbers
   */
  private drawYAxisScale(x: number, y: number, height: number, maxValue: number): void {
    const steps = C.AXIS_STEPS
    const stepValue = maxValue / steps

    for (let i = 0; i <= steps; i++) {
      const value = Math.round(i * stepValue)
      const yPos = y + (height * i / steps)

      // Draw scale number
      const valueStr = value.toString()
      this.writer.text(valueStr, x - C.Y_AXIS_SCALE_LABEL_OFFSET, yPos - C.SCALE_LABEL_VERTICAL_ADJUST, C.SCALE_FONT_SIZE)

      // Draw tick mark
      this.writer.setStrokeColor(0, 0, 0)
      this.writer.setLineWidth(C.GRID_LINE_WIDTH)
      this.writer.moveTo(x - C.TICK_MARK_LENGTH, yPos)
      this.writer.lineTo(x, yPos)
      this.writer.stroke()

      // Draw grid line
      if (this.options.showGrid && i > 0) {
        const gridColor = parseColor(this.options.gridStyle?.color || '#e0e0e0')
        this.writer.setStrokeColor(gridColor[0], gridColor[1], gridColor[2])
        this.writer.setLineWidth(this.options.gridStyle?.width || 0.5)

        // Dash pattern if specified
        if (this.options.gridStyle?.dashPattern && this.options.gridStyle.dashPattern.length > 0) {
          // Note: PDF dash pattern would need to be implemented in PDFWriter
          // For now, draw solid line
        }

        this.writer.moveTo(x, yPos)
        this.writer.lineTo(x + this.options.width - C.Y_AXIS_LABEL_SPACE, yPos)
        this.writer.stroke()
      }
    }
  }

  /**
   * Draw a single horizontal bar with all effects
   */
  private drawHorizontalBar(x: number, y: number, width: number, height: number, color: string, index: number): void {
    // Draw shadow if enabled
    if (this.options.shadow?.enabled) {
      const shadowOffsetX = this.options.shadow.offsetX || C.SHADOW_OFFSET_X
      const shadowOffsetY = this.options.shadow.offsetY || -C.SHADOW_OFFSET_Y

      // Simple shadow (gray rectangle offset)
      this.writer.setFillColor(C.SHADOW_COLOR_GRAY, C.SHADOW_COLOR_GRAY, C.SHADOW_COLOR_GRAY)
      this.writer.rect(x + shadowOffsetX, y + shadowOffsetY, width, height)
      this.writer.fill()
    }

    // Draw the main bar
    if (this.options.gradient?.enabled && this.options.gradient.colors && this.options.gradient.colors.length >= 2) {
      // For horizontal gradient, we change along the width
      const steps = C.GRADIENT_STEPS
      const color1 = parseColor(this.options.gradient.colors[0])
      const color2 = parseColor(this.options.gradient.colors[1])

      for (let i = 0; i < steps; i++) {
        const ratio = i / steps
        const r = color1[0] + (color2[0] - color1[0]) * ratio
        const g = color1[1] + (color2[1] - color1[1]) * ratio
        const b = color1[2] + (color2[2] - color1[2]) * ratio

        const segmentWidth = width / steps
        const segmentX = x + i * segmentWidth

        this.writer.setFillColor(r, g, b)
        this.writer.rect(segmentX, y, segmentWidth, height)
        this.writer.fill()
      }
    } else {
      // Solid color
      const barColor = parseColor(color)
      this.writer.setFillColor(barColor[0], barColor[1], barColor[2])
      this.writer.rect(x, y, width, height)
      this.writer.fill()
    }
  }

  /**
   * Draw a single bar with all effects (vertical)
   */
  private drawBar(x: number, y: number, width: number, height: number, color: string, index: number): void {
    // Draw shadow if enabled
    if (this.options.shadow?.enabled) {
      const shadowOffsetX = this.options.shadow.offsetX || C.SHADOW_OFFSET_X
      const shadowOffsetY = this.options.shadow.offsetY || C.SHADOW_OFFSET_Y

      // Simple shadow (gray rectangle offset)
      this.writer.setFillColor(C.SHADOW_COLOR_GRAY, C.SHADOW_COLOR_GRAY, C.SHADOW_COLOR_GRAY)
      this.writer.rect(x + shadowOffsetX, y - shadowOffsetY, width, height)
      this.writer.fill()
    }

    // Draw the main bar
    if (this.options.gradient?.enabled && this.options.gradient.colors && this.options.gradient.colors.length >= 2) {
      // For gradient, we'll draw multiple rectangles with gradually changing colors
      const steps = C.GRADIENT_STEPS
      const color1 = parseColor(this.options.gradient.colors[0])
      const color2 = parseColor(this.options.gradient.colors[1])

      for (let i = 0; i < steps; i++) {
        const ratio = i / steps
        const r = color1[0] + (color2[0] - color1[0]) * ratio
        const g = color1[1] + (color2[1] - color1[1]) * ratio
        const b = color1[2] + (color2[2] - color1[2]) * ratio

        const segmentHeight = height / steps
        const segmentY = y + i * segmentHeight

        this.writer.setFillColor(r, g, b)
        this.writer.rect(x, segmentY, width, segmentHeight)
        this.writer.fill()
      }
    } else {
      // Solid color
      const barColor = parseColor(color)
      this.writer.setFillColor(barColor[0], barColor[1], barColor[2])
      this.writer.rect(x, y, width, height)
      this.writer.fill()
    }
  }

  /**
   * Draw chart axes (vertical orientation)
   */
  private drawAxes(x: number, y: number, width: number, height: number): void {
    this.writer.setStrokeColor(0, 0, 0)
    this.writer.setLineWidth(C.AXES_LINE_WIDTH)

    // Y-axis (vertical)
    this.writer.moveTo(x, y)
    this.writer.lineTo(x, y + height)
    this.writer.stroke()

    // X-axis (horizontal)
    this.writer.moveTo(x, y)
    this.writer.lineTo(x + width, y)
    this.writer.stroke()
  }

  /**
   * Draw axes for horizontal orientation
   */
  private drawHorizontalAxes(x: number, y: number, width: number, height: number): void {
    this.writer.setStrokeColor(0, 0, 0)
    this.writer.setLineWidth(C.AXES_LINE_WIDTH)

    // Y-axis (vertical)
    this.writer.moveTo(x, y)
    this.writer.lineTo(x, y + height)
    this.writer.stroke()

    // X-axis (horizontal)
    this.writer.moveTo(x, y + height)
    this.writer.lineTo(x + width, y + height)
    this.writer.stroke()
  }

  /**
   * Draw legend
   */
  private drawLegend(chartX: number, chartY: number, chartWidth: number, chartHeight: number): void {
    const legend = this.options.legend!
    const position = legend.position || 'top-right'
    const fontSize = legend.fontSize || 10
    const itemSpacing = legend.itemSpacing || 5

    // Create legend items from data and colors
    const items: LegendItem[] = this.options.data.map((item, index) => ({
      label: item.label,
      color: this.getBarColor(index)
    }))

    // Calculate legend dimensions
    const itemHeight = fontSize + itemSpacing
    const legendHeight = items.length * itemHeight
    const legendWidth = C.LEGEND_WIDTH

    // Determine legend position
    let legendX: number
    let legendY: number

    switch (position) {
      case 'top-right':
        legendX = chartX + chartWidth - legendWidth - C.LEGEND_PADDING
        legendY = chartY + chartHeight + C.LEGEND_CHART_SPACING
        break
      case 'top-left':
        legendX = chartX + C.LEGEND_PADDING
        legendY = chartY + chartHeight + C.LEGEND_CHART_SPACING
        break
      case 'bottom-right':
        legendX = chartX + chartWidth - legendWidth - C.LEGEND_PADDING
        legendY = chartY - legendHeight - C.LEGEND_PADDING
        break
      case 'bottom-left':
        legendX = chartX + C.LEGEND_PADDING
        legendY = chartY - legendHeight - C.LEGEND_PADDING
        break
      case 'right':
        legendX = chartX + chartWidth + C.LEGEND_CHART_SPACING
        legendY = chartY + chartHeight / 2
        break
      case 'left':
        legendX = chartX - legendWidth - C.LEGEND_CHART_SPACING
        legendY = chartY + chartHeight / 2
        break
      default:
        legendX = chartX + chartWidth - legendWidth - C.LEGEND_PADDING
        legendY = chartY + chartHeight + C.LEGEND_CHART_SPACING
    }

    // Draw legend items
    items.forEach((item, index) => {
      const itemY = legendY + index * itemHeight

      // Draw color box
      const boxSize = fontSize - C.LEGEND_BOX_SIZE_REDUCTION
      const color = parseColor(item.color)
      this.writer.setFillColor(color[0], color[1], color[2])
      this.writer.rect(legendX, itemY, boxSize, boxSize)
      this.writer.fill()

      // Draw label
      this.writer.text(item.label, legendX + boxSize + C.SMALL_OFFSET, itemY, fontSize)
    })
  }

  /**
   * Draw border around the entire chart
   */
  private drawBorder(): void {
    const border = this.options.border!
    const padding = border.padding!
    const { x, y, width, height } = this.options

    // Calculate bounding box
    let minX = x - padding
    let minY = y - padding
    let maxX = x + width + padding
    let maxY = y + height + padding

    // Extend for title if shown
    if (this.options.title) {
      maxY = maxY + C.TITLE_BORDER_EXTENSION
    }

    // Extend for legend if shown
    if (this.options.legend?.show) {
      const legend = this.options.legend
      switch (legend.position) {
        case 'top-right':
        case 'top-left':
          maxY = Math.max(maxY, y + height + C.LEGEND_BORDER_EXTENSION)
          break
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

    // Draw border (always rectangular)
    this.writer.rect(minX, minY, boxWidth, boxHeight)
    this.writer.stroke()
  }
}
