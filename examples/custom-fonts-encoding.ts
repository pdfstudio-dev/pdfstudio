import { PDFDocument } from '../src'

console.log('📄 Generating PDFs with different fonts and encodings...\\n')

// ======================
// Example 1: WinAnsiEncoding (Western European) - Default
// ======================
console.log('1️⃣ WinAnsiEncoding with Helvetica...')
const doc1 = new PDFDocument({
  font: {
    baseFont: 'Helvetica',
    encoding: 'WinAnsiEncoding'
  },
  pageNumbers: {
    enabled: true,
    position: 'bottom-center',
    format: 'Page {current} of {total}'
  }
})

doc1.text('WinAnsiEncoding - Western European', 150, 750, 20)
doc1.text('Special Spanish characters:', 100, 700, 14)
doc1.text('• Accented vowels: á, é, í, ó, ú, Á, É, Í, Ó, Ú', 120, 670, 12)
doc1.text('• Letter ñ: español, mañana, niño, España', 120, 645, 12)
doc1.text('• Signs: ¿Cómo estás? ¡Excelente!', 120, 620, 12)
doc1.text('• Others: €, £, ¥, §, ©, ®', 120, 595, 12)

doc1.addPage()
doc1.text('French characters:', 100, 700, 14)
doc1.text('• à, è, ì, ò, ù, ç, ë, ï, ö, ü', 120, 670, 12)
doc1.text('• Français, Café, Crème, Hôtel', 120, 645, 12)

doc1.addPage()
doc1.text('German and other characters:', 100, 700, 14)
doc1.text('• ä, ö, ü, ß (German)', 120, 670, 12)
doc1.text('• Straße, Müller, Köln', 120, 645, 12)

doc1.save('examples-output/encoding-01-winAnsi.pdf')
console.log('   ✅ examples-output/encoding-01-winAnsi.pdf\\n')

// ======================
// Example 2: Different fonts with WinAnsiEncoding
// ======================
console.log('2️⃣ Different fonts (WinAnsiEncoding)...')

const fonts: Array<{ font: any, name: string }> = [
  { font: 'Helvetica', name: 'Helvetica' },
  { font: 'Helvetica-Bold', name: 'Helvetica Bold' },
  { font: 'Times-Roman', name: 'Times Roman' },
  { font: 'Times-Bold', name: 'Times Bold' },
  { font: 'Courier', name: 'Courier' },
  { font: 'Courier-Bold', name: 'Courier Bold' }
]

fonts.forEach(({ font, name }) => {
  const doc = new PDFDocument({
    font: {
      baseFont: font,
      encoding: 'WinAnsiEncoding'
    }
  })

  doc.text(`Font: ${name}`, 200, 700, 24)
  doc.text('Text with accents: Technical information', 150, 650, 16)
  doc.text('Spanish: ñ, á, é, í, ó, ú', 180, 600, 14)
  doc.text('Numbers: 0123456789', 200, 550, 14)
  doc.text('Symbols: €£¥§©®™', 210, 500, 14)

  const filename = `examples-output/font-${font.toLowerCase()}.pdf`
  doc.save(filename)
  console.log(`   ✅ ${filename}`)
})
console.log()

// ======================
// Example 3: MacRomanEncoding
// ======================
console.log('3️⃣ MacRomanEncoding...')
const doc3 = new PDFDocument({
  font: {
    baseFont: 'Helvetica',
    encoding: 'MacRomanEncoding'
  }
})

doc3.text('MacRomanEncoding', 200, 700, 24)
doc3.text('Encoding traditionally used in Mac OS', 130, 650, 14)
doc3.text('Supports Western characters', 160, 620, 12)
doc3.text('Spanish: ñ, á, é, í, ó, ú', 180, 580, 12)
doc3.text('Mac symbols: €, ™, ©', 200, 550, 12)

doc3.save('examples-output/encoding-02-macRoman.pdf')
console.log('   ✅ examples-output/encoding-02-macRoman.pdf\\n')

// ======================
// Example 4: StandardEncoding
// ======================
console.log('4️⃣ StandardEncoding...')
const doc4 = new PDFDocument({
  font: {
    baseFont: 'Times-Roman',
    encoding: 'StandardEncoding'
  }
})

doc4.text('StandardEncoding', 200, 700, 24)
doc4.text('Standard PDF encoding', 180, 650, 14)
doc4.text('Basic character set', 160, 620, 12)
doc4.text('Standard extended ASCII', 180, 580, 12)

doc4.save('examples-output/encoding-03-standard.pdf')
console.log('   ✅ examples-output/encoding-03-standard.pdf\\n')

// ======================
// Example 5: Encoding comparison in one document
// ======================
console.log('5️⃣ Comparative document...')
const doc5 = new PDFDocument({
  font: {
    baseFont: 'Helvetica',
    encoding: 'WinAnsiEncoding'
  },
  pageNumbers: {
    enabled: true,
    position: 'bottom-right',
    format: '{current}/{total}'
  }
})

