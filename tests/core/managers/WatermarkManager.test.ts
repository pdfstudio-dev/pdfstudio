import { WatermarkManager } from '../../../src/core/managers/WatermarkManager'
import { Watermark } from '../../../src/types'

describe('WatermarkManager', () => {
  let manager: WatermarkManager

  beforeEach(() => {
    manager = new WatermarkManager()
  })

  describe('addWatermark', () => {
    it('should add a text watermark', () => {
      const watermark: Watermark = {
        type: 'text',
        text: 'CONFIDENTIAL',
        fontSize: 48,
        color: [1, 0, 0],
        opacity: 0.3
      }

      manager.addWatermark(watermark)
      expect(manager.getAllWatermarks()).toHaveLength(1)
      expect(manager.getAllWatermarks()[0]).toEqual(watermark)
    })

    it('should add an image watermark', () => {
      const watermark: Watermark = {
        type: 'image',
        source: 'test-image.png',
        width: 200,
        height: 200,
        opacity: 0.2
      }

      manager.addWatermark(watermark)
      expect(manager.getAllWatermarks()).toHaveLength(1)
      expect(manager.getAllWatermarks()[0].type).toBe('image')
    })

    it('should add multiple watermarks', () => {
      const watermark1: Watermark = {
        type: 'text',
        text: 'DRAFT'
      }
      const watermark2: Watermark = {
        type: 'text',
        text: 'COPY'
      }

      manager.addWatermark(watermark1)
      manager.addWatermark(watermark2)
      expect(manager.getAllWatermarks()).toHaveLength(2)
    })
  })

  describe('getWatermarksForPage', () => {
    it('should return global watermarks for any page', () => {
      const globalWatermark: Watermark = {
        type: 'text',
        text: 'GLOBAL'
      }

      manager.addWatermark(globalWatermark)

      expect(manager.getWatermarksForPage(0)).toHaveLength(1)
      expect(manager.getWatermarksForPage(1)).toHaveLength(1)
      expect(manager.getWatermarksForPage(5)).toHaveLength(1)
    })

    it('should return page-specific watermarks for correct page', () => {
      const pageWatermark: Watermark = {
        type: 'text',
        text: 'PAGE 0',
        pages: [0]
      }

      manager.addWatermark(pageWatermark)

      expect(manager.getWatermarksForPage(0)).toHaveLength(1)
      expect(manager.getWatermarksForPage(1)).toHaveLength(0)
      expect((manager.getWatermarksForPage(0)[0] as any).text).toBe('PAGE 0')
    })

    it('should return both global and page-specific watermarks', () => {
      const globalWatermark: Watermark = {
        type: 'text',
        text: 'GLOBAL'
      }
      const page0Watermark: Watermark = {
        type: 'text',
        text: 'PAGE 0',
        pages: [0]
      }
      const page1Watermark: Watermark = {
        type: 'text',
        text: 'PAGE 1',
        pages: [1]
      }

      manager.addWatermark(globalWatermark)
      manager.addWatermark(page0Watermark)
      manager.addWatermark(page1Watermark)

      const page0Watermarks = manager.getWatermarksForPage(0)
      const page1Watermarks = manager.getWatermarksForPage(1)

      expect(page0Watermarks).toHaveLength(2) // global + page 0
      expect(page1Watermarks).toHaveLength(2) // global + page 1
    })
  })

  describe('getGlobalWatermarks', () => {
    it('should return only global watermarks', () => {
      const globalWatermark: Watermark = {
        type: 'text',
        text: 'GLOBAL'
      }
      const pageWatermark: Watermark = {
        type: 'text',
        text: 'PAGE 0',
        pages: [0]
      }

      manager.addWatermark(globalWatermark)
      manager.addWatermark(pageWatermark)

      const globalWatermarks = manager.getGlobalWatermarks()
      expect(globalWatermarks).toHaveLength(1)
      expect((globalWatermarks[0] as any).text).toBe('GLOBAL')
    })

    it('should return empty array when no global watermarks', () => {
      const pageWatermark: Watermark = {
        type: 'text',
        text: 'PAGE 0',
        pages: [0]
      }

      manager.addWatermark(pageWatermark)
      expect(manager.getGlobalWatermarks()).toHaveLength(0)
    })
  })

  describe('getWatermarkCount', () => {
    it('should return correct count', () => {
      expect(manager.getWatermarkCount()).toBe(0)

      const watermark: Watermark = {
        type: 'text',
        text: 'TEST'
      }

      manager.addWatermark(watermark)
      expect(manager.getWatermarkCount()).toBe(1)

      manager.addWatermark(watermark)
      expect(manager.getWatermarkCount()).toBe(2)
    })
  })

  describe('hasWatermarks', () => {
    it('should return false when no watermarks', () => {
      expect(manager.hasWatermarks()).toBe(false)
    })

    it('should return true when watermarks exist', () => {
      const watermark: Watermark = {
        type: 'text',
        text: 'TEST'
      }

      manager.addWatermark(watermark)
      expect(manager.hasWatermarks()).toBe(true)
    })
  })

  describe('getAllWatermarks', () => {
    it('should return all watermarks', () => {
      const watermark1: Watermark = {
        type: 'text',
        text: 'WATERMARK 1'
      }
      const watermark2: Watermark = {
        type: 'text',
        text: 'WATERMARK 2',
        pages: [0]
      }

      manager.addWatermark(watermark1)
      manager.addWatermark(watermark2)

      const allWatermarks = manager.getAllWatermarks()
      expect(allWatermarks).toHaveLength(2)
      expect((allWatermarks[0] as any).text).toBe('WATERMARK 1')
      expect((allWatermarks[1] as any).text).toBe('WATERMARK 2')
    })

    it('should return empty array when no watermarks', () => {
      expect(manager.getAllWatermarks()).toHaveLength(0)
    })
  })

  describe('clear', () => {
    it('should clear all watermarks', () => {
      const watermark: Watermark = {
        type: 'text',
        text: 'TEST'
      }

      manager.addWatermark(watermark)
      expect(manager.getWatermarkCount()).toBe(1)

      manager.clear()
      expect(manager.getWatermarkCount()).toBe(0)
      expect(manager.hasWatermarks()).toBe(false)
    })
  })
})
