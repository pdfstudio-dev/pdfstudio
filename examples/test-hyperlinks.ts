import { PDFDocument } from '../src/core/PDFDocument'
import * as path from 'path'
import * as fs from 'fs'

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'output')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

/**
 * Example 1: Simple external links (URLs)
 */
function example1() {
  console.log('Generating Example 1: Simple external links...')

  const doc = new PDFDocument()

  doc.text('External Hyperlinks Demo', 100, 750, 24)
  doc.text('Click on the links below to visit external websites:', 100, 720, 12)

  // Link 1: Google
  doc.text('Google', 100, 680, 14)
  doc.addExternalLink({
    url: 'https://www.google.com',
    x: 100,
    y: 675,
    width: 60,
    height: 18
  })

  // Link 2: GitHub
  doc.text('GitHub', 100, 650, 14)
  doc.addExternalLink({
    url: 'https://www.github.com',
    x: 100,
    y: 645,
    width: 60,
    height: 18
  })

  // Link 3: Mozilla
  doc.text('Mozilla', 100, 620, 14)
  doc.addExternalLink({
    url: 'https://www.mozilla.org',
    x: 100,
    y: 615,
    width: 80,
    height: 18
  })

  doc.save(path.join(outputDir, 'hyperlinks-1-external.pdf'))
  console.log('  > Saved: hyperlinks-1-external.pdf')
}

/**
 * Example 2: Internal links (page navigation)
 */
function example2() {
  console.log('Generating Example 2: Internal page navigation...')

  const doc = new PDFDocument()

  // Page 1 - Table of Contents
  doc.text('Table of Contents', 100, 750, 24)
  doc.text('Click to jump to each section:', 100, 720, 12)

  doc.text('1. Introduction (Page 2)', 120, 680, 14)
  doc.addInternalLink({
    targetPage: 1,
    x: 120,
    y: 675,
    width: 180,
    height: 18
  })

  doc.text('2. Features (Page 3)', 120, 650, 14)
  doc.addInternalLink({
    targetPage: 2,
    x: 120,
    y: 645,
    width: 160,
    height: 18
  })

  doc.text('3. Conclusion (Page 4)', 120, 620, 14)
  doc.addInternalLink({
    targetPage: 3,
    x: 120,
    y: 615,
    width: 180,
    height: 18
  })

  // Page 2 - Introduction
  doc.addPage()
  doc.text('1. Introduction', 100, 750, 20)
  doc.text('This is the introduction section.', 100, 720, 12)
  doc.text('Welcome to PDFStudio hyperlinks!', 100, 700, 12)

  doc.text('Back to Table of Contents', 100, 100, 12)
  doc.addInternalLink({
    targetPage: 0,
    x: 100,
    y: 95,
    width: 180,
    height: 18
  })

  // Page 3 - Features
  doc.addPage()
  doc.text('2. Features', 100, 750, 20)
  doc.text('PDFStudio supports many features:', 100, 720, 12)
  doc.text('- External links (URLs)', 120, 700, 11)
  doc.text('- Internal links (page navigation)', 120, 680, 11)
  doc.text('- Custom link styling', 120, 660, 11)

  doc.text('Back to Table of Contents', 100, 100, 12)
  doc.addInternalLink({
    targetPage: 0,
    x: 100,
    y: 95,
    width: 180,
    height: 18
  })

  // Page 4 - Conclusion
  doc.addPage()
  doc.text('3. Conclusion', 100, 750, 20)
  doc.text('Thank you for exploring PDFStudio hyperlinks!', 100, 720, 12)

  doc.text('Back to Table of Contents', 100, 100, 12)
  doc.addInternalLink({
    targetPage: 0,
    x: 100,
    y: 95,
    width: 180,
    height: 18
  })

  doc.save(path.join(outputDir, 'hyperlinks-2-internal.pdf'))
  console.log('  > Saved: hyperlinks-2-internal.pdf')
}

