import { LayerOptions } from '../../types'

/**
 * LayerManager - Manages PDF Optional Content Groups (Layers)
 *
 * Responsibilities:
 * - Register and track layers
 * - Generate unique layer IDs
 * - Manage current active layer
 * - Track content markers for layers
 */
export class LayerManager {
  private layers: Map<string, { id: number; options: LayerOptions }> = new Map()
  private nextLayerId: number = 1
  private currentLayer: string | null = null
  private layerContentMarkers: Map<string, string[]> = new Map()

  /**
   * Register a layer and get its ID
   */
  registerLayer(name: string, options: LayerOptions): number {
    const existing = this.layers.get(name)
    if (existing) {
      return existing.id
    }

    const id = this.nextLayerId++
    this.layers.set(name, { id, options })
    this.layerContentMarkers.set(name, [])
    return id
  }

  /**
   * Get layer by name
   */
  getLayer(name: string): { id: number; options: LayerOptions } | undefined {
    return this.layers.get(name)
  }

  /**
   * Get all registered layers
   */
  getAllLayers(): Map<string, { id: number; options: LayerOptions }> {
    return this.layers
  }

  /**
   * Set the current active layer
   */
  setCurrentLayer(name: string | null): void {
    this.currentLayer = name
  }

  /**
   * Get the current active layer name
   */
  getCurrentLayer(): string | null {
    return this.currentLayer
  }

  /**
   * Add a content marker for a layer
   */
  addContentMarker(layerName: string, marker: string): void {
    const markers = this.layerContentMarkers.get(layerName)
    if (markers) {
      markers.push(marker)
    }
  }

  /**
   * Get content markers for a layer
   */
  getContentMarkers(layerName: string): string[] {
    return this.layerContentMarkers.get(layerName) || []
  }

  /**
   * Check if a layer exists
   */
  hasLayer(name: string): boolean {
    return this.layers.has(name)
  }

  /**
   * Get total number of layers
   */
  getLayerCount(): number {
    return this.layers.size
  }

  /**
   * Clear all layers (for testing/reset)
   */
  clear(): void {
    this.layers.clear()
    this.layerContentMarkers.clear()
    this.currentLayer = null
    this.nextLayerId = 1
  }
}
