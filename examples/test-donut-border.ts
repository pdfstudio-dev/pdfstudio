import { PDFDocument } from '../src'

console.log('🍩 Testing donut chart with borders...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

// Title
doc.text('DONUT CHART WITH BORDERS', 170, 720, 24)

// Example 1: Donut with simple rectangular border
doc.text('1. Traffic Sources (Dark Gray Border, 2px)', 50, 670, 12)
doc.donutChart({
  data: [
    { label: 'Organic', value: 45 },
    { label: 'Direct', value: 25 },
    { label: 'Social', value: 15 },
    { label: 'Referral', value: 10 },
    { label: 'Email', value: 5 }
  ],
  x: 180,
  y: 480,
  outerRadius: 80,
  innerRadius: 40,
  showLabels: false,
  showPercentages: false,
  centerText: '100%',
  title: 'Website Traffic',
  legend: {
    show: true,
    position: 'right',
    fontSize: 9
  },
  border: {
    show: true,
    color: '#2c3e50',
    width: 2,
    padding: 20
  }
})

// Example 2: Donut with purple border (new page to avoid overlap)
doc.addPage()

doc.text('DONUT CHART WITH BORDERS (page 2)', 160, 720, 24)

doc.text('2. Revenue (Purple Border, 3px)', 50, 670, 12)
doc.donutChart({
  data: [
    { label: 'Software', value: 120000, color: '#3498db' },
    { label: 'Services', value: 85000, color: '#2ecc71' },
    { label: 'Hardware', value: 60000, color: '#e74c3c' },
    { label: 'Training', value: 35000, color: '#f39c12' }
  ],
  x: 180,
  y: 480,
  outerRadius: 70,
  innerRadius: 35,
  showLabels: false,
  showPercentages: false,
  centerText: '$300K',
  title: 'Annual Revenue',
  legend: {
    show: true,
    position: 'right',
    fontSize: 9
  },
  border: {
    show: true,
    color: '#9b59b6',
    width: 3,
    padding: 25
  }
})

doc.save('examples-output/test-donut-border.pdf')

console.log('✅ PDF created: examples-output/test-donut-border.pdf')
console.log('   Donut charts with borders:')
console.log('   - Page 1: Dark gray border (2px)')
console.log('   - Page 2: Purple border (3px)')
console.log('   - Both with legends and center text\n')
