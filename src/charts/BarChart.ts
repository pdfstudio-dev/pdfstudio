import { PDFWriter } from '../core/PDFWriter';
import { BarChartOptions, LegendItem } from '../types';
import { parseColor } from '../utils/colors';
import { validateNonEmptyArray, validateRectangle } from '../utils/validation';
import { ChartDataError } from '../errors';
import * as C from './ChartConstants';
import { BaseChart } from './BaseChart';

/**
 * BarChart - Renders a vertical or horizontal bar chart
 */
export class BarChart extends BaseChart {
  private options: BarChartOptions;

  constructor(writer: PDFWriter, options: BarChartOptions) {
    super(writer);

    // Validate inputs
    validateNonEmptyArray(options.data, 'data');
    validateRectangle(options.x, options.y, options.width, options.height);

    // Validate all data values are finite
    options.data.forEach((item, index) => {
      if (!Number.isFinite(item.value)) {
        throw new ChartDataError(
          `Data value at index ${index} must be a finite number, got: ${item.value}`,
          'BarChart',
          'invalid value'
        );
      }
    });

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
        dashPattern: [],
      },
      shadow: {
        enabled: false,
        color: 'rgba(0,0,0,0.3)',
        blur: 5,
        offsetX: 2,
        offsetY: 2,
      },
      gradient: {
        enabled: false,
        type: 'linear',
        colors: ['#3498db', '#2980b9'],
        angle: 90,
      },
      legend: {
        show: false,
        position: 'top-right',
        fontSize: 10,
        itemSpacing: 5,
      },
      border: {
        show: false,
        color: '#000000',
        width: 1,
        padding: 10,
      },
      ...options,
    };
  }

  /**
   * Render the bar chart
   */
  render(): void {
    if (this.options.orientation === 'horizontal') {
      this.renderHorizontal();
    } else {
      this.renderVertical();
    }

    // Draw border around entire chart
    if (this.options.border?.show) {
      this.drawBorder();
    }
  }

  /**
   * Render vertical bar chart
   */
  private renderVertical(): void {
    const { data, x, y, width, height, title } = this.options;

    // Reserve space for Y-axis labels
    const yAxisLabelSpace = C.Y_AXIS_LABEL_SPACE;
    const chartX = x + yAxisLabelSpace;
    const chartWidth = width - yAxisLabelSpace;

    // Draw title if provided (above the chart)
    if (title) {
      this.drawTitle(chartX, y + height, chartWidth, title);
    }

    // Find max value for scaling
    const maxValue = Math.max(...data.map((d) => d.value));
    const roundedMax = this.roundToNice(maxValue);

    // Draw Y-axis scale and grid (uses inherited drawYAxisScale from BaseChart)
    if (this.options.showAxes) {
      this.drawYAxisScale(
        chartX,
        y,
        height,
        roundedMax,
        undefined,
        this.options.showGrid
          ? {
              showGrid: true,
              gridColor: this.options.gridStyle?.color,
              gridWidth: this.options.gridStyle?.width,
              gridLineEndX: chartX + chartWidth,
            }
          : undefined
      );
      this.drawAxes(chartX, y, chartWidth, height);
    }

    // Calculate bar dimensions with better spacing
    const barCount = data.length;
    const barSpacing = C.VERTICAL_BAR_SPACING;
    const totalSpacing = (barCount - 1) * barSpacing;
    const availableWidth = chartWidth - totalSpacing;
    const barWidth = availableWidth / barCount;

    // Draw bars
    data.forEach((item, index) => {
      const barHeight = (item.value / roundedMax) * height;
      const barX = chartX + index * (barWidth + barSpacing);
      const barY = y;

      // Get color for this bar
      const barColor = this.getBarColor(index);

      this.drawBar(barX, barY, barWidth, barHeight, barColor, index);

      // Draw label (below the chart)
      if (this.options.showLabels) {
        const labelX = barX + barWidth / 2 - item.label.length * C.LABEL_CHAR_WIDTH;
        this.writer.text(item.label, labelX, y - C.VERTICAL_LABEL_BOTTOM_OFFSET, C.LABEL_FONT_SIZE);
      }

      // Draw value (above the bar)
      if (this.options.showValues) {
        const valueStr = item.value.toString();
        const valueX = barX + barWidth / 2 - valueStr.length * C.LABEL_CHAR_WIDTH;
        this.writer.text(
          valueStr,
          valueX,
          barY + barHeight + C.VERTICAL_VALUE_TOP_OFFSET,
          C.LABEL_FONT_SIZE
        );
      }
    });

    // Draw legend if enabled
    if (this.options.legend?.show && this.options.barColors) {
      this.drawLegend(chartX, y, chartWidth, height);
    }
  }

  /**
   * Render horizontal bar chart
   */
  private renderHorizontal(): void {
    const { data, x, y, width, height, title } = this.options;

    // Reserve space for label area and bottom space for X-axis labels
    const labelSpace = C.HORIZONTAL_LABEL_SPACE;
    const bottomSpace = C.HORIZONTAL_BOTTOM_SPACE;
    const chartX = x + labelSpace;
    const chartWidth = width - labelSpace;
    const chartHeight = height - bottomSpace;
    const chartY = y + bottomSpace;

    // Draw title if provided (above the chart)
    if (title) {
      this.drawTitle(chartX, chartY + chartHeight, chartWidth, title);
    }

    // Find max value for scaling
    const maxValue = Math.max(...data.map((d) => d.value));
    const roundedMax = this.roundToNice(maxValue);

    // Draw X-axis scale and grid
    if (this.options.showAxes) {
      this.drawXAxisScale(chartX, chartY, chartWidth, chartHeight, roundedMax);
      this.drawAxes(chartX, chartY, chartWidth, chartHeight, undefined, undefined, true);
    }

    // Calculate bar dimensions
    const barCount = data.length;
    const barSpacing = C.HORIZONTAL_BAR_SPACING;
    const totalSpacing = (barCount - 1) * barSpacing;
    const availableHeight = chartHeight - totalSpacing;
    const barHeight = availableHeight / barCount;

    // Draw bars
    data.forEach((item, index) => {
      const barWidth = (item.value / roundedMax) * chartWidth;
      const barY = chartY + index * (barHeight + barSpacing);
      const barX = chartX;

      // Get color for this bar
      const barColor = this.getBarColor(index);

      this.drawHorizontalBar(barX, barY, barWidth, barHeight, barColor, index);

      // Draw label (to the left)
      if (this.options.showLabels) {
        const labelX = x + C.SMALL_OFFSET;
        const labelY = barY + barHeight / 2 - C.SMALL_OFFSET;
        this.writer.text(item.label, labelX, labelY, C.LABEL_FONT_SIZE);
      }

      // Draw value (at the end of bar)
      if (this.options.showValues) {
        const valueStr = item.value.toString();
        const valueX = barX + barWidth + C.SMALL_OFFSET;
        const valueY = barY + barHeight / 2 - C.SMALL_OFFSET;
        this.writer.text(valueStr, valueX, valueY, C.LABEL_FONT_SIZE);
      }
    });

    // Draw legend if enabled
    if (this.options.legend?.show && this.options.barColors) {
      this.drawLegend(chartX, chartY, chartWidth, chartHeight);
    }
  }

  /**
   * Get color for bar at index
   */
  private getBarColor(index: number): string {
    if (this.options.barColors && this.options.barColors.length > 0) {
      return this.options.barColors[index % this.options.barColors.length];
    }
    return this.options.barColor || '#3498db';
  }

  /**
   * Draw X-axis scale with numbers (for horizontal charts)
   */
  private drawXAxisScale(
    x: number,
    y: number,
    width: number,
    height: number,
    maxValue: number
  ): void {
    const steps = C.AXIS_STEPS;
    const stepValue = maxValue / steps;

    for (let i = 0; i <= steps; i++) {
      const value = Math.round(i * stepValue);
      const xPos = x + (width * i) / steps;

      // Draw scale number (below X-axis)
      const valueStr = value.toString();
      this.writer.text(
        valueStr,
        xPos - valueStr.length * C.SCALE_CHAR_WIDTH,
        y - C.X_AXIS_SCALE_LABEL_OFFSET,
        C.SCALE_FONT_SIZE
      );

      // Draw tick mark
      this.writer.setStrokeColor(0, 0, 0);
      this.writer.setLineWidth(C.GRID_LINE_WIDTH);
      this.writer.moveTo(xPos, y);
      this.writer.lineTo(xPos, y - C.TICK_MARK_LENGTH);
      this.writer.stroke();

      // Draw grid line
      if (this.options.showGrid && i > 0) {
        const gridColor = parseColor(this.options.gridStyle?.color || '#e0e0e0');
        this.writer.setStrokeColor(gridColor[0], gridColor[1], gridColor[2]);
        this.writer.setLineWidth(this.options.gridStyle?.width || 0.5);

        this.writer.moveTo(xPos, y);
        this.writer.lineTo(xPos, y + height);
        this.writer.stroke();
      }
    }
  }

  // drawYAxisScale is inherited from BaseChart

  /**
   * Draw a single horizontal bar with all effects
   */
  private drawHorizontalBar(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    index: number
  ): void {
    // Draw shadow if enabled
    if (this.options.shadow?.enabled) {
      const shadowOffsetX = this.options.shadow.offsetX || C.SHADOW_OFFSET_X;
      const shadowOffsetY = this.options.shadow.offsetY || -C.SHADOW_OFFSET_Y;

      // Simple shadow (gray rectangle offset)
      this.writer.setFillColor(C.SHADOW_COLOR_GRAY, C.SHADOW_COLOR_GRAY, C.SHADOW_COLOR_GRAY);
      this.writer.rect(x + shadowOffsetX, y + shadowOffsetY, width, height);
      this.writer.fill();
    }

    // Draw the main bar
    if (
      this.options.gradient?.enabled &&
      this.options.gradient.colors &&
      this.options.gradient.colors.length >= 2
    ) {
      // For horizontal gradient, we change along the width
      const steps = C.GRADIENT_STEPS;
      const color1 = parseColor(this.options.gradient.colors[0]);
      const color2 = parseColor(this.options.gradient.colors[1]);

      for (let i = 0; i < steps; i++) {
        const ratio = i / steps;
        const r = color1[0] + (color2[0] - color1[0]) * ratio;
        const g = color1[1] + (color2[1] - color1[1]) * ratio;
        const b = color1[2] + (color2[2] - color1[2]) * ratio;

        const segmentWidth = width / steps;
        const segmentX = x + i * segmentWidth;

        this.writer.setFillColor(r, g, b);
        this.writer.rect(segmentX, y, segmentWidth, height);
        this.writer.fill();
      }
    } else {
      // Solid color
      const barColor = parseColor(color);
      this.writer.setFillColor(barColor[0], barColor[1], barColor[2]);
      this.writer.rect(x, y, width, height);
      this.writer.fill();
    }
  }

  /**
   * Draw a single bar with all effects (vertical)
   */
  private drawBar(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    index: number
  ): void {
    // Draw shadow if enabled
    if (this.options.shadow?.enabled) {
      const shadowOffsetX = this.options.shadow.offsetX || C.SHADOW_OFFSET_X;
      const shadowOffsetY = this.options.shadow.offsetY || C.SHADOW_OFFSET_Y;

      // Simple shadow (gray rectangle offset)
      this.writer.setFillColor(C.SHADOW_COLOR_GRAY, C.SHADOW_COLOR_GRAY, C.SHADOW_COLOR_GRAY);
      this.writer.rect(x + shadowOffsetX, y - shadowOffsetY, width, height);
      this.writer.fill();
    }

    // Draw the main bar
    if (
      this.options.gradient?.enabled &&
      this.options.gradient.colors &&
      this.options.gradient.colors.length >= 2
    ) {
      // For gradient, we'll draw multiple rectangles with gradually changing colors
      const steps = C.GRADIENT_STEPS;
      const color1 = parseColor(this.options.gradient.colors[0]);
      const color2 = parseColor(this.options.gradient.colors[1]);

      for (let i = 0; i < steps; i++) {
        const ratio = i / steps;
        const r = color1[0] + (color2[0] - color1[0]) * ratio;
        const g = color1[1] + (color2[1] - color1[1]) * ratio;
        const b = color1[2] + (color2[2] - color1[2]) * ratio;

        const segmentHeight = height / steps;
        const segmentY = y + i * segmentHeight;

        this.writer.setFillColor(r, g, b);
        this.writer.rect(x, segmentY, width, segmentHeight);
        this.writer.fill();
      }
    } else {
      // Solid color
      const barColor = parseColor(color);
      this.writer.setFillColor(barColor[0], barColor[1], barColor[2]);
      this.writer.rect(x, y, width, height);
      this.writer.fill();
    }
  }

  // drawHorizontalAxes replaced by drawAxes(x, y, width, height, undefined, undefined, true)

  /**
   * Draw legend
   */
  private drawLegend(
    chartX: number,
    chartY: number,
    chartWidth: number,
    chartHeight: number
  ): void {
    // Create legend items from data and colors
    const items: LegendItem[] = this.options.data.map((item, index) => ({
      label: item.label,
      color: this.getBarColor(index),
    }));

    this.drawLegendItems(items, chartX, chartY, chartWidth, chartHeight, this.options.legend!);
  }

  /**
   * Draw border around the entire chart
   */
  private drawBorder(): void {
    const { x, y, width, height } = this.options;
    const extensions: { maxYExtension?: number } = {};

    // Extend for title if shown
    if (this.options.title) {
      extensions.maxYExtension = C.TITLE_BORDER_EXTENSION;
    }

    // Extend for legend if shown
    if (this.options.legend?.show) {
      const legend = this.options.legend;
      if (legend.position === 'top-right' || legend.position === 'top-left') {
        extensions.maxYExtension = Math.max(
          extensions.maxYExtension || 0,
          C.LEGEND_BORDER_EXTENSION
        );
      }
    }

    this.drawBorderRect(x, y, width, height, this.options.border!, extensions);
  }
}
