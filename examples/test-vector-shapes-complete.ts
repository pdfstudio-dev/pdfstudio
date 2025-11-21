import { PDFDocument } from '../src'

console.log('🔷 Testing ALL vector shape customization options...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 40
})

// ======================
// Page 1: CIRCLE OPTIONS
// ======================

doc.text('VECTOR SHAPES - Complete Customization Guide', 120, 760, 18)
doc.text('Page 1: Circle Options', 210, 735, 14)

let y = 710

// Row 1: Fill Color Options
doc.text('Fill Colors (Hex Strings)', 50, y, 12)

doc.circle({ x: 80, y: y - 40, radius: 25, fillColor: '#FF6B6B' })
doc.text('#FF6B6B', 65, y - 75, 8)

doc.circle({ x: 150, y: y - 40, radius: 25, fillColor: '#4ECDC4' })
doc.text('#4ECDC4', 135, y - 75, 8)

doc.circle({ x: 220, y: y - 40, radius: 25, fillColor: '#95E1D3' })
doc.text('#95E1D3', 205, y - 75, 8)

doc.circle({ x: 290, y: y - 40, radius: 25, fillColor: '#FFD93D' })
doc.text('#FFD93D', 275, y - 75, 8)

doc.circle({ x: 360, y: y - 40, radius: 25, fillColor: '#AA96DA' })
doc.text('#AA96DA', 345, y - 75, 8)

doc.circle({ x: 430, y: y - 40, radius: 25, fillColor: '#FCBAD3' })
doc.text('#FCBAD3', 415, y - 75, 8)

doc.circle({ x: 500, y: y - 40, radius: 25, fillColor: '#A8E6CF' })
doc.text('#A8E6CF', 485, y - 75, 8)

y -= 110

// Row 2: Fill Colors (RGB Arrays)
doc.text('Fill Colors (RGB Arrays [0-1])', 50, y, 12)

doc.circle({ x: 80, y: y - 40, radius: 25, fillColor: [1, 0, 0] })
doc.text('[1, 0, 0]', 62, y - 75, 8)

doc.circle({ x: 150, y: y - 40, radius: 25, fillColor: [0, 1, 0] })
doc.text('[0, 1, 0]', 132, y - 75, 8)

doc.circle({ x: 220, y: y - 40, radius: 25, fillColor: [0, 0, 1] })
doc.text('[0, 0, 1]', 202, y - 75, 8)

doc.circle({ x: 290, y: y - 40, radius: 25, fillColor: [1, 1, 0] })
doc.text('[1, 1, 0]', 272, y - 75, 8)

doc.circle({ x: 360, y: y - 40, radius: 25, fillColor: [1, 0, 1] })
doc.text('[1, 0, 1]', 342, y - 75, 8)

doc.circle({ x: 430, y: y - 40, radius: 25, fillColor: [0, 1, 1] })
doc.text('[0, 1, 1]', 412, y - 75, 8)

doc.circle({ x: 500, y: y - 40, radius: 25, fillColor: [0.5, 0.5, 0.5] })
doc.text('[0.5, 0.5, 0.5]', 472, y - 75, 8)

y -= 110

// Row 3: Stroke Color & Width
doc.text('Stroke Colors & Widths', 50, y, 12)

doc.circle({ x: 80, y: y - 40, radius: 25, strokeColor: '#FF6B6B', strokeWidth: 1 })
doc.text('width: 1', 62, y - 75, 8)

doc.circle({ x: 150, y: y - 40, radius: 25, strokeColor: '#4ECDC4', strokeWidth: 2 })
doc.text('width: 2', 132, y - 75, 8)

doc.circle({ x: 220, y: y - 40, radius: 25, strokeColor: '#95E1D3', strokeWidth: 3 })
doc.text('width: 3', 202, y - 75, 8)

doc.circle({ x: 290, y: y - 40, radius: 25, strokeColor: '#FFD93D', strokeWidth: 4 })
doc.text('width: 4', 272, y - 75, 8)

doc.circle({ x: 360, y: y - 40, radius: 25, strokeColor: '#AA96DA', strokeWidth: 5 })
doc.text('width: 5', 342, y - 75, 8)

