import {
  IImageProcessor,
  IImageInstance,
  ImageMetadata,
  ResizeOptions,
  CompositeOptions,
  CreateImageOptions
} from '../interfaces/IImageProcessor'

/**
 * BrowserImageProcessor - Browser implementation using Canvas API
 */
export class BrowserImageProcessor implements IImageProcessor {
  load(buffer: Buffer): IImageInstance {
    return new BrowserImageInstance(buffer)
  }

  create(options: CreateImageOptions): IImageInstance {
    return BrowserImageInstance.createBlank(options)
  }
}

/**
 * BrowserImageInstance - Uses Canvas API for image processing
 */
class BrowserImageInstance implements IImageInstance {
  private canvas: HTMLCanvasElement | OffscreenCanvas
  private ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
  private imageData: ImageData | null = null
  private loadPromise: Promise<void>

  constructor(buffer: Buffer) {
    // Use OffscreenCanvas if available (better performance)
    const useOffscreen = typeof OffscreenCanvas !== 'undefined'

    this.canvas = useOffscreen
      ? new OffscreenCanvas(1, 1)
      : document.createElement('canvas')

    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D

    // Load image from buffer
    this.loadPromise = this.loadImageFromBuffer(buffer)
  }

  static createBlank(options: CreateImageOptions): BrowserImageInstance {
    const instance = new BrowserImageInstance(Buffer.alloc(0))

    // Override loadPromise to create blank image
    instance.loadPromise = (async () => {
      const useOffscreen = typeof OffscreenCanvas !== 'undefined'

      instance.canvas = useOffscreen
        ? new OffscreenCanvas(options.width, options.height)
        : document.createElement('canvas')

      instance.canvas.width = options.width
      instance.canvas.height = options.height
      instance.ctx = instance.canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D

      // Fill with background color
      const { r, g, b, alpha } = options.background
      const ctx = instance.ctx as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
      ctx.fillRect(0, 0, options.width, options.height)

      instance.imageData = instance.ctx.getImageData(0, 0, options.width, options.height)
    })()

    return instance
  }

  private async loadImageFromBuffer(buffer: Buffer): Promise<void> {
    // Create blob from buffer
    const blob = new Blob([new Uint8Array(buffer)])
    const url = URL.createObjectURL(blob)

    try {
      // Load image
      const img = await this.loadImage(url)

      // Set canvas size
      this.canvas.width = img.width
      this.canvas.height = img.height

      // Draw image
      this.ctx.drawImage(img, 0, 0)

      // Store image data
      this.imageData = this.ctx.getImageData(0, 0, img.width, img.height)
    } finally {
      URL.revokeObjectURL(url)
    }
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = url
    })
  }

  async metadata(): Promise<ImageMetadata> {
    await this.loadPromise
    return {
      width: this.canvas.width,
      height: this.canvas.height,
      format: 'png'
    }
  }

  resize(width: number, height: number, options?: ResizeOptions): IImageInstance {
    // Chain operation - will be executed on toBuffer()
    const oldLoadPromise = this.loadPromise

    this.loadPromise = (async () => {
      await oldLoadPromise

      const oldCanvas = this.canvas
      const oldWidth = oldCanvas.width
      const oldHeight = oldCanvas.height

      // Calculate dimensions based on fit option
      let targetWidth = width
      let targetHeight = height

      if (options?.fit === 'contain') {
        const scale = Math.min(width / oldWidth, height / oldHeight)
        targetWidth = Math.floor(oldWidth * scale)
        targetHeight = Math.floor(oldHeight * scale)
      }

      // Create new canvas
      const useOffscreen = typeof OffscreenCanvas !== 'undefined'
      const newCanvas = useOffscreen
        ? new OffscreenCanvas(targetWidth, targetHeight)
        : document.createElement('canvas')

      newCanvas.width = targetWidth
      newCanvas.height = targetHeight

      const newCtx = newCanvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D

      // Fill background if specified
      if (options?.background) {
        const { r, g, b, alpha } = options.background
        newCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
        newCtx.fillRect(0, 0, targetWidth, targetHeight)
      }

      // Draw resized image
      newCtx.drawImage(oldCanvas as any, 0, 0, targetWidth, targetHeight)

      this.canvas = newCanvas
      this.ctx = newCtx
      this.imageData = newCtx.getImageData(0, 0, targetWidth, targetHeight)
    })()

    return this
  }

  composite(composites: CompositeOptions[]): IImageInstance {
    const oldLoadPromise = this.loadPromise

    this.loadPromise = (async () => {
      await oldLoadPromise

      for (const comp of composites) {
        // Load composite image
        const blob = new Blob([new Uint8Array(comp.input)])
        const url = URL.createObjectURL(blob)

        try {
          const img = await this.loadImage(url)

          // Set blend mode
          if (comp.blend === 'dest-in') {
            this.ctx.globalCompositeOperation = 'destination-in'
          } else if (comp.blend === 'dest-out') {
            this.ctx.globalCompositeOperation = 'destination-out'
          } else {
            this.ctx.globalCompositeOperation = 'source-over'
          }

          // Draw composite
          this.ctx.drawImage(img, comp.left, comp.top)

          // Reset blend mode
          this.ctx.globalCompositeOperation = 'source-over'
        } finally {
          URL.revokeObjectURL(url)
        }
      }

      this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    })()

    return this
  }

  png(): IImageInstance {
    // PNG is the default format for canvas, so this is a no-op
    return this
  }

  async toBuffer(): Promise<Buffer> {
    await this.loadPromise

    // Convert canvas to blob
    let blob: Blob

    if ('convertToBlob' in this.canvas) {
      // OffscreenCanvas
      blob = await (this.canvas as OffscreenCanvas).convertToBlob({ type: 'image/png' })
    } else {
      // Regular canvas
      blob = await new Promise<Blob>((resolve, reject) => {
        (this.canvas as HTMLCanvasElement).toBlob(
          (b) => b ? resolve(b) : reject(new Error('Failed to convert canvas to blob')),
          'image/png'
        )
      })
    }

    // Convert blob to buffer
    const arrayBuffer = await blob.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }
}
