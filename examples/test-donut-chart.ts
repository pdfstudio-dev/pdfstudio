import { PDFDocument } from '../src'

console.log('🍩 Testing donut charts...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

// Title
doc.text('DONUT CHART EXAMPLES', 170, 720, 24)

// Example 1: Traffic sources donut
doc.text('1. Traffic Sources', 50, 670, 14)
doc.donutChart({
  data: [
    { label: 'Organic Search', value: 45 },
    { label: 'Direct', value: 25 },
    { label: 'Social Media', value: 15 },
    { label: 'Referral', value: 10 },
    { label: 'Email', value: 5 }
  ],
  x: 200,
  y: 500,
  outerRadius: 100,
  innerRadius: 50,
  showLabels: true,
  showPercentages: true,
  centerText: '100%',
  title: 'Website Traffic',
  legend: {
    show: true,
    position: 'right'
  }
})

// Example 2: Revenue by category
doc.text('2. Revenue by Category', 50, 330, 14)
doc.donutChart({
  data: [
    { label: 'Software', value: 120000, color: '#3498db' },
    { label: 'Services', value: 85000, color: '#2ecc71' },
    { label: 'Hardware', value: 60000, color: '#e74c3c' },
    { label: 'Training', value: 35000, color: '#f39c12' }
  ],
  x: 200,
  y: 160,
  outerRadius: 100,
  innerRadius: 60,
  showLabels: true,
  showPercentages: true,
  centerText: '$300K',
  title: 'Annual Revenue',
  strokeColor: '#ffffff',
  strokeWidth: 3,
  legend: {
    show: true,
    position: 'right',
    fontSize: 10
  }
})

doc.save('examples-output/test-donut-chart.pdf')

console.log('✅ PDF created: examples-output/test-donut-chart.pdf')
console.log('   Donut charts with:')
console.log('   - Inner radius (hole in center)')
console.log('   - Center text display')
console.log('   - Percentage calculations')
console.log('   - Custom colors')
console.log('   - Legend with labels\n')
