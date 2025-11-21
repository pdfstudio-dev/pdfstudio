import { ImageInfo } from '../../types'

/**
 * ImageManager - Manages embedded images in PDF documents
 *
 * Responsibilities:
 * - Register and track images
 * - Generate unique image IDs
 * - Store image information and metadata
 * - Prevent duplicate image embeddings
 */
export class ImageManager {
  private images: Map<string, { info: ImageInfo; id: number }> = new Map()
  private nextImageId: number = 1

  /**
   * Register an image and get its ID
   * If the image is already registered (same hash), returns existing ID
   */
  registerImage(hash: string, info: ImageInfo): number {
    const existing = this.images.get(hash)
    if (existing) {
      return existing.id
    }

    const id = this.nextImageId++
    this.images.set(hash, { info, id })
    return id
  }

  /**
   * Get image info by hash
   */
  getImage(hash: string): { info: ImageInfo; id: number } | undefined {
    return this.images.get(hash)
  }

  /**
   * Get all registered images
   */
  getAllImages(): Map<string, { info: ImageInfo; id: number }> {
    return this.images
  }

  /**
   * Check if an image is already registered
   */
  hasImage(hash: string): boolean {
    return this.images.has(hash)
  }

  /**
   * Get the next available image ID (for internal use)
   */
  getNextImageId(): number {
    return this.nextImageId
  }

  /**
   * Get total number of registered images
   */
  getImageCount(): number {
    return this.images.size
  }

  /**
   * Clear all registered images (for testing/reset)
   */
  clear(): void {
    this.images.clear()
    this.nextImageId = 1
  }
}
