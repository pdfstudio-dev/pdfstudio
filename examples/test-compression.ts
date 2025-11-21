import { PDFDocument } from '../src/core/PDFDocument'
import * as path from 'path'
import * as fs from 'fs'

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'output')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

/**
 * Helper function to add lots of content to a page
 */
function addLotsOfContent(doc: PDFDocument) {
  doc.text('Compression Test Document', 100, 750, 24)
  doc.text('This document contains lots of repeated content to test compression.', 100, 720, 12)

  // Add lots of repeated text to create compressible content
  for (let i = 0; i < 50; i++) {
    const y = 680 - (i * 12)
    if (y < 50) break
    doc.text(`Line ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`, 100, y, 10)
  }
}

/**
 * Helper function to get file size
 */
function getFileSize(filePath: string): number {
  const stats = fs.statSync(filePath)
  return stats.size
}

/**
 * Helper function to format bytes
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/**
 * Example 1: No compression
 */
function example1() {
  console.log('Generating Example 1: No compression...')

  const doc = new PDFDocument({
    compression: {
      compressStreams: false
    }
  })

  addLotsOfContent(doc)

  const filePath = path.join(outputDir, 'compression-1-none.pdf')
  doc.save(filePath)

  const size = getFileSize(filePath)
  console.log(`  > Saved: compression-1-none.pdf (${formatBytes(size)})`)
  return size
}

/**
 * Example 2: Low compression (level 1)
 */
function example2() {
  console.log('Generating Example 2: Low compression (level 1)...')

  const doc = new PDFDocument({
    compression: {
      compressStreams: true,
      compressionLevel: 1
    }
  })

  addLotsOfContent(doc)

  const filePath = path.join(outputDir, 'compression-2-low.pdf')
  doc.save(filePath)

  const size = getFileSize(filePath)
  console.log(`  > Saved: compression-2-low.pdf (${formatBytes(size)})`)
  return size
}

/**
 * Example 3: Medium compression (level 6, default)
 */
function example3() {
  console.log('Generating Example 3: Medium compression (level 6, default)...')

  const doc = new PDFDocument({
    compression: {
      compressStreams: true,
      compressionLevel: 6
    }
  })

  addLotsOfContent(doc)

  const filePath = path.join(outputDir, 'compression-3-medium.pdf')
  doc.save(filePath)

  const size = getFileSize(filePath)
  console.log(`  > Saved: compression-3-medium.pdf (${formatBytes(size)})`)
  return size
}

/**
 * Example 4: Maximum compression (level 9)
 */
function example4() {
  console.log('Generating Example 4: Maximum compression (level 9)...')

  const doc = new PDFDocument({
    compression: {
      compressStreams: true,
      compressionLevel: 9
    }
  })

  addLotsOfContent(doc)

  const filePath = path.join(outputDir, 'compression-4-maximum.pdf')
  doc.save(filePath)

  const size = getFileSize(filePath)
  console.log(`  > Saved: compression-4-maximum.pdf (${formatBytes(size)})`)
  return size
}

/**
 * Example 5: Default compression (no options specified)
 */
function example5() {
  console.log('Generating Example 5: Default compression...')

  const doc = new PDFDocument()

  addLotsOfContent(doc)

  const filePath = path.join(outputDir, 'compression-5-default.pdf')
  doc.save(filePath)

  const size = getFileSize(filePath)
  console.log(`  > Saved: compression-5-default.pdf (${formatBytes(size)})`)
  return size
}

/**
 * Example 6: Large document with lots of pages
 */
function example6() {
  console.log('Generating Example 6: Large document with maximum compression...')

  const doc = new PDFDocument({
    compression: {
      compressStreams: true,
      compressionLevel: 9
    }
  })

  // Create 10 pages with lots of content
  for (let page = 1; page <= 10; page++) {
    if (page > 1) doc.addPage()

    doc.text(`Page ${page} of 10`, 100, 750, 24)
    doc.text('Large Document Compression Test', 100, 720, 14)

    // Add lots of content to each page
    for (let i = 0; i < 45; i++) {
      const y = 680 - (i * 12)
      if (y < 50) break
      doc.text(`P${page} Line ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.`, 100, y, 10)
    }
  }

  const filePath = path.join(outputDir, 'compression-6-large-doc.pdf')
  doc.save(filePath)

  const size = getFileSize(filePath)
  console.log(`  > Saved: compression-6-large-doc.pdf (${formatBytes(size)})`)
  return size
}

/**
 * Example 7: Comparison document
 */
function example7() {
  console.log('Generating Example 7: Compression comparison document...')

  const doc = new PDFDocument({
    compression: {
      compressStreams: true,
      compressionLevel: 9
    }
  })

  doc.text('Compression Comparison Results', 100, 750, 24)
  doc.text('PDFStudio Compression & Optimization', 100, 720, 14)

  doc.text('This document summarizes compression effectiveness:', 100, 680, 12)
  doc.text('Different compression levels were tested on identical content.', 100, 660, 11)

  doc.text('Compression Levels:', 100, 630, 14)
  doc.text('- Level 0: No compression (stores raw data)', 120, 610, 11)
  doc.text('- Level 1: Fastest compression, larger files', 120, 590, 11)
  doc.text('- Level 6: Balanced (default), good compression/speed', 120, 570, 11)
  doc.text('- Level 9: Maximum compression, slower but smallest', 120, 550, 11)

  doc.text('Benefits:', 100, 520, 14)
  doc.text('- Reduced file size (typically 50-90% smaller)', 120, 500, 11)
  doc.text('- Faster network transfers', 120, 480, 11)
  doc.text('- Less storage space required', 120, 460, 11)
  doc.text('- Better for email attachments and web delivery', 120, 440, 11)

  doc.text('Note: PDF viewers automatically decompress content on-the-fly.', 100, 410, 11)
  doc.text('Users see no difference - only file size is affected.', 100, 390, 11)

  const filePath = path.join(outputDir, 'compression-7-comparison.pdf')
  doc.save(filePath)

  const size = getFileSize(filePath)
  console.log(`  > Saved: compression-7-comparison.pdf (${formatBytes(size)})`)
  return size
}

// Run all examples and show comparison
console.log('\n=== PDFStudio Compression Examples ===\n')

const size1 = example1()
const size2 = example2()
const size3 = example3()
const size4 = example4()
const size5 = example5()
const size6 = example6()
const size7 = example7()

console.log('\n=== Compression Comparison ===\n')
console.log('Single Page Documents:')
console.log(`  No compression:     ${formatBytes(size1)} (baseline)`)
console.log(`  Low (level 1):      ${formatBytes(size2)} (${((1 - size2/size1) * 100).toFixed(1)}% smaller)`)
console.log(`  Medium (level 6):   ${formatBytes(size3)} (${((1 - size3/size1) * 100).toFixed(1)}% smaller)`)
console.log(`  Maximum (level 9):  ${formatBytes(size4)} (${((1 - size4/size1) * 100).toFixed(1)}% smaller)`)
console.log(`  Default:            ${formatBytes(size5)} (${((1 - size5/size1) * 100).toFixed(1)}% smaller)`)

console.log('\nMulti-Page Documents:')
console.log(`  10 pages (max):     ${formatBytes(size6)}`)
console.log(`  Comparison doc:     ${formatBytes(size7)}`)

console.log('\n=== All compression examples generated successfully! ===')
console.log(`Output directory: ${outputDir}\n`)
