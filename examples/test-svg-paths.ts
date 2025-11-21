import { PDFDocument } from '../src/core/PDFDocument'
import * as path from 'path'
import * as fs from 'fs'

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'output')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

/**
 * Example 1: Simple SVG paths
 */
function example1() {
  console.log('Example 1: Simple SVG paths...')

  const doc = new PDFDocument()

  doc.text('SVG Path Examples', 200, 750, 24)

  // Simple line path
  doc.text('Line Path: M L', 100, 680, 12)
  doc.setStrokeColor(0.2, 0.4, 0.8)
  doc.setLineWidth(2)
  doc.path('M 100,650 L 200,650 L 200,600 L 100,600 Z')
  doc.stroke()

  // Curve path (Quadratic)
  doc.text('Quadratic Curve: Q', 100, 550, 12)
  doc.setStrokeColor(0.8, 0.2, 0.4)
  doc.path('M 100,500 Q 150,450 200,500')
  doc.stroke()

  // Curve path (Cubic Bezier)
  doc.text('Cubic Bezier: C', 100, 420, 12)
  doc.setStrokeColor(0.2, 0.8, 0.4)
  doc.path('M 100,370 C 125,320 175,320 200,370')
  doc.stroke()

  // Horizontal and Vertical lines
  doc.text('H/V Lines', 300, 680, 12)
  doc.setStrokeColor(0.4, 0.2, 0.8)
  doc.path('M 300,650 H 400 V 600 H 300 Z')
  doc.fill()

  doc.save(path.join(outputDir, 'svg-1-simple.pdf'))
  console.log('  ✓ Saved: svg-1-simple.pdf')
}

/**
 * Example 2: Complex SVG shapes (Heart, Star)
 */
function example2() {
  console.log('Example 2: Complex SVG shapes...')

  const doc = new PDFDocument()

  doc.text('Complex SVG Shapes', 200, 750, 24)

  // Heart shape using SVG path
  doc.text('Heart (SVG Path)', 100, 680, 14)
  doc.setFillColor(0.9, 0.2, 0.3)
  const heartPath =
    'M 150,620 ' +
    'C 150,600 130,580 110,580 ' +
    'C 90,580 70,600 70,620 ' +
    'C 70,650 150,700 150,700 ' +
    'C 150,700 230,650 230,620 ' +
    'C 230,600 210,580 190,580 ' +
    'C 170,580 150,600 150,620 Z'
  doc.path(heartPath)
  doc.fill()

  // Star shape
  doc.text('Star (SVG Path)', 350, 680, 14)
  doc.setFillColor(0.9, 0.7, 0.2)
  const starPath =
    'M 425,580 L 435,610 L 465,610 L 441,628 L 451,658 ' +
    'L 425,640 L 399,658 L 409,628 L 385,610 L 415,610 Z'
  doc.path(starPath)
  doc.fill()

  // Lightning bolt
  doc.text('Lightning (SVG Path)', 100, 500, 14)
  doc.setFillColor(1, 0.8, 0)
  const lightningPath =
    'M 150,470 L 130,420 L 145,420 L 135,370 ' +
    'L 165,420 L 155,420 L 165,470 Z'
  doc.path(lightningPath)
  doc.fill()

  // Cloud shape with curves
  doc.text('Cloud (SVG Path with Curves)', 300, 500, 14)
  doc.setFillColor(0.7, 0.8, 0.9)
  const cloudPath =
    'M 340,450 ' +
    'Q 330,430 350,430 ' +
    'Q 360,420 375,430 ' +
    'Q 390,420 400,430 ' +
    'Q 410,430 410,445 ' +
    'Q 415,460 400,465 ' +
    'L 340,465 ' +
    'Q 325,460 330,445 ' +
    'Q 330,440 340,450 Z'
  doc.path(cloudPath)
  doc.fill()

  doc.save(path.join(outputDir, 'svg-2-shapes.pdf'))
  console.log('  ✓ Saved: svg-2-shapes.pdf')
}

/**
 * Example 3: Relative vs Absolute coordinates
 */
function example3() {
  console.log('Example 3: Relative vs absolute coordinates...')

  const doc = new PDFDocument()

  doc.text('Relative vs Absolute SVG Paths', 150, 750, 24)

  // Absolute coordinates (uppercase)
  doc.text('Absolute (M L): Triangle', 100, 680, 12)
  doc.setStrokeColor(0.2, 0.4, 0.8)
  doc.setLineWidth(2)
  doc.path('M 100,650 L 150,600 L 200,650 Z')
  doc.stroke()

  // Relative coordinates (lowercase)
  doc.text('Relative (m l): Triangle', 300, 680, 12)
  doc.setStrokeColor(0.8, 0.2, 0.4)
  doc.path('m 300,650 l 50,-50 l 50,50 z')
  doc.stroke()

  // Mixed coordinates
  doc.text('Mixed: Square spiral', 100, 550, 12)
  doc.setStrokeColor(0.2, 0.8, 0.4)
  doc.path('M 150,500 l 60,0 l 0,60 l -60,0 l 0,-60 m 10,10 l 40,0 l 0,40 l -40,0 z')
  doc.stroke()

  // Smooth curves (S command)
  doc.text('Smooth Curves (S): Wave', 100, 400, 12)
  doc.setStrokeColor(0.4, 0.2, 0.8)
  doc.setLineWidth(3)
  doc.path('M 100,350 C 120,320 140,320 160,350 S 200,380 220,350 S 260,320 280,350')
  doc.stroke()

  doc.save(path.join(outputDir, 'svg-3-relative.pdf'))
  console.log('  ✓ Saved: svg-3-relative.pdf')
}

