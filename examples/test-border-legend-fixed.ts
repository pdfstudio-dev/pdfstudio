import { PDFDocument } from '../src'

console.log('🔍 Testing legend borders (fixed positions)...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

doc.text('LEGEND BORDER TEST (FIXED)', 170, 720, 24)

// Test 1: Pie + Legend - positioned to fit in page
doc.text('1. Pie + Legend (BLUE, 6px):', 50, 650, 12)
doc.pieChart({
  data: [
    { label: 'Product A', value: 50 },
    { label: 'Product B', value: 50 }
  ],
  x: 150,
  y: 550,
  radius: 60,
  showLabels: false,
  showPercentages: false,
  legend: {
    show: true,
    position: 'right',
    fontSize: 10,
    itemSpacing: 5
  },
  border: {
    show: true,
    color: '#0000ff',
    width: 6,
    padding: 20
  }
})

// Test 2: Pie + Labels + Legend - positioned to fit
doc.text('2. Pie + Labels + Legend (RED, 6px):', 50, 380, 12)
doc.pieChart({
  data: [
    { label: 'X', value: 60 },
    { label: 'Y', value: 40 }
  ],
  x: 150,
  y: 260,
  radius: 60,
  showLabels: true,
  showPercentages: false,
  legend: {
    show: true,
    position: 'right',
    fontSize: 10,
    itemSpacing: 5
  },
  border: {
    show: true,
    color: '#ff0000',
    width: 6,
    padding: 20
  }
})

doc.save('examples-output/test-border-legend-fixed.pdf')

console.log('✅ PDF created: examples-output/test-border-legend-fixed.pdf')
console.log('   Should see:')
console.log('   1. BLUE border around pie + legend')
console.log('   2. RED border around pie + labels + legend\n')
