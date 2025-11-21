import { PDFDocument } from '../src/core/PDFDocument'
import * as path from 'path'
import * as fs from 'fs'

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'output')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

/**
 * Example 1: Basic linear gradients
 */
function example1() {
  console.log('Example 1: Basic linear gradients...')

  const doc = new PDFDocument()

  doc.text('Linear Gradients', 220, 750, 24)

  // Horizontal gradient (left to right)
  doc.text('Horizontal (Left to Right)', 100, 680, 12)
  doc.rectWithGradient(100, 600, 200, 60, {
    x0: 100, y0: 630,  // Start point (left)
    x1: 300, y1: 630,  // End point (right)
    colorStops: [
      { offset: 0, color: [1, 0, 0] },   // Red
      { offset: 1, color: [0, 0, 1] }    // Blue
    ]
  })

  // Vertical gradient (top to bottom)
  doc.text('Vertical (Top to Bottom)', 100, 540, 12)
  doc.rectWithGradient(100, 460, 200, 60, {
    x0: 200, y0: 520,  // Start point (top)
    x1: 200, y1: 460,  // End point (bottom)
    colorStops: [
      { offset: 0, color: [1, 1, 0] },   // Yellow
      { offset: 1, color: [1, 0, 1] }    // Magenta
    ]
  })

  // Diagonal gradient
  doc.text('Diagonal', 100, 400, 12)
  doc.rectWithGradient(100, 320, 200, 60, {
    x0: 100, y0: 380,  // Top-left
    x1: 300, y1: 320,  // Bottom-right
    colorStops: [
      { offset: 0, color: [0, 1, 0] },   // Green
      { offset: 1, color: [0, 1, 1] }    // Cyan
    ]
  })

  // Multiple color stops
  doc.text('Multiple Color Stops (Rainbow)', 100, 260, 12)
  doc.rectWithGradient(100, 180, 400, 60, {
    x0: 100, y0: 210,
    x1: 500, y1: 210,
    colorStops: [
      { offset: 0.0, color: [1, 0, 0] },     // Red
      { offset: 0.17, color: [1, 0.5, 0] },  // Orange
      { offset: 0.33, color: [1, 1, 0] },    // Yellow
      { offset: 0.5, color: [0, 1, 0] },     // Green
      { offset: 0.67, color: [0, 0, 1] },    // Blue
      { offset: 0.83, color: [0.29, 0, 0.51] }, // Indigo
      { offset: 1.0, color: [0.56, 0, 1] }   // Violet
    ]
  })

  doc.save(path.join(outputDir, 'gradient-api-1-linear.pdf'))
  console.log('  ✓ Saved: gradient-api-1-linear.pdf')
}

/**
 * Example 2: Radial gradients
 */
function example2() {
  console.log('Example 2: Radial gradients...')

  const doc = new PDFDocument()

  doc.text('Radial Gradients', 220, 750, 24)

  // Simple radial gradient (center to edge)
  doc.text('Center to Edge', 100, 680, 12)
  doc.fillWithGradient({
    x0: 200, y0: 600, r0: 0,     // Center point, no radius
    x1: 200, y1: 600, r1: 80,    // Same center, large radius
    colorStops: [
      { offset: 0, color: [1, 1, 1] },   // White at center
      { offset: 1, color: [0.2, 0.4, 0.8] }  // Blue at edge
    ]
  })
  doc.moveTo(200 + 80, 600)
  for (let i = 0; i <= 36; i++) {
    const angle = (i / 36) * 2 * Math.PI
    const x = 200 + 80 * Math.cos(angle)
    const y = 600 + 80 * Math.sin(angle)
    doc.lineTo(x, y)
  }
  doc.fill()

  // Radial gradient with offset centers (creates 3D sphere effect)
  doc.text('3D Sphere Effect', 100, 500, 12)
  doc.fillWithGradient({
    x0: 420, y0: 440, r0: 0,     // Light source offset
    x1: 400, y1: 420, r1: 80,    // Sphere center and radius
    colorStops: [
      { offset: 0, color: [1, 1, 0.8] },     // Light yellow highlight
      { offset: 0.5, color: [0.9, 0.5, 0] }, // Orange mid-tone
      { offset: 1, color: [0.5, 0.2, 0] }    // Dark red shadow
    ]
  })
  doc.moveTo(400 + 80, 420)
  for (let i = 0; i <= 36; i++) {
    const angle = (i / 36) * 2 * Math.PI
    const x = 400 + 80 * Math.cos(angle)
    const y = 420 + 80 * Math.sin(angle)
    doc.lineTo(x, y)
  }
  doc.fill()

  // Multiple radial gradients
  doc.text('Multiple Radial Gradients', 100, 300, 12)

  const colors: [number, number, number][][] = [
    [[1, 0, 0], [0.5, 0, 0]],       // Red
    [[0, 1, 0], [0, 0.5, 0]],       // Green
    [[0, 0, 1], [0, 0, 0.5]],       // Blue
    [[1, 1, 0], [0.5, 0.5, 0]]      // Yellow
  ]

  for (let i = 0; i < 4; i++) {
    const x = 150 + (i % 2) * 150
    const y = 240 - Math.floor(i / 2) * 100

    doc.fillWithGradient({
      x0: x, y0: y, r0: 0,
      x1: x, y1: y, r1: 60,
      colorStops: [
        { offset: 0, color: colors[i][0] },
        { offset: 1, color: colors[i][1] }
      ]
    })
    doc.moveTo(x + 60, y)
    for (let j = 0; j <= 36; j++) {
      const angle = (j / 36) * 2 * Math.PI
      const cx = x + 60 * Math.cos(angle)
      const cy = y + 60 * Math.sin(angle)
      doc.lineTo(cx, cy)
    }
    doc.fill()
  }

  doc.save(path.join(outputDir, 'gradient-api-2-radial.pdf'))
  console.log('  ✓ Saved: gradient-api-2-radial.pdf')
}

