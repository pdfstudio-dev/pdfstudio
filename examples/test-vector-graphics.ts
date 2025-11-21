import { PDFDocument } from '../src/core/PDFDocument'
import * as path from 'path'
import * as fs from 'fs'

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'output')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

/**
 * Example 1: Transformations - Rotate
 */
function example1() {
  console.log('Example 1: Rotate transformation...')

  const doc = new PDFDocument()

  doc.text('Rotation Examples', 200, 750, 24)

  // Draw square rotated at different angles
  const angles = [0, 15, 30, 45]
  angles.forEach((angle, i) => {
    const x = 100 + i * 120
    const y = 600

    // Save state, rotate, draw, restore
    doc.saveGraphicsState()
    doc.translate(x + 25, y)  // Move to center of square
    doc.rotate(angle)
    doc.setStrokeColor(0.2, 0.4, 0.8)
    doc.setLineWidth(2)
    doc.rect(-25, -25, 50, 50)
    doc.stroke()
    doc.restoreGraphicsState()

    // Label
    doc.text(`${angle}°`, x, y - 50, 10)
  })

  // Rotated text
  doc.text('Rotated Text Examples:', 100, 450, 16)

  const rotations = [0, 45, 90, -45]
  rotations.forEach((rot, i) => {
    const x = 100 + i * 120
    const y = 350

    doc.saveGraphicsState()
    doc.translate(x, y)
    doc.rotate(rot)
    doc.text('Hello!', 0, 0, 14)
    doc.restoreGraphicsState()
  })

  doc.save(path.join(outputDir, 'vector-1-rotate.pdf'))
  console.log('  ✓ Saved: vector-1-rotate.pdf')
}

/**
 * Example 2: Transformations - Scale
 */
function example2() {
  console.log('Example 2: Scale transformation...')

  const doc = new PDFDocument()

  doc.text('Scale Examples', 200, 750, 24)

  // Draw circles at different scales
  const scales = [0.5, 1.0, 1.5, 2.0]
  scales.forEach((scale, i) => {
    const x = 100 + i * 120
    const y = 600

    doc.saveGraphicsState()
    doc.translate(x, y)
    doc.scale(scale)
    doc.setStrokeColor(0.8, 0.2, 0.4)
    doc.setLineWidth(2)
    doc.circle({x: 0, y: 0, radius: 25})
    doc.stroke()
    doc.restoreGraphicsState()

    doc.text(`${scale}x`, x - 10, y - 60, 10)
  })

  // Non-uniform scaling
  doc.text('Non-uniform Scaling:', 100, 450, 16)

  doc.saveGraphicsState()
  doc.translate(150, 350)
  doc.scale(2, 1)  // Stretched horizontally
  doc.setFillColor(0.2, 0.6, 0.8)
  doc.circle({x: 0, y: 0, radius: 30})
  doc.fill()
  doc.restoreGraphicsState()
  doc.text('2x horizontal', 120, 280, 10)

  doc.saveGraphicsState()
  doc.translate(350, 350)
  doc.scale(1, 2)  // Stretched vertically
  doc.setFillColor(0.8, 0.4, 0.2)
  doc.circle({x: 0, y: 0, radius: 30})
  doc.fill()
  doc.restoreGraphicsState()
  doc.text('2x vertical', 330, 280, 10)

  doc.save(path.join(outputDir, 'vector-2-scale.pdf'))
  console.log('  ✓ Saved: vector-2-scale.pdf')
}

/**
 * Example 3: Bezier Curves
 */
