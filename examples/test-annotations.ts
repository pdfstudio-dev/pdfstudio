/**
 * PDF Annotations Examples
 *
 * Demonstrates all types of PDF annotations including:
 * - Text annotations (sticky notes)
 * - Highlight/Underline/Strikeout
 * - Shape annotations (Square/Circle)
 * - Free text annotations
 * - Stamp annotations
 * - Ink annotations (freehand drawing)
 */

import { PDFDocument } from '../src'
import type { Color } from '../src/types'

console.log('💬 Testing PDF Annotations...\n')

// ============================================
// Example 1: Text Annotations (Sticky Notes)
// ============================================
const doc1 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  info: {
    Title: 'Text Annotations Example',
    Author: 'PDFStudio'
  }
})

doc1.text('Text Annotations (Sticky Notes)', 50, 750, 20)
doc1.text('Click on the note icons to read comments:', 50, 720, 12)

// Add some content
doc1.text('1. This is the first paragraph of the document.', 50, 680, 11)
doc1.text('   It contains important information that needs review.', 50, 665, 11)

// Add a sticky note comment
doc1.addNote({
  page: 0,
  x: 450,
  y: 680,
  contents: 'This paragraph needs to be reviewed by the legal team.',
  author: 'John Doe',
  subject: 'Review Required',
  color: [1, 1, 0],  // Yellow
  icon: 'Comment'
})

doc1.text('2. This section discusses the implementation details.', 50, 630, 11)

// Add another note with different icon
doc1.addNote({
  page: 0,
  x: 450,
  y: 630,
  contents: 'Consider adding more technical details here.',
  author: 'Jane Smith',
  subject: 'Technical Note',
  color: [0.5, 0.8, 1],  // Light blue
  icon: 'Note',
  open: true  // This note will be open by default
})

doc1.text('3. The conclusion summarizes all key points.', 50, 580, 11)

// Help icon note
doc1.addNote({
  page: 0,
  x: 450,
  y: 580,
  contents: 'For more information, see the appendix.',
  author: 'PDFStudio',
  subject: 'Help',
  color: [0, 0.8, 0],  // Green
  icon: 'Help'
})

doc1.save('examples-output/test-annotations-1-text.pdf')
console.log('✅ Example 1: Text annotations (sticky notes) created')

// ============================================
// Example 2: Text Markup Annotations
// ============================================
const doc2 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  info: {
    Title: 'Text Markup Annotations',
    Author: 'PDFStudio'
  }
})

doc2.text('Text Markup Annotations', 50, 750, 20)
doc2.text('Highlight, underline, and strikeout annotations:', 50, 720, 12)

doc2.text('Important Text: This text is highlighted in yellow.', 50, 680, 12)

// Highlight annotation
// QuadPoints format: [x1,y1, x2,y2, x3,y3, x4,y4] for each highlighted quad
// The four points define a quadrilateral (usually a rectangle) around the text
doc2.addHighlight({
  page: 0,
  quadPoints: [134, 679, 327, 679, 134, 693, 327, 693],  // Approximate coords for "This text is highlighted"
  contents: 'This is an important passage',
  author: 'Reviewer',
  color: [1, 1, 0]  // Yellow
})

doc2.text('Underlined Text: This text has an underline annotation.', 50, 650, 12)

// Underline annotation
doc2.addUnderline({
  page: 0,
  quadPoints: [145, 649, 360, 649, 145, 663, 360, 663],
  contents: 'Pay attention to this',
  author: 'Editor',
  color: [0, 0, 1]  // Blue
})

doc2.text('Strikeout Text: This text has been marked for deletion.', 50, 620, 12)

// Strikeout annotation
doc2.addStrikeOut({
  page: 0,
  quadPoints: [137, 619, 380, 619, 137, 633, 380, 633],
  contents: 'Remove this text',
  author: 'Editor',
  color: [1, 0, 0]  // Red
})

