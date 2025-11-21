import { PDFDocument } from '../src'
import type { Color } from '../src/types'

console.log('🔖 Testing Bookmarks/Outlines...\n')

// ======================
// Example 1: Simple Bookmarks
// ======================

const doc1 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  bookmarks: [
    {
      title: 'Introduction',
      destination: { page: 0 }
    },
    {
      title: 'Chapter 1',
      destination: { page: 1 }
    },
    {
      title: 'Chapter 2',
      destination: { page: 2 }
    },
    {
      title: 'Conclusion',
      destination: { page: 3 }
    }
  ]
})

// Page 1: Introduction
doc1.text('Introduction', 50, 750, 24)
doc1.text('This is the introduction section of the document.', 50, 710, 12)
doc1.text('The bookmarks panel (on the left) provides easy navigation.', 50, 690, 12)

// Page 2: Chapter 1
doc1.addPage()
doc1.text('Chapter 1', 50, 750, 24)
doc1.text('Content for chapter 1 goes here.', 50, 710, 12)

// Page 3: Chapter 2
doc1.addPage()
doc1.text('Chapter 2', 50, 750, 24)
doc1.text('Content for chapter 2 goes here.', 50, 710, 12)

// Page 4: Conclusion
doc1.addPage()
doc1.text('Conclusion', 50, 750, 24)
doc1.text('Final thoughts and summary.', 50, 710, 12)

doc1.save('examples-output/test-bookmarks-1-simple.pdf')
console.log('✅ Example 1: Simple bookmarks created')

// ======================
// Example 2: Nested/Hierarchical Bookmarks
// ======================

const doc2 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  bookmarks: [
    {
      title: 'Part I: Fundamentals',
      destination: { page: 0 },
      children: [
        {
          title: 'Chapter 1: Introduction',
          destination: { page: 0 }
        },
        {
          title: 'Chapter 2: Basics',
          destination: { page: 1 },
          children: [
            {
              title: 'Section 2.1: Getting Started',
              destination: { page: 1 }
            },
            {
              title: 'Section 2.2: Core Concepts',
              destination: { page: 2 }
            }
          ]
        }
      ]
    },
    {
      title: 'Part II: Advanced Topics',
      destination: { page: 3 },
      children: [
        {
          title: 'Chapter 3: Advanced Features',
          destination: { page: 3 }
        },
        {
          title: 'Chapter 4: Best Practices',
          destination: { page: 4 }
        }
      ]
    },
    {
      title: 'Appendix',
      destination: { page: 5 }
    }
  ]
})

// Page 1
doc2.text('Part I: Fundamentals', 50, 750, 24)
doc2.text('Chapter 1: Introduction', 50, 710, 18)
doc2.text('Welcome to this comprehensive guide...', 50, 680, 12)

// Page 2
doc2.addPage()
doc2.text('Chapter 2: Basics', 50, 750, 18)
doc2.text('Section 2.1: Getting Started', 50, 710, 14)
doc2.text('Let\'s begin with the fundamentals...', 50, 680, 12)

// Page 3
doc2.addPage()
doc2.text('Section 2.2: Core Concepts', 50, 750, 14)
doc2.text('Understanding the core principles...', 50, 710, 12)

// Page 4
doc2.addPage()
doc2.text('Part II: Advanced Topics', 50, 750, 24)
doc2.text('Chapter 3: Advanced Features', 50, 710, 18)
doc2.text('Exploring advanced functionality...', 50, 680, 12)

// Page 5
doc2.addPage()
doc2.text('Chapter 4: Best Practices', 50, 750, 18)
doc2.text('Tips and recommendations...', 50, 710, 12)

// Page 6
doc2.addPage()
doc2.text('Appendix', 50, 750, 24)
doc2.text('Additional resources and references.', 50, 710, 12)

doc2.save('examples-output/test-bookmarks-2-nested.pdf')
console.log('✅ Example 2: Nested bookmarks created')

// ======================
// Example 3: Different Destination Types
// ======================

const doc3 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  bookmarks: [
    {
      title: 'Page 1 - Fit entire page',
      destination: { page: 0, fit: 'Fit' }
    },
    {
      title: 'Page 2 - Fit width, top at 700',
      destination: { page: 1, fit: 'FitH', y: 700 }
    },
    {
      title: 'Page 3 - Specific location with zoom',
      destination: { page: 2, fit: 'XYZ', x: 100, y: 600, zoom: 1.5 }
    },
    {
      title: 'Page 4 - Fit bounding box',
      destination: { page: 3, fit: 'FitB' }
    }
  ]
})

