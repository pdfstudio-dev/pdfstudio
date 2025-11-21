import { PDFDocument } from '../src/core/PDFDocument'
import * as path from 'path'
import * as fs from 'fs'

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'output')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

/**
 * Example 1: Basic clipping with rectangles and circles
 */
function example1() {
  console.log('Example 1: Basic clipping...')

  const doc = new PDFDocument()

  doc.text('Basic Clipping', 230, 750, 24)

  // Circle clipped by rectangle
  doc.text('Circle Clipped by Rectangle', 100, 680, 12)
  doc.saveGraphicsState()
  doc.clipRect(100, 600, 150, 60)
  doc.setFillColor(0.2, 0.6, 0.9)
  doc.moveTo(175 + 80, 630)
  for (let i = 0; i <= 36; i++) {
    const angle = (i / 36) * 2 * Math.PI
    const x = 175 + 80 * Math.cos(angle)
    const y = 630 + 80 * Math.sin(angle)
    doc.lineTo(x, y)
  }
  doc.fill()
  doc.restoreGraphicsState()

  // Draw rectangle outline to show clipping boundary
  doc.setStrokeColor(0.5, 0.5, 0.5)
  doc.setLineWidth(1)
  doc.rect(100, 600, 150, 60)
  doc.stroke()

  // Rectangle clipped by circle
  doc.text('Rectangle Clipped by Circle', 300, 680, 12)
  doc.saveGraphicsState()
  doc.clipCircle(375, 630, 40)
  doc.setFillColor(0.9, 0.2, 0.4)
  doc.rect(315, 570, 120, 120)
  doc.fill()
  doc.restoreGraphicsState()

  // Draw circle outline
  doc.setStrokeColor(0.5, 0.5, 0.5)
  doc.moveTo(375 + 40, 630)
  for (let i = 0; i <= 36; i++) {
    const angle = (i / 36) * 2 * Math.PI
    const x = 375 + 40 * Math.cos(angle)
    const y = 630 + 40 * Math.sin(angle)
    doc.lineTo(x, y)
  }
  doc.stroke()

  // Triangle clipped by custom path
  doc.text('Triangle Clipped by Star', 100, 520, 12)
  doc.saveGraphicsState()

  // Star clipping path
  const starPath =
    'M 175,460 L 185,490 L 215,490 L 191,508 L 201,538 ' +
    'L 175,520 L 149,538 L 159,508 L 135,490 L 165,490 Z'
  doc.clipPath(starPath)

  // Draw triangle
  doc.setFillColor(1, 0.7, 0)
  doc.moveTo(175, 420)
  doc.lineTo(235, 560)
  doc.lineTo(115, 560)
  doc.fill()
  doc.restoreGraphicsState()

  // Draw star outline
  doc.setStrokeColor(0.5, 0.5, 0.5)
  doc.path(starPath)
  doc.stroke()

  doc.save(path.join(outputDir, 'clip-1-basic.pdf'))
  console.log('  ✓ Saved: clip-1-basic.pdf')
}

/**
 * Example 2: Even-odd clipping (donut shapes, holes)
 */
