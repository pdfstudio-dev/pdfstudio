import { PDFDocument } from '../src'

console.log('📈 Testing line chart with borders...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

// Title
doc.text('LINE CHART WITH BORDERS', 180, 720, 24)

// Example 1: Line chart with simple border
doc.text('1. Monthly Sales (Black Border, 2px)', 50, 670, 12)
doc.lineChart({
  data: [
    { label: 'Jan', value: 30 },
    { label: 'Feb', value: 45 },
    { label: 'Mar', value: 35 },
    { label: 'Apr', value: 60 },
    { label: 'May', value: 55 },
    { label: 'Jun', value: 75 }
  ],
  x: 50,
  y: 480,
  width: 500,
  height: 150,
  title: 'Monthly Sales',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showPoints: true,
  lineColor: '#3498db',
  pointColor: '#3498db',
  border: {
    show: true,
    color: '#000000',
    width: 2,
    padding: 15
  }
})

// Example 2: Line chart with filled area and blue border
doc.text('2. Revenue Trend (Blue Border, 3px)', 50, 280, 12)
doc.lineChart({
  data: [
    { label: 'Q1', value: 120 },
    { label: 'Q2', value: 150 },
    { label: 'Q3', value: 180 },
    { label: 'Q4', value: 200 }
  ],
  x: 50,
  y: 90,
  width: 500,
  height: 150,
  title: 'Quarterly Revenue',
  showAxes: true,
  showGrid: false,
  showLabels: true,
  showPoints: true,
  fillArea: true,
  fillColor: '#2ecc71',
  fillOpacity: 0.3,
  lineColor: '#2ecc71',
  pointColor: '#2ecc71',
  border: {
    show: true,
    color: '#3498db',
    width: 3,
    padding: 20
  }
})

doc.save('examples-output/test-line-border.pdf')

console.log('✅ PDF created: examples-output/test-line-border.pdf')
console.log('   Line charts with:')
console.log('   - Simple black border (2px)')
console.log('   - Blue border with filled area (3px)\n')
