import { PDFDocument } from '../src'

console.log('📄 Testing Headers & Footers...\n')

// ======================
// Example 1: Simple Header and Footer
// ======================

const doc1 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  headerFooter: {
    header: {
      enabled: true,
      center: 'Simple Header',
      fontSize: 12,
      color: '#333333',
      line: true
    },
    footer: {
      enabled: true,
      center: (page, total) => `Page ${page} of ${total}`,
      fontSize: 10,
      color: '#666666',
      line: true
    }
  }
})

doc1.text('Example 1: Simple Header and Footer', 50, 700, 18)
doc1.text('This document has a simple centered header and footer.', 50, 670, 12)
doc1.text('The header shows "Simple Header" and the footer shows page numbers.', 50, 650, 12)

doc1.addPage()
doc1.text('This is page 2', 50, 700, 16)
doc1.text('Both header and footer appear on all pages.', 50, 670, 12)

doc1.addPage()
doc1.text('This is page 3', 50, 700, 16)

doc1.save('examples-output/test-headers-footers-1-simple.pdf')
console.log('✅ Example 1: Simple header/footer created')

// ======================
// Example 2: Left, Center, Right Content
// ======================

const doc2 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  headerFooter: {
    header: {
      enabled: true,
      left: 'Left Header',
      center: 'Center Header',
      right: 'Right Header',
      fontSize: 10
    },
    footer: {
      enabled: true,
      left: '© 2025 PDFStudio',
      center: (page, total) => `${page} / ${total}`,
      right: 'Confidential',
      fontSize: 9,
      color: '#999999'
    }
  }
})

doc2.text('Example 2: Left, Center, Right Content', 50, 700, 18)
doc2.text('The header has text aligned to left, center, and right.', 50, 670, 12)
doc2.text('The footer also has three sections with different content.', 50, 650, 12)

doc2.addPage()
doc2.text('Page 2 with all three sections', 50, 700, 16)

doc2.save('examples-output/test-headers-footers-2-alignment.pdf')
console.log('✅ Example 2: Left/center/right alignment created')

// ======================
// Example 3: First Page Different
// ======================

const doc3 = new PDFDocument({
  size: 'Letter',
  margins: 50
})

// Header for first page only
doc3.setHeaderFooter({
  header: {
    enabled: true,
    pages: 'first',
    center: 'TITLE PAGE',
    fontSize: 20,
    font: 'Times-Bold',
    line: true,
    lineWidth: 2
  },
  footer: {
    enabled: true,
    pages: 'notFirst',
    center: (page) => `Page ${page}`,
    fontSize: 10
  }
})

doc3.text('Example 3: First Page Different', 50, 650, 18)
doc3.text('The header "TITLE PAGE" only appears on the first page.', 50, 620, 12)
doc3.text('Footer with page numbers appears on all pages EXCEPT the first.', 50, 600, 12)

doc3.addPage()
doc3.text('This is page 2', 50, 700, 16)
doc3.text('Notice: No "TITLE PAGE" header, but footer with page number appears.', 50, 670, 12)

doc3.addPage()
doc3.text('This is page 3', 50, 700, 16)

doc3.save('examples-output/test-headers-footers-3-first-page.pdf')
console.log('✅ Example 3: First page different created')

// ======================
// Example 4: Odd and Even Pages
// ======================

const doc4 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  headerFooter: {
    header: {
      enabled: true,
      pages: 'odd',
      right: 'Chapter 1',
      fontSize: 11,
      font: 'Times-Italic'
    },
    footer: {
      enabled: true,
      left: (page) => page % 2 === 1 ? `${page}` : '',
      right: (page) => page % 2 === 0 ? `${page}` : '',
      fontSize: 10
    }
  }
})

doc4.text('Example 4: Odd and Even Pages', 50, 700, 18)
doc4.text('The header "Chapter 1" appears only on ODD pages (1, 3, 5...).', 50, 670, 12)
doc4.text('Page numbers appear on the LEFT for odd pages, RIGHT for even pages.', 50, 650, 12)

for (let i = 2; i <= 5; i++) {
  doc4.addPage()
  doc4.text(`This is page ${i}`, 50, 700, 16)
  doc4.text(i % 2 === 1 ? 'ODD page - header visible' : 'EVEN page - no header', 50, 670, 12)
}

doc4.save('examples-output/test-headers-footers-4-odd-even.pdf')
console.log('✅ Example 4: Odd/even pages created')

// ======================
// Example 5: Multiple Styles and Fonts
// ======================

