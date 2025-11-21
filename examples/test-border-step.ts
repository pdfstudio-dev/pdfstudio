import { PDFDocument } from '../src'

console.log('🔍 Testing borders step by step...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

doc.text('BORDER STEP-BY-STEP TEST', 180, 720, 24)

// Test 1: Only pie, no labels, no legend - WITH BORDER
doc.text('1. Pie only + Border (RED)', 50, 650, 12)
doc.pieChart({
  data: [
    { label: 'A', value: 50 },
    { label: 'B', value: 50 }
  ],
  x: 150,
  y: 550,
  radius: 60,
  showLabels: false,
  showPercentages: false,
  legend: { show: false },
  border: {
    show: true,
    color: '#ff0000',
    width: 5,
    padding: 15
  }
})

// Test 2: Pie + Labels, no legend - WITH BORDER
doc.text('2. Pie + Labels + Border (GREEN)', 250, 650, 12)
doc.pieChart({
  data: [
    { label: 'A', value: 50 },
    { label: 'B', value: 50 }
  ],
  x: 350,
  y: 550,
  radius: 60,
  showLabels: true,
  showPercentages: false,
  legend: { show: false },
  border: {
    show: true,
    color: '#00ff00',
    width: 5,
    padding: 15
  }
})

// Test 3: Pie + Legend, no labels - WITH BORDER
doc.text('3. Pie + Legend + Border (BLUE)', 50, 420, 12)
doc.pieChart({
  data: [
    { label: 'Product A', value: 50 },
    { label: 'Product B', value: 50 }
  ],
  x: 150,
  y: 300,
  radius: 60,
  showLabels: false,
  showPercentages: false,
  legend: {
    show: true,
    position: 'right'
  },
  border: {
    show: true,
    color: '#0000ff',
    width: 5,
    padding: 15
  }
})

// Test 4: Pie + Labels + Legend - WITH BORDER
doc.text('4. Pie + Labels + Legend + Border (PURPLE)', 250, 420, 12)
doc.pieChart({
  data: [
    { label: 'X', value: 50 },
    { label: 'Y', value: 50 }
  ],
  x: 400,
  y: 300,
  radius: 50,
  showLabels: true,
  showPercentages: false,
  legend: {
    show: true,
    position: 'right'
  },
  border: {
    show: true,
    color: '#ff00ff',
    width: 5,
    padding: 15
  }
})

doc.save('examples-output/test-border-step.pdf')

console.log('✅ PDF created: examples-output/test-border-step.pdf')
console.log('   Expected borders:')
console.log('   1. RED border (pie only)')
console.log('   2. GREEN border (pie + labels)')
console.log('   3. BLUE border (pie + legend)')
console.log('   4. PURPLE border (pie + labels + legend)\n')
