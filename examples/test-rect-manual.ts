import { PDFDocument } from '../src'

console.log('🔍 Testing manual rectangle drawing...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

doc.text('MANUAL RECT TEST', 200, 720, 24)

// Get access to writer
const writer = (doc as any).writer

// Test 1: Draw a simple rectangle manually
doc.text('Manual green rectangle (should appear below):', 50, 650, 12)
writer.setStrokeColor(0, 1, 0)  // Green
writer.setLineWidth(5)
writer.rect(100, 500, 200, 100)  // x, y, width, height
writer.stroke()

// Test 2: Draw pie + legend WITHOUT border
doc.text('Pie + Legend (no border):', 50, 450, 12)
doc.pieChart({
  data: [
    { label: 'A', value: 50 },
    { label: 'B', value: 50 }
  ],
  x: 150,
  y: 350,
  radius: 60,
  showLabels: false,
  legend: {
    show: true,
    position: 'right'
  },
  border: {
    show: false
  }
})

// Test 3: Draw manual rectangle at EXACT coordinates from debug
doc.text('Manual rectangle at legend border coords:', 50, 220, 12)
// From debug: minX=70.0, minY=470.0, maxX=410.0, maxY=630.0
// But we need to draw it lower on the page
writer.setStrokeColor(1, 0, 0)  // Red
writer.setLineWidth(6)
writer.rect(70, 80, 340, 160)  // Using debug dimensions
writer.stroke()

doc.save('examples-output/test-rect-manual.pdf')

console.log('✅ PDF created: examples-output/test-rect-manual.pdf')