doc.circle({ x: 430, y: y - 40, radius: 25, strokeColor: '#FCBAD3', strokeWidth: 6 })
doc.text('width: 6', 412, y - 75, 8)

doc.circle({ x: 500, y: y - 40, radius: 25, strokeColor: '#A8E6CF', strokeWidth: 8 })
doc.text('width: 8', 482, y - 75, 8)

y -= 110

// Row 4: Fill + Stroke Combinations
doc.text('Fill + Stroke Combinations', 50, y, 12)

doc.circle({
  x: 80, y: y - 40, radius: 25,
  fillColor: '#FFE5E5',
  strokeColor: '#FF6B6B',
  strokeWidth: 2
})
doc.text('Fill+Stroke', 56, y - 75, 8)

doc.circle({
  x: 150, y: y - 40, radius: 25,
  fillColor: '#E0F7F7',
  strokeColor: '#4ECDC4',
  strokeWidth: 3
})
doc.text('Different', 130, y - 75, 8)
doc.text('colors', 134, y - 85, 8)

doc.circle({
  x: 220, y: y - 40, radius: 25,
  fillColor: '#95E1D3',
  strokeColor: '#2C8C7C',
  strokeWidth: 4
})
doc.text('Dark stroke', 196, y - 75, 8)

doc.circle({
  x: 290, y: y - 40, radius: 25,
  fillColor: '#FFF9E6',
  strokeColor: '#FFD93D',
  strokeWidth: 1
})
doc.text('Thin stroke', 268, y - 75, 8)

doc.circle({
  x: 360, y: y - 40, radius: 25,
  fillColor: '#AA96DA',
  strokeColor: '#FFFFFF',
  strokeWidth: 3
})
doc.text('White stroke', 337, y - 75, 8)

doc.circle({
  x: 430, y: y - 40, radius: 25,
  fillColor: '#000000',
  strokeColor: '#FCBAD3',
  strokeWidth: 5
})
doc.text('Black fill', 408, y - 75, 8)

doc.circle({
  x: 500, y: y - 40, radius: 25,
  fillColor: '#FFFFFF',
  strokeColor: '#000000',
  strokeWidth: 2
})
doc.text('Classic', 481, y - 75, 8)

y -= 110

// Row 5: Dash Patterns
doc.text('Dash Patterns (dashPattern: [dash, gap, ...])', 50, y, 12)

doc.circle({
  x: 80, y: y - 40, radius: 25,
  strokeColor: '#FF6B6B',
  strokeWidth: 2,
  dashPattern: [5, 5]
})
doc.text('[5, 5]', 65, y - 75, 8)

doc.circle({
  x: 150, y: y - 40, radius: 25,
  strokeColor: '#4ECDC4',
  strokeWidth: 2,
  dashPattern: [10, 5]
})
doc.text('[10, 5]', 132, y - 75, 8)

doc.circle({
  x: 220, y: y - 40, radius: 25,
  strokeColor: '#95E1D3',
  strokeWidth: 2,
  dashPattern: [15, 5]
})
doc.text('[15, 5]', 202, y - 75, 8)

doc.circle({
  x: 290, y: y - 40, radius: 25,
  strokeColor: '#FFD93D',
  strokeWidth: 2,
  dashPattern: [5, 2, 2, 2]
})
doc.text('[5,2,2,2]', 268, y - 75, 8)

doc.circle({
  x: 360, y: y - 40, radius: 25,
  strokeColor: '#AA96DA',
  strokeWidth: 3,
  dashPattern: [2, 2]
})
doc.text('[2, 2]', 342, y - 75, 8)

doc.circle({
  x: 430, y: y - 40, radius: 25,
  strokeColor: '#FCBAD3',
  strokeWidth: 3,
  dashPattern: [8, 4, 2, 4]
})
doc.text('[8,4,2,4]', 408, y - 75, 8)

doc.circle({
  x: 500, y: y - 40, radius: 25,
  strokeColor: '#A8E6CF',
  strokeWidth: 3,
  dashPattern: [1, 3]
})
doc.text('[1, 3]', 482, y - 75, 8)

y -= 110

// Row 6: Different Radii
doc.text('Different Radii Sizes', 50, y, 12)