/**
 * Example 4: SVG Paths from real icons
 */
function example4() {
  console.log('Example 4: Real icon SVG paths...')

  const doc = new PDFDocument()

  doc.text('Icon SVG Paths', 220, 750, 24)

  // Check icon
  doc.text('Check Icon', 100, 680, 12)
  doc.setStrokeColor(0.2, 0.8, 0.4)
  doc.setLineWidth(3)
  doc.path('M 100,640 L 130,670 L 180,600')
  doc.stroke()

  // X icon (close)
  doc.text('Close Icon', 250, 680, 12)
  doc.setStrokeColor(0.9, 0.3, 0.3)
  doc.setLineWidth(3)
  doc.path('M 250,640 L 290,680 M 290,640 L 250,680')
  doc.stroke()

  // Arrow icon
  doc.text('Arrow Icon', 400, 680, 12)
  doc.setStrokeColor(0.3, 0.5, 0.9)
  doc.setLineWidth(3)
  doc.path('M 400,640 L 450,660 L 400,680 M 450,660 L 420,660')
  doc.stroke()

  // Home icon (simplified)
  doc.text('Home Icon', 100, 550, 12)
  doc.setStrokeColor(0.5, 0.3, 0.7)
  doc.setLineWidth(2)
  doc.path('M 100,520 L 150,480 L 200,520 L 200,570 L 100,570 Z M 130,540 L 130,570 L 170,570 L 170,540 Z')
  doc.stroke()

  // Settings icon (gear simplified)
  doc.text('Settings Icon', 300, 550, 12)
  doc.setFillColor(0.4, 0.4, 0.4)
  doc.path('M 350,480 L 370,480 L 370,490 L 380,500 L 370,510 L 370,520 L 350,520 L 350,510 L 340,500 L 350,490 Z')
  doc.fill()

  // Circle in center of gear
  doc.setFillColor(1, 1, 1)
  doc.circle({ x: 360, y: 500, radius: 8 })
  doc.fill()

  doc.save(path.join(outputDir, 'svg-4-icons.pdf'))
  console.log('  ✓ Saved: svg-4-icons.pdf')
}

/**
 * Example 5: Combining SVG paths with transforms
 */
function example5() {
  console.log('Example 5: SVG paths with transforms...')

  const doc = new PDFDocument()

  doc.text('SVG Paths + Transformations', 170, 750, 24)

  // Rotated heart
  for (let i = 0; i < 4; i++) {
    doc.saveGraphicsState()
    doc.translate(300, 600)
    doc.rotate(i * 90)

    doc.setFillColor(0.9, 0.2, 0.3)
    const heartPath =
      'M 0,-40 ' +
      'C 0,-50 -10,-60 -20,-60 ' +
      'C -30,-60 -40,-50 -40,-40 ' +
      'C -40,-20 0,20 0,20 ' +
      'C 0,20 40,-20 40,-40 ' +
      'C 40,-50 30,-60 20,-60 ' +
      'C 10,-60 0,-50 0,-40 Z'
    doc.path(heartPath)
    doc.fill()

    doc.restoreGraphicsState()
  }

  // Scaled stars
  doc.text('Scaled Stars', 100, 420, 14)
  for (let i = 1; i <= 4; i++) {
    doc.saveGraphicsState()
    doc.translate(100 + i * 70, 350)
    doc.scale(i * 0.3)

    doc.setFillColor(0.9, 0.7, 0.2)
    const starPath =
      'M 0,-30 L 8,-10 L 30,-10 L 12,2 L 18,22 ' +
      'L 0,10 L -18,22 L -12,2 L -30,-10 L -8,-10 Z'
    doc.path(starPath)
    doc.fill()

    doc.restoreGraphicsState()
  }

  doc.save(path.join(outputDir, 'svg-5-transforms.pdf'))
  console.log('  ✓ Saved: svg-5-transforms.pdf')
}

// Run all examples
console.log('\n=== PDFStudio SVG Path Parsing Examples ===\n')

example1()
example2()
example3()
example4()
example5()

console.log('\n=== SVG Path Examples Complete! ===')
console.log(`Output directory: ${outputDir}`)
console.log('\nFeatures Demonstrated:')
console.log('  ✅ SVG path parsing (M, L, C, Q, H, V, Z)')
console.log('  ✅ Relative and absolute coordinates')
console.log('  ✅ Complex shapes (hearts, stars, clouds)')
console.log('  ✅ Icon paths')
console.log('  ✅ SVG paths with transformations')
console.log('  ✅ Smooth curves (S, T commands)\n')
