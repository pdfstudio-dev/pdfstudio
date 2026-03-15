import { PDFWriter } from '../core/PDFWriter';
import { StackedBarChartOptions, LegendItem } from '../types';
import { parseColor } from '../utils/colors';
import { validateNonEmptyArray, validateRectangle } from '../utils/validation';
import { ChartDataError } from '../errors';
import * as C from './ChartConstants';
import { BaseChart } from './BaseChart';

/**
 * StackedBarChart - Renders stacked bar charts
 */
export class StackedBarChart extends BaseChart {
  private options: StackedBarChartOptions;

  constructor(writer: PDFWriter, options: StackedBarChartOptions) {
    super(writer);

    // Validate inputs
    validateNonEmptyArray(options.data, 'data');
    validateRectangle(options.x, options.y, options.width, options.height);

    // Validate stacked data
    options.data.forEach((stack, stackIndex) => {
      if (!stack.values || stack.values.length === 0) {
        throw new ChartDataError(
          `Data stack at index ${stackIndex} must have values`,
          'StackedBarChart',
          'empty values array'
        );
      }
      stack.values.forEach((value, valueIndex) => {
        if (!Number.isFinite(value)) {
          throw new ChartDataError(
            `Data value at stack ${stackIndex}, index ${valueIndex} must be finite, got: ${value}`,
            'StackedBarChart',
            'invalid value'
          );
        }
      });
    });

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
        padding: 10,
      },
      ...options,
    };
  }

  /**
   * Render the stacked bar chart
   */
  render(): void {
    const { data, x, y, width, height, title } = this.options;

    const yAxisLabelSpace = C.Y_AXIS_LABEL_SPACE;
    const chartX = x + yAxisLabelSpace;
    const chartWidth = width - yAxisLabelSpace;

    // Draw title
    if (title) {
      this.drawTitle(chartX, y + height, chartWidth, title);
    }

    // Find max value (sum of stacks)
    const maxValue = Math.max(...data.map((d) => d.values.reduce((sum, val) => sum + val, 0)));
    const roundedMax = this.roundToNice(maxValue);

    // Draw axes
    if (this.options.showAxes) {
      this.drawYAxisScale(
        chartX,
        y,
        height,
        roundedMax,
        undefined,
        this.options.showGrid ? { showGrid: true, gridLineEndX: chartX + chartWidth } : undefined
      );
      this.drawAxes(chartX, y, chartWidth, height);
    }

    // Calculate dimensions
    const barCount = data.length;
    const barSpacing = C.STACKED_BAR_SPACING;
    const totalSpacing = (barCount - 1) * barSpacing;
    const availableWidth = chartWidth - totalSpacing;
    const barWidth = availableWidth / barCount;

    // Draw stacked bars
    data.forEach((item, barIndex) => {
      const barX = chartX + barIndex * (barWidth + barSpacing);
      let currentY = y;

      // Draw each segment of the stack (from bottom to top)
      item.values.forEach((value, segmentIndex) => {
        const segmentHeight = (value / roundedMax) * height;
        const color = this.options.colors![segmentIndex % this.options.colors!.length];
        const segmentColor = parseColor(color);

        this.writer.setFillColor(segmentColor[0], segmentColor[1], segmentColor[2]);
        this.writer.rect(barX, currentY, barWidth, segmentHeight);
        this.writer.fill();

        // Draw value if enabled
        if (this.options.showValues && segmentHeight > 15) {
          const valueStr = value.toString();
          const valueX = barX + barWidth / 2 - valueStr.length * 2.5;
          const valueY = currentY + segmentHeight / 2 - 4;
          this.writer.text(valueStr, valueX, valueY, 9);
        }

        currentY += segmentHeight;
      });

      // Draw label
      if (this.options.showLabels) {
        const labelX = barX + barWidth / 2 - item.label.length * 3;
        this.writer.text(item.label, labelX, y - 25, 11);
      }
    });

    // Draw border BEFORE legend
    if (this.options.border?.show) {
      this.drawBorder(x, y, width, height);
    }

    // Draw legend
    if (this.options.legend?.show && data[0]) {
      this.drawLegend(chartX, y, chartWidth, height, data[0].series);
    }
  }

  // drawYAxisScale is inherited from BaseChart

  private drawLegend(
    chartX: number,
    chartY: number,
    chartWidth: number,
    chartHeight: number,
    series: string[]
  ): void {
    const items: LegendItem[] = series.map((label, index) => ({
      label,
      color: this.options.colors![index % this.options.colors!.length],
    }));

    const legendOptions = this.options.legend || {
      show: true,
      position: 'top-right' as const,
      fontSize: 10,
      itemSpacing: 5,
    };
    this.drawLegendItems(items, chartX, chartY, chartWidth, chartHeight, legendOptions);
  }

  /**
   * Draw border around the entire chart
   */
  private drawBorder(x: number, y: number, width: number, height: number): void {
    const extensions: { minYOffset?: number; maxYExtension?: number } = {
      minYOffset: 30, // Extra space for labels below
    };

    // Extend for title if shown
    if (this.options.title) {
      extensions.maxYExtension = C.TITLE_BORDER_EXTENSION;
    }

    // Extend for legend if shown
    if (this.options.legend?.show) {
      extensions.maxYExtension = Math.max(extensions.maxYExtension || 0, C.LEGEND_BORDER_EXTENSION);
    }

    this.drawBorderRect(x, y, width, height, this.options.border!, extensions);
  }
}
