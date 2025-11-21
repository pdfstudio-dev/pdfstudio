import { PDFDocument } from '../src'

console.log('🔍 Testing simple vector shapes to debug...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

doc.text('Testing Simple Shapes', 200, 750, 18)

// Test 1: Simple filled circle
console.log('Test 1: Simple circle with fillColor hex...')
doc.text('1. Simple Circle (hex fill)', 50, 700, 12)
doc.circle({
  x: 100,
  y: 650,
  radius: 30,
  fillColor: '#FF6B6B'
})

// Test 2: Simple circle with RGB array
console.log('Test 2: Simple circle with RGB array...')
doc.text('2. Simple Circle (RGB fill)', 200, 700, 12)
doc.circle({
  x: 250,
  y: 650,
  radius: 30,
  fillColor: [1, 0, 0]
})

// Test 3: Stroked circle
console.log('Test 3: Stroked circle...')
doc.text('3. Stroked Circle', 350, 700, 12)
doc.circle({
  x: 400,
  y: 650,
  radius: 30,
  strokeColor: '#4ECDC4',
  strokeWidth: 2
})

// Test 4: Simple ellipse (no rotation)
console.log('Test 4: Simple ellipse...')
doc.text('4. Simple Ellipse', 50, 550, 12)
doc.ellipse({
  x: 100,
  y: 500,
  radiusX: 40,
  radiusY: 25,
  fillColor: '#95E1D3'
})

// Test 5: Simple triangle
console.log('Test 5: Simple triangle...')
doc.text('5. Triangle', 200, 550, 12)
doc.polygon({
  x: 250,
  y: 500,
  radius: 30,
  sides: 3,
  fillColor: '#FFD93D'
})

// Test 6: Simple arc
console.log('Test 6: Simple arc...')
doc.text('6. Arc', 350, 550, 12)
doc.arc({
  x: 400,
  y: 500,
  radius: 30,
  startAngle: 0,
  endAngle: 90,
  strokeColor: '#AA96DA',
  strokeWidth: 3
})

// Test 7: Simple sector
console.log('Test 7: Simple sector...')
doc.text('7. Sector', 50, 400, 12)
doc.sector({
  x: 100,
  y: 350,
  radius: 30,
  startAngle: 0,
  endAngle: 120,
  fillColor: '#FCBAD3'
})

console.log('Saving PDF...')
doc.save('examples-output/test-vector-simple-debug.pdf')

console.log('✅ PDF created: examples-output/test-vector-simple-debug.pdf\n')