/**
 * Example 3: Links with visible borders
 */
function example3() {
  console.log('Generating Example 3: Links with visible borders...')

  const doc = new PDFDocument()

  doc.text('Links with Visible Borders', 100, 750, 24)
  doc.text('These links have visible borders:', 100, 720, 12)

  // Blue border link
  doc.text('Blue Border Link', 100, 680, 14)
  doc.addExternalLink({
    url: 'https://www.example.com',
    x: 100,
    y: 675,
    width: 130,
    height: 18,
    border: {
      width: 2,
      color: [0, 0, 1]  // Blue
    }
  })

  // Red border link
  doc.text('Red Border Link', 100, 640, 14)
  doc.addExternalLink({
    url: 'https://www.example.com',
    x: 100,
    y: 635,
    width: 120,
    height: 18,
    border: {
      width: 2,
      color: [1, 0, 0]  // Red
    }
  })

  // Green border link
  doc.text('Green Border Link', 100, 600, 14)
  doc.addExternalLink({
    url: 'https://www.example.com',
    x: 100,
    y: 595,
    width: 140,
    height: 18,
    border: {
      width: 3,
      color: [0, 0.8, 0]  // Green
    }
  })

  doc.save(path.join(outputDir, 'hyperlinks-3-borders.pdf'))
  console.log('  > Saved: hyperlinks-3-borders.pdf')
}

/**
 * Example 4: Different highlight modes
 */
function example4() {
  console.log('Generating Example 4: Different highlight modes...')

  const doc = new PDFDocument()

  doc.text('Link Highlight Modes', 100, 750, 24)
  doc.text('Click each link to see different visual effects:', 100, 720, 12)

  // None (no highlight)
  doc.text('No Highlight', 100, 680, 14)
  doc.addExternalLink({
    url: 'https://www.example.com',
    x: 100,
    y: 675,
    width: 100,
    height: 18,
    highlight: 'none'
  })

  // Invert (default)
  doc.text('Invert Highlight', 100, 640, 14)
  doc.addExternalLink({
    url: 'https://www.example.com',
    x: 100,
    y: 635,
    width: 120,
    height: 18,
    highlight: 'invert'
  })

  // Outline
  doc.text('Outline Highlight', 100, 600, 14)
  doc.addExternalLink({
    url: 'https://www.example.com',
    x: 100,
    y: 595,
    width: 140,
    height: 18,
    highlight: 'outline'
  })

  // Push
  doc.text('Push Highlight', 100, 560, 14)
  doc.addExternalLink({
    url: 'https://www.example.com',
    x: 100,
    y: 555,
    width: 120,
    height: 18,
    highlight: 'push'
  })

  doc.save(path.join(outputDir, 'hyperlinks-4-highlights.pdf'))
  console.log('  > Saved: hyperlinks-4-highlights.pdf')
}

/**
 * Example 5: Advanced page navigation with fit modes
 */
function example5() {
  console.log('Generating Example 5: Advanced page navigation...')

  const doc = new PDFDocument()

  // Page 1
  doc.text('Advanced Page Navigation', 100, 750, 24)
  doc.text('Different ways to navigate to pages:', 100, 720, 12)

  doc.text('Fit entire page (default)', 120, 680, 14)
  doc.addInternalLink({
    targetPage: 1,
    fit: 'Fit',
    x: 120,
    y: 675,
    width: 180,
    height: 18
  })

  doc.text('Fit page width', 120, 640, 14)
  doc.addInternalLink({
    targetPage: 1,
    fit: 'FitH',
    top: 700,
    x: 120,
    y: 635,
    width: 120,
    height: 18
  })

  doc.text('Fit page height', 120, 600, 14)
  doc.addInternalLink({
    targetPage: 1,
    fit: 'FitV',
    left: 100,
    x: 120,
    y: 595,
    width: 130,
    height: 18
  })

  doc.text('Go to specific position with zoom', 120, 560, 14)
  doc.addInternalLink({
    targetPage: 1,
    fit: 'XYZ',
    left: 100,
    top: 600,
    zoom: 1.5,
    x: 120,
    y: 555,
    width: 240,
    height: 18
  })

  // Page 2 - Target page
  doc.addPage()
  doc.text('Target Page', 100, 750, 24)
  doc.text('You navigated to this page using an internal link!', 100, 720, 12)
  doc.text('Notice how different fit modes affect the view.', 100, 700, 12)

  doc.text('Back to first page', 100, 100, 12)
  doc.addInternalLink({
    targetPage: 0,
    x: 100,
    y: 95,
    width: 140,
    height: 18
  })

  doc.save(path.join(outputDir, 'hyperlinks-5-advanced-nav.pdf'))
  console.log('  > Saved: hyperlinks-5-advanced-nav.pdf')
}

