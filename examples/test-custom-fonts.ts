import { PDFDocument } from '../src/core/PDFDocument'
import * as path from 'path'
import * as fs from 'fs'

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'output')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

/**
 * Example 1: Basic custom font usage
 */
function example1() {
  console.log('Generating Example 1: Basic custom font...')

  // Find available system fonts
  const fontPaths = [
    '/System/Library/Fonts/Helvetica.ttc',
    '/System/Library/Fonts/SFNS.ttf',
    '/System/Library/Fonts/NewYork.ttf',
    '/System/Library/Fonts/Supplemental/Arial.ttf',
    '/System/Library/Fonts/Supplemental/Comic Sans MS.ttf',
    '/System/Library/Fonts/Supplemental/Courier New.ttf',
    '/System/Library/Fonts/Supplemental/Georgia.ttf',
    '/System/Library/Fonts/Supplemental/Times New Roman.ttf',
    '/System/Library/Fonts/Supplemental/Verdana.ttf',
    '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    '/Windows/Fonts/arial.ttf',
    '/Windows/Fonts/times.ttf'
  ]

  let fontPath: string | null = null
  for (const path of fontPaths) {
    if (fs.existsSync(path)) {
      fontPath = path
      break
    }
  }

  if (!fontPath) {
    console.log('  ⚠️  No system fonts found, skipping example 1')
    return
  }

  console.log(`  Using font: ${fontPath}`)

  const doc = new PDFDocument()

  doc.text('Custom Fonts Example', 100, 750, 24)
  doc.text('Comparison between standard and custom fonts', 100, 720, 12)

  // Standard font (Helvetica)
  doc.text('Standard Font (Helvetica):', 100, 680, 16)
  doc.text('This text uses the standard Helvetica font included in PDF.', 100, 660, 12)
  doc.text('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 100, 640, 14)
  doc.text('abcdefghijklmnopqrstuvwxyz', 100, 620, 14)
  doc.text('0123456789 !@#$%^&*()', 100, 600, 14)

  // Register and use custom font
  doc.registerFont({
    name: 'CustomFont',
    source: fontPath,
    subset: false
  })

  doc.useFont('CustomFont')

  doc.text('Custom Font (TrueType):', 100, 560, 16)
  doc.text('This text uses a custom TrueType font loaded from the system.', 100, 540, 12)
  doc.text('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 100, 520, 14)
  doc.text('abcdefghijklmnopqrstuvwxyz', 100, 500, 14)
  doc.text('0123456789 !@#$%^&*()', 100, 480, 14)

  // Switch back to standard font
  doc.useBaseFont('Times-Roman')
  doc.text('Back to Standard Font (Times-Roman):', 100, 440, 16)
  doc.text('You can switch between custom and standard fonts anytime.', 100, 420, 12)

  doc.save(path.join(outputDir, 'fonts-1-basic.pdf'))
  console.log('  > Saved: fonts-1-basic.pdf')
}

/**
 * Example 2: Multiple custom fonts
 */
function example2() {
  console.log('Generating Example 2: Multiple custom fonts...')

  // Find two different fonts
  const fontPaths = [
    { path: '/System/Library/Fonts/Supplemental/Arial.ttf', name: 'Arial' },
    { path: '/System/Library/Fonts/Supplemental/Times New Roman.ttf', name: 'Times' },
    { path: '/System/Library/Fonts/Supplemental/Verdana.ttf', name: 'Verdana' },
    { path: '/System/Library/Fonts/Supplemental/Georgia.ttf', name: 'Georgia' },
    { path: '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf', name: 'Liberation' }
  ]

  const availableFonts = fontPaths.filter(f => fs.existsSync(f.path))

  if (availableFonts.length < 2) {
    console.log('  ⚠️  Need at least 2 fonts, skipping example 2')
    return
  }

  const doc = new PDFDocument()

  doc.text('Multiple Custom Fonts', 100, 750, 24)
  doc.text('Using different custom fonts in the same document', 100, 720, 12)

  // Register multiple fonts
  availableFonts.forEach((fontInfo, index) => {
    doc.registerFont({
      name: `Font${index + 1}`,
      source: fontInfo.path,
      subset: false
    })
  })

  let currentY = 680

  // Use each font
  availableFonts.forEach((fontInfo, index) => {
    doc.useFont(`Font${index + 1}`)
    doc.text(`Font ${index + 1} (${fontInfo.name}):`, 100, currentY, 14)
    currentY -= 25
    doc.text('The quick brown fox jumps over the lazy dog', 100, currentY, 12)
    currentY -= 25
    doc.text('Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 100, currentY, 11)
    currentY -= 40
  })

  doc.save(path.join(outputDir, 'fonts-2-multiple.pdf'))
  console.log('  > Saved: fonts-2-multiple.pdf')
  console.log(`  > Used ${availableFonts.length} different custom fonts`)
}

/**
 * Example 3: Font sizes
 */
function example3() {
  console.log('Generating Example 3: Font sizes...')

  const fontPath = '/System/Library/Fonts/Supplemental/Arial.ttf'
  if (!fs.existsSync(fontPath)) {
    console.log('  ⚠️  Arial font not found, skipping example 3')
    return
  }

  const doc = new PDFDocument()

  doc.registerFont({
    name: 'Arial',
    source: fontPath,
    subset: false
  })

  doc.useFont('Arial')

  doc.text('Custom Font Sizes', 100, 750, 28)

  const sizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36]
  let currentY = 710

  sizes.forEach(size => {
    doc.text(`Font size ${size}pt: The quick brown fox`, 100, currentY, size)
    currentY -= size + 10
  })

  doc.save(path.join(outputDir, 'fonts-3-sizes.pdf'))
  console.log('  > Saved: fonts-3-sizes.pdf')
}

/**
 * Example 4: Mixing standard and custom fonts
 */
function example4() {
  console.log('Generating Example 4: Mixing fonts...')

  const fontPath = '/System/Library/Fonts/Supplemental/Georgia.ttf'
  if (!fs.existsSync(fontPath)) {
    console.log('  ⚠️  Georgia font not found, using alternative')
    // Try alternative
    const alt = '/System/Library/Fonts/Helvetica.ttc'
    if (!fs.existsSync(alt)) {
      console.log('  ⚠️  No fonts available, skipping example 4')
      return
    }
  }

  const doc = new PDFDocument()

  // Register custom font
  if (fs.existsSync(fontPath)) {
    doc.registerFont({
      name: 'Georgia',
      source: fontPath,
      subset: false
    })
  }

  doc.text('Document with Mixed Fonts', 100, 750, 24)

  // Heading with standard bold font
  doc.useBaseFont('Helvetica-Bold')
  doc.text('Chapter 1: Introduction', 100, 710, 18)

  // Body with custom font
  if (fs.existsSync(fontPath)) {
    doc.useFont('Georgia')
  } else {
    doc.useBaseFont('Times-Roman')
  }
  doc.text('This is the introduction paragraph using a custom serif font.', 100, 685, 12)
  doc.text('Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 100, 670, 12)
  doc.text('Sed do eiusmod tempor incididunt ut labore et dolore magna.', 100, 655, 12)

  // Heading with standard bold font
  doc.useBaseFont('Helvetica-Bold')
  doc.text('Chapter 2: Main Content', 100, 625, 18)

  // Body with custom font
  if (fs.existsSync(fontPath)) {
    doc.useFont('Georgia')
  } else {
    doc.useBaseFont('Times-Roman')
  }
  doc.text('The main content continues with the same custom font.', 100, 600, 12)
  doc.text('Ut enim ad minim veniam, quis nostrud exercitation ullamco.', 100, 585, 12)

  // Code block with monospace
  doc.useBaseFont('Courier')
  doc.text('function example() {', 100, 555, 10)
  doc.text('  return "Hello, World!";', 100, 542, 10)
  doc.text('}', 100, 529, 10)

  doc.save(path.join(outputDir, 'fonts-4-mixed.pdf'))
  console.log('  > Saved: fonts-4-mixed.pdf')
}

// Run all examples
console.log('\n=== PDFStudio Custom Fonts Examples ===\n')

example1()
example2()
example3()
example4()

console.log('\n=== Custom font examples generated! ===')
console.log(`Output directory: ${outputDir}`)
console.log('\nNote: Custom fonts are embedded in the PDF and will display')
console.log('correctly even if the font is not installed on the viewing system.\n')
