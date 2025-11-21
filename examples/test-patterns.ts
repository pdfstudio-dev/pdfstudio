import { PDFDocument } from '../src/core/PDFDocument'
import * as path from 'path'
import * as fs from 'fs'

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'output')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

/**
 * Example 1: Basic patterns (dots, stripes, grid)
 */
function example1() {
  console.log('Example 1: Basic patterns...')

  const doc = new PDFDocument()

  doc.text('Basic Patterns', 230, 750, 24)

  // Polka dots pattern
  doc.text('Polka Dots', 100, 680, 14)
  doc.rectWithPattern(100, 600, 150, 60, {
    width: 20,
    height: 20,
    draw: (ctx) => {
      ctx.setFillColor(1, 0, 0)
      ctx.circle(10, 10, 5)
      ctx.fill()
    }
  })

  // Vertical stripes
  doc.text('Vertical Stripes', 300, 680, 14)
  doc.rectWithPattern(300, 600, 150, 60, {
    width: 10,
    height: 10,
    draw: (ctx) => {
      ctx.setFillColor(0, 0, 0.8)
      ctx.rect(0, 0, 5, 10)
      ctx.fill()
    }
  })

  // Horizontal stripes
  doc.text('Horizontal Stripes', 100, 540, 14)
  doc.rectWithPattern(100, 460, 150, 60, {
    width: 10,
    height: 10,
    draw: (ctx) => {
      ctx.setFillColor(0, 0.7, 0)
      ctx.rect(0, 0, 10, 5)
      ctx.fill()
    }
  })

  // Grid pattern
  doc.text('Grid', 300, 540, 14)
  doc.rectWithPattern(300, 460, 150, 60, {
    width: 15,
    height: 15,
    draw: (ctx) => {
      ctx.setStrokeColor(0.5, 0.5, 0.5)
      ctx.setLineWidth(1)
      ctx.rect(0, 0, 15, 15)
      ctx.stroke()
    }
  })

  // Diagonal stripes
  doc.text('Diagonal Stripes', 100, 400, 14)
  doc.rectWithPattern(100, 320, 150, 60, {
    width: 20,
    height: 20,
    draw: (ctx) => {
      ctx.setStrokeColor(0.7, 0, 0.7)
      ctx.setLineWidth(2)
      ctx.moveTo(0, 20)
      ctx.lineTo(20, 0)
      ctx.stroke()
    }
  })

  // Crosshatch
  doc.text('Crosshatch', 300, 400, 14)
  doc.rectWithPattern(300, 320, 150, 60, {
    width: 15,
    height: 15,
    draw: (ctx) => {
      ctx.setStrokeColor(0.4, 0.4, 0.4)
      ctx.setLineWidth(1)
      ctx.moveTo(0, 15)
      ctx.lineTo(15, 0)
      ctx.stroke()
      ctx.moveTo(0, 0)
      ctx.lineTo(15, 15)
      ctx.stroke()
    }
  })

  doc.save(path.join(outputDir, 'pattern-1-basic.pdf'))
  console.log('  ✓ Saved: pattern-1-basic.pdf')
}

/**
 * Example 2: Geometric patterns
 */
