import { PDFDocument } from '../src'

console.log('📊 Testing bar chart with borders...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

// Title
doc.text('BAR CHART WITH BORDERS', 180, 720, 24)

// Example 1: Vertical bar chart with simple border
doc.text('1. Product Sales (Black Border, 2px)', 50, 670, 12)
doc.barChart({
  data: [
    { label: 'Product A', value: 120 },
    { label: 'Product B', value: 90 },
    { label: 'Product C', value: 140 },
    { label: 'Product D', value: 110 },
    { label: 'Product E', value: 95 }
  ],
  x: 50,
  y: 450,
  width: 500,
  height: 180,
  title: 'Product Sales',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showValues: true,
  barColor: '#3498db',
  border: {
    show: true,
    color: '#000000',
    width: 2,
    padding: 15
  }
})

// Example 2: Bar chart with custom colors and green border
doc.text('2. Market Share (Green Border, 3px)', 50, 250, 12)
doc.barChart({
  data: [
    { label: 'Q1', value: 45 },
    { label: 'Q2', value: 60 },
    { label: 'Q3', value: 75 },
    { label: 'Q4', value: 85 }
  ],
  x: 50,
  y: 50,
  width: 500,
  height: 150,
  title: 'Quarterly Growth',
  showAxes: true,
  showGrid: false,
  showLabels: true,
  showValues: true,
  barColors: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12'],
  border: {
    show: true,
    color: '#2ecc71',
    width: 3,
    padding: 20
  }
})

doc.save('examples-output/test-bar-border.pdf')

console.log('✅ PDF created: examples-output/test-bar-border.pdf')
console.log('   Bar charts with:')
console.log('   - Simple black border (2px)')
console.log('   - Green border with custom colors (3px)\n')
