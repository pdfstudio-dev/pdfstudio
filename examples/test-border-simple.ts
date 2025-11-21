import { PDFDocument } from '../src'

console.log('🔲 Testing simple borders (no rounded corners)...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

// Title
doc.text('SIMPLE BORDERS TEST', 200, 720, 24)

// Example 1: Simple rectangular border
doc.text('1. Simple Black Border', 50, 670, 14)
doc.pieChart({
  data: [
    { label: 'A', value: 35 },
    { label: 'B', value: 25 },
    { label: 'C', value: 20 },
    { label: 'D', value: 20 }
  ],
  x: 200,
  y: 500,
  radius: 80,
  showLabels: true,
  showPercentages: false,
  legend: {
    show: true,
    position: 'right'
  },
  border: {
    show: true,
    color: '#000000',
    width: 2,
    padding: 15,
    radius: 0  // NO rounded corners
  }
})

// Example 2: Donut with simple border
doc.text('2. Donut with Blue Border', 50, 280, 14)
doc.donutChart({
  data: [
    { label: 'X', value: 50 },
    { label: 'Y', value: 30 },
    { label: 'Z', value: 20 }
  ],
  x: 200,
  y: 140,
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
    color: '#3498db',
    width: 3,
    padding: 20,
    radius: 0  // NO rounded corners
  }
})

doc.save('examples-output/test-border-simple.pdf')

console.log('✅ PDF created: examples-output/test-border-simple.pdf')
