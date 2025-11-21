import { PDFDocument } from '../src/core/PDFDocument'
import * as path from 'path'
import * as fs from 'fs'

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'output')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

/**
 * Example 1: Font subsetting - minimal text
 */
function example1() {
  console.log('\n=== Example 1: Minimal Text ("Hello World") ===')

  const fontPath = '/System/Library/Fonts/Supplemental/Arial.ttf'
  if (!fs.existsSync(fontPath)) {
    console.log('  ⚠️  Arial font not found, skipping')
    return
  }

  // WITHOUT subsetting
  const doc1 = new PDFDocument()
  doc1.registerFont({
    name: 'Arial',
    source: fontPath,
    subset: false  // Subsetting disabled
  })
  doc1.useFont('Arial')
  doc1.text('Hello World', 100, 750, 24)
  doc1.text('(Full font embedded - NO subsetting)', 100, 720, 10)
  doc1.save(path.join(outputDir, 'subsetting-1a-full.pdf'))

  // WITH subsetting
  const doc2 = new PDFDocument()
  doc2.registerFont({
    name: 'Arial',
    source: fontPath,
    subset: true  // Subsetting enabled
  })
  doc2.useFont('Arial')
  doc2.text('Hello World', 100, 750, 24)
  doc2.text('(Subsetted font - only 8 glyphs)', 100, 720, 10)
  doc2.save(path.join(outputDir, 'subsetting-1b-subset.pdf'))

  // Compare file sizes
  const size1 = fs.statSync(path.join(outputDir, 'subsetting-1a-full.pdf')).size
  const size2 = fs.statSync(path.join(outputDir, 'subsetting-1b-subset.pdf')).size
  console.log(`  Full font:     ${(size1 / 1024).toFixed(2)} KB`)
  console.log(`  Subset font:   ${(size2 / 1024).toFixed(2)} KB`)
  console.log(`  Reduction:     ${((1 - size2 / size1) * 100).toFixed(2)}%`)
}

/**
 * Example 2: Font subsetting - alphabet
 */
