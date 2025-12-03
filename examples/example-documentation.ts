import { PDFDocument } from '../src'

console.log('📚 Generating Professional Documentation with ParagraphGap...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 60
})

// Document title
doc.setFillColor(0.1, 0.1, 0.1)
doc.text('API DOCUMENTATION', {
  x: 60,
  y: 740,
  fontSize: 28,
  font: 'Helvetica-Bold',
  paragraphGap: 5  // Small gap after main title
})

doc.setFillColor(0.3, 0.3, 0.3)
doc.text('PDFStudio Text Features Guide', {
  x: 60,
  y: doc.getCurrentY(),
  fontSize: 18,
  font: 'Helvetica',
  paragraphGap: 25  // Larger gap before content starts
})

console.log('✓ Title section created\n')

// Table of contents
const tocY = doc.getCurrentY()
doc.setFillColor(0.1, 0.1, 0.1)
doc.text('Table of Contents', {
  x: 60,
  y: tocY,
  fontSize: 14,
  font: 'Helvetica-Bold',
  paragraphGap: 12
})

const tocItems = [
  '1. Introduction',
  '2. Ellipsis Feature',
  '3. Paragraph Gap Feature',
  '4. Code Examples',
  '5. Best Practices'
]

doc.setFillColor(0.2, 0.2, 0.2)
tocItems.forEach((item, index) => {
  doc.text(item, {
  x: 70,
  y: doc.getCurrentY(),
  fontSize: 11,
  font: 'Helvetica',
    paragraphGap: 6  // Consistent spacing in TOC
  })
  console.log(`  ✓ ${item}`)
})

doc.setFillColor(0.7, 0.7, 0.7)
doc.text('─'.repeat(80), {
  x: 60,
  y: doc.getCurrentY() - 5,
  fontSize: 10,
  font: 'Helvetica',
  paragraphGap: 20  // Space before next section
})

// Section 1: Introduction
console.log('\n✓ Writing Section 1: Introduction')

doc.setFillColor(0.1, 0.1, 0.1)
doc.text('1. Introduction', {
  x: 60,
  y: doc.getCurrentY(),
  fontSize: 16,
  font: 'Helvetica-Bold',
  paragraphGap: 15  // Space after section heading
})

const intro1 = `PDFStudio v0.3.1 introduces two powerful text formatting features that give you precise control over text layout and overflow handling.`

doc.setFillColor(0.2, 0.2, 0.2)
doc.text(intro1, {
  x: 60,
  y: doc.getCurrentY(),
  width: 492,
  fontSize: 11,
  align: 'justify',
  lineGap: 3,
  paragraphGap: 12  // Space between paragraphs
})

const intro2 = `These features are designed to work seamlessly with existing PDFStudio functionality, including multi-column layouts, text rotation, and advanced alignment options.`

doc.text(intro2, {
  x: 60,
  y: doc.getCurrentY(),
  width: 492,
  fontSize: 11,
  align: 'justify',
  lineGap: 3,
  paragraphGap: 20  // Larger gap before next section
})

// Section 2: Ellipsis Feature
console.log('✓ Writing Section 2: Ellipsis Feature')

doc.setFillColor(0.1, 0.1, 0.1)
doc.text('2. Ellipsis Feature', {
  x: 60,
  y: doc.getCurrentY(),
  fontSize: 16,
  font: 'Helvetica-Bold',
  paragraphGap: 15
})

doc.text('Overview', {
  x: 60,
  y: doc.getCurrentY(),
  fontSize: 12,
  font: 'Helvetica-Bold',
  paragraphGap: 8
})

const ellipsisOverview = `The ellipsis feature automatically truncates text that exceeds the available height, appending an ellipsis character to indicate there is more content. This is particularly useful for creating previews, summaries, or fitting content into fixed-size boxes.`

doc.setFillColor(0.2, 0.2, 0.2)
doc.text(ellipsisOverview, {
  x: 60,
  y: doc.getCurrentY(),
  width: 492,
  fontSize: 11,
  align: 'justify',
  lineGap: 3,
  paragraphGap: 15
})

// Code example box
doc.setFillColor(0.1, 0.1, 0.1)
doc.text('Example Usage', {
  x: 60,
  y: doc.getCurrentY(),
  fontSize: 12,
  font: 'Helvetica-Bold',
  paragraphGap: 8
})

