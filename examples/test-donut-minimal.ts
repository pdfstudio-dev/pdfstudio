import { PDFDocument } from '../src'

console.log('🍩 Testing minimal donut...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

doc.text('MINIMAL DONUT TEST', 200, 720, 20)

// Test 1: Donut WITHOUT border
doc.text('1. Donut WITHOUT border:', 50, 650, 12)
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
  legend: { show: false }
})

// Test 2: Donut WITH border (no legend, no labels)
doc.text('2. Donut WITH border (no legend, no labels):', 50, 380, 12)
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
  legend: { show: false },
  border: {
    show: true,
    color: '#ff0000',
    width: 5,
    padding: 20,
    radius: 0
  }
})

doc.save('examples-output/test-donut-minimal.pdf')

console.log('✅ PDF created: examples-output/test-donut-minimal.pdf')
