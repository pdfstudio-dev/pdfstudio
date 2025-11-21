import { PDFDocument } from '../src'

console.log('📄 Generating PDFs with different numbering styles...\n')

// ======================
// Example 1: Basic numbering at bottom center
// ======================
console.log('1️⃣ Basic numbering (bottom-center)...')
const doc1 = new PDFDocument({
  pageNumbers: {
    enabled: true,
    position: 'bottom-center',
    format: 'Page {current} of {total}',
    fontSize: 10
  }
})

doc1.text('Document with Basic Numbering', 150, 750, 20)
doc1.text('This page has numbering at bottom center', 100, 700, 12)

doc1.addPage()
doc1.text('Page 2', 250, 750, 20)
doc1.text('Numbering is added automatically', 150, 700, 12)

doc1.addPage()
doc1.text('Page 3', 250, 750, 20)

doc1.save('examples-output/page-numbers-01-basic.pdf')
console.log('   ✅ examples-output/page-numbers-01-basic.pdf\n')

// ======================
// Example 2: Numbering in top-right corner
// ======================
console.log('2️⃣ Numbering top-right...')
const doc2 = new PDFDocument({
  pageNumbers: {
    enabled: true,
    position: 'top-right',
    format: '{current}/{total}',
    fontSize: 12,
    color: '#3498db'
  }
})

doc2.text('Top-Right Numbering', 180, 720, 20)
doc2.addPage()
doc2.text('Page 2 - Color Azul', 200, 720, 20)
doc2.addPage()
doc2.text('Page 3', 240, 720, 20)

doc2.save('examples-output/page-numbers-02-top-right.pdf')
console.log('   ✅ examples-output/page-numbers-02-top-right.pdf\n')

// ======================
// Example 3: Different positions
// ======================
console.log('3️⃣ Different positions...')

const positions: Array<{ pos: any, name: string }> = [
  { pos: 'top-left', name: 'Top Left' },
  { pos: 'top-center', name: 'Top Center' },
  { pos: 'top-right', name: 'Top Right' },
  { pos: 'bottom-left', name: 'Bottom Left' },
  { pos: 'bottom-center', name: 'Bottom Center' },
  { pos: 'bottom-right', name: 'Bottom Right' }
]

positions.forEach(({ pos, name }) => {
  const doc = new PDFDocument({
    pageNumbers: {
      enabled: true,
      position: pos,
      format: 'Page {current}',
      fontSize: 10
    }
  })

  doc.text(`Position: ${name}`, 200, 400, 16)
  doc.addPage()
  doc.text('Second page', 220, 400, 16)

  const filename = `examples-output/page-numbers-03-${pos}.pdf`
  doc.save(filename)
  console.log(`   ✅ ${filename}`)
})
console.log()

// ======================
// Example 4: Custom format with function
// ======================
console.log('4️⃣ Custom format with function...')
const doc4 = new PDFDocument()

doc4.setPageNumbers({
  enabled: true,
  position: 'bottom-center',
  format: (current, total) => {
    if (current === 1) return 'Cover'
    if (current === total) return 'End of Document'
    return `Section ${current - 1} of ${total - 2}`
  },
  fontSize: 11,
  color: '#e74c3c'
})

doc4.text('COVER', 250, 400, 24)
doc4.addPage()
doc4.text('Content - Section 1', 200, 400, 16)
doc4.addPage()
doc4.text('Content - Section 2', 200, 400, 16)
doc4.addPage()
doc4.text('FINAL', 260, 400, 24)

doc4.save('examples-output/page-numbers-04-custom-function.pdf')
console.log('   ✅ examples-output/page-numbers-04-custom-function.pdf\n')

// ======================
// Example 5: Exclude specific pages
// ======================
console.log('5️⃣ Exclude cover from numbering...')
const doc5 = new PDFDocument({
  pageNumbers: {
    enabled: true,
    position: 'bottom-center',
    format: 'Page {current} of {total}',
    fontSize: 10,
    excludePages: [0]  // Exclude first page (index 0)
  }
})

