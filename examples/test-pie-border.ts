import { PDFDocument } from '../src'

console.log('🥧 Testing pie chart with borders...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

// Title
doc.text('PIE CHART WITH BORDERS', 180, 720, 24)

// Example 1: Pie chart with simple black border
doc.text('1. Simple Border (black, 2px, square corners)', 50, 670, 12)
doc.pieChart({
  data: [
    { label: 'Product A', value: 35 },
    { label: 'Product B', value: 25 },
    { label: 'Product C', value: 20 },
    { label: 'Product D', value: 15 },
    { label: 'Others', value: 5 }
  ],
  x: 200,
  y: 530,
  radius: 70,
  showLabels: true,
  showPercentages: true,
  title: 'Market Share 2024',
  legend: {
    show: true,
    position: 'right',
    fontSize: 9
  },
  border: {
    show: true,
    color: '#000000',
    width: 2,
    padding: 15,
    radius: 0
  }
})

// Example 2: Pie chart with rounded blue border
doc.text('2. Rounded Border (blue, 3px, radius 12)', 50, 310, 12)
doc.pieChart({
  data: [
    { label: 'Development', value: 40, color: '#3498db' },
    { label: 'Marketing', value: 25, color: '#e74c3c' },
    { label: 'Sales', value: 20, color: '#2ecc71' },
    { label: 'Operations', value: 15, color: '#f39c12' }
  ],
  x: 200,
  y: 180,
  radius: 55,
  showLabels: false,
  showPercentages: false,
  title: 'Annual Budget',
  legend: {
    show: true,
    position: 'right',
    fontSize: 9
  },
  border: {
    show: true,
    color: '#3498db',
    width: 3,
    padding: 20,
    radius: 12
  }
})

doc.save('examples-output/test-pie-border.pdf')

console.log('✅ PDF created: examples-output/test-pie-border.pdf')
console.log('   Pie charts with:')
console.log('   - Simple rectangular border (black)')
console.log('   - Rounded border with custom radius (blue)')
console.log('   - Custom colors and padding\n')
