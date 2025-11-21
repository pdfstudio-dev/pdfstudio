import { PDFDocument } from '../src/core/PDFDocument'
import * as path from 'path'
import * as fs from 'fs'

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'output')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

/**
 * Example 1: Document-level file attachments
 * Files attached at document level are accessible via the Attachments panel
 */
function example1() {
  console.log('Generating Example 1: Document-level attachments...')

  const doc = new PDFDocument()

  doc.text('Document with File Attachments', 100, 750, 24)
  doc.text('This PDF has files attached at the document level.', 100, 720, 12)
  doc.text('Open the Attachments panel in your PDF viewer to access them.', 100, 700, 12)

  doc.text('Attached files:', 100, 670, 14)
  doc.text('1. data.json - Sample JSON data', 120, 650, 11)
  doc.text('2. notes.txt - Text notes', 120, 630, 11)
  doc.text('3. info.csv - CSV data', 120, 610, 11)

  // Attach JSON file from Buffer
  const jsonData = {
    name: 'PDFStudio',
    version: '1.0.0',
    features: ['charts', 'forms', 'security', 'attachments']
  }
  doc.attachFile({
    name: 'data.json',
    file: Buffer.from(JSON.stringify(jsonData, null, 2)),
    description: 'Sample JSON data file',
    mimeType: 'application/json'
  })

  // Attach text file from Buffer
  const textData = `File Attachments Example
========================

This is a sample text file attached to the PDF document.

PDFStudio supports:
- Document-level attachments
- Page-level attachment annotations
- Multiple file formats
- Buffer and file path inputs

Created: ${new Date().toISOString()}
`
  doc.attachFile({
    name: 'notes.txt',
    file: Buffer.from(textData),
    description: 'Text notes about this example',
    mimeType: 'text/plain'
  })

  // Attach CSV file from Buffer
  const csvData = `Name,Role,Department
Alice,Engineer,Development
Bob,Designer,Design
Charlie,Manager,Product
`
  doc.attachFile({
    name: 'info.csv',
    file: Buffer.from(csvData),
    description: 'Sample CSV data',
    mimeType: 'text/csv'
  })

  doc.save(path.join(outputDir, 'attachments-1-document-level.pdf'))
  console.log('  > Saved: attachments-1-document-level.pdf')
  console.log('  > Contains 3 embedded files (JSON, TXT, CSV)')
}

/**
 * Example 2: Page-level file attachment annotations
 * Creates visible icons on the page
 */
function example2() {
  console.log('Generating Example 2: Page-level file annotations...')

  const doc = new PDFDocument()

  doc.text('File Attachment Annotations', 100, 750, 24)
  doc.text('Click on the icons below to open attached files:', 100, 720, 12)

  // PushPin icon (default)
  doc.text('PushPin icon:', 100, 680, 14)
  doc.text('Click the pin icon ->', 120, 660, 11)
  doc.addFileAnnotation({
    name: 'pushpin-note.txt',
    file: Buffer.from('This file uses a PushPin icon.'),
    x: 250,
    y: 655,
    icon: 'PushPin',
    description: 'Note with PushPin icon'
  })

  // Paperclip icon
  doc.text('Paperclip icon:', 100, 620, 14)
  doc.text('Click the paperclip ->', 120, 600, 11)
  doc.addFileAnnotation({
    name: 'paperclip-attachment.txt',
    file: Buffer.from('This file uses a Paperclip icon.'),
    x: 250,
    y: 595,
    icon: 'Paperclip',
    description: 'Attachment with Paperclip icon'
  })

  // Graph icon
  doc.text('Graph icon:', 100, 560, 14)
  doc.text('Click the graph ->', 120, 540, 11)
  doc.addFileAnnotation({
    name: 'graph-data.json',
    file: Buffer.from(JSON.stringify({ values: [1, 2, 3, 4, 5] })),
    x: 250,
    y: 535,
    icon: 'Graph',
    description: 'Data with Graph icon',
    mimeType: 'application/json'
  })

  // Tag icon
  doc.text('Tag icon:', 100, 500, 14)
  doc.text('Click the tag ->', 120, 480, 11)
  doc.addFileAnnotation({
    name: 'tag-metadata.txt',
    file: Buffer.from('This file uses a Tag icon.'),
    x: 250,
    y: 475,
    icon: 'Tag',
    description: 'Metadata with Tag icon'
  })

  doc.save(path.join(outputDir, 'attachments-2-page-annotations.pdf'))
  console.log('  > Saved: attachments-2-page-annotations.pdf')
  console.log('  > Contains 4 visible file attachment icons')
}

/**
 * Example 3: Mixed attachments (document + page level)
 */
