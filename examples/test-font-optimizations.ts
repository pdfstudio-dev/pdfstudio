import { PDFDocument } from '../src/core/PDFDocument'
import * as path from 'path'
import * as fs from 'fs'

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'output')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

/**
 * Example 1: Text selection with ToUnicode CMap
 */
function example1() {
  console.log('Generating Example 1: ToUnicode CMap demonstration...')

  const fontPath = '/System/Library/Fonts/Helvetica.ttc'
  if (!fs.existsSync(fontPath)) {
    console.log('  ⚠️  Helvetica font not found, skipping')
    return
  }

  const doc = new PDFDocument()

  doc.text('ToUnicode CMap Demonstration', 100, 750, 24)
  doc.text('Try selecting and copying the text below:', 100, 720, 12)

  // Standard font (no ToUnicode needed)
  doc.text('Standard Font (Helvetica):', 100, 680, 14)
  doc.text('The quick brown fox jumps over the lazy dog', 100, 660, 12)
  doc.text('Try selecting this text - it should work fine.', 100, 640, 11)

  // Custom font with ToUnicode CMap
  doc.registerFont({
    name: 'CustomFont',
    source: fontPath,
    subset: false
  })

  doc.useFont('CustomFont')

  doc.text('Custom Font with ToUnicode CMap:', 100, 600, 14)
  doc.text('The quick brown fox jumps over the lazy dog', 100, 580, 12)
  doc.text('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 100, 560, 12)
  doc.text('abcdefghijklmnopqrstuvwxyz', 100, 540, 12)
  doc.text('0123456789 !@#$%^&*()-_=+[]{}', 100, 520, 12)
  doc.text('Try selecting this text - ToUnicode CMap makes it work!', 100, 500, 11)

  doc.useBaseFont('Times-Roman')
  doc.text('', 100, 460, 10)
  doc.text('Note: With ToUnicode CMap, text selection and copy-paste', 100, 460, 10)
  doc.text('work correctly even with custom embedded fonts.', 100, 445, 10)

  doc.save(path.join(outputDir, 'optimization-1-tounicode.pdf'))
  console.log('  > Saved: optimization-1-tounicode.pdf')
  console.log('  > ToUnicode CMap included for better text selection')
}

/**
 * Example 2: Glyph tracking demonstration
 */
function example2() {
  console.log('Generating Example 2: Glyph tracking...')

  const fontPath = '/System/Library/Fonts/Supplemental/Arial.ttf'
  if (!fs.existsSync(fontPath)) {
    console.log('  ⚠️  Arial font not found, skipping')
    return
  }

  const doc = new PDFDocument()

  doc.text('Glyph Usage Tracking', 100, 750, 24)
  doc.text('This example demonstrates character tracking for font subsetting', 100, 720, 12)

  // Register font with subsetting enabled (tracking will happen automatically)
  doc.registerFont({
    name: 'Arial',
    source: fontPath,
    subset: true  // Enable subsetting (tracking happens automatically)
  })

  doc.useFont('Arial')

  doc.text('Limited Character Set:', 100, 680, 16)
  doc.text('Hello World', 100, 660, 14)
  doc.text('Hello World', 100, 640, 14)
  doc.text('Hello World', 100, 620, 14)

  doc.text('', 100, 580, 12)
  doc.text('This example only uses these characters:', 100, 580, 12)
  doc.text('H, e, l, o, W, r, d (7 unique characters)', 100, 560, 12)

  doc.useBaseFont('Courier')
  doc.text('', 100, 520, 10)
  doc.text('With subsetting, only these 7 glyphs would be embedded', 100, 520, 10)
  doc.text('instead of all ~2000+ glyphs in the full font.', 100, 505, 10)
  doc.text('', 100, 480, 10)
  doc.text('Potential file size reduction: ~99.5%', 100, 480, 10)
  doc.text('(Note: Full subsetting not yet implemented, but tracking works)', 100, 465, 10)

  doc.save(path.join(outputDir, 'optimization-2-tracking.pdf'))
  console.log('  > Saved: optimization-2-tracking.pdf')
  console.log('  > Character usage tracked (check console for stats)')
}

/**
 * Example 3: Full character set (show difference)
 */
function example3() {
  console.log('Generating Example 3: Full character set...')

  const fontPath = '/System/Library/Fonts/Supplemental/Arial.ttf'
  if (!fs.existsSync(fontPath)) {
    console.log('  ⚠️  Arial font not found, skipping')
    return
  }

  const doc = new PDFDocument()

  doc.text('Full Character Set Usage', 100, 750, 24)

  doc.registerFont({
    name: 'Arial',
    source: fontPath,
    subset: true
  })

  doc.useFont('Arial')

  doc.text('This document uses many different characters:', 100, 720, 12)
  doc.text('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 100, 695, 12)
  doc.text('abcdefghijklmnopqrstuvwxyz', 100, 675, 12)
  doc.text('0123456789', 100, 655, 12)
  doc.text('!@#$%^&*()-_=+[]{}|;:,.<>?/', 100, 635, 12)
  doc.text('The quick brown fox jumps over the lazy dog', 100, 610, 12)
  doc.text('Pack my box with five dozen liquor jugs', 100, 590, 12)
  doc.text('Sphinx of black quartz, judge my vow', 100, 570, 12)

  doc.useBaseFont('Courier')
  doc.text('', 100, 530, 10)
  doc.text('This document uses ~95 unique characters.', 100, 530, 10)
  doc.text('With subsetting: ~95 glyphs embedded (~4.8% of full font)', 100, 515, 10)
  doc.text('Potential file size reduction: ~95.2%', 100, 500, 10)

  doc.save(path.join(outputDir, 'optimization-3-fullset.pdf'))
  console.log('  > Saved: optimization-3-fullset.pdf')
}

/**
 * Example 4: Side-by-side comparison
 */
function example4() {
  console.log('Generating Example 4: Optimization comparison...')

  const fontPath = '/System/Library/Fonts/Supplemental/Georgia.ttf'
  if (!fs.existsSync(fontPath)) {
    console.log('  ⚠️  Georgia font not found, skipping')
    return
  }

  const doc = new PDFDocument()

  doc.text('Font Optimization Summary', 100, 750, 24)

  doc.text('Current Implementation:', 100, 710, 16)
  doc.text('- Full font embedding (all glyphs)', 120, 690, 12)
  doc.text('- ToUnicode CMap generation (for text selection)', 120, 670, 12)
  doc.text('- Character usage tracking', 120, 650, 12)
  doc.text('- FlateDecode compression', 120, 630, 12)

  doc.text('File Sizes:', 100, 590, 16)
  doc.text('- Standard PDF fonts: 0 KB (built into PDF viewers)', 120, 570, 12)
  doc.text('- Custom font (full, compressed): 400-1000 KB', 120, 550, 12)
  doc.text('- Custom font (future subsetting): 20-50 KB estimated', 120, 530, 12)

  doc.registerFont({ name: 'Georgia', source: fontPath })
  doc.useFont('Georgia')

  doc.text('Benefits of Current Implementation:', 100, 480, 16)
  doc.text('+ Full Unicode support (all characters available)', 120, 460, 11)
  doc.text('+ Perfect text selection and copy-paste', 120, 443, 11)
  doc.text('+ Character tracking ready for future subsetting', 120, 426, 11)
  doc.text('+ Compatible with all PDF viewers', 120, 409, 11)

  doc.useBaseFont('Courier')
  doc.text('Future Optimization (Subsetting):', 100, 360, 14)
  doc.text('When implemented, subsetting could reduce file sizes by 70-99%', 120, 340, 10)
  doc.text('by only embedding glyphs actually used in the document.', 120, 327, 10)

  doc.save(path.join(outputDir, 'optimization-4-summary.pdf'))
  console.log('  > Saved: optimization-4-summary.pdf')
}

// Run all examples
console.log('\n=== PDFStudio Font Optimizations Examples ===\n')

example1()
example2()
example3()
example4()

console.log('\n=== Font optimization examples generated! ===')
console.log(`Output directory: ${outputDir}`)
console.log('\nOptimizations included:')
console.log('  ✅ ToUnicode CMap - Better text selection')
console.log('  ✅ Character tracking - Ready for subsetting')
console.log('  ✅ FlateDecode compression')
console.log('  ⏳ Font subsetting - Future enhancement\n')
