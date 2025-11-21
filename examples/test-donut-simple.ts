import { PDFDocument } from '../src'

console.log('🍩 Testing simple donut slice...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

// Title
doc.text('SIMPLE DONUT TEST', 200, 720, 24)

// Single slice donut to debug
doc.text('Single slice (should be a ring segment)', 50, 670, 14)
doc.donutChart({
  data: [
    { label: 'Test', value: 100 }
  ],
  x: 300,
  y: 500,
  outerRadius: 100,
  innerRadius: 60,
  showLabels: false,
  showPercentages: false,
  legend: {
    show: false
  }
})

// Two slice donut
doc.text('Two slices (50/50 split)', 50, 350, 14)
doc.donutChart({
  data: [
    { label: 'A', value: 50 },
    { label: 'B', value: 50 }
  ],
  x: 300,
  y: 200,
  outerRadius: 80,
  innerRadius: 40,
  showLabels: true,
  showPercentages: false,
  legend: {
    show: false
  }
})

doc.save('examples-output/test-donut-simple.pdf')

console.log('✅ PDF created: examples-output/test-donut-simple.pdf')
