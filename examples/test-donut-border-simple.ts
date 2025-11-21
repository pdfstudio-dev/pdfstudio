import { PDFDocument } from '../src'

console.log('🍩 Testing donut borders (simple)...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

doc.text('DONUT BORDER SIMPLE TEST', 170, 720, 20)

// Test 1: Donut with rectangular border ONLY (no rounded corners)
doc.text('1. Rectangular Border (no rounded corners)', 50, 650, 12)
doc.donutChart({
  data: [
    { label: 'A', value: 50 },
    { label: 'B', value: 50 }
  ],
  x: 180,
  y: 500,
  outerRadius: 70,
  innerRadius: 35,
  showLabels: false,
  centerText: '100%',
  legend: {
    show: true,
    position: 'right'
  },
  border: {
    show: true,
    color: '#2c3e50',
    width: 3,
    padding: 20,
    radius: 0  // NO rounded corners
  }
})

// Test 2: Donut with rounded border
doc.text('2. Rounded Border (radius 10)', 50, 300, 12)
doc.donutChart({
  data: [
    { label: 'X', value: 60 },
    { label: 'Y', value: 40 }
  ],
  x: 180,
  y: 160,
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
    color: '#9b59b6',
    width: 3,
    padding: 20,
    radius: 10  // Rounded corners
  }
})

doc.save('examples-output/test-donut-border-simple.pdf')

console.log('✅ PDF created: examples-output/test-donut-border-simple.pdf')
console.log('   Check which one causes error:')
console.log('   1. Rectangular border (radius: 0)')
console.log('   2. Rounded border (radius: 10)\n')