function example3() {
  console.log('Example 3: Bezier curves...')

  const doc = new PDFDocument()

  doc.text('Bezier Curve Examples', 200, 750, 24)

  // Simple S-curve
  doc.text('S-Curve:', 100, 680, 14)
  doc.setStrokeColor(0.2, 0.4, 0.8)
  doc.setLineWidth(2)
  doc.moveTo(100, 600)
  doc.bezierCurveTo(100, 500, 300, 500, 300, 600)
  doc.stroke()

  // Heart shape using Bezier curves
  doc.text('Heart Shape (Bezier curves):', 100, 450, 14)
  doc.setFillColor(0.9, 0.2, 0.3)

  const cx = 250
  const cy = 350

  doc.moveTo(cx, cy)
  doc.bezierCurveTo(cx, cy - 30, cx - 50, cy - 50, cx - 50, cy - 30)
  doc.bezierCurveTo(cx - 50, cy - 10, cx, cy + 20, cx, cy + 50)
  doc.bezierCurveTo(cx, cy + 20, cx + 50, cy - 10, cx + 50, cy - 30)
  doc.bezierCurveTo(cx + 50, cy - 50, cx, cy - 30, cx, cy)
  doc.closePath()
  doc.fill()

  // Wavy line
  doc.text('Wavy Line:', 100, 250, 14)
  doc.setStrokeColor(0.2, 0.8, 0.4)
  doc.setLineWidth(3)
  doc.moveTo(100, 180)
  for (let i = 0; i < 4; i++) {
    const x = 100 + i * 100
    doc.bezierCurveTo(x + 25, 150, x + 75, 210, x + 100, 180)
  }
  doc.stroke()

  doc.save(path.join(outputDir, 'vector-3-bezier.pdf'))
  console.log('  ✓ Saved: vector-3-bezier.pdf')
}

/**
 * Example 4: Clipping Paths
 */
function example4() {
  console.log('Example 4: Clipping paths...')

  const doc = new PDFDocument()

  doc.text('Clipping Path Examples', 200, 750, 24)

  // Circle clipping
  doc.text('Circle Clip:', 100, 680, 14)
  doc.saveGraphicsState()
  doc.circle({x: 200, y: 600, radius: 50})
  doc.clip()  // Use circle as clipping mask

  // Draw striped pattern (will be clipped to circle)
  doc.setStrokeColor(0.2, 0.4, 0.8)
  doc.setLineWidth(3)
  for (let i = -10; i < 10; i++) {
    doc.moveTo(200 + i * 10, 550)
    doc.lineTo(200 + i * 10, 650)
    doc.stroke()
  }
  doc.restoreGraphicsState()

  // Star clipping
  doc.text('Star Clip:', 350, 680, 14)
  doc.saveGraphicsState()

  // Draw star path
  const cx = 450, cy = 600, outerRadius = 50, innerRadius = 20
  doc.moveTo(cx, cy - outerRadius)
  for (let i = 0; i < 5; i++) {
    const angle1 = (i * 4 * Math.PI) / 5 - Math.PI / 2
    const angle2 = ((i * 4 + 2) * Math.PI) / 5 - Math.PI / 2
    doc.lineTo(cx + innerRadius * Math.cos(angle1), cy + innerRadius * Math.sin(angle1))
    doc.lineTo(cx + outerRadius * Math.cos(angle2), cy + outerRadius * Math.sin(angle2))
  }
  doc.closePath()
  doc.clip()

  // Fill with gradient-like pattern
  doc.setFillColor(0.9, 0.7, 0.2)
  for (let i = 0; i < 20; i++) {
    doc.circle({x: cx, y: cy - 50 + i * 5, radius: 50})
    doc.fill()
  }
  doc.restoreGraphicsState()

  doc.save(path.join(outputDir, 'vector-4-clipping.pdf'))
  console.log('  ✓ Saved: vector-4-clipping.pdf')
}

/**
 * Example 5: Dash Patterns
 */
function example5() {
  console.log('Example 5: Dash patterns...')

  const doc = new PDFDocument()

  doc.text('Line Dash Patterns', 200, 750, 24)

  const patterns = [
    { pattern: [5, 5], label: '[5, 5] - Equal dash/gap' },
    { pattern: [10, 5], label: '[10, 5] - Long dash, short gap' },
    { pattern: [2, 8], label: '[2, 8] - Dotted line' },
    { pattern: [10, 5, 2, 5], label: '[10, 5, 2, 5] - Dash-dot' },
    { pattern: [15, 3, 3, 3], label: '[15, 3, 3, 3] - Long-short' },
  ]

  doc.setStrokeColor(0.2, 0.4, 0.8)
  doc.setLineWidth(2)

  patterns.forEach((p, i) => {
    const y = 650 - i * 80

    // Label
    doc.text(p.label, 100, y + 15, 11)

    // Draw dashed line
    doc.dash(p.pattern)
    doc.moveTo(100, y)
    doc.lineTo(500, y)
    doc.stroke()
  })

  // Solid line (undash)
  doc.undash()
  doc.text('[] - Solid (no dash)', 100, 250 + 15, 11)
  doc.moveTo(100, 250)
  doc.lineTo(500, 250)
  doc.stroke()

  // Dash with phase offset
  doc.text('Dash with Phase Offset:', 100, 180, 14)
  doc.setStrokeColor(0.8, 0.2, 0.4)

  for (let i = 0; i < 3; i++) {
    const y = 140 - i * 25
    doc.dash([15, 5], i * 5)  // Same pattern, different phase
    doc.moveTo(100, y)
    doc.lineTo(500, y)
    doc.stroke()
    doc.text(`Phase: ${i * 5}`, 510, y - 5, 9)
  }

  doc.save(path.join(outputDir, 'vector-5-dash.pdf'))
  console.log('  ✓ Saved: vector-5-dash.pdf')
}

