import { PDFDocument } from '../src'

console.log('✍️  Testing Advanced Text Features...\n')

// ======================
// Example 1: Text Rendering Modes
// ======================

const doc1 = new PDFDocument({ size: 'Letter', margins: 50 })

doc1.text('Example 1: Text Rendering Modes', 50, 750, 20)
doc1.text('Different ways to render text in PDF', 50, 720, 12)

// Mode 0: Fill (default)
doc1.setFillColor(0, 0, 0)
doc1.setTextRenderingMode(0)
doc1.text('Mode 0: Fill text (normal)', 50, 680, 16)

// Mode 1: Stroke
doc1.setStrokeColor(0, 0, 1)
doc1.setLineWidth(0.5)
doc1.setTextRenderingMode(1)
doc1.text('Mode 1: Stroke text (outline)', 50, 650, 16)

// Mode 2: Fill then stroke
doc1.setFillColor(1, 0, 0)
doc1.setStrokeColor(0, 0, 0)
doc1.setLineWidth(1)
doc1.setTextRenderingMode(2)
doc1.text('Mode 2: Fill and Stroke', 50, 620, 16)

// Mode 3: Invisible (for clipping)
doc1.setTextRenderingMode(3)
doc1.text('Mode 3: Invisible text', 50, 590, 16)

// Reset to normal
doc1.setTextRenderingMode(0)
doc1.setFillColor(0, 0, 0)

doc1.text('(Mode 3 text is invisible - used for clipping paths)', 50, 570, 10)

doc1.save('examples-output/text-1-rendering-modes.pdf')
console.log('✅ Example 1: Text rendering modes created')

// ======================
// Example 2: Text Outline Effects
// ======================

const doc2 = new PDFDocument({ size: 'Letter', margins: 50 })

doc2.text('Example 2: Text Outline Effects', 50, 750, 20)
doc2.text('Creating outlined text with different styles', 50, 720, 12)

// Thin outline
doc2.textOutline({
  text: 'Thin Outline',
  x: 50,
  y: 670,
  fontSize: 24,
  fillColor: [1, 1, 1],
  strokeColor: [0, 0, 0],
  lineWidth: 0.5,
  renderingMode: 2
})

// Medium outline
doc2.textOutline({
  text: 'Medium Outline',
  x: 50,
  y: 630,
  fontSize: 24,
  fillColor: [1, 0.9, 0.3],
  strokeColor: [0, 0, 0],
  lineWidth: 1.5,
  renderingMode: 2
})

// Thick outline
doc2.textOutline({
  text: 'THICK OUTLINE',
  x: 50,
  y: 590,
  fontSize: 32,
  fillColor: [0.3, 0.7, 1],
  strokeColor: [0, 0, 0.5],
  lineWidth: 3,
  renderingMode: 2
})

// Stroke only (no fill)
doc2.textOutline({
  text: 'Stroke Only',
  x: 50,
  y: 540,
  fontSize: 28,
  strokeColor: [1, 0, 0],
  lineWidth: 1.5,
  renderingMode: 1
})

doc2.save('examples-output/text-2-outline-effects.pdf')
console.log('✅ Example 2: Text outline effects created')

// ======================
// Example 3: Creative Text Styles
// ======================

const doc3 = new PDFDocument({ size: 'Letter', margins: 50 })

doc3.text('Example 3: Creative Text Styles', 50, 750, 20)
doc3.text('Combining outline, colors, and effects', 50, 720, 12)

// Title with gradient-like effect
doc3.textOutline({
  text: 'PREMIUM',
  x: 150,
  y: 670,
  fontSize: 48,
  fillColor: [1, 0.84, 0],
  strokeColor: [0.6, 0.4, 0],
  lineWidth: 2,
  renderingMode: 2
})

// Neon effect
doc3.textOutline({
  text: 'NEON',
  x: 200,
  y: 610,
  fontSize: 36,
  fillColor: [0, 1, 1],
  strokeColor: [0, 0.3, 1],
  lineWidth: 2.5,
  renderingMode: 2
})

// Comic book style
doc3.textOutline({
  text: 'BOOM!',
  x: 180,
  y: 560,
  fontSize: 42,
  fillColor: [1, 1, 0],
  strokeColor: [0, 0, 0],
  lineWidth: 3.5,
  renderingMode: 2
})

