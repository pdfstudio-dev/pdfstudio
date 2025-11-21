import { PatternManager } from '../../../src/core/managers/PatternManager'
import { TilingPatternOptions } from '../../../src/types'

describe('PatternManager', () => {
  let manager: PatternManager

  beforeEach(() => {
    manager = new PatternManager()
  })

  describe('registerPattern', () => {
    it('should register a new pattern and return ID', () => {
      const pattern: TilingPatternOptions = {
        width: 10,
        height: 10,
        xStep: 10,
        yStep: 10,
        draw: () => {}
      }

      const id = manager.registerPattern('hash1', pattern)
      expect(id).toBe(1)
    })

    it('should return same ID for duplicate hash', () => {
      const pattern: TilingPatternOptions = {
        width: 10,
        height: 10,
        xStep: 10,
        yStep: 10,
        draw: () => {}
      }

      const id1 = manager.registerPattern('hash1', pattern)
      const id2 = manager.registerPattern('hash1', pattern)
      expect(id1).toBe(id2)
    })

    it('should increment ID for different patterns', () => {
      const pattern1: TilingPatternOptions = {
        width: 10,
        height: 10,
        xStep: 10,
        yStep: 10,
        draw: () => {}
      }
      const pattern2: TilingPatternOptions = {
        width: 20,
        height: 20,
        xStep: 20,
        yStep: 20,
        draw: () => {}
      }

      const id1 = manager.registerPattern('hash1', pattern1)
      const id2 = manager.registerPattern('hash2', pattern2)
      expect(id2).toBe(id1 + 1)
    })
  })

  describe('getPattern', () => {
    it('should return pattern for existing hash', () => {
      const pattern: TilingPatternOptions = {
        width: 10,
        height: 10,
        xStep: 10,
        yStep: 10,
        draw: () => {}
      }

      manager.registerPattern('hash1', pattern)
      const result = manager.getPattern('hash1')

      expect(result).toBeDefined()
      expect(result!.id).toBe(1)
      expect(result!.pattern).toEqual(pattern)
    })

    it('should return undefined for non-existent hash', () => {
      const result = manager.getPattern('nonexistent')
      expect(result).toBeUndefined()
    })
  })

  describe('getAllPatterns', () => {
    it('should return all registered patterns', () => {
      const pattern1: TilingPatternOptions = {
        width: 10,
        height: 10,
        xStep: 10,
        yStep: 10,
        draw: () => {}
      }
      const pattern2: TilingPatternOptions = {
        width: 20,
        height: 20,
        xStep: 20,
        yStep: 20,
        draw: () => {}
      }

      manager.registerPattern('hash1', pattern1)
      manager.registerPattern('hash2', pattern2)

      const allPatterns = manager.getAllPatterns()
      expect(allPatterns.size).toBe(2)
      expect(allPatterns.has('hash1')).toBe(true)
      expect(allPatterns.has('hash2')).toBe(true)
    })

    it('should return empty map when no patterns registered', () => {
      const allPatterns = manager.getAllPatterns()
      expect(allPatterns.size).toBe(0)
    })
  })

  describe('hasPattern', () => {
    it('should return true for registered pattern', () => {
      const pattern: TilingPatternOptions = {
        width: 10,
        height: 10,
        xStep: 10,
        yStep: 10,
        draw: () => {}
      }

      manager.registerPattern('hash1', pattern)
      expect(manager.hasPattern('hash1')).toBe(true)
    })

    it('should return false for non-registered pattern', () => {
      expect(manager.hasPattern('nonexistent')).toBe(false)
    })
  })

  describe('getNextPatternId', () => {
    it('should return next available ID', () => {
      expect(manager.getNextPatternId()).toBe(1)

      const pattern: TilingPatternOptions = {
        width: 10,
        height: 10,
        xStep: 10,
        yStep: 10,
        draw: () => {}
      }

      manager.registerPattern('hash1', pattern)
      expect(manager.getNextPatternId()).toBe(2)
    })

    it('should not increment when registering duplicate hash', () => {
      const pattern: TilingPatternOptions = {
        width: 10,
        height: 10,
        xStep: 10,
        yStep: 10,
        draw: () => {}
      }

      manager.registerPattern('hash1', pattern)
      manager.registerPattern('hash1', pattern)
      expect(manager.getNextPatternId()).toBe(2)
    })
  })

  describe('getPatternCount', () => {
    it('should return correct count of registered patterns', () => {
      const pattern: TilingPatternOptions = {
        width: 10,
        height: 10,
        xStep: 10,
        yStep: 10,
        draw: () => {}
      }

      expect(manager.getPatternCount()).toBe(0)
      manager.registerPattern('hash1', pattern)
      expect(manager.getPatternCount()).toBe(1)
      manager.registerPattern('hash2', pattern)
      expect(manager.getPatternCount()).toBe(2)
    })

    it('should not increment count for duplicate hash', () => {
      const pattern: TilingPatternOptions = {
        width: 10,
        height: 10,
        xStep: 10,
        yStep: 10,
        draw: () => {}
      }

      manager.registerPattern('hash1', pattern)
      manager.registerPattern('hash1', pattern)
      expect(manager.getPatternCount()).toBe(1)
    })
  })

  describe('clear', () => {
    it('should clear all patterns and reset ID counter', () => {
      const pattern: TilingPatternOptions = {
        width: 10,
        height: 10,
        xStep: 10,
        yStep: 10,
        draw: () => {}
      }

      manager.registerPattern('hash1', pattern)
      manager.registerPattern('hash2', pattern)
      expect(manager.getPatternCount()).toBe(2)

      manager.clear()
      expect(manager.getPatternCount()).toBe(0)
      expect(manager.getNextPatternId()).toBe(1)
    })
  })
})
