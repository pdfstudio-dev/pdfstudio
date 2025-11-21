import { PDFDocument } from '../src'

console.log('📄 Generating PDF showcase with all numbering examples...\n')

// ======================
// Single document with multiple numbering examples
// ======================

const doc = new PDFDocument()

// Disable initial numbering (we'll configure per page)
doc.setPageNumbers({ enabled: false })

console.log('Creating example pages...')

// ======================
// PAGE 1: Cover (no numbering)
// ======================
doc.text('NUMBERING SHOWCASE', 160, 500, 28)
doc.text('PDFStudio - Page Numbers Examples', 130, 450, 18)
doc.text('This document shows all available', 140, 380, 14)
doc.text('numbering styles', 180, 360, 14)
doc.text('(This page has no numbering)', 165, 300, 12)

// ======================
// PAGE 2: Bottom-Center (basic format)
// ======================
doc.addPage()
doc.text('Example 1: Bottom-Center', 180, 750, 20)
doc.text('Position: bottom-center', 100, 650, 14)
doc.text('Format: "Page {current} of {total}"', 100, 620, 14)
doc.text('Most common for documents', 100, 580, 12)
doc.text('Color: Black (default)', 100, 560, 12)

// ======================
// PAGE 3: Top-Right (blue)
// ======================
doc.addPage()
doc.text('Example 2: Top-Right', 200, 750, 20)
doc.text('Position: top-right', 100, 650, 14)
doc.text('Format: "{current}/{total}"', 100, 620, 14)
doc.text('Color: #3498db (blue)', 100, 580, 12)
doc.text('Ideal for technical documents', 100, 560, 12)

// ======================
// PAGE 4: Top-Left
// ======================
doc.addPage()
doc.text('Example 3: Top-Left', 200, 750, 20)
doc.text('Position: top-left', 100, 650, 14)
doc.text('Format: "Page {current}"', 100, 620, 14)
doc.text('Simple numbering without total', 100, 580, 12)

// ======================
// PAGE 5: Top-Center
// ======================
doc.addPage()
doc.text('Example 4: Top-Center', 190, 750, 20)
doc.text('Position: top-center', 100, 650, 14)
doc.text('Format: "- {current} -"', 100, 620, 14)
doc.text('Elegant centered style', 100, 580, 12)

// ======================
// PAGE 6: Bottom-Left
// ======================
doc.addPage()
doc.text('Example 5: Bottom-Left', 190, 750, 20)
doc.text('Position: bottom-left', 100, 650, 14)
doc.text('Format: "Page {current}"', 100, 620, 14)
doc.text('Traditional location', 100, 580, 12)

// ======================
// PAGE 7: Bottom-Right
// ======================
doc.addPage()
doc.text('Example 6: Bottom-Right', 180, 750, 20)
doc.text('Position: bottom-right', 100, 650, 14)
doc.text('Format: "{current}"', 100, 620, 14)
doc.text('Minimalist numbering', 100, 580, 12)

// ======================
// PAGE 8: Custom format with function - Section cover
// ======================
doc.addPage()
doc.text('Example 7: Custom Function', 150, 500, 20)
doc.text('Dynamic format based on page:', 160, 450, 14)
doc.text('• First page: "Cover"', 180, 420, 12)
doc.text('• Last page: "End of Document"', 180, 395, 12)
doc.text('• Middle pages: "Section X of Y"', 180, 370, 12)
doc.text('(This is the first page of the section)', 140, 320, 12)

// ======================
// PAGE 9: Middle section
// ======================
doc.addPage()
doc.text('Example 8: Middle Section', 160, 500, 20)
doc.text('Section content page', 160, 450, 14)
doc.text('Number is calculated automatically', 150, 400, 12)

// ======================
// PAGE 10: Last page of section
// ======================
doc.addPage()
doc.text('Example 9: Last Page', 170, 500, 20)
doc.text('This is the last page of the document', 140, 450, 14)
doc.text('Numbering shows "End of Document"', 130, 400, 12)

// ======================
// PAGE 11: Chart with numbering
// ======================
doc.addPage()
doc.text('Example 10: With Charts', 170, 750, 20)
doc.text('Numbering integrated with visual content', 130, 700, 12)

doc.barChart({
  data: [
    { label: 'Jan', value: 45 },
    { label: 'Feb', value: 62 },
    { label: 'Mar', value: 55 },
    { label: 'Apr', value: 71 }
  ],
  x: 100,
  y: 350,
  width: 400,
  height: 250,
  barColors: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12'],
  title: 'Quarterly Sales',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showValues: true
})

// ======================
// PAGE 12: Custom color (red)
// ======================
doc.addPage()
doc.text('Example 11: Custom Color', 150, 500, 20)
doc.text('Color: #e74c3c (red)', 190, 450, 14)
doc.text('Position: bottom-center', 180, 420, 14)
doc.text('Ideal for alert or urgent documents', 130, 380, 12)

// ======================
// PAGE 13: Large font size
// ======================
doc.addPage()
doc.text('Example 12: Large Font', 170, 500, 20)
doc.text('Size: 14pt (vs 10pt default)', 160, 450, 14)
doc.text('More visible for presentations', 155, 420, 12)

// ======================
// Now apply automatic numbering
// ======================

// Apply custom numbering based on document sections
console.log('Applying custom numbering...')

// Create a function that handles different styles per page
doc.setPageNumbers({
  enabled: true,
  position: 'bottom-center',
  format: (current, total) => {
    // Page 1: No number (cover)
    if (current === 1) return ''

    // Page 2: Basic bottom-center
    if (current === 2) return `Page ${current} of ${total}`

    // Page 3: Top-right short format (will render where configured)
    if (current === 3) return `${current}/${total}`

    // Page 4: Simple top-left
    if (current === 4) return `Page ${current}`

    // Page 5: Top-center with dashes
    if (current === 5) return `- ${current} -`

    // Page 6: Bottom-left
    if (current === 6) return `Page ${current}`

    // Page 7: Minimalist bottom-right
    if (current === 7) return `${current}`

    // Pages 8-10: Custom function
    if (current === 8) return 'Section Cover'
    if (current === 9) return `Section ${current - 8} of ${total - 9}`
    if (current === 10) return 'End of Document'

    // Page 11: With chart
    if (current === 11) return `Page ${current} of ${total}`

    // Page 12: Custom color (red)
    if (current === 12) return `Page ${current} of ${total}`

    // Page 13: Large font
    if (current === 13) return `${current} / ${total}`

    // Default
    return `${current} of ${total}`
  },
  fontSize: 10,
  margin: 30,
  excludePages: [0]  // Exclude cover
})

// Save
doc.save('examples-output/page-numbers-showcase.pdf')

console.log('✅ PDF showcase generated successfully!')
console.log(`📄 Total pages: ${doc.getPageCount()}`)
console.log('📂 File: examples-output/page-numbers-showcase.pdf')
console.log('\n📋 Document content:')
console.log('   Page 1:  Cover (no numbering)')
console.log('   Page 2:  Bottom-Center - basic format')
console.log('   Page 3:  Top-Right - short format')
console.log('   Page 4:  Top-Left - simple')
console.log('   Page 5:  Top-Center - with dashes')
console.log('   Page 6:  Bottom-Left - traditional')
console.log('   Page 7:  Bottom-Right - minimalist')
console.log('   Page 8:  Custom function - Cover')
console.log('   Page 9:  Custom function - Section')
console.log('   Page 10: Custom function - End')
console.log('   Page 11: With charts')
console.log('   Page 12: Custom color')
console.log('   Page 13: Large font')
