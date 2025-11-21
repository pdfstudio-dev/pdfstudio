import { PDFDocument } from '../src'

console.log('🥧 Testing pie charts...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

// Title
doc.text('PIE CHART EXAMPLES', 180, 720, 24)

// Example 1: Simple pie chart with market share
doc.text('1. Market Share Distribution', 50, 670, 14)
doc.pieChart({
  data: [
    { label: 'Product A', value: 35 },
    { label: 'Product B', value: 25 },
    { label: 'Product C', value: 20 },
    { label: 'Product D', value: 15 },
    { label: 'Others', value: 5 }
  ],
  x: 200,
  y: 500,
  radius: 100,
  showLabels: true,
  showPercentages: true,
  title: 'Market Share 2024',
  legend: {
    show: true,
    position: 'right',
    fontSize: 10
  }
})

// Example 2: Pie chart with custom colors
doc.text('2. Budget Allocation (Custom Colors)', 50, 330, 14)
doc.pieChart({
  data: [
    { label: 'Development', value: 40, color: '#3498db' },
    { label: 'Marketing', value: 25, color: '#e74c3c' },
    { label: 'Sales', value: 20, color: '#2ecc71' },
    { label: 'Operations', value: 15, color: '#f39c12' }
  ],
  x: 200,
  y: 160,
  radius: 100,
  showLabels: true,
  showPercentages: true,
  strokeColor: '#ffffff',
  strokeWidth: 2,
  title: 'Annual Budget',
  legend: {
    show: true,
    position: 'right'
  }
})

doc.save('examples-output/test-pie-chart.pdf')

console.log('✅ PDF created: examples-output/test-pie-chart.pdf')
console.log('   Pie charts with:')
console.log('   - Automatic percentage calculation')
console.log('   - Labels outside slices')
console.log('   - Legend positioning')
console.log('   - Custom colors per slice\n')