doc5.text('COVER', 250, 400, 30)
doc5.text('(no page number)', 210, 350, 12)

doc5.addPage()
doc5.text('Content Page 1', 200, 400, 16)
doc5.text('This page DOES have numbering', 180, 350, 12)

doc5.addPage()
doc5.text('Content Page 2', 200, 400, 16)

doc5.save('examples-output/page-numbers-05-exclude-cover.pdf')
console.log('   ✅ examples-output/page-numbers-05-exclude-cover.pdf\n')

// ======================
// Example 6: Start numbering from specific page
// ======================
console.log('6️⃣ Start numbering from page 2...')
const doc6 = new PDFDocument({
  pageNumbers: {
    enabled: true,
    position: 'bottom-right',
    format: '{current}',
    fontSize: 10,
    startAt: 2  // Start from page 2
  }
})

doc6.text('COVER', 250, 400, 30)
doc6.text('(no numbering)', 230, 350, 12)

doc6.addPage()
doc6.text('First Numbered Page', 190, 400, 16)
doc6.text('Numbering starts here', 180, 350, 12)

doc6.addPage()
doc6.text('Second Numbered Page', 180, 400, 16)

doc6.save('examples-output/page-numbers-06-start-at.pdf')
console.log('   ✅ examples-output/page-numbers-06-start-at.pdf\n')

// ======================
// Example 7: Complete document with charts and numbering
// ======================
console.log('7️⃣ Complete document with charts...')
const doc7 = new PDFDocument({
  pageNumbers: {
    enabled: true,
    position: 'bottom-center',
    format: 'Page {current} of {total}',
    fontSize: 9,
    color: '#7f8c8d',
    excludePages: [0]  // No number on cover
  }
})

// Cover
doc7.text('Sales Report 2024', 180, 500, 26)
doc7.text('Quarterly Analysis', 210, 450, 18)

// Page 2: Bar chart
doc7.addPage()
doc7.text('Sales by Quarter', 190, 750, 20)
doc7.barChart({
  data: [
    { label: 'Q1', value: 145 },
    { label: 'Q2', value: 162 },
    { label: 'Q3', value: 155 },
    { label: 'Q4', value: 178 }
  ],
  x: 100,
  y: 400,
  width: 400,
  height: 250,
  barColors: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12'],
  title: 'Quarterly Sales 2024',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showValues: true
})

// Page 3: Grouped chart
doc7.addPage()
doc7.text('Annual Comparison', 200, 750, 20)
doc7.groupedBarChart({
  data: [
    {
      label: 'Q1',
      values: [125, 138, 145],
      series: ['2022', '2023', '2024']
    },
    {
      label: 'Q2',
      values: [142, 151, 162],
      series: ['2022', '2023', '2024']
    }
  ],
  x: 100,
  y: 400,
  width: 400,
  height: 250,
  colors: ['#e74c3c', '#3498db', '#2ecc71'],
  title: 'Comparison 2022-2024',
  showAxes: true,
  showGrid: true,
  legend: {
    show: true,
    position: 'top-right'
  }
})

doc7.save('examples-output/page-numbers-07-complete-report.pdf')
console.log('   ✅ examples-output/page-numbers-07-complete-report.pdf\n')

// ======================
// Summary
// ======================
console.log('✅ All numbering examples generated successfully!')
console.log('\n📁 Files generated:')
console.log('   • page-numbers-01-basic.pdf')
console.log('   • page-numbers-02-top-right.pdf')
console.log('   • page-numbers-03-*.pdf (6 positions)')
console.log('   • page-numbers-04-custom-function.pdf')
console.log('   • page-numbers-05-exclude-cover.pdf')
console.log('   • page-numbers-06-start-at.pdf')
console.log('   • page-numbers-07-complete-report.pdf')
console.log('\n🎨 Features demonstrated:')
console.log('   ✓ 6 different positions')
console.log('   ✓ Custom formats (string and function)')
console.log('   ✓ Custom colors')
console.log('   ✓ Exclude specific pages')
console.log('   ✓ Start from specific page')
console.log('   ✓ Integration with charts')
