import { PDFWriter } from '../core/PDFWriter';
import { LineChartOptions } from '../types';
import { parseColor } from '../utils/colors';
import { validateNonEmptyArray, validateRectangle } from '../utils/validation';
import { ChartDataError } from '../errors';
import * as C from './ChartConstants';
import { BaseChart } from './BaseChart';

/**
 * LineChart - Renders a line chart with optional points and area fill
 */
export class LineChart extends BaseChart {
  private options: LineChartOptions;

  constructor(writer: PDFWriter, options: LineChartOptions) {
    super(writer);

    // Validate inputs
    validateNonEmptyArray(options.data, 'data');
    validateRectangle(options.x, options.y, options.width, options.height);

    // Validate data values
    options.data.forEach((item, index) => {
      if (!Number.isFinite(item.value)) {
        throw new ChartDataError(
          `Data value at index ${index} must be finite, got: ${item.value}`,
          'LineChart',
          'invalid value'
        );
      }
    });

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
        dashPattern: [],
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
   * Render the line chart
   */
  render(): void {
    const { data, x, y, width, height, title } = this.options;

    // Reserve space for Y-axis labels (40 points)
    const yAxisLabelSpace = C.Y_AXIS_LABEL_SPACE;
    const chartX = x + yAxisLabelSpace;
    const chartWidth = width - yAxisLabelSpace;

    // Reserve space for X-axis labels (20 points)
    const xAxisLabelSpace = C.LINE_X_AXIS_LABEL_SPACE;
    const chartY = y;
    const chartHeight = height - xAxisLabelSpace;

    // Draw title if provided
    if (title) {
      this.drawTitle(chartX, y + height, chartWidth, title);
    }

    // Find max and min values for scaling
    const values = data.map((d) => d.value);
    const maxValue = Math.max(...values);
    const minValue = Math.min(0, ...values); // Include 0 or go negative
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

    // Calculate point positions
    const points = this.calculatePoints(
      data,
      chartX,
      chartY,
      chartWidth,
      chartHeight,
      roundedMax,
      roundedMin
    );

    // Fill area under curve if enabled
    if (this.options.fillArea) {
      this.drawFilledArea(points, chartY, chartHeight);
    }

    // Draw the line
    this.drawLine(points);

    // Draw points if enabled
    if (this.options.showPoints) {
      this.drawPoints(points, this.options.pointSize!, this.options.pointColor!);
    }

    // Draw X-axis labels
    if (this.options.showLabels) {
      this.drawXAxisLabels(data, chartX, chartY, chartWidth, chartHeight);
    }

    // Draw values on points if enabled
    if (this.options.showValues) {
      this.drawValues(data, points);
    }

    // Draw border around entire chart
    if (this.options.border?.show) {
      this.drawBorder(x, y, width, height);
    }
  }

  // calculatePoints is inherited from BaseChart

  /**
   * Draw the line connecting all points
   */
  private drawLine(points: { x: number; y: number }[]): void {
    if (points.length < 2) return;

    const [r, g, b] = parseColor(this.options.lineColor!);
    this.writer.setStrokeColor(r, g, b);
    this.writer.setLineWidth(this.options.lineWidth!);

    // Start at first point
    this.writer.moveTo(points[0].x, points[0].y);

    if (this.options.smooth && points.length > 2) {
      // Draw smooth curves using quadratic bezier curves
      for (let i = 0; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];

        // Control point is midpoint
        const cpX = (current.x + next.x) / 2;
        const cpY = (current.y + next.y) / 2;

        // For PDF, we'll approximate with line segments for now
        // (True bezier curves require more complex PDF operators)
        const segments = C.LINE_SMOOTH_CURVE_SEGMENTS;
        for (let s = 0; s <= segments; s++) {
          const t = s / segments;
          const x = current.x + t * (next.x - current.x);
          const y = current.y + t * (next.y - current.y);
          this.writer.lineTo(x, y);
        }
      }
    } else {
      // Draw straight lines
      for (let i = 1; i < points.length; i++) {
        this.writer.lineTo(points[i].x, points[i].y);
      }
    }

    this.writer.stroke();
  }

  /**
   * Draw filled area under the curve
   */
  private drawFilledArea(
    points: { x: number; y: number }[],
    chartY: number,
    chartHeight: number
  ): void {
    if (points.length < 2) return;

    const baseY = chartY + chartHeight;
    const [r, g, b] = parseColor(this.options.fillColor!);
    this.writer.setFillColor(
      r * this.options.fillOpacity!,
      g * this.options.fillOpacity!,
      b * this.options.fillOpacity!
    );

    // Start at bottom-left
    this.writer.moveTo(points[0].x, baseY);

    // Go up to first point
    this.writer.lineTo(points[0].x, points[0].y);

    // Draw along the line
    for (let i = 1; i < points.length; i++) {
      this.writer.lineTo(points[i].x, points[i].y);
    }

    // Go down to baseline
    this.writer.lineTo(points[points.length - 1].x, baseY);

    // Close path
    this.writer.lineTo(points[0].x, baseY);

    this.writer.fill();
  }

  // drawPoints is inherited from BaseChart

  // drawXAxisLabels is inherited from BaseChart

  /**
   * Draw values above/below points
   */
  private drawValues(
    data: { label: string; value: number }[],
    points: { x: number; y: number }[]
  ): void {
    data.forEach((item, index) => {
      const point = points[index];
      const valueText = item.value.toString();
      const valueX = point.x - valueText.length * C.SCALE_CHAR_WIDTH;
      const valueY = point.y - C.LINE_VALUE_VERTICAL_OFFSET;

      this.writer.text(valueText, valueX, valueY, C.SCALE_FONT_SIZE);
    });
  }

  // drawYAxisScale is inherited from BaseChart

  // drawGrid is inherited from BaseChart

  // drawAxes is inherited from BaseChart (with xAxisAtBottom=true, lineWidth=GRID_LINE_WIDTH)

  /**
   * Draw border around the entire chart
   */
  private drawBorder(x: number, y: number, width: number, height: number): void {
    this.drawBorderRect(x, y, width, height, this.options.border!);
  }
}
