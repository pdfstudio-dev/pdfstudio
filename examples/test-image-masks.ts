import { PDFDocument } from '../src'
import * as fs from 'fs'

console.log('🎭 Testing Image Masks...\n')

// NOTE: This example demonstrates the Image Masks API
// To run this example, you'll need actual image files:
// - base-image.png: The main image
// - mask-image.png: A grayscale mask image (same dimensions)

// Check if example images exist
const hasExampleImages = fs.existsSync('examples/assets/base-image.png') &&
                         fs.existsSync('examples/assets/mask-image.png')

if (!hasExampleImages) {
  console.log('ℹ️  Example images not found.')
  console.log('   To test image masks, create:')
  console.log('   - examples/assets/base-image.png (your main image)')
  console.log('   - examples/assets/mask-image.png (grayscale mask, same size)')
  console.log('\n   The mask determines transparency:')
  console.log('   - Black pixels (0) = transparent')
  console.log('   - White pixels (255) = opaque')
  console.log('   - Gray pixels = semi-transparent\n')
}

// ======================
// Example 1: Luminosity Mask (Soft Mask)
// ======================

const doc1 = new PDFDocument({ size: 'Letter', margins: 50 })

doc1.text('Example 1: Image with Luminosity Mask', 50, 750, 20)
doc1.text('Uses grayscale values to control transparency', 50, 720, 12)

if (hasExampleImages) {
  // Draw image with luminosity mask
  doc1.image('examples/assets/base-image.png', {
    x: 50,
    y: 400,
    width: 300,
    mask: 'examples/assets/mask-image.png',
    maskOptions: {
      type: 'luminosity',
      inverted: false
    }
  })

  doc1.text('Image with luminosity mask applied', 50, 350, 12)
} else {
  doc1.text('WARNING: Example images not found', 50, 600, 14)
  doc1.text('See console for instructions', 50, 580, 12)
}

// Show code example
doc1.text('Code example:', 50, 300, 14)
doc1.setFillColor(0.2, 0.2, 0.2)
doc1.text("doc.image('photo.png', {", 60, 280, 10)
doc1.text("  x: 50, y: 400, width: 300,", 70, 268, 10)
doc1.text("  mask: 'mask.png',", 70, 256, 10)
doc1.text("  maskOptions: {", 70, 244, 10)
doc1.text("    type: 'luminosity',", 80, 232, 10)
doc1.text("    inverted: false", 80, 220, 10)
doc1.text("  }", 70, 208, 10)
doc1.text("})", 60, 196, 10)

doc1.save('examples-output/masks-1-luminosity.pdf')
console.log('✅ Example 1: Luminosity mask created')

// ======================
// Example 2: Inverted Mask
// ======================

const doc2 = new PDFDocument({ size: 'Letter', margins: 50 })

doc2.text('Example 2: Inverted Mask', 50, 750, 20)
doc2.text('Swaps transparent/opaque regions', 50, 720, 12)

if (hasExampleImages) {
  // Draw image with inverted mask
  doc2.image('examples/assets/base-image.png', {
    x: 50,
    y: 400,
    width: 300,
    mask: 'examples/assets/mask-image.png',
    maskOptions: {
      type: 'luminosity',
      inverted: true  // Inverts the mask
    }
  })

  doc2.text('Same mask, but inverted', 50, 350, 12)
} else {
  doc2.text('WARNING: Example images not found', 50, 600, 14)
}

doc2.text('Code example:', 50, 300, 14)
doc2.setFillColor(0.2, 0.2, 0.2)
doc2.text("maskOptions: {", 60, 280, 10)
doc2.text("  type: 'luminosity',", 70, 268, 10)
doc2.text("  inverted: true  // Swap transparent/opaque", 70, 256, 10)
doc2.text("}", 60, 244, 10)

doc2.save('examples-output/masks-2-inverted.pdf')
console.log('✅ Example 2: Inverted mask created')

// ======================
// Example 3: Stencil Mask
// ======================

const doc3 = new PDFDocument({ size: 'Letter', margins: 50 })

doc3.text('Example 3: Stencil Mask (Binary)', 50, 750, 20)
doc3.text('Black/white only, no semi-transparency', 50, 720, 12)

if (hasExampleImages) {
  // Draw image with stencil mask
  doc3.image('examples/assets/base-image.png', {
    x: 50,
    y: 400,
    width: 300,
    mask: 'examples/assets/mask-image.png',
    maskOptions: {
      type: 'stencil',
      inverted: false
    }
  })

  doc3.text('Stencil mask (binary transparency)', 50, 350, 12)
} else {
  doc3.text('WARNING: Example images not found', 50, 600, 14)
}

