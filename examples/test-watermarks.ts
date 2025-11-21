import { PDFDocument } from '../src/core/PDFDocument'
import * as path from 'path'
import * as fs from 'fs'

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'output')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

/**
 * Example 1: Simple centered text watermark
 */
function example1() {
  console.log('Generating Example 1: Simple centered text watermark...')

  const doc = new PDFDocument()

  // Add content
  doc.text('Invoice #12345', 100, 700, 24)
  doc.text('Date: January 15, 2025', 100, 670, 12)
  doc.text('Total: $1,250.00', 100, 650, 12)

  // Add simple centered watermark
  doc.addTextWatermark({
    text: 'DRAFT',
    position: 'center',
    opacity: 0.2,
    fontSize: 80,
    color: [0.5, 0.5, 0.5]
  })

  doc.save(path.join(outputDir, 'watermark-1-simple-center.pdf'))
  console.log('  > Saved: watermark-1-simple-center.pdf')
}

/**
 * Example 2: Diagonal text watermark
 */
function example2() {
  console.log('Generating Example 2: Diagonal text watermark...')

  const doc = new PDFDocument()

  // Add content
  doc.text('Confidential Document', 100, 700, 20)
  doc.text('This document contains proprietary information.', 100, 670, 12)
  doc.text('Do not distribute without authorization.', 100, 650, 12)

  // Add diagonal watermark
  doc.addTextWatermark({
    text: 'CONFIDENTIAL',
    position: 'diagonal',
    rotation: 45,
    opacity: 0.15,
    fontSize: 72,
    color: [0.8, 0, 0]
  })

  doc.save(path.join(outputDir, 'watermark-2-diagonal.pdf'))
  console.log('  > Saved: watermark-2-diagonal.pdf')
}

/**
 * Example 3: Multiple position watermarks
 */
function example3() {
  console.log('Generating Example 3: Multiple position watermarks...')

  const doc = new PDFDocument()

  // Add content
  doc.text('Multi-Watermark Demo', 100, 700, 20)
  doc.text('This page shows watermarks in different positions.', 100, 670, 12)

  // Top-left watermark
  doc.addTextWatermark({
    text: 'TOP LEFT',
    position: 'top-left',
    opacity: 0.3,
    fontSize: 24,
    color: [0, 0, 0.8]
  })

  // Top-right watermark
  doc.addTextWatermark({
    text: 'TOP RIGHT',
    position: 'top-right',
    opacity: 0.3,
    fontSize: 24,
    color: [0, 0.8, 0]
  })

  // Bottom-center watermark
  doc.addTextWatermark({
    text: 'BOTTOM CENTER',
    position: 'bottom-center',
    opacity: 0.3,
    fontSize: 24,
    color: [0.8, 0, 0]
  })

  doc.save(path.join(outputDir, 'watermark-3-multiple-positions.pdf'))
  console.log('  > Saved: watermark-3-multiple-positions.pdf')
}

/**
 * Example 4: Rotated text watermark
 */
function example4() {
  console.log('Generating Example 4: Rotated text watermark...')

  const doc = new PDFDocument()

  // Add content
  doc.text('Rotation Demo', 100, 700, 20)
  doc.text('Watermark rotated 315 degrees (-45 degrees).', 100, 670, 12)

  // Rotated watermark
  doc.addTextWatermark({
    text: 'SAMPLE',
    position: 'center',
    rotation: 315,
    opacity: 0.25,
    fontSize: 96,
    font: 'Helvetica-Bold',
    color: [0.2, 0.2, 0.8]
  })

  doc.save(path.join(outputDir, 'watermark-4-rotated.pdf'))
  console.log('  > Saved: watermark-4-rotated.pdf')
}

/**
 * Example 5: Very subtle watermark (high transparency)
 */
function example5() {
  console.log('Generating Example 5: Subtle watermark (high transparency)...')

  const doc = new PDFDocument()

  // Add content
  doc.text('Contract Agreement', 100, 700, 20)
  doc.text('This agreement is made between Party A and Party B.', 100, 670, 12)
  doc.text('Terms and conditions apply.', 100, 650, 12)

  // Very subtle watermark
  doc.addTextWatermark({
    text: 'COPY',
    position: 'center',
    opacity: 0.05,
    fontSize: 120,
    color: [0, 0, 0]
  })

  doc.save(path.join(outputDir, 'watermark-5-subtle.pdf'))
  console.log('  > Saved: watermark-5-subtle.pdf')
}

/**
 * Example 6: Image watermark (company logo)
 */
function example6() {
  console.log('Generating Example 6: Image watermark...')

  const doc = new PDFDocument()

  // Add content
  doc.text('Official Document', 100, 700, 20)
  doc.text('This document is certified by our organization.', 100, 670, 12)

  // Image watermark (using placeholder - in real use, provide actual image path)
  // For this demo, we'll use a text watermark styled like a logo
  doc.addTextWatermark({
    text: 'LOGO',
    position: 'center',
    opacity: 0.1,
    fontSize: 150,
    font: 'Helvetica-Bold',
    color: [0, 0, 0]
  })

  doc.save(path.join(outputDir, 'watermark-6-image-style.pdf'))
  console.log('  > Saved: watermark-6-image-style.pdf')
  console.log('  > Note: For real image watermarks, use addImageWatermark({ source: "path/to/logo.png", ... })')
}

