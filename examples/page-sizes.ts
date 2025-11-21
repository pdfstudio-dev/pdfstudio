import { PDFDocument, PageSize, PAGE_SIZES } from '../src'

console.log('📄 Generating PDFs with different page sizes...\\n')

// ======================
// Example 1: Common Latin American sizes
// ======================
console.log('1️⃣ Common Latin American sizes...')

// Carta (Letter) - 8.5" x 11"
const docCarta = new PDFDocument({
  size: 'Letter',
  pageNumbers: {
    enabled: true,
    position: 'bottom-center',
    format: 'Page {current}'
  }
})

docCarta.text('LETTER SIZE (CARTA)', 180, 700, 24)
docCarta.text('8.5" × 11" (216mm × 279mm)', 170, 660, 16)
docCarta.text('Standard size in America', 170, 630, 14)
docCarta.text('Dimensions in points: 612 × 792', 160, 600, 12)
docCarta.text('Use: General documents, letters, reports', 140, 570, 12)

docCarta.save('examples-output/size-01-carta-letter.pdf')
console.log('   ✅ examples-output/size-01-carta-letter.pdf')

// Oficio (Legal) - 8.5" x 14"
const docOficio = new PDFDocument({
  size: 'Legal',
  pageNumbers: {
    enabled: true,
    position: 'bottom-center',
    format: 'Page {current}'
  }
})

docOficio.text('LEGAL SIZE (OFICIO)', 170, 900, 24)
docOficio.text('8.5" × 14" (216mm × 356mm)', 165, 860, 16)
docOficio.text('Legal size in America', 175, 830, 14)
docOficio.text('Dimensions in points: 612 × 1008', 160, 800, 12)
docOficio.text('Use: Legal documents, contracts', 150, 770, 12)
docOficio.text('Taller than letter for more content', 145, 740, 12)

docOficio.save('examples-output/size-02-oficio-legal.pdf')
console.log('   ✅ examples-output/size-02-oficio-legal.pdf')

// Media Carta (Half Letter) - 5.5" x 8.5"
const docMediaCarta = new PDFDocument({
  size: 'HalfLetter',
  pageNumbers: {
    enabled: true,
    position: 'bottom-right',
    format: '{current}'
  }
})

docMediaCarta.text('MEDIA CARTA', 100, 550, 20)
docMediaCarta.text('(HALF LETTER)', 90, 520, 16)
docMediaCarta.text('5.5" × 8.5"', 110, 480, 14)
docMediaCarta.text('140mm × 216mm', 100, 455, 14)
docMediaCarta.text('Points: 396 × 612', 85, 430, 12)
docMediaCarta.text('Use: Notes, notebooks', 70, 400, 12)
docMediaCarta.text('Compact size', 80, 375, 12)

docMediaCarta.save('examples-output/size-03-media-carta.pdf')
console.log('   ✅ examples-output/size-03-media-carta.pdf')

// Folio - 8.5" x 13"
const docFolio = new PDFDocument({
  size: 'Folio',
  pageNumbers: {
    enabled: true,
    position: 'bottom-center',
    format: 'Page {current}'
  }
})

docFolio.text('FOLIO SIZE', 220, 850, 24)
docFolio.text('8.5" × 13" (216mm × 330mm)', 170, 810, 16)
docFolio.text('Intermediate size', 200, 780, 14)
docFolio.text('Dimensions in points: 612 × 936', 165, 750, 12)
docFolio.text('Use: Documents, reports', 170, 720, 12)

docFolio.save('examples-output/size-04-folio.pdf')
console.log('   ✅ examples-output/size-04-folio.pdf\\n')

// ======================
// Example 2: ISO A series (Europe/International)
// ======================
console.log('2️⃣ ISO A series (Europe/International)...')

const isoASizes: PageSize[] = ['A3', 'A4', 'A5', 'A6']