doc5.text('Encodings and Fonts Guide', 160, 750, 22)
doc5.text('PDFStudio - Font Configuration', 150, 710, 14)

doc5.text('1. WinAnsiEncoding (Recommended for Spanish)', 100, 650, 16)
doc5.text('   • Best support for Western languages', 120, 620, 12)
doc5.text('   • Spanish, French, German, Portuguese', 120, 600, 12)
doc5.text('   • Symbols: €, £, ¥, ©, ®, ™', 120, 580, 12)

doc5.text('2. MacRomanEncoding', 100, 530, 16)
doc5.text('   • Traditional Mac OS encoding', 120, 500, 12)
doc5.text('   • Compatible with Western characters', 120, 480, 12)

doc5.text('3. StandardEncoding', 100, 430, 16)
doc5.text('   • Standard PDF encoding', 120, 400, 12)
doc5.text('   • Basic character set', 120, 380, 12)

doc5.addPage()
doc5.text('Available Fonts', 200, 750, 22)

doc5.text('Helvetica Family:', 100, 700, 16)
doc5.text('   • Helvetica (normal)', 120, 670, 12)
doc5.text('   • Helvetica-Bold (bold)', 120, 650, 12)
doc5.text('   • Helvetica-Oblique (italic)', 120, 630, 12)
doc5.text('   • Helvetica-BoldOblique (bold italic)', 120, 610, 12)

doc5.text('Times Family:', 100, 560, 16)
doc5.text('   • Times-Roman (normal)', 120, 530, 12)
doc5.text('   • Times-Bold (bold)', 120, 510, 12)
doc5.text('   • Times-Italic (italic)', 120, 490, 12)
doc5.text('   • Times-BoldItalic (bold italic)', 120, 470, 12)

doc5.text('Courier Family:', 100, 420, 16)
doc5.text('   • Courier (monospaced)', 120, 390, 12)
doc5.text('   • Courier-Bold (bold)', 120, 370, 12)
doc5.text('   • Courier-Oblique (italic)', 120, 350, 12)
doc5.text('   • Courier-BoldOblique (bold italic)', 120, 330, 12)

doc5.text('Special fonts:', 100, 280, 16)
doc5.text('   • Symbol (mathematical symbols)', 120, 250, 12)
doc5.text('   • ZapfDingbats (decorative symbols)', 120, 230, 12)

doc5.addPage()
doc5.text('Usage Example', 220, 750, 22)

doc5.text('TypeScript Code:', 100, 700, 14)

const codeExample = `const doc = new PDFDocument({
  font: {
    baseFont: 'Helvetica-Bold',
    encoding: 'WinAnsiEncoding'
  },
  pageNumbers: {
    enabled: true,
    position: 'bottom-center'
  }
})

doc.text('Text in Spanish: ñ, á, é, í, ó, ú', 100, 700, 14)
doc.save('my-document.pdf')`

// Simulate code with Courier (monospaced font)
// Since we can't change the font dynamically in current text,
// we just show the example
doc5.text('const doc = new PDFDocument({', 110, 660, 10)
doc5.text('  font: {', 110, 645, 10)
doc5.text('    baseFont: \'Helvetica-Bold\',', 110, 630, 10)
doc5.text('    encoding: \'WinAnsiEncoding\'', 110, 615, 10)
doc5.text('  },', 110, 600, 10)
doc5.text('  pageNumbers: { enabled: true }', 110, 585, 10)
doc5.text('})', 110, 570, 10)

doc5.text('Recommendations:', 100, 500, 16)
doc5.text('✓ Use WinAnsiEncoding for Spanish', 120, 470, 12)
doc5.text('✓ Helvetica is ideal for general documents', 120, 450, 12)
doc5.text('✓ Times-Roman for formal documents', 120, 430, 12)
doc5.text('✓ Courier for code or monospaced text', 120, 410, 12)

doc5.save('examples-output/encoding-guide.pdf')
console.log('   ✅ examples-output/encoding-guide.pdf\\n')

// ======================
// Summary
// ======================
console.log('✅ All encoding and font examples generated!\\n')
console.log('📁 Files generated:')
console.log('   • encoding-01-winAnsi.pdf (WinAnsiEncoding with Spanish)')
console.log('   • encoding-02-macRoman.pdf (MacRomanEncoding)')
console.log('   • encoding-03-standard.pdf (StandardEncoding)')
console.log('   • font-*.pdf (6 different fonts)')
console.log('   • encoding-guide.pdf (Complete guide)\\n')
console.log('🎨 Features:')
console.log('   ✓ 3 different encodings')
console.log('   ✓ 14 standard Type1 fonts')
console.log('   ✓ Complete support for Spanish and other languages')
console.log('   ✓ Fully customizable\\n')
console.log('💡 Recommended encoding: WinAnsiEncoding (Spanish)')
