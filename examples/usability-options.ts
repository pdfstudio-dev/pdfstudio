import { PDFDocument } from '../src'

console.log('⚙️  Generating PDFs with usability options...\n')

// ======================
// Example 1: Layout Portrait (default)
// ======================
console.log('1️⃣ Layout Portrait (default)...')

const doc1 = new PDFDocument({
  size: 'Letter',  // 612 x 792
  layout: 'portrait',
  margins: 50,
  info: {
    Title: 'Portrait Document'
  }
})

doc1.text('LAYOUT: PORTRAIT (VERTICAL)', 150, 700, 20)
doc1.text('', 100, 660)
doc1.text(`Page dimensions:`, 100, 640, 14)
doc1.text(`Width: ${doc1.getPageWidth()} points`, 100, 615, 12)
doc1.text(`Height: ${doc1.getPageHeight()} points`, 100, 595, 12)
doc1.text('', 100, 570)
doc1.text('This is the default portrait (vertical) mode.', 100, 550, 12)
doc1.text('Ideal for standard documents, letters, reports.', 100, 530, 12)

doc1.save('examples-output/usability-01-portrait.pdf')
console.log('   ✅ examples-output/usability-01-portrait.pdf')
console.log(`      Dimensions: ${doc1.getPageWidth()} x ${doc1.getPageHeight()}\n`)

// ======================
// Example 2: Layout Landscape
// ======================
console.log('2️⃣ Layout Landscape...')

const doc2 = new PDFDocument({
  size: 'Letter',  // Now will be 792 x 612 (swapped)
  layout: 'landscape',
  margins: 50,
  info: {
    Title: 'Landscape Document'
  }
})

doc2.text('LAYOUT: LANDSCAPE (HORIZONTAL)', 250, 500, 20)
doc2.text('', 100, 460)
doc2.text(`Page dimensions:`, 100, 440, 14)
doc2.text(`Width: ${doc2.getPageWidth()} points`, 100, 415, 12)
doc2.text(`Height: ${doc2.getPageHeight()} points`, 100, 395, 12)
doc2.text('', 100, 370)
doc2.text('This is landscape (horizontal) mode.', 100, 350, 12)
doc2.text('Ideal for wide charts, tables, presentations.', 100, 330, 12)
doc2.text('', 100, 305)
doc2.text('Note: Dimensions were swapped automatically:', 100, 285, 11)
doc2.text('Portrait: 612 x 792  →  Landscape: 792 x 612', 100, 265, 11)

doc2.save('examples-output/usability-02-landscape.pdf')
console.log('   ✅ examples-output/usability-02-landscape.pdf')
console.log(`      Dimensions: ${doc2.getPageWidth()} x ${doc2.getPageHeight()}\n`)

// ======================
// Example 3: A4 Portrait vs Landscape Comparison
// ======================
console.log('3️⃣ A4 Portrait vs Landscape Comparison...')

const doc3portrait = new PDFDocument({
  size: 'A4',
  layout: 'portrait',
  margins: 40
})

doc3portrait.text('A4 PORTRAIT', 200, 750, 18)
doc3portrait.text(`${doc3portrait.getPageWidth()} x ${doc3portrait.getPageHeight()} points`, 170, 720, 14)
doc3portrait.save('examples-output/usability-03a-a4-portrait.pdf')

const doc3landscape = new PDFDocument({
  size: 'A4',
  layout: 'landscape',
  margins: 40
})

doc3landscape.text('A4 LANDSCAPE', 300, 500, 18)
doc3landscape.text(`${doc3landscape.getPageWidth()} x ${doc3landscape.getPageHeight()} points`, 270, 470, 14)
doc3landscape.save('examples-output/usability-03b-a4-landscape.pdf')

console.log('   ✅ examples-output/usability-03a-a4-portrait.pdf')
console.log(`      A4 Portrait: 595.28 x 841.89`)
console.log('   ✅ examples-output/usability-03b-a4-landscape.pdf')
console.log(`      A4 Landscape: 841.89 x 595.28\n`)

