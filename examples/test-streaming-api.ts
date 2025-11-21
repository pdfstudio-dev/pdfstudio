import { PDFDocument } from '../src/core/PDFDocument'
import * as fs from 'fs'
import * as path from 'path'

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'output')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

/**
 * Example 1: Pipe to file stream (like PDFKit)
 */
function example1() {
  console.log('Example 1: Streaming to file...')

  const doc = new PDFDocument()
  const stream = fs.createWriteStream(path.join(outputDir, 'streaming-1-file.pdf'))

  // Pipe the PDF to the file stream (PDFKit-compatible API)
  doc.pipe(stream)

  // Add content
  doc.text('Streaming API Example', 100, 750, 24)
  doc.text('This PDF was generated using streaming API', 100, 720, 12)
  doc.text('Compatible with PDFKit pipe() and end() methods', 100, 700, 11)

  // Add a chart
  doc.barChart({
    data: [
      { label: 'Jan', value: 45 },
      { label: 'Feb', value: 62 },
      { label: 'Mar', value: 58 },
      { label: 'Apr', value: 71 }
    ],
    x: 100,
    y: 550,
    width: 400,
    height: 200,
    barColor: '#3498db',
    title: 'Monthly Sales',
    showAxes: true,
    showGrid: true,
    showLabels: true,
    showValues: true
  })

  // Finalize the PDF and write to stream
  doc.end()

  stream.on('finish', () => {
    console.log('  ✓ File written successfully')
  })
}

/**
 * Example 2: Multiple pages with streaming
 */
function example2() {
  console.log('Example 2: Multi-page streaming...')

  const doc = new PDFDocument({
    pageNumbers: {
      enabled: true,
      position: 'bottom-center',
      format: 'Page {current} of {total}'
    }
  })

  const stream = fs.createWriteStream(path.join(outputDir, 'streaming-2-multipage.pdf'))
  doc.pipe(stream)

  // Page 1
  doc.text('Multi-Page Streaming Example', 100, 750, 20)
  doc.text('This demonstrates streaming with multiple pages', 100, 720, 12)

  // Page 2
  doc.addPage()
  doc.text('Page 2', 100, 750, 18)
  doc.text('Content continues across pages', 100, 720, 12)

  // Page 3
  doc.addPage()
  doc.text('Page 3 - Final Page', 100, 750, 18)
  doc.text('Stream will be closed when end() is called', 100, 720, 12)

  doc.end()

  stream.on('finish', () => {
    console.log('  ✓ Multi-page PDF written')
  })
}

/**
 * Example 3: Streaming with table and auto page breaks
 */
function example3() {
  console.log('Example 3: Streaming with table...')

  const doc = new PDFDocument()
  const stream = fs.createWriteStream(path.join(outputDir, 'streaming-3-table.pdf'))
  doc.pipe(stream)

  doc.text('Large Table Example', 100, 750, 20)

  // Create large table that spans multiple pages
  const rows: string[][] = []
  for (let i = 1; i <= 50; i++) {
    rows.push([
      `Product ${i}`,
      `$${(Math.random() * 100).toFixed(2)}`,
      `${Math.floor(Math.random() * 100)}`
    ])
  }

  doc.table({
    x: 100,
    y: 700,
    headers: ['Product', 'Price', 'Stock'],
    rows: rows,
    autoPageBreak: true,
    repeatHeader: true,
    bottomMargin: 50
  })

  doc.end()

  stream.on('finish', () => {
    console.log('  ✓ Table PDF with auto page breaks written')
  })
}

/**
 * Example 4: Simulating Express HTTP response
 */
function example4() {
  console.log('Example 4: Simulating HTTP response...')

  const doc = new PDFDocument({
    info: {
      Title: 'Generated Report',
      Author: 'PDFStudio',
      Subject: 'Sales Report'
    }
  })

  // Simulate HTTP response with a writable stream
  const mockResponse = fs.createWriteStream(path.join(outputDir, 'streaming-4-http.pdf'))

  // In a real Express app, you would do:
  // res.setHeader('Content-Type', 'application/pdf')
  // res.setHeader('Content-Disposition', 'inline; filename="report.pdf"')
  // doc.pipe(res)

  doc.pipe(mockResponse)

  // Generate report content
  doc.text('Sales Report', 200, 750, 28)
  doc.text('Generated on: ' + new Date().toLocaleDateString(), 200, 720, 12)

  doc.addPage()
  doc.text('Chart 1: Quarterly Results', 100, 750, 16)

  doc.barChart({
    data: [
      { label: 'Q1', value: 125 },
      { label: 'Q2', value: 142 },
      { label: 'Q3', value: 138 },
      { label: 'Q4', value: 165 }
    ],
    x: 100,
    y: 550,
    width: 400,
    height: 250,
    barColor: '#2ecc71',
    title: 'Quarterly Revenue ($K)',
    showAxes: true,
    showGrid: true,
    showLabels: true,
    showValues: true
  })

  doc.end()

  mockResponse.on('finish', () => {
    console.log('  ✓ HTTP response simulation complete')
  })
}

/**
 * Example 5: Custom fonts with streaming
 */
function example5() {
  console.log('Example 5: Custom fonts with streaming...')

  const fontPath = '/System/Library/Fonts/Helvetica.ttc'
  if (!fs.existsSync(fontPath)) {
    console.log('  ⚠️  Font not found, skipping')
    return
  }

  const doc = new PDFDocument()
  const stream = fs.createWriteStream(path.join(outputDir, 'streaming-5-custom-fonts.pdf'))
  doc.pipe(stream)

  // Register custom font
  doc.registerFont({
    name: 'CustomFont',
    source: fontPath
  })

  doc.text('Custom Fonts with Streaming', 100, 750, 24)

  // Use custom font
  doc.useFont('CustomFont')
  doc.text('This text uses a custom TrueType font', 100, 700, 16)
  doc.text('Streaming works perfectly with custom fonts!', 100, 670, 14)

  // Back to standard font
  doc.useBaseFont('Courier')
  doc.text('Standard Courier font', 100, 630, 12)

  doc.end()

  stream.on('finish', () => {
    console.log('  ✓ Custom fonts streaming complete')
  })
}

// Run all examples
console.log('\n=== PDFStudio Streaming API Examples ===\n')

example1()
example2()
example3()
example4()
example5()

// Wait for all streams to finish
setTimeout(() => {
  console.log('\n=== All streaming examples completed! ===')
  console.log(`Output directory: ${outputDir}`)
  console.log('\nAPI Usage:')
  console.log('  const doc = new PDFDocument()')
  console.log('  doc.pipe(stream)  // Pipe to writable stream')
  console.log('  doc.text(...)     // Add content')
  console.log('  doc.end()         // Finalize and close stream')
  console.log('\nExpress Example:')
  console.log('  app.get("/pdf", (req, res) => {')
  console.log('    res.setHeader("Content-Type", "application/pdf")')
  console.log('    const doc = new PDFDocument()')
  console.log('    doc.pipe(res)')
  console.log('    doc.text("Hello from Express!", 100, 700)')
  console.log('    doc.end()')
  console.log('  })\n')
}, 1000)