const codeBoxY = doc.getCurrentY()
doc.setFillColor(0.95, 0.96, 0.98)
doc.roundedRect(60, codeBoxY - 75, 492, 75, 6)
doc.fill()

const codeExample1 = `doc.text(longText, {
  x: 50, y: 500,
  width: 200,
  height: 60,        // Limited height
  fontSize: 10,
  ellipsis: true     // Default "..."
})`

doc.setFillColor(0.1, 0.1, 0.3)
doc.text(codeExample1, {
  x: 70,
  y: codeBoxY - 10,
  fontSize: 10,
  font: 'Courier',
  lineGap: 4,
  paragraphGap: 15
})

doc.setFillColor(0.1, 0.1, 0.1)
doc.text('Key Parameters', {
  x: 60,
  y: doc.getCurrentY(),
  fontSize: 12,
  font: 'Helvetica-Bold',
  paragraphGap: 10
})

// Parameter list with consistent gaps
const params = [
  { name: 'ellipsis', type: 'boolean | string', desc: 'Enable truncation with ellipsis. Use true for "..." or provide custom string.' },
  { name: 'width', type: 'number', desc: 'Required. Maximum width of text area in points.' },
  { name: 'height', type: 'number', desc: 'Required. Maximum height of text area in points.' }
]

params.forEach(param => {
  doc.setFillColor(0.1, 0.1, 0.1)
  doc.text(`• ${param.name}`, {
  x: 70,
  y: doc.getCurrentY(),
  fontSize: 10,
  font: 'Helvetica-Bold',
    paragraphGap: 4
  })

  doc.setFillColor(0.3, 0.1, 0.1)
  doc.text(`  Type: ${param.type}`, {
  x: 80,
  y: doc.getCurrentY(),
  fontSize: 9,
  font: 'Courier',
    paragraphGap: 4
  })

  doc.setFillColor(0.3, 0.3, 0.3)
  doc.text(`  ${param.desc}`, {
  x: 80,
  y: doc.getCurrentY(),
  fontSize: 10,
  font: 'Helvetica',
    width: 472,
    paragraphGap: 10  // Space after each parameter
  })
})

doc.setFillColor(0.7, 0.7, 0.7)
doc.text('─'.repeat(80), {
  x: 60,
  y: doc.getCurrentY() - 5,
  fontSize: 10,
  font: 'Helvetica',
  paragraphGap: 20
})

// Section 3: Paragraph Gap
console.log('✓ Writing Section 3: Paragraph Gap Feature')

// Check if we need a new page
if (doc.getCurrentY() < 200) {
  doc.addPage()
  console.log('  → New page added')
}

doc.setFillColor(0.1, 0.1, 0.1)
doc.text('3. Paragraph Gap Feature', {
  x: 60,
  y: doc.getCurrentY(),
  fontSize: 16,
  font: 'Helvetica-Bold',
  paragraphGap: 15
})

doc.text('Overview', {
  x: 60,
  y: doc.getCurrentY(),
  fontSize: 12,
  font: 'Helvetica-Bold',
  paragraphGap: 8
})

const paragraphGapOverview = `The paragraphGap feature adds precise spacing after a paragraph, giving you fine control over vertical rhythm in your documents. This creates professional typography with consistent spacing between sections.`

doc.setFillColor(0.2, 0.2, 0.2)
doc.text(paragraphGapOverview, {
  x: 60,
  y: doc.getCurrentY(),
  width: 492,
  fontSize: 11,
  align: 'justify',
  lineGap: 3,
  paragraphGap: 15
})

doc.setFillColor(0.1, 0.1, 0.1)
doc.text('Example Usage', {
  x: 60,
  y: doc.getCurrentY(),
  fontSize: 12,
  font: 'Helvetica-Bold',
  paragraphGap: 8
})

const codeBox2Y = doc.getCurrentY()
doc.setFillColor(0.95, 0.96, 0.98)
doc.roundedRect(60, codeBox2Y - 65, 492, 65, 6)
doc.fill()

const codeExample2 = `doc.text('First paragraph', {
  x: 50, y: 700,
  width: 500,
  paragraphGap: 20   // 20pt space after
})

doc.text('Second paragraph', {
  x: 50, y: doc.getCurrentY(),
  width: 500
})`

doc.setFillColor(0.1, 0.1, 0.3)
doc.text(codeExample2, {
  x: 70,
  y: codeBox2Y - 10,
  fontSize: 10,
  font: 'Courier',
  lineGap: 4,
  paragraphGap: 20
})

