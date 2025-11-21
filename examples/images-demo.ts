import { PDFDocument } from '../src'

console.log('🖼️  Generating PDFs with images...\\n')

// NOTE: This example uses test PNG images
// Run first: npx ts-node examples/create-test-image-png.ts
// Or use your own JPEG/PNG images

const imagePath = 'examples/test-image.png'

try {
  // ======================
  // Example 1: Original size image
  // ======================
  console.log('1️⃣ Original size image...')

  const doc1 = new PDFDocument({
    size: 'Letter',
    margins: 50
  })

  doc1.text('IMAGEN TAMAÑO ORIGINAL', 100, 700, 20)
  doc1.text('The image is shown at its real size', 100, 670, 12)

  // Imagen en size original en posición (100, 400)
  doc1.image(imagePath, 100, 400)

  doc1.save('examples-output/images-01-original.pdf')
  console.log('   ✅ examples-output/images-01-original.pdf\\n')

  // ======================
  // Example 2: Scale by factor
  // ======================
  console.log('2️⃣ Scale by factor...')

  const doc2 = new PDFDocument({
    size: 'Letter',
    margins: 50
  })

  doc2.text('ESCALAR IMÁGENES', 200, 700, 20)

  doc2.text('Original (100%)', 100, 600, 12)
  doc2.image(imagePath, 100, 500, { scale: 1.0 })

  doc2.text('50% más pequeña', 350, 600, 12)
  doc2.image(imagePath, 350, 500, { scale: 0.5 })

  doc2.text('25% del size', 100, 300, 12)
  doc2.image(imagePath, 100, 200, { scale: 0.25 })

  doc2.save('examples-output/images-02-scale.pdf')
  console.log('   ✅ examples-output/images-02-scale.pdf\\n')

  // ======================
  // Example 3: Ancho y alto específicos
  // ======================
  console.log('3️⃣ Specific dimensions...')

  const doc3 = new PDFDocument({
    size: 'Letter',
    margins: 50
  })

  doc3.text('DIMENSIONES ESPECÍFICAS', 160, 700, 20)

  doc3.text('Width: 200px (maintains aspect)', 100, 600, 12)
  doc3.image(imagePath, 100, 450, { width: 200 })

  doc3.text('Height: 150px (maintains aspect)', 350, 600, 12)
  doc3.image(imagePath, 350, 450, { height: 150 })

  doc3.text('200x100 (may distort)', 100, 300, 12)
  doc3.image(imagePath, 100, 200, { width: 200, height: 100 })

  doc3.save('examples-output/images-03-dimensions.pdf')
  console.log('   ✅ examples-output/images-03-dimensions.pdf\\n')

  // ======================
  // Example 4: Fit (fit within bounds)
  // ======================
  console.log('4️⃣ Fit (fit within bounds)...')

  const doc4 = new PDFDocument({
    size: 'Letter',
    margins: 50
  })

  doc4.text('FIT - AJUSTAR DENTRO DE LÍMITES', 140, 700, 20)
  doc4.text('La imagen se ajusta dentro del área sin distorsión', 100, 670, 12)

  // Dibujar marco de referencia
  doc4.setStrokeColor(0.8, 0.8, 0.8)
  doc4.setLineWidth(1)
  doc4.rect(100, 400, 200, 200)
  doc4.stroke()

  doc4.text('Fit 200x200 (izquierda, arriba)', 100, 380, 10)
  doc4.image(imagePath, 100, 400, {
    fit: [200, 200],
    align: 'left',
    valign: 'top'
  })

  // Segundo marco
  doc4.rect(350, 400, 200, 200)
  doc4.stroke()

  doc4.text('Fit 200x200 (centro)', 350, 380, 10)
  doc4.image(imagePath, 350, 400, {
    fit: [200, 200],
    align: 'center',
    valign: 'center'
  })

  doc4.save('examples-output/images-04-fit.pdf')
  console.log('   ✅ examples-output/images-04-fit.pdf\\n')

  // ======================
  // Example 5: Cover (cubrir área, puede recortar)
  // ======================
  console.log('5️⃣ Cover (cover entire area)...')

  const doc5 = new PDFDocument({
    size: 'Letter',
    margins: 50
  })

  doc5.text('COVER - CUBRIR ÁREA COMPLETA', 140, 700, 20)
  doc5.text('La imagen cubre toda el área, puede recortarse', 100, 670, 12)

  // Marco de referencia
  doc5.setStrokeColor(0.8, 0.8, 0.8)
  doc5.setLineWidth(1)
  doc5.rect(100, 400, 400, 200)
  doc5.stroke()

  doc5.text('Cover 400x200 (centrado)', 100, 380, 10)
  doc5.image(imagePath, 100, 400, {
    cover: [400, 200],
    align: 'center',
    valign: 'center'
  })

  doc5.save('examples-output/images-05-cover.pdf')
  console.log('   ✅ examples-output/images-05-cover.pdf\\n')

  // ======================
  // Example 6: Multiple images
  // ======================
  console.log('6️⃣ Multiple images en una page...')

  const doc6 = new PDFDocument({
    size: 'Letter',
    margins: 50
  })

  doc6.text('GALERÍA DE IMÁGENES', 200, 720, 20)

  // Grid 3x2
  const gridWidth = 150
  const gridHeight = 150
  const startX = 70
  const startY = 550
  const gapX = 20
  const gapY = 20

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 2; col++) {
      const x = startX + col * (gridWidth + gapX)
      const y = startY - row * (gridHeight + gapY)

      // Borde
      doc6.setStrokeColor(0.9, 0.9, 0.9)
      doc6.setLineWidth(0.5)
      doc6.rect(x, y, gridWidth, gridHeight)
      doc6.stroke()

      // Imagen
      doc6.image(imagePath, x, y, {
        fit: [gridWidth, gridHeight],
        align: 'center',
        valign: 'center'
      })
    }
  }

  doc6.save('examples-output/images-06-gallery.pdf')
  console.log('   ✅ examples-output/images-06-gallery.pdf\\n')

  // ======================
  // Example 7: Image with text
  // ======================
  console.log('7️⃣ Combining images and text...')

  const doc7 = new PDFDocument({
    size: 'Letter',
    margins: 60
  })

  doc7.text('REPORT WITH IMAGE', 200, 720, 22)

  // Image at the top
  doc7.image(imagePath, 150, 550, {
    fit: [300, 150],
    align: 'center',
    valign: 'center'
  })

  // Text below image
  doc7.text('Figure 1: Sample image', 230, 530, 10)

  doc7.text('Document description', 100, 490, 14)

  doc7.text('This is an example of how to combine images', 100, 460, 12)
  doc7.text('with text in a PDF document. PDFStudio allows', 100, 440, 12)
  doc7.text('inserting JPEG and PNG images with multiple options', 100, 420, 12)
  doc7.text('for scaling and positioning.', 100, 400, 12)

  doc7.text('', 100, 380)
  doc7.text('Features:', 100, 360, 12)
  doc7.text('• Support for JPEG and PNG', 120, 335, 11)
  doc7.text('• Proportional scaling', 120, 315, 11)
  doc7.text('• Fit and Cover modes', 120, 295, 11)
  doc7.text('• Flexible alignment', 120, 275, 11)
  doc7.text('• Multiple images per page', 120, 255, 11)

  doc7.save('examples-output/images-07-with-text.pdf')
  console.log('   ✅ examples-output/images-07-with-text.pdf\\n')

  // ======================
  // Summary
  // ======================
  console.log('✅ All image examples generated!\\n')
  console.log('📁 Files generated:')
  console.log('   • images-01-original.pdf')
  console.log('   • images-02-scale.pdf')
  console.log('   • images-03-dimensions.pdf')
  console.log('   • images-04-fit.pdf')
  console.log('   • images-05-cover.pdf')
  console.log('   • images-06-gallery.pdf')
  console.log('   • images-07-with-text.pdf\\n')

  console.log('🖼️  Implemented features:')
  console.log('   ✓ JPEG support')
  console.log('   ✓ Original size')
  console.log('   ✓ Scale by factor (scale)')
  console.log('   ✓ Specific dimensions (width, height)')
  console.log('   ✓ Fit (fit within bounds)')
  console.log('   ✓ Cover (cover entire area)')
  console.log('   ✓ Alignment (align, valign)')
  console.log('   ✓ Multiple images per page\\n')

  console.log('💡 To test:')
  console.log('   1. Place a JPEG image at examples/test-image.jpg')
  console.log('   2. Run: npx ts-node examples/images-demo.ts')
  console.log('   3. Open the generated PDFs in examples-output/\\n')

} catch (error) {
  if (error instanceof Error && error.message.includes('ENOENT')) {
    console.error('❌ Error: Test image not found')
    console.error('\\nTo run this example:')
    console.error('  1. Copy a JPEG image to: examples/test-image.jpg')
    console.error('  2. Or modify the imagePath variable in the code\\n')
  } else {
    console.error('❌ Error:', error)
  }
}
