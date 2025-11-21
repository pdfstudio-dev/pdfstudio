import { PDFDocument } from '../src/core/PDFDocument'
import * as path from 'path'
import * as fs from 'fs'

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'output')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

/**
 * Example 1: All 16 PDF blend modes
 */
function example1() {
  console.log('Example 1: All 16 PDF blend modes...')

  const doc = new PDFDocument()

  doc.text('PDF Blend Modes Showcase', 180, 750, 24)

  // Define all 16 blend modes
  const blendModes = [
    'Normal', 'Multiply', 'Screen', 'Overlay',
    'Darken', 'Lighten', 'ColorDodge', 'ColorBurn',
    'HardLight', 'SoftLight', 'Difference', 'Exclusion',
    'Hue', 'Saturation', 'Color', 'Luminosity'
  ]

  // Draw a grid of blend mode examples (4x4)
  let row = 0
  let col = 0

  for (const mode of blendModes) {
    const x = 80 + col * 130
    const y = 680 - row * 160

    // Label
    doc.text(mode, x, y + 10, 10)

    // Base layer (cyan circle)
    doc.setFillColor(0, 0.8, 0.8)
    doc.circle({ x: x + 30, y: y - 30, radius: 25 })
    doc.fill()

    // Top layer with blend mode (magenta circle)
    doc.blendMode(mode)
    doc.setFillColor(0.8, 0, 0.8)
    doc.circle({ x: x + 50, y: y - 30, radius: 25 })
    doc.fill()

    // Reset to normal
    doc.blendMode('Normal')

    col++
    if (col >= 4) {
      col = 0
      row++
    }
  }

  doc.save(path.join(outputDir, 'blend-1-all-modes.pdf'))
  console.log('  ✓ Saved: blend-1-all-modes.pdf')
}

/**
 * Example 2: Opacity levels
 */
function example2() {
  console.log('Example 2: Opacity levels...')

  const doc = new PDFDocument()

  doc.text('Opacity Examples', 220, 750, 24)

  // Opacity gradient from 1.0 to 0.0
  doc.text('Opacity Gradient (1.0 to 0.0)', 100, 680, 14)

  for (let i = 0; i <= 10; i++) {
    const opacity = 1.0 - i * 0.1
    const x = 100 + i * 40

    doc.opacity(opacity)
    doc.setFillColor(0.2, 0.4, 0.8)
    doc.rect(x, 600, 35, 60)
    doc.fill()
  }

  // Reset opacity
  doc.opacity(1.0)

  // Overlapping circles with different opacities
  doc.text('Overlapping Circles (opacity 0.5)', 100, 520, 14)

  doc.opacity(0.5)
  doc.setFillColor(1, 0, 0) // Red
  doc.circle({ x: 150, y: 450, radius: 40 })
  doc.fill()

  doc.setFillColor(0, 1, 0) // Green
  doc.circle({ x: 200, y: 450, radius: 40 })
  doc.fill()

  doc.setFillColor(0, 0, 1) // Blue
  doc.circle({ x: 175, y: 400, radius: 40 })
  doc.fill()

  // Reset opacity
  doc.opacity(1.0)

  // Text with opacity
  doc.text('Text with Opacity', 320, 680, 14)

  doc.opacity(1.0)
  doc.text('Opacity 1.0 (Opaque)', 320, 650, 12)

  doc.opacity(0.7)
  doc.text('Opacity 0.7', 320, 630, 12)

  doc.opacity(0.5)
  doc.text('Opacity 0.5', 320, 610, 12)

  doc.opacity(0.3)
  doc.text('Opacity 0.3', 320, 590, 12)

  doc.opacity(0.1)
  doc.text('Opacity 0.1 (Almost transparent)', 320, 570, 12)

  doc.save(path.join(outputDir, 'blend-2-opacity.pdf'))
  console.log('  ✓ Saved: blend-2-opacity.pdf')
}

/**
 * Example 3: Multiply blend mode (darkening)
 */