// Section 4: Best Practices
console.log('✓ Writing Section 4: Best Practices')

doc.setFillColor(0.1, 0.1, 0.1)
doc.text('4. Best Practices', {
  x: 60,
  y: doc.getCurrentY(),
  fontSize: 16,
  font: 'Helvetica-Bold',
  paragraphGap: 15
})

const bestPractices = [
  {
    title: 'Use Consistent Gap Values',
    content: 'Maintain visual rhythm by using a consistent set of gap values throughout your document (e.g., 12pt for normal paragraphs, 20pt for section breaks).'
  },
  {
    title: 'Combine with getCurrentY()',
    content: 'Always use doc.getCurrentY() for positioning when using paragraphGap to ensure proper vertical flow.'
  },
  {
    title: 'Custom Ellipsis for Context',
    content: 'Use custom ellipsis text like "...[Read More]" or "…" to provide context about truncated content.'
  },
  {
    title: 'Test Different Devices',
    content: 'Preview your PDFs on different viewers to ensure ellipsis and spacing render consistently.'
  }
]

bestPractices.forEach((practice, index) => {
  doc.setFillColor(0.1, 0.1, 0.1)
  doc.text(`${index + 1}. ${practice.title}`, {
  x: 60,
  y: doc.getCurrentY(),
  fontSize: 11,
  font: 'Helvetica-Bold',
    paragraphGap: 6
  })

  doc.setFillColor(0.3, 0.3, 0.3)
  doc.text(practice.content, {
    x: 75,
    y: doc.getCurrentY(),
    width: 477,
    fontSize: 10,
    align: 'justify',
    lineGap: 2,
    paragraphGap: 12  // Space between practices
  })

  console.log(`  ${index + 1}. ${practice.title}`)
})

doc.setFillColor(0.7, 0.7, 0.7)
doc.text('─'.repeat(80), {
  x: 60,
  y: doc.getCurrentY() - 5,
  fontSize: 10,
  font: 'Helvetica',
  paragraphGap: 20
})

// Summary box
console.log('✓ Adding summary box')

const summaryY = doc.getCurrentY()

if (summaryY < 150) {
  doc.addPage()
  console.log('  → New page added for summary')
}

doc.setFillColor(0.93, 0.95, 1)
const summaryHeight = 90
doc.roundedRect(60, doc.getCurrentY() - summaryHeight, 492, summaryHeight, 8)
doc.fill()

// Border
doc.setStrokeColor(0.31, 0.27, 0.90)
doc.setLineWidth(2)
doc.roundedRect(60, doc.getCurrentY() - summaryHeight, 492, summaryHeight, 8)
doc.stroke()

doc.setFillColor(0.1, 0.1, 0.1)
doc.text('✓ Summary', {
  x: 75,
  y: doc.getCurrentY() - 15,
  fontSize: 14,
  font: 'Helvetica-Bold',
  paragraphGap: 10
})

const summary = `These new features make PDFStudio ideal for creating professional documents with precise typography. The ellipsis feature solves the common problem of content overflow, while paragraphGap ensures consistent visual rhythm throughout your documents.`

doc.setFillColor(0.2, 0.2, 0.2)
doc.text(summary, {
  x: 75,
  y: doc.getCurrentY(),
  width: 462,
  fontSize: 10,
  align: 'justify',
  lineGap: 3,
  paragraphGap: 15
})

// Footer
const pageCount = doc.getPageCount()
for (let i = 0; i < pageCount; i++) {
  doc.switchToPage(i)

  doc.setFillColor(0.4, 0.4, 0.4)
  doc.text(`Page ${i + 1} of ${pageCount}`, 60, 30, 9)

  doc.text('PDFStudio v0.3.1 Documentation', 492 - doc.widthOfString('PDFStudio v0.3.1 Documentation', 9), 30, 9)
}

// Save
doc.save('examples/output/example-documentation.pdf')

console.log('\n✅ Documentation generated successfully!')
console.log('📄 PDF saved to: examples/output/example-documentation.pdf')
console.log('\n💡 Key Feature Demonstrated:')
console.log('   - paragraphGap: Professional spacing throughout documentation')
console.log('   - Consistent vertical rhythm with gap values: 6pt, 8pt, 12pt, 15pt, 20pt')
console.log('   - Combined with getCurrentY() for automatic layout flow\n')