/**
 * Example 7: Watermark on specific pages only
 */
function example7() {
  console.log('Generating Example 7: Watermark on specific pages only...')

  const doc = new PDFDocument()

  // Page 1
  doc.text('Page 1 - No Watermark', 100, 700, 20)
  doc.text('This page does not have a watermark.', 100, 670, 12)

  // Page 2
  doc.addPage()
  doc.text('Page 2 - With Watermark', 100, 700, 20)
  doc.text('This page has a DRAFT watermark.', 100, 670, 12)

  // Page 3
  doc.addPage()
  doc.text('Page 3 - With Watermark', 100, 700, 20)
  doc.text('This page also has a DRAFT watermark.', 100, 670, 12)

  // Add watermark only to pages 1 and 2 (0-indexed)
  doc.addTextWatermark({
    text: 'DRAFT',
    pages: [1, 2],
    position: 'center',
    opacity: 0.2,
    fontSize: 80,
    color: [0.5, 0.5, 0.5]
  })

  doc.save(path.join(outputDir, 'watermark-7-specific-pages.pdf'))
  console.log('  > Saved: watermark-7-specific-pages.pdf')
}

/**
 * Example 8: Background vs foreground layers
 */
function example8() {
  console.log('Generating Example 8: Background vs foreground layers...')

  const doc = new PDFDocument()

  // Draw a colored rectangle
  doc.setFillColor(1, 0.9, 0.9)
  doc.rect(50, 500, 500, 200)
  doc.fill()

  // Add text
  doc.text('Layer Comparison', 100, 700, 20)
  doc.text('Background watermark appears BEHIND this colored box.', 100, 650, 12)
  doc.text('Foreground watermark appears IN FRONT of this colored box.', 100, 550, 12)

  // Background watermark (will appear behind the red rectangle)
  doc.addTextWatermark({
    text: 'BACKGROUND',
    position: 'center',
    opacity: 0.3,
    fontSize: 60,
    layer: 'background',
    color: [0, 0, 0.8]
  })

  // Add second page with foreground watermark
  doc.addPage()

  // Draw the same colored rectangle
  doc.setFillColor(1, 0.9, 0.9)
  doc.rect(50, 500, 500, 200)
  doc.fill()

  doc.text('Layer Comparison - Page 2', 100, 700, 20)
  doc.text('This watermark is on the foreground layer.', 100, 650, 12)

  // Foreground watermark (will appear in front of the red rectangle)
  doc.addTextWatermark({
    text: 'FOREGROUND',
    pages: [1],
    position: 'center',
    opacity: 0.3,
    fontSize: 60,
    layer: 'foreground',
    color: [0.8, 0, 0]
  })

  doc.save(path.join(outputDir, 'watermark-8-layers.pdf'))
  console.log('  > Saved: watermark-8-layers.pdf')
}

/**
 * Example 9: Different fonts and colors
 */
function example9() {
  console.log('Generating Example 9: Different fonts and colors...')

  const doc = new PDFDocument()

  // Add content
  doc.text('Typography Demo', 100, 700, 20)
  doc.text('Watermarks with different fonts and colors.', 100, 670, 12)

  // Helvetica watermark
  doc.addTextWatermark({
    text: 'Helvetica',
    position: 'top-center',
    opacity: 0.3,
    fontSize: 36,
    font: 'Helvetica',
    color: [0, 0, 1]
  })

  // Times-Roman watermark
  doc.addTextWatermark({
    text: 'Times-Roman',
    position: 'center',
    opacity: 0.3,
    fontSize: 36,
    font: 'Times-Roman',
    color: [1, 0, 0]
  })

  // Courier watermark
  doc.addTextWatermark({
    text: 'Courier',
    position: 'bottom-center',
    opacity: 0.3,
    fontSize: 36,
    font: 'Courier',
    color: [0, 0.5, 0]
  })

  doc.save(path.join(outputDir, 'watermark-9-fonts-colors.pdf'))
  console.log('  > Saved: watermark-9-fonts-colors.pdf')
}

/**
 * Example 10: Custom position watermark
 */
function example10() {
  console.log('Generating Example 10: Custom position watermark...')

  const doc = new PDFDocument()

  // Add content
  doc.text('Custom Position Demo', 100, 700, 20)
  doc.text('Watermark positioned at exact coordinates.', 100, 670, 12)

  // Custom positioned watermark
  doc.addTextWatermark({
    text: 'CUSTOM',
    position: 'custom',
    x: 200,
    y: 400,
    opacity: 0.3,
    fontSize: 48,
    rotation: 15,
    color: [0.5, 0, 0.5]
  })

  doc.save(path.join(outputDir, 'watermark-10-custom-position.pdf'))
  console.log('  > Saved: watermark-10-custom-position.pdf')
}

// Run all examples
console.log('\n=== PDFStudio Watermark Examples ===\n')

example1()
example2()
example3()
example4()
example5()
example6()
example7()
example8()
example9()
example10()

console.log('\n=== All watermark examples generated successfully! ===')
console.log(`Output directory: ${outputDir}\n`)