// Page 1
doc3.text('Page 1: Fit Entire Page', 50, 750, 20)
doc3.text('The bookmark opens this page fitted to the window.', 50, 710, 12)

// Page 2
doc3.addPage()
doc3.text('Page 2: Fit Width', 50, 750, 20)
doc3.text('The bookmark fits the page width with Y position at 700.', 50, 710, 12)
doc3.circle({ x: 100, y: 700, radius: 5, fillColor: [1, 0, 0] as Color })
doc3.text('← Y=700 position marker', 110, 698, 10)

// Page 3
doc3.addPage()
doc3.text('Page 3: Specific Location + Zoom', 50, 750, 20)
doc3.text('Opens at X=100, Y=600 with 150% zoom.', 50, 710, 12)
doc3.circle({ x: 100, y: 600, radius: 8, fillColor: [0, 0, 1] as Color })
doc3.text('← Target location', 115, 598, 10)

// Page 4
doc3.addPage()
doc3.text('Page 4: Fit Bounding Box', 50, 750, 20)
doc3.text('Fits the bounding box of page content.', 50, 710, 12)

doc3.save('examples-output/test-bookmarks-3-destinations.pdf')
console.log('✅ Example 3: Different destinations created')

// ======================
// Example 4: Styled Bookmarks (Colors, Bold, Italic)
// ======================

const doc4 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  bookmarks: [
    {
      title: 'Important Section (Red, Bold)',
      destination: { page: 0 },
      color: [1, 0, 0] as Color,
      bold: true
    },
    {
      title: 'Note (Blue, Italic)',
      destination: { page: 1 },
      color: [0, 0, 1] as Color,
      italic: true
    },
    {
      title: 'Warning (Orange, Bold+Italic)',
      destination: { page: 2 },
      color: [1, 0.5, 0] as Color,
      bold: true,
      italic: true
    },
    {
      title: 'Success (Green)',
      destination: { page: 3 },
      color: [0, 0.7, 0] as Color
    }
  ]
})

// Page 1
doc4.text('Important Section', 50, 750, 24)
doc4.setFillColor(1, 0, 0)
doc4.text('This bookmark appears in RED and BOLD.', 50, 710, 12)

// Page 2
doc4.addPage()
doc4.setFillColor(0, 0, 0)
doc4.text('Note', 50, 750, 24)
doc4.setFillColor(0, 0, 1)
doc4.text('This bookmark appears in BLUE and ITALIC.', 50, 710, 12)

// Page 3
doc4.addPage()
doc4.setFillColor(0, 0, 0)
doc4.text('Warning', 50, 750, 24)
doc4.setFillColor(1, 0.5, 0)
doc4.text('This bookmark appears in ORANGE, BOLD, and ITALIC.', 50, 710, 12)

// Page 4
doc4.addPage()
doc4.setFillColor(0, 0, 0)
doc4.text('Success', 50, 750, 24)
doc4.setFillColor(0, 0.7, 0)
doc4.text('This bookmark appears in GREEN.', 50, 710, 12)

doc4.save('examples-output/test-bookmarks-4-styled.pdf')
console.log('✅ Example 4: Styled bookmarks created')

// ======================
// Example 5: Open/Closed Bookmarks
// ======================

const doc5 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  bookmarks: [
    {
      title: 'Section 1 (Open by default)',
      destination: { page: 0 },
      open: true,  // Children visible by default
      children: [
        { title: 'Subsection 1.1', destination: { page: 0 } },
        { title: 'Subsection 1.2', destination: { page: 1 } }
      ]
    },
    {
      title: 'Section 2 (Closed by default)',
      destination: { page: 2 },
      open: false,  // Children hidden by default
      children: [
        { title: 'Subsection 2.1', destination: { page: 2 } },
        { title: 'Subsection 2.2', destination: { page: 3 } }
      ]
    }
  ]
})

// Page 1
doc5.text('Section 1 (Open by default)', 50, 750, 20)
doc5.text('Subsection 1.1', 50, 710, 16)
doc5.text('Children bookmarks are initially visible.', 50, 680, 12)

// Page 2
doc5.addPage()
doc5.text('Subsection 1.2', 50, 750, 16)