/**
 * Example 6: Mixed links (external + internal)
 */
function example6() {
  console.log('Generating Example 6: Mixed links...')

  const doc = new PDFDocument()

  // Page 1 - Resources
  doc.text('Useful Resources', 100, 750, 24)
  doc.text('External links:', 100, 720, 14)

  doc.text('PDF Specification', 120, 690, 12)
  doc.addExternalLink({
    url: 'https://www.adobe.com/devnet/pdf/pdf_reference.html',
    x: 120,
    y: 685,
    width: 130,
    height: 16
  })

  doc.text('TypeScript Documentation', 120, 660, 12)
  doc.addExternalLink({
    url: 'https://www.typescriptlang.org/docs/',
    x: 120,
    y: 655,
    width: 180,
    height: 16
  })

  doc.text('', 100, 630, 12)
  doc.text('Internal navigation:', 100, 610, 14)

  doc.text('See Examples (Page 2)', 120, 580, 12)
  doc.addInternalLink({
    targetPage: 1,
    x: 120,
    y: 575,
    width: 160,
    height: 16
  })

  // Page 2 - Examples
  doc.addPage()
  doc.text('Examples', 100, 750, 24)
  doc.text('This page contains examples.', 100, 720, 12)

  doc.text('Back to Resources', 100, 100, 12)
  doc.addInternalLink({
    targetPage: 0,
    x: 100,
    y: 95,
    width: 140,
    height: 16
  })

  doc.save(path.join(outputDir, 'hyperlinks-6-mixed.pdf'))
  console.log('  > Saved: hyperlinks-6-mixed.pdf')
}

/**
 * Example 7: Email and tel links
 */
function example7() {
  console.log('Generating Example 7: Email and phone links...')

  const doc = new PDFDocument()

  doc.text('Contact Information', 100, 750, 24)
  doc.text('Click to contact us:', 100, 720, 12)

  doc.text('Email: support@example.com', 120, 680, 14)
  doc.addExternalLink({
    url: 'mailto:support@example.com',
    x: 120,
    y: 675,
    width: 220,
    height: 18
  })

  doc.text('Phone: +1 (555) 123-4567', 120, 640, 14)
  doc.addExternalLink({
    url: 'tel:+15551234567',
    x: 120,
    y: 635,
    width: 200,
    height: 18
  })

  doc.text('Website: www.example.com', 120, 600, 14)
  doc.addExternalLink({
    url: 'https://www.example.com',
    x: 120,
    y: 595,
    width: 200,
    height: 18
  })

  doc.save(path.join(outputDir, 'hyperlinks-7-contact.pdf'))
  console.log('  > Saved: hyperlinks-7-contact.pdf')
}

// Run all examples
console.log('\n=== PDFStudio Hyperlinks Examples ===\n')

example1()
example2()
example3()
example4()
example5()
example6()
example7()

console.log('\n=== All hyperlink examples generated successfully! ===')
console.log(`Output directory: ${outputDir}\n`)
