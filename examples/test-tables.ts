import { PDFDocument } from '../src'

console.log('📊 Testing tables...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

// Title
doc.text('TABLE EXAMPLES', 220, 720, 24)

// ======================
// Example 1: Simple table with headers
// ======================
doc.text('1. Simple Table', 50, 680, 14)

doc.table({
  x: 50,
  y: 540,
  width: 500,
  headers: ['Product', 'Price', 'Quantity', 'Total'],
  rows: [
    ['Widget A', '$10.00', '5', '$50.00'],
    ['Widget B', '$15.00', '3', '$45.00'],
    ['Widget C', '$20.00', '2', '$40.00'],
    ['Widget D', '$25.00', '1', '$25.00']
  ]
})

// ======================
// Example 2: Table with custom header styles
// ======================
doc.text('2. Custom Header Style', 50, 480, 14)

doc.table({
  x: 50,
  y: 340,
  width: 500,
  headers: ['Name', 'Department', 'Salary'],
  rows: [
    ['John Doe', 'Engineering', '$120,000'],
    ['Jane Smith', 'Marketing', '$95,000'],
    ['Bob Johnson', 'Sales', '$85,000']
  ],
  headerStyle: {
    backgroundColor: '#3498db',
    textColor: '#ffffff',
    fontSize: 12,
    bold: true,
    height: 35
  }
})

// ======================
// Example 3: Alternating row colors (zebra striping)
// ======================
doc.text('3. Alternating Row Colors', 50, 280, 14)

doc.table({
  x: 50,
  y: 140,
  width: 500,
  headers: ['ID', 'Status', 'Date'],
  rows: [
    ['001', 'Active', '2024-01-15'],
    ['002', 'Pending', '2024-01-16'],
    ['003', 'Active', '2024-01-17'],
    ['004', 'Completed', '2024-01-18'],
    ['005', 'Active', '2024-01-19']
  ],
  alternateRowColor: '#f8f9fa'
})

// Add new page
doc.addPage()

doc.text('TABLE EXAMPLES (continued)', 180, 720, 24)

// ======================
// Example 4: Custom column widths and alignment
// ======================
doc.text('4. Column Widths & Alignment', 50, 680, 14)

doc.table({
  x: 50,
  y: 540,
  width: 500,
  columns: [
    { header: 'Item', width: 200, align: 'left' },
    { header: 'Qty', width: 100, align: 'center' },
    { header: 'Price', width: 100, align: 'right' },
    { header: 'Total', width: 100, align: 'right' }
  ],
  rows: [
    ['Premium Widget', '10', '$50.00', '$500.00'],
    ['Standard Widget', '25', '$30.00', '$750.00'],
    ['Basic Widget', '50', '$15.00', '$750.00']
  ]
})

// ======================
// Example 5: Custom borders
// ======================
doc.text('5. Custom Borders', 50, 480, 14)

doc.table({
  x: 50,
  y: 340,
  width: 500,
  headers: ['Quarter', 'Revenue', 'Growth'],
  rows: [
    ['Q1 2024', '$1.2M', '+15%'],
    ['Q2 2024', '$1.4M', '+17%'],
    ['Q3 2024', '$1.6M', '+14%'],
    ['Q4 2024', '$1.8M', '+13%']
  ],
  borders: {
    top: { color: '#2ecc71', width: 3 },
    bottom: { color: '#2ecc71', width: 3 },
    left: { color: '#2ecc71', width: 2 },
    right: { color: '#2ecc71', width: 2 },
    horizontal: { color: '#ecf0f1', width: 1 },
    vertical: { color: '#ecf0f1', width: 1 },
    header: { color: '#2ecc71', width: 2 }
  },
  headerStyle: {
    backgroundColor: '#27ae60',
    textColor: '#ffffff'
  }
})

// ======================
// Example 6: Complex table with all features
// ======================
doc.text('6. Complex Table (All Features)', 50, 280, 14)

doc.table({
  x: 50,
  y: 80,
  width: 500,
  columns: [
    { header: 'Product Name', width: 180, align: 'left' },
    { header: 'Category', width: 120, align: 'center' },
    { header: 'Stock', width: 80, align: 'center' },
    { header: 'Price', width: 120, align: 'right' }
  ],
  rows: [
    ['Premium Laptop', 'Electronics', '15', '$1,299.99'],
    ['Wireless Mouse', 'Accessories', '50', '$29.99'],
    [
      {
        content: 'Gaming Keyboard',
        textColor: '#e74c3c'
      },
      'Accessories',
      {
        content: '0',
        backgroundColor: '#e74c3c',
        textColor: '#ffffff'
      },
      '$149.99'
    ],
    ['USB-C Cable', 'Accessories', '200', '$14.99'],
    ['Monitor 27"', 'Electronics', '8', '$399.99']
  ],
  headerStyle: {
    backgroundColor: '#34495e',
    textColor: '#ffffff',
    fontSize: 11,
    height: 32
  },
  alternateRowColor: '#ecf0f1',
  cellPadding: 8,
  rowHeight: 28,
  borders: true
})

doc.save('examples-output/test-tables.pdf')

console.log('✅ PDF created: examples-output/test-tables.pdf')
console.log('   6 table examples:')
console.log('   1. Simple table with headers')
console.log('   2. Custom header styles')
console.log('   3. Alternating row colors (zebra striping)')
console.log('   4. Column widths and alignment')
console.log('   5. Custom borders')
console.log('   6. Complex table with all features\n')