doc2.text('Note: Text markup annotations work best when you know the exact', 50, 560, 10)
doc2.text('coordinates of the text you want to mark. The quadPoints define', 50, 545, 10)
doc2.text('the rectangular area around the text.', 50, 530, 10)

doc2.save('examples-output/test-annotations-2-markup.pdf')
console.log('✅ Example 2: Text markup annotations created')

// ============================================
// Example 3: Shape Annotations
// ============================================
const doc3 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  info: {
    Title: 'Shape Annotations',
    Author: 'PDFStudio'
  }
})

doc3.text('Shape Annotations (Square and Circle)', 50, 750, 20)
doc3.text('Use shapes to highlight areas or create callouts:', 50, 720, 12)

// Draw some content
doc3.rect(100, 600, 150, 80)
  .setStrokeColor(0.7, 0.7, 0.7)
  .setLineWidth(1)
  .stroke()
doc3.text('Content Area', 150, 635, 12)

// Add a square annotation around it
doc3.addSquareAnnotation({
  page: 0,
  x: 95,
  y: 595,
  width: 160,
  height: 90,
  contents: 'This content area needs attention',
  author: 'Reviewer',
  color: [1, 0, 0],  // Red border
  borderWidth: 2
})

// Add a circle annotation
doc3.addCircleAnnotation({
  page: 0,
  x: 350,
  y: 640,
  width: 100,
  height: 100,
  contents: 'Important: Review this section',
  author: 'Manager',
  color: [0, 0, 1],  // Blue
  borderWidth: 2,
  fillColor: [0.9, 0.9, 1]  // Light blue fill
})

doc3.text('Circle annotation', 320, 640, 10)

// Add multiple squares for emphasis
doc3.text('Multiple Annotations Example:', 50, 500, 14)

for (let i = 0; i < 3; i++) {
  doc3.addSquareAnnotation({
    page: 0,
    x: 50 + (i * 150),
    y: 420,
    width: 120,
    height: 60,
    contents: `Note ${i + 1}`,
    author: 'PDFStudio',
    color: [0.2 + (i * 0.3), 0.5, 0.8],
    borderWidth: 1,
    fillColor: [0.95, 0.95, 1]
  })
  doc3.text(`Box ${i + 1}`, 80 + (i * 150), 450, 10)
}

doc3.save('examples-output/test-annotations-3-shapes.pdf')
console.log('✅ Example 3: Shape annotations created')

// ============================================
// Example 4: Free Text Annotations
// ============================================
const doc4 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  info: {
    Title: 'Free Text Annotations',
    Author: 'PDFStudio'
  }
})

doc4.text('Free Text Annotations', 50, 750, 20)
doc4.text('Add text boxes directly on the page:', 50, 720, 12)

// Add free text annotations with different styles
doc4.addFreeText({
  page: 0,
  x: 50,
  y: 620,
  width: 250,
  height: 60,
  contents: 'This is a free text annotation with centered alignment.',
  author: 'PDFStudio',
  subject: 'Centered Text',
  fontSize: 12,
  fontColor: [0, 0, 0.8],
  backgroundColor: [0.95, 0.95, 1],
  borderWidth: 2,
  align: 'center',
  color: [0, 0, 0.8]
})

doc4.addFreeText({
  page: 0,
  x: 320,
  y: 620,
  width: 250,
  height: 60,
  contents: 'This text box has a yellow background and red border.',
  author: 'Editor',
  fontSize: 11,
  fontColor: [0, 0, 0],
  backgroundColor: [1, 1, 0.7],
  borderWidth: 2,
  align: 'left',
  color: [1, 0, 0]
})

// Callout-style free text
doc4.addFreeText({
  page: 0,
  x: 100,
  y: 500,
  width: 400,
  height: 80,
  contents: 'IMPORTANT: This is a callout-style annotation with larger text. Free text annotations are great for adding visible comments directly on the page.',
  author: 'Manager',
  fontSize: 14,
  fontColor: [0.8, 0, 0],
  backgroundColor: [1, 0.95, 0.95],
  borderWidth: 3,
  align: 'center',
  color: [0.8, 0, 0]
})

