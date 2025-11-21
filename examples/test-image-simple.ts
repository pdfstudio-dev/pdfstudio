import { PDFDocument } from '../src'

console.log('🧪 Simple image test...\n')

// Create simple PDF with image
const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

doc.text('PNG IMAGE TEST', 200, 720, 24)
doc.text('If you see a blue square below, it works!', 150, 680, 14)

// Add image in center
doc.image('examples/test-image.png', 200, 400, {
  width: 200
})

doc.save('examples-output/test-simple.pdf')

console.log('✅ PDF created: examples-output/test-simple.pdf')
console.log('   Open the file to verify the image displays correctly\n')