const doc5 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  headerFooter: {
    header: {
      enabled: true,
      text: [
        {
          content: 'PDFStudio',
          align: 'left',
          fontSize: 14,
          font: 'Helvetica-Bold',
          color: '#2C3E50'
        },
        {
          content: 'Professional Document',
          align: 'right',
          fontSize: 10,
          font: 'Times-Italic',
          color: '#7F8C8D'
        }
      ],
      line: true,
      lineColor: '#3498DB',
      lineWidth: 1.5
    },
    footer: {
      enabled: true,
      text: [
        {
          content: (page, total) => `Page ${page} of ${total}`,
          align: 'center',
          fontSize: 9,
          font: 'Courier',
          color: '#95A5A6'
        }
      ],
      line: true,
      lineColor: '#BDC3C7',
      lineWidth: 0.5
    }
  }
})

doc5.text('Example 5: Multiple Styles and Fonts', 50, 700, 18)
doc5.text('Header has two text items with different fonts, sizes, and colors:', 50, 670, 12)
doc5.text('  - "PDFStudio" in Helvetica-Bold (14pt, dark)', 50, 650, 11)
doc5.text('  - "Professional Document" in Times-Italic (10pt, gray)', 50, 630, 11)
doc5.text('Both header and footer have colored decorative lines.', 50, 600, 12)

doc5.addPage()
doc5.text('Page 2 with styled header/footer', 50, 700, 16)

doc5.save('examples-output/test-headers-footers-5-styled.pdf')
console.log('✅ Example 5: Multiple styles created')

// ======================
// Example 6: Exclude Specific Pages
// ======================

const doc6 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  headerFooter: {
    header: {
      enabled: true,
      center: 'Document Header',
      fontSize: 12,
      excludePages: [1, 3]  // Skip pages 2 and 4 (0-indexed: 1, 3)
    },
    footer: {
      enabled: true,
      center: (page) => `Page ${page}`,
      fontSize: 10,
      excludePages: [0]  // Skip first page (0-indexed: 0)
    }
  }
})

doc6.text('Example 6: Exclude Specific Pages', 50, 700, 18)
doc6.text('Header excluded from pages 2 and 4.', 50, 670, 12)
doc6.text('Footer excluded from page 1.', 50, 650, 12)

for (let i = 2; i <= 4; i++) {
  doc6.addPage()
  doc6.text(`Page ${i}`, 50, 700, 16)
  const headerStatus = [1, 3].includes(i - 1) ? 'NO HEADER' : 'HAS HEADER'
  const footerStatus = i === 1 ? 'NO FOOTER' : 'HAS FOOTER'
  doc6.text(`${headerStatus} | ${footerStatus}`, 50, 670, 12)
}

doc6.save('examples-output/test-headers-footers-6-exclude.pdf')
console.log('✅ Example 6: Exclude pages created')

// ======================
// Example 7: Dynamic Content with Functions
// ======================

const doc7 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  headerFooter: {
    header: {
      enabled: true,
      left: (page) => `Section ${Math.ceil(page / 2)}`,
      right: (page, total) => `Progress: ${Math.round((page / total) * 100)}%`,
      fontSize: 10,
      color: '#34495E'
    },
    footer: {
      enabled: true,
      left: () => new Date().toLocaleDateString(),
      center: (page, total) => `${page} / ${total}`,
      right: 'Generated by PDFStudio',
      fontSize: 9,
      color: '#7F8C8D'
    }
  }
})

doc7.text('Example 7: Dynamic Content with Functions', 50, 700, 18)
doc7.text('Header shows:', 50, 670, 12)
doc7.text('  - LEFT: Section number (changes every 2 pages)', 50, 650, 11)
doc7.text('  - RIGHT: Progress percentage', 50, 630, 11)
doc7.text('Footer shows:', 50, 600, 12)
doc7.text('  - LEFT: Current date', 50, 580, 11)
doc7.text('  - CENTER: Page numbers', 50, 560, 11)
doc7.text('  - RIGHT: Static text', 50, 540, 11)

for (let i = 2; i <= 6; i++) {
  doc7.addPage()
  doc7.text(`Page ${i}`, 50, 700, 16)
  doc7.text(`Section: ${Math.ceil(i / 2)}`, 50, 670, 12)
  doc7.text(`Progress: ${Math.round((i / 6) * 100)}%`, 50, 650, 12)
}

doc7.save('examples-output/test-headers-footers-7-dynamic.pdf')
console.log('✅ Example 7: Dynamic content created')

console.log('\n📄 All header/footer examples created successfully!')
console.log('   7 PDFs demonstrating:')
console.log('   1. Simple centered header/footer')
console.log('   2. Left, center, right alignment')
console.log('   3. Different content for first page')
console.log('   4. Odd and even page rules')
console.log('   5. Multiple styles and fonts')
console.log('   6. Excluding specific pages')
console.log('   7. Dynamic content with functions\n')
