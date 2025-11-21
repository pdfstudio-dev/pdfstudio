import { PDFDocument } from '../src'

console.log('🔍 Testing border visibility...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

// Title
doc.text('BORDER VISIBILITY TEST', 190, 720, 24)

// Pie chart WITHOUT border for comparison
doc.text('Without Border:', 50, 650, 12)
doc.pieChart({
  data: [
    { label: 'A', value: 40 },
    { label: 'B', value: 30 },
    { label: 'C', value: 30 }
  ],
  x: 150,
  y: 550,
  radius: 60,
  showLabels: false,
  showPercentages: false,
  legend: {
    show: false
  }
})

// Pie chart WITH border (thick red for visibility)
doc.text('With Border (Red, 5px):', 300, 650, 12)
doc.pieChart({
  data: [
    { label: 'A', value: 40 },
    { label: 'B', value: 30 },
    { label: 'C', value: 30 }
  ],
  x: 430,
  y: 550,
  radius: 60,
  showLabels: false,
  showPercentages: false,
  legend: {
    show: false
  },
  border: {
    show: true,
    color: '#ff0000',  // RED
    width: 5,          // THICK
    padding: 20
  }
})

// Another test with labels and legend
doc.text('With Labels + Legend + Border (Blue, 3px):', 50, 400, 12)
doc.pieChart({
  data: [
    { label: 'Product A', value: 35 },
    { label: 'Product B', value: 25 },
    { label: 'Product C', value: 40 }
  ],
  x: 200,
  y: 250,
  radius: 70,
  showLabels: true,
  showPercentages: true,
  title: 'Sales Distribution',
  legend: {
    show: true,
    position: 'right'
  },
  border: {
    show: true,
    color: '#0000ff',  // BLUE
    width: 3,
    padding: 10
  }
})

doc.save('examples-output/test-border-debug.pdf')

console.log('✅ PDF created: examples-output/test-border-debug.pdf')
console.log('   Check for:')
console.log('   - Red border (5px thick) around simple pie')
console.log('   - Blue border (3px) around pie with labels/legend\n')