function example3() {
  console.log('Generating Example 3: Mixed attachments...')

  const doc = new PDFDocument()

  doc.text('Mixed File Attachments', 100, 750, 24)
  doc.text('This document combines both attachment types:', 100, 720, 12)

  doc.text('Document-level attachments:', 100, 690, 14)
  doc.text('- Available via Attachments panel', 120, 670, 11)
  doc.text('- Not visible on page', 120, 650, 11)

  doc.text('Page-level annotations:', 100, 620, 14)
  doc.text('- Visible as icons on specific pages', 120, 600, 11)
  doc.text('- Click to open -> ', 120, 580, 11)

  // Document-level attachment
  doc.attachFile({
    name: 'full-report.json',
    file: Buffer.from(JSON.stringify({
      title: 'Annual Report',
      year: 2024,
      summary: 'Complete data analysis'
    }, null, 2)),
    description: 'Complete report data (not visible on page)',
    mimeType: 'application/json'
  })

  // Page-level annotation
  doc.addFileAnnotation({
    name: 'quick-summary.txt',
    file: Buffer.from('Quick Summary:\n- Revenue: Up 25%\n- Customers: 10,000+\n- Growth: Strong'),
    x: 240,
    y: 575,
    icon: 'Paperclip',
    description: 'Quick summary (visible icon)'
  })

  doc.save(path.join(outputDir, 'attachments-3-mixed.pdf'))
  console.log('  > Saved: attachments-3-mixed.pdf')
}

/**
 * Example 4: Attaching binary files (images)
 */
function example4() {
  console.log('Generating Example 4: Binary file attachments...')

  const doc = new PDFDocument()

  doc.text('Binary File Attachments', 100, 750, 24)
  doc.text('PDFs can embed any file type, including binary files.', 100, 720, 12)

  doc.text('This document demonstrates:', 100, 690, 14)
  doc.text('- Attaching files from disk (file paths)', 120, 670, 11)
  doc.text('- Binary files (images, PDFs, etc.)', 120, 650, 11)
  doc.text('- Multiple file formats', 120, 630, 11)

  // Check if test files exist
  const testImagePath = path.join(__dirname, 'logo.png')
  const testPdfPath = path.join(__dirname, 'output', 'compression-1-none.pdf')

  if (fs.existsSync(testImagePath)) {
    doc.attachFile({
      name: 'logo.png',
      file: testImagePath,
      description: 'Company logo image',
      mimeType: 'image/png'
    })
    doc.text('- logo.png attached', 120, 610, 11)
  }

  if (fs.existsSync(testPdfPath)) {
    doc.attachFile({
      name: 'reference.pdf',
      file: testPdfPath,
      description: 'Reference PDF document',
      mimeType: 'application/pdf'
    })
    doc.text('- reference.pdf attached', 120, 590, 11)
  }

  // Always attach a small binary file example
  const binaryData = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]) // PNG header
  doc.attachFile({
    name: 'sample.bin',
    file: binaryData,
    description: 'Sample binary data',
    mimeType: 'application/octet-stream'
  })
  doc.text('- sample.bin attached (binary data)', 120, 570, 11)

  doc.save(path.join(outputDir, 'attachments-4-binary.pdf'))
  console.log('  > Saved: attachments-4-binary.pdf')
}

/**
 * Example 5: Multi-page document with attachments
 */
function example5() {
  console.log('Generating Example 5: Multi-page with attachments...')

  const doc = new PDFDocument()

  // Page 1
  doc.text('Multi-Page Attachment Example', 100, 750, 24)
  doc.text('Page 1 of 3', 100, 720, 14)
  doc.text('This document has attachments on multiple pages.', 100, 700, 12)

  doc.text('Page 1 attachment ->', 100, 660, 12)
  doc.addFileAnnotation({
    name: 'page1-notes.txt',
    file: Buffer.from('Notes for page 1'),
    x: 220,
    y: 655,
    icon: 'PushPin'
  })

  // Page 2
  doc.addPage()
  doc.text('Multi-Page Attachment Example', 100, 750, 24)
  doc.text('Page 2 of 3', 100, 720, 14)

  doc.text('Page 2 attachment ->', 100, 660, 12)
  doc.addFileAnnotation({
    name: 'page2-data.json',
    file: Buffer.from(JSON.stringify({ page: 2, data: [1, 2, 3] })),
    x: 220,
    y: 655,
    icon: 'Graph',
    mimeType: 'application/json'
  })

  // Page 3
  doc.addPage()
  doc.text('Multi-Page Attachment Example', 100, 750, 24)
  doc.text('Page 3 of 3', 100, 720, 14)

  doc.text('Page 3 attachment ->', 100, 660, 12)
  doc.addFileAnnotation({
    name: 'page3-summary.txt',
    file: Buffer.from('Summary for page 3'),
    x: 220,
    y: 655,
    icon: 'Paperclip'
  })

  // Document-level attachment available from all pages
  doc.attachFile({
    name: 'complete-document-data.json',
    file: Buffer.from(JSON.stringify({
      pages: 3,
      attachments: {
        page1: 'notes',
        page2: 'data',
        page3: 'summary'
      }
    }, null, 2)),
    description: 'Complete document metadata'
  })

  doc.save(path.join(outputDir, 'attachments-5-multipage.pdf'))
  console.log('  > Saved: attachments-5-multipage.pdf')
}

// Run all examples
console.log('\n=== PDFStudio File Attachments Examples ===\n')

example1()
example2()
example3()
example4()
example5()

console.log('\n=== All attachment examples generated successfully! ===')
console.log(`Output directory: ${outputDir}`)
console.log('\nTo view attachments:')
console.log('- Adobe Reader: View > Show/Hide > Navigation Panes > Attachments')
console.log('- Preview (Mac): May not fully support all attachment types')
console.log('- Use "pdfinfo -meta" or "exiftool" to inspect embedded files\n')
