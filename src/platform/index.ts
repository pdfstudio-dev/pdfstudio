/**
 * Platform abstraction layer - exports all interfaces and factory
 */
export { IFileSystem } from './interfaces/IFileSystem'
export {
  IImageProcessor,
  IImageInstance,
  ImageMetadata,
  ResizeOptions,
  CompositeOptions,
  CreateImageOptions
} from './interfaces/IImageProcessor'

export { PlatformFactory } from './PlatformFactory'
