import { PDFWriter } from '../core/PDFWriter';
import { parseColor } from '../utils/colors';
import { LegendItem, BorderOptions, LegendOptions, GridStyle } from '../types';
import * as C from './ChartConstants';

/**
 * BaseChart - Abstract base class for all chart types
 * Contains shared utility methods to avoid duplication across chart implementations
 */
export abstract class BaseChart {
  protected writer: PDFWriter;

  constructor(writer: PDFWriter) {
    this.writer = writer;
  }

  /**
   * Render the chart - must be implemented by subclasses
   */
  abstract render(): void;

  /**
   * Round a number to a "nice" value for axis scaling
   * Used by bar charts, line charts, and stacked/grouped variants
   */
  protected roundToNice(value: number): number {
    const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
    const normalized = value / magnitude;

    let nice: number;
    if (normalized <= 1) nice = 1;
    else if (normalized <= 2) nice = 2;
    else if (normalized <= 5) nice = 5;
    else nice = 10;

    return nice * magnitude;
  }

  /**
   * Draw a chart title centered above the chart area
   */
  protected drawTitle(
    x: number,
    y: number,
    width: number,
    title: string,
    fontSize: number = C.TITLE_FONT_SIZE
  ): void {
    const titleX = x + width / 2 - title.length * C.TITLE_CHAR_WIDTH;
    this.writer.text(title, titleX, y + C.TITLE_VERTICAL_OFFSET, fontSize);
  }

  /**
   * Draw legend items with position switching
   * Takes the most complete implementation supporting all 6 positions
   */
  protected drawLegendItems(
    items: LegendItem[],
    chartX: number,
    chartY: number,
    chartWidth: number,
    chartHeight: number,
    legendOptions: LegendOptions
  ): void {
    const position = legendOptions.position || 'top-right';
    const fontSize = legendOptions.fontSize || 10;
    const itemSpacing = legendOptions.itemSpacing || 5;

    // Calculate legend dimensions
    const itemHeight = fontSize + itemSpacing;
    const legendHeight = items.length * itemHeight;
    const legendWidth = C.LEGEND_WIDTH;

    // Determine legend position
    let legendX: number;
    let legendY: number;

    switch (position) {
      case 'top-right':
        legendX = chartX + chartWidth - legendWidth - C.LEGEND_PADDING;
        legendY = chartY + chartHeight + C.LEGEND_CHART_SPACING;
        break;
      case 'top-left':
        legendX = chartX + C.LEGEND_PADDING;
        legendY = chartY + chartHeight + C.LEGEND_CHART_SPACING;
        break;
      case 'bottom-right':
        legendX = chartX + chartWidth - legendWidth - C.LEGEND_PADDING;
        legendY = chartY - legendHeight - C.LEGEND_PADDING;
        break;
      case 'bottom-left':
        legendX = chartX + C.LEGEND_PADDING;
        legendY = chartY - legendHeight - C.LEGEND_PADDING;
        break;
      case 'right':
        legendX = chartX + chartWidth + C.LEGEND_CHART_SPACING;
        legendY = chartY + chartHeight / 2;
        break;
      case 'left':
        legendX = chartX - legendWidth - C.LEGEND_CHART_SPACING;
        legendY = chartY + chartHeight / 2;
        break;
      default:
        legendX = chartX + chartWidth - legendWidth - C.LEGEND_PADDING;
        legendY = chartY + chartHeight + C.LEGEND_CHART_SPACING;
    }

    // Draw legend items
    items.forEach((item, index) => {
      const itemY = legendY + index * itemHeight;

      // Draw color box
      const boxSize = fontSize - C.LEGEND_BOX_SIZE_REDUCTION;
      const color = parseColor(item.color);
      this.writer.setFillColor(color[0], color[1], color[2]);
      this.writer.rect(legendX, itemY, boxSize, boxSize);
      this.writer.fill();

      // Draw label
      this.writer.text(item.label, legendX + boxSize + C.SMALL_OFFSET, itemY, fontSize);
    });
  }

  /**
   * Draw standard vertical chart axes (Y-axis vertical, X-axis at bottom)
   * Used by BarChart. Other charts override with their own axis styles.
   */
  protected drawAxes(
    x: number,
    y: number,
    width: number,
    height: number,
    axisColor?: string,
    axisLineWidth?: number,
    xAxisAtBottom?: boolean
  ): void {
    if (axisColor) {
      const [r, g, b] = parseColor(axisColor);
      this.writer.setStrokeColor(r, g, b);
    } else {
      this.writer.setStrokeColor(0, 0, 0);
    }
    this.writer.setLineWidth(axisLineWidth ?? C.AXES_LINE_WIDTH);

    // Y-axis (vertical)
    this.writer.moveTo(x, y);
    this.writer.lineTo(x, y + height);
    this.writer.stroke();

    // X-axis (horizontal) - at y or y+height depending on xAxisAtBottom
    const xAxisY = xAxisAtBottom ? y + height : y;
    this.writer.moveTo(x, xAxisY);
    this.writer.lineTo(x + width, xAxisY);
    this.writer.stroke();
  }

