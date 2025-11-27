import { PDFDocument, detectUnsupportedChars, substituteUnicode } from '../src'

/**
 * Test automatic Unicode substitution feature
 */
async function testUnicodeSubstitution() {
  console.log('Testing automatic Unicode substitution...\n')

  const doc = new PDFDocument({
    size: 'A4',
    margins: 50
  })

  // Title
  doc.text('Unicode Substitution Test', 100, 750, 20, 'Helvetica-Bold')
  doc.moveDown(2)

  // Test 1: Arrows
  doc.text('1. Arrows (auto-substituted):', 100, doc.getCurrentY(), 14, 'Helvetica-Bold')
  doc.moveDown()

  const arrowText = 'Left ← Right → Up ↑ Down ↓ Both ↔'
  const arrowUnsupported = detectUnsupportedChars(arrowText)
  const arrowSubstituted = substituteUnicode(arrowText)

  doc.text(`Original: ${arrowText}`, 120, doc.getCurrentY(), 11)
  doc.moveDown()
  doc.text(`Unsupported chars: ${arrowUnsupported.join(', ')}`, 120, doc.getCurrentY(), 10, 'Courier')
  doc.moveDown()
  doc.text(`Substituted: ${arrowSubstituted}`, 120, doc.getCurrentY(), 11)
  doc.moveDown(2)

  // Test 2: Bullets
  doc.text('2. Bullets (auto-substituted):', 100, doc.getCurrentY(), 14, 'Helvetica-Bold')
  doc.moveDown()

  const bulletText = 'Bullets: • ◦ ▪ ● ○ ■ □'
  const bulletSubstituted = substituteUnicode(bulletText)

  doc.text(`Original: ${bulletText}`, 120, doc.getCurrentY(), 11)
  doc.moveDown()
  doc.text(`Substituted: ${bulletSubstituted}`, 120, doc.getCurrentY(), 11)
  doc.moveDown(2)

  // Test 3: Quotes
  doc.text('3. Quotation Marks (auto-substituted):', 100, doc.getCurrentY(), 14, 'Helvetica-Bold')
  doc.moveDown()

  const quoteText = 'Quotes: "Hello" \'World\' «French» ‹Single›'
  const quoteSubstituted = substituteUnicode(quoteText)

  doc.text(`Original: ${quoteText}`, 120, doc.getCurrentY(), 11)
  doc.moveDown()
  doc.text(`Substituted: ${quoteSubstituted}`, 120, doc.getCurrentY(), 11)
  doc.moveDown(2)

  // Test 4: Math symbols
  doc.text('4. Math Symbols (auto-substituted):', 100, doc.getCurrentY(), 14, 'Helvetica-Bold')
  doc.moveDown()

  const mathText = 'Math: ≠ ≤ ≥ ≈ ∞ √ ∑ ±'
  const mathSubstituted = substituteUnicode(mathText)

  doc.text(`Original: ${mathText}`, 120, doc.getCurrentY(), 11)
  doc.moveDown()
  doc.text(`Substituted: ${mathSubstituted}`, 120, doc.getCurrentY(), 11)
  doc.moveDown(2)

  // Test 5: Checkmarks
  doc.text('5. Checkmarks & Boxes (auto-substituted):', 100, doc.getCurrentY(), 14, 'Helvetica-Bold')
  doc.moveDown()

  const checkText = 'Checks: ✓ ✔ ✗ ✘ ☑ ☐'
  const checkSubstituted = substituteUnicode(checkText)

  doc.text(`Original: ${checkText}`, 120, doc.getCurrentY(), 11)
  doc.moveDown()
  doc.text(`Substituted: ${checkSubstituted}`, 120, doc.getCurrentY(), 11)
  doc.moveDown(2)

  // Test 6: Stars
  doc.text('6. Stars (auto-substituted):', 100, doc.getCurrentY(), 14, 'Helvetica-Bold')
  doc.moveDown()

  const starText = 'Stars: ★ ☆ ✩ ✪'
  const starSubstituted = substituteUnicode(starText)

  doc.text(`Original: ${starText}`, 120, doc.getCurrentY(), 11)
  doc.moveDown()
  doc.text(`Substituted: ${starSubstituted}`, 120, doc.getCurrentY(), 11)
  doc.moveDown(2)

  // Test 7: Dashes
  doc.text('7. Dashes (auto-substituted):', 100, doc.getCurrentY(), 14, 'Helvetica-Bold')
  doc.moveDown()

  const dashText = 'Dashes: hyphen-minus – en-dash — em-dash'
  const dashSubstituted = substituteUnicode(dashText)

  doc.text(`Original: ${dashText}`, 120, doc.getCurrentY(), 11)
  doc.moveDown()
  doc.text(`Substituted: ${dashSubstituted}`, 120, doc.getCurrentY(), 11)
  doc.moveDown(2)

  // New page for real-world example
  doc.addPage()

  doc.text('Real-World Example', 100, 750, 20, 'Helvetica-Bold')
  doc.moveDown(2)

  // Example with Unicode that gets auto-substituted
  const realWorldText = `Product Review ★★★★☆

"Excellent product!" — John Doe

Features:
• High quality ✓
• Affordable ✓
• Fast shipping →

Price: $99 ≈ €90

Rating: 4/5 ★★★★☆

Available ✓ | Out of stock ✗

Math: x ≥ 0 and x ≤ 100`

  doc.text(realWorldText, 100, doc.getCurrentY(), 11, {
    width: 400,
    lineGap: 3
  })

  // Footer note
  doc.moveDown(3)
  doc.text('Note: All Unicode characters above were automatically substituted', 100, doc.getCurrentY(), 9, 'Helvetica-Oblique')
  doc.text('with WinAnsi-compatible alternatives by PDFStudio!', 100, doc.getCurrentY() - 12, 9, 'Helvetica-Oblique')

  // Save
  await doc.save('examples-output/test-unicode-substitution.pdf')
  console.log('✅ PDF created: examples-output/test-unicode-substitution.pdf')
  console.log('\nAll Unicode characters were automatically substituted!')
}

testUnicodeSubstitution().catch(console.error)