/**
 * Example 3: Gradients with SVG paths
 */
function example3() {
  console.log('Example 3: Gradients with SVG paths...')

  const doc = new PDFDocument()

  doc.text('Gradients with SVG Paths', 180, 750, 24)

  // Gradient-filled heart
  doc.text('Heart with Gradient', 100, 680, 14)
  const heartPath =
    'M 150,620 ' +
    'C 150,600 130,580 110,580 ' +
    'C 90,580 70,600 70,620 ' +
    'C 70,650 150,700 150,700 ' +
    'C 150,700 230,650 230,620 ' +
    'C 230,600 210,580 190,580 ' +
    'C 170,580 150,600 150,620 Z'

  doc.fillWithGradient({
    x0: 150, y0: 700,
    x1: 150, y1: 580,
    colorStops: [
      { offset: 0, color: [0.8, 0, 0] },    // Dark red
      { offset: 0.5, color: [1, 0.3, 0.3] }, // Light red
      { offset: 1, color: [1, 0.7, 0.7] }   // Pink
    ]
  })
  doc.path(heartPath)
  doc.fill()

  // Star with radial gradient
  doc.text('Star with Radial Gradient', 350, 680, 14)
  const starPath =
    'M 425,580 L 435,610 L 465,610 L 441,628 L 451,658 ' +
    'L 425,640 L 399,658 L 409,628 L 385,610 L 415,610 Z'

  doc.fillWithGradient({
    x0: 425, y0: 620, r0: 0,
    x1: 425, y1: 620, r1: 50,
    colorStops: [
      { offset: 0, color: [1, 1, 0.8] },  // Light yellow center
      { offset: 0.6, color: [1, 0.8, 0] }, // Golden yellow
      { offset: 1, color: [0.8, 0.5, 0] }  // Orange edge
    ]
  })
  doc.path(starPath)
  doc.fill()

  // Cloud with gradient
  doc.text('Cloud with Gradient', 100, 500, 14)
  const cloudPath =
    'M 150,450 ' +
    'Q 140,430 160,430 ' +
    'Q 170,420 185,430 ' +
    'Q 200,420 210,430 ' +
    'Q 220,430 220,445 ' +
    'Q 225,460 210,465 ' +
    'L 150,465 ' +
    'Q 135,460 140,445 ' +
    'Q 140,440 150,450 Z'

  doc.fillWithGradient({
    x0: 175, y0: 465,
    x1: 175, y1: 420,
    colorStops: [
      { offset: 0, color: [0.6, 0.7, 0.85] },
      { offset: 1, color: [0.9, 0.95, 1] }
    ]
  })
  doc.path(cloudPath)
  doc.fill()

  doc.save(path.join(outputDir, 'gradient-api-3-paths.pdf'))
  console.log('  ✓ Saved: gradient-api-3-paths.pdf')
}

/**
 * Example 4: Gradients with transformations
 */
function example4() {
  console.log('Example 4: Gradients with transformations...')

  const doc = new PDFDocument()

  doc.text('Gradients with Transformations', 160, 750, 24)

  // Rotated gradient rectangles
  doc.text('Rotated Rectangles', 100, 680, 14)

  for (let i = 0; i < 8; i++) {
    const angle = i * 45

    doc.saveGraphicsState()
    doc.translate(250, 580)
    doc.rotate(angle)

    doc.rectWithGradient(-100, -20, 200, 40, {
      x0: -100, y0: 0,
      x1: 100, y1: 0,
      colorStops: [
        { offset: 0, color: [1, 0, 0] },
        { offset: 0.5, color: [1, 1, 0] },
        { offset: 1, color: [0, 0, 1] }
      ]
    })

    doc.restoreGraphicsState()
  }

  // Scaled gradient grid
  doc.text('Scaled Gradient Grid', 100, 420, 14)

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 5; col++) {
      const x = 120 + col * 70
      const y = 360 - row * 60
      const scale = 0.4 + (row * 5 + col) * 0.04

      doc.saveGraphicsState()
      doc.translate(x, y)
      doc.scale(scale)

      doc.rectWithGradient(-30, -25, 60, 50, {
        x0: -30, y0: 0,
        x1: 30, y1: 0,
        colorStops: [
          { offset: 0, color: [0.2, 0.4, 0.8] },
          { offset: 1, color: [0.8, 0.2, 0.6] }
        ]
      })

      doc.restoreGraphicsState()
    }
  }

  doc.save(path.join(outputDir, 'gradient-api-4-transforms.pdf'))
  console.log('  ✓ Saved: gradient-api-4-transforms.pdf')
}

