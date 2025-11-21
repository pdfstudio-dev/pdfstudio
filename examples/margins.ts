import { PDFDocument } from '../src'

console.log('📄 Generating PDFs with different margin configurations...\\n')

// ======================
// Example 1: Uniform margins
// ======================
console.log('1️⃣ Uniform margins (50 points)...')

const doc1 = new PDFDocument({
  size: 'Letter',
  margins: 50,  // 50 points on all sides
  pageNumbers: {
    enabled: true,
    position: 'bottom-center',
    format: 'Page {current}'
  }
})

// Draw page border (without margins)
doc1.setStrokeColor(0.8, 0.8, 0.8)
doc1.setLineWidth(1)
doc1.rect(0, 0, doc1.getPageWidth(), doc1.getPageHeight())
doc1.stroke()

// Draw content area border (with margins)
doc1.setStrokeColor(0, 0.5, 1)
doc1.setLineWidth(2)
doc1.rect(
  doc1.getContentX(),
  doc1.getContentBottom(),
  doc1.getContentWidth(),
  doc1.getContentHeight()
)
doc1.stroke()

// Content within margins area
doc1.text('UNIFORM MARGINS', doc1.getContentX() + 150, doc1.getContentY() - 50, 24)
doc1.text('50 points on all sides', doc1.getContentX() + 130, doc1.getContentY() - 90, 16)

doc1.text(`Page area: ${doc1.getPageWidth()} × ${doc1.getPageHeight()} pts`, doc1.getContentX(), doc1.getContentY() - 140, 12)
doc1.text(`Content area: ${doc1.getContentWidth()} × ${doc1.getContentHeight()} pts`, doc1.getContentX(), doc1.getContentY() - 160, 12)

doc1.text('Gray line: Page border', doc1.getContentX(), doc1.getContentY() - 200, 12)
doc1.text('Blue line: Content area (with margins)', doc1.getContentX(), doc1.getContentY() - 220, 12)

const margins1 = doc1.getMargins()
doc1.text(`Margins: Top=${margins1.top}, Right=${margins1.right}, Bottom=${margins1.bottom}, Left=${margins1.left}`, doc1.getContentX(), doc1.getContentY() - 260, 12)

doc1.save('examples-output/margins-01-uniform.pdf')
console.log('   ✅ examples-output/margins-01-uniform.pdf\\n')

// ======================
// Example 2: Individual margins
// ======================
console.log('2️⃣ Individual margins...')

const doc2 = new PDFDocument({
  size: 'Letter',
  margins: {
    top: 80,
    right: 40,
    bottom: 60,
    left: 100
  },
  pageNumbers: {
    enabled: true,
    position: 'bottom-right',
    format: '{current}'
  }
})

// Draw page border
doc2.setStrokeColor(0.8, 0.8, 0.8)
doc2.setLineWidth(1)
doc2.rect(0, 0, doc2.getPageWidth(), doc2.getPageHeight())
doc2.stroke()

// Draw content area border
doc2.setStrokeColor(1, 0.5, 0)
doc2.setLineWidth(2)
doc2.rect(
  doc2.getContentX(),
  doc2.getContentBottom(),
  doc2.getContentWidth(),
  doc2.getContentHeight()
)
doc2.stroke()

doc2.text('INDIVIDUAL MARGINS', doc2.getContentX() + 110, doc2.getContentY() - 50, 24)

const margins2 = doc2.getMargins()
doc2.text('Margin configuration:', doc2.getContentX(), doc2.getContentY() - 100, 16)
doc2.text(`• Top: ${margins2.top} pts`, doc2.getContentX() + 20, doc2.getContentY() - 130, 14)
doc2.text(`• Right: ${margins2.right} pts`, doc2.getContentX() + 20, doc2.getContentY() - 155, 14)
doc2.text(`• Bottom: ${margins2.bottom} pts`, doc2.getContentX() + 20, doc2.getContentY() - 180, 14)
doc2.text(`• Left: ${margins2.left} pts`, doc2.getContentX() + 20, doc2.getContentY() - 205, 14)

doc2.text('Notice how the left margin is larger', doc2.getContentX(), doc2.getContentY() - 250, 12)
doc2.text('(ideal for binding)', doc2.getContentX(), doc2.getContentY() - 270, 12)