function example2() {
  console.log('Example 2: Geometric patterns...')

  const doc = new PDFDocument()

  doc.text('Geometric Patterns', 200, 750, 24)

  // Circles pattern
  doc.text('Circles Grid', 100, 680, 14)
  doc.rectWithPattern(100, 600, 180, 60, {
    width: 20,
    height: 20,
    draw: (ctx) => {
      ctx.setStrokeColor(0, 0.5, 0.8)
      ctx.setLineWidth(1.5)
      ctx.circle(10, 10, 8)
      ctx.stroke()
    }
  })

  // Triangles
  doc.text('Triangles', 320, 680, 14)
  doc.rectWithPattern(320, 600, 180, 60, {
    width: 20,
    height: 20,
    draw: (ctx) => {
      ctx.setFillColor(0.8, 0.4, 0)
      ctx.moveTo(10, 2)
      ctx.lineTo(18, 18)
      ctx.lineTo(2, 18)
      ctx.fill()
    }
  })

  // Diamonds
  doc.text('Diamonds', 100, 540, 14)
  doc.rectWithPattern(100, 460, 180, 60, {
    width: 20,
    height: 20,
    draw: (ctx) => {
      ctx.setFillColor(0.6, 0, 0.6)
      ctx.moveTo(10, 2)
      ctx.lineTo(18, 10)
      ctx.lineTo(10, 18)
      ctx.lineTo(2, 10)
      ctx.fill()
    }
  })

  // Hexagons (simplified)
  doc.text('Hexagons', 320, 540, 14)
  doc.rectWithPattern(320, 460, 180, 60, {
    width: 24,
    height: 21,
    draw: (ctx) => {
      ctx.setStrokeColor(0, 0.6, 0.3)
      ctx.setLineWidth(1.5)

      // Draw hexagon
      ctx.moveTo(12, 3)
      ctx.lineTo(21, 8)
      ctx.lineTo(21, 16)
      ctx.lineTo(12, 21)
      ctx.lineTo(3, 16)
      ctx.lineTo(3, 8)
      ctx.lineTo(12, 3)
      ctx.stroke()
    }
  })

  // Stars
  doc.text('Stars', 100, 400, 14)
  doc.rectWithPattern(100, 320, 180, 60, {
    width: 25,
    height: 25,
    draw: (ctx) => {
      ctx.setFillColor(1, 0.8, 0)
      // Simple 4-pointed star
      ctx.moveTo(12.5, 2)
      ctx.lineTo(15, 10)
      ctx.lineTo(23, 12.5)
      ctx.lineTo(15, 15)
      ctx.lineTo(12.5, 23)
      ctx.lineTo(10, 15)
      ctx.lineTo(2, 12.5)
      ctx.lineTo(10, 10)
      ctx.fill()
    }
  })

  // Plus signs
  doc.text('Plus Signs', 320, 400, 14)
  doc.rectWithPattern(320, 320, 180, 60, {
    width: 20,
    height: 20,
    draw: (ctx) => {
      ctx.setFillColor(0.9, 0.2, 0.2)
      ctx.rect(8, 4, 4, 12)
      ctx.fill()
      ctx.rect(4, 8, 12, 4)
      ctx.fill()
    }
  })

  doc.save(path.join(outputDir, 'pattern-2-geometric.pdf'))
  console.log('  ✓ Saved: pattern-2-geometric.pdf')
}

/**
 * Example 3: Complex decorative patterns
 */
function example3() {
  console.log('Example 3: Decorative patterns...')

  const doc = new PDFDocument()

  doc.text('Decorative Patterns', 200, 750, 24)

  // Brick pattern
  doc.text('Bricks', 100, 680, 14)
  doc.rectWithPattern(100, 580, 200, 80, {
    width: 40,
    height: 20,
    draw: (ctx) => {
      ctx.setFillColor(0.7, 0.3, 0.2)
      ctx.rect(0, 0, 38, 18)
      ctx.fill()
      ctx.rect(20, -10, 38, 18)
      ctx.fill()

      ctx.setStrokeColor(0.9, 0.9, 0.9)
      ctx.setLineWidth(1)
      ctx.rect(0, 0, 38, 18)
      ctx.stroke()
      ctx.rect(20, -10, 38, 18)
      ctx.stroke()
    }
  })

  // Checkerboard
  doc.text('Checkerboard', 350, 680, 14)
  doc.rectWithPattern(350, 580, 150, 80, {
    width: 20,
    height: 20,
    draw: (ctx) => {
      ctx.setFillColor(0.2, 0.2, 0.2)
      ctx.rect(0, 0, 10, 10)
      ctx.fill()
      ctx.rect(10, 10, 10, 10)
      ctx.fill()
    }
  })

  // Dots with circles
  doc.text('Dot Grid with Outline', 100, 520, 14)
  doc.rectWithPattern(100, 420, 200, 80, {
    width: 25,
    height: 25,
    draw: (ctx) => {
      // Outer circle
      ctx.setStrokeColor(0, 0.5, 0.8)
      ctx.setLineWidth(1)
      ctx.circle(12.5, 12.5, 10)
      ctx.stroke()

      // Inner dot
      ctx.setFillColor(0, 0.5, 0.8)
      ctx.circle(12.5, 12.5, 4)
      ctx.fill()
    }
  })

  // Scale/fish scale pattern
  doc.text('Fish Scales', 350, 520, 14)
  doc.rectWithPattern(350, 420, 150, 80, {
    width: 20,
    height: 15,
    draw: (ctx) => {
      ctx.setStrokeColor(0.2, 0.6, 0.7)
      ctx.setLineWidth(1)

      // Draw overlapping circles to create scale effect
      ctx.circle(10, 0, 10)
      ctx.stroke()
      ctx.circle(0, 15, 10)
      ctx.stroke()
      ctx.circle(20, 15, 10)
      ctx.stroke()
    }
  })

  // Zigzag pattern
  doc.text('Zigzag', 100, 360, 14)
  doc.rectWithPattern(100, 260, 400, 80, {
    width: 20,
    height: 20,
    draw: (ctx) => {
      ctx.setStrokeColor(0.8, 0.4, 0)
      ctx.setLineWidth(2)
      ctx.moveTo(0, 10)
      ctx.lineTo(10, 0)
      ctx.lineTo(20, 10)
      ctx.lineTo(30, 0)
      ctx.stroke()
    }
  })

  doc.save(path.join(outputDir, 'pattern-3-decorative.pdf'))
  console.log('  ✓ Saved: pattern-3-decorative.pdf')
}

