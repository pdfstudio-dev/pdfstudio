import { PDFDocument } from '../src'
import type { Color } from '../src/types'

console.log('🎨 Testing Native PDF Gradients...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

// ======================
// LINEAR GRADIENTS
// ======================

doc.text('LINEAR GRADIENTS', 50, 750, 18)

// Example 1: Simple horizontal gradient (left to right)
doc.text('1. Horizontal: Red → Blue', 50, 720, 12)
doc.rect(50, 650, 150, 60)
doc.setFillColor(1, 0, 0)  // This will be overridden by gradient
doc.fill()

// Draw rectangle with gradient
const linearGradient1 = {
  x0: 50, y0: 680,      // Start point (left)
  x1: 200, y1: 680,     // End point (right)
  colorStops: [
    { offset: 0, color: [1, 0, 0] as Color },    // Red at start
    { offset: 1, color: [0, 0, 1] as Color }     // Blue at end
  ]
}

doc.rect(50, 650, 150, 60)
doc.circle({
  x: 125,
  y: 680,
  radius: 30,
  fillGradient: linearGradient1
})

// Example 2: Vertical gradient (top to bottom)
doc.text('2. Vertical: Yellow → Orange', 220, 720, 12)

const linearGradient2 = {
  x0: 295, y0: 710,     // Start point (top)
  x1: 295, y1: 650,     // End point (bottom)
  colorStops: [
    { offset: 0, color: [1, 1, 0] as Color },    // Yellow at top
    { offset: 1, color: [1, 0.5, 0] as Color }   // Orange at bottom
  ]
}

doc.circle({
  x: 295,
  y: 680,
  radius: 30,
  fillGradient: linearGradient2
})

// Example 3: Diagonal gradient
doc.text('3. Diagonal: Green → Cyan', 390, 720, 12)

const linearGradient3 = {
  x0: 415, y0: 710,     // Top-left
  x1: 475, y1: 650,     // Bottom-right
  colorStops: [
    { offset: 0, color: [0, 0.8, 0] as Color },  // Green
    { offset: 1, color: [0, 1, 1] as Color }     // Cyan
  ]
}

doc.circle({
  x: 445,
  y: 680,
  radius: 30,
  fillGradient: linearGradient3
})

// Example 4: Multi-color linear gradient
doc.text('4. Multi-color: Rainbow', 50, 620, 12)

const linearGradient4 = {
  x0: 50, y0: 580,
  x1: 350, y1: 580,
  colorStops: [
    { offset: 0.0, color: [1, 0, 0] as Color },    // Red
    { offset: 0.2, color: [1, 0.5, 0] as Color },  // Orange
    { offset: 0.4, color: [1, 1, 0] as Color },    // Yellow
    { offset: 0.6, color: [0, 1, 0] as Color },    // Green
    { offset: 0.8, color: [0, 0, 1] as Color },    // Blue
    { offset: 1.0, color: [0.5, 0, 0.5] as Color } // Purple
  ]
}

doc.rect(50, 550, 300, 60)
doc.ellipse({
  x: 200,
  y: 580,
  radiusX: 150,
  radiusY: 30,
  fillGradient: linearGradient4
})

// ======================
// RADIAL GRADIENTS
// ======================

doc.text('RADIAL GRADIENTS', 50, 500, 18)

// Example 5: Simple radial gradient (center to edge)
doc.text('5. Center to Edge: White → Blue', 50, 470, 12)

const radialGradient1 = {
  x0: 125, y0: 410, r0: 0,     // Inner circle (center point, radius 0)
  x1: 125, y1: 410, r1: 40,    // Outer circle (same center, radius 40)
  colorStops: [
    { offset: 0, color: [1, 1, 1] as Color },     // White at center
    { offset: 1, color: [0, 0.3, 0.8] as Color }  // Blue at edge
  ]
}

doc.circle({
  x: 125,
  y: 410,
  radius: 40,
  fillGradient: radialGradient1
})

// Example 6: Offset radial gradient
doc.text('6. Offset: Yellow → Red', 220, 470, 12)

const radialGradient2 = {
  x0: 285, y0: 420, r0: 0,     // Inner circle (offset from center)
  x1: 295, y1: 410, r1: 40,    // Outer circle (center)
  colorStops: [
    { offset: 0, color: [1, 1, 0] as Color },     // Yellow at offset point
    { offset: 1, color: [1, 0, 0] as Color }      // Red at edge
  ]
}

doc.circle({
  x: 295,
  y: 410,
  radius: 40,
  fillGradient: radialGradient2
})

// Example 7: Multi-color radial gradient
doc.text('7. Multi-color Radial', 390, 470, 12)

const radialGradient3 = {
  x0: 445, y0: 410, r0: 0,
  x1: 445, y1: 410, r1: 40,
  colorStops: [
    { offset: 0.0, color: [1, 1, 1] as Color },    // White
    { offset: 0.3, color: [1, 1, 0] as Color },    // Yellow
    { offset: 0.6, color: [1, 0.5, 0] as Color },  // Orange
    { offset: 1.0, color: [1, 0, 0] as Color }     // Red
  ]
}

doc.circle({
  x: 445,
  y: 410,
  radius: 40,
  fillGradient: radialGradient3
})

// ======================
// GRADIENTS ON DIFFERENT SHAPES
// ======================

doc.text('GRADIENTS ON DIFFERENT SHAPES', 50, 340, 18)

// Example 8: Gradient on Ellipse
doc.text('8. Ellipse', 50, 310, 12)

const ellipseGradient = {
  x0: 50, y0: 270,
  x1: 150, y1: 270,
  colorStops: [
    { offset: 0, color: [0.8, 0, 0.8] as Color },  // Purple
    { offset: 1, color: [0, 0.8, 0.8] as Color }   // Cyan
  ]
}

doc.ellipse({
  x: 100,
  y: 270,
  radiusX: 50,
  radiusY: 30,
  fillGradient: ellipseGradient,
  strokeColor: '#000000',
  strokeWidth: 2
})

// Example 9: Gradient on Polygon (Pentagon)
doc.text('9. Pentagon', 180, 310, 12)

const pentagonGradient = {
  x0: 240, y0: 300,
  x1: 240, y1: 240,
  colorStops: [
    { offset: 0, color: [1, 0.2, 0.2] as Color },  // Light red
    { offset: 1, color: [0.5, 0, 0] as Color }     // Dark red
  ]
}

doc.polygon({
  x: 240,
  y: 270,
  radius: 35,
  sides: 5,
  fillGradient: pentagonGradient,
  strokeColor: '#000000',
  strokeWidth: 2
})

// Example 10: Gradient on Hexagon
doc.text('10. Hexagon', 300, 310, 12)

const hexagonGradient = {
  x0: 360, y0: 305,
  x1: 360, y1: 235,
  colorStops: [
    { offset: 0, color: [0, 1, 0.5] as Color },    // Light green
    { offset: 1, color: [0, 0.4, 0.2] as Color }   // Dark green
  ]
}

doc.polygon({
  x: 360,
  y: 270,
  radius: 35,
  sides: 6,
  fillGradient: hexagonGradient,
  strokeColor: '#000000',
  strokeWidth: 2
})

// Example 11: Gradient on Star
doc.text('11. Star', 420, 310, 12)

const starGradient = {
  x0: 470, y0: 270, r0: 0,
  x1: 470, y1: 270, r1: 40,
  colorStops: [
    { offset: 0, color: [1, 1, 0.8] as Color },    // Light yellow
    { offset: 1, color: [1, 0.6, 0] as Color }     // Orange
  ]
}

// Draw a 5-pointed star using sectors
const starPoints = 5
const outerRadius = 35
const innerRadius = 15
const angleStep = (Math.PI * 2) / starPoints

for (let i = 0; i < starPoints; i++) {
  const outerAngle = (i * angleStep - Math.PI / 2) * 180 / Math.PI
  const innerAngle = ((i + 0.5) * angleStep - Math.PI / 2) * 180 / Math.PI

  doc.sector({
    x: 470,
    y: 270,
    radius: outerRadius,
    startAngle: outerAngle - (180 / starPoints),
    endAngle: outerAngle + (180 / starPoints),
    fillGradient: starGradient,
    strokeColor: '#000000',
    strokeWidth: 1
  })
}

// ======================
// COMPLEX EXAMPLES
// ======================

doc.text('COMPLEX GRADIENT EXAMPLES', 50, 190, 18)

// Example 12: Gradient with stroke
doc.text('12. With Stroke', 50, 160, 12)

const gradientWithStroke = {
  x0: 50, y0: 130,
  x1: 130, y1: 90,
  colorStops: [
    { offset: 0, color: [0.2, 0.4, 0.8] as Color },
    { offset: 1, color: [0.8, 0.2, 0.4] as Color }
  ]
}

doc.circle({
  x: 90,
  y: 110,
  radius: 30,
  fillGradient: gradientWithStroke,
  strokeColor: '#FFD700',
  strokeWidth: 3
})

// Example 13: Overlapping gradients
doc.text('13. Overlapping', 170, 160, 12)

doc.circle({
  x: 200,
  y: 110,
  radius: 25,
  fillGradient: {
    x0: 200, y0: 110, r0: 0,
    x1: 200, y1: 110, r1: 25,
    colorStops: [
      { offset: 0, color: [1, 0, 0] as Color },
      { offset: 1, color: [0.5, 0, 0] as Color }
    ]
  }
})

doc.circle({
  x: 220,
  y: 110,
  radius: 25,
  fillGradient: {
    x0: 220, y0: 110, r0: 0,
    x1: 220, y1: 110, r1: 25,
    colorStops: [
      { offset: 0, color: [0, 0, 1] as Color },
      { offset: 1, color: [0, 0, 0.5] as Color }
    ]
  }
})

// Example 14: Large multi-stop gradient
doc.text('14. Smooth Spectrum', 280, 160, 12)

const spectrumGradient = {
  x0: 280, y0: 110, r0: 0,
  x1: 280, y1: 110, r1: 30,
  colorStops: [
    { offset: 0.00, color: [1, 1, 1] as Color },
    { offset: 0.25, color: [1, 0, 0] as Color },
    { offset: 0.50, color: [0, 1, 0] as Color },
    { offset: 0.75, color: [0, 0, 1] as Color },
    { offset: 1.00, color: [0, 0, 0] as Color }
  ]
}

doc.circle({
  x: 280,
  y: 110,
  radius: 30,
  fillGradient: spectrumGradient
})

doc.save('examples-output/test-gradients.pdf')

console.log('✅ Native PDF gradients created: examples-output/test-gradients.pdf\n')
console.log('Features demonstrated:')
console.log('  • Linear gradients (horizontal, vertical, diagonal)')
console.log('  • Multi-color linear gradients (rainbow effect)')
console.log('  • Radial gradients (center to edge, offset)')
console.log('  • Multi-color radial gradients')
console.log('  • Gradients on various shapes (circles, ellipses, polygons, sectors)')
console.log('  • Gradients with strokes')
console.log('  • Overlapping gradients')
console.log('  • Smooth spectrum gradients with many stops\n')
