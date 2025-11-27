import { PDFDocument } from '../src'

/**
 * Test all new PDFKit compatibility features (v0.3.0)
 */
async function testNewFeatures() {
  const doc = new PDFDocument({
    size: 'A4',
    margins: 50
  })

  // Test 1: moveDown() and moveUp()
  console.log('Testing moveDown() and moveUp()...')
  doc.text('Line 1', 100, 750, 14)
    .moveDown()
    .text('Line 2 (moved down 1 line)', 100, doc.getCurrentY(), 12)
    .moveDown(2)
    .text('Line 4 (moved down 2 more lines)', 100, doc.getCurrentY(), 12)
    .moveUp(1)
    .text('Line 3 (moved back up 1 line)', 300, doc.getCurrentY(), 12)

  // Test 2: roundedRect()
  console.log('Testing roundedRect()...')
  doc.roundedRect(100, 650, 200, 80, 15)
    .stroke()
  doc.roundedRect(320, 650, 200, 80, [20, 10])  // Different X/Y radii
    .setFillColor(0.2, 0.6, 0.86)
    .setStrokeColor(0.17, 0.24, 0.31)
    .fillAndStroke()

  // Test 3: Text rotation
  console.log('Testing text rotation...')
  doc.text('Rotated 45°', 100, 550, 12, { rotation: 45 })
  doc.text('Rotated 90°', 250, 550, 12, { rotation: 90 })
  doc.text('Rotated -30°', 350, 550, 12, { rotation: -30 })

  // Test 4: Multi-column text
  console.log('Testing columns...')
  const loremText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

  doc.text(loremText, 100, 480, 10, {
    width: 400,
    height: 120,
    columns: 2,
    columnGap: 20,
    align: 'justify'
  })

  // Test 5: Bulleted lists
  console.log('Testing bulleted lists...')
  doc.text('Bulleted List:', 100, 340, 12, 'Helvetica-Bold')
    .moveDown()

  doc.list([
    'First item with a bullet',
    'Second item with a bullet',
    'Third item with a bullet that wraps to multiple lines because it is very long'
  ], 100, doc.getCurrentY() - 5, {
    bulletStyle: 'disc',
    fontSize: 11,
    width: 200
  })

  // Test 6: Numbered list
  doc.text('Numbered List:', 320, 340, 12, 'Helvetica-Bold')
    .moveDown()

  doc.list([
    'First step',
    'Second step',
    'Third step',
    'Fourth step'
  ], 320, doc.getCurrentY() - 5, {
    bulletStyle: 'decimal',
    fontSize: 11
  })

  // Test 7: Different list styles
  doc.addPage()
  doc.text('List Styles Showcase', 100, 750, 16, 'Helvetica-Bold')
    .moveDown(2)

  const listItems = ['Alpha', 'Beta', 'Gamma', 'Delta']
  let currentY = doc.getCurrentY()

  // Disc bullets
  doc.text('Disc:', 100, currentY, 12, 'Helvetica-Bold')
  doc.list(listItems, 100, currentY - 20, { bulletStyle: 'disc', fontSize: 10 })

  // Decimal
  doc.text('Decimal:', 250, currentY, 12, 'Helvetica-Bold')
  doc.list(listItems, 250, currentY - 20, { bulletStyle: 'decimal', fontSize: 10 })

  // Lower alpha
  doc.text('Lower Alpha:', 100, currentY - 120, 12, 'Helvetica-Bold')
  doc.list(listItems, 100, currentY - 140, { bulletStyle: 'lower-alpha', fontSize: 10 })

  // Upper Roman
  doc.text('Upper Roman:', 250, currentY - 120, 12, 'Helvetica-Bold')
  doc.list(listItems, 250, currentY - 140, { bulletStyle: 'upper-roman', fontSize: 10 })

  // Custom bullet
  doc.text('Custom (★):', 100, currentY - 240, 12, 'Helvetica-Bold')
  doc.list(listItems, 100, currentY - 260, { bulletStyle: '★', fontSize: 10 })

  // Test 8: goTo and destination
  doc.text('Click here to go to Page 1', 100, 500, 12, {
    goTo: 'page1-section1'
  })
  doc.setStrokeColor(0, 0, 1)
  doc.rect(100, 500 - 2, 170, 14).stroke()

  // Create destination on page 1
  doc.switchToPage(0)
  doc.text('', 100, 600, 12, { destination: 'page1-section1' })
  doc.text('<-- You jumped here!', 120, 600, 12)

  // Save PDF
  await doc.save('examples-output/test-new-features.pdf')
  console.log('✅ PDF created successfully: examples-output/test-new-features.pdf')
}

testNewFeatures().catch(console.error)
