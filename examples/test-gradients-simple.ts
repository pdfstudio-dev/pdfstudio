import { PDFDocument } from '../src'

console.log('🎨 Testing Gradients (Approximation Method)...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

doc.text('GRADIENTS - Test Implementation', 200, 750, 18)

// For now, let's create gradient effect using multiple shapes with interpolated colors
// This is a common technique when native PDF gradients are complex

// Example: Linear gradient effect from red to blue
doc.text('Linear Gradient Effect (Red to Blue)', 50, 700, 14)

const x = 50
const y = 600
const width = 200
const height = 100
const steps = 50

// Interpolate colors
for (let i = 0; i < steps; i++) {
  const ratio = i / steps
  const r = 1 - ratio  // Red decreases
  const g = 0
  const b = ratio      // Blue increases

  const rectWidth = width / steps
  const rectX = x + (i * rectWidth)

  doc.rect(rectX, y, rectWidth + 1, height)  // +1 to avoid gaps
  doc.setFillColor(r, g, b)
  doc.fill()
}

// Border around the gradient
doc.rect(x, y, width, height)
doc.setStrokeColor(0, 0, 0)
doc.setLineWidth(1)
doc.stroke()

// Example 2: Radial gradient effect
doc.text('Radial Gradient Effect (Yellow to Orange)', 300, 700, 14)

const centerX = 400
const centerY = 650
const maxRadius = 80
const radialSteps = 40

for (let i = radialSteps; i > 0; i--) {
  const ratio = i / radialSteps
  const radius = maxRadius * ratio

  // Yellow to Orange
  const r = 1
  const g = 0.6 + (0.4 * (1 - ratio))  // 1.0 to 0.6
  const b = 0

  doc.circle({
    x: centerX,
    y: centerY,
    radius: radius,
    fillColor: [r, g, b]
  })
}

doc.save('examples-output/test-gradients-simple.pdf')

console.log('✅ Simple gradient effects created: examples-output/test-gradients-simple.pdf\n')
console.log('Note: This uses color interpolation with multiple shapes.')
console.log('For production, we will implement native PDF gradients with Shading patterns.\n')