doc.circle({ x: 80, y: y - 40, radius: 10, fillColor: '#FF6B6B' })
doc.text('r: 10', 68, y - 60, 8)

doc.circle({ x: 150, y: y - 40, radius: 15, fillColor: '#4ECDC4' })
doc.text('r: 15', 138, y - 65, 8)

doc.circle({ x: 220, y: y - 40, radius: 20, fillColor: '#95E1D3' })
doc.text('r: 20', 208, y - 70, 8)

doc.circle({ x: 290, y: y - 40, radius: 25, fillColor: '#FFD93D' })
doc.text('r: 25', 278, y - 75, 8)

doc.circle({ x: 370, y: y - 40, radius: 30, fillColor: '#AA96DA' })
doc.text('r: 30', 358, y - 80, 8)

doc.circle({ x: 460, y: y - 40, radius: 35, fillColor: '#FCBAD3' })
doc.text('r: 35', 448, y - 85, 8)

// ======================
// Page 2: ELLIPSE OPTIONS
// ======================
doc.addPage()

doc.text('VECTOR SHAPES - Complete Customization Guide', 120, 760, 18)
doc.text('Page 2: Ellipse Options', 200, 735, 14)

y = 710

// Row 1: Different Radius Combinations
doc.text('Different radiusX and radiusY', 50, y, 12)

doc.ellipse({ x: 80, y: y - 40, radiusX: 40, radiusY: 20, fillColor: '#FF6B6B' })
doc.text('40 x 20', 66, y - 75, 8)

doc.ellipse({ x: 170, y: y - 40, radiusX: 50, radiusY: 25, fillColor: '#4ECDC4' })
doc.text('50 x 25', 156, y - 75, 8)

doc.ellipse({ x: 270, y: y - 40, radiusX: 30, radiusY: 45, fillColor: '#95E1D3' })
doc.text('30 x 45', 256, y - 75, 8)

doc.ellipse({ x: 360, y: y - 40, radiusX: 45, radiusY: 30, fillColor: '#FFD93D' })
doc.text('45 x 30', 346, y - 75, 8)

doc.ellipse({ x: 460, y: y - 40, radiusX: 35, radiusY: 35, fillColor: '#AA96DA' })
doc.text('35 x 35', 446, y - 75, 8)

y -= 110

// Row 2: Rotation Angles
doc.text('Rotation Angles', 50, y, 12)

doc.ellipse({
  x: 80, y: y - 40,
  radiusX: 40, radiusY: 20,
  rotation: 0,
  fillColor: '#FF6B6B'
})
doc.text('0°', 72, y - 75, 8)

doc.ellipse({
  x: 170, y: y - 40,
  radiusX: 40, radiusY: 20,
  rotation: 30,
  fillColor: '#4ECDC4'
})
doc.text('30°', 162, y - 75, 8)

doc.ellipse({
  x: 260, y: y - 40,
  radiusX: 40, radiusY: 20,
  rotation: 45,
  fillColor: '#95E1D3'
})
doc.text('45°', 252, y - 75, 8)

doc.ellipse({
  x: 350, y: y - 40,
  radiusX: 40, radiusY: 20,
  rotation: 60,
  fillColor: '#FFD93D'
})
doc.text('60°', 342, y - 75, 8)

doc.ellipse({
  x: 440, y: y - 40,
  radiusX: 40, radiusY: 20,
  rotation: 90,
  fillColor: '#AA96DA'
})
doc.text('90°', 432, y - 75, 8)

doc.ellipse({
  x: 520, y: y - 40,
  radiusX: 40, radiusY: 20,
  rotation: 135,
  fillColor: '#FCBAD3'
})
doc.text('135°', 510, y - 75, 8)

y -= 110

// Row 3: Stroke Styles with Rotation
doc.text('Strokes with Rotation', 50, y, 12)

doc.ellipse({
  x: 80, y: y - 40,
  radiusX: 35, radiusY: 20,
  rotation: 0,
  strokeColor: '#FF6B6B',
  strokeWidth: 2
})
doc.text('0°, w:2', 64, y - 75, 8)