doc3.text('Code example:', 50, 300, 14)
doc3.setFillColor(0.2, 0.2, 0.2)
doc3.text("maskOptions: {", 60, 280, 10)
doc3.text("  type: 'stencil',  // Binary mask", 70, 268, 10)
doc3.text("  inverted: false", 70, 256, 10)
doc3.text("}", 60, 244, 10)

doc3.text('Difference from luminosity:', 50, 200, 12)
doc3.text('- Stencil: Only fully transparent or fully opaque', 60, 185, 10)
doc3.text('- Luminosity: Supports semi-transparency (gray pixels)', 60, 173, 10)

doc3.save('examples-output/masks-3-stencil.pdf')
console.log('✅ Example 3: Stencil mask created')

// ======================
// Example 4: Use Cases
// ======================

const doc4 = new PDFDocument({ size: 'Letter', margins: 50 })

doc4.text('Example 4: Image Mask Use Cases', 50, 750, 20)

// Use case descriptions
doc4.text('Common use cases for image masks:', 50, 710, 14)

doc4.text('1. Photo Cutouts', 60, 680, 12)
doc4.setFillColor(0.3, 0.3, 0.3)
doc4.text('Remove backgrounds from photos using a mask', 70, 665, 10)

doc4.setFillColor(0, 0, 0)
doc4.text('2. Vignette Effects', 60, 640, 12)
doc4.setFillColor(0.3, 0.3, 0.3)
doc4.text('Apply gradual fade-out at image edges', 70, 625, 10)

doc4.setFillColor(0, 0, 0)
doc4.text('3. Alpha Channel Images', 60, 600, 12)
doc4.setFillColor(0.3, 0.3, 0.3)
doc4.text('Simulate PNG alpha transparency in PDF', 70, 585, 10)

doc4.setFillColor(0, 0, 0)
doc4.text('4. Shaped Images', 60, 560, 12)
doc4.setFillColor(0.3, 0.3, 0.3)
doc4.text('Create circular, star-shaped, or custom-shaped images', 70, 545, 10)

doc4.setFillColor(0, 0, 0)
doc4.text('5. Watermark Blending', 60, 520, 12)
doc4.setFillColor(0.3, 0.3, 0.3)
doc4.text('Blend watermarks smoothly with document content', 70, 505, 10)

// Technical notes
doc4.setFillColor(0, 0, 0)
doc4.text('Technical Notes:', 50, 460, 14)
doc4.setFillColor(0.2, 0.2, 0.2)
doc4.text('- Mask image must be grayscale', 60, 440, 10)
doc4.text('- Mask should have same dimensions as base image', 60, 428, 10)
doc4.text('- Luminosity mask (SMask) supports 256 gray levels', 60, 416, 10)
doc4.text('- Stencil mask is 1-bit (black or white only)', 60, 404, 10)
doc4.text('- Use inverted option to flip mask transparency', 60, 392, 10)

// Creating masks
doc4.setFillColor(0, 0, 0)
doc4.text('Creating Mask Images:', 50, 360, 14)
doc4.setFillColor(0.2, 0.2, 0.2)
doc4.text('You can create masks using image editors:', 60, 340, 10)
doc4.text('- Photoshop/GIMP: Save alpha channel as grayscale', 70, 325, 10)
doc4.text('- ImageMagick: convert image.png -alpha extract mask.png', 70, 313, 10)
doc4.text('- Node.js sharp: await sharp(input).greyscale().toFile(mask)', 70, 301, 10)

doc4.save('examples-output/masks-4-use-cases.pdf')
console.log('✅ Example 4: Use cases documentation created')

console.log('\n🎭 All image mask examples created successfully!')
console.log('   4 PDFs demonstrating:')
console.log('   1. Luminosity masks (soft masks with gradients)')
console.log('   2. Inverted masks (swapping transparent/opaque)')
console.log('   3. Stencil masks (binary black/white)')
console.log('   4. Use cases and technical documentation\n')

if (!hasExampleImages) {
  console.log('💡 To test with actual images:')
  console.log('   1. Create examples/assets directory')
  console.log('   2. Add base-image.png (your photo/image)')
  console.log('   3. Add mask-image.png (grayscale mask)')
  console.log('   4. Run this example again\n')
}
