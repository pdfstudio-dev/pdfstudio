import { PDFDocument } from '../src'

console.log('🍩 Testing donut + border + legend...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

doc.text('DONUT + BORDER + LEGEND TEST', 160, 720, 20)

// Test 1: Donut + border (NO legend) - should work
doc.text('1. Donut + Border (NO legend) - should work:', 50, 650, 12)
doc.donutChart({
  data: [
    { label: 'A', value: 50 },
    { label: 'B', value: 50 }
  ],
  x: 150,
  y: 550,
  outerRadius: 60,
  innerRadius: 30,
  showLabels: false,
  centerText: '100%',
  legend: { show: false },
  border: {
    show: true,
    color: '#00ff00',
    width: 5,
    padding: 20
  }
})

// Test 2: Donut + legend (NO border) - should work
doc.text('2. Donut + Legend (NO border) - should work:', 50, 380, 12)
doc.donutChart({
  data: [
    { label: 'A', value: 50 },
    { label: 'B', value: 50 }
  ],
  x: 150,
  y: 280,
  outerRadius: 60,
  innerRadius: 30,
  showLabels: false,
  centerText: '100%',
  legend: {
    show: true,
    position: 'right'
  },
  border: { show: false }
})

// NEW PAGE for test 3
doc.addPage()

doc.text('DONUT + BORDER + LEGEND TEST (page 2)', 140, 720, 20)

// Test 3: Donut + border + legend - might cause error
doc.text('3. Donut + Border + Legend - test this:', 50, 650, 12)
doc.donutChart({
  data: [
    { label: 'A', value: 50 },
    { label: 'B', value: 50 }
  ],
  x: 150,
  y: 520,
  outerRadius: 60,
  innerRadius: 30,
  showLabels: false,
  centerText: '100%',
  legend: {
    show: true,
    position: 'right'
  },
  border: {
    show: true,
    color: '#ff0000',
    width: 5,
    padding: 20
  }
})

doc.save('examples-output/test-donut-border-legend.pdf')

console.log('✅ PDF created: examples-output/test-donut-border-legend.pdf')
console.log('   Page 1: Tests 1 and 2 (should work)')
console.log('   Page 2: Test 3 (donut + border + legend)\n')