/**
 * Example 4: Patterns on different shapes
 */
function example4() {
  console.log('Example 4: Patterns on shapes...')

  const doc = new PDFDocument()

  doc.text('Patterns on Different Shapes', 150, 750, 24)

  // Circle with polka dots
  doc.text('Circle with Dots', 100, 680, 14)
  doc.fillWithPattern({
    width: 15,
    height: 15,
    draw: (ctx) => {
      ctx.setFillColor(0.9, 0.1, 0.3)
      ctx.circle(7.5, 7.5, 3)
      ctx.fill()
    }
  })
  doc.moveTo(180, 600)
  for (let i = 0; i <= 36; i++) {
    const angle = (i / 36) * 2 * Math.PI
    const x = 180 + 60 * Math.cos(angle)
    const y = 600 + 60 * Math.sin(angle)
    doc.lineTo(x, y)
  }
  doc.fill()

  // SVG heart with stripes
  doc.text('Heart with Stripes', 300, 680, 14)
  const heartPath =
    'M 380,620 ' +
    'C 380,600 360,580 340,580 ' +
    'C 320,580 300,600 300,620 ' +
    'C 300,650 380,700 380,700 ' +
    'C 380,700 460,650 460,620 ' +
    'C 460,600 440,580 420,580 ' +
    'C 400,580 380,600 380,620 Z'

  doc.fillWithPattern({
    width: 8,
    height: 8,
    draw: (ctx) => {
      ctx.setFillColor(1, 0.2, 0.4)
      ctx.rect(0, 0, 4, 8)
      ctx.fill()
    }
  })
  doc.path(heartPath)
  doc.fill()

  // Star with grid
  doc.text('Star with Grid', 100, 500, 14)
  const starPath =
    'M 155,420 L 165,450 L 195,450 L 171,468 L 181,498 ' +
    'L 155,480 L 129,498 L 139,468 L 115,450 L 145,450 Z'

  doc.fillWithPattern({
    width: 10,
    height: 10,
    draw: (ctx) => {
      ctx.setStrokeColor(0.3, 0.3, 0.8)
      ctx.setLineWidth(0.5)
      ctx.rect(0, 0, 10, 10)
      ctx.stroke()
    }
  })
  doc.path(starPath)
  doc.fill()

  // Triangle with diagonal stripes
  doc.text('Triangle with Diagonals', 300, 500, 14)
  doc.fillWithPattern({
    width: 12,
    height: 12,
    draw: (ctx) => {
      ctx.setStrokeColor(0, 0.7, 0.5)
      ctx.setLineWidth(1.5)
      ctx.moveTo(0, 12)
      ctx.lineTo(12, 0)
      ctx.stroke()
    }
  })
  doc.moveTo(380, 420)
  doc.lineTo(440, 480)
  doc.lineTo(320, 480)
  doc.fill()

  doc.save(path.join(outputDir, 'pattern-4-shapes.pdf'))
  console.log('  ✓ Saved: pattern-4-shapes.pdf')
}

/**
 * Example 5: Layered patterns with transformations
 */
function example5() {
  console.log('Example 5: Advanced patterns...')

  const doc = new PDFDocument()

  doc.text('Advanced Pattern Techniques', 160, 750, 24)

  // Multiple patterns in one design
  doc.text('Layered Patterns', 100, 680, 14)

  // Background pattern (light grid)
  doc.rectWithPattern(100, 550, 200, 100, {
    width: 20,
    height: 20,
    draw: (ctx) => {
      ctx.setStrokeColor(0.9, 0.9, 0.9)
      ctx.setLineWidth(0.5)
      ctx.rect(0, 0, 20, 20)
      ctx.stroke()
    }
  })

  // Foreground pattern (colored dots) with opacity
  doc.opacity(0.7)
  doc.rectWithPattern(120, 570, 160, 60, {
    width: 20,
    height: 20,
    draw: (ctx) => {
      ctx.setFillColor(0.2, 0.6, 0.9)
      ctx.circle(10, 10, 6)
      ctx.fill()
    }
  })
  doc.opacity(1.0)

  // Pattern with different spacing
  doc.text('Custom Spacing (xStep/yStep)', 100, 500, 14)
  doc.rectWithPattern(100, 400, 200, 80, {
    width: 15,
    height: 15,
    xStep: 25,  // Wider horizontal spacing
    yStep: 20,  // Wider vertical spacing
    draw: (ctx) => {
      ctx.setFillColor(0.8, 0.3, 0.5)
      ctx.circle(7.5, 7.5, 6)
      ctx.fill()
    }
  })

  // Rotated rectangles with pattern
  doc.text('Pattern with Rotation', 100, 340, 14)

  for (let i = 0; i < 4; i++) {
    doc.saveGraphicsState()
    doc.translate(250 + i * 60, 280)
    doc.rotate(i * 20)

    doc.fillWithPattern({
      width: 10,
      height: 10,
      draw: (ctx) => {
        ctx.setFillColor(0.7, 0, 0.7)
        ctx.rect(0, 0, 5, 10)
        ctx.fill()
      }
    })
    doc.rect(-25, -25, 50, 50)
    doc.fill()

    doc.restoreGraphicsState()
  }

  doc.save(path.join(outputDir, 'pattern-5-advanced.pdf'))
  console.log('  ✓ Saved: pattern-5-advanced.pdf')
}

