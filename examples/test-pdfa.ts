/**
 * PDF/A Compliance Examples
 *
 * Demonstrates PDF/A-1b, PDF/A-2b, and PDF/A-3b compliance
 * for long-term document archiving.
 */

import { PDFDocument } from '../src'

console.log('📁 Testing PDF/A Compliance...\n')

// ============================================
// Example 1: PDF/A-1b (Basic Compliance)
// ============================================
// PDF/A-1b is based on PDF 1.4 and ensures visual appearance preservation
const doc1 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  info: {
    Title: 'PDF/A-1b Compliance Example',
    Author: 'PDFStudio',
    Subject: 'Demonstrating PDF/A-1b standard',
    Keywords: 'PDF/A, archiving, compliance, long-term preservation',
  },
  pdfA: {
    conformanceLevel: 'PDF/A-1b',
    colorProfile: 'sRGB',
    outputIntent: {
      identifier: 'sRGB IEC61966-2.1',
      condition: 'sRGB',
      info: 'Standard RGB color space for archival purposes'
    }
  }
})

doc1.text('PDF/A-1b Compliance Example', 50, 750, 20)
doc1.text('This document is compliant with the PDF/A-1b standard for long-term archiving.', 50, 720, 12)

doc1.text('Key Features of PDF/A-1b:', 50, 680, 14)
doc1.text('- Based on PDF 1.4', 70, 655, 11)
doc1.text('- All fonts embedded (we use standard PDF fonts)', 70, 638, 11)
doc1.text('- No encryption allowed', 70, 621, 11)
doc1.text('- XMP metadata included', 70, 604, 11)
doc1.text('- Color profile specified (sRGB)', 70, 587, 11)
doc1.text('- No external dependencies', 70, 570, 11)

// Add a simple box
doc1.rect(50, 500, 200, 50)
  .setFillColor(0.9, 0.95, 1)
  .fill()
  .setStrokeColor(0, 0, 0.8)
  .setLineWidth(2)
  .stroke()
doc1.text('This is an archived document', 60, 520, 12)

doc1.text('Document Information:', 50, 450, 14)
doc1.text(`Created: ${new Date().toLocaleDateString()}`, 70, 425, 11)
doc1.text('Conformance: PDF/A-1b', 70, 408, 11)
doc1.text('Color Space: sRGB IEC61966-2.1', 70, 391, 11)

doc1.save('examples-output/test-pdfa-1b.pdf')
console.log('✅ Example 1: PDF/A-1b document created')

// ============================================
// Example 2: PDF/A-2b (Modern Compliance)
// ============================================
// PDF/A-2b is based on PDF 1.7 with improved features
const doc2 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  info: {
    Title: 'PDF/A-2b Compliance Example',
    Author: 'PDFStudio',
    Subject: 'Demonstrating PDF/A-2b standard',
    Keywords: 'PDF/A-2, archiving, compliance, modern standard',
  },
  pdfA: {
    conformanceLevel: 'PDF/A-2b',
    colorProfile: 'sRGB'
  }
})

doc2.text('PDF/A-2b Compliance Example', 50, 750, 20)
doc2.text('This document is compliant with the PDF/A-2b standard (PDF 1.7).', 50, 720, 12)

doc2.text('Improvements over PDF/A-1b:', 50, 680, 14)
doc2.text('- Based on PDF 1.7 (more modern)', 70, 655, 11)
doc2.text('- Better transparency support', 70, 638, 11)
doc2.text('- JPEG2000 compression (if needed)', 70, 621, 11)
doc2.text('- Optional Content (layers) support', 70, 604, 11)
doc2.text('- Digital signatures support', 70, 587, 11)

// Add a colored box
doc2.rect(50, 500, 300, 60)
  .setFillColor(0.2, 0.6, 0.9)
  .fill()
  .setStrokeColor(0, 0, 0.5)
  .setLineWidth(2)
  .stroke()
doc2.setFillColor(1, 1, 1)
doc2.text('PDF/A-2b supports more advanced PDF 1.7 features', 60, 525, 12)
doc2.text('while maintaining long-term archival compliance', 60, 508, 12)
doc2.setFillColor(0, 0, 0)

