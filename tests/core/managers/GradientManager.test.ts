import { GradientManager } from '../../../src/core/managers/GradientManager'
import { Gradient } from '../../../src/types'

describe('GradientManager', () => {
  let manager: GradientManager

  beforeEach(() => {
    manager = new GradientManager()
  })

  describe('registerGradient', () => {
    it('should register a new gradient and return ID', () => {
      const gradient: Gradient = {
        x0: 0,
        y0: 0,
        x1: 100,
        y1: 100,
        colorStops: [
          { offset: 0, color: [1, 0, 0] },
          { offset: 1, color: [0, 0, 1] }
        ]
      }

      const id = manager.registerGradient('hash1', gradient)
      expect(id).toBe(1)
    })

    it('should return same ID for duplicate hash', () => {
      const gradient: Gradient = {
        x0: 0,
        y0: 0,
        x1: 100,
        y1: 100,
        colorStops: [
          { offset: 0, color: [1, 0, 0] },
          { offset: 1, color: [0, 0, 1] }
        ]
      }

      const id1 = manager.registerGradient('hash1', gradient)
      const id2 = manager.registerGradient('hash1', gradient)
      expect(id1).toBe(id2)
    })

    it('should increment ID for different gradients', () => {
      const gradient1: Gradient = {
        x0: 0,
        y0: 0,
        x1: 100,
        y1: 100,
        colorStops: [{ offset: 0, color: [1, 0, 0] }, { offset: 1, color: [0, 0, 1] }]
      }
      const gradient2: Gradient = {
        x0: 50,
        y0: 50,
        r0: 0,
        x1: 50,
        y1: 50,
        r1: 50,
        colorStops: [{ offset: 0, color: [0, 1, 0] }, { offset: 1, color: [1, 0, 1] }]
      }

      const id1 = manager.registerGradient('hash1', gradient1)
      const id2 = manager.registerGradient('hash2', gradient2)
      expect(id2).toBe(id1 + 1)
    })
  })

  describe('getGradient', () => {
    it('should return gradient for existing hash', () => {
      const gradient: Gradient = {
        x0: 0,
        y0: 0,
        x1: 100,
        y1: 100,
        colorStops: [{ offset: 0, color: [1, 0, 0] }, { offset: 1, color: [0, 0, 1] }]
      }

      manager.registerGradient('hash1', gradient)
      const result = manager.getGradient('hash1')

      expect(result).toBeDefined()
      expect(result!.gradient).toEqual(gradient)
      expect(result!.id).toBe(1)
    })

    it('should return undefined for non-existent hash', () => {
      const result = manager.getGradient('nonexistent')
      expect(result).toBeUndefined()
    })
  })

  describe('hasGradient', () => {
    it('should return true for registered gradient', () => {
      const gradient: Gradient = {
        x0: 0,
        y0: 0,
        x1: 100,
        y1: 100,
        colorStops: [{ offset: 0, color: [1, 0, 0] }, { offset: 1, color: [0, 0, 1] }]
      }

      manager.registerGradient('hash1', gradient)
      expect(manager.hasGradient('hash1')).toBe(true)
    })

    it('should return false for non-registered gradient', () => {
      expect(manager.hasGradient('nonexistent')).toBe(false)
    })
  })

  describe('getGradientCount', () => {
    it('should return correct count', () => {
      const gradient: Gradient = {
        x0: 0,
        y0: 0,
        x1: 100,
        y1: 100,
        colorStops: [{ offset: 0, color: [1, 0, 0] }, { offset: 1, color: [0, 0, 1] }]
      }

      expect(manager.getGradientCount()).toBe(0)
      manager.registerGradient('hash1', gradient)
      expect(manager.getGradientCount()).toBe(1)
    })
  })

  describe('clear', () => {
    it('should clear all gradients and reset counter', () => {
      const gradient: Gradient = {
        x0: 0,
        y0: 0,
        x1: 100,
        y1: 100,
        colorStops: [{ offset: 0, color: [1, 0, 0] }, { offset: 1, color: [0, 0, 1] }]
      }

      manager.registerGradient('hash1', gradient)
      expect(manager.getGradientCount()).toBe(1)

      manager.clear()
      expect(manager.getGradientCount()).toBe(0)
      expect(manager.getNextGradientId()).toBe(1)
    })
  })
})