doc2.text(`Content area: ${doc2.getContentWidth()} × ${doc2.getContentHeight()} pts`, doc2.getContentX(), doc2.getContentY() - 310, 12)

doc2.save('examples-output/margins-02-individual.pdf')
console.log('   ✅ examples-output/margins-02-individual.pdf\\n')

// ======================
// Example 3: No margins (full bleed content)
// ======================
console.log('3️⃣ No margins (full bleed content)...')

const doc3 = new PDFDocument({
  size: 'Letter',
  margins: 0  // No margins
})

// Full background
doc3.setFillColor(0.95, 0.95, 1)
doc3.rect(0, 0, doc3.getPageWidth(), doc3.getPageHeight())
doc3.fill()

doc3.text('NO MARGINS', 220, 750, 28)
doc3.text('(Full bleed content)', 210, 710, 16)

doc3.text('Content can extend to the edges', 150, 650, 14)
doc3.text('Ideal for posters, brochures, designs', 160, 625, 12)

doc3.text(`Total area: ${doc3.getPageWidth()} × ${doc3.getPageHeight()} pts`, 180, 580, 12)
doc3.text(`Content area: ${doc3.getContentWidth()} × ${doc3.getContentHeight()} pts`, 150, 560, 12)
doc3.text('(They are equal because there are no margins)', 160, 540, 10)

doc3.save('examples-output/margins-03-none.pdf')
console.log('   ✅ examples-output/margins-03-none.pdf\\n')

// ======================
// Example 4: Margins for binding
// ======================
console.log('4️⃣ Margins for binding...')

const docBinding = new PDFDocument({
  size: 'Letter',
  margins: {
    top: 72,      // 1 inch
    right: 54,    // 0.75 inches
    bottom: 72,   // 1 inch
    left: 108     // 1.5 inches (more space for binding)
  },
  pageNumbers: {
    enabled: true,
    position: 'bottom-center',
    format: 'Page {current}'
  }
})

// Draw guide lines
docBinding.setStrokeColor(0.9, 0.9, 0.9)
docBinding.setLineWidth(0.5)

// Binding line
docBinding.moveTo(docBinding.getContentX(), 0)
docBinding.lineTo(docBinding.getContentX(), docBinding.getPageHeight())
docBinding.stroke()

// Content area border
docBinding.setStrokeColor(0.2, 0.6, 0.2)
docBinding.setLineWidth(2)
docBinding.rect(
  docBinding.getContentX(),
  docBinding.getContentBottom(),
  docBinding.getContentWidth(),
  docBinding.getContentHeight()
)
docBinding.stroke()

docBinding.text('DOCUMENT FOR BINDING', docBinding.getContentX() + 80, docBinding.getContentY() - 50, 20)
docBinding.text('Wide left margin (108 pts)', docBinding.getContentX(), docBinding.getContentY() - 100, 14)

docBinding.text('Typical configuration for bound documents:', docBinding.getContentX(), docBinding.getContentY() - 140, 12)
docBinding.text('• Large left margin (binding space)', docBinding.getContentX() + 20, docBinding.getContentY() - 165, 11)
docBinding.text('• Equal top and bottom margins (balance)', docBinding.getContentX() + 20, docBinding.getContentY() - 185, 11)
docBinding.text('• Standard right margin', docBinding.getContentX() + 20, docBinding.getContentY() - 205, 11)

docBinding.text('This type of margin is common in:', docBinding.getContentX(), docBinding.getContentY() - 245, 12)
docBinding.text('✓ Books', docBinding.getContentX() + 20, docBinding.getContentY() - 270, 11)
docBinding.text('✓ Theses and academic documents', docBinding.getContentX() + 20, docBinding.getContentY() - 290, 11)
docBinding.text('✓ Manuals', docBinding.getContentX() + 20, docBinding.getContentY() - 310, 11)
docBinding.text('✓ Formal reports', docBinding.getContentX() + 20, docBinding.getContentY() - 330, 11)

docBinding.save('examples-output/margins-04-binding.pdf')
console.log('   ✅ examples-output/margins-04-binding.pdf\\n')

