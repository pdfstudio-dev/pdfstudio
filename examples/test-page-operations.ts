import { PDFDocument } from '../src/core/PDFDocument'
import * as path from 'path'
import * as fs from 'fs'

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'output')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

/**
 * Example 1: Page rotation
 */
function example1() {
  console.log('Generating Example 1: Page rotation...')

  const doc = new PDFDocument()

  // Page 1 - No rotation (0 degrees)
  doc.text('Page 1', 100, 750, 24)
  doc.text('No rotation (0 degrees)', 100, 720, 14)
  doc.text('This page is displayed in normal orientation.', 100, 700, 12)

  // Page 2 - 90 degrees rotation (clockwise)
  doc.addPage()
  doc.text('Page 2', 100, 750, 24)
  doc.text('Rotated 90 degrees clockwise', 100, 720, 14)
  doc.text('This page should be rotated 90 degrees.', 100, 700, 12)
  doc.rotateCurrentPage(90)

  // Page 3 - 180 degrees rotation
  doc.addPage()
  doc.text('Page 3', 100, 750, 24)
  doc.text('Rotated 180 degrees', 100, 720, 14)
  doc.text('This page should be upside down.', 100, 700, 12)
  doc.rotateCurrentPage(180)

  // Page 4 - 270 degrees rotation (same as -90)
  doc.addPage()
  doc.text('Page 4', 100, 750, 24)
  doc.text('Rotated 270 degrees clockwise', 100, 720, 14)
  doc.text('This page should be rotated 270 degrees.', 100, 700, 12)
  doc.rotateCurrentPage(270)

  doc.save(path.join(outputDir, 'page-ops-1-rotation.pdf'))
  console.log('  > Saved: page-ops-1-rotation.pdf')
}

/**
 * Example 2: Rotate specific pages
 */
function example2() {
  console.log('Generating Example 2: Rotate specific pages...')

  const doc = new PDFDocument()

  // Create 4 pages first
  doc.text('Page 1 - Normal', 100, 750, 24)
  doc.text('This page is not rotated.', 100, 720, 12)

  doc.addPage()
  doc.text('Page 2 - Will be rotated', 100, 750, 24)
  doc.text('This page will be rotated 90 degrees.', 100, 720, 12)

  doc.addPage()
  doc.text('Page 3 - Normal', 100, 750, 24)
  doc.text('This page is not rotated.', 100, 720, 12)

  doc.addPage()
  doc.text('Page 4 - Will be rotated', 100, 750, 24)
  doc.text('This page will be rotated 180 degrees.', 100, 720, 12)

  // Now rotate specific pages
  doc.rotatePage(1, 90)   // Rotate page 2 (index 1)
  doc.rotatePage(3, 180)  // Rotate page 4 (index 3)

  doc.save(path.join(outputDir, 'page-ops-2-rotate-specific.pdf'))
  console.log('  > Saved: page-ops-2-rotate-specific.pdf')
}

/**
 * Example 3: Page duplication
 */
function example3() {
  console.log('Generating Example 3: Page duplication...')

  const doc = new PDFDocument()

  // Original page
  doc.text('Original Page', 100, 750, 24)
  doc.text('This is the original page.', 100, 720, 14)
  doc.text('It will be duplicated.', 100, 700, 12)
  doc.circle({ x: 300, y: 600, radius: 50, strokeColor: [0, 0, 1] })
  doc.text('Blue Circle', 270, 595, 10)

  // Duplicate the first page (index 0)
  const duplicateIndex = doc.duplicatePage(0)
  console.log(`  > Duplicated page 0, new page index: ${duplicateIndex}`)

  // Add another page
  doc.addPage()
  doc.text('Different Page', 100, 750, 24)
  doc.text('This is a different page.', 100, 720, 14)
  doc.text('It will not be duplicated.', 100, 700, 12)
  doc.circle({ x: 300, y: 600, radius: 50, fillColor: [1, 0, 0] })
  doc.text('Red Circle', 270, 595, 10)

  doc.save(path.join(outputDir, 'page-ops-3-duplication.pdf'))
  console.log('  > Saved: page-ops-3-duplication.pdf')
  console.log('  > Expected: 3 pages total (original, duplicate, different page)')
}

