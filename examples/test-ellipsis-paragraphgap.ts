import { PDFDocument } from '../src'

console.log('📝 Testing ellipsis and paragraphGap features...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

// Title
doc.text('TESTING NEW TEXT FEATURES', 50, 720, 24)

// Test 1: Ellipsis functionality
console.log('✓ Testing ellipsis feature...')
doc.text('1. Ellipsis (Default "..."):', 50, 680, 14)
const longText = 'This is a very long text that should be truncated with an ellipsis character when it exceeds the available height. We want to make sure that the ellipsis appears correctly at the end of the last visible line. This text continues much longer than the available space allows.'

// Draw box to show constraint
doc.setStrokeColor(0.8, 0.8, 0.8)
doc.setLineWidth(1)
doc.rect(50, 610, 200, 60)
doc.stroke()

doc.text(longText, {
  x: 50,
  y: 610,
  width: 200,
  height: 60,  // Limited height - text will be truncated
  fontSize: 10,
  ellipsis: true  // Enable ellipsis
})

// Test 2: Custom ellipsis character
console.log('✓ Testing custom ellipsis character...')
doc.text('2. Custom Ellipsis ("…"):', 280, 680, 14)

// Draw box
doc.rect(280, 610, 200, 60)
doc.stroke()

doc.text(longText, {
  x: 280,
  y: 610,
  width: 200,
  height: 60,
  fontSize: 10,
  ellipsis: '…'  // Custom ellipsis character
})

// Test 3: Paragraph gap functionality
console.log('✓ Testing paragraphGap feature...')
doc.text('3. Paragraph Gap (20pt gap):', 50, 530, 14)

doc.text('First paragraph with some text. This paragraph has a 20-point gap after it, which creates nice spacing before the next paragraph.', {
  x: 50,
  y: 510,
  width: 500,
  fontSize: 11,
  paragraphGap: 20  // 20 points gap after this paragraph
})

doc.text('Second paragraph that should appear 20 points below the first paragraph. This one has a 15-point gap.', {
  x: 50,
  y: doc.getCurrentY(),
  width: 500,
  fontSize: 11,
  paragraphGap: 15  // 15 points gap
})

doc.text('Third paragraph with 15 points gap from previous. No gap after this one.', {
  x: 50,
  y: doc.getCurrentY(),
  width: 500,
  fontSize: 11
})

// Test 4: Combined features
console.log('✓ Testing ellipsis + paragraphGap together...')
doc.text('4. Combined (Ellipsis + Gap):', 50, 350, 14)

const veryLongText = 'This is an extremely long paragraph that will test both the ellipsis truncation feature and the paragraph gap feature at the same time. It should be truncated with an ellipsis and then have a gap before the next paragraph. ' + longText + ' Even more text to ensure truncation happens.'

// Draw box
doc.rect(50, 280, 500, 60)
doc.stroke()

doc.text(veryLongText, {
  x: 50,
  y: 280,
  width: 500,
  height: 60,
  fontSize: 10,
  ellipsis: '...',
  paragraphGap: 25  // 25 points gap after truncated text
})

doc.text('This paragraph should appear 25 points below the truncated text above. The gap is clearly visible.', {
  x: 50,
  y: doc.getCurrentY(),
  width: 500,
  fontSize: 11
})

// Test 5: No ellipsis needed
doc.text('5. Short Text (No Ellipsis Needed):', 50, 160, 14)

// Draw box
doc.rect(50, 90, 200, 60)
doc.stroke()

doc.text('Short text that fits.', {
  x: 50,
  y: 90,
  width: 200,
  height: 60,
  fontSize: 10,
  ellipsis: true  // Enabled but not needed
})

// Save the PDF
doc.save('examples/output/test-ellipsis-paragraphgap.pdf')

console.log('\n✅ All tests completed successfully!')
console.log('📄 PDF saved to: examples/output/test-ellipsis-paragraphgap.pdf')
console.log('\nFeatures implemented:')
console.log('  - ellipsis: Truncate text with "..." when it exceeds available height')
console.log('  - paragraphGap: Add spacing after paragraphs\n')
