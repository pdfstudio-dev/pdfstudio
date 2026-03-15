import { PDFWriter } from '../core/PDFWriter';
import { MultiLineChartOptions, LegendItem } from '../types';
import { parseColor } from '../utils/colors';
import { validateNonEmptyArray, validateRectangle } from '../utils/validation';
import { ChartDataError } from '../errors';
import * as C from './ChartConstants';
import { BaseChart } from './BaseChart';

/**
 * MultiLineChart - Renders multiple line series on the same chart
 */
export class MultiLineChart extends BaseChart {
  private options: MultiLineChartOptions;

  // Default colors for multiple series
  private static readonly DEFAULT_COLORS = [
    '#3498db', // Blue
    '#e74c3c', // Red
    '#2ecc71', // Green
    '#f39c12', // Orange
    '#9b59b6', // Purple
    '#1abc9c', // Turquoise
    '#34495e', // Dark gray
    '#e67e22', // Dark orange
  ];

  constructor(writer: PDFWriter, options: MultiLineChartOptions) {
    super(writer);

    // Validate inputs
    validateNonEmptyArray(options.data, 'data');
    validateRectangle(options.x, options.y, options.width, options.height);

    // Validate each data point
    options.data.forEach((dataPoint, dataIndex) => {
      if (!dataPoint.values || dataPoint.values.length === 0) {
        throw new ChartDataError(
          `Data point at index ${dataIndex} must have values`,
          'MultiLineChart',
          'empty values array'
        );
      }
      dataPoint.values.forEach((value, valueIndex) => {
        if (!Number.isFinite(value)) {
          throw new ChartDataError(
            `Value at data point ${dataIndex}, index ${valueIndex} must be finite, got: ${value}`,
            'MultiLineChart',
            'invalid value'
          );
        }
      });
    });

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
        dashPattern: [],
      },
      legend: {
        show: true,
        position: 'top-right',
        fontSize: C.PIE_LEGEND_FONT_SIZE,
        itemSpacing: C.PIE_LEGEND_ITEM_SPACING,
      },
      border: {
        show: false,
        color: '#000000',
        width: C.LINE_BORDER_WIDTH_DEFAULT,
        padding: C.LINE_BORDER_PADDING_DEFAULT,
      },
      ...options,
    };
  }

  /**
   * Render the multi-line chart
   */
  render(): void {
    const { data, x, y, width, height, title } = this.options;

    // Reserve space for Y-axis labels (40 points)
    const yAxisLabelSpace = C.Y_AXIS_LABEL_SPACE;
    const chartX = x + yAxisLabelSpace;
    let chartWidth = width - yAxisLabelSpace;

    // Reserve space for legend if on right
    const legendSpace =
      this.options.legend?.show && this.options.legend.position === 'right'
        ? C.MULTI_LINE_LEGEND_WIDTH
        : 0;
    chartWidth -= legendSpace;

    // Reserve space for X-axis labels (20 points)
    const xAxisLabelSpace = C.LINE_X_AXIS_LABEL_SPACE;
    const chartY = y;
    const chartHeight = height - xAxisLabelSpace;

    // Draw title if provided
    if (title) {
      this.drawTitle(chartX, y + height, chartWidth, title);
    }

    // Get all series data
    const seriesData = this.extractSeriesData(data);

    // Find global max and min values for scaling
    const allValues = seriesData.flatMap((series) => series.values);
    const maxValue = Math.max(...allValues);
    const minValue = Math.min(0, ...allValues);
    const roundedMax = this.roundToNice(maxValue);
    const roundedMin = minValue < 0 ? -this.roundToNice(Math.abs(minValue)) : 0;

    // Draw grid if enabled
    if (this.options.showGrid) {
      this.drawGrid(chartX, chartY, chartWidth, chartHeight, data.length, this.options.gridStyle!);
    }

    // Draw axes
    if (this.options.showAxes) {
      this.drawYAxisScale(chartX, chartY, chartHeight, roundedMax, roundedMin);
      this.drawAxes(chartX, chartY, chartWidth, chartHeight, undefined, C.GRID_LINE_WIDTH, true);
    }

    // Draw each series
    seriesData.forEach((series, seriesIndex) => {
      const color = this.options.colors![seriesIndex % this.options.colors!.length];

      // Calculate points for this series
      const points = this.calculatePoints(
        series.values.map((v) => ({ value: v })),
        chartX,
        chartY,
        chartWidth,
        chartHeight,
        roundedMax,
        roundedMin
      );

      // Draw line
      this.drawLine(points, color);

      // Draw points
      if (this.options.showPoints) {
        this.drawPoints(points, this.options.pointSize!, color);
      }
    });

    // Draw X-axis labels
    if (this.options.showLabels) {
      this.drawXAxisLabels(data, chartX, chartY, chartWidth, chartHeight);
    }

    // Draw border BEFORE legend
    if (this.options.border?.show) {
      this.drawBorder(x, y, width, height);
    }

    // Draw legend
    if (this.options.legend?.show) {
      const legendItems: LegendItem[] = seriesData.map((series, index) => ({
        label: series.name,
        color: this.options.colors![index % this.options.colors!.length],
      }));
      this.drawLegend(legendItems, chartX, chartY, chartWidth, chartHeight);
    }
  }

  /**
   * Extract series data from the data structure
   */
  private extractSeriesData(
    data: { label: string; values: number[]; series: string[] }[]
  ): { name: string; values: number[] }[] {
    if (data.length === 0) return [];

    const seriesCount = data[0].series.length;
    const result: { name: string; values: number[] }[] = [];

    for (let i = 0; i < seriesCount; i++) {
      result.push({
        name: data[0].series[i],
        values: data.map((d) => d.values[i]),
      });
    }

    return result;
  }

  // calculatePoints is inherited from BaseChart

  /**
   * Draw line for a series
   */
  private drawLine(points: { x: number; y: number }[], color: string): void {
    if (points.length < 2) return;

    const [r, g, b] = parseColor(color);
    this.writer.setStrokeColor(r, g, b);
    this.writer.setLineWidth(this.options.lineWidth!);

    this.writer.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      this.writer.lineTo(points[i].x, points[i].y);
    }

    this.writer.stroke();
  }

  // drawPoints is inherited from BaseChart

  // drawXAxisLabels is inherited from BaseChart

  // drawYAxisScale is inherited from BaseChart

  // drawGrid is inherited from BaseChart

  // drawAxes is inherited from BaseChart (with xAxisAtBottom=true, lineWidth=GRID_LINE_WIDTH)

  /**
   * Draw legend using BaseChart's drawLegendItems
   */
  private drawLegend(
    items: LegendItem[],
    chartX: number,
    chartY: number,
    chartWidth: number,
    chartHeight: number
  ): void {
    this.drawLegendItems(items, chartX, chartY, chartWidth, chartHeight, this.options.legend!);
  }

  /**
   * Draw border around the entire chart
   */
  private drawBorder(x: number, y: number, width: number, height: number): void {
    const extensions: { maxYExtension?: number; maxXExtension?: number } = {};

    // Extend for title if shown
    if (this.options.title) {
      extensions.maxYExtension = C.TITLE_BORDER_EXTENSION;
    }

    // Extend for legend if on right
    if (this.options.legend?.show && this.options.legend.position === 'right') {
      extensions.maxXExtension = C.MULTI_LINE_LEGEND_BORDER_EXTENSION;
    }

    this.drawBorderRect(x, y, width, height, this.options.border!, extensions);
  }
}
