import * as pako from 'pako'
import { ImageInfo, ImageFormat } from '../types'
import { ImageError, CompressionError } from '../errors'
import { PlatformFactory } from '../platform'

/**
 * ImageParser - Detects and parses image formats (JPEG, PNG)
 * Now supports both Node.js and Browser environments
 */
export class ImageParser {
  /**
   * Load and parse an image from file path, URL, File object, or Buffer
   */
  static async load(source: string | File | Buffer): Promise<ImageInfo> {
    const fs = PlatformFactory.getFileSystem()
    const buffer = await fs.readFile(source)

    // Detect format
    const format = this.detectFormat(buffer)

    // Parse based on format
    switch (format) {
      case 'JPEG':
        return this.parseJPEG(buffer)
      case 'PNG':
        return this.parsePNG(buffer)
      default:
        throw new Error(`Unsupported image format: ${format}`)
    }
  }

  /**
   * Detect image format from magic bytes
   */
  private static detectFormat(buffer: Buffer): ImageFormat {
    // JPEG: FF D8 FF
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
      return 'JPEG'
    }

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4E &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0D &&
      buffer[5] === 0x0A &&
      buffer[6] === 0x1A &&
      buffer[7] === 0x0A
    ) {
      return 'PNG'
    }

    throw new Error('Unknown image format. Only JPEG and PNG are supported.')
  }

  /**
   * Parse JPEG image
   * JPEG uses DCTDecode filter - we can embed the data directly
   */
  private static parseJPEG(buffer: Buffer): ImageInfo {
    let pos = 2 // Skip FF D8

    let width = 0
    let height = 0
    let bitsPerComponent = 8
    let colorSpace = 'DeviceRGB'

    // Scan for SOF (Start of Frame) marker
    while (pos < buffer.length) {
      // Check for marker (FF XX)
      if (buffer[pos] !== 0xFF) {
        pos++
        continue
      }

      const marker = buffer[pos + 1]
      pos += 2

      // SOF0 (Baseline DCT) - 0xC0
      // SOF1 (Extended Sequential DCT) - 0xC1
      // SOF2 (Progressive DCT) - 0xC2
      if (marker >= 0xC0 && marker <= 0xC2) {
        // Read segment length
        const length = (buffer[pos] << 8) | buffer[pos + 1]

        // Read bits per component
        bitsPerComponent = buffer[pos + 2]

        // Read height (2 bytes, big endian)
        height = (buffer[pos + 3] << 8) | buffer[pos + 4]

        // Read width (2 bytes, big endian)
        width = (buffer[pos + 5] << 8) | buffer[pos + 6]

        // Read number of components
        const components = buffer[pos + 7]

        // Determine color space
        if (components === 1) {
          colorSpace = 'DeviceGray'
        } else if (components === 3) {
          colorSpace = 'DeviceRGB'
        } else if (components === 4) {
          colorSpace = 'DeviceCMYK'
        }

        break
      }

      // For other markers, skip the segment
      if (marker !== 0xD8 && marker !== 0xD9) { // Not SOI or EOI
        const length = (buffer[pos] << 8) | buffer[pos + 1]
        pos += length
      }
    }

    if (width === 0 || height === 0) {
      throw new Error('Could not determine JPEG dimensions')
    }

    return {
      format: 'JPEG',
      width,
      height,
      colorSpace,
      bitsPerComponent,
      data: buffer,
      filter: 'DCTDecode'
    }
  }

  /**
   * Parse PNG image
   * Extract IDAT chunks and combine them for PDF embedding
   */
  private static parsePNG(buffer: Buffer): ImageInfo {
    let pos = 8 // Skip PNG signature

    let width = 0
    let height = 0
    let bitsPerComponent = 8
    let colorType = 0
    let hasAlpha = false
    let palette: Buffer | undefined
    let transparency: any = undefined
    const idatChunks: Buffer[] = []

    // Read chunks
    while (pos < buffer.length) {
      // Read chunk length (4 bytes, big endian)
      const length = buffer.readUInt32BE(pos)
      pos += 4

      // Read chunk type (4 bytes ASCII)
      const type = buffer.toString('ascii', pos, pos + 4)
      pos += 4

      // Process chunk based on type
      if (type === 'IHDR') {
        // Image Header
        width = buffer.readUInt32BE(pos)
        height = buffer.readUInt32BE(pos + 4)
        bitsPerComponent = buffer[pos + 8]
        colorType = buffer[pos + 9]

        // Determine if has alpha
        hasAlpha = colorType === 4 || colorType === 6

        pos += length
      } else if (type === 'PLTE') {
        // Palette
        palette = Buffer.from(buffer.slice(pos, pos + length))
        pos += length
      } else if (type === 'tRNS') {
        // Transparency
        transparency = Buffer.from(buffer.slice(pos, pos + length))
        pos += length
      } else if (type === 'IDAT') {
        // Image data - collect all IDAT chunks
        idatChunks.push(buffer.slice(pos, pos + length))
        pos += length
      } else {
        // Skip other chunks
        pos += length
      }

      // Read and skip CRC (4 bytes)
      pos += 4

      // Stop at IEND
      if (type === 'IEND') {
        break
      }
    }

    if (width === 0 || height === 0) {
      throw new Error('Could not determine PNG dimensions')
    }

    if (idatChunks.length === 0) {
      throw new Error('No IDAT chunks found in PNG')
    }

    // Combine all IDAT chunks
    const compressedData = Buffer.concat(idatChunks)

    // Decompress IDAT data
    let decompressed: Buffer
    try {
      decompressed = Buffer.from(pako.inflate(compressedData))
    } catch (error) {
      throw new CompressionError(
        `Failed to decompress PNG image data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      )
    }

    // Calculate bytes per pixel
    let bytesPerPixel: number
    if (colorType === 0) {
      bytesPerPixel = 1 // Grayscale
    } else if (colorType === 2) {
      bytesPerPixel = 3 // RGB
    } else if (colorType === 3) {
      bytesPerPixel = 1 // Indexed
    } else if (colorType === 4) {
      bytesPerPixel = 2 // Grayscale + Alpha
    } else if (colorType === 6) {
      bytesPerPixel = 4 // RGBA
    } else {
      bytesPerPixel = 3 // Default to RGB
    }

    // Remove PNG filters from each scanline
    const scanlineLength = width * bytesPerPixel
    const unfilteredData = Buffer.alloc(height * scanlineLength)

    for (let y = 0; y < height; y++) {
      const scanlineStart = y * (scanlineLength + 1) // +1 for filter byte
      const filterType = decompressed[scanlineStart]
      const scanline = Buffer.from(decompressed.slice(scanlineStart + 1, scanlineStart + 1 + scanlineLength))

      const prevScanline = y > 0 ? Buffer.from(unfilteredData.slice((y - 1) * scanlineLength, y * scanlineLength)) : null

      // Apply reverse filter
      const unfiltered = this.unfilterScanline(filterType, scanline, prevScanline, bytesPerPixel)
      unfiltered.copy(unfilteredData, y * scanlineLength)
    }

    // For RGBA images (colorType 6), convert to RGB by removing alpha channel
    let finalData = unfilteredData
    if (colorType === 6) {
      // Remove alpha channel: RGBA -> RGB
      const rgbData = Buffer.alloc(width * height * 3)
      for (let i = 0; i < width * height; i++) {
        rgbData[i * 3] = unfilteredData[i * 4]       // R
        rgbData[i * 3 + 1] = unfilteredData[i * 4 + 1] // G
        rgbData[i * 3 + 2] = unfilteredData[i * 4 + 2] // B
        // Skip alpha channel (unfilteredData[i * 4 + 3])
      }
      finalData = rgbData
    }

    // Compress the unfiltered data for PDF
    let pdfData: Uint8Array
    try {
      pdfData = pako.deflate(finalData)
    } catch (error) {
      throw new CompressionError(
        `Failed to compress PNG data for PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      )
    }

    // Determine color space
    let colorSpace = 'DeviceRGB'
    if (colorType === 0) {
      colorSpace = 'DeviceGray'
    } else if (colorType === 3) {
      colorSpace = 'Indexed'
    } else if (colorType === 6) {
      colorSpace = 'DeviceRGB' // RGBA converted to RGB
    }

    return {
      format: 'PNG',
      width,
      height,
      colorSpace,
      bitsPerComponent,
      data: Buffer.from(pdfData),
      filter: 'FlateDecode',
      hasAlpha,
      palette,
      transparency
    }
  }

  /**
   * Remove PNG filter from a scanline
   */
  private static unfilterScanline(
    filterType: number,
    scanline: Buffer,
    prevScanline: Buffer | null,
    bytesPerPixel: number
  ): Buffer {
    const result = Buffer.alloc(scanline.length)

    for (let i = 0; i < scanline.length; i++) {
      let x = scanline[i]
      let a = i >= bytesPerPixel ? result[i - bytesPerPixel] : 0 // Left pixel
      let b = prevScanline ? prevScanline[i] : 0 // Above pixel
      let c = prevScanline && i >= bytesPerPixel ? prevScanline[i - bytesPerPixel] : 0 // Upper left

      let value: number
      switch (filterType) {
        case 0: // None
          value = x
          break
        case 1: // Sub
          value = (x + a) & 0xFF
          break
        case 2: // Up
          value = (x + b) & 0xFF
          break
        case 3: // Average
          value = (x + Math.floor((a + b) / 2)) & 0xFF
          break
        case 4: // Paeth
          value = (x + this.paethPredictor(a, b, c)) & 0xFF
          break
        default:
          value = x
      }

      result[i] = value
    }

    return result
  }

  /**
   * Paeth predictor algorithm
   */
  private static paethPredictor(a: number, b: number, c: number): number {
    const p = a + b - c
    const pa = Math.abs(p - a)
    const pb = Math.abs(p - b)
    const pc = Math.abs(p - c)

    if (pa <= pb && pa <= pc) {
      return a
    } else if (pb <= pc) {
      return b
    } else {
      return c
    }
  }
}
