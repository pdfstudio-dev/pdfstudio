import { LayerManager } from '../../../src/core/managers/LayerManager'
import { LayerOptions } from '../../../src/types'

describe('LayerManager', () => {
  let manager: LayerManager

  beforeEach(() => {
    manager = new LayerManager()
  })

  describe('registerLayer', () => {
    it('should register a new layer and return ID', () => {
      const options: LayerOptions = {
        name: 'TestLayer',
        visible: true,
        printable: true
      }

      const id = manager.registerLayer('Layer1', options)
      expect(id).toBe(1)
    })

    it('should return same ID for duplicate layer name', () => {
      const options: LayerOptions = {
        name: 'TestLayer',
        visible: true,
        printable: true
      }

      const id1 = manager.registerLayer('Layer1', options)
      const id2 = manager.registerLayer('Layer1', options)
      expect(id1).toBe(id2)
    })

    it('should increment ID for different layers', () => {
      const options: LayerOptions = {
        name: 'TestLayer',
        visible: true,
        printable: true
      }

      const id1 = manager.registerLayer('Layer1', options)
      const id2 = manager.registerLayer('Layer2', options)
      expect(id2).toBe(id1 + 1)
    })

    it('should initialize content markers for new layer', () => {
      const options: LayerOptions = {
        name: 'TestLayer',
        visible: true
      }

      manager.registerLayer('Layer1', options)
      const markers = manager.getContentMarkers('Layer1')
      expect(markers).toEqual([])
    })
  })

  describe('getLayer', () => {
    it('should return layer for existing name', () => {
      const options: LayerOptions = {
        name: 'TestLayer',
        visible: true,
        printable: false
      }

      manager.registerLayer('Layer1', options)
      const result = manager.getLayer('Layer1')

      expect(result).toBeDefined()
      expect(result!.id).toBe(1)
      expect(result!.options).toEqual(options)
    })

    it('should return undefined for non-existent layer', () => {
      const result = manager.getLayer('NonExistent')
      expect(result).toBeUndefined()
    })
  })

  describe('getAllLayers', () => {
    it('should return all registered layers', () => {
      const options1: LayerOptions = { name: 'Layer1', visible: true }
      const options2: LayerOptions = { name: 'Layer2', visible: false }

      manager.registerLayer('Layer1', options1)
      manager.registerLayer('Layer2', options2)

      const allLayers = manager.getAllLayers()
      expect(allLayers.size).toBe(2)
      expect(allLayers.has('Layer1')).toBe(true)
      expect(allLayers.has('Layer2')).toBe(true)
    })

    it('should return empty map when no layers', () => {
      const allLayers = manager.getAllLayers()
      expect(allLayers.size).toBe(0)
    })
  })

  describe('setCurrentLayer', () => {
    it('should set current layer', () => {
      manager.setCurrentLayer('Layer1')
      expect(manager.getCurrentLayer()).toBe('Layer1')
    })

    it('should allow setting layer to null', () => {
      manager.setCurrentLayer('Layer1')
      manager.setCurrentLayer(null)
      expect(manager.getCurrentLayer()).toBeNull()
    })

    it('should change current layer', () => {
      manager.setCurrentLayer('Layer1')
      manager.setCurrentLayer('Layer2')
      expect(manager.getCurrentLayer()).toBe('Layer2')
    })
  })

  describe('getCurrentLayer', () => {
    it('should return null initially', () => {
      expect(manager.getCurrentLayer()).toBeNull()
    })

    it('should return current layer name', () => {
      manager.setCurrentLayer('TestLayer')
      expect(manager.getCurrentLayer()).toBe('TestLayer')
    })
  })

  describe('addContentMarker', () => {
    it('should add content marker to existing layer', () => {
      const options: LayerOptions = { name: 'TestLayer', visible: true }
      manager.registerLayer('Layer1', options)

      manager.addContentMarker('Layer1', '/OC /MC0 BDC')
      const markers = manager.getContentMarkers('Layer1')

      expect(markers).toHaveLength(1)
      expect(markers[0]).toBe('/OC /MC0 BDC')
    })

    it('should add multiple markers to same layer', () => {
      const options: LayerOptions = { name: 'TestLayer', visible: true }
      manager.registerLayer('Layer1', options)

      manager.addContentMarker('Layer1', '/OC /MC0 BDC')
      manager.addContentMarker('Layer1', '/OC /MC1 BDC')
      const markers = manager.getContentMarkers('Layer1')

      expect(markers).toHaveLength(2)
    })

    it('should not add marker to non-existent layer', () => {
      manager.addContentMarker('NonExistent', '/OC /MC0 BDC')
      const markers = manager.getContentMarkers('NonExistent')
      expect(markers).toHaveLength(0)
    })
  })

  describe('getContentMarkers', () => {
    it('should return markers for layer', () => {
      const options: LayerOptions = { name: 'TestLayer', visible: true }
      manager.registerLayer('Layer1', options)
      manager.addContentMarker('Layer1', 'marker1')
      manager.addContentMarker('Layer1', 'marker2')

      const markers = manager.getContentMarkers('Layer1')
      expect(markers).toEqual(['marker1', 'marker2'])
    })

    it('should return empty array for non-existent layer', () => {
      const markers = manager.getContentMarkers('NonExistent')
      expect(markers).toEqual([])
    })

    it('should return empty array for layer with no markers', () => {
      const options: LayerOptions = { name: 'TestLayer', visible: true }
      manager.registerLayer('Layer1', options)

      const markers = manager.getContentMarkers('Layer1')
      expect(markers).toEqual([])
    })
  })

  describe('hasLayer', () => {
    it('should return true for registered layer', () => {
      const options: LayerOptions = { name: 'TestLayer', visible: true }
      manager.registerLayer('Layer1', options)
      expect(manager.hasLayer('Layer1')).toBe(true)
    })

    it('should return false for non-registered layer', () => {
      expect(manager.hasLayer('NonExistent')).toBe(false)
    })
  })

  describe('getLayerCount', () => {
    it('should return correct count', () => {
      expect(manager.getLayerCount()).toBe(0)

      const options: LayerOptions = { name: 'TestLayer', visible: true }
      manager.registerLayer('Layer1', options)
      expect(manager.getLayerCount()).toBe(1)

      manager.registerLayer('Layer2', options)
      expect(manager.getLayerCount()).toBe(2)
    })

    it('should not increment count for duplicate layer name', () => {
      const options: LayerOptions = { name: 'TestLayer', visible: true }
      manager.registerLayer('Layer1', options)
      manager.registerLayer('Layer1', options)
      expect(manager.getLayerCount()).toBe(1)
    })
  })

  describe('clear', () => {
    it('should clear all layers and reset state', () => {
      const options: LayerOptions = { name: 'TestLayer', visible: true }
      manager.registerLayer('Layer1', options)
      manager.registerLayer('Layer2', options)
      manager.setCurrentLayer('Layer1')
      manager.addContentMarker('Layer1', 'marker')

      expect(manager.getLayerCount()).toBe(2)

      manager.clear()

      expect(manager.getLayerCount()).toBe(0)
      expect(manager.getCurrentLayer()).toBeNull()
      expect(manager.getContentMarkers('Layer1')).toHaveLength(0)
    })

    it('should reset ID counter', () => {
      const options: LayerOptions = { name: 'TestLayer', visible: true }
      manager.registerLayer('Layer1', options)
      manager.clear()

      const id = manager.registerLayer('Layer2', options)
      expect(id).toBe(1)
    })
  })
})