function example3() {
  console.log('Example 3: Multiply blend mode...')

  const doc = new PDFDocument()

  doc.text('Multiply Blend Mode', 200, 750, 24)

  // Background with gradient
  doc.text('Multiply creates darker overlapping areas', 100, 700, 12)

  // Red square
  doc.setFillColor(1, 0, 0)
  doc.rect(150, 550, 100, 100)
  doc.fill()

  // Yellow square with multiply
  doc.blendMode('Multiply')
  doc.setFillColor(1, 1, 0)
  doc.rect(200, 600, 100, 100)
  doc.fill()

  // Reset
  doc.blendMode('Normal')

  // Another example: overlapping color bands
  doc.text('Overlapping Color Bands', 100, 480, 14)

  const colors = [
    [1, 0, 0],     // Red
    [1, 0.5, 0],   // Orange
    [1, 1, 0],     // Yellow
    [0, 1, 0],     // Green
    [0, 0, 1],     // Blue
    [0.5, 0, 1]    // Purple
  ]

  for (let i = 0; i < colors.length; i++) {
    doc.blendMode('Multiply')
    doc.setFillColor(colors[i][0], colors[i][1], colors[i][2])
    doc.rect(100 + i * 60, 350, 100, 80)
    doc.fill()
  }

  doc.save(path.join(outputDir, 'blend-3-multiply.pdf'))
  console.log('  ✓ Saved: blend-3-multiply.pdf')
}

/**
 * Example 4: Screen blend mode (lightening)
 */
function example4() {
  console.log('Example 4: Screen blend mode...')

  const doc = new PDFDocument()

  doc.text('Screen Blend Mode', 210, 750, 24)

  doc.text('Screen creates lighter overlapping areas', 100, 700, 12)

  // Dark background
  doc.setFillColor(0.1, 0.1, 0.2)
  doc.rect(100, 500, 400, 150)
  doc.fill()

  // Overlapping circles with screen blend
  doc.blendMode('Screen')

  doc.setFillColor(0.8, 0.2, 0.2)
  doc.circle({ x: 200, y: 575, radius: 50 })
  doc.fill()

  doc.setFillColor(0.2, 0.8, 0.2)
  doc.circle({ x: 280, y: 575, radius: 50 })
  doc.fill()

  doc.setFillColor(0.2, 0.2, 0.8)
  doc.circle({ x: 240, y: 615, radius: 50 })
  doc.fill()

  // Reset
  doc.blendMode('Normal')

  // Light beams effect
  doc.text('Light Beams Effect', 100, 420, 14)

  doc.setFillColor(0.05, 0.05, 0.1)
  doc.rect(100, 250, 400, 150)
  doc.fill()

  doc.blendMode('Screen')
  for (let i = 0; i < 8; i++) {
    doc.setFillColor(0.9, 0.9, 0.5)
    doc.opacity(0.3)
    doc.rect(120 + i * 50, 250, 30, 150)
    doc.fill()
  }

  doc.save(path.join(outputDir, 'blend-4-screen.pdf'))
  console.log('  ✓ Saved: blend-4-screen.pdf')
}

/**
 * Example 5: Overlay and HardLight modes
 */
function example5() {
  console.log('Example 5: Overlay and HardLight modes...')

  const doc = new PDFDocument()

  doc.text('Overlay & HardLight Blend Modes', 150, 750, 24)

  // Overlay example
  doc.text('Overlay Mode', 100, 680, 16)

  // Base image (gradient simulation with rectangles)
  for (let i = 0; i < 20; i++) {
    const gray = 0.2 + (i / 20) * 0.6
    doc.setFillColor(gray, gray, gray)
    doc.rect(100 + i * 10, 550, 10, 100)
    doc.fill()
  }

  // Overlay colored rectangle
  doc.blendMode('Overlay')
  doc.setFillColor(0.8, 0.2, 0.4)
  doc.rect(150, 550, 150, 100)
  doc.fill()

  // Reset
  doc.blendMode('Normal')

  // HardLight example
  doc.text('HardLight Mode', 100, 480, 16)

  // Base image
  for (let i = 0; i < 20; i++) {
    const gray = 0.2 + (i / 20) * 0.6
    doc.setFillColor(gray, gray, gray)
    doc.rect(100 + i * 10, 350, 10, 100)
    doc.fill()
  }

  // HardLight colored rectangle
  doc.blendMode('HardLight')
  doc.setFillColor(0.2, 0.4, 0.8)
  doc.rect(150, 350, 150, 100)
  doc.fill()

  doc.save(path.join(outputDir, 'blend-5-overlay-hardlight.pdf'))
  console.log('  ✓ Saved: blend-5-overlay-hardlight.pdf')
}

