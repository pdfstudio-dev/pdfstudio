import { PDFWriter } from '../core/PDFWriter'
import {
  TableOptions,
  TableColumn,
  TableCell,
  TableRow,
  TableBorders,
  TableBorderStyle,
  CellAlign,
  CellVAlign
} from '../types'
import { parseColor } from '../utils/colors'

/**
 * Normalized cell data
 */
interface NormalizedCell {
  content: string
  align: CellAlign
  valign: CellVAlign
  colSpan: number
  rowSpan: number
  backgroundColor?: string
  textColor?: string
  fontSize?: number
  bold?: boolean
}

/**
 * Table - Renders tables with customizable styling
 */
export class Table {
  private writer: PDFWriter
  private options: TableOptions

  constructor(writer: PDFWriter, options: TableOptions) {
    this.writer = writer
    this.options = {
      cellPadding: 5,
      fontSize: 10,
      textColor: '#000000',
      rowHeight: 25,
      defaultAlign: 'left',
      defaultVAlign: 'middle',
      borders: true,
      headerStyle: {
        backgroundColor: '#f0f0f0',
        textColor: '#000000',
        fontSize: 11,
        bold: true,
        align: 'center',
        valign: 'middle',
        height: 30
      },
      ...options
    }
  }

  /**
   * Render the table
   */
  render(): void {
    const { x, y, rows } = this.options

    // Build columns from headers or columns option
    const columns = this.buildColumns()

    // Calculate column widths
    const columnWidths = this.calculateColumnWidths(columns, rows)
    const tableWidth = columnWidths.reduce((sum, w) => sum + w, 0)

    // Get auto page break settings
    const autoPageBreak = this.options.autoPageBreak ?? false
    const bottomMargin = this.options.bottomMargin ?? 50
    const repeatHeader = this.options.repeatHeader ?? true
    const pageHeight = this.writer.getCurrentPageHeight()

    // Track current Y position
    let currentY = y
    const startX = x
    let tableStartY = y

    // Draw header
    const headerHeight = this.options.headerStyle?.height || this.options.rowHeight!
    if (columns.length > 0) {
      this.drawHeader(columns, columnWidths, startX, currentY, headerHeight)
      currentY += headerHeight
    }

    // Draw rows
    rows.forEach((row, rowIndex) => {
      const rowHeight = this.options.rowHeight!

      // Check if we need a page break
      if (autoPageBreak && currentY + rowHeight > pageHeight - bottomMargin) {
        // Add a new page
        this.writer.addPage()

        // Reset Y to top margin (use same starting Y as original table)
        currentY = y
        tableStartY = y

        // Repeat header if enabled
        if (repeatHeader && columns.length > 0) {
          this.drawHeader(columns, columnWidths, startX, currentY, headerHeight)
          currentY += headerHeight
        }
      }

      this.drawRow(row, columns, columnWidths, startX, currentY, rowHeight, rowIndex)
      currentY += rowHeight
    })

    // Draw outer borders if needed (only if not using auto page breaks)
    // Note: with page breaks, we don't draw outer borders as they would span multiple pages
    if (!autoPageBreak) {
      if (this.shouldDrawBorder('top') || this.shouldDrawBorder('bottom') ||
          this.shouldDrawBorder('left') || this.shouldDrawBorder('right')) {
        const totalHeight = (this.options.headerStyle?.height || this.options.rowHeight!) +
                           (rows.length * this.options.rowHeight!)
        this.drawOuterBorders(startX, tableStartY, tableWidth, totalHeight)
      }
    }
  }

  /**
   * Build column definitions
   */
  private buildColumns(): TableColumn[] {
    if (this.options.columns) {
      return this.options.columns
    }

    if (this.options.headers) {
      return this.options.headers.map(header => ({
        header,
        width: 'auto' as const,
        align: this.options.defaultAlign,
        valign: this.options.defaultVAlign
      }))
    }

    // Auto-generate from first row
    if (this.options.rows.length > 0) {
      const firstRow = this.options.rows[0]
      return firstRow.map((_, index) => ({
        header: `Column ${index + 1}`,
        width: 'auto' as const,
        align: this.options.defaultAlign,
        valign: this.options.defaultVAlign
      }))
    }

    return []
  }