// Elegant thin outline
doc3.textOutline({
  text: 'elegant',
  x: 200,
  y: 510,
  fontSize: 32,
  fillColor: [0.5, 0, 0.5],
  strokeColor: [0.8, 0.6, 0.8],
  lineWidth: 0.8,
  renderingMode: 2
})

doc3.save('examples-output/text-3-creative-styles.pdf')
console.log('✅ Example 3: Creative text styles created')

// ======================
// Example 4: Text Effects for Headers
// ======================

const doc4 = new PDFDocument({ size: 'Letter', margins: 50 })

doc4.text('Example 4: Headers and Titles', 50, 750, 20)
doc4.text('Professional text effects for document headers', 50, 720, 12)

// Modern header
doc4.setFillColor(0.95, 0.95, 0.95)
doc4.rect(50, 640, 500, 60)
doc4.fill()

doc4.textOutline({
  text: 'Annual Report 2025',
  x: 80,
  y: 665,
  fontSize: 28,
  fillColor: [0.2, 0.3, 0.5],
  strokeColor: [0.1, 0.15, 0.25],
  lineWidth: 1.2,
  renderingMode: 2
})

// Bold section header
doc4.textOutline({
  text: 'Financial Summary',
  x: 50,
  y: 600,
  fontSize: 22,
  fillColor: [0, 0, 0],
  strokeColor: [0.4, 0.4, 0.4],
  lineWidth: 0.8,
  renderingMode: 2
})

// Subsection with accent
doc4.textOutline({
  text: 'Key Metrics',
  x: 50,
  y: 560,
  fontSize: 18,
  fillColor: [0.1, 0.4, 0.7],
  strokeColor: [0, 0.2, 0.4],
  lineWidth: 0.6,
  renderingMode: 2
})

// Normal content text for contrast
doc4.setFillColor(0, 0, 0)
doc4.text('This is regular body text that follows the headers.', 50, 530, 12)
doc4.text('Notice how the outlined headers create visual hierarchy.', 50, 515, 12)

doc4.save('examples-output/text-4-headers.pdf')
console.log('✅ Example 4: Headers and titles created')

// ======================
// Example 5: Extended Graphics State with Text
// ======================

const doc5 = new PDFDocument({ size: 'Letter', margins: 50 })

doc5.text('Example 5: ExtGState with Text', 50, 750, 20)
doc5.text('Line caps, joins, and dash patterns', 50, 720, 12)

// Round line cap and join
doc5.setLineCap(1)
doc5.setLineJoin(1)
doc5.textOutline({
  text: 'Round Caps & Joins',
  x: 50,
  y: 670,
  fontSize: 24,
  strokeColor: [0, 0, 1],
  lineWidth: 4,
  renderingMode: 1
})

// Square line cap
doc5.setLineCap(2)
doc5.setLineJoin(0)
doc5.textOutline({
  text: 'Square Caps',
  x: 50,
  y: 630,
  fontSize: 24,
  strokeColor: [1, 0, 0],
  lineWidth: 4,
  renderingMode: 1
})

// Bevel line join
doc5.setLineCap(0)
doc5.setLineJoin(2)
doc5.textOutline({
  text: 'Bevel Joins',
  x: 50,
  y: 590,
  fontSize: 24,
  strokeColor: [0, 0.7, 0],
  lineWidth: 4,
  renderingMode: 1
})

// Dashed outline
doc5.setLineCap(1)
doc5.setLineJoin(1)
doc5.setDashPattern([5, 3])
doc5.textOutline({
  text: 'Dashed Outline',
  x: 50,
  y: 550,
  fontSize: 24,
  strokeColor: [0.5, 0, 0.5],
  lineWidth: 2,
  renderingMode: 1
})

// Reset
doc5.setDashPattern([])
doc5.setLineCap(0)
doc5.setLineJoin(0)

doc5.text('Different line styles applied to text outlines', 50, 500, 12)

doc5.save('examples-output/text-5-extgstate.pdf')
console.log('✅ Example 5: ExtGState with text created')

console.log('\n✍️  All advanced text examples created successfully!')
console.log('   5 PDFs demonstrating:')
console.log('   1. Text rendering modes (0-3)')
console.log('   2. Text outline effects with various widths')
console.log('   3. Creative text styles (neon, comic, elegant)')
console.log('   4. Professional headers and titles')
console.log('   5. Extended graphics state with text\n')