isoASizes.forEach((size) => {
  const doc = new PDFDocument({
    size,
    pageNumbers: {
      enabled: true,
      position: 'bottom-center'
    }
  })

  const [width, height] = PAGE_SIZES[size]
  const widthMM = (width / 72 * 25.4).toFixed(0)
  const heightMM = (height / 72 * 25.4).toFixed(0)

  const y = height / 2 + 100

  doc.text(`SIZE ${size}`, width / 2 - 60, y, 24)
  doc.text(`${widthMM}mm × ${heightMM}mm`, width / 2 - 70, y - 50, 16)
  doc.text(`${width.toFixed(2)} × ${height.toFixed(2)} points`, width / 2 - 100, y - 80, 14)
  doc.text('ISO A Series (International)', width / 2 - 80, y - 110, 12)

  const filename = `examples-output/size-iso-${size.toLowerCase()}.pdf`
  doc.save(filename)
  console.log(`   ✅ ${filename}`)
})
console.log()

// ======================
// Example 3: Special North American sizes
// ======================
console.log('3️⃣ Special North American sizes...')

// Executive - 7.25" x 10.5"
const docExec = new PDFDocument({
  size: 'Executive',
  pageNumbers: {
    enabled: true,
    position: 'bottom-center'
  }
})

docExec.text('EXECUTIVE SIZE', 120, 650, 20)
docExec.text('7.25" × 10.5"', 160, 615, 16)
docExec.text('184mm × 267mm', 155, 590, 14)
docExec.text('522 × 756 points', 155, 565, 12)
docExec.text('Use: Executive planners', 135, 530, 12)

docExec.save('examples-output/size-05-executive.pdf')
console.log('   ✅ examples-output/size-05-executive.pdf')

// Tabloid - 11" x 17"
const docTabloid = new PDFDocument({
  size: 'Tabloid',
  pageNumbers: {
    enabled: true,
    position: 'bottom-right',
    format: '{current}'
  }
})

docTabloid.text('TABLOID SIZE', 260, 1100, 28)
docTabloid.text('11" × 17" (279mm × 432mm)', 240, 1050, 18)
docTabloid.text('Dimensions in points: 792 × 1224', 230, 1010, 14)
docTabloid.text('Use: Posters, newspapers, plans', 240, 970, 14)
docTabloid.text('Large format for presentations', 230, 940, 12)

docTabloid.save('examples-output/size-06-tabloid.pdf')
console.log('   ✅ examples-output/size-06-tabloid.pdf')

// Ledger - 17" x 11" (Tabloid horizontal)
const docLedger = new PDFDocument({
  size: 'Ledger',
  pageNumbers: {
    enabled: true,
    position: 'bottom-right'
  }
})

docLedger.text('LEDGER (TABLOID HORIZONTAL)', 380, 650, 24)
docLedger.text('17" × 11" (432mm × 279mm)', 400, 610, 16)
docLedger.text('Dimensions in points: 1224 × 792', 390, 580, 14)
docLedger.text('Use: Spreadsheets, architectural plans', 360, 550, 12)

docLedger.save('examples-output/size-07-ledger.pdf')
console.log('   ✅ examples-output/size-07-ledger.pdf\\n')

// ======================
// Example 4: ISO B series
// ======================
console.log('4️⃣ ISO B series...')

const isoBSizes: PageSize[] = ['B4', 'B5']

isoBSizes.forEach((size) => {
  const doc = new PDFDocument({
    size,
    pageNumbers: {
      enabled: true,
      position: 'bottom-center'
    }
  })

  const [width, height] = PAGE_SIZES[size]
  const widthMM = (width / 72 * 25.4).toFixed(0)
  const heightMM = (height / 72 * 25.4).toFixed(0)

  const y = height / 2 + 100

  doc.text(`SIZE ${size}`, width / 2 - 60, y, 24)
  doc.text(`${widthMM}mm × ${heightMM}mm`, width / 2 - 70, y - 50, 16)
  doc.text(`${width.toFixed(2)} × ${height.toFixed(2)} points`, width / 2 - 100, y - 80, 14)
  doc.text('ISO B Series (International)', width / 2 - 80, y - 110, 12)

  const filename = `examples-output/size-iso-${size.toLowerCase()}.pdf`
  doc.save(filename)
  console.log(`   ✅ ${filename}`)
})
console.log()

