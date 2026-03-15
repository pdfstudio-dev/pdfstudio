import { PDFWriter } from '../core/PDFWriter';
import { GroupedBarChartOptions, LegendItem } from '../types';
import { parseColor } from '../utils/colors';
import { validateNonEmptyArray, validateRectangle } from '../utils/validation';
import { ChartDataError } from '../errors';
import * as C from './ChartConstants';
import { BaseChart } from './BaseChart';

/**
 * GroupedBarChart - Renders grouped bar charts
 */
export class GroupedBarChart extends BaseChart {
  private options: GroupedBarChartOptions;

  constructor(writer: PDFWriter, options: GroupedBarChartOptions) {
    super(writer);

    // Validate inputs
    validateNonEmptyArray(options.data, 'data');
    validateRectangle(options.x, options.y, options.width, options.height);

    // Validate all data groups and values
    options.data.forEach((group, groupIndex) => {
      if (!group.values || group.values.length === 0) {
        throw new ChartDataError(
          `Data group at index ${groupIndex} must have values`,
          'GroupedBarChart',
          'empty values array'
        );
      }
      group.values.forEach((value, valueIndex) => {
        if (!Number.isFinite(value)) {
          throw new ChartDataError(
            `Data value at group ${groupIndex}, index ${valueIndex} must be finite, got: ${value}`,
            'GroupedBarChart',
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
   * Render the grouped bar chart
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

    // Find max value
    const maxValue = Math.max(...data.flatMap((d) => d.values));
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
    const groupCount = data.length;
    const seriesCount = data[0]?.values.length || 0;
    const groupSpacing = C.GROUPED_BAR_GROUP_SPACING;
    const barSpacing = C.GROUPED_BAR_SPACING;
    const totalGroupSpacing = (groupCount - 1) * groupSpacing;
    const availableWidth = chartWidth - totalGroupSpacing;
    const groupWidth = availableWidth / groupCount;
    const barWidth = (groupWidth - (seriesCount - 1) * barSpacing) / seriesCount;

    // Draw bars
    data.forEach((group, groupIndex) => {
      const groupX = chartX + groupIndex * (groupWidth + groupSpacing);

      group.values.forEach((value, seriesIndex) => {
        const barHeight = (value / roundedMax) * height;
        const barX = groupX + seriesIndex * (barWidth + barSpacing);
        const barY = y;

        const color = this.options.colors![seriesIndex % this.options.colors!.length];
        const barColor = parseColor(color);

        this.writer.setFillColor(barColor[0], barColor[1], barColor[2]);
        this.writer.rect(barX, barY, barWidth, barHeight);
        this.writer.fill();

        // Draw value if enabled
        if (this.options.showValues) {
          const valueStr = value.toString();
          const valueX = barX + barWidth / 2 - valueStr.length * 2.5;
          this.writer.text(valueStr, valueX, barY + barHeight + 8, 9);
        }
      });

      // Draw group label
      if (this.options.showLabels) {
        const labelX = groupX + groupWidth / 2 - group.label.length * 3;
        this.writer.text(group.label, labelX, y - 25, 11);
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