/**
 * Example 6: Real-world use cases
 */
function example6() {
  console.log('Example 6: Real-world use cases...')

  const doc = new PDFDocument()

  doc.text('Real-World Pattern Use Cases', 150, 750, 24)

  // Fabric texture
  doc.text('Fabric Texture', 100, 680, 14)
  doc.rectWithPattern(100, 580, 180, 80, {
    width: 4,
    height: 4,
    draw: (ctx) => {
      ctx.setFillColor(0.4, 0.5, 0.6)
      ctx.rect(0, 0, 2, 4)
      ctx.fill()
      ctx.rect(2, 0, 2, 2)
      ctx.fill()
    }
  })

  // Wood grain (simplified)
  doc.text('Wood Grain', 320, 680, 14)
  doc.rectWithPattern(320, 580, 180, 80, {
    width: 60,
    height: 8,
    draw: (ctx) => {
      ctx.setStrokeColor(0.6, 0.4, 0.2)
      ctx.setLineWidth(1)
      ctx.moveTo(0, 4)
      ctx.lineTo(60, 4)
      ctx.stroke()

      ctx.setStrokeColor(0.5, 0.3, 0.15)
      ctx.setLineWidth(0.5)
      ctx.moveTo(0, 2)
      ctx.lineTo(60, 2)
      ctx.stroke()
      ctx.moveTo(0, 6)
      ctx.lineTo(60, 6)
      ctx.stroke()
    }
  })

  // Paper texture
  doc.text('Paper/Canvas Texture', 100, 520, 14)
  doc.rectWithPattern(100, 420, 180, 80, {
    width: 3,
    height: 3,
    draw: (ctx) => {
      ctx.setFillColor(0.95, 0.95, 0.9)
      ctx.rect(0, 0, 3, 3)
      ctx.fill()
      ctx.setFillColor(0.9, 0.9, 0.85)
      ctx.rect(0, 0, 1, 1)
      ctx.fill()
      ctx.rect(2, 1, 1, 1)
      ctx.fill()
    }
  })

  // Dotted border effect
  doc.text('Dotted Border', 320, 520, 14)
  doc.setStrokeColor(0.5, 0.5, 0.5)
  doc.setLineWidth(1)
  doc.rect(320, 420, 180, 80)
  doc.stroke()

  doc.fillWithPattern({
    width: 10,
    height: 10,
    draw: (ctx) => {
      ctx.setFillColor(0, 0.5, 0.8)
      ctx.circle(5, 5, 2)
      ctx.fill()
    }
  })
  doc.rect(325, 495, 170, 5)
  doc.fill()

  // Background pattern for certificates/documents
  doc.text('Certificate Background', 100, 360, 14)
  doc.rectWithPattern(100, 240, 400, 100, {
    width: 30,
    height: 30,
    draw: (ctx) => {
      ctx.setStrokeColor(0.9, 0.9, 0.95)
      ctx.setLineWidth(0.5)

      // Ornate pattern element
      ctx.moveTo(15, 5)
      ctx.lineTo(25, 15)
      ctx.lineTo(15, 25)
      ctx.lineTo(5, 15)
      ctx.lineTo(15, 5)
      ctx.stroke()

      ctx.circle(15, 15, 3)
      ctx.stroke()
    }
  })

  doc.save(path.join(outputDir, 'pattern-6-realworld.pdf'))
  console.log('  ✓ Saved: pattern-6-realworld.pdf')
}

// Run all examples
console.log('\n=== PDFStudio Pattern Examples ===\n')

example1()
example2()
example3()
example4()
example5()
example6()

console.log('\n=== Pattern Examples Complete! ===')
console.log(`Output directory: ${outputDir}`)
console.log('\nFeatures Demonstrated:')
console.log('  ✅ Basic patterns (dots, stripes, grid)')
console.log('  ✅ Geometric patterns (circles, triangles, diamonds)')
console.log('  ✅ Decorative patterns (bricks, checkerboard, scales)')
console.log('  ✅ Patterns on different shapes (circles, hearts, stars)')
console.log('  ✅ Advanced techniques (layering, custom spacing, rotation)')
console.log('  ✅ Real-world use cases (textures, borders, backgrounds)\\n')