doc.ellipse({
  x: 170, y: y - 40,
  radiusX: 35, radiusY: 20,
  rotation: 45,
  strokeColor: '#4ECDC4',
  strokeWidth: 3
})
doc.text('45°, w:3', 154, y - 75, 8)

doc.ellipse({
  x: 260, y: y - 40,
  radiusX: 35, radiusY: 20,
  rotation: 90,
  strokeColor: '#95E1D3',
  strokeWidth: 4
})
doc.text('90°, w:4', 244, y - 75, 8)

doc.ellipse({
  x: 360, y: y - 40,
  radiusX: 35, radiusY: 20,
  rotation: 30,
  fillColor: '#FFE5E5',
  strokeColor: '#FFD93D',
  strokeWidth: 2
})
doc.text('30°, F+S', 342, y - 75, 8)

doc.ellipse({
  x: 460, y: y - 40,
  radiusX: 35, radiusY: 20,
  rotation: 60,
  fillColor: '#E8D5F2',
  strokeColor: '#AA96DA',
  strokeWidth: 3
})
doc.text('60°, F+S', 442, y - 75, 8)

y -= 110

// Row 4: Dash Patterns with Rotation
doc.text('Dash Patterns with Rotation', 50, y, 12)

doc.ellipse({
  x: 80, y: y - 40,
  radiusX: 35, radiusY: 20,
  rotation: 0,
  strokeColor: '#FF6B6B',
  strokeWidth: 2,
  dashPattern: [5, 5]
})
doc.text('[5,5] 0°', 60, y - 75, 8)

doc.ellipse({
  x: 170, y: y - 40,
  radiusX: 35, radiusY: 20,
  rotation: 45,
  strokeColor: '#4ECDC4',
  strokeWidth: 2,
  dashPattern: [10, 5]
})
doc.text('[10,5] 45°', 148, y - 75, 8)

doc.ellipse({
  x: 270, y: y - 40,
  radiusX: 35, radiusY: 20,
  rotation: 90,
  strokeColor: '#95E1D3',
  strokeWidth: 3,
  dashPattern: [8, 4, 2, 4]
})
doc.text('[8,4,2,4] 90°', 238, y - 75, 8)

doc.ellipse({
  x: 380, y: y - 40,
  radiusX: 35, radiusY: 20,
  rotation: 135,
  strokeColor: '#FFD93D',
  strokeWidth: 2,
  dashPattern: [2, 2]
})
doc.text('[2,2] 135°', 356, y - 75, 8)

doc.ellipse({
  x: 480, y: y - 40,
  radiusX: 35, radiusY: 20,
  rotation: 30,
  strokeColor: '#AA96DA',
  strokeWidth: 3,
  dashPattern: [15, 5]
})
doc.text('[15,5] 30°', 456, y - 75, 8)

y -= 110

// Row 5: Complex Fill + Stroke + Dash
doc.text('Complex: Fill + Stroke + Dash + Rotation', 50, y, 12)

doc.ellipse({
  x: 100, y: y - 40,
  radiusX: 40, radiusY: 25,
  rotation: 0,
  fillColor: '#FFE5E5',
  strokeColor: '#FF6B6B',
  strokeWidth: 3,
  dashPattern: [5, 5]
})
doc.text('All options', 74, y - 75, 8)
doc.text('0°', 92, y - 85, 8)

doc.ellipse({
  x: 220, y: y - 40,
  radiusX: 40, radiusY: 25,
  rotation: 45,
  fillColor: '#E0F7F7',
  strokeColor: '#4ECDC4',
  strokeWidth: 2,
  dashPattern: [10, 5]
})
doc.text('All options', 194, y - 75, 8)
doc.text('45°', 210, y - 85, 8)

doc.ellipse({
  x: 340, y: y - 40,
  radiusX: 40, radiusY: 25,
  rotation: 90,
  fillColor: '#FFF9E6',
  strokeColor: '#FFD93D',
  strokeWidth: 4,
  dashPattern: [8, 4, 2, 4]
})
doc.text('All options', 314, y - 75, 8)
doc.text('90°', 330, y - 85, 8)

