import { PDFDocument } from '../src'

console.log('🔍 Testing ellipse rotation...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

doc.text('Testing Ellipse Rotation', 200, 750, 18)

// Test rotated ellipses
doc.text('Ellipse - No rotation', 50, 700, 12)
doc.ellipse({
  x: 100,
  y: 650,
  radiusX: 40,
  radiusY: 20,
  rotation: 0,
  fillColor: '#FF6B6B'
})

doc.text('Ellipse - 45° rotation', 200, 700, 12)
doc.ellipse({
  x: 250,
  y: 650,
  radiusX: 40,
  radiusY: 20,
  rotation: 45,
  fillColor: '#4ECDC4'
})

doc.text('Ellipse - 90° rotation', 350, 700, 12)
doc.ellipse({
  x: 400,
  y: 650,
  radiusX: 40,
  radiusY: 20,
  rotation: 90,
  fillColor: '#95E1D3'
})

console.log('Saving PDF...')
doc.save('examples-output/test-ellipse-rotation.pdf')

console.log('✅ PDF created: examples-output/test-ellipse-rotation.pdf\n')