  /**
   * Calculate column widths
   */
  private calculateColumnWidths(columns: TableColumn[], rows: TableRow[]): number[] {
    const availableWidth = this.options.width || 500
    const columnCount = columns.length

    // Separate fixed, auto, and proportional columns
    const fixedWidths: (number | null)[] = columns.map(col => {
      if (typeof col.width === 'number') {
        return col.width
      }
      return null
    })

    const fixedTotal = fixedWidths.reduce((sum: number, w) => sum + (w || 0), 0)
    const remainingWidth = availableWidth - fixedTotal

    // Count auto and proportional columns
    const autoCount = columns.filter(col => col.width === 'auto').length
    const proportionalCount = columns.filter(col => col.width === '*').length

    // Distribute remaining width
    const widths: number[] = []
    let autoWidth = 0
    let proportionalWidth = 0

    if (autoCount > 0) {
      autoWidth = remainingWidth / (autoCount + proportionalCount)
    }
    if (proportionalCount > 0) {
      proportionalWidth = remainingWidth / (autoCount + proportionalCount)
    }

    columns.forEach((col, index) => {
      if (fixedWidths[index] !== null) {
        widths.push(fixedWidths[index]!)
      } else if (col.width === 'auto') {
        widths.push(autoWidth)
      } else if (col.width === '*') {
        widths.push(proportionalWidth)
      } else {
        widths.push(availableWidth / columnCount)
      }
    })

    return widths
  }

  /**
   * Draw table header
   */
  private drawHeader(
    columns: TableColumn[],
    columnWidths: number[],
    x: number,
    y: number,
    height: number
  ): void {
    const headerStyle = this.options.headerStyle!

    // Draw header background
    if (headerStyle.backgroundColor) {
      const [r, g, b] = parseColor(headerStyle.backgroundColor)
      this.writer.setFillColor(r, g, b)
      const totalWidth = columnWidths.reduce((sum, w) => sum + w, 0)
      this.writer.rect(x, y, totalWidth, height)
      this.writer.fill()
    }

    // Draw header cells
    let currentX = x
    columns.forEach((column, index) => {
      const cellWidth = columnWidths[index]

      // Draw cell text
      const textColor = parseColor(headerStyle.textColor || '#000000')
      this.writer.setFillColor(textColor[0], textColor[1], textColor[2])

      const text = column.header
      const fontSize = headerStyle.fontSize || this.options.fontSize!
      const align = headerStyle.align || 'center'
      const valign = headerStyle.valign || 'middle'

      const textX = this.calculateTextX(text, currentX, cellWidth, align, fontSize)
      const textY = this.calculateTextY(y, height, valign, fontSize)

      this.writer.text(text, textX, textY, fontSize)

      // Draw vertical border after cell (if not last)
      if (index < columns.length - 1 && this.shouldDrawBorder('vertical')) {
        this.drawVerticalBorder(currentX + cellWidth, y, height)
      }

      currentX += cellWidth
    })

    // Draw header separator
    if (this.shouldDrawBorder('header')) {
      this.drawHorizontalBorder(x, y + height, columnWidths.reduce((s, w) => s + w, 0))
    }
  }