doc.ellipse({
  x: 460, y: y - 40,
  radiusX: 40, radiusY: 25,
  rotation: 135,
  fillColor: '#E8D5F2',
  strokeColor: '#AA96DA',
  strokeWidth: 3,
  dashPattern: [5, 2, 2, 2]
})
doc.text('All options', 434, y - 75, 8)
doc.text('135°', 448, y - 85, 8)

y -= 110

// Row 6: Extreme Rotations
doc.text('Extreme Rotations & Aspect Ratios', 50, y, 12)

doc.ellipse({
  x: 80, y: y - 40,
  radiusX: 50, radiusY: 15,
  rotation: 0,
  fillColor: '#FF6B6B'
})
doc.text('Very wide', 60, y - 65, 8)
doc.text('0°', 74, y - 75, 8)

doc.ellipse({
  x: 190, y: y - 40,
  radiusX: 15, radiusY: 50,
  rotation: 0,
  fillColor: '#4ECDC4'
})
doc.text('Very tall', 172, y - 100, 8)
doc.text('0°', 184, y - 110, 8)

doc.ellipse({
  x: 290, y: y - 40,
  radiusX: 50, radiusY: 10,
  rotation: 45,
  fillColor: '#95E1D3'
})
doc.text('Super wide', 266, y - 75, 8)
doc.text('45°', 280, y - 85, 8)

doc.ellipse({
  x: 400, y: y - 40,
  radiusX: 45, radiusY: 15,
  rotation: 180,
  fillColor: '#FFD93D'
})
doc.text('180° rotation', 372, y - 65, 8)

doc.ellipse({
  x: 510, y: y - 40,
  radiusX: 45, radiusY: 15,
  rotation: 270,
  fillColor: '#AA96DA'
})
doc.text('270° rotation', 482, y - 65, 8)

// ======================
// Page 3: POLYGON OPTIONS
// ======================
doc.addPage()

doc.text('VECTOR SHAPES - Complete Customization Guide', 120, 760, 18)
doc.text('Page 3: Polygon Options', 200, 735, 14)

y = 710

// Row 1: Number of Sides
doc.text('Number of Sides (3 to 12)', 50, y, 12)

for (let i = 0; i < 10; i++) {
  const sides = i + 3
  const x = 80 + i * 48
  doc.polygon({
    x: x,
    y: y - 40,
    radius: 20,
    sides: sides,
    fillColor: '#FF6B6B'
  })
  doc.text(`${sides}`, x - 4, y - 70, 8)
}

y -= 110

// Row 2: Rotation Angles (Pentagon)
doc.text('Rotation Angles (Pentagon)', 50, y, 12)

const rotations = [0, 30, 45, 60, 90, 120, 144, 180]
rotations.forEach((rot, i) => {
  const x = 70 + i * 65
  doc.polygon({
    x: x,
    y: y - 40,
    radius: 25,
    sides: 5,
    rotation: rot,
    fillColor: '#4ECDC4'
  })
  doc.text(`${rot}°`, x - 8, y - 75, 8)
})

y -= 110

// Row 3: Fill Colors (Hexagon)
doc.text('Fill Colors (Hexagon)', 50, y, 12)

const colors = ['#FF6B6B', '#4ECDC4', '#95E1D3', '#FFD93D', '#AA96DA', '#FCBAD3', '#A8E6CF']
colors.forEach((color, i) => {
  const x = 70 + i * 70
  doc.polygon({
    x: x,
    y: y - 40,
    radius: 25,
    sides: 6,
    fillColor: color
  })
  doc.text(color, x - 24, y - 75, 7)
})

y -= 110

// Row 4: Stroke Widths (Triangle)
doc.text('Stroke Widths (Triangle)', 50, y, 12)

for (let i = 0; i < 7; i++) {
  const width = i + 1
  const x = 70 + i * 70
  doc.polygon({
    x: x,
    y: y - 40,
    radius: 25,
    sides: 3,
    strokeColor: '#95E1D3',
    strokeWidth: width
  })
  doc.text(`w:${width}`, x - 10, y - 75, 8)
}

y -= 110

// Row 5: Fill + Stroke (Square)
doc.text('Fill + Stroke Combinations (Square)', 50, y, 12)