// ======================
// Example 5: Change margins dynamically
// ======================
console.log('5️⃣ Change margins between pages...')

const doc5 = new PDFDocument({
  size: 'Letter',
  margins: 50
})

// Page 1: Normal margins
doc5.setStrokeColor(0, 0.5, 1)
doc5.setLineWidth(2)
doc5.rect(doc5.getContentX(), doc5.getContentBottom(), doc5.getContentWidth(), doc5.getContentHeight())
doc5.stroke()

doc5.text('PAGE 1: 50 pt margins', doc5.getContentX() + 120, doc5.getContentY() - 50, 20)
doc5.text(`Content: ${doc5.getContentWidth()} × ${doc5.getContentHeight()}`, doc5.getContentX(), doc5.getContentY() - 100, 12)

// Page 2: Change to larger margins
doc5.addPage()
doc5.setMargins(80)

doc5.setStrokeColor(1, 0.5, 0)
doc5.setLineWidth(2)
doc5.rect(doc5.getContentX(), doc5.getContentBottom(), doc5.getContentWidth(), doc5.getContentHeight())
doc5.stroke()

doc5.text('PAGE 2: 80 pt margins', doc5.getContentX() + 120, doc5.getContentY() - 50, 20)
doc5.text(`Content: ${doc5.getContentWidth()} × ${doc5.getContentHeight()}`, doc5.getContentX(), doc5.getContentY() - 100, 12)
doc5.text('Margins can be changed between pages', doc5.getContentX(), doc5.getContentY() - 140, 12)

// Page 3: Individual margins
doc5.addPage()
doc5.setMargins({ top: 40, right: 120, bottom: 40, left: 40 })

doc5.setStrokeColor(0.5, 0, 1)
doc5.setLineWidth(2)
doc5.rect(doc5.getContentX(), doc5.getContentBottom(), doc5.getContentWidth(), doc5.getContentHeight())
doc5.stroke()

doc5.text('PAGE 3: Custom margins', doc5.getContentX() + 60, doc5.getContentY() - 50, 20)
doc5.text('Wide right margin (120 pts)', doc5.getContentX(), doc5.getContentY() - 100, 14)
doc5.text('Ideal for margin notes', doc5.getContentX(), doc5.getContentY() - 125, 12)

doc5.save('examples-output/margins-05-dynamic.pdf')
console.log('   ✅ examples-output/margins-05-dynamic.pdf\\n')

// ======================
// Example 6: Practical use with charts
// ======================
console.log('6️⃣ Practical use with charts...')

const doc6 = new PDFDocument({
  size: 'Letter',
  margins: {
    top: 72,
    right: 54,
    bottom: 72,
    left: 54
  },
  pageNumbers: {
    enabled: true,
    position: 'bottom-center',
    format: 'Page {current} of {total}',
    fontSize: 10,
    color: '#666666'
  }
})

// Title using margins
doc6.text('SALES REPORT 2024', doc6.getContentX() + 120, doc6.getContentY() - 30, 24)
doc6.text('Quarterly Analysis', doc6.getContentX() + 170, doc6.getContentY() - 65, 16)

// Chart within content area
doc6.barChart({
  data: [
    { label: 'Q1', value: 150 },
    { label: 'Q2', value: 230 },
    { label: 'Q3', value: 180 },
    { label: 'Q4', value: 290 }
  ],
  x: doc6.getContentX(),
  y: doc6.getContentY() - 450,
  width: doc6.getContentWidth(),
  height: 300,
  barColors: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12'],
  title: 'Sales by Quarter',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showValues: true
})

// Additional text
doc6.text('Conclusions:', doc6.getContentX(), doc6.getContentY() - 480, 16)
doc6.text('• Q4 showed the highest growth', doc6.getContentX() + 20, doc6.getContentY() - 510, 12)
doc6.text('• Q3 requires special attention', doc6.getContentX() + 20, doc6.getContentY() - 530, 12)
doc6.text('• Overall positive trend', doc6.getContentX() + 20, doc6.getContentY() - 550, 12)

// Second page
doc6.addPage()
doc6.text('QUARTERLY DETAILS', doc6.getContentX() + 130, doc6.getContentY() - 30, 20)