// ======================
// Example 4: PDF Version 1.4 (default)
// ======================
console.log('4️⃣ PDF Version 1.4 (default)...')

const doc4 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  // pdfVersion: '1.4'  // Default, not necessary to specify
  info: {
    Title: 'PDF Version 1.4'
  }
})

doc4.text('PDF VERSION 1.4 (DEFAULT)', 150, 700, 20)
doc4.text('', 100, 660)
doc4.text('This is the default PDF version.', 100, 640, 12)
doc4.text('Compatible with most viewers.', 100, 620, 12)

doc4.save('examples-output/usability-04-pdf-1.4.pdf')
console.log('   ✅ examples-output/usability-04-pdf-1.4.pdf')
console.log('      PDF Version: 1.4 (default)\n')

// ======================
// Example 5: PDF Version 1.7
// ======================
console.log('5️⃣ PDF Version 1.7...')

const doc5 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  pdfVersion: '1.7',
  info: {
    Title: 'PDF Version 1.7'
  }
})

doc5.text('PDF VERSION 1.7', 200, 700, 20)
doc5.text('', 100, 660)
doc5.text('This is PDF version 1.7.', 100, 640, 12)
doc5.text('Supports modern features such as:', 100, 620, 12)
doc5.text('• AES-256 encryption', 120, 600, 11)
doc5.text('• Advanced transparency', 120, 580, 11)
doc5.text('• Better compression', 120, 560, 11)

doc5.save('examples-output/usability-05-pdf-1.7.pdf')
console.log('   ✅ examples-output/usability-05-pdf-1.7.pdf')
console.log('      PDF Version: 1.7\n')

// ======================
// Example 6: Different PDF versions
// ======================
console.log('6️⃣ Different PDF versions...')

const versions = ['1.3', '1.4', '1.5', '1.6', '1.7']

versions.forEach((version, index) => {
  const doc = new PDFDocument({
    size: 'Letter',
    margins: 50,
    pdfVersion: version,
    info: {
      Title: `PDF Version ${version}`
    }
  })

  doc.text(`PDF VERSION ${version}`, 200, 700, 20)
  doc.text('', 100, 660)
  doc.text(`This is PDF version ${version}`, 100, 640, 12)

  doc.save(`examples-output/usability-06-${index + 1}-pdf-${version}.pdf`)
  console.log(`   ✅ examples-output/usability-06-${index + 1}-pdf-${version}.pdf`)
})
console.log('')

// ======================
// Example 7: autoFirstPage = false
// ======================
console.log('7️⃣ autoFirstPage = false...')

const doc7 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  autoFirstPage: false,  // ← Don't create first page automatically
  info: {
    Title: 'Without automatic first page'
  }
})

// Now we have total control over when to create pages
doc7.addPage()  // Create page manually
doc7.text('FIRST PAGE (CREATED MANUALLY)', 100, 700, 18)
doc7.text('', 100, 660)
doc7.text('With autoFirstPage: false, you have total control.', 100, 640, 12)
doc7.text('You must create pages manually with addPage().', 100, 620, 12)

doc7.addPage()  // Second page
doc7.text('SECOND PAGE', 100, 700, 18)

doc7.save('examples-output/usability-07-no-auto-first-page.pdf')
console.log('   ✅ examples-output/usability-07-no-auto-first-page.pdf')
console.log('      autoFirstPage: false (control manual)\n')

// ======================
// Example 8: autoFirstPage = true (default)
// ======================
console.log('8️⃣ autoFirstPage = true (default)...')

const doc8 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  // autoFirstPage: true  // Default, not necessary to specify
  info: {
    Title: 'With automatic first page'
  }
})

// First page already exists automatically
doc8.text('FIRST PAGE (AUTOMATIC)', 100, 700, 18)
doc8.text('', 100, 660)
doc8.text('With autoFirstPage: true (default), the first', 100, 640, 12)
doc8.text('page is created automatically. You can start', 100, 620, 12)
doc8.text('drawing immediately.', 100, 600, 12)

