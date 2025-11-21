import { GraphicsStateManager } from '../../../src/core/managers/GraphicsStateManager'

describe('GraphicsStateManager', () => {
  let manager: GraphicsStateManager

  beforeEach(() => {
    manager = new GraphicsStateManager()
  })

  describe('registerExtGState', () => {
    it('should register a new ExtGState and return ID', () => {
      const id = manager.registerExtGState('hash1')
      expect(id).toBe(1)
    })

    it('should return same ID for duplicate hash', () => {
      const id1 = manager.registerExtGState('hash1')
      const id2 = manager.registerExtGState('hash1')
      expect(id1).toBe(id2)
    })

    it('should increment ID for different ExtGStates', () => {
      const id1 = manager.registerExtGState('hash1')
      const id2 = manager.registerExtGState('hash2')
      expect(id2).toBe(id1 + 1)
    })
  })

  describe('getExtGState', () => {
    it('should return ExtGState ID for existing hash', () => {
      manager.registerExtGState('hash1')
      const result = manager.getExtGState('hash1')

      expect(result).toBeDefined()
      expect(result).toBe(1)
    })

    it('should return undefined for non-existent hash', () => {
      const result = manager.getExtGState('nonexistent')
      expect(result).toBeUndefined()
    })
  })

  describe('getAllExtGStates', () => {
    it('should return all registered ExtGStates', () => {
      manager.registerExtGState('hash1')
      manager.registerExtGState('hash2')

      const allExtGStates = manager.getAllExtGStates()
      expect(allExtGStates.size).toBe(2)
      expect(allExtGStates.has('hash1')).toBe(true)
      expect(allExtGStates.has('hash2')).toBe(true)
    })

    it('should return empty map when no ExtGStates registered', () => {
      const allExtGStates = manager.getAllExtGStates()
      expect(allExtGStates.size).toBe(0)
    })
  })

  describe('setBlendMode', () => {
    it('should set blend mode', () => {
      manager.setBlendMode('Multiply')
      expect(manager.getBlendMode()).toBe('Multiply')
    })

    it('should change blend mode', () => {
      manager.setBlendMode('Multiply')
      manager.setBlendMode('Screen')
      expect(manager.getBlendMode()).toBe('Screen')
    })
  })

  describe('getBlendMode', () => {
    it('should return default blend mode', () => {
      expect(manager.getBlendMode()).toBe('Normal')
    })

    it('should return current blend mode', () => {
      manager.setBlendMode('Overlay')
      expect(manager.getBlendMode()).toBe('Overlay')
    })
  })

  describe('setOpacity', () => {
    it('should set opacity', () => {
      manager.setOpacity(0.5)
      expect(manager.getOpacity()).toBe(0.5)
    })

    it('should change opacity', () => {
      manager.setOpacity(0.5)
      manager.setOpacity(0.8)
      expect(manager.getOpacity()).toBe(0.8)
    })

    it('should accept 0 opacity', () => {
      manager.setOpacity(0)
      expect(manager.getOpacity()).toBe(0)
    })

    it('should accept 1 opacity', () => {
      manager.setOpacity(1)
      expect(manager.getOpacity()).toBe(1)
    })
  })

  describe('getOpacity', () => {
    it('should return default opacity', () => {
      expect(manager.getOpacity()).toBe(1.0)
    })

    it('should return current opacity', () => {
      manager.setOpacity(0.7)
      expect(manager.getOpacity()).toBe(0.7)
    })
  })

  describe('hasExtGState', () => {
    it('should return true for registered ExtGState', () => {
      manager.registerExtGState('hash1')
      expect(manager.hasExtGState('hash1')).toBe(true)
    })

    it('should return false for non-registered ExtGState', () => {
      expect(manager.hasExtGState('nonexistent')).toBe(false)
    })
  })

  describe('getNextExtGStateId', () => {
    it('should return next available ID', () => {
      expect(manager.getNextExtGStateId()).toBe(1)

      manager.registerExtGState('hash1')
      expect(manager.getNextExtGStateId()).toBe(2)
    })

    it('should not increment when registering duplicate hash', () => {
      manager.registerExtGState('hash1')
      manager.registerExtGState('hash1')
      expect(manager.getNextExtGStateId()).toBe(2)
    })
  })

  describe('getExtGStateCount', () => {
    it('should return correct count of registered ExtGStates', () => {
      expect(manager.getExtGStateCount()).toBe(0)
      manager.registerExtGState('hash1')
      expect(manager.getExtGStateCount()).toBe(1)
      manager.registerExtGState('hash2')
      expect(manager.getExtGStateCount()).toBe(2)
    })

    it('should not increment count for duplicate hash', () => {
      manager.registerExtGState('hash1')
      manager.registerExtGState('hash1')
      expect(manager.getExtGStateCount()).toBe(1)
    })
  })

  describe('resetState', () => {
    it('should reset blend mode to Normal', () => {
      manager.setBlendMode('Multiply')
      manager.resetState()
      expect(manager.getBlendMode()).toBe('Normal')
    })

    it('should reset opacity to 1.0', () => {
      manager.setOpacity(0.5)
      manager.resetState()
      expect(manager.getOpacity()).toBe(1.0)
    })

    it('should not clear registered ExtGStates', () => {
      manager.registerExtGState('hash1')
      manager.resetState()
      expect(manager.getExtGStateCount()).toBe(1)
    })
  })

  describe('clear', () => {
    it('should clear all ExtGStates and reset state', () => {
      manager.registerExtGState('hash1')
      manager.registerExtGState('hash2')
      manager.setBlendMode('Multiply')
      manager.setOpacity(0.5)

      expect(manager.getExtGStateCount()).toBe(2)

      manager.clear()

      expect(manager.getExtGStateCount()).toBe(0)
      expect(manager.getBlendMode()).toBe('Normal')
      expect(manager.getOpacity()).toBe(1.0)
      expect(manager.getNextExtGStateId()).toBe(1)
    })

    it('should reset ID counter', () => {
      manager.registerExtGState('hash1')
      manager.clear()

      const id = manager.registerExtGState('hash2')
      expect(id).toBe(1)
    })
  })
})