// Add a table
doc2.text('Compliance Comparison:', 50, 450, 14)
doc2.table({
  x: 50,
  y: 420,
  width: 500,
  headers: ['Feature', 'PDF/A-1b', 'PDF/A-2b'],
  rows: [
    ['PDF Version', 'PDF 1.4', 'PDF 1.7'],
    ['Transparency', 'Limited', 'Full Support'],
    ['JPEG2000', 'No', 'Yes'],
    ['Signatures', 'Limited', 'Full Support']
  ],
  headerStyle: {
    backgroundColor: '#4A90E2',
    textColor: '#FFFFFF',
    bold: true
  },
  alternateRowColor: '#F5F5F5',
  borders: true,
  cellPadding: 8
})

doc2.save('examples-output/test-pdfa-2b.pdf')
console.log('✅ Example 2: PDF/A-2b document created')

// ============================================
// Example 3: PDF/A-3b (With Attachments)
// ============================================
// PDF/A-3b allows embedded files of any format
const doc3 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  info: {
    Title: 'PDF/A-3b Compliance Example',
    Author: 'PDFStudio',
    Subject: 'Demonstrating PDF/A-3b standard with attachment support',
    Keywords: 'PDF/A-3, archiving, attachments, embedded files',
  },
  pdfA: {
    conformanceLevel: 'PDF/A-3b',
    colorProfile: 'sRGB'
  }
})

doc3.text('PDF/A-3b Compliance Example', 50, 750, 20)
doc3.text('This document is compliant with PDF/A-3b and can include file attachments.', 50, 720, 12)

doc3.text('PDF/A-3b Advantages:', 50, 680, 14)
doc3.text('- All PDF/A-2b features', 70, 655, 11)
doc3.text('- Can embed files of ANY format', 70, 638, 11)
doc3.text('- Useful for archiving related documents', 70, 621, 11)
doc3.text('- Maintains visual PDF/A compliance', 70, 604, 11)
doc3.text('- Ideal for complex archival scenarios', 70, 587, 11)

// Add info box
doc3.rect(50, 520, 500, 80)
  .setFillColor(1, 0.98, 0.9)
  .fill()
  .setStrokeColor(0.9, 0.7, 0)
  .setLineWidth(2)
  .stroke()
doc3.text('Note on Attachments:', 60, 580, 12)
doc3.text('PDF/A-3b allows you to embed source files (like spreadsheets, CAD files,', 60, 563, 10)
doc3.text('or other data) within the PDF while maintaining archival compliance.', 60, 548, 10)
doc3.text('This is perfect for archiving complete project documentation.', 60, 533, 10)

doc3.text('Use Cases:', 50, 490, 14)
doc3.text('- Archiving invoices with embedded XML data (e-invoicing)', 70, 465, 11)
doc3.text('- Engineering documents with embedded CAD files', 70, 448, 11)
doc3.text('- Financial reports with embedded Excel spreadsheets', 70, 431, 11)
doc3.text('- Legal documents with embedded source files', 70, 414, 11)

doc3.save('examples-output/test-pdfa-3b.pdf')
console.log('✅ Example 3: PDF/A-3b document created')

// ============================================
// Example 4: Complex PDF/A Document
// ============================================
// Demonstrating PDF/A with rich content
const doc4 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  info: {
    Title: 'Complex PDF/A Archival Document',
    Author: 'Jane Smith',
    Subject: 'Annual Financial Report 2024',
    Keywords: 'financial, report, archival, compliance',
  },
  pdfA: {
    conformanceLevel: 'PDF/A-2b',
    colorProfile: 'sRGB',
    outputIntent: {
      identifier: 'sRGB IEC61966-2.1',
      condition: 'sRGB color space for universal viewing',
      info: 'Long-term archival with consistent color representation'
    }
  }
})

doc4.text('Annual Financial Report 2024', 50, 750, 22)
doc4.text('Archived Document - PDF/A-2b Compliant', 50, 725, 10)

// Draw a line
doc4.moveTo(50, 715)
  .lineTo(550, 715)
  .setStrokeColor(0.29, 0.56, 0.89)
  .setLineWidth(2)
  .stroke()

