import { PDFDocument } from '../src/core/PDFDocument'
import * as path from 'path'
import * as fs from 'fs'

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'output')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

/**
 * Example 1: Table without auto page breaks (default behavior)
 */
function example1() {
  console.log('Generating Example 1: Table without auto page breaks...')

  const doc = new PDFDocument()

  doc.text('Table Without Auto Page Breaks', 100, 750, 20)
  doc.text('This table will overflow the page without creating a new page', 100, 730, 12)

  // Generate many rows (will overflow page)
  const rows: string[][] = []
  for (let i = 1; i <= 30; i++) {
    rows.push([`Row ${i}`, `Data ${i}`, `Value ${i}`])
  }

  doc.table({
    x: 100,
    y: 700,
    headers: ['Column 1', 'Column 2', 'Column 3'],
    rows,
    width: 400,
    rowHeight: 25,
    autoPageBreak: false  // Explicitly disabled
  })

  doc.save(path.join(outputDir, 'auto-page-1-disabled.pdf'))
  console.log('  > Saved: auto-page-1-disabled.pdf')
  console.log('  > Table will overflow page (expected)')
}

/**
 * Example 2: Table with auto page breaks enabled
 */
function example2() {
  console.log('Generating Example 2: Table with auto page breaks enabled...')

  const doc = new PDFDocument()

  doc.text('Table With Auto Page Breaks', 100, 750, 20)
  doc.text('This table will automatically continue on new pages', 100, 730, 12)

  // Generate many rows
  const rows: string[][] = []
  for (let i = 1; i <= 50; i++) {
    rows.push([`Row ${i}`, `Data ${i}`, `Value ${i}`])
  }

  doc.table({
    x: 100,
    y: 700,
    headers: ['Column 1', 'Column 2', 'Column 3'],
    rows,
    width: 400,
    rowHeight: 25,
    autoPageBreak: true,    // Enable auto page breaks
    repeatHeader: true,     // Repeat header on each page
    bottomMargin: 50        // Leave 50pt margin at bottom
  })

  doc.save(path.join(outputDir, 'auto-page-2-enabled.pdf'))
  console.log('  > Saved: auto-page-2-enabled.pdf')
  console.log(`  > Generated ${doc.getPageCount()} pages`)
}

/**
 * Example 3: Large table with custom styling
 */
function example3() {
  console.log('Generating Example 3: Large table with custom styling...')

  const doc = new PDFDocument()

  doc.text('Employee Directory', 100, 750, 24)
  doc.text('(Multi-page table with zebra striping)', 100, 720, 12)

  // Generate employee data
  const rows: string[][] = []
  const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance']
  const roles = ['Manager', 'Developer', 'Designer', 'Analyst', 'Coordinator']

  for (let i = 1; i <= 100; i++) {
    const dept = departments[Math.floor(Math.random() * departments.length)]
    const role = roles[Math.floor(Math.random() * roles.length)]
    rows.push([
      `EMP${i.toString().padStart(3, '0')}`,
      `Employee ${i}`,
      dept,
      role,
      `$${(50000 + Math.floor(Math.random() * 100000)).toLocaleString()}`
    ])
  }

  doc.table({
    x: 50,
    y: 690,
    headers: ['ID', 'Name', 'Department', 'Role', 'Salary'],
    rows,
    width: 500,
    rowHeight: 20,
    autoPageBreak: true,
    repeatHeader: true,
    bottomMargin: 50,
    alternateRowColor: '#f0f0f0',
    headerStyle: {
      backgroundColor: '#4a90e2',
      textColor: '#ffffff',
      fontSize: 12,
      bold: true,
      align: 'center',
      valign: 'middle',
      height: 25
    }
  })

  doc.save(path.join(outputDir, 'auto-page-3-styled.pdf'))
  console.log('  > Saved: auto-page-3-styled.pdf')
  console.log(`  > Generated ${doc.getPageCount()} pages with 100 employees`)
}

/**
 * Example 4: Table without header repetition
 */
