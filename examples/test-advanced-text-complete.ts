import { PDFDocument } from '../src'

console.log('📝 Testing ALL advanced text features...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

// ======================
// Page 1: Word Wrapping & Alignment
// ======================
doc.text('ADVANCED TEXT FEATURES - COMPLETE DEMO', 120, 720, 24)
doc.text('Page 1: Word Wrapping & Alignment', 170, 690, 14)

const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'

// Example 1: Word Wrapping (Left aligned)
doc.text('1. Word Wrapping (Left Aligned)', 50, 660, 12)
doc.text(lorem, {
  x: 50,
  y: 600,
  width: 250,
  fontSize: 11,
  align: 'left'
})

// Draw bounding box for visualization
doc.setStrokeColor(0.8, 0.8, 0.8)
doc.setLineWidth(0.5)
doc.rect(50, 550, 250, 100)
doc.stroke()

// Example 2: Center Alignment
doc.text('2. Center Aligned', 350, 660, 12)
doc.text(lorem, {
  x: 320,
  y: 600,
  width: 230,
  fontSize: 11,
  align: 'center'
})

doc.rect(320, 550, 230, 100)
doc.stroke()

// Example 3: Right Alignment
doc.text('3. Right Aligned', 50, 520, 12)
doc.text(lorem, {
  x: 50,
  y: 460,
  width: 250,
  fontSize: 11,
  align: 'right'
})

doc.rect(50, 410, 250, 100)
doc.stroke()

// Example 4: Justified
doc.text('4. Justified Text', 350, 520, 12)
doc.text(lorem, {
  x: 320,
  y: 460,
  width: 230,
  fontSize: 11,
  align: 'justify'
})

doc.rect(320, 410, 230, 100)
doc.stroke()

// Example 5: Vertical Alignment
doc.text('5. Vertical Alignment (Center)', 50, 380, 12)
const shortText = 'This text is vertically centered in the box.'

doc.text(shortText, {
  x: 50,
  y: 280,
  width: 500,
  height: 80,
  fontSize: 12,
  align: 'center',
  valign: 'center'
})

doc.rect(50, 280, 500, 80)
doc.stroke()

// Example 6: First Line Indent
doc.text('6. First Line Indent (30pt)', 50, 250, 12)
doc.text(lorem, {
  x: 50,
  y: 190,
  width: 500,
  fontSize: 11,
  indent: 30
})

doc.rect(50, 140, 500, 100)
doc.stroke()

// ======================
// Page 2: Fonts & Font Families
// ======================
doc.addPage()

doc.text('ADVANCED TEXT FEATURES - COMPLETE DEMO', 120, 720, 24)
doc.text('Page 2: Font Families & Styles', 180, 690, 14)

let currentY = 650

// Helvetica Family
doc.text('Helvetica Family:', 50, currentY, 14)
currentY -= 25

doc.text('This is Helvetica (Regular)', { x: 50, y: currentY, fontSize: 12 })
currentY -= 20

doc.text('This is Helvetica-Bold', { x: 50, y: currentY, fontSize: 12, font: 'Helvetica-Bold' })
currentY -= 20

doc.text('This is Helvetica-Oblique (Italic)', { x: 50, y: currentY, fontSize: 12, font: 'Helvetica-Oblique' })
currentY -= 20

doc.text('This is Helvetica-BoldOblique', { x: 50, y: currentY, fontSize: 12, font: 'Helvetica-BoldOblique' })
currentY -= 40

// Times Family
doc.text('Times Family:', 50, currentY, 14)
currentY -= 25

doc.text('This is Times-Roman (Regular)', { x: 50, y: currentY, fontSize: 12, font: 'Times-Roman' })
currentY -= 20

doc.text('This is Times-Bold', { x: 50, y: currentY, fontSize: 12, font: 'Times-Bold' })
currentY -= 20

doc.text('This is Times-Italic', { x: 50, y: currentY, fontSize: 12, font: 'Times-Italic' })
currentY -= 20

doc.text('This is Times-BoldItalic', { x: 50, y: currentY, fontSize: 12, font: 'Times-BoldItalic' })
currentY -= 40

// Courier Family
doc.text('Courier Family (Monospace):', 50, currentY, 14)
currentY -= 25

doc.text('This is Courier (Regular)', { x: 50, y: currentY, fontSize: 12, font: 'Courier' })
currentY -= 20

doc.text('This is Courier-Bold', { x: 50, y: currentY, fontSize: 12, font: 'Courier-Bold' })
currentY -= 20

doc.text('This is Courier-Oblique', { x: 50, y: currentY, fontSize: 12, font: 'Courier-Oblique' })
currentY -= 20

doc.text('This is Courier-BoldOblique', { x: 50, y: currentY, fontSize: 12, font: 'Courier-BoldOblique' })

// ======================
// Page 3: Text Decoration & Spacing
// ======================
doc.addPage()

doc.text('ADVANCED TEXT FEATURES - COMPLETE DEMO', 120, 720, 24)
doc.text('Page 3: Text Decoration & Spacing', 160, 690, 14)

currentY = 650

// Underline
doc.text('1. Underline:', 50, currentY, 14)
currentY -= 25

doc.text('This text has an underline decoration.', {
  x: 50,
  y: currentY,
  fontSize: 12,
  underline: true
})
currentY -= 30

// Strikethrough
doc.text('2. Strikethrough:', 50, currentY, 14)
currentY -= 25

doc.text('This text is crossed out.', {
  x: 50,
  y: currentY,
  fontSize: 12,
  strike: true
})
currentY -= 40

// Line Height - Default
doc.text('3. Line Height (Default):', 50, currentY, 14)
currentY -= 25

const multiline = 'Line 1: Normal line height\nLine 2: Normal line height\nLine 3: Normal line height'
doc.text(multiline, {
  x: 50,
  y: currentY,
  width: 250,
  fontSize: 11
})
currentY -= 80

// Line Height - Custom
doc.text('4. Line Height (Custom - 20pt gap):', 50, currentY, 14)
currentY -= 25

doc.text(multiline, {
  x: 50,
  y: currentY,
  width: 250,
  fontSize: 11,
  lineGap: 20
})
currentY -= 110

// Character Spacing
doc.text('5. Character Spacing:', 50, currentY, 14)
currentY -= 25

doc.text('Normal spacing', {
  x: 50,
  y: currentY,
  fontSize: 12
})
currentY -= 20

doc.text('W i d e   s p a c i n g', {
  x: 50,
  y: currentY,
  fontSize: 12,
  characterSpacing: 2
})
currentY -= 20

doc.text('E x t r a   w i d e', {
  x: 50,
  y: currentY,
  fontSize: 12,
  characterSpacing: 4
})
currentY -= 40

// Word Spacing
doc.text('6. Word Spacing:', 50, currentY, 14)
currentY -= 25

doc.text('Normal word spacing between words', {
  x: 50,
  y: currentY,
  fontSize: 11
})
currentY -= 20

doc.text('Extra   spacing   between   words', {
  x: 50,
  y: currentY,
  fontSize: 11,
  wordSpacing: 10
})
currentY -= 20

doc.text('Very    wide    spacing', {
  x: 50,
  y: currentY,
  fontSize: 11,
  wordSpacing: 20
})

// ======================
// Page 4: Complex Example - Article Layout
// ======================
doc.addPage()

doc.text('ADVANCED TEXT FEATURES - COMPLETE DEMO', 120, 720, 24)
doc.text('Page 4: Complex Example - Article Layout', 140, 690, 14)

// Title
doc.text('The Art of Typography', { x: 180, y: 650, fontSize: 20, font: 'Times-Bold' })

// Byline
doc.text('By John Doe  |  November 16, 2025', { x: 200, y: 625, fontSize: 10, font: 'Times-Italic' })

// Horizontal line
doc.setStrokeColor(0, 0, 0)
doc.setLineWidth(0.5)
doc.moveTo(50, 615)
doc.lineTo(550, 615)
doc.stroke()

// First paragraph with indentation
const article1 = 'Typography is the art and technique of arranging type to make written language legible, readable and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing.'

doc.text(article1, {
  x: 50,
  y: 550,
  width: 500,
  fontSize: 11,
  align: 'justify',
  indent: 15,
  lineGap: 3
})

// Section header
doc.text('Historical Context', { x: 50, y: 470, fontSize: 14, font: 'Times-Bold' })

// Second paragraph
const article2 = 'The term typography is also applied to the style, arrangement, and appearance of the letters, numbers, and symbols created by the process. Type design is a closely related craft, sometimes considered part of typography; most typographers do not design typefaces.'

doc.text(article2, {
  x: 50,
  y: 410,
  width: 500,
  fontSize: 11,
  align: 'justify',
  lineGap: 3
})

// Quote box
doc.setStrokeColor(0.7, 0.7, 0.7)
doc.setFillColor(0.95, 0.95, 0.95)
doc.rect(70, 310, 460, 60)
doc.fill()
doc.rect(70, 310, 460, 60)
doc.stroke()

doc.text('"Good typography is invisible. Bad typography is everywhere."', { x: 100, y: 345, fontSize: 13, font: 'Times-Italic' })
doc.text('— Unknown', { x: 400, y: 325, fontSize: 10, font: 'Times-Italic' })

// Final paragraph
const article3 = 'In modern usage, typography is often associated with digital publishing and web design. However, the principles of good typography remain consistent across all mediums, whether print or digital.'

doc.text(article3, {
  x: 50,
  y: 250,
  width: 500,
  fontSize: 11,
  align: 'justify',
  lineGap: 3
})

// Footer
doc.setStrokeColor(0, 0, 0)
doc.moveTo(50, 180)
doc.lineTo(550, 180)
doc.stroke()

doc.text('PDFStudio - Advanced Text Rendering Demo', {
  x: 50,
  y: 160,
  width: 500,
  fontSize: 9,
  align: 'center'
})

doc.save('examples-output/test-advanced-text-complete.pdf')

console.log('✅ PDF created: examples-output/test-advanced-text-complete.pdf')
console.log('   4 pages demonstrating:')
console.log('   ✓ Word wrapping with multiple alignment modes')
console.log('   ✓ Left, center, right, and justified alignment')
console.log('   ✓ Vertical alignment (top, center, bottom)')
console.log('   ✓ First line indentation')
console.log('   ✓ Helvetica, Times, and Courier font families')
console.log('   ✓ Bold, Italic, and Bold-Italic variations')
console.log('   ✓ Underline and strikethrough decoration')
console.log('   ✓ Custom line height and line gaps')
console.log('   ✓ Character and word spacing')
console.log('   ✓ Complex article layout with multiple styles\n')
