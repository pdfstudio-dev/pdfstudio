import { PDFDocument } from '../src'

console.log('🔍 Testing border with legend only...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

doc.text('LEGEND BORDER TEST', 200, 720, 24)

// Small pie with legend - border should be visible
doc.text('Small pie + legend (RED, 8px thick):', 50, 650, 12)
doc.pieChart({
  data: [
    { label: 'A', value: 50 },
    { label: 'B', value: 50 }
  ],
  x: 150,
  y: 500,
  radius: 50,
  showLabels: false,
  showPercentages: false,
  legend: {
    show: true,
    position: 'right'
  },
  border: {
    show: true,
    color: '#ff0000',
    width: 8,  // VERY THICK
    padding: 20
  }
})

// Draw a reference rectangle manually to verify coordinates
doc.text('Manual rectangle test (should see green box below):', 50, 350, 12)
const writer = (doc as any).writer
writer.setStrokeColor(0, 1, 0)  // Green
writer.setLineWidth(5)
writer.rect(100, 200, 200, 100)  // x, y, width, height
writer.stroke()

doc.save('examples-output/test-border-legend-only.pdf')

console.log('✅ PDF created: examples-output/test-border-legend-only.pdf')
console.log('   Should see:')
console.log('   - RED border (8px) around pie + legend')
console.log('   - GREEN rectangle as reference\n')