/**
 * Example 4: Page reordering
 */
function example4() {
  console.log('Generating Example 4: Page reordering...')

  const doc = new PDFDocument()

  // Create pages numbered 1, 2, 3, 4
  doc.text('Page 1', 100, 750, 36)
  doc.text('Original Position: 1', 100, 700, 14)
  doc.text('After reorder: should be position 3', 100, 680, 12)

  doc.addPage()
  doc.text('Page 2', 100, 750, 36)
  doc.text('Original Position: 2', 100, 700, 14)
  doc.text('After reorder: should be position 4', 100, 680, 12)

  doc.addPage()
  doc.text('Page 3', 100, 750, 36)
  doc.text('Original Position: 3', 100, 700, 14)
  doc.text('After reorder: should be position 1', 100, 680, 12)

  doc.addPage()
  doc.text('Page 4', 100, 750, 36)
  doc.text('Original Position: 4', 100, 700, 14)
  doc.text('After reorder: should be position 2', 100, 680, 12)

  // Reorder: [2, 3, 0, 1] means:
  // Position 0 gets page at index 2 (Page 3)
  // Position 1 gets page at index 3 (Page 4)
  // Position 2 gets page at index 0 (Page 1)
  // Position 3 gets page at index 1 (Page 2)
  // Result: Page 3, Page 4, Page 1, Page 2
  doc.reorderPages([2, 3, 0, 1])

  doc.save(path.join(outputDir, 'page-ops-4-reorder.pdf'))
  console.log('  > Saved: page-ops-4-reorder.pdf')
  console.log('  > Page order should be: Page 3, Page 4, Page 1, Page 2')
}

/**
 * Example 5: Page deletion
 */
function example5() {
  console.log('Generating Example 5: Page deletion...')

  const doc = new PDFDocument()

  // Create 5 pages
  for (let i = 1; i <= 5; i++) {
    if (i > 1) doc.addPage()
    doc.text(`Page ${i}`, 100, 750, 36)
    if (i === 2 || i === 4) {
      doc.text('THIS PAGE WILL BE DELETED', 100, 700, 18)
      doc.setStrokeColor(1, 0, 0)
      doc.rect(80, 680, 450, 40)
      doc.stroke()
    } else {
      doc.text('This page will remain', 100, 700, 14)
    }
  }

  // Delete pages 2 and 4 (indices 1 and 3)
  // Important: delete from highest index to lowest to avoid index shifts
  doc.deletePage(3)  // Delete page 4 (index 3)
  doc.deletePage(1)  // Delete page 2 (index 1)

  doc.save(path.join(outputDir, 'page-ops-5-deletion.pdf'))
  console.log('  > Saved: page-ops-5-deletion.pdf')
  console.log('  > Expected: 3 pages remaining (Page 1, Page 3, Page 5)')
}

/**
 * Example 6: Combined operations
 */
function example6() {
  console.log('Generating Example 6: Combined operations...')

  const doc = new PDFDocument()

  // Page 1: Title page
  doc.text('Combined Page Operations Demo', 100, 750, 24)
  doc.text('This document demonstrates multiple page operations.', 100, 720, 12)

  // Page 2: Content page
  doc.addPage()
  doc.text('Content Page', 100, 750, 20)
  doc.text('Important content here.', 100, 720, 12)
  doc.text('This page will be duplicated and rotated.', 100, 700, 12)

  // Duplicate page 2
  const dupIndex = doc.duplicatePage(1)

  // Rotate the duplicate
  doc.rotatePage(dupIndex, 90)

  // Add a summary page
  doc.addPage()
  doc.text('Summary Page', 100, 750, 20)
  doc.text('This is the final page.', 100, 720, 12)

  // Reorder: move summary to front
  // Current order: [0: Title, 1: Content, 2: Rotated Duplicate, 3: Summary]
  // New order: [3, 0, 1, 2] = [Summary, Title, Content, Rotated Duplicate]
  doc.reorderPages([3, 0, 1, 2])

  doc.save(path.join(outputDir, 'page-ops-6-combined.pdf'))
  console.log('  > Saved: page-ops-6-combined.pdf')
  console.log('  > Page order: Summary, Title, Content, Rotated Duplicate')
}