// Page 3
doc5.addPage()
doc5.text('Section 2 (Closed by default)', 50, 750, 20)
doc5.text('Subsection 2.1', 50, 710, 16)
doc5.text('Children bookmarks are initially hidden.', 50, 680, 12)

// Page 4
doc5.addPage()
doc5.text('Subsection 2.2', 50, 750, 16)

doc5.save('examples-output/test-bookmarks-5-open-closed.pdf')
console.log('✅ Example 5: Open/closed bookmarks created')

// ======================
// Example 6: Adding Bookmarks Dynamically
// ======================

const doc6 = new PDFDocument({
  size: 'Letter',
  margins: 50
})

// Add content first
doc6.text('Chapter 1: Introduction', 50, 750, 24)
doc6.text('This is the first chapter.', 50, 710, 12)

doc6.addPage()
doc6.text('Chapter 2: Development', 50, 750, 24)
doc6.text('This is the second chapter.', 50, 710, 12)

doc6.addPage()
doc6.text('Chapter 3: Conclusion', 50, 750, 24)
doc6.text('This is the final chapter.', 50, 710, 12)

// Now add bookmarks dynamically
doc6.setBookmarks([
  {
    title: 'Chapter 1: Introduction',
    destination: { page: 0 }
  },
  {
    title: 'Chapter 2: Development',
    destination: { page: 1 },
    bold: true
  },
  {
    title: 'Chapter 3: Conclusion',
    destination: { page: 2 }
  }
])

doc6.save('examples-output/test-bookmarks-6-dynamic.pdf')
console.log('✅ Example 6: Dynamic bookmarks created')

// ======================
// Example 7: Complex Document with All Features
// ======================

const doc7 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  bookmarks: [
    {
      title: 'Table of Contents',
      destination: { page: 0 },
      color: [0, 0, 0.5] as Color,
      bold: true
    },
    {
      title: 'Part I: Getting Started',
      destination: { page: 1 },
      color: [0.2, 0.4, 0.8] as Color,
      bold: true,
      open: true,
      children: [
        {
          title: 'Chapter 1: Installation',
          destination: { page: 1 },
          children: [
            { title: '1.1 Prerequisites', destination: { page: 1, fit: 'XYZ', y: 650, zoom: 1.2 } },
            { title: '1.2 Setup', destination: { page: 2 } }
          ]
        },
        {
          title: 'Chapter 2: Quick Start',
          destination: { page: 3 },
          italic: true
        }
      ]
    },
    {
      title: 'Part II: Advanced',
      destination: { page: 4 },
      color: [0.8, 0.4, 0.2] as Color,
      bold: true,
      open: false,
      children: [
        {
          title: 'Chapter 3: Architecture',
          destination: { page: 4 }
        },
        {
          title: 'Chapter 4: API Reference',
          destination: { page: 5 },
          children: [
            { title: '4.1 Core API', destination: { page: 5 } },
            { title: '4.2 Extensions', destination: { page: 6 } }
          ]
        }
      ]
    },
    {
      title: 'Appendix',
      destination: { page: 7 },
      color: [0.5, 0.5, 0.5] as Color
    }
  ]
})

// Generate 8 pages with content
const titles = [
  'Table of Contents',
  'Chapter 1: Installation',
  '1.2 Setup',
  'Chapter 2: Quick Start',
  'Chapter 3: Architecture',
  'Chapter 4: API Reference',
  '4.2 Extensions',
  'Appendix'
]

titles.forEach((title, index) => {
  if (index > 0) doc7.addPage()
  doc7.text(title, 50, 750, index === 0 ? 24 : 20)
  doc7.text(`This is page ${index + 1} of the document.`, 50, 710, 12)
  doc7.text(`Content for "${title}" would appear here.`, 50, 690, 12)
})

doc7.save('examples-output/test-bookmarks-7-complex.pdf')
console.log('✅ Example 7: Complex document created')

console.log('\n🔖 All bookmark examples created successfully!')
console.log('   7 PDFs demonstrating:')
console.log('   1. Simple bookmarks')
console.log('   2. Nested/hierarchical bookmarks')
console.log('   3. Different destination types (Fit, FitH, XYZ, FitB)')
console.log('   4. Styled bookmarks (colors, bold, italic)')
console.log('   5. Open/closed bookmarks')
console.log('   6. Dynamic bookmark addition')
console.log('   7. Complex document with all features\n')
