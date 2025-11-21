import { PDFDocument } from '../src'

console.log('🔷 Testing vector shapes...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

// ======================
// Page 1: Circles and Ellipses
// ======================

doc.text('VECTOR SHAPES - Circles & Ellipses', 150, 750, 20)

// Example 1: Simple filled circle
doc.text('1. Filled Circle', 50, 710, 12)
doc.circle({
  x: 120,
  y: 650,
  radius: 40,
  fillColor: '#FF6B6B'
})

// Example 2: Stroked circle
doc.text('2. Stroked Circle', 50, 550, 12)
doc.circle({
  x: 120,
  y: 490,
  radius: 40,
  strokeColor: '#4ECDC4',
  strokeWidth: 3
})

// Example 3: Filled and stroked circle
doc.text('3. Filled & Stroked', 220, 710, 12)
doc.circle({
  x: 300,
  y: 650,
  radius: 40,
  fillColor: '#95E1D3',
  strokeColor: '#38A798',
  strokeWidth: 2
})

// Example 4: Dashed circle
doc.text('4. Dashed Circle', 220, 550, 12)
doc.circle({
  x: 300,
  y: 490,
  radius: 40,
  strokeColor: '#F38181',
  strokeWidth: 2,
  dashPattern: [5, 3]
})

// Example 5: Simple ellipse
doc.text('5. Ellipse (Horizontal)', 400, 710, 12)
doc.ellipse({
  x: 480,
  y: 650,
  radiusX: 60,
  radiusY: 35,
  fillColor: '#AA96DA'
})

// Example 6: Rotated ellipse
doc.text('6. Rotated Ellipse (45°)', 400, 550, 12)
doc.ellipse({
  x: 480,
  y: 490,
  radiusX: 50,
  radiusY: 30,
  rotation: 45,
  fillColor: '#FCBAD3',
  strokeColor: '#F18FA1',
  strokeWidth: 2
})

// Example 7: Vertical ellipse
doc.text('7. Ellipse (Vertical)', 50, 400, 12)
doc.ellipse({
  x: 120,
  y: 340,
  radiusX: 30,
  radiusY: 55,
  fillColor: '#FFD93D',
  strokeColor: '#FFA800',
  strokeWidth: 2
})

// Example 8: Multiple concentric circles
doc.text('8. Concentric Circles', 220, 400, 12)
doc.circle({
  x: 300,
  y: 340,
  radius: 50,
  strokeColor: '#E74C3C',
  strokeWidth: 2
})
doc.circle({
  x: 300,
  y: 340,
  radius: 35,
  strokeColor: '#F39C12',
  strokeWidth: 2
})
doc.circle({
  x: 300,
  y: 340,
  radius: 20,
  strokeColor: '#27AE60',
  strokeWidth: 2
})

// ======================
// Page 2: Polygons
// ======================
doc.addPage()

doc.text('VECTOR SHAPES - Polygons', 180, 750, 20)

let currentY = 710

// Triangle (3 sides)
doc.text('Triangle (3 sides)', 50, currentY, 12)
doc.polygon({
  x: 120,
  y: currentY - 60,
  radius: 40,
  sides: 3,
  fillColor: '#FF6B6B'
})

// Square (4 sides)
doc.text('Square (4 sides)', 200, currentY, 12)
doc.polygon({
  x: 270,
  y: currentY - 60,
  radius: 40,
  sides: 4,
  fillColor: '#4ECDC4',
  strokeColor: '#2E8B8B',
  strokeWidth: 2
})

// Pentagon (5 sides)
doc.text('Pentagon (5 sides)', 350, currentY, 12)
doc.polygon({
  x: 420,
  y: currentY - 60,
  radius: 40,
  sides: 5,
  fillColor: '#95E1D3',
  strokeColor: '#38A798',
  strokeWidth: 2
})

currentY -= 150

// Hexagon (6 sides)
doc.text('Hexagon (6 sides)', 50, currentY, 12)
doc.polygon({
  x: 120,
  y: currentY - 60,
  radius: 40,
  sides: 6,
  fillColor: '#FFD93D'
})

// Heptagon (7 sides)
doc.text('Heptagon (7 sides)', 200, currentY, 12)
doc.polygon({
  x: 270,
  y: currentY - 60,
  radius: 40,
  sides: 7,
  strokeColor: '#F38181',
  strokeWidth: 2
})

// Octagon (8 sides)
doc.text('Octagon (8 sides)', 350, currentY, 12)
doc.polygon({
  x: 420,
  y: currentY - 60,
  radius: 40,
  sides: 8,
  fillColor: '#AA96DA',
  strokeColor: '#7D5BA6',
  strokeWidth: 2
})

currentY -= 150

// Star-like (12 sides)
doc.text('Dodecagon (12 sides)', 50, currentY, 12)
doc.polygon({
  x: 120,
  y: currentY - 60,
  radius: 40,
  sides: 12,
  fillColor: '#FCBAD3'
})

// Rotated triangle
doc.text('Triangle (Rotated 180°)', 200, currentY, 12)
doc.polygon({
  x: 270,
  y: currentY - 60,
  radius: 40,
  sides: 3,
  rotation: 180,
  fillColor: '#E74C3C',
  strokeColor: '#C0392B',
  strokeWidth: 2
})

// Rotated square (diamond)
doc.text('Square (Rotated 45°)', 350, currentY, 12)
doc.polygon({
  x: 420,
  y: currentY - 60,
  radius: 40,
  sides: 4,
  rotation: 45,
  fillColor: '#3498DB',
  strokeColor: '#2980B9',
  strokeWidth: 2
})

// Dashed hexagon
currentY -= 150
doc.text('Dashed Hexagon', 50, currentY, 12)
doc.polygon({
  x: 120,
  y: currentY - 60,
  radius: 40,
  sides: 6,
  strokeColor: '#9B59B6',
  strokeWidth: 3,
  dashPattern: [8, 4]
})

// ======================
// Page 3: Arcs and Sectors
// ======================
doc.addPage()

doc.text('VECTOR SHAPES - Arcs & Sectors', 170, 750, 20)

currentY = 710

// Example 1: Simple arc (quarter circle)
doc.text('1. Arc (90°)', 50, currentY, 12)
doc.arc({
  x: 120,
  y: currentY - 60,
  radius: 40,
  startAngle: 0,
  endAngle: 90,
  strokeColor: '#FF6B6B',
  strokeWidth: 3
})

// Example 2: Arc (semicircle)
doc.text('2. Arc (180°)', 200, currentY, 12)
doc.arc({
  x: 270,
  y: currentY - 60,
  radius: 40,
  startAngle: 0,
  endAngle: 180,
  strokeColor: '#4ECDC4',
  strokeWidth: 3
})

// Example 3: Arc (three-quarters)
doc.text('3. Arc (270°)', 350, currentY, 12)
doc.arc({
  x: 420,
  y: currentY - 60,
  radius: 40,
  startAngle: 0,
  endAngle: 270,
  strokeColor: '#95E1D3',
  strokeWidth: 3
})

currentY -= 150

// Example 4: Sector (quarter pie)
doc.text('4. Sector (90°)', 50, currentY, 12)
doc.sector({
  x: 120,
  y: currentY - 60,
  radius: 40,
  startAngle: 0,
  endAngle: 90,
  fillColor: '#FFD93D'
})

// Example 5: Sector (half pie)
doc.text('5. Sector (180°)', 200, currentY, 12)
doc.sector({
  x: 270,
  y: currentY - 60,
  radius: 40,
  startAngle: 45,
  endAngle: 225,
  fillColor: '#F38181',
  strokeColor: '#E74C3C',
  strokeWidth: 2
})

// Example 6: Sector (three-quarters)
doc.text('6. Sector (270°)', 350, currentY, 12)
doc.sector({
  x: 420,
  y: currentY - 60,
  radius: 40,
  startAngle: 0,
  endAngle: 270,
  fillColor: '#AA96DA',
  strokeColor: '#7D5BA6',
  strokeWidth: 2
})

currentY -= 150

// Example 7: Dashed arc
doc.text('7. Dashed Arc', 50, currentY, 12)
doc.arc({
  x: 120,
  y: currentY - 60,
  radius: 40,
  startAngle: 0,
  endAngle: 270,
  strokeColor: '#3498DB',
  strokeWidth: 3,
  dashPattern: [10, 5]
})

// Example 8: Pac-Man (sector with stroke)
doc.text('8. Pac-Man Effect', 200, currentY, 12)
doc.sector({
  x: 270,
  y: currentY - 60,
  radius: 40,
  startAngle: 30,
  endAngle: 330,
  fillColor: '#F39C12',
  strokeColor: '#E67E22',
  strokeWidth: 2
})

// Example 9: Pie chart slices
doc.text('9. Pie Chart Slices', 350, currentY, 12)
const pieX = 420
const pieY = currentY - 60
doc.sector({
  x: pieX,
  y: pieY,
  radius: 40,
  startAngle: 0,
  endAngle: 120,
  fillColor: '#E74C3C'
})
doc.sector({
  x: pieX,
  y: pieY,
  radius: 40,
  startAngle: 120,
  endAngle: 240,
  fillColor: '#F39C12'
})
doc.sector({
  x: pieX,
  y: pieY,
  radius: 40,
  startAngle: 240,
  endAngle: 360,
  fillColor: '#27AE60'
})

// ======================
// Page 4: Bezier Curves and Complex Shapes
// ======================
doc.addPage()

doc.text('VECTOR SHAPES - Bezier Curves & Complex', 130, 750, 20)

currentY = 710

// Example 1: Simple curved path
doc.text('1. Bezier Curve', 50, currentY, 12)
doc.moveTo(50, currentY - 20)
doc.curveTo(100, currentY - 80, 150, currentY - 80, 200, currentY - 20)
doc.setStrokeColor(0.95, 0.42, 0.42)
doc.setLineWidth(3)
doc.stroke()

// Example 2: S-curve
doc.text('2. S-Curve', 250, currentY, 12)
doc.moveTo(250, currentY - 20)
doc.curveTo(300, currentY - 80, 350, currentY + 40, 400, currentY - 20)
doc.setStrokeColor(0.31, 0.80, 0.77)
doc.setLineWidth(3)
doc.stroke()

currentY -= 150

// Example 3: Wavy line
doc.text('3. Wavy Line', 50, currentY, 12)
doc.moveTo(50, currentY - 40)
doc.curveTo(100, currentY - 80, 100, currentY, 150, currentY - 40)
doc.curveTo(200, currentY - 80, 200, currentY, 250, currentY - 40)
doc.curveTo(300, currentY - 80, 300, currentY, 350, currentY - 40)
doc.setStrokeColor(0.58, 0.35, 0.71)
doc.setLineWidth(3)
doc.stroke()

currentY -= 120

// Example 4: Heart shape (using multiple curves)
doc.text('4. Heart Shape', 50, currentY, 12)
const heartX = 120
const heartY = currentY - 60

// Left half of heart
doc.moveTo(heartX, heartY - 20)
doc.curveTo(heartX, heartY - 40, heartX - 30, heartY - 40, heartX - 30, heartY - 20)
doc.curveTo(heartX - 30, heartY, heartX, heartY + 30, heartX, heartY + 40)

// Right half of heart
doc.curveTo(heartX, heartY + 30, heartX + 30, heartY, heartX + 30, heartY - 20)
doc.curveTo(heartX + 30, heartY - 40, heartX, heartY - 40, heartX, heartY - 20)

doc.setFillColor(1, 0.42, 0.42)
doc.fill()

// Example 5: Cloud shape
doc.text('5. Cloud Shape', 200, currentY, 12)
const cloudX = 280
const cloudY = currentY - 50

doc.circle({ x: cloudX - 20, y: cloudY, radius: 20, fillColor: '#ECECEC' })
doc.circle({ x: cloudX, y: cloudY - 10, radius: 25, fillColor: '#ECECEC' })
doc.circle({ x: cloudX + 20, y: cloudY, radius: 20, fillColor: '#ECECEC' })
doc.circle({ x: cloudX + 10, y: cloudY + 10, radius: 15, fillColor: '#ECECEC' })
doc.circle({ x: cloudX - 10, y: cloudY + 10, radius: 15, fillColor: '#ECECEC' })

// Example 6: Star using polygons and rotation
doc.text('6. 5-Point Star', 380, currentY, 12)
const starX = 450
const starY = currentY - 50

// Outer pentagon
doc.polygon({
  x: starX,
  y: starY,
  radius: 35,
  sides: 5,
  fillColor: '#F39C12'
})

// Inner pentagon (rotated)
doc.polygon({
  x: starX,
  y: starY,
  radius: 15,
  sides: 5,
  rotation: 36,
  fillColor: '#FFFFFF'
})

currentY -= 120

// Example 7: Flower using circles
doc.text('7. Flower Pattern', 50, currentY, 12)
const flowerX = 120
const flowerY = currentY - 60
const petalRadius = 15
const petalDistance = 25

// Petals (6 circles around center)
for (let i = 0; i < 6; i++) {
  const angle = (i * 60 * Math.PI) / 180
  const px = flowerX + petalDistance * Math.cos(angle)
  const py = flowerY + petalDistance * Math.sin(angle)
  doc.circle({
    x: px,
    y: py,
    radius: petalRadius,
    fillColor: '#FF6B9D',
    strokeColor: '#C44569',
    strokeWidth: 1
  })
}

// Center
doc.circle({
  x: flowerX,
  y: flowerY,
  radius: 12,
  fillColor: '#FFC93C'
})

// Example 8: Target/Bullseye
doc.text('8. Bullseye Target', 200, currentY, 12)
const targetX = 280
const targetY = currentY - 60

doc.circle({ x: targetX, y: targetY, radius: 40, fillColor: '#E74C3C' })
doc.circle({ x: targetX, y: targetY, radius: 30, fillColor: '#FFFFFF' })
doc.circle({ x: targetX, y: targetY, radius: 20, fillColor: '#E74C3C' })
doc.circle({ x: targetX, y: targetY, radius: 10, fillColor: '#FFFFFF' })

// Example 9: Yin-Yang
doc.text('9. Yin-Yang', 380, currentY, 12)
const yinYangX = 450
const yinYangY = currentY - 60
const yinYangRadius = 35

// Outer circle (black)
doc.circle({
  x: yinYangX,
  y: yinYangY,
  radius: yinYangRadius,
  strokeColor: '#000000',
  strokeWidth: 2
})

// Left half (black)
doc.sector({
  x: yinYangX,
  y: yinYangY,
  radius: yinYangRadius,
  startAngle: 90,
  endAngle: 270,
  fillColor: '#000000'
})

// Top small circle (white with black dot)
doc.circle({
  x: yinYangX,
  y: yinYangY + yinYangRadius / 2,
  radius: yinYangRadius / 2,
  fillColor: '#FFFFFF'
})
doc.circle({
  x: yinYangX,
  y: yinYangY + yinYangRadius / 2,
  radius: 5,
  fillColor: '#000000'
})

// Bottom small circle (black with white dot)
doc.circle({
  x: yinYangX,
  y: yinYangY - yinYangRadius / 2,
  radius: yinYangRadius / 2,
  fillColor: '#000000'
})
doc.circle({
  x: yinYangX,
  y: yinYangY - yinYangRadius / 2,
  radius: 5,
  fillColor: '#FFFFFF'
})

doc.save('examples-output/test-vector-shapes.pdf')

console.log('✅ PDF created: examples-output/test-vector-shapes.pdf')
console.log('   4 pages demonstrating:')
console.log('   Page 1: Circles and ellipses with various styles')
console.log('   Page 2: Polygons (triangle, square, pentagon, hexagon, etc.)')
console.log('   Page 3: Arcs and sectors (pie slices)')
console.log('   Page 4: Bezier curves and complex shapes (heart, cloud, star, flower, yin-yang)\n')