// ======================
// Example 5: Document with different sized pages
// ======================
console.log('5️⃣ Multi-page document with different sizes...')

const docMixed = new PDFDocument({
  size: 'Letter',
  pageNumbers: {
    enabled: true,
    position: 'bottom-center',
    format: 'Page {current} of {total}'
  }
})

// Page 1: Letter
docMixed.text('MULTI-SIZE DOCUMENT', 170, 700, 24)
docMixed.text('Page 1: Letter Size', 160, 650, 16)
docMixed.text('Each page can have a different size', 130, 610, 14)

// Page 2: Legal
docMixed.addPage('Legal')
docMixed.text('Page 2: Legal Size', 160, 900, 18)
docMixed.text('This page is taller', 180, 860, 14)
docMixed.text('Ideal for more content', 175, 830, 12)

// Page 3: A4
docMixed.addPage('A4')
docMixed.text('Page 3: A4 Size', 190, 750, 18)
docMixed.text('International standard format', 160, 710, 14)

// Page 4: Half Letter
docMixed.addPage('HalfLetter')
docMixed.text('Page 4', 140, 550, 18)
docMixed.text('Half Letter', 125, 520, 16)
docMixed.text('Compact format', 110, 485, 12)

// Page 5: Tabloid
docMixed.addPage('Tabloid')
docMixed.text('Page 5: Tabloid', 280, 1100, 24)
docMixed.text('Large format for graphics', 260, 1050, 16)

docMixed.barChart({
  data: [
    { label: 'Q1', value: 150 },
    { label: 'Q2', value: 230 },
    { label: 'Q3', value: 180 },
    { label: 'Q4', value: 290 }
  ],
  x: 100,
  y: 600,
  width: 600,
  height: 350,
  barColors: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12'],
  title: 'Annual Sales',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showValues: true
})

docMixed.save('examples-output/size-08-mixed-sizes.pdf')
console.log('   ✅ examples-output/size-08-mixed-sizes.pdf\\n')

// ======================
// Example 6: Complete size guide
// ======================
console.log('6️⃣ Complete size guide...')

const docGuide = new PDFDocument({
  size: 'Letter',
  pageNumbers: {
    enabled: true,
    position: 'bottom-right',
    format: '{current}/{total}',
    fontSize: 9,
    color: '#666666'
  }
})

docGuide.text('Page Sizes Guide', 160, 750, 24)
docGuide.text('PDFStudio - Complete Reference', 155, 710, 16)

docGuide.text('Latin American Sizes:', 50, 660, 18)
docGuide.text('• Letter: 8.5" × 11" (612 × 792 pts)', 70, 630, 12)
docGuide.text('• Legal: 8.5" × 14" (612 × 1008 pts)', 70, 610, 12)
docGuide.text('• HalfLetter: 5.5" × 8.5" (396 × 612 pts)', 70, 590, 12)
docGuide.text('• Folio: 8.5" × 13" (612 × 936 pts)', 70, 570, 12)
docGuide.text('• Executive: 7.25" × 10.5" (522 × 756 pts)', 70, 550, 12)

docGuide.text('ISO A Series (International):', 50, 510, 18)
docGuide.text('• A3: 297mm × 420mm (841.89 × 1190.55 pts)', 70, 480, 12)
docGuide.text('• A4: 210mm × 297mm (595.28 × 841.89 pts)', 70, 460, 12)
docGuide.text('• A5: 148mm × 210mm (419.53 × 595.28 pts)', 70, 440, 12)
docGuide.text('• A6: 105mm × 148mm (297.64 × 419.53 pts)', 70, 420, 12)

