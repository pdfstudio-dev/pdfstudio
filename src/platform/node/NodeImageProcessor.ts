import sharp from 'sharp'
import {
  IImageProcessor,
  IImageInstance,
  ImageMetadata,
  ResizeOptions,
  CompositeOptions,
  CreateImageOptions
} from '../interfaces/IImageProcessor'

/**
 * NodeImageProcessor - Node.js implementation using sharp
 */
export class NodeImageProcessor implements IImageProcessor {
  load(buffer: Buffer): IImageInstance {
    return new NodeImageInstance(sharp(buffer))
  }

  create(options: CreateImageOptions): IImageInstance {
    const sharpInstance = sharp({
      create: {
        width: options.width,
        height: options.height,
        channels: options.channels,
        background: options.background
      }
    })
    return new NodeImageInstance(sharpInstance)
  }
}

/**
 * NodeImageInstance - Wraps sharp instance
 */
class NodeImageInstance implements IImageInstance {
  constructor(private sharp: sharp.Sharp) {}

  async metadata(): Promise<ImageMetadata> {
    return await this.sharp.metadata()
  }

  resize(width: number, height: number, options?: ResizeOptions): IImageInstance {
    this.sharp = this.sharp.resize(width, height, options)
    return this
  }

  composite(composites: CompositeOptions[]): IImageInstance {
    // Map our composite options to sharp's format
    const sharpComposites = composites.map(c => ({
      input: c.input,
      top: c.top,
      left: c.left,
      blend: c.blend as any
    }))
    this.sharp = this.sharp.composite(sharpComposites)
    return this
  }

  png(): IImageInstance {
    this.sharp = this.sharp.png()
    return this
  }

  async toBuffer(): Promise<Buffer> {
    return await this.sharp.toBuffer()
  }
}
