import { PDFDocument } from '../src'

console.log('📄 Generating PDFs with metadata...\n')

// ======================
// Example 1: Basic metadata
// ======================
console.log('1️⃣ Basic metadata...')

const doc1 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  info: {
    Title: 'PDF UI Studio - Platform Analytics 2024',
    Author: 'PDF UI Studio Team',
    Subject: 'User growth and feature adoption analysis',
    Keywords: 'pdf, analytics, 2024, growth, platform'
  }
})

doc1.text('PDF UI STUDIO - ANALYTICS 2024', 80, 700, 24)
doc1.text('Platform Performance Report', 100, 660, 16)
doc1.text('', 100, 620)
doc1.text('This document contains complete metadata:', 100, 600, 12)
doc1.text('• Title: PDF UI Studio - Platform Analytics 2024', 100, 580, 11)
doc1.text('• Author: PDF UI Studio Team', 100, 560, 11)
doc1.text('• Subject: User growth and feature adoption analysis', 100, 540, 11)
doc1.text('• Keywords: pdf, analytics, 2024, growth, platform', 100, 520, 11)

doc1.save('examples-output/metadata-01-basic.pdf')
console.log('   ✅ examples-output/metadata-01-basic.pdf\n')

// ======================
// Example 2: Metadata with custom dates
// ======================
console.log('2️⃣ Metadata with custom dates...')

const customDate = new Date('2024-01-15T10:30:00')

const doc2 = new PDFDocument({
  size: 'A4',
  margins: 40,
  info: {
    Title: 'Service Contract',
    Author: 'Mary Johnson',
    Subject: 'Professional services contract',
    Creator: 'PDFStudio Legal Department',
    CreationDate: customDate,
    ModDate: customDate
  }
})

doc2.text('SERVICE CONTRACT', 100, 750, 20)
doc2.text('', 100, 710)
doc2.text('This document was created on January 15, 2024', 100, 690, 12)
doc2.text('at 10:30 AM as recorded in the metadata.', 100, 670, 12)

doc2.save('examples-output/metadata-02-custom-dates.pdf')
console.log('   ✅ examples-output/metadata-02-custom-dates.pdf\n')

// ======================
// Example 3: Metadata with displayTitle
// ======================
console.log('3️⃣ Metadata with displayTitle...')

const doc3 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  info: {
    Title: 'User Manual - PDFStudio v1.0',
    Author: 'Documentation Team',
    Subject: 'Complete PDFStudio usage guide',
    Keywords: 'manual, documentation, guide, tutorial',
    displayTitle: true  // ← Shows the title in viewer window
  }
})

doc3.text('USER MANUAL', 100, 700, 24)
doc3.text('PDFStudio v1.0', 100, 660, 18)
doc3.text('', 100, 620)
doc3.text('This PDF has displayTitle enabled.', 100, 600, 12)
doc3.text('When opened in a PDF viewer, the document title', 100, 580, 12)
doc3.text('will appear in the window title bar instead', 100, 560, 12)
doc3.text('of the filename.', 100, 540, 12)

doc3.save('examples-output/metadata-03-display-title.pdf')
console.log('   ✅ examples-output/metadata-03-display-title.pdf\n')

// ======================
// Example 4: Minimal metadata (auto-generated)
// ======================
console.log('4️⃣ Minimal metadata (auto-generated)...')

const doc4 = new PDFDocument({
  size: 'A4',
  margins: 50
  // Without specifying info - defaults are used
})

doc4.text('DOCUMENT WITHOUT EXPLICIT METADATA', 100, 750, 18)
doc4.text('', 100, 710)
doc4.text('This document did not specify explicit metadata,', 100, 690, 12)
doc4.text('but PDFStudio automatically adds:', 100, 670, 12)
doc4.text('', 100, 650)
doc4.text('• Creator: PDFStudio', 100, 630, 11)
doc4.text('• Producer: PDFStudio PDF Library', 100, 610, 11)
doc4.text('• CreationDate: (current date and time)', 100, 590, 11)
doc4.text('• ModDate: (current date and time)', 100, 570, 11)

doc4.save('examples-output/metadata-04-auto-generated.pdf')
console.log('   ✅ examples-output/metadata-04-auto-generated.pdf\n')

// ======================
// Example 5: Complete metadata for professional file
// ======================
console.log('5️⃣ Complete professional metadata...')

