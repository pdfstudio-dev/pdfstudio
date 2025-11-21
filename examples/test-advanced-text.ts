import { PDFDocument } from '../src'

console.log('📝 Testing advanced text features...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

// Title
doc.text('ADVANCED TEXT FEATURES', 50, 720, 24)

// Example 1: Word wrapping with left alignment
doc.text('1. Word Wrap (Left Aligned):', 50, 680, 14)
doc.text('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.', {
  x: 50,
  y: 660,
  fontSize: 11,
  width: 500,
  align: 'left'
})

// Example 2: Center alignment
doc.text('2. Center Aligned:', 50, 600, 14)
doc.text('This text is centered within a 400-point width box. Multiple lines will all be centered individually for a balanced appearance.', {
  x: 50,
  y: 580,
  fontSize: 11,
  width: 400,
  align: 'center'
})

// Example 3: Right alignment
doc.text('3. Right Aligned:', 50, 520, 14)
doc.text('This text is right-aligned within its container. Each line aligns to the right edge of the text box.', {
  x: 50,
  y: 500,
  fontSize: 11,
  width: 400,
  align: 'right'
})

// Example 4: Justify alignment
doc.text('4. Justified Text:', 50, 450, 14)
doc.text('This text is justified, meaning words are spread out so each line fills the entire width. The last line remains left-aligned. This creates a clean, professional look for paragraphs.', {
  x: 50,
  y: 430,
  fontSize: 11,
  width: 500,
  align: 'justify'
})

// Example 5: Underlined text
doc.text('5. Underlined Text:', 50, 380, 14)
doc.text('This text has an underline decoration applied automatically.', {
  x: 50,
  y: 360,
  fontSize: 11,
  underline: true
})

// Example 6: Strike-through text
doc.text('6. Strike-through Text:', 50, 330, 14)
doc.text('This text has been struck through, useful for showing deletions.', {
  x: 50,
  y: 310,
  fontSize: 11,
  strike: true
})

// Example 7: Links
doc.text('7. Clickeable Links:', 50, 280, 14)
doc.text('Visit Anthropic at https://anthropic.com for more information.', {
  x: 50,
  y: 260,
  fontSize: 11,
  link: 'https://anthropic.com',
  underline: true
})

// Example 8: Combined features
doc.text('8. Combined Features:', 50, 220, 14)
doc.text('This link is underlined, wrapped, and centered within the box. Click to visit GitHub!', {
  x: 50,
  y: 200,
  fontSize: 11,
  width: 400,
  align: 'center',
  underline: true,
  link: 'https://github.com'
})

// Example 9: Vertical alignment
doc.text('9. Vertical Alignment:', 50, 150, 14)

// Draw boxes to show vertical alignment
doc.setStrokeColor(0.8, 0.8, 0.8)
doc.setLineWidth(1)
doc.rect(50, 80, 150, 60)
doc.stroke()
doc.rect(210, 80, 150, 60)
doc.stroke()
doc.rect(370, 80, 150, 60)
doc.stroke()

doc.text('Top', {
  x: 50,
  y: 80,
  fontSize: 10,
  width: 150,
  height: 60,
  align: 'center',
  valign: 'top'
})

doc.text('Center', {
  x: 210,
  y: 80,
  fontSize: 10,
  width: 150,
  height: 60,
  align: 'center',
  valign: 'center'
})

doc.text('Bottom', {
  x: 370,
  y: 80,
  fontSize: 10,
  width: 150,
  height: 60,
  align: 'center',
  valign: 'bottom'
})

// Save the PDF
doc.save('examples-output/test-advanced-text.pdf')

console.log('✅ PDF created: examples-output/test-advanced-text.pdf')
console.log('   Test all features:')
console.log('   - Word wrapping')
console.log('   - Alignment (left, center, right, justify)')
console.log('   - Vertical alignment (top, center, bottom)')
console.log('   - Underline')
console.log('   - Strike-through')
console.log('   - Clickeable links\n')