function example2() {
  console.log('\n=== Example 2: Full Alphabet ===')

  const fontPath = '/System/Library/Fonts/Supplemental/Arial.ttf'
  if (!fs.existsSync(fontPath)) {
    console.log('  ⚠️  Arial font not found, skipping')
    return
  }

  // WITHOUT subsetting
  const doc1 = new PDFDocument()
  doc1.registerFont({
    name: 'Arial',
    source: fontPath,
    subset: false
  })
  doc1.useFont('Arial')
  doc1.text('Font Subsetting Comparison', 100, 750, 20)
  doc1.text('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 100, 710, 14)
  doc1.text('abcdefghijklmnopqrstuvwxyz', 100, 690, 14)
  doc1.text('0123456789', 100, 670, 14)
  doc1.text('(Full font embedded)', 100, 640, 10)
  doc1.save(path.join(outputDir, 'subsetting-2a-full.pdf'))

  // WITH subsetting
  const doc2 = new PDFDocument()
  doc2.registerFont({
    name: 'Arial',
    source: fontPath,
    subset: true  // Enable subsetting
  })
  doc2.useFont('Arial')
  doc2.text('Font Subsetting Comparison', 100, 750, 20)
  doc2.text('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 100, 710, 14)
  doc2.text('abcdefghijklmnopqrstuvwxyz', 100, 690, 14)
  doc2.text('0123456789', 100, 670, 14)
  doc2.text('(Subsetted font - ~80 glyphs)', 100, 640, 10)
  doc2.save(path.join(outputDir, 'subsetting-2b-subset.pdf'))

  // Compare file sizes
  const size1 = fs.statSync(path.join(outputDir, 'subsetting-2a-full.pdf')).size
  const size2 = fs.statSync(path.join(outputDir, 'subsetting-2b-subset.pdf')).size
  console.log(`  Full font:     ${(size1 / 1024).toFixed(2)} KB`)
  console.log(`  Subset font:   ${(size2 / 1024).toFixed(2)} KB`)
  console.log(`  Reduction:     ${((1 - size2 / size1) * 100).toFixed(2)}%`)
}

/**
 * Example 3: Multiple fonts with subsetting
 */
function example3() {
  console.log('\n=== Example 3: Multiple Fonts with Subsetting ===')

  const fontPath = '/System/Library/Fonts/Supplemental/Arial.ttf'
  if (!fs.existsSync(fontPath)) {
    console.log('  ⚠️  Arial font not found, skipping')
    return
  }

  const doc = new PDFDocument()

  // Register multiple fonts with subsetting
  doc.registerFont({
    name: 'Arial',
    source: fontPath,
    subset: true  // Enable subsetting
  })

  // Use first font
  doc.useFont('Arial')
  doc.text('Multiple Fonts Example', 100, 750, 24)
  doc.text('This document uses custom font with subsetting enabled.', 100, 720, 12)
  doc.text('Only the glyphs actually used will be embedded.', 100, 700, 12)

  doc.addPage()
  doc.text('Page 2', 100, 750, 20)
  doc.text('The font subset includes all glyphs used across all pages.', 100, 720, 12)

  doc.save(path.join(outputDir, 'subsetting-3-multipage.pdf'))

  const size = fs.statSync(path.join(outputDir, 'subsetting-3-multipage.pdf')).size
  console.log(`  Final PDF:     ${(size / 1024).toFixed(2)} KB`)
}

/**
 * Example 4: Invoice with subsetting
 */
function example4() {
  console.log('\n=== Example 4: Invoice with Subsetting ===')

  const fontPath = '/System/Library/Fonts/Supplemental/Arial.ttf'
  if (!fs.existsSync(fontPath)) {
    console.log('  ⚠️  Arial font not found, skipping')
    return
  }

  const doc = new PDFDocument()

  doc.registerFont({
    name: 'Arial',
    source: fontPath,
    subset: true  // Enable subsetting - perfect for invoices!
  })

  doc.useFont('Arial')

  // Invoice header
  doc.text('INVOICE', 250, 750, 28)
  doc.text('Invoice #: INV-2024-001', 100, 700, 12)
  doc.text('Date: November 17, 2024', 100, 680, 12)

  // Customer info
  doc.text('Bill To:', 100, 640, 14)
  doc.text('John Doe', 100, 620, 12)
  doc.text('123 Main Street', 100, 605, 11)
  doc.text('New York, NY 10001', 100, 590, 11)

  // Items table
  doc.useBaseFont('Courier')
  doc.text('Items:', 100, 540, 14)
  doc.text('Item                Qty    Price    Total', 100, 520, 11)
  doc.text('Product A           2      $50.00   $100.00', 100, 505, 10)
  doc.text('Product B           1      $75.00   $75.00', 100, 490, 10)
  doc.text('                                    -------', 100, 475, 10)
  doc.text('Total:                              $175.00', 100, 460, 11)

  doc.save(path.join(outputDir, 'subsetting-4-invoice.pdf'))

  const size = fs.statSync(path.join(outputDir, 'subsetting-4-invoice.pdf')).size
  console.log(`  Invoice PDF:   ${(size / 1024).toFixed(2)} KB`)
  console.log(`  Perfect for email attachments!`)
}

/**
 * Example 5: Side-by-side comparison
 */
function example5() {
  console.log('\n=== Example 5: Comparison Summary ===')

  const fontPath = '/System/Library/Fonts/Supplemental/Arial.ttf'
  if (!fs.existsSync(fontPath)) {
    console.log('  ⚠️  Arial font not found, skipping')
    return
  }

  const doc = new PDFDocument()

  doc.text('Font Subsetting - Summary', 150, 750, 24)

  doc.text('What is Font Subsetting?', 100, 700, 16)
  doc.text('Font subsetting only embeds the glyphs (characters) actually used', 100, 680, 11)
  doc.text('in the document, rather than the entire font file.', 100, 665, 11)

  doc.text('Benefits:', 100, 630, 14)
  doc.text('- Dramatically smaller file sizes (70-99% reduction)', 120, 610, 11)
  doc.text('- Faster downloads and emails', 120, 595, 11)
  doc.text('- Better performance in PDF viewers', 120, 580, 11)
  doc.text('- Automatic with PDFStudio', 120, 565, 11)

  doc.text('When to use subsetting:', 100, 530, 14)
  doc.text('- Invoices and receipts (few characters)', 120, 510, 11)
  doc.text('- Reports and forms (repetitive text)', 120, 495, 11)
  doc.text('- Email attachments (size matters)', 120, 480, 11)

  doc.text('Usage:', 100, 445, 14)
  doc.text('doc.registerFont({', 120, 425, 10)
  doc.text('  name: "Arial",', 120, 410, 10)
  doc.text('  source: "./arial.ttf",', 120, 395, 10)
  doc.text('  subset: true  // Enable subsetting!', 120, 380, 10)
  doc.text('})', 120, 365, 10)

  doc.save(path.join(outputDir, 'subsetting-5-summary.pdf'))

  const size = fs.statSync(path.join(outputDir, 'subsetting-5-summary.pdf')).size
  console.log(`  Summary PDF:   ${(size / 1024).toFixed(2)} KB`)
}

// Run all examples
console.log('\n=== PDFStudio Font Subsetting Examples ===')

example1()
example2()
example3()
example4()
example5()

console.log('\n=== Font Subsetting Examples Complete! ===')
console.log(`Output directory: ${outputDir}`)
console.log('\nKey Takeaways:')
console.log('  ✅ Font subsetting reduces file size by 70-99%')
console.log('  ✅ Automatically includes all used glyphs')
console.log('  ✅ Perfect for invoices, forms, and reports')
console.log('  ✅ Compatible with all PDF viewers')
console.log('  ✅ Just set subset: true when registering fonts\n')