const doc5 = new PDFDocument({
  size: 'Letter',
  margins: 60,
  info: {
    Title: 'Business Proposal - Project Alpha',
    Author: 'Roberto Martinez, Commercial Director',
    Subject: 'Software development proposal for client XYZ Corp',
    Keywords: 'proposal, development, software, web, mobile, cloud',
    Creator: 'Commercial Department - Tech Solutions Inc',
    Producer: 'PDFStudio Enterprise Edition',
    CreationDate: new Date('2024-03-10T09:00:00'),
    ModDate: new Date('2024-03-12T15:30:00'),
    displayTitle: true
  }
})

doc5.text('BUSINESS PROPOSAL', 200, 700, 24)
doc5.text('PROJECT ALPHA', 220, 665, 20)
doc5.text('', 100, 625)
doc5.text('Client: XYZ Corporation', 100, 600, 14)
doc5.text('Date: March 10, 2024', 100, 575, 12)
doc5.text('', 100, 550)
doc5.text('This proposal contains complete professional metadata:', 100, 525, 12)
doc5.text('', 100, 505)
doc5.text('✓ Descriptive project title', 120, 485, 11)
doc5.text('✓ Author with position (Roberto Martinez, Commercial Director)', 120, 465, 11)
doc5.text('✓ Detailed document description', 120, 445, 11)
doc5.text('✓ Keywords for search', 120, 425, 11)
doc5.text('✓ Creator department', 120, 405, 11)
doc5.text('✓ Specific creation and modification dates', 120, 385, 11)
doc5.text('✓ Display title enabled for professionalism', 120, 365, 11)

doc5.save('examples-output/metadata-05-professional.pdf')
console.log('   ✅ examples-output/metadata-05-professional.pdf\n')

// ======================
// Example 6: Metadata with special characters
// ======================
console.log('6️⃣ Metadata with special characters...')

const doc6 = new PDFDocument({
  size: 'A4',
  margins: 50,
  info: {
    Title: 'Installation Guide (Version 2.0)',
    Author: 'José María Fernández & Sofía Rodríguez',
    Subject: 'Installation instructions for "PDFStudio Pro"',
    Keywords: 'installation, configuration, áéíóúñü, €$£¥'
  }
})

doc6.text('SPECIAL CHARACTERS IN METADATA', 100, 750, 18)
doc6.text('', 100, 710)
doc6.text('This PDF demonstrates correct handling of:', 100, 690, 12)
doc6.text('', 100, 670)
doc6.text('• Parentheses in title: (Version 2.0)', 100, 650, 11)
doc6.text('• Ampersand in author: José & Sofía', 100, 630, 11)
doc6.text('• Quotes in subject: "PDFStudio Pro"', 100, 610, 11)
doc6.text('• Accented characters: áéíóúñü', 100, 590, 11)
doc6.text('• Currency symbols: €$£¥', 100, 570, 11)

doc6.save('examples-output/metadata-06-special-chars.pdf')
console.log('   ✅ examples-output/metadata-06-special-chars.pdf\n')

// ======================
// Summary
// ======================
console.log('✅ All metadata examples generated!\n')
console.log('📁 Files generated:')
console.log('   • metadata-01-basic.pdf')
console.log('   • metadata-02-custom-dates.pdf')
console.log('   • metadata-03-display-title.pdf')
console.log('   • metadata-04-auto-generated.pdf')
console.log('   • metadata-05-professional.pdf')
console.log('   • metadata-06-special-chars.pdf\n')

console.log('📊 Implemented metadata:')
console.log('   ✓ Title - Document title')
console.log('   ✓ Author - Author')
console.log('   ✓ Subject - Subject/Description')
console.log('   ✓ Keywords - Keywords')
console.log('   ✓ Creator - Creator application')
console.log('   ✓ Producer - PDF generator')
console.log('   ✓ CreationDate - Creation date (auto or custom)')
console.log('   ✓ ModDate - Modification date (auto or custom)')
console.log('   ✓ displayTitle - Show title in viewer\n')

console.log('💡 How to view metadata:')
console.log('   • Adobe Reader: File > Properties')
console.log('   • macOS Preview: Cmd+I > "More Info" tab')
console.log('   • Chrome: Open PDF > Click "i" (information)')
console.log('   • PDF.js: Sidebar > "Document Properties"\n')

console.log('🎯 Benefits of using metadata:')
console.log('   • Improves document organization')
console.log('   • Facilitates searches and cataloging')
console.log('   • Professionalism and credibility')
console.log('   • Standards compliance')
console.log('   • SEO for indexed PDFs')