  /**
   * Draw Y-axis scale labels with tick marks and optional grid lines
   * When minValue is provided, uses line-chart style (i=0 at bottom, i=max at top)
   * When minValue is omitted, uses bar-chart style (i=0 at y, values ascending upward)
   */
  protected drawYAxisScale(
    x: number,
    y: number,
    height: number,
    maxValue: number,
    minValue?: number,
    options?: { showGrid?: boolean; gridWidth?: number; gridColor?: string; gridLineEndX?: number }
  ): void {
    const steps = C.AXIS_STEPS;
    const hasMinValue = minValue !== undefined;
    const effectiveMin = hasMinValue ? minValue : 0;
    const valueRange = maxValue - effectiveMin;
    const stepValue = valueRange / steps;

    for (let i = 0; i <= steps; i++) {
      const value = effectiveMin + i * stepValue;

      // Bar charts: position from y upward; Line charts: position from y+height downward
      const yPos = hasMinValue ? y + height - (i / steps) * height : y + (height * i) / steps;

      // Draw scale number
      const labelText = hasMinValue ? value.toFixed(0) : Math.round(value).toString();
      this.writer.text(
        labelText,
        x - C.Y_AXIS_SCALE_LABEL_OFFSET,
        yPos - C.SCALE_LABEL_VERTICAL_ADJUST,
        C.SCALE_FONT_SIZE
      );

      // Draw tick mark
      this.writer.setStrokeColor(0, 0, 0);
      this.writer.setLineWidth(C.GRID_LINE_WIDTH);
      this.writer.moveTo(x - C.TICK_MARK_LENGTH, yPos);
      this.writer.lineTo(x, yPos);
      this.writer.stroke();

      // Draw grid line if enabled
      if (options?.showGrid && i > 0) {
        const gridColor = parseColor(options.gridColor || '#e0e0e0');
        this.writer.setStrokeColor(gridColor[0], gridColor[1], gridColor[2]);
        this.writer.setLineWidth(options.gridWidth || 0.5);

        this.writer.moveTo(x, yPos);
        this.writer.lineTo(options.gridLineEndX ?? x + 200, yPos);
        this.writer.stroke();
      }
    }
  }

  /**
   * Draw grid lines (horizontal for Y values, vertical for X values)
   * Used by line charts and multi-line charts
   */
  protected drawGrid(
    x: number,
    y: number,
    width: number,
    height: number,
    dataPoints: number,
    gridStyle: GridStyle
  ): void {
    const [r, g, b] = parseColor(gridStyle.color!);
    this.writer.setStrokeColor(r, g, b);
    this.writer.setLineWidth(gridStyle.width!);

    // Horizontal grid lines (for Y values)
    const steps = C.AXIS_STEPS;
    for (let i = 0; i <= steps; i++) {
      const gridY = y + (i / steps) * height;
      this.writer.moveTo(x, gridY);
      this.writer.lineTo(x + width, gridY);
      this.writer.stroke();
    }

    // Vertical grid lines (for X values)
    const spacing = width / (dataPoints - 1);
    for (let i = 0; i < dataPoints; i++) {
      const gridX = x + i * spacing;
      this.writer.moveTo(gridX, y);
      this.writer.lineTo(gridX, y + height);
      this.writer.stroke();
    }
  }

  /**
   * Draw X-axis labels for line-style charts
   */
  protected drawXAxisLabels(
    data: { label: string }[],
    chartX: number,
    chartY: number,
    chartWidth: number,
    chartHeight: number,
    fontSize: number = C.LINE_LABEL_FONT_SIZE
  ): void {
    const spacing = chartWidth / (data.length - 1);

    data.forEach((item, index) => {
      const labelX = chartX + index * spacing - item.label.length * C.SCALE_CHAR_WIDTH;
      const labelY = chartY + chartHeight + C.X_AXIS_SCALE_LABEL_OFFSET;

      this.writer.text(item.label, labelX, labelY, fontSize);
    });
  }

  /**
   * Calculate point positions for line-style charts
   */
  protected calculatePoints(
    data: { value: number }[],
    chartX: number,
    chartY: number,
    chartWidth: number,
    chartHeight: number,
    maxValue: number,
    minValue: number
  ): { x: number; y: number }[] {
    const points: { x: number; y: number }[] = [];
    const valueRange = maxValue - minValue;
    const spacing = chartWidth / (data.length - 1);

    data.forEach((item, index) => {
      const pointX = chartX + index * spacing;
      const normalizedValue = (item.value - minValue) / valueRange;
      const pointY = chartY + chartHeight - normalizedValue * chartHeight;

      points.push({ x: pointX, y: pointY });
    });

    return points;
  }

  /**
   * Draw points (dots) at each data point position
   */
  protected drawPoints(
    points: { x: number; y: number }[],
    pointSize: number,
    pointColor: string
  ): void {
    const [r, g, b] = parseColor(pointColor);
    this.writer.setFillColor(r, g, b);

    points.forEach((point) => {
      this.writer.rect(point.x - pointSize, point.y - pointSize, pointSize * 2, pointSize * 2);
      this.writer.fill();
    });
  }

  /**
   * Draw a border rectangle around a chart area
   * Shared logic for calculating and drawing the border stroke
   */
  protected drawBorderRect(
    x: number,
    y: number,
    width: number,
    height: number,
    borderOptions: BorderOptions,
    extensions?: { minYOffset?: number; maxYExtension?: number; maxXExtension?: number }
  ): void {
    const padding = borderOptions.padding!;

    // Calculate bounding box
    const minX = x - padding;
    const minY = y - padding - (extensions?.minYOffset || 0);
    const maxX = x + width + padding + (extensions?.maxXExtension || 0);
    let maxY = y + height + padding;

    // Extend for maxY if provided
    if (extensions?.maxYExtension) {
      maxY = Math.max(maxY, y + height + extensions.maxYExtension);
    }

    const boxWidth = maxX - minX;
    const boxHeight = maxY - minY;

    // Validate bounding box
    if (boxWidth <= 0 || boxHeight <= 0) {
      return;
    }

    // Set stroke style
    const [r, g, b] = parseColor(borderOptions.color!);
    this.writer.setStrokeColor(r, g, b);
    this.writer.setLineWidth(borderOptions.width!);

    // Draw border rectangle
    this.writer.rect(minX, minY, boxWidth, boxHeight);
    this.writer.stroke();
  }
}