function example2() {
  console.log('Example 2: Even-odd clipping...')

  const doc = new PDFDocument()

  doc.text('Even-Odd Clipping (Holes)', 180, 750, 24)

  // Donut shape (circle with hole)
  doc.text('Donut Shape', 100, 680, 12)
  doc.saveGraphicsState()

  // Outer circle
  doc.moveTo(175 + 60, 600)
  for (let i = 0; i <= 36; i++) {
    const angle = (i / 36) * 2 * Math.PI
    const x = 175 + 60 * Math.cos(angle)
    const y = 600 + 60 * Math.sin(angle)
    doc.lineTo(x, y)
  }

  // Inner circle (hole)
  doc.moveTo(175 + 30, 600)
  for (let i = 0; i <= 36; i++) {
    const angle = (i / 36) * 2 * Math.PI
    const x = 175 + 30 * Math.cos(angle)
    const y = 600 + 30 * Math.sin(angle)
    doc.lineTo(x, y)
  }

  doc.clipEvenOdd()

  // Fill with pattern
  doc.fillWithPattern({
    width: 10,
    height: 10,
    draw: (ctx) => {
      ctx.setFillColor(0.9, 0.2, 0.3)
      ctx.rect(0, 0, 5, 10)
      ctx.fill()
    }
  })
  doc.rect(115, 540, 120, 120)
  doc.fill()
  doc.restoreGraphicsState()

  // Square with hole
  doc.text('Square with Hole', 300, 680, 12)
  doc.saveGraphicsState()

  // Outer square
  doc.rect(325, 560, 100, 100)

  // Inner square (hole)
  doc.rect(355, 590, 40, 40)

  doc.clipEvenOdd()

  // Fill with gradient
  doc.fillWithGradient({
    x0: 325, y0: 660,
    x1: 425, y1: 560,
    colorStops: [
      { offset: 0, color: [0.2, 0.4, 0.8] },
      { offset: 1, color: [0.8, 0.2, 0.6] }
    ]
  })
  doc.rect(325, 560, 100, 100)
  doc.fill()
  doc.restoreGraphicsState()

  // Star with hole
  doc.text('Star with Hole', 100, 480, 12)
  doc.saveGraphicsState()

  // Outer star
  const outerStar =
    'M 175,420 L 185,450 L 215,450 L 191,468 L 201,498 ' +
    'L 175,480 L 149,498 L 159,468 L 135,450 L 165,450 Z'
  doc.path(outerStar)

  // Inner star (smaller, creates hole)
  doc.moveTo(175, 450)
  doc.lineTo(180, 460)
  doc.lineTo(190, 460)
  doc.lineTo(183, 467)
  doc.lineTo(186, 477)
  doc.lineTo(175, 470)
  doc.lineTo(164, 477)
  doc.lineTo(167, 467)
  doc.lineTo(160, 460)
  doc.lineTo(170, 460)
  doc.closePath()

  doc.clipEvenOdd()

  doc.setFillColor(1, 0.8, 0)
  doc.rect(135, 400, 80, 100)
  doc.fill()
  doc.restoreGraphicsState()

  doc.save(path.join(outputDir, 'clip-2-evenodd.pdf'))
  console.log('  ✓ Saved: clip-2-evenodd.pdf')
}

/**
 * Example 3: Clipping with gradients and patterns
 */
function example3() {
  console.log('Example 3: Clipping with gradients and patterns...')

  const doc = new PDFDocument()

  doc.text('Clipping with Gradients & Patterns', 130, 750, 24)

  // Circle with gradient
  doc.text('Gradient in Circle', 100, 680, 14)
  doc.saveGraphicsState()
  doc.clipCircle(175, 600, 60)
  doc.fillWithGradient({
    x0: 175, y0: 660, r0: 0,
    x1: 175, y1: 660, r1: 80,
    colorStops: [
      { offset: 0, color: [1, 1, 0.8] },
      { offset: 0.5, color: [1, 0.5, 0.2] },
      { offset: 1, color: [0.5, 0.1, 0.3] }
    ]
  })
  doc.rect(115, 540, 120, 120)
  doc.fill()
  doc.restoreGraphicsState()

  // Star with pattern
  doc.text('Pattern in Star', 320, 680, 14)
  doc.saveGraphicsState()

  const starPath =
    'M 395,540 L 405,570 L 435,570 L 411,588 L 421,618 ' +
    'L 395,600 L 369,618 L 379,588 L 355,570 L 385,570 Z'
  doc.clipPath(starPath)

  doc.fillWithPattern({
    width: 15,
    height: 15,
    draw: (ctx) => {
      ctx.setFillColor(0, 0.6, 0.8)
      ctx.circle(7.5, 7.5, 4)
      ctx.fill()
    }
  })
  doc.rect(355, 540, 80, 80)
  doc.fill()
  doc.restoreGraphicsState()

  // Heart with rainbow gradient
  doc.text('Rainbow Gradient in Heart', 100, 480, 14)
  doc.saveGraphicsState()

  const heartPath =
    'M 175,440 ' +
    'C 175,420 155,400 135,400 ' +
    'C 115,400 95,420 95,440 ' +
    'C 95,470 175,520 175,520 ' +
    'C 175,520 255,470 255,440 ' +
    'C 255,420 235,400 215,400 ' +
    'C 195,400 175,420 175,440 Z'
  doc.clipPath(heartPath)

  doc.rectWithGradient(95, 400, 160, 120, {
    x0: 95, y0: 460,
    x1: 255, y1: 460,
    colorStops: [
      { offset: 0, color: [1, 0, 0] },
      { offset: 0.2, color: [1, 0.5, 0] },
      { offset: 0.4, color: [1, 1, 0] },
      { offset: 0.6, color: [0, 1, 0] },
      { offset: 0.8, color: [0, 0, 1] },
      { offset: 1, color: [0.5, 0, 0.5] }
    ]
  })
  doc.restoreGraphicsState()

  doc.save(path.join(outputDir, 'clip-3-gradients.pdf'))
  console.log('  ✓ Saved: clip-3-gradients.pdf')
}

