/**
 * IImageProcessor - Abstract interface for image processing
 * Replaces sharp library with cross-platform implementation
 */
export interface ImageMetadata {
  width?: number
  height?: number
  format?: string
  channels?: number
}

export interface ResizeOptions {
  width?: number
  height?: number
  fit?: 'contain' | 'cover' | 'fill'
  background?: { r: number; g: number; b: number; alpha: number }
}

export interface CompositeOptions {
  input: Buffer
  top: number
  left: number
  blend?: 'over' | 'dest-in' | 'dest-out'
}

export interface CreateImageOptions {
  width: number
  height: number
  channels: 3 | 4
  background: { r: number; g: number; b: number; alpha: number }
}

export interface IImageProcessor {
  /**
   * Load image from buffer
   */
  load(buffer: Buffer): IImageInstance

  /**
   * Create new blank image
   */
  create(options: CreateImageOptions): IImageInstance
}

/**
 * Chainable image instance (like sharp)
 */
export interface IImageInstance {
  /**
   * Get image metadata
   */
  metadata(): Promise<ImageMetadata>

  /**
   * Resize image
   */
  resize(width: number, height: number, options?: ResizeOptions): IImageInstance

  /**
   * Composite images together
   */
  composite(composites: CompositeOptions[]): IImageInstance

  /**
   * Convert to PNG
   */
  png(): IImageInstance

  /**
   * Get buffer
   */
  toBuffer(): Promise<Buffer>
}