/**
 * Example 7: Landscape and Portrait mix with rotation
 */
function example7() {
  console.log('Generating Example 7: Landscape and portrait mix...')

  const doc = new PDFDocument()

  // Portrait page (default)
  doc.text('Portrait Page', 100, 750, 24)
  doc.text(`Page size: ${doc['writer']['defaultPageWidth']} x ${doc['writer']['defaultPageHeight']}`, 100, 720, 12)
  doc.rect(50, 50, 500, 700)
  doc.stroke()

  // Landscape page (wider than tall) - achieved by rotating and using wider page
  doc.addPage([792, 612])  // Letter landscape dimensions
  doc.text('Landscape Page', 100, 550, 24)
  doc.text('Page size: 792 x 612', 100, 520, 12)
  doc.rect(50, 50, 692, 512)
  doc.stroke()

  // Portrait with 90-degree rotation
  doc.addPage()
  doc.text('Rotated Portrait', 100, 750, 24)
  doc.text('This portrait page is rotated 90 degrees', 100, 720, 12)
  doc.rotateCurrentPage(90)

  doc.save(path.join(outputDir, 'page-ops-7-landscape-portrait.pdf'))
  console.log('  > Saved: page-ops-7-landscape-portrait.pdf')
}

/**
 * Example 8: Page buffering (switching to previous pages to edit)
 */
function example8() {
  console.log('Generating Example 8: Page buffering...')

  const doc = new PDFDocument()

  // Create Page 1
  doc.text('Page 1', 100, 750, 36)
  doc.text('Initial content on page 1', 100, 700, 14)
  console.log(`  > Current page: ${doc.getCurrentPageNumber()}`)

  // Create Page 2
  doc.addPage()
  doc.text('Page 2', 100, 750, 36)
  doc.text('Initial content on page 2', 100, 700, 14)
  console.log(`  > Current page: ${doc.getCurrentPageNumber()}`)

  // Create Page 3
  doc.addPage()
  doc.text('Page 3', 100, 750, 36)
  doc.text('Initial content on page 3', 100, 700, 14)
  console.log(`  > Current page: ${doc.getCurrentPageNumber()}`)

  // Now switch back to Page 1 and add more content
  console.log('  > Switching back to page 1 to add content...')
  doc.switchToPage(0)  // Switch to page 1 (0-indexed)
  doc.text('ADDED LATER: This text was added after creating page 3', 100, 650, 12)
  doc.setStrokeColor(1, 0, 0)
  doc.rect(95, 640, 410, 30)
  doc.stroke()
  console.log(`  > Current page: ${doc.getCurrentPageNumber()}`)

  // Switch to Page 2 and add content
  console.log('  > Switching to page 2 to add content...')
  doc.switchToPage(1)  // Switch to page 2 (0-indexed)
  doc.text('ADDED LATER: This text was also added after creating page 3', 100, 650, 12)
  doc.setStrokeColor(0, 0, 1)
  doc.rect(95, 640, 410, 30)
  doc.stroke()
  console.log(`  > Current page: ${doc.getCurrentPageNumber()}`)

  // Add final note to page 3
  console.log('  > Switching back to page 3 for final content...')
  doc.switchToPage(2)  // Switch to page 3 (0-indexed)
  doc.text('This page was created first, then we went back to edit pages 1 and 2', 100, 650, 12)
  console.log(`  > Current page: ${doc.getCurrentPageNumber()}`)

  doc.save(path.join(outputDir, 'page-ops-8-buffering.pdf'))
  console.log('  > Saved: page-ops-8-buffering.pdf')
  console.log('  > Pages 1 and 2 should have red/blue boxes with "ADDED LATER" text')
}

// Run all examples
console.log('\n=== PDFStudio Page Operations Examples ===\n')

example1()
example2()
example3()
example4()
example5()
example6()
example7()
example8()

console.log('\n=== All page operation examples generated successfully! ===')
console.log(`Output directory: ${outputDir}\n`)
