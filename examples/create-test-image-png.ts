/**
 * Crea una imagen PNG simple de prueba válida
 */
import * as fs from 'fs'
import * as pako from 'pako'

function createSimplePNG(width: number, height: number, r: number, g: number, b: number): Buffer {
  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  // IHDR chunk
  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(width, 0)
  ihdrData.writeUInt32BE(height, 4)
  ihdrData.writeUInt8(8, 8)  // Bit depth
  ihdrData.writeUInt8(2, 9)  // Color type (2 = RGB)
  ihdrData.writeUInt8(0, 10) // Compression
  ihdrData.writeUInt8(0, 11) // Filter
  ihdrData.writeUInt8(0, 12) // Interlace

  const ihdr = createChunk('IHDR', ihdrData)

  // IDAT chunk (image data)
  const bytesPerPixel = 3 // RGB
  const scanlineBytes = width * bytesPerPixel + 1 // +1 for filter byte
  const rawData = Buffer.alloc(height * scanlineBytes)

  for (let y = 0; y < height; y++) {
    const scanlineStart = y * scanlineBytes
    rawData[scanlineStart] = 0 // Filter type: None

    for (let x = 0; x < width; x++) {
      const pixelStart = scanlineStart + 1 + x * bytesPerPixel
      rawData[pixelStart] = r
      rawData[pixelStart + 1] = g
      rawData[pixelStart + 2] = b
    }
  }

  const compressedData = pako.deflate(rawData)
  const idat = createChunk('IDAT', Buffer.from(compressedData))

  // IEND chunk
  const iend = createChunk('IEND', Buffer.alloc(0))

  // Combine all chunks
  return Buffer.concat([signature, ihdr, idat, iend])
}

function createChunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length, 0)

  const typeBuffer = Buffer.from(type, 'ascii')

  const crc = calculateCRC(Buffer.concat([typeBuffer, data]))
  const crcBuffer = Buffer.alloc(4)
  crcBuffer.writeUInt32BE(crc, 0)

  return Buffer.concat([length, typeBuffer, data, crcBuffer])
}

function calculateCRC(buffer: Buffer): number {
  let crc = 0xFFFFFFFF

  for (let i = 0; i < buffer.length; i++) {
    crc = crc ^ buffer[i]
    for (let j = 0; j < 8; j++) {
      if (crc & 1) {
        crc = (crc >>> 1) ^ 0xEDB88320
      } else {
        crc = crc >>> 1
      }
    }
  }

  return (crc ^ 0xFFFFFFFF) >>> 0
}

// Create test images
console.log('🎨 Creating valid test images...\\n')

// 1. Blue square 200x200
const blueImage = createSimplePNG(200, 200, 51, 102, 204)
fs.writeFileSync('examples/test-image.png', blueImage)
console.log('✅ examples/test-image.png (200x200, blue)')

// 2. Red rectangle 400x200
const redImage = createSimplePNG(400, 200, 220, 53, 69)
fs.writeFileSync('examples/test-image-red.png', redImage)
console.log('✅ examples/test-image-red.png (400x200, red)')

// 3. Green rectangle 300x300
const greenImage = createSimplePNG(300, 300, 46, 184, 92)
fs.writeFileSync('examples/test-image-green.png', greenImage)
console.log('✅ examples/test-image-green.png (300x300, green)')

// 4. Small 100x100 for thumbnails
const smallImage = createSimplePNG(100, 100, 255, 165, 0)
fs.writeFileSync('examples/test-image-small.png', smallImage)
console.log('✅ examples/test-image-small.png (100x100, naranja)')

console.log('\\n✨ Imágenes PNG válidas creadas correctamente')