doc4.save('examples-output/test-annotations-4-freetext.pdf')
console.log('✅ Example 4: Free text annotations created')

// ============================================
// Example 5: Stamp Annotations
// ============================================
const doc5 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  info: {
    Title: 'Stamp Annotations',
    Author: 'PDFStudio'
  }
})

doc5.text('Stamp Annotations', 50, 750, 20)
doc5.text('Add standard stamps to your documents:', 50, 720, 12)

// Add document content
doc5.text('CONTRACT AGREEMENT', 200, 650, 16)
doc5.text('This agreement was reviewed and approved on November 17, 2025.', 50, 620, 11)
doc5.text('All terms and conditions have been accepted by both parties.', 50, 605, 11)

// Add Approved stamp
doc5.addStamp({
  page: 0,
  x: 400,
  y: 600,
  width: 150,
  height: 60,
  stampType: 'Approved',
  author: 'Manager',
  contents: 'Approved by management on 2025-11-17',
  color: [0, 0.6, 0]
})

// Add Confidential stamp
doc5.addStamp({
  page: 0,
  x: 50,
  y: 550,
  width: 120,
  height: 50,
  stampType: 'Confidential',
  author: 'Legal',
  contents: 'This document is confidential',
  color: [0.8, 0, 0]
})

// Add Final stamp
doc5.addStamp({
  page: 0,
  x: 220,
  y: 550,
  width: 100,
  height: 50,
  stampType: 'Final',
  author: 'Editor',
  contents: 'Final version',
  color: [0, 0, 0.8]
})

// Add Draft stamp (rotated)
doc5.addStamp({
  page: 0,
  x: 380,
  y: 550,
  width: 120,
  height: 50,
  stampType: 'Draft',
  author: 'Author',
  contents: 'Draft version - not for distribution',
  color: [0.5, 0.5, 0.5],
  rotation: 0
})

doc5.text('Available stamp types include: Approved, Confidential, Draft,', 50, 480, 10)
doc5.text('Final, Experimental, Expired, and many more.', 50, 465, 10)

doc5.save('examples-output/test-annotations-5-stamps.pdf')
console.log('✅ Example 5: Stamp annotations created')

// ============================================
// Example 6: Ink Annotations (Freehand Drawing)
// ============================================
const doc6 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  info: {
    Title: 'Ink Annotations',
    Author: 'PDFStudio'
  }
})

doc6.text('Ink Annotations (Freehand Drawing)', 50, 750, 20)
doc6.text('Draw freehand marks on your documents:', 50, 720, 12)

// Draw a checkmark
doc6.addInk({
  page: 0,
  inkLists: [
    [
      [100, 650], [110, 640], [130, 620], [160, 650], [200, 690]
    ]
  ],
  contents: 'Checkmark',
  author: 'Reviewer',
  color: [0, 0.8, 0],  // Green
  borderWidth: 3
})

doc6.text('Checkmark', 80, 600, 10)

// Draw a circle
const circlePoints: [number, number][] = []
for (let i = 0; i <= 360; i += 10) {
  const rad = (i * Math.PI) / 180
  const x = 350 + Math.cos(rad) * 50
  const y = 650 + Math.sin(rad) * 50
  circlePoints.push([x, y])
}

doc6.addInk({
  page: 0,
  inkLists: [circlePoints],
  contents: 'Hand-drawn circle',
  author: 'Artist',
  color: [1, 0, 0],  // Red
  borderWidth: 2
})

doc6.text('Hand-drawn circle', 310, 590, 10)

// Draw an underline with arrow
doc6.addInk({
  page: 0,
  inkLists: [
    [
      [100, 530], [300, 530],  // Horizontal line
      [300, 530], [290, 525], [290, 535], [300, 530]  // Arrow head
    ]
  ],
  contents: 'Arrow pointing right',
  author: 'Editor',
  color: [0, 0, 1],  // Blue
  borderWidth: 2
})