/**
 * Example 5: Real-world designs
 */
function example5() {
  console.log('Example 5: Real-world designs...')

  const doc = new PDFDocument()

  doc.text('Real-World Gradient Designs', 170, 750, 24)

  // Sky and ground scene
  doc.text('Sunset Scene', 100, 680, 14)

  // Sky gradient
  doc.rectWithGradient(80, 480, 440, 170, {
    x0: 300, y0: 650,
    x1: 300, y1: 480,
    colorStops: [
      { offset: 0, color: [0.1, 0.2, 0.5] },   // Deep blue at top
      { offset: 0.4, color: [0.4, 0.5, 0.8] }, // Medium blue
      { offset: 0.7, color: [0.9, 0.6, 0.4] }, // Orange near horizon
      { offset: 1, color: [1, 0.8, 0.5] }      // Light yellow at horizon
    ]
  })

  // Sun with radial gradient
  doc.fillWithGradient({
    x0: 450, y0: 580, r0: 0,
    x1: 450, y1: 580, r1: 35,
    colorStops: [
      { offset: 0, color: [1, 1, 0.95] },
      { offset: 0.6, color: [1, 0.9, 0.4] },
      { offset: 1, color: [1, 0.7, 0.3] }
    ]
  })
  doc.moveTo(450 + 35, 580)
  for (let i = 0; i <= 36; i++) {
    const angle = (i / 36) * 2 * Math.PI
    const x = 450 + 35 * Math.cos(angle)
    const y = 580 + 35 * Math.sin(angle)
    doc.lineTo(x, y)
  }
  doc.fill()

  // Ground gradient
  doc.rectWithGradient(80, 380, 440, 100, {
    x0: 300, y0: 480,
    x1: 300, y1: 380,
    colorStops: [
      { offset: 0, color: [0.3, 0.5, 0.3] },  // Green
      { offset: 1, color: [0.2, 0.3, 0.1] }   // Dark green
    ]
  })

  // Modern UI buttons
  doc.text('Modern UI Buttons', 100, 320, 14)

  const buttons: Array<{ y: number; colors: [number, number, number][]; label: string; textColor: [number, number, number] }> = [
    { y: 270, colors: [[0.2, 0.6, 1], [0.1, 0.4, 0.8]], label: 'Primary', textColor: [1, 1, 1] },
    { y: 230, colors: [[0.3, 0.8, 0.4], [0.2, 0.6, 0.3]], label: 'Success', textColor: [1, 1, 1] },
    { y: 190, colors: [[1, 0.7, 0.2], [0.9, 0.5, 0.1]], label: 'Warning', textColor: [0, 0, 0] },
    { y: 150, colors: [[0.9, 0.3, 0.3], [0.7, 0.1, 0.1]], label: 'Danger', textColor: [1, 1, 1] }
  ]

  for (const btn of buttons) {
    // Button with gradient
    doc.rectWithGradient(100, btn.y - 10, 180, 35, {
      x0: 190, y0: btn.y + 15,
      x1: 190, y1: btn.y - 10,
      colorStops: [
        { offset: 0, color: btn.colors[0] },
        { offset: 1, color: btn.colors[1] }
      ]
    })

    // Button label
    doc.setFillColor(btn.textColor[0], btn.textColor[1], btn.textColor[2])
    doc.text(btn.label, 160, btn.y + 5, 14)
  }

  doc.save(path.join(outputDir, 'gradient-api-5-realworld.pdf'))
  console.log('  ✓ Saved: gradient-api-5-realworld.pdf')
}

// Run all examples
console.log('\n=== PDFStudio Gradient API Examples ===\n')

example1()
example2()
example3()
example4()
example5()

console.log('\n=== Gradient API Examples Complete! ===')
console.log(`Output directory: ${outputDir}`)
console.log('\nFeatures Demonstrated:')
console.log('  ✅ fillWithGradient() - Apply gradient to any shape')
console.log('  ✅ rectWithGradient() - Convenience method for rectangles')
console.log('  ✅ Linear gradients (all directions)')
console.log('  ✅ Radial gradients (center-based, offset, 3D effects)')
console.log('  ✅ Multiple color stops (smooth transitions)')
console.log('  ✅ Gradients with SVG paths')
console.log('  ✅ Gradients with transformations')
console.log('  ✅ Real-world UI designs\n')