  /**
   * Draw table row
   */
  private drawRow(
    row: TableRow,
    columns: TableColumn[],
    columnWidths: number[],
    x: number,
    y: number,
    height: number,
    rowIndex: number
  ): void {
    // Draw alternating row background
    if (rowIndex % 2 === 1 && this.options.alternateRowColor) {
      const [r, g, b] = parseColor(this.options.alternateRowColor)
      this.writer.setFillColor(r, g, b)
      const totalWidth = columnWidths.reduce((sum, w) => sum + w, 0)
      this.writer.rect(x, y, totalWidth, height)
      this.writer.fill()
    }

    // Draw cells
    let currentX = x
    row.forEach((cell, cellIndex) => {
      const cellWidth = columnWidths[cellIndex]
      const normalizedCell = this.normalizeCell(cell, columns[cellIndex])

      // Draw cell background if specified
      if (normalizedCell.backgroundColor) {
        const [r, g, b] = parseColor(normalizedCell.backgroundColor)
        this.writer.setFillColor(r, g, b)
        this.writer.rect(currentX, y, cellWidth, height)
        this.writer.fill()
      }

      // Draw cell text
      const textColor = parseColor(normalizedCell.textColor || this.options.textColor!)
      this.writer.setFillColor(textColor[0], textColor[1], textColor[2])

      const text = String(normalizedCell.content)
      const fontSize = normalizedCell.fontSize || this.options.fontSize!

      const textX = this.calculateTextX(text, currentX, cellWidth, normalizedCell.align, fontSize)
      const textY = this.calculateTextY(y, height, normalizedCell.valign, fontSize)

      this.writer.text(text, textX, textY, fontSize)

      // Draw vertical border after cell (if not last)
      if (cellIndex < row.length - 1 && this.shouldDrawBorder('vertical')) {
        this.drawVerticalBorder(currentX + cellWidth, y, height)
      }

      currentX += cellWidth
    })

    // Draw horizontal border after row (if not last)
    if (this.shouldDrawBorder('horizontal')) {
      this.drawHorizontalBorder(x, y + height, columnWidths.reduce((s, w) => s + w, 0))
    }
  }

  /**
   * Normalize cell data to standard format
   */
  private normalizeCell(cell: TableCell, column: TableColumn): NormalizedCell {
    if (typeof cell === 'string' || typeof cell === 'number') {
      return {
        content: String(cell),
        align: column.align || this.options.defaultAlign!,
        valign: column.valign || this.options.defaultVAlign!,
        colSpan: 1,
        rowSpan: 1
      }
    }

    return {
      content: String(cell.content),
      align: cell.align || column.align || this.options.defaultAlign!,
      valign: cell.valign || column.valign || this.options.defaultVAlign!,
      colSpan: cell.colSpan || 1,
      rowSpan: cell.rowSpan || 1,
      backgroundColor: cell.backgroundColor,
      textColor: cell.textColor,
      fontSize: cell.fontSize,
      bold: cell.bold
    }
  }

  /**
   * Calculate text X position based on alignment
   */
  private calculateTextX(
    text: string,
    cellX: number,
    cellWidth: number,
    align: CellAlign,
    fontSize: number
  ): number {
    const padding = this.options.cellPadding!
    const textWidth = text.length * (fontSize * 0.5) // Approximate text width

    switch (align) {
      case 'left':
        return cellX + padding
      case 'center':
        return cellX + (cellWidth - textWidth) / 2
      case 'right':
        return cellX + cellWidth - textWidth - padding
      default:
        return cellX + padding
    }
  }

  /**
   * Calculate text Y position based on vertical alignment
   * Note: In PDF coordinates, Y grows upward from bottom.
   * Text is drawn at the baseline (roughly 30% of fontSize above the bottom of the character)
   */
  private calculateTextY(
    cellY: number,
    cellHeight: number,
    valign: CellVAlign,
    fontSize: number
  ): number {
    const padding = this.options.cellPadding!
    // Baseline offset: text baseline is approximately 30% of fontSize from the bottom of the text
    const baselineOffset = fontSize * 0.3

    switch (valign) {
      case 'top':
        // Top of cell, accounting for padding and descenders
        return cellY + cellHeight - padding - baselineOffset
      case 'middle':
        // Center of cell, adjusted for baseline
        return cellY + cellHeight / 2 + baselineOffset
      case 'bottom':
        // Bottom of cell, accounting for padding and baseline
        return cellY + padding + fontSize - baselineOffset
      default:
        return cellY + cellHeight / 2 + baselineOffset
    }
  }