const combos = [
  { fill: '#FFE5E5', stroke: '#FF6B6B', width: 2 },
  { fill: '#E0F7F7', stroke: '#4ECDC4', width: 3 },
  { fill: '#F0FFE5', stroke: '#95E1D3', width: 4 },
  { fill: '#FFF9E6', stroke: '#FFD93D', width: 2 },
  { fill: '#E8D5F2', stroke: '#AA96DA', width: 3 },
  { fill: '#FFE5F0', stroke: '#FCBAD3', width: 2 },
]

combos.forEach((combo, i) => {
  const x = 70 + i * 75
  doc.polygon({
    x: x,
    y: y - 40,
    radius: 25,
    sides: 4,
    rotation: 45, // Diamond orientation
    fillColor: combo.fill,
    strokeColor: combo.stroke,
    strokeWidth: combo.width
  })
  doc.text(`w:${combo.width}`, x - 10, y - 75, 8)
})

y -= 110

// Row 6: Dash Patterns (Octagon)
doc.text('Dash Patterns (Octagon)', 50, y, 12)

const dashPatterns = [
  [5, 5],
  [10, 5],
  [15, 5],
  [5, 2, 2, 2],
  [8, 4, 2, 4],
  [2, 2],
  [1, 3]
]

dashPatterns.forEach((pattern, i) => {
  const x = 70 + i * 70
  doc.polygon({
    x: x,
    y: y - 40,
    radius: 25,
    sides: 8,
    strokeColor: '#FFD93D',
    strokeWidth: 2,
    dashPattern: pattern
  })
  doc.text(`[${pattern.join(',')}]`, x - 20, y - 75, 7)
})

// ======================
// Page 4: ARC & SECTOR OPTIONS
// ======================
doc.addPage()

doc.text('VECTOR SHAPES - Complete Customization Guide', 120, 760, 18)
doc.text('Page 4: Arc & Sector Options', 185, 735, 14)

y = 710

// Row 1: Arc Angles
doc.text('Arc Angles (startAngle: 0)', 50, y, 12)

const arcAngles = [45, 90, 135, 180, 225, 270, 315]
arcAngles.forEach((endAngle, i) => {
  const x = 70 + i * 70
  doc.arc({
    x: x,
    y: y - 40,
    radius: 25,
    startAngle: 0,
    endAngle: endAngle,
    strokeColor: '#FF6B6B',
    strokeWidth: 3
  })
  doc.text(`${endAngle}°`, x - 10, y - 75, 8)
})

y -= 110

// Row 2: Arc Start Angles
doc.text('Arc Start Angles (endAngle: 180°)', 50, y, 12)

const startAngles = [0, 45, 90, 135, 180, 225, 270]
startAngles.forEach((startAngle, i) => {
  const x = 70 + i * 70
  doc.arc({
    x: x,
    y: y - 40,
    radius: 25,
    startAngle: startAngle,
    endAngle: startAngle + 180,
    strokeColor: '#4ECDC4',
    strokeWidth: 3
  })
  doc.text(`start:${startAngle}°`, x - 22, y - 75, 7)
})

y -= 110

// Row 3: Arc Stroke Widths
doc.text('Arc Stroke Widths (90°)', 50, y, 12)

for (let i = 0; i < 7; i++) {
  const width = i + 1
  const x = 70 + i * 70
  doc.arc({
    x: x,
    y: y - 40,
    radius: 25,
    startAngle: 0,
    endAngle: 90,
    strokeColor: '#95E1D3',
    strokeWidth: width
  })
  doc.text(`w:${width}`, x - 10, y - 75, 8)
}

y -= 110

// Row 4: Arc Dash Patterns
doc.text('Arc Dash Patterns (180°)', 50, y, 12)

dashPatterns.forEach((pattern, i) => {
  const x = 70 + i * 70
  doc.arc({
    x: x,
    y: y - 40,
    radius: 25,
    startAngle: 0,
    endAngle: 180,
    strokeColor: '#FFD93D',
    strokeWidth: 2,
    dashPattern: pattern
  })
  doc.text(`[${pattern.join(',')}]`, x - 20, y - 75, 7)
})

y -= 120

// Row 5: Sector Angles
doc.text('Sector Angles (startAngle: 0)', 50, y, 12)