/**
 * Example 6: Difference and Exclusion modes
 */
function example6() {
  console.log('Example 6: Difference and Exclusion modes...')

  const doc = new PDFDocument()

  doc.text('Difference & Exclusion Modes', 160, 750, 24)

  // Difference mode
  doc.text('Difference Mode', 100, 680, 16)

  // Base layer
  doc.setFillColor(0.8, 0.2, 0.2)
  doc.circle({ x: 180, y: 600, radius: 60 })
  doc.fill()

  // Overlapping shape with Difference
  doc.blendMode('Difference')
  doc.setFillColor(0.2, 0.8, 0.8)
  doc.circle({ x: 240, y: 600, radius: 60 })
  doc.fill()

  // Reset
  doc.blendMode('Normal')

  // Exclusion mode
  doc.text('Exclusion Mode', 100, 480, 16)

  // Base layer
  doc.setFillColor(0.2, 0.2, 0.8)
  doc.circle({ x: 180, y: 400, radius: 60 })
  doc.fill()

  // Overlapping shape with Exclusion
  doc.blendMode('Exclusion')
  doc.setFillColor(0.8, 0.8, 0.2)
  doc.circle({ x: 240, y: 400, radius: 60 })
  doc.fill()

  // Reset
  doc.blendMode('Normal')

  // Pattern example with Difference
  doc.text('Pattern with Difference', 350, 680, 14)

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const gray = ((i + j) % 2) * 0.5 + 0.2
      doc.setFillColor(gray, gray, gray)
      doc.rect(360 + i * 20, 580 + j * 20, 20, 20)
      doc.fill()
    }
  }

  doc.blendMode('Difference')
  doc.setFillColor(1, 0.5, 0)
  doc.circle({ x: 410, y: 630, radius: 45 })
  doc.fill()

  doc.save(path.join(outputDir, 'blend-6-difference-exclusion.pdf'))
  console.log('  ✓ Saved: blend-6-difference-exclusion.pdf')
}

/**
 * Example 7: Combining blend modes with opacity
 */
function example7() {
  console.log('Example 7: Combining blend modes with opacity...')

  const doc = new PDFDocument()

  doc.text('Blend Modes + Opacity', 190, 750, 24)

  // Example 1: Multiply + Opacity
  doc.text('Multiply + Varying Opacity', 100, 680, 14)

  // Base rectangle
  doc.setFillColor(0.2, 0.4, 0.8)
  doc.rect(100, 550, 200, 100)
  doc.fill()

  // Overlapping rectangles with multiply and varying opacity
  const opacities = [1.0, 0.7, 0.5, 0.3]
  for (let i = 0; i < opacities.length; i++) {
    doc.blendMode('Multiply')
    doc.opacity(opacities[i])
    doc.setFillColor(0.9, 0.2, 0.2)
    doc.rect(150 + i * 40, 550, 80, 100)
    doc.fill()
  }

  // Reset
  doc.blendMode('Normal')
  doc.opacity(1.0)

  // Example 2: Screen + Opacity
  doc.text('Screen + Opacity 0.6', 100, 480, 14)

  // Dark background
  doc.setFillColor(0.1, 0.1, 0.15)
  doc.rect(100, 350, 200, 100)
  doc.fill()

  // Glowing circles
  doc.blendMode('Screen')
  doc.opacity(0.6)

  doc.setFillColor(1, 0.8, 0)
  doc.circle({ x: 150, y: 400, radius: 30 })
  doc.fill()

  doc.setFillColor(0, 0.8, 1)
  doc.circle({ x: 200, y: 400, radius: 30 })
  doc.fill()

  doc.setFillColor(1, 0, 0.8)
  doc.circle({ x: 250, y: 400, radius: 30 })
  doc.fill()

  // Reset
  doc.blendMode('Normal')
  doc.opacity(1.0)

  // Example 3: Overlay + Low Opacity
  doc.text('Overlay + Opacity 0.4 (Subtle tint)', 100, 280, 14)

  // Grayscale gradient
  for (let i = 0; i < 30; i++) {
    const gray = i / 30
    doc.setFillColor(gray, gray, gray)
    doc.rect(100 + i * 6, 180, 6, 60)
    doc.fill()
  }

  // Colored overlay
  doc.blendMode('Overlay')
  doc.opacity(0.4)
  doc.setFillColor(0.8, 0.4, 0.8)
  doc.rect(130, 180, 120, 60)
  doc.fill()

  doc.save(path.join(outputDir, 'blend-7-combined.pdf'))
  console.log('  ✓ Saved: blend-7-combined.pdf')
}

