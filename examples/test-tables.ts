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
  headers: ['Feature', 'Free', 'Professional', 'Lifetime'],
  rows: [
    ['Visual Editor', '✓', '✓', '✓'],
    ['AI Templates', '3', 'Unlimited', 'Unlimited'],
    ['Code Export', '✓', '✓', '✓'],
    ['Real-time Preview', '✓', '✓', '✓']
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
  headers: ['Plan', 'Price', 'Best For'],
  rows: [
    ['Free', '$0/mo', 'Trying PDF UI Studio'],
    ['Professional', '$7/mo', 'Regular PDF creation'],
    ['Lifetime', '$100 once', 'Power users & agencies']
  ],
  headerStyle: {
    backgroundColor: '#7C3AED',
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
    { header: 'Feature', width: 180, align: 'left' },
    { header: 'Category', width: 120, align: 'center' },
    { header: 'Usage', width: 80, align: 'center' },
    { header: 'Status', width: 120, align: 'right' }
  ],
  rows: [
    ['Visual Editor', 'Core', '98%', 'Active'],
    ['AI Templates', 'Premium', '87%', 'Active'],
    [
      {
        content: 'Code Export',
        textColor: '#7C3AED'
      },
      'Core',
      {
        content: '100%',
        backgroundColor: '#7C3AED',
        textColor: '#ffffff'
      },
      'Popular'
    ],
    ['Real-time Preview', 'Core', '95%', 'Active'],
    ['Drag & Drop', 'Core', '99%', 'Active']
  ],
  headerStyle: {
    backgroundColor: '#7C3AED',
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