docGuide.text('ISO B Series:', 50, 380, 18)
docGuide.text('• B4: 250mm × 353mm (708.66 × 1000.63 pts)', 70, 350, 12)
docGuide.text('• B5: 176mm × 250mm (498.90 × 708.66 pts)', 70, 330, 12)

docGuide.text('Large Sizes:', 50, 290, 18)
docGuide.text('• Tabloid: 11" × 17" (792 × 1224 pts)', 70, 260, 12)
docGuide.text('• Ledger: 17" × 11" (1224 × 792 pts) [horizontal]', 70, 240, 12)

// Page 2: Usage examples
docGuide.addPage()
docGuide.text('Usage Examples', 210, 750, 24)

docGuide.text('Create document with specific size:', 50, 700, 16)

const code1 = `const doc = new PDFDocument({ size: 'Legal' })`
docGuide.text(code1, 70, 670, 11)

docGuide.text('Add page with different size:', 50, 630, 16)

const code2 = `doc.addPage('A4')  // New A4 page`
docGuide.text(code2, 70, 600, 11)

docGuide.text('Custom size:', 50, 560, 16)

const code3 = `doc.addPage([800, 600])  // Width × Height in points`
docGuide.text(code3, 70, 530, 11)

docGuide.text('Recommendations:', 50, 480, 18)
docGuide.text('✓ Letter/Legal: Documents in America', 70, 450, 12)
docGuide.text('✓ A4: International documents', 70, 430, 12)
docGuide.text('✓ HalfLetter: Notes and compact documents', 70, 410, 12)
docGuide.text('✓ Tabloid: Posters and presentations', 70, 390, 12)
docGuide.text('✓ Executive: Planners and agendas', 70, 370, 12)

docGuide.text('Unit conversion:', 50, 320, 16)
docGuide.text('• 1 inch = 72 points', 70, 290, 12)
docGuide.text('• 1 mm = 2.83465 points', 70, 270, 12)
docGuide.text('• 1 cm = 28.3465 points', 70, 250, 12)

docGuide.save('examples-output/size-guide.pdf')
console.log('   ✅ examples-output/size-guide.pdf\\n')

// ======================
// Summary
// ======================
console.log('✅ All page size examples generated!\\n')
console.log('📁 Files generated:')
console.log('   Latin American sizes:')
console.log('   • size-01-carta-letter.pdf')
console.log('   • size-02-oficio-legal.pdf')
console.log('   • size-03-media-carta.pdf')
console.log('   • size-04-folio.pdf')
console.log('   • size-05-executive.pdf\\n')
console.log('   ISO A Series:')
console.log('   • size-iso-a3.pdf')
console.log('   • size-iso-a4.pdf')
console.log('   • size-iso-a5.pdf')
console.log('   • size-iso-a6.pdf\\n')
console.log('   ISO B Series:')
console.log('   • size-iso-b4.pdf')
console.log('   • size-iso-b5.pdf\\n')
console.log('   Large sizes:')
console.log('   • size-06-tabloid.pdf')
console.log('   • size-07-ledger.pdf\\n')
console.log('   Special:')
console.log('   • size-08-mixed-sizes.pdf (mixed pages)')
console.log('   • size-guide.pdf (complete guide)\\n')
console.log('📏 Supported sizes: 14 standard formats')
console.log('   ✓ Latin American: Letter, Legal, HalfLetter, Folio, Executive')
console.log('   ✓ ISO A: A3, A4, A5, A6')
console.log('   ✓ ISO B: B4, B5')
console.log('   ✓ Large: Tabloid, Ledger')
console.log('   ✓ Custom: [width, height] in points\\n')
console.log('💡 Recommended size for Latin America: Letter or Legal')