  /**
   * Check if border should be drawn
   */
  private shouldDrawBorder(type: keyof TableBorders): boolean {
    const borders = this.options.borders

    if (typeof borders === 'boolean') {
      return borders
    }

    if (!borders) {
      return false
    }

    const borderValue = borders[type]
    if (borderValue === undefined) {
      return false
    }

    return borderValue === true || typeof borderValue === 'object'
  }

  /**
   * Get border style
   */
  private getBorderStyle(type: keyof TableBorders): TableBorderStyle {
    const borders = this.options.borders

    if (typeof borders === 'boolean') {
      return { color: '#000000', width: 1, style: 'solid' }
    }

    if (!borders) {
      return { color: '#000000', width: 1, style: 'solid' }
    }

    const borderValue = borders[type]
    if (borderValue === true) {
      return { color: '#000000', width: 1, style: 'solid' }
    }

    if (typeof borderValue === 'object') {
      return {
        color: borderValue.color || '#000000',
        width: borderValue.width || 1,
        style: borderValue.style || 'solid'
      }
    }

    return { color: '#000000', width: 1, style: 'solid' }
  }

  /**
   * Draw horizontal border
   */
  private drawHorizontalBorder(x: number, y: number, width: number): void {
    const style = this.getBorderStyle('horizontal')
    const [r, g, b] = parseColor(style.color!)

    this.writer.setStrokeColor(r, g, b)
    this.writer.setLineWidth(style.width!)

    this.writer.moveTo(x, y)
    this.writer.lineTo(x + width, y)
    this.writer.stroke()
  }

  /**
   * Draw vertical border
   */
  private drawVerticalBorder(x: number, y: number, height: number): void {
    const style = this.getBorderStyle('vertical')
    const [r, g, b] = parseColor(style.color!)

    this.writer.setStrokeColor(r, g, b)
    this.writer.setLineWidth(style.width!)

    this.writer.moveTo(x, y)
    this.writer.lineTo(x, y + height)
    this.writer.stroke()
  }

  /**
   * Draw outer borders
   */
  private drawOuterBorders(x: number, y: number, width: number, height: number): void {
    // Top
    if (this.shouldDrawBorder('top')) {
      const style = this.getBorderStyle('top')
      const [r, g, b] = parseColor(style.color!)
      this.writer.setStrokeColor(r, g, b)
      this.writer.setLineWidth(style.width!)
      this.writer.moveTo(x, y + height)
      this.writer.lineTo(x + width, y + height)
      this.writer.stroke()
    }

    // Bottom
    if (this.shouldDrawBorder('bottom')) {
      const style = this.getBorderStyle('bottom')
      const [r, g, b] = parseColor(style.color!)
      this.writer.setStrokeColor(r, g, b)
      this.writer.setLineWidth(style.width!)
      this.writer.moveTo(x, y)
      this.writer.lineTo(x + width, y)
      this.writer.stroke()
    }

    // Left
    if (this.shouldDrawBorder('left')) {
      const style = this.getBorderStyle('left')
      const [r, g, b] = parseColor(style.color!)
      this.writer.setStrokeColor(r, g, b)
      this.writer.setLineWidth(style.width!)
      this.writer.moveTo(x, y)
      this.writer.lineTo(x, y + height)
      this.writer.stroke()
    }

    // Right
    if (this.shouldDrawBorder('right')) {
      const style = this.getBorderStyle('right')
      const [r, g, b] = parseColor(style.color!)
      this.writer.setStrokeColor(r, g, b)
      this.writer.setLineWidth(style.width!)
      this.writer.moveTo(x + width, y)
      this.writer.lineTo(x + width, y + height)
      this.writer.stroke()
    }
  }
}