const sectorAngles = [45, 90, 135, 180, 225, 270, 315]
sectorAngles.forEach((endAngle, i) => {
  const x = 70 + i * 70
  doc.sector({
    x: x,
    y: y - 40,
    radius: 25,
    startAngle: 0,
    endAngle: endAngle,
    fillColor: '#AA96DA'
  })
  doc.text(`${endAngle}°`, x - 10, y - 75, 8)
})

y -= 110

// Row 6: Sector Fill Colors
doc.text('Sector Fill Colors (90°)', 50, y, 12)

colors.forEach((color, i) => {
  const x = 70 + i * 70
  doc.sector({
    x: x,
    y: y - 40,
    radius: 25,
    startAngle: 0,
    endAngle: 90,
    fillColor: color
  })
  doc.text(color, x - 24, y - 75, 7)
})

y -= 110

// Row 7: Sector Fill + Stroke
doc.text('Sector Fill + Stroke (120°)', 50, y, 12)

combos.forEach((combo, i) => {
  const x = 70 + i * 75
  doc.sector({
    x: x,
    y: y - 40,
    radius: 25,
    startAngle: 0,
    endAngle: 120,
    fillColor: combo.fill,
    strokeColor: combo.stroke,
    strokeWidth: combo.width
  })
  doc.text(`w:${combo.width}`, x - 10, y - 75, 8)
})

// ======================
// Page 5: COMPLEX COMBINATIONS
// ======================
doc.addPage()

doc.text('VECTOR SHAPES - Complete Customization Guide', 120, 760, 18)
doc.text('Page 5: Complex Combinations & Patterns', 155, 735, 14)

y = 700

// Example 1: Concentric shapes
doc.text('1. Concentric Circles (multiple radii, same colors)', 50, y, 11)
const centerX = 150
const centerY = y - 60
for (let i = 5; i > 0; i--) {
  doc.circle({
    x: centerX,
    y: centerY,
    radius: i * 10,
    strokeColor: '#FF6B6B',
    strokeWidth: 2
  })
}

// Example 2: Concentric with alternating fill
doc.text('2. Alternating Fill Pattern', 260, y, 11)
const center2X = 360
const center2Y = y - 60
for (let i = 5; i > 0; i--) {
  doc.circle({
    x: center2X,
    y: center2Y,
    radius: i * 10,
    fillColor: i % 2 === 0 ? '#4ECDC4' : '#95E1D3',
    strokeColor: '#2C8C7C',
    strokeWidth: 1
  })
}

// Example 3: Rainbow circles
doc.text('3. Rainbow Gradient Effect', 470, y, 11)
const rainbowColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3']
rainbowColors.forEach((color, i) => {
  doc.circle({
    x: 520,
    y: y - 90 + i * 10,
    radius: 8,
    fillColor: color
  })
})

y -= 150

// Example 4: Polygon spiral
doc.text('4. Polygon Size Progression', 50, y, 11)
for (let i = 3; i <= 8; i++) {
  doc.polygon({
    x: 50 + (i - 3) * 50,
    y: y - 60,
    radius: 15 + (i - 3) * 3,
    sides: i,
    fillColor: '#FFD93D',
    strokeColor: '#FFA800',
    strokeWidth: 2
  })
}

y -= 130

// Example 5: Rotating hexagons
doc.text('5. Rotation Sequence (Hexagon)', 50, y, 11)
for (let i = 0; i < 7; i++) {
  doc.polygon({
    x: 50 + i * 45,
    y: y - 50,
    radius: 20,
    sides: 6,
    rotation: i * 15,
    fillColor: '#AA96DA',
    strokeColor: '#7D5BA6',
    strokeWidth: 2
  })
}

y -= 130

// Example 6: Pie chart example
doc.text('6. Pie Chart (Sectors)', 50, y, 11)
const pieData = [
  { angle: 120, color: '#FF6B6B' },
  { angle: 90, color: '#4ECDC4' },
  { angle: 75, color: '#FFD93D' },
  { angle: 75, color: '#AA96DA' }
]
let currentAngle = 0
pieData.forEach(slice => {
  doc.sector({
    x: 150,
    y: y - 60,
    radius: 50,
    startAngle: currentAngle,
    endAngle: currentAngle + slice.angle,
    fillColor: slice.color,
    strokeColor: '#FFFFFF',
    strokeWidth: 2
  })
  currentAngle += slice.angle
})