doc6.text('First Quarter (Q1)', doc6.getContentX(), doc6.getContentY() - 80, 16)
doc6.text('Sales: $150,000', doc6.getContentX() + 20, doc6.getContentY() - 110, 12)
doc6.text('Growth: +15%', doc6.getContentX() + 20, doc6.getContentY() - 130, 12)

doc6.text('Second Quarter (Q2)', doc6.getContentX(), doc6.getContentY() - 170, 16)
doc6.text('Sales: $230,000', doc6.getContentX() + 20, doc6.getContentY() - 200, 12)
doc6.text('Growth: +53%', doc6.getContentX() + 20, doc6.getContentY() - 220, 12)

doc6.save('examples-output/margins-06-practical.pdf')
console.log('   ✅ examples-output/margins-06-practical.pdf\\n')

// ======================
// Example 7: Recommended margins guide
// ======================
console.log('7️⃣ Recommended margins guide...')

const docGuide = new PDFDocument({
  size: 'Letter',
  margins: 54,  // 0.75 inches
  pageNumbers: {
    enabled: true,
    position: 'bottom-right',
    format: '{current}/{total}',
    fontSize: 9,
    color: '#999999'
  }
})

docGuide.text('Recommended Margins Guide', docGuide.getContentX() + 100, docGuide.getContentY() - 30, 22)

docGuide.text('General Documents:', docGuide.getContentX(), docGuide.getContentY() - 80, 16)
docGuide.text('• All sides: 54-72 pts (0.75-1 inch)', docGuide.getContentX() + 20, docGuide.getContentY() - 110, 12)
docGuide.text('• Use: Letters, reports, corporate documents', docGuide.getContentX() + 20, docGuide.getContentY() - 130, 11)

docGuide.text('Academic Documents:', docGuide.getContentX(), docGuide.getContentY() - 170, 16)
docGuide.text('• Top/Bottom: 72 pts (1 inch)', docGuide.getContentX() + 20, docGuide.getContentY() - 200, 12)
docGuide.text('• Left: 90-108 pts (1.25-1.5 inches)', docGuide.getContentX() + 20, docGuide.getContentY() - 220, 12)
docGuide.text('• Right: 54-72 pts (0.75-1 inch)', docGuide.getContentX() + 20, docGuide.getContentY() - 240, 12)
docGuide.text('• Use: Theses, papers, research', docGuide.getContentX() + 20, docGuide.getContentY() - 260, 11)

docGuide.text('Books and Binding:', docGuide.getContentX(), docGuide.getContentY() - 300, 16)
docGuide.text('• Top: 54-72 pts', docGuide.getContentX() + 20, docGuide.getContentY() - 330, 12)
docGuide.text('• Inside (binding): 90-126 pts', docGuide.getContentX() + 20, docGuide.getContentY() - 350, 12)
docGuide.text('• Outside: 54-72 pts', docGuide.getContentX() + 20, docGuide.getContentY() - 370, 12)
docGuide.text('• Bottom: 72-90 pts', docGuide.getContentX() + 20, docGuide.getContentY() - 390, 12)

docGuide.text('Compact Documents:', docGuide.getContentX(), docGuide.getContentY() - 430, 16)
docGuide.text('• All sides: 36-45 pts (0.5-0.625 inches)', docGuide.getContentX() + 20, docGuide.getContentY() - 460, 12)
docGuide.text('• Use: Brochures, newsletters, dense documents', docGuide.getContentX() + 20, docGuide.getContentY() - 480, 11)

docGuide.text('No Margins:', docGuide.getContentX(), docGuide.getContentY() - 520, 16)
docGuide.text('• 0 pts', docGuide.getContentX() + 20, docGuide.getContentY() - 550, 12)
docGuide.text('• Use: Posters, graphic designs, brochures', docGuide.getContentX() + 20, docGuide.getContentY() - 570, 11)

// Second page with code examples
docGuide.addPage()
docGuide.text('Code Examples', docGuide.getContentX() + 150, docGuide.getContentY() - 30, 22)

