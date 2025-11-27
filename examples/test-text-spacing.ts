import { PDFDocument } from '../src'

console.log('📝 Testing text spacing and formatting...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

// Title
doc.text('TEXT SPACING & FORMATTING', 50, 720, 24)

// Example 1: First line indent (paragraph style)
doc.text('1. Paragraph with Indent:', 50, 680, 14)
doc.text('This paragraph has a first-line indent of 30 points, which is a common formatting style for books and formal documents. Notice how the first line starts further to the right than the subsequent lines.', {
  x: 50,
  y: 660,
  fontSize: 11,
  width: 500,
  indent: 30
})

// Example 2: Line gap (extra space between lines)
doc.text('2. Increased Line Gap:', 50, 600, 14)
doc.text('This text has extra spacing between lines.\nEach line has an additional 5 points of gap,\nmaking it easier to read.\nThis is useful for readability.', {
  x: 50,
  y: 580,
  fontSize: 11,
  lineGap: 5
})

// Example 3: Character spacing
doc.text('3. Character Spacing:', 50, 510, 14)
doc.text('Normal character spacing', {
  x: 50,
  y: 490,
  fontSize: 11
})
doc.text('Expanded character spacing', {
  x: 50,
  y: 470,
  fontSize: 11,
  characterSpacing: 2
})
doc.text('Condensed character spacing', {
  x: 50,
  y: 450,
  fontSize: 11,
  characterSpacing: -0.5
})

// Example 4: Word spacing
doc.text('4. Word Spacing:', 50, 410, 14)
doc.text('This is normal word spacing in a sentence.', {
  x: 50,
  y: 390,
  fontSize: 11
})
doc.text('This    has    expanded    word    spacing.', {
  x: 50,
  y: 370,
  fontSize: 11,
  wordSpacing: 10
})

// Example 5: Multi-line with various alignments
doc.text('5. Multi-line Text Samples:', 50, 330, 14)

const sampleText = 'The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet at least once.'

// Left aligned box
doc.setStrokeColor(0.7, 0.7, 0.7)
doc.rect(50, 240, 160, 70)
doc.stroke()
doc.text(sampleText, {
  x: 55,
  y: 305,
  fontSize: 9,
  width: 150,
  align: 'left'
})

// Center aligned box
doc.rect(220, 240, 160, 70)
doc.stroke()
doc.text(sampleText, {
  x: 225,
  y: 305,
  fontSize: 9,
  width: 150,
  align: 'center'
})

// Right aligned box
doc.rect(390, 240, 160, 70)
doc.stroke()
doc.text(sampleText, {
  x: 395,
  y: 305,
  fontSize: 9,
  width: 150,
  align: 'right'
})

// Example 6: Combination of features
doc.text('6. All Features Combined:', 50, 210, 14)
doc.text('This text combines indent, line gap, character spacing, and justification for a highly customized appearance. It demonstrates the flexibility of the text rendering system.', {
  x: 50,
  y: 190,
  fontSize: 11,
  width: 500,
  align: 'justify',
  indent: 20,
  lineGap: 3,
  characterSpacing: 0.5
})

// Example 7: Long URL with word wrap
doc.text('7. Long Links with Wrap:', 50, 130, 14)
doc.text('For more information, please visit our documentation at https://pdfuistudio.io/docs or contact pdfstudio@ideas2code.dev for support.', {
  x: 50,
  y: 110,
  fontSize: 10,
  width: 500,
  align: 'left',
  link: 'https://pdfuistudio.io/docs',
  underline: true
})

// Footer
doc.text('All features working correctly!', {
  x: 50,
  y: 60,
  fontSize: 12,
  width: 512,
  align: 'center'
})

// Save the PDF
doc.save('examples-output/test-text-spacing.pdf')

console.log('✅ PDF created: examples-output/test-text-spacing.pdf')
console.log('   Additional features tested:')
console.log('   - First-line indent')
console.log('   - Line gap (spacing)')
console.log('   - Character spacing')
console.log('   - Word spacing')
console.log('   - Multi-line alignment comparisons')
console.log('   - Combined formatting\n')
