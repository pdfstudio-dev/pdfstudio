import { Watermark } from '../../types'

/**
 * WatermarkManager - Manages watermarks in PDF documents
 *
 * Responsibilities:
 * - Register watermarks (text or image)
 * - Track watermarks per page or global
 * - Provide watermark data for rendering
 */
export class WatermarkManager {
  private watermarks: Watermark[] = []

  /**
   * Add a watermark
   */
  addWatermark(watermark: Watermark): void {
    this.watermarks.push(watermark)
  }

  /**
   * Get all watermarks
   */
  getAllWatermarks(): Watermark[] {
    return this.watermarks
  }

  /**
   * Get watermarks for a specific page
   * Returns both page-specific watermarks and global watermarks (pages undefined or 'all')
   */
  getWatermarksForPage(pageIndex: number): Watermark[] {
    return this.watermarks.filter(w => {
      if (!w.pages || w.pages === 'all') {
        return true // Global watermark
      }
      return w.pages.includes(pageIndex)
    })
  }

  /**
   * Get only global watermarks (apply to all pages)
   */
  getGlobalWatermarks(): Watermark[] {
    return this.watermarks.filter(w => !w.pages || w.pages === 'all')
  }

  /**
   * Get watermark count
   */
  getWatermarkCount(): number {
    return this.watermarks.length
  }

  /**
   * Check if there are any watermarks
   */
  hasWatermarks(): boolean {
    return this.watermarks.length > 0
  }

  /**
   * Clear all watermarks (for testing/reset)
   */
  clear(): void {
    this.watermarks = []
  }
}