/**
 * Example 4: Nested clipping (multiple levels)
 */
function example4() {
  console.log('Example 4: Nested clipping...')

  const doc = new PDFDocument()

  doc.text('Nested Clipping (Multiple Levels)', 130, 750, 24)

  // Level 1: Rectangle clip
  doc.text('3 Levels of Clipping', 100, 680, 14)

  doc.saveGraphicsState()
  // Level 1: Clip to rectangle
  doc.clipRect(100, 520, 240, 140)

  doc.saveGraphicsState()
  // Level 2: Clip to circle
  doc.clipCircle(220, 590, 70)

  doc.saveGraphicsState()
  // Level 3: Clip to star
  const starPath =
    'M 220,560 L 230,590 L 260,590 L 236,608 L 246,638 ' +
    'L 220,620 L 194,638 L 204,608 L 180,590 L 210,590 Z'
  doc.clipPath(starPath)

  // Now draw with all three clips active
  doc.fillWithGradient({
    x0: 100, y0: 520,
    x1: 340, y1: 660,
    colorStops: [
      { offset: 0, color: [1, 0.2, 0.3] },
      { offset: 0.5, color: [0.9, 0.7, 0.2] },
      { offset: 1, color: [0.2, 0.6, 0.9] }
    ]
  })
  doc.rect(100, 520, 240, 140)
  doc.fill()

  doc.restoreGraphicsState()
  doc.restoreGraphicsState()
  doc.restoreGraphicsState()

  // Draw outlines to show clipping boundaries
  doc.setStrokeColor(0.5, 0.5, 0.5)
  doc.setLineWidth(1)
  doc.rect(100, 520, 240, 140)
  doc.stroke()

  doc.moveTo(220 + 70, 590)
  for (let i = 0; i <= 36; i++) {
    const angle = (i / 36) * 2 * Math.PI
    const x = 220 + 70 * Math.cos(angle)
    const y = 590 + 70 * Math.sin(angle)
    doc.lineTo(x, y)
  }
  doc.stroke()

  doc.path(starPath)
  doc.stroke()

  // Progressive clipping demonstration
  doc.text('Progressive Clipping', 100, 460, 14)

  const positions = [100, 200, 300, 400]
  const radii = [60, 50, 40, 30]

  for (let i = 0; i < 4; i++) {
    doc.saveGraphicsState()

    // Stack multiple circle clips
    for (let j = 0; j <= i; j++) {
      doc.clipCircle(positions[i], 360, radii[j])
    }

    doc.setFillColor(0.2 * i, 0.8 - 0.2 * i, 0.5)
    doc.rect(positions[i] - 60, 300, 120, 120)
    doc.fill()

    doc.restoreGraphicsState()

    // Draw outline of outermost clip
    doc.setStrokeColor(0.5, 0.5, 0.5)
    doc.setLineWidth(0.5)
    doc.moveTo(positions[i] + radii[0], 360)
    for (let j = 0; j <= 36; j++) {
      const angle = (j / 36) * 2 * Math.PI
      const x = positions[i] + radii[0] * Math.cos(angle)
      const y = 360 + radii[0] * Math.sin(angle)
      doc.lineTo(x, y)
    }
    doc.stroke()
  }

  doc.save(path.join(outputDir, 'clip-4-nested.pdf'))
  console.log('  ✓ Saved: clip-4-nested.pdf')
}