doc8.save('examples-output/usability-08-auto-first-page.pdf')
console.log('   ✅ examples-output/usability-08-auto-first-page.pdf')
console.log('      autoFirstPage: true (default)\n')

// ======================
// Example 9: Combination of all options
// ======================
console.log('9️⃣ Complete combination of options...')

const doc9 = new PDFDocument({
  size: 'A4',
  layout: 'landscape',
  margins: { top: 40, right: 60, bottom: 40, left: 60 },
  pdfVersion: '1.7',
  autoFirstPage: true,
  info: {
    Title: 'Document with all usability options',
    Author: 'PDFStudio Demo',
    Subject: 'Phase 2 Demonstration: Usability',
    Keywords: 'layout, pdfVersion, autoFirstPage',
    displayTitle: true
  },
  pageNumbers: {
    enabled: true,
    position: 'bottom-center',
    format: 'Page {current} of {total}'
  }
})

doc9.text('ALL USABILITY OPTIONS', 220, 500, 22)
doc9.text('', 100, 460)
doc9.text('This PDF combines all Phase 2 features:', 100, 440, 14)
doc9.text('', 100, 415)
doc9.text('✓ Layout: landscape', 120, 395, 12)
doc9.text('✓ PDF Version: 1.7', 120, 375, 12)
doc9.text('✓ autoFirstPage: true', 120, 355, 12)
doc9.text('✓ Complete metadata (Phase 1)', 120, 335, 12)
doc9.text('✓ Page numbering', 120, 315, 12)
doc9.text('✓ Custom margins', 120, 295, 12)

doc9.addPage()
doc9.text('SECOND PAGE', 320, 500, 20)
doc9.text('', 100, 460)
doc9.text('Verifying that everything works correctly on multiple pages.', 100, 440, 12)

doc9.save('examples-output/usability-09-all-options.pdf')
console.log('   ✅ examples-output/usability-09-all-options.pdf')
console.log('      With ALL usability options\n')

// ======================
// Summary
// ======================
console.log('✅ All usability examples generated!\n')
console.log('📁 Files generated:')
console.log('   • usability-01-portrait.pdf')
console.log('   • usability-02-landscape.pdf')
console.log('   • usability-03a-a4-portrait.pdf')
console.log('   • usability-03b-a4-landscape.pdf')
console.log('   • usability-04-pdf-1.4.pdf')
console.log('   • usability-05-pdf-1.7.pdf')
console.log('   • usability-06-1-pdf-1.3.pdf')
console.log('   • usability-06-2-pdf-1.4.pdf')
console.log('   • usability-06-3-pdf-1.5.pdf')
console.log('   • usability-06-4-pdf-1.6.pdf')
console.log('   • usability-06-5-pdf-1.7.pdf')
console.log('   • usability-07-no-auto-first-page.pdf')
console.log('   • usability-08-auto-first-page.pdf')
console.log('   • usability-09-all-options.pdf\n')

console.log('⚙️  Usability options implemented:')
console.log('   ✓ layout - Portrait/landscape orientation')
console.log('   ✓ pdfVersion - Customizable PDF version (1.3-1.7)')
console.log('   ✓ autoFirstPage - First page creation control\n')

console.log('💡 Layout advantages:')
console.log('   • No need to swap width/height manually')
console.log('   • Cleaner and more readable code')
console.log('   • Fewer errors when creating documents')

console.log('💡 pdfVersion advantages:')
console.log('   • Compatibility with modern features (1.7)')
console.log('   • Compatibility with old viewers (1.3)')
console.log('   • Preparation for AES-256 encryption (Phase 4)')

console.log('💡 autoFirstPage advantages:')
console.log('   • Total control over page creation')
console.log('   • Useful for programmatically generated PDFs')
console.log('   • Avoids unnecessary empty pages')
