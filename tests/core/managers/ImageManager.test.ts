import { ImageManager } from '../../../src/core/managers/ImageManager'
import { ImageInfo } from '../../../src/types'

describe('ImageManager', () => {
  let manager: ImageManager

  beforeEach(() => {
    manager = new ImageManager()
  })

  describe('registerImage', () => {
    it('should register a new image and return ID', () => {
      const imageInfo: ImageInfo = {
        width: 100,
        height: 100,
        colorSpace: 'DeviceRGB',
        format: 'PNG' as const,
        bitsPerComponent: 8,
        data: Buffer.from('test')
      }

      const id = manager.registerImage('hash1', imageInfo)
      expect(id).toBe(1)
    })

    it('should return same ID for duplicate hash', () => {
      const imageInfo: ImageInfo = {
        width: 100,
        height: 100,
        colorSpace: 'DeviceRGB',
        format: 'PNG' as const,
        bitsPerComponent: 8,
        data: Buffer.from('test')
      }

      const id1 = manager.registerImage('hash1', imageInfo)
      const id2 = manager.registerImage('hash1', imageInfo)
      expect(id1).toBe(id2)
    })

    it('should increment ID for different images', () => {
      const imageInfo1: ImageInfo = {
        width: 100,
        height: 100,
        colorSpace: 'DeviceRGB',
        format: 'PNG' as const,
        bitsPerComponent: 8,
        data: Buffer.from('test1')
      }
      const imageInfo2: ImageInfo = {
        width: 200,
        height: 200,
        colorSpace: 'DeviceRGB',
        format: 'PNG' as const,
        bitsPerComponent: 8,
        data: Buffer.from('test2')
      }

      const id1 = manager.registerImage('hash1', imageInfo1)
      const id2 = manager.registerImage('hash2', imageInfo2)
      expect(id2).toBe(id1 + 1)
    })
  })

  describe('getImage', () => {
    it('should return image info for existing hash', () => {
      const imageInfo: ImageInfo = {
        width: 100,
        height: 100,
        colorSpace: 'DeviceRGB',
        format: 'PNG' as const,
        bitsPerComponent: 8,
        data: Buffer.from('test')
      }

      manager.registerImage('hash1', imageInfo)
      const result = manager.getImage('hash1')

      expect(result).toBeDefined()
      expect(result!.info).toEqual(imageInfo)
      expect(result!.id).toBe(1)
    })

    it('should return undefined for non-existent hash', () => {
      const result = manager.getImage('nonexistent')
      expect(result).toBeUndefined()
    })
  })

  describe('hasImage', () => {
    it('should return true for registered image', () => {
      const imageInfo: ImageInfo = {
        width: 100,
        height: 100,
        colorSpace: 'DeviceRGB',
        format: 'PNG' as const,
        bitsPerComponent: 8,
        data: Buffer.from('test')
      }

      manager.registerImage('hash1', imageInfo)
      expect(manager.hasImage('hash1')).toBe(true)
    })

    it('should return false for non-registered image', () => {
      expect(manager.hasImage('nonexistent')).toBe(false)
    })
  })

  describe('getAllImages', () => {
    it('should return all registered images', () => {
      const imageInfo1: ImageInfo = {
        width: 100,
        height: 100,
        colorSpace: 'DeviceRGB',
        format: 'PNG' as const,
        bitsPerComponent: 8,
        data: Buffer.from('test1')
      }
      const imageInfo2: ImageInfo = {
        width: 200,
        height: 200,
        colorSpace: 'DeviceRGB',
        format: 'PNG' as const,
        bitsPerComponent: 8,
        data: Buffer.from('test2')
      }

      manager.registerImage('hash1', imageInfo1)
      manager.registerImage('hash2', imageInfo2)

      const allImages = manager.getAllImages()
      expect(allImages.size).toBe(2)
      expect(allImages.has('hash1')).toBe(true)
      expect(allImages.has('hash2')).toBe(true)
    })

    it('should return empty map when no images registered', () => {
      const allImages = manager.getAllImages()
      expect(allImages.size).toBe(0)
    })
  })

  describe('getImageCount', () => {
    it('should return correct count of registered images', () => {
      const imageInfo: ImageInfo = {
        width: 100,
        height: 100,
        colorSpace: 'DeviceRGB',
        format: 'PNG' as const,
        bitsPerComponent: 8,
        data: Buffer.from('test')
      }

      expect(manager.getImageCount()).toBe(0)
      manager.registerImage('hash1', imageInfo)
      expect(manager.getImageCount()).toBe(1)
      manager.registerImage('hash2', imageInfo)
      expect(manager.getImageCount()).toBe(2)
    })
  })

  describe('getNextImageId', () => {
    it('should return next available ID', () => {
      expect(manager.getNextImageId()).toBe(1)

      const imageInfo: ImageInfo = {
        width: 100,
        height: 100,
        colorSpace: 'DeviceRGB',
        format: 'PNG' as const,
        bitsPerComponent: 8,
        data: Buffer.from('test')
      }

      manager.registerImage('hash1', imageInfo)
      expect(manager.getNextImageId()).toBe(2)
    })
  })

  describe('clear', () => {
    it('should clear all images and reset ID counter', () => {
      const imageInfo: ImageInfo = {
        width: 100,
        height: 100,
        colorSpace: 'DeviceRGB',
        format: 'PNG' as const,
        bitsPerComponent: 8,
        data: Buffer.from('test')
      }

      manager.registerImage('hash1', imageInfo)
      manager.registerImage('hash2', imageInfo)
      expect(manager.getImageCount()).toBe(2)

      manager.clear()
      expect(manager.getImageCount()).toBe(0)
      expect(manager.getNextImageId()).toBe(1)
    })
  })
})