// Example 7: Clock face
doc.text('7. Clock Face (Arcs & Lines)', 300, y, 11)
const clockX = 400
const clockY = y - 60
// Outer circle
doc.circle({
  x: clockX,
  y: clockY,
  radius: 50,
  strokeColor: '#000000',
  strokeWidth: 3
})
// Hour marks
for (let i = 0; i < 12; i++) {
  const angle = i * 30
  const rad = (angle - 90) * Math.PI / 180
  const innerR = 45
  const outerR = 50
  doc.moveTo(
    clockX + innerR * Math.cos(rad),
    clockY + innerR * Math.sin(rad)
  )
  doc.lineTo(
    clockX + outerR * Math.cos(rad),
    clockY + outerR * Math.sin(rad)
  )
  doc.setStrokeColor(0, 0, 0)
  doc.setLineWidth(2)
  doc.stroke()
}

// Example 8: Flower pattern
doc.text('8. Flower (Rotated Ellipses)', 480, y, 11)
const flowerX = 530
const flowerY = y - 60
for (let i = 0; i < 8; i++) {
  doc.ellipse({
    x: flowerX,
    y: flowerY,
    radiusX: 30,
    radiusY: 15,
    rotation: i * 45,
    fillColor: '#FCBAD3',
    strokeColor: '#F18FA1',
    strokeWidth: 1
  })
}
// Center
doc.circle({
  x: flowerX,
  y: flowerY,
  radius: 10,
  fillColor: '#FFD93D'
})

y -= 150

// Example 9: Star pattern
doc.text('9. Star (Polygon + Rotation)', 50, y, 11)
doc.polygon({
  x: 120,
  y: y - 60,
  radius: 40,
  sides: 5,
  rotation: 0,
  fillColor: '#F39C12',
  strokeColor: '#E67E22',
  strokeWidth: 2
})
doc.polygon({
  x: 120,
  y: y - 60,
  radius: 20,
  sides: 5,
  rotation: 36,
  fillColor: '#FFFFFF'
})

// Example 10: Yin-Yang
doc.text('10. Yin-Yang (Circles + Sectors)', 220, y, 11)
const yyX = 310
const yyY = y - 60
doc.circle({ x: yyX, y: yyY, radius: 45, strokeColor: '#000000', strokeWidth: 2 })
doc.sector({ x: yyX, y: yyY, radius: 45, startAngle: 90, endAngle: 270, fillColor: '#000000' })
doc.circle({ x: yyX, y: yyY + 22.5, radius: 22.5, fillColor: '#FFFFFF' })
doc.circle({ x: yyX, y: yyY + 22.5, radius: 5, fillColor: '#000000' })
doc.circle({ x: yyX, y: yyY - 22.5, radius: 22.5, fillColor: '#000000' })
doc.circle({ x: yyX, y: yyY - 22.5, radius: 5, fillColor: '#FFFFFF' })

// Example 11: Gradient effect with opacity simulation
doc.text('11. "Gradient" (Size Progression)', 420, y, 11)
const gradX = 500
const gradY = y - 60
for (let i = 0; i < 10; i++) {
  const gray = 255 - (i * 25)
  const hexGray = gray.toString(16).padStart(2, '0')
  doc.circle({
    x: gradX + i * 8,
    y: gradY,
    radius: 5,
    fillColor: `#${hexGray}${hexGray}${hexGray}`
  })
}

doc.save('examples-output/test-vector-shapes-complete.pdf')

console.log('✅ PDF created: examples-output/test-vector-shapes-complete.pdf')
console.log('   5 comprehensive pages:')
console.log('   Page 1: Circle - All fill, stroke, dash, and radius options')
console.log('   Page 2: Ellipse - radiusX/Y, rotation angles, combinations')
console.log('   Page 3: Polygon - sides, rotations, colors, strokes, dashes')
console.log('   Page 4: Arc & Sector - angles, widths, patterns')
console.log('   Page 5: Complex combinations and real-world patterns\n')
