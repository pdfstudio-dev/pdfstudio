import { PDFDocument } from '../src/core/PDFDocument'
import * as path from 'path'
import * as fs from 'fs'

const outputDir = path.join(__dirname, 'output')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

console.log('Testing transformation syntax...\n')

// Test 1: Simple transformation without text
console.log('Test 1: Simple square with transformation...')
const doc1 = new PDFDocument()

doc1.text('Test 1: Simple Transformation', 100, 750, 16)

doc1.saveGraphicsState()
doc1.translate(200, 500)
doc1.rotate(45)
doc1.setStrokeColor(0.8, 0.2, 0.4)
doc1.setLineWidth(2)
doc1.rect(-50, -50, 100, 100)
doc1.stroke()
doc1.restoreGraphicsState()

doc1.save(path.join(outputDir, 'transform-test-1.pdf'))
console.log('  ✓ Saved: transform-test-1.pdf\n')

// Test 2: Transformation without rotation (identity matrix)
console.log('Test 2: Translation only (no rotation)...')
const doc2 = new PDFDocument()

doc2.text('Test 2: Translation Only', 100, 750, 16)

doc2.saveGraphicsState()
doc2.translate(200, 500)
doc2.setStrokeColor(0.2, 0.8, 0.4)
doc2.setLineWidth(2)
doc2.rect(-50, -50, 100, 100)
doc2.stroke()
doc2.restoreGraphicsState()

doc2.save(path.join(outputDir, 'transform-test-2.pdf'))
console.log('  ✓ Saved: transform-test-2.pdf\n')

// Test 3: Text AFTER transformation context (not inside)
console.log('Test 3: Text outside transformation context...')
const doc3 = new PDFDocument()

doc3.text('Test 3: Safe Text Placement', 100, 750, 16)

doc3.saveGraphicsState()
doc3.translate(200, 500)
doc3.rotate(45)
doc3.setStrokeColor(0.4, 0.2, 0.8)
doc3.setLineWidth(2)
doc3.rect(-50, -50, 100, 100)
doc3.stroke()
doc3.restoreGraphicsState()

// Text AFTER restoring state
doc3.text('Label (no transform)', 150, 400, 12)

doc3.save(path.join(outputDir, 'transform-test-3.pdf'))
console.log('  ✓ Saved: transform-test-3.pdf\n')

console.log('✅ All tests complete!')
console.log('Check these PDFs in Acrobat to see which ones have errors\n')