/**
 * Example 8: Creative effects with blend modes
 */
function example8() {
  console.log('Example 8: Creative effects...')

  const doc = new PDFDocument()

  doc.text('Creative Blend Mode Effects', 170, 750, 24)

  // Neon glow effect
  doc.text('Neon Glow Effect', 100, 680, 14)

  // Dark background
  doc.setFillColor(0.05, 0.05, 0.1)
  doc.rect(80, 500, 200, 150)
  doc.fill()

  // Glowing text simulation with circles
  doc.blendMode('Screen')

  // Outer glow (larger, more transparent)
  doc.opacity(0.2)
  doc.setFillColor(0, 1, 1)
  doc.circle({ x: 180, y: 575, radius: 45 })
  doc.fill()

  // Middle glow
  doc.opacity(0.4)
  doc.circle({ x: 180, y: 575, radius: 30 })
  doc.fill()

  // Inner core
  doc.opacity(0.8)
  doc.circle({ x: 180, y: 575, radius: 15 })
  doc.fill()

  // Reset
  doc.blendMode('Normal')
  doc.opacity(1.0)

  // Watercolor effect
  doc.text('Watercolor Effect', 320, 680, 14)

  // Base layer
  doc.blendMode('Multiply')
  doc.opacity(0.3)

  const colors = [
    [0.9, 0.3, 0.3],
    [0.3, 0.3, 0.9],
    [0.9, 0.9, 0.3],
    [0.3, 0.9, 0.3]
  ]

  for (let i = 0; i < 4; i++) {
    doc.setFillColor(colors[i][0], colors[i][1], colors[i][2])
    const x = 360 + (i % 2) * 60
    const y = 540 + Math.floor(i / 2) * 60
    doc.circle({ x, y, radius: 40 })
    doc.fill()
  }

  // Reset
  doc.blendMode('Normal')
  doc.opacity(1.0)

  // Glass effect
  doc.text('Glass Effect', 100, 420, 14)

  // Background with gradient
  for (let i = 0; i < 40; i++) {
    const color = 0.3 + (i / 40) * 0.5
    doc.setFillColor(color, color * 0.8, color * 1.2)
    doc.rect(100 + i * 4, 300, 4, 80)
    doc.fill()
  }

  // Glass pane with overlay and low opacity
  doc.blendMode('Overlay')
  doc.opacity(0.15)
  doc.setFillColor(1, 1, 1)
  doc.rect(120, 300, 120, 80)
  doc.fill()

  doc.save(path.join(outputDir, 'blend-8-creative.pdf'))
  console.log('  ✓ Saved: blend-8-creative.pdf')
}

// Run all examples
console.log('\n=== PDFStudio Blend Modes Examples ===\n')

example1()
example2()
example3()
example4()
example5()
example6()
example7()
example8()

console.log('\n=== Blend Modes Examples Complete! ===')
console.log(`Output directory: ${outputDir}`)
console.log('\nFeatures Demonstrated:')
console.log('  ✅ All 16 PDF blend modes (Normal, Multiply, Screen, etc.)')
console.log('  ✅ Opacity control (0-1)')
console.log('  ✅ Combining blend modes with opacity')
console.log('  ✅ Creative effects (neon glow, watercolor, glass)')
console.log('  ✅ Practical use cases for each mode\n')