docGuide.text('Uniform margins:', docGuide.getContentX(), docGuide.getContentY() - 80, 14)
docGuide.text('const doc = new PDFDocument({', docGuide.getContentX() + 10, docGuide.getContentY() - 105, 11)
docGuide.text('  margins: 72  // 1 inch on all sides', docGuide.getContentX() + 10, docGuide.getContentY() - 120, 11)
docGuide.text('})', docGuide.getContentX() + 10, docGuide.getContentY() - 135, 11)

docGuide.text('Individual margins:', docGuide.getContentX(), docGuide.getContentY() - 175, 14)
docGuide.text('const doc = new PDFDocument({', docGuide.getContentX() + 10, docGuide.getContentY() - 200, 11)
docGuide.text('  margins: {', docGuide.getContentX() + 10, docGuide.getContentY() - 215, 11)
docGuide.text('    top: 72,', docGuide.getContentX() + 10, docGuide.getContentY() - 230, 11)
docGuide.text('    right: 54,', docGuide.getContentX() + 10, docGuide.getContentY() - 245, 11)
docGuide.text('    bottom: 72,', docGuide.getContentX() + 10, docGuide.getContentY() - 260, 11)
docGuide.text('    left: 108', docGuide.getContentX() + 10, docGuide.getContentY() - 275, 11)
docGuide.text('  }', docGuide.getContentX() + 10, docGuide.getContentY() - 290, 11)
docGuide.text('})', docGuide.getContentX() + 10, docGuide.getContentY() - 305, 11)

docGuide.text('Useful methods:', docGuide.getContentX(), docGuide.getContentY() - 345, 14)
docGuide.text('doc.getContentX()      // X position of content area', docGuide.getContentX() + 10, docGuide.getContentY() - 370, 11)
docGuide.text('doc.getContentY()      // Y position of content area', docGuide.getContentX() + 10, docGuide.getContentY() - 385, 11)
docGuide.text('doc.getContentWidth()  // Width of content area', docGuide.getContentX() + 10, docGuide.getContentY() - 400, 11)
docGuide.text('doc.getContentHeight() // Height of content area', docGuide.getContentX() + 10, docGuide.getContentY() - 415, 11)
docGuide.text('doc.setMargins(...)    // Change margins', docGuide.getContentX() + 10, docGuide.getContentY() - 430, 11)
docGuide.text('doc.getMargins()       // Get current margins', docGuide.getContentX() + 10, docGuide.getContentY() - 445, 11)

docGuide.text('Useful conversions:', docGuide.getContentX(), docGuide.getContentY() - 485, 14)
docGuide.text('• 1 inch = 72 points', docGuide.getContentX() + 10, docGuide.getContentY() - 510, 11)
docGuide.text('• 0.5 inches = 36 points', docGuide.getContentX() + 10, docGuide.getContentY() - 525, 11)
docGuide.text('• 0.75 inches = 54 points', docGuide.getContentX() + 10, docGuide.getContentY() - 540, 11)
docGuide.text('• 1.5 inches = 108 points', docGuide.getContentX() + 10, docGuide.getContentY() - 555, 11)

docGuide.save('examples-output/margins-guide.pdf')
console.log('   ✅ examples-output/margins-guide.pdf\\n')

// ======================
// Summary
// ======================
console.log('✅ All margin examples generated successfully!\\n')
console.log('📁 Files generated:')
console.log('   • margins-01-uniform.pdf (uniform margins)')
console.log('   • margins-02-individual.pdf (individual margins)')
console.log('   • margins-03-none.pdf (no margins)')
console.log('   • margins-04-binding.pdf (for binding)')
console.log('   • margins-05-dynamic.pdf (change between pages)')
console.log('   • margins-06-practical.pdf (use with charts)')
console.log('   • margins-guide.pdf (complete guide)\\n')
console.log('📏 Features:')
console.log('   ✓ Uniform margins (number)')
console.log('   ✓ Individual margins (object)')
console.log('   ✓ Change margins dynamically')
console.log('   ✓ Helper methods for content area')
console.log('   ✓ Compatible with charts and numbering\\n')
console.log('💡 Recommended margins:')
console.log('   • General documents: 54-72 pts')
console.log('   • Academic documents: left=108, others=72 pts')
console.log('   • Books: inside=108-126 pts')