/**
 * Example 5: Text clipping and complex shapes
 */
function example5() {
  console.log('Example 5: Advanced clipping...')

  const doc = new PDFDocument()

  doc.text('Advanced Clipping Techniques', 150, 750, 24)

  // Multiple shapes combined
  doc.text('Combined Shape Clipping', 100, 680, 14)
  doc.saveGraphicsState()

  // Create complex clipping path
  doc.rect(100, 560, 80, 80)
  doc.moveTo(210, 600)
  for (let i = 0; i <= 36; i++) {
    const angle = (i / 36) * 2 * Math.PI
    const x = 210 + 30 * Math.cos(angle)
    const y = 600 + 30 * Math.sin(angle)
    doc.lineTo(x, y)
  }
  doc.clip()

  doc.fillWithPattern({
    width: 20,
    height: 20,
    draw: (ctx) => {
      ctx.setFillColor(0.8, 0.3, 0.5)
      ctx.circle(10, 10, 5)
      ctx.fill()
      ctx.setStrokeColor(0.5, 0.5, 0.5)
      ctx.setLineWidth(0.5)
      ctx.rect(0, 0, 20, 20)
      ctx.stroke()
    }
  })
  doc.rect(80, 540, 180, 120)
  doc.fill()
  doc.restoreGraphicsState()

  // Clipping with transformation
  doc.text('Rotated Clipping', 300, 680, 14)
  doc.saveGraphicsState()
  doc.translate(390, 600)
  doc.rotate(45)

  doc.rect(-40, -40, 80, 80)
  doc.clip()

  doc.fillWithGradient({
    x0: -60, y0: -60,
    x1: 60, y1: 60,
    colorStops: [
      { offset: 0, color: [0.2, 0.8, 0.4] },
      { offset: 1, color: [0.8, 0.2, 0.8] }
    ]
  })
  doc.rect(-60, -60, 120, 120)
  doc.fill()
  doc.restoreGraphicsState()

  // Waveform clipping
  doc.text('Wave Pattern Clipping', 100, 480, 14)
  doc.saveGraphicsState()

  // Create wave path
  doc.moveTo(100, 420)
  for (let x = 0; x <= 300; x += 5) {
    const y = 420 + 30 * Math.sin((x / 50) * Math.PI)
    doc.lineTo(100 + x, y)
  }
  doc.lineTo(400, 360)
  doc.lineTo(100, 360)
  doc.closePath()
  doc.clip()

  doc.fillWithPattern({
    width: 25,
    height: 25,
    draw: (ctx) => {
      ctx.setFillColor(0.2, 0.5, 0.8)
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
  doc.rect(100, 360, 300, 80)
  doc.fill()
  doc.restoreGraphicsState()

  doc.save(path.join(outputDir, 'clip-5-advanced.pdf'))
  console.log('  ✓ Saved: clip-5-advanced.pdf')
}

/**
 * Example 6: Real-world use cases
 */
function example6() {
  console.log('Example 6: Real-world use cases...')

  const doc = new PDFDocument()

  doc.text('Real-World Clipping Use Cases', 140, 750, 24)

  // Profile picture frame (circular)
  doc.text('Profile Picture Frame', 100, 680, 14)
  doc.saveGraphicsState()
  doc.clipCircle(175, 600, 50)

  // Simulate photo with gradient
  doc.fillWithGradient({
    x0: 125, y0: 650,
    x1: 225, y1: 550,
    colorStops: [
      { offset: 0, color: [0.3, 0.4, 0.6] },
      { offset: 0.5, color: [0.7, 0.6, 0.5] },
      { offset: 1, color: [0.5, 0.3, 0.4] }
    ]
  })
  doc.rect(125, 550, 100, 100)
  doc.fill()
  doc.restoreGraphicsState()

  // Draw frame
  doc.setStrokeColor(0.7, 0.7, 0.7)
  doc.setLineWidth(3)
  doc.moveTo(175 + 50, 600)
  for (let i = 0; i <= 36; i++) {
    const angle = (i / 36) * 2 * Math.PI
    const x = 175 + 50 * Math.cos(angle)
    const y = 600 + 50 * Math.sin(angle)
    doc.lineTo(x, y)
  }
  doc.stroke()

  // Badge/emblem with star
  doc.text('Badge/Emblem', 320, 680, 14)
  doc.saveGraphicsState()

  // Star clipping shape
  const badgeStar =
    'M 395,560 L 405,590 L 435,590 L 411,608 L 421,638 ' +
    'L 395,620 L 369,638 L 379,608 L 355,590 L 385,590 Z'
  doc.clipPath(badgeStar)

  // Radial gradient background
  doc.fillWithGradient({
    x0: 395, y0: 600, r0: 0,
    x1: 395, y1: 600, r1: 60,
    colorStops: [
      { offset: 0, color: [1, 0.9, 0.3] },
      { offset: 1, color: [0.8, 0.5, 0.1] }
    ]
  })
  doc.rect(355, 560, 80, 80)
  doc.fill()
  doc.restoreGraphicsState()

  // Border
  doc.setStrokeColor(0.6, 0.4, 0)
  doc.setLineWidth(2)
  doc.path(badgeStar)
  doc.stroke()

  // Window with curtain effect
  doc.text('Window/Viewport', 100, 500, 14)
  doc.saveGraphicsState()

  // Rounded rectangle clip (window)
  const windowPath =
    'M 120,440 L 220,440 Q 230,440 230,450 L 230,490 Q 230,500 220,500 ' +
    'L 120,500 Q 110,500 110,490 L 110,450 Q 110,440 120,440 Z'
  doc.clipPath(windowPath)

  // Scene visible through window
  doc.fillWithGradient({
    x0: 170, y0: 500,
    x1: 170, y1: 440,
    colorStops: [
      { offset: 0, color: [0.4, 0.6, 0.3] },
      { offset: 0.7, color: [0.6, 0.8, 0.9] },
      { offset: 1, color: [0.3, 0.5, 0.8] }
    ]
  })
  doc.rect(110, 440, 120, 60)
  doc.fill()

  // Sun
  doc.setFillColor(1, 0.9, 0.3)
  doc.moveTo(190, 460)
  for (let i = 0; i <= 36; i++) {
    const angle = (i / 36) * 2 * Math.PI
    const x = 190 + 12 * Math.cos(angle)
    const y = 460 + 12 * Math.sin(angle)
    doc.lineTo(x, y)
  }
  doc.fill()
  doc.restoreGraphicsState()

  // Window frame
  doc.setStrokeColor(0.4, 0.3, 0.2)
  doc.setLineWidth(3)
  doc.path(windowPath)
  doc.stroke()

  doc.save(path.join(outputDir, 'clip-6-realworld.pdf'))
  console.log('  ✓ Saved: clip-6-realworld.pdf')
}

// Run all examples
console.log('\n=== PDFStudio Clipping Path Examples ===\n')

example1()
example2()
example3()
example4()
example5()
example6()

console.log('\n=== Clipping Path Examples Complete! ===')
console.log(`Output directory: ${outputDir}`)
console.log('\nFeatures Demonstrated:')
console.log('  ✅ Basic clipping (rectangle, circle, SVG path)')
console.log('  ✅ Even-odd clipping (donut shapes, holes)')
console.log('  ✅ Clipping with gradients and patterns')
console.log('  ✅ Nested clipping (multiple levels)')
console.log('  ✅ Advanced techniques (transformations, complex shapes)')
console.log('  ✅ Real-world use cases (frames, badges, windows)\\n')