doc6.text('Important direction', 100, 545, 10)

// Draw a signature-style mark
doc6.addInk({
  page: 0,
  inkLists: [
    [
      [100, 450], [120, 470], [140, 455], [160, 475], [180, 450],
      [200, 470], [220, 450]
    ]
  ],
  contents: 'Signature-style mark',
  author: 'Signer',
  color: [0, 0, 0],  // Black
  borderWidth: 2
})

doc6.text('Signature area', 100, 420, 10)

doc6.save('examples-output/test-annotations-6-ink.pdf')
console.log('✅ Example 6: Ink annotations created')

// ============================================
// Example 7: Combined Annotations
// ============================================
const doc7 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  info: {
    Title: 'Document Review with Multiple Annotations',
    Author: 'PDFStudio'
  }
})

doc7.text('DOCUMENT REVIEW - QUARTERLY REPORT', 150, 750, 18)

// Add approved stamp
doc7.addStamp({
  page: 0,
  x: 450,
  y: 730,
  width: 120,
  height: 50,
  stampType: 'Approved',
  author: 'CEO',
  contents: 'Approved for publication',
  color: [0, 0.6, 0]
})

doc7.text('Executive Summary', 50, 700, 14)
doc7.text('This quarter showed significant growth in all major areas.', 50, 680, 11)
doc7.text('Revenue increased by 25% compared to the previous quarter.', 50, 665, 11)

// Add a note
doc7.addNote({
  page: 0,
  x: 500,
  y: 665,
  contents: 'Verify these numbers with the finance department.',
  author: 'CFO',
  icon: 'Comment',
  color: [1, 0.5, 0]
})

// Add highlight
doc7.addHighlight({
  page: 0,
  quadPoints: [50, 664, 390, 664, 50, 678, 390, 678],
  contents: 'Key metric',
  author: 'Analyst',
  color: [1, 1, 0]
})

doc7.text('Challenges:', 50, 630, 12)
doc7.text('Some operational challenges were encountered during Q3.', 70, 610, 11)

// Add strikeout
doc7.addStrikeOut({
  page: 0,
  quadPoints: [70, 609, 320, 609, 70, 623, 320, 623],
  contents: 'This statement is outdated',
  author: 'Editor',
  color: [1, 0, 0]
})

// Add corrective free text
doc7.addFreeText({
  page: 0,
  x: 70,
  y: 560,
  width: 400,
  height: 40,
  contents: 'UPDATED: All operational challenges were successfully resolved by end of Q3.',
  fontSize: 11,
  fontColor: [0, 0.5, 0],
  backgroundColor: [0.95, 1, 0.95],
  borderWidth: 1,
  color: [0, 0.6, 0],
  align: 'left'
})

doc7.text('Conclusion:', 50, 510, 12)
doc7.text('The outlook for Q4 remains positive.', 70, 490, 11)

// Add rectangle annotation
doc7.addSquareAnnotation({
  page: 0,
  x: 65,
  y: 485,
  width: 200,
  height: 20,
  contents: 'Review this conclusion with the board',
  author: 'Secretary',
  color: [0, 0, 1],
  borderWidth: 2
})

doc7.save('examples-output/test-annotations-7-combined.pdf')
console.log('✅ Example 7: Combined annotations example created')

// ============================================
// Summary
// ============================================
console.log('\n💬 All annotation examples created successfully!')
console.log('   7 PDFs demonstrating:')
console.log('   1. Text annotations (sticky notes)')
console.log('   2. Text markup (highlight, underline, strikeout)')
console.log('   3. Shape annotations (square, circle)')
console.log('   4. Free text annotations')
console.log('   5. Stamp annotations')
console.log('   6. Ink annotations (freehand drawing)')
console.log('   7. Combined annotations in a real-world example')
console.log('\n💡 Note: Annotations are interactive and can be viewed,')
console.log('   edited, and managed in PDF readers like Adobe Acrobat.')
console.log()