doc4.text('Executive Summary', 50, 690, 16)
doc4.text('This archival document contains the complete financial overview for the fiscal year 2024.', 50, 665, 11)
doc4.text('All information is preserved in PDF/A-2b format to ensure long-term accessibility.', 50, 648, 11)

// Add a chart area (simulated)
doc4.rect(50, 550, 500, 80)
  .setFillColor(0.95, 0.95, 1)
  .fill()
  .setStrokeColor(0, 0, 0.8)
  .setLineWidth(1)
  .stroke()
doc4.text('Revenue Chart (2024)', 60, 615, 12)
doc4.text('Visual data representation would go here', 60, 595, 10)
doc4.text('Charts, graphs, and images are fully supported in PDF/A', 60, 575, 10)

// Financial summary table
doc4.text('Financial Summary', 50, 520, 14)
doc4.table({
  x: 50,
  y: 490,
  width: 500,
  headers: ['Category', 'Q1', 'Q2', 'Q3', 'Q4', 'Total'],
  rows: [
    ['Revenue', '$250K', '$280K', '$310K', '$340K', '$1,180K'],
    ['Expenses', '$180K', '$190K', '$200K', '$210K', '$780K'],
    ['Profit', '$70K', '$90K', '$110K', '$130K', '$400K']
  ],
  headerStyle: {
    backgroundColor: '#2E5090',
    textColor: '#FFFFFF',
    bold: true
  },
  alternateRowColor: '#F0F4F8',
  borders: true,
  cellPadding: 8,
  fontSize: 10
})

doc4.text('Certification', 50, 280, 14)
doc4.rect(50, 200, 500, 70)
  .setFillColor(0.95, 1, 0.95)
  .fill()
  .setStrokeColor(0, 0.6, 0)
  .setLineWidth(2)
  .stroke()
doc4.text('[X] This document is certified as PDF/A-2b compliant', 70, 250, 11)
doc4.text('[X] Suitable for long-term archival and legal purposes', 70, 233, 11)
doc4.text('[X] Created: ' + new Date().toISOString(), 70, 216, 11)

doc4.save('examples-output/test-pdfa-complex.pdf')
console.log('✅ Example 4: Complex PDF/A document created')

// ============================================
// Example 5: Security Warning Demo
// ============================================
// This demonstrates that PDF/A doesn't allow encryption
console.log('\n⚠️  Testing encryption with PDF/A (should show warning)...')

const doc5 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  info: {
    Title: 'PDF/A with Security Attempt',
    Author: 'PDFStudio'
  },
  security: {
    userPassword: 'user123',
    ownerPassword: 'owner456'
  },
  pdfA: {
    conformanceLevel: 'PDF/A-1b'
  }
})

doc5.text('PDF/A Compliance Test', 50, 750, 20)
doc5.text('This document has both security and PDF/A options.', 50, 720, 12)
doc5.text('The security options will be ignored due to PDF/A requirements.', 50, 700, 12)

// Draw warning box
doc5.rect(50, 640, 500, 40)
  .setFillColor(1, 0.95, 0.95)
  .fill()
  .setStrokeColor(1, 0, 0)
  .setLineWidth(2)
  .stroke()
doc5.setFillColor(1, 0, 0)
doc5.text('WARNING: Check console for warning message about encryption', 60, 660, 12)
doc5.setFillColor(0, 0, 0)

doc5.save('examples-output/test-pdfa-security-warning.pdf')
console.log('✅ Example 5: Security warning demo created')

// ============================================
// Summary
// ============================================
console.log('\n📁 All PDF/A examples created successfully!')
console.log('   5 PDFs demonstrating:')
console.log('   1. PDF/A-1b compliance (PDF 1.4)')
console.log('   2. PDF/A-2b compliance (PDF 1.7)')
console.log('   3. PDF/A-3b compliance (with attachment support)')
console.log('   4. Complex PDF/A document (tables, charts, rich content)')
console.log('   5. Security + PDF/A warning demonstration')
console.log('\n📝 Note: PDF/A documents are designed for long-term archiving')
console.log('   and can be validated using PDF/A validators like:')
console.log('   - Adobe Acrobat Preflight')
console.log('   - VeraPDF (free, open-source)')
console.log('   - PDF/A Validator online tools')
console.log()