function example4() {
  console.log('Generating Example 4: Table without header repetition...')

  const doc = new PDFDocument()

  doc.text('Table Without Header Repetition', 100, 750, 20)
  doc.text('Header only appears on first page', 100, 730, 12)

  const rows: string[][] = []
  for (let i = 1; i <= 40; i++) {
    rows.push([`Item ${i}`, `Description for item ${i}`, `${(i * 10).toFixed(2)}`])
  }

  doc.table({
    x: 100,
    y: 700,
    headers: ['Item', 'Description', 'Price'],
    rows,
    width: 400,
    rowHeight: 25,
    autoPageBreak: true,
    repeatHeader: false,    // Don't repeat header
    bottomMargin: 50
  })

  doc.save(path.join(outputDir, 'auto-page-4-no-repeat.pdf'))
  console.log('  > Saved: auto-page-4-no-repeat.pdf')
  console.log(`  > Generated ${doc.getPageCount()} pages`)
}

/**
 * Example 5: Mixed content with auto-breaking table
 */
function example5() {
  console.log('Generating Example 5: Mixed content with auto-breaking table...')

  const doc = new PDFDocument()

  // Page 1 - Title and intro
  doc.text('Annual Sales Report 2024', 200, 750, 28)
  doc.text('Company Performance Summary', 200, 710, 16)

  doc.text('Executive Summary', 100, 660, 18)
  doc.text('This report contains detailed sales data for all regions.', 100, 640, 12)
  doc.text('Performance exceeded expectations with 25% growth year-over-year.', 100, 620, 12)

  // Generate sales data
  const rows: string[][] = []
  const regions = ['North', 'South', 'East', 'West', 'Central']
  const products = ['Product A', 'Product B', 'Product C', 'Product D']

  for (let i = 1; i <= 60; i++) {
    const region = regions[Math.floor(Math.random() * regions.length)]
    const product = products[Math.floor(Math.random() * products.length)]
    const sales = (10000 + Math.floor(Math.random() * 90000))
    rows.push([
      `Q${Math.ceil(i / 15)}`,
      region,
      product,
      sales.toLocaleString(),
      `${(Math.random() * 30 + 70).toFixed(1)}%`
    ])
  }

  doc.table({
    x: 50,
    y: 580,
    headers: ['Quarter', 'Region', 'Product', 'Sales ($)', 'Target %'],
    rows,
    width: 500,
    rowHeight: 20,
    autoPageBreak: true,
    repeatHeader: true,
    bottomMargin: 80,  // Extra margin for footer
    headerStyle: {
      backgroundColor: '#2c3e50',
      textColor: '#ffffff',
      fontSize: 11,
      bold: true,
      align: 'center',
      valign: 'middle',
      height: 25
    },
    alternateRowColor: '#ecf0f1'
  })

  doc.save(path.join(outputDir, 'auto-page-5-mixed.pdf'))
  console.log('  > Saved: auto-page-5-mixed.pdf')
  console.log(`  > Generated ${doc.getPageCount()} pages`)
}

/**
 * Example 6: Custom bottom margin
 */
function example6() {
  console.log('Generating Example 6: Custom bottom margins...')

  const doc = new PDFDocument()

  doc.text('Table with Large Bottom Margin', 100, 750, 20)
  doc.text('More white space at the bottom of each page', 100, 730, 12)

  const rows: string[][] = []
  for (let i = 1; i <= 35; i++) {
    rows.push([`${i}`, `Task ${i}`, `Description for task number ${i}`, 'Pending'])
  }

  doc.table({
    x: 100,
    y: 700,
    headers: ['#', 'Task', 'Description', 'Status'],
    rows,
    width: 450,
    rowHeight: 25,
    autoPageBreak: true,
    repeatHeader: true,
    bottomMargin: 150  // Large bottom margin (leave room for footer, notes, etc.)
  })

  doc.save(path.join(outputDir, 'auto-page-6-margin.pdf'))
  console.log('  > Saved: auto-page-6-margin.pdf')
  console.log(`  > Generated ${doc.getPageCount()} pages`)
}

// Run all examples
console.log('\n=== PDFStudio Auto Page Breaks Examples ===\n')

example1()
example2()
example3()
example4()
example5()
example6()

console.log('\n=== All auto page break examples generated successfully! ===')
console.log(`Output directory: ${outputDir}\n`)