/**
 * Example 6: Combined - Complex Graphics
 */
function example6() {
  console.log('Example 6: Complex combined graphics...')

  const doc = new PDFDocument()

  doc.text('Complex Vector Graphics', 180, 750, 24)

  // Rotated and scaled pattern
  doc.text('Rotated & Scaled Pattern:', 100, 680, 14)

  for (let i = 0; i < 8; i++) {
    doc.saveGraphicsState()
    doc.translate(250, 550)
    doc.rotate(i * 45)
    doc.scale(0.5 + i * 0.1)

    doc.setFillColor(i / 8, 0.5, 1 - i / 8)
    doc.rect(-20, -20, 40, 40)
    doc.fill()

    doc.restoreGraphicsState()
  }

  // Clipped bezier flower
  doc.text('Clipped Bezier Flower:', 100, 400, 14)

  doc.saveGraphicsState()
  // Hexagon clip
  doc.moveTo(250, 300)
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3
    doc.lineTo(250 + 70 * Math.cos(angle), 300 + 70 * Math.sin(angle))
  }
  doc.closePath()
  doc.clip()

  // Draw flower inside clip
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6
    const hue = i / 12

    doc.saveGraphicsState()
    doc.translate(250, 300)
    doc.rotate(angle * 180 / Math.PI)

    doc.setFillColor(hue, 0.7, 0.9)
    doc.moveTo(0, 0)
    doc.bezierCurveTo(20, -10, 40, -10, 50, 0)
    doc.bezierCurveTo(40, 10, 20, 10, 0, 0)
    doc.closePath()
    doc.fill()

    doc.restoreGraphicsState()
  }
  doc.restoreGraphicsState()

  // Dashed spiral
  doc.text('Dashed Spiral:', 100, 200, 14)

  doc.setStrokeColor(0.8, 0.4, 0.2)
  doc.setLineWidth(2)
  doc.dash([5, 3])

  const cx = 250, cy = 120
  doc.moveTo(cx, cy)

  for (let i = 0; i < 50; i++) {
    const angle = i * 0.3
    const radius = i * 2
    const x = cx + radius * Math.cos(angle)
    const y = cy + radius * Math.sin(angle)

    if (i % 5 === 0) {
      doc.bezierCurveTo(
        cx + (radius - 5) * Math.cos(angle - 0.1),
        cy + (radius - 5) * Math.sin(angle - 0.1),
        cx + (radius + 5) * Math.cos(angle + 0.1),
        cy + (radius + 5) * Math.sin(angle + 0.1),
        x, y
      )
    } else {
      doc.lineTo(x, y)
    }
  }
  doc.stroke()

  doc.save(path.join(outputDir, 'vector-6-complex.pdf'))
  console.log('  ✓ Saved: vector-6-complex.pdf')
}

// Run all examples
console.log('\n=== PDFStudio Vector Graphics Examples ===\n')

example1()
example2()
example3()
example4()
example5()
example6()

console.log('\n=== Vector Graphics Examples Complete! ===')
console.log(`Output directory: ${outputDir}`)
console.log('\nFeatures Demonstrated:')
console.log('  ✅ Transformations (rotate, scale, translate)')
console.log('  ✅ Graphics state (save/restore)')
console.log('  ✅ Bezier curves (cubic)')
console.log('  ✅ Clipping paths')
console.log('  ✅ Dash patterns')
console.log('  ✅ Complex combined graphics\n')
