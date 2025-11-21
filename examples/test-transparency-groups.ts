import { PDFDocument } from '../src'

console.log('🎨 Testing Transparency Groups...\n')

// ======================
// Example 1: Basic Transparency Group
// ======================

const doc1 = new PDFDocument({ size: 'Letter', margins: 50 })

doc1.text('Example 1: Basic Transparency Group', 50, 750, 20)
doc1.text('Overlapping shapes with transparency blending', 50, 720, 12)

// Draw background
doc1.setFillColor(0.9, 0.9, 0.9)
doc1.rect(50, 500, 500, 200)
doc1.fill()

// Create transparency group with blended shapes
doc1.beginTransparencyGroup(true, false)

// Red circle
doc1.opacity(0.5)
doc1.circle({ x: 150, y: 600, radius: 60, fillColor: [1, 0, 0] })
doc1.fill()

// Blue circle
doc1.opacity(0.5)
doc1.circle({ x: 220, y: 600, radius: 60, fillColor: [0, 0, 1] })
doc1.fill()

// Green circle
doc1.opacity(0.5)
doc1.circle({ x: 185, y: 530, radius: 60, fillColor: [0, 1, 0] })
doc1.fill()

doc1.endTransparencyGroup()

// Reset opacity
doc1.opacity(1)

doc1.text('Three overlapping circles with 50% opacity', 50, 450, 12)

doc1.save('examples-output/transparency-1-basic.pdf')
console.log('✅ Example 1: Basic transparency group created')

// ======================
// Example 2: Multiple Groups with Different Blend Modes
// ======================

const doc2 = new PDFDocument({ size: 'Letter', margins: 50 })

doc2.text('Example 2: Multiple Transparency Groups', 50, 750, 20)
doc2.text('Different blend modes in separate groups', 50, 720, 12)

// Group 1: Normal blend mode
doc2.text('Group 1: Normal Blend', 50, 650, 14)
doc2.beginTransparencyGroup(true)
doc2.blendMode('Normal')

doc2.opacity(0.7)
doc2.rect(50, 550, 100, 80)
doc2.setFillColor(1, 0, 0)
doc2.fill()

doc2.opacity(0.7)
doc2.rect(100, 570, 100, 80)
doc2.setFillColor(0, 0, 1)
doc2.fill()

doc2.endTransparencyGroup()

// Group 2: Multiply blend mode
doc2.text('Group 2: Multiply Blend', 280, 650, 14)
doc2.beginTransparencyGroup(true)
doc2.blendMode('Multiply')

doc2.opacity(0.7)
doc2.rect(280, 550, 100, 80)
doc2.setFillColor(1, 0, 0)
doc2.fill()

doc2.opacity(0.7)
doc2.rect(330, 570, 100, 80)
doc2.setFillColor(0, 0, 1)
doc2.fill()

doc2.endTransparencyGroup()

// Reset
doc2.opacity(1)
doc2.blendMode('Normal')

doc2.save('examples-output/transparency-2-blend-modes.pdf')
console.log('✅ Example 2: Multiple transparency groups created')

// ======================
// Example 3: Nested Transparency Groups
// ======================

const doc3 = new PDFDocument({ size: 'Letter', margins: 50 })

doc3.text('Example 3: Nested Transparency Groups', 50, 750, 20)
doc3.text('Complex layering with nested groups', 50, 720, 12)

// Outer group
doc3.beginTransparencyGroup(true)

// Background rectangle
doc3.opacity(0.4)
doc3.rect(80, 520, 450, 150)
doc3.setFillColor(0.2, 0.2, 0.8)
doc3.fill()

// Inner group 1
doc3.beginTransparencyGroup(true)
doc3.opacity(0.6)
doc3.circle({ x: 200, y: 600, radius: 50, fillColor: [1, 0.5, 0] })
doc3.fill()
doc3.endTransparencyGroup()

// Inner group 2
doc3.beginTransparencyGroup(true)
doc3.opacity(0.6)
doc3.circle({ x: 350, y: 600, radius: 50, fillColor: [0, 1, 0.5] })
doc3.fill()
doc3.endTransparencyGroup()

doc3.endTransparencyGroup()

// Reset
doc3.opacity(1)

doc3.text('Nested groups create complex transparency effects', 50, 450, 12)

doc3.save('examples-output/transparency-3-nested.pdf')
console.log('✅ Example 3: Nested transparency groups created')

// ======================
// Example 4: Real-World Use Case - Watermarks
// ======================

const doc4 = new PDFDocument({ size: 'Letter', margins: 50 })

doc4.text('Example 4: Watermark with Transparency', 50, 750, 20)
doc4.text('Practical use case for transparency groups', 50, 720, 12)

// Main content
doc4.setFillColor(0, 0, 0)
doc4.text('Document Title', 50, 650, 24)
doc4.text('This is the main content of the document.', 50, 620, 14)
doc4.text('The watermark below uses a transparency group.', 50, 600, 14)

// Create watermark using transparency group
doc4.beginTransparencyGroup(true)

// Rotate and add watermark text
doc4.saveGraphicsState()
doc4.opacity(0.15)
doc4.setFillColor(1, 0, 0)

// Position for diagonal watermark
const centerX = 306
const centerY = 400

// Add multiple watermark instances
for (let i = 0; i < 3; i++) {
  const y = centerY + i * 100
  doc4.text('CONFIDENTIAL', centerX - 100, y, 48)
}

doc4.restoreGraphicsState()

doc4.endTransparencyGroup()

// Reset
doc4.opacity(1)

doc4.text('More document content continues here...', 50, 250, 14)

doc4.save('examples-output/transparency-4-watermark.pdf')
console.log('✅ Example 4: Watermark transparency created')

console.log('\n🎨 All transparency group examples created successfully!')
console.log('   4 PDFs demonstrating:')
console.log('   1. Basic transparency group with overlapping shapes')
console.log('   2. Multiple groups with different blend modes')
console.log('   3. Nested transparency groups')
console.log('   4. Real-world watermark use case\n')
