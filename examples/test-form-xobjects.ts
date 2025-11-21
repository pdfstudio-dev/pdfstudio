import { PDFDocument } from '../src'

console.log('📄 Testing Form XObjects / Templates...\n')

// ======================
// Example 1: Simple Logo Reuse
// ======================

const doc1 = new PDFDocument({ size: 'Letter', margins: 50 })

// Create a simple logo template
const logo = doc1.createFormXObject({
  width: 80,
  height: 80,
  name: 'CompanyLogo',
  draw: (ctx) => {
    // Blue circle background
    ctx.setFillColor(0, 0.5, 1)
    ctx.circle(40, 40, 35)
    ctx.fill()

    // White border
    ctx.setStrokeColor(1, 1, 1)
    ctx.setLineWidth(3)
    ctx.circle(40, 40, 35)
    ctx.stroke()

    // Company initials
    ctx.setFillColor(1, 1, 1)
    ctx.text('PDF', 20, 35, 20)
  }
})

doc1.text('Example 1: Simple Logo Reuse', 50, 750, 20)
doc1.text('The logo template is defined once and used multiple times:', 50, 720, 12)

// Use the logo multiple times on the same page
doc1.useFormXObject(logo, { x: 50, y: 650 })
doc1.text('← Top left', 140, 680, 10)

doc1.useFormXObject(logo, { x: 250, y: 650 })
doc1.text('← Center', 340, 680, 10)

doc1.useFormXObject(logo, { x: 450, y: 650 })
doc1.text('← Top right', 540, 680, 10)

// Different sizes
doc1.text('Different scales:', 50, 580, 12)
doc1.useFormXObject(logo, { x: 50, y: 520, scale: 0.5 })
doc1.text('50%', 50, 500, 10)

doc1.useFormXObject(logo, { x: 150, y: 520, scale: 0.75 })
doc1.text('75%', 150, 500, 10)

doc1.useFormXObject(logo, { x: 270, y: 520, scale: 1.0 })
doc1.text('100%', 270, 500, 10)

doc1.useFormXObject(logo, { x: 410, y: 520, scale: 1.5 })
doc1.text('150%', 410, 490, 10)

doc1.save('examples-output/xobject-1-simple-logo.pdf')
console.log('✅ Example 1: Simple logo reuse created')

// ======================
// Example 2: Page Header/Footer Templates
// ======================

const doc2 = new PDFDocument({ size: 'Letter', margins: 50 })

// Create header template
const header = doc2.createFormXObject({
  width: 500,
  height: 60,
  name: 'PageHeader',
  draw: (ctx) => {
    // Background
    ctx.setFillColor(0.2, 0.4, 0.8)
    ctx.rect(0, 0, 500, 60)
    ctx.fill()

    // Title
    ctx.setFillColor(1, 1, 1)
    ctx.text('PDFStudio Documentation', 15, 32, 18)

    // Decorative line
    ctx.setStrokeColor(1, 1, 1)
    ctx.setLineWidth(2)
    ctx.moveTo(0, 0)
    ctx.lineTo(500, 0)
    ctx.stroke()
  }
})

// Create footer template
const footer = doc2.createFormXObject({
  width: 500,
  height: 40,
  name: 'PageFooter',
  draw: (ctx) => {
    // Top line
    ctx.setStrokeColor(0.7, 0.7, 0.7)
    ctx.setLineWidth(1)
    ctx.moveTo(0, 40)
    ctx.lineTo(500, 40)
    ctx.stroke()

    // Footer text
    ctx.setFillColor(0.5, 0.5, 0.5)
    ctx.text('© 2024 PDFStudio', 15, 18, 10)
    ctx.text('Page 1', 450, 18, 10)
  }
})

// Add header and footer to page 1
doc2.useFormXObject(header, { x: 56, y: 750 })
doc2.text('Page 1 Content', 56, 680, 16)
doc2.text('This page uses header and footer templates.', 56, 660, 12)
doc2.text('The templates ensure consistent design across all pages.', 56, 640, 12)
doc2.useFormXObject(footer, { x: 56, y: 40 })

// Add new page with same header/footer
doc2.addPage()
doc2.useFormXObject(header, { x: 56, y: 750 })
doc2.text('Page 2 Content', 56, 680, 16)
doc2.text('Same header and footer, different content!', 56, 660, 12)
doc2.useFormXObject(footer, { x: 56, y: 40 })

// Add third page
doc2.addPage()
doc2.useFormXObject(header, { x: 56, y: 750 })
doc2.text('Page 3 Content', 56, 680, 16)
doc2.text('Consistent branding throughout the document.', 56, 660, 12)
doc2.useFormXObject(footer, { x: 56, y: 40 })

doc2.save('examples-output/xobject-2-header-footer.pdf')
console.log('✅ Example 2: Header/footer templates created')

// ======================
// Example 3: Rotated Templates
// ======================

const doc3 = new PDFDocument({ size: 'Letter', margins: 50 })

// Create an arrow template
const arrow = doc3.createFormXObject({
  width: 100,
  height: 20,
  name: 'Arrow',
  draw: (ctx) => {
    // Arrow shaft
    ctx.setFillColor(1, 0, 0)
    ctx.rect(0, 7, 80, 6)
    ctx.fill()

    // Arrow head (triangle)
    ctx.moveTo(80, 0)
    ctx.lineTo(100, 10)
    ctx.lineTo(80, 20)
    ctx.closePath()
    ctx.fill()
  }
})

doc3.text('Example 3: Rotated Templates', 50, 750, 20)
doc3.text('The same arrow rotated at different angles:', 50, 720, 12)

// Center point for rotation demonstrations
const centerX = 300
const centerY = 500

// Draw center dot
doc3.circle({ x: centerX, y: centerY, radius: 3, fillColor: [0, 0, 0] })

// Place arrow at different rotations
const angles = [0, 45, 90, 135, 180, 225, 270, 315]
angles.forEach(angle => {
  doc3.useFormXObject(arrow, { x: centerX, y: centerY, rotate: angle })
})

doc3.text('Arrows pointing in 8 directions from center point', 50, 350, 12)

doc3.save('examples-output/xobject-3-rotation.pdf')
console.log('✅ Example 3: Rotated templates created')

// ======================
// Example 4: Watermark Template
// ======================

const doc4 = new PDFDocument({ size: 'Letter', margins: 50 })

// Create watermark template
const watermark = doc4.createFormXObject({
  width: 400,
  height: 100,
  name: 'Watermark',
  draw: (ctx) => {
    ctx.setFillColor(0.9, 0.9, 0.9)
    ctx.text('CONFIDENTIAL', 80, 45, 48)
  }
})

doc4.text('Example 4: Watermark Template', 50, 750, 20)
doc4.text('Content with a watermark overlay:', 50, 720, 12)

// Add some content
doc4.text('This is sensitive information.', 50, 680, 14)
doc4.text('Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 50, 650, 12)
doc4.text('Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 50, 630, 12)

// Place watermark with rotation and opacity
doc4.useFormXObject(watermark, {
  x: 100,
  y: 300,
  rotate: -45,
  opacity: 0.3
})

doc4.text('More content continues here...', 50, 150, 12)
doc4.text('The watermark is semi-transparent and rotated.', 50, 130, 12)

doc4.save('examples-output/xobject-4-watermark.pdf')
console.log('✅ Example 4: Watermark template created')

// ======================
// Example 5: Complex Graphics Template
// ======================

const doc5 = new PDFDocument({ size: 'Letter', margins: 50 })

// Create a badge template with complex graphics
const badge = doc5.createFormXObject({
  width: 120,
  height: 120,
  name: 'Badge',
  draw: (ctx) => {
    // Outer circle (gold)
    ctx.setFillColor(1, 0.84, 0)
    ctx.circle(60, 60, 55)
    ctx.fill()

    // Middle circle (white)
    ctx.setFillColor(1, 1, 1)
    ctx.circle(60, 60, 45)
    ctx.fill()

    // Inner circle (gold)
    ctx.setFillColor(1, 0.84, 0)
    ctx.circle(60, 60, 35)
    ctx.fill()

    // Star in center (white)
    ctx.setFillColor(1, 1, 1)
    // Draw a simple 5-pointed star
    ctx.moveTo(60, 30)
    ctx.lineTo(67, 52)
    ctx.lineTo(90, 52)
    ctx.lineTo(72, 66)
    ctx.lineTo(79, 88)
    ctx.lineTo(60, 74)
    ctx.lineTo(41, 88)
    ctx.lineTo(48, 66)
    ctx.lineTo(30, 52)
    ctx.lineTo(53, 52)
    ctx.closePath()
    ctx.fill()
  }
})

doc5.text('Example 5: Complex Graphics Template', 50, 750, 20)
doc5.text('Award badges using a single template:', 50, 720, 12)

// Row 1
doc5.useFormXObject(badge, { x: 80, y: 600 })
doc5.text('Gold Award', 105, 560, 12)

doc5.useFormXObject(badge, { x: 240, y: 600, scale: 0.9 })
doc5.text('Silver Award', 260, 560, 12)

doc5.useFormXObject(badge, { x: 400, y: 600, scale: 0.8 })
doc5.text('Bronze Award', 415, 560, 12)

// Row 2 - smaller badges
doc5.text('Mini badges:', 50, 480, 12)
doc5.useFormXObject(badge, { x: 100, y: 400, scale: 0.5 })
doc5.useFormXObject(badge, { x: 180, y: 400, scale: 0.5 })
doc5.useFormXObject(badge, { x: 260, y: 400, scale: 0.5 })
doc5.useFormXObject(badge, { x: 340, y: 400, scale: 0.5 })

doc5.save('examples-output/xobject-5-complex-graphics.pdf')
console.log('✅ Example 5: Complex graphics template created')

// ======================
// Example 6: Template with SVG Path
// ======================

const doc6 = new PDFDocument({ size: 'Letter', margins: 50 })

// Create a heart icon template using SVG path
const heart = doc6.createFormXObject({
  width: 60,
  height: 60,
  name: 'Heart',
  draw: (ctx) => {
    ctx.setFillColor(1, 0, 0)
    // SVG heart path
    ctx.path('M 30 15 C 30 10 25 5 20 5 C 15 5 10 10 10 15 C 10 20 15 30 30 45 C 45 30 50 20 50 15 C 50 10 45 5 40 5 C 35 5 30 10 30 15 Z')
    ctx.fill()
  }
})

doc6.text('Example 6: Template with SVG Path', 50, 750, 20)
doc6.text('Hearts created from SVG path data:', 50, 720, 12)

// Use heart at different sizes
doc6.useFormXObject(heart, { x: 80, y: 650, scale: 0.8 })
doc6.useFormXObject(heart, { x: 160, y: 650, scale: 1.0 })
doc6.useFormXObject(heart, { x: 240, y: 650, scale: 1.2 })
doc6.useFormXObject(heart, { x: 330, y: 650, scale: 1.4 })
doc6.useFormXObject(heart, { x: 430, y: 650, scale: 1.6 })

// Hearts in a pattern
doc6.text('Pattern of hearts:', 50, 550, 12)
for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 3; j++) {
    doc6.useFormXObject(heart, {
      x: 80 + i * 80,
      y: 450 - j * 80,
      scale: 0.6,
      opacity: 0.7
    })
  }
}

doc6.save('examples-output/xobject-6-svg-path.pdf')
console.log('✅ Example 6: SVG path template created')

// ======================
// Example 7: Real-World Use Case - Invoice Template
// ======================

const doc7 = new PDFDocument({ size: 'Letter', margins: 50 })

// Company logo template
const companyLogo = doc7.createFormXObject({
  width: 100,
  height: 60,
  name: 'InvoiceLogo',
  draw: (ctx) => {
    // Simple company logo
    ctx.setFillColor(0.1, 0.2, 0.5)
    ctx.rect(0, 10, 100, 40)
    ctx.fill()
    ctx.setFillColor(1, 1, 1)
    ctx.text('ACME Corp', 10, 30, 14)
  }
})

// "PAID" stamp template
const paidStamp = doc7.createFormXObject({
  width: 150,
  height: 50,
  name: 'PaidStamp',
  draw: (ctx) => {
    // Border
    ctx.setStrokeColor(0, 0.7, 0)
    ctx.setLineWidth(3)
    ctx.rect(5, 5, 140, 40)
    ctx.stroke()

    // Text
    ctx.setFillColor(0, 0.7, 0)
    ctx.text('PAID', 50, 23, 24)
  }
})

// Page 1 - Paid invoice
doc7.useFormXObject(companyLogo, { x: 56, y: 750 })
doc7.text('INVOICE #1001', 400, 780, 18)
doc7.text('Date: 2024-01-15', 400, 760, 12)

doc7.text('Bill To:', 56, 680, 14)
doc7.text('John Doe', 56, 660, 12)
doc7.text('123 Main St', 56, 645, 12)
doc7.text('Anytown, USA', 56, 630, 12)

doc7.text('Item', 56, 580, 12)
doc7.text('Quantity', 300, 580, 12)
doc7.text('Price', 400, 580, 12)
doc7.text('Total', 480, 580, 12)

doc7.text('Product A', 56, 560, 12)
doc7.text('2', 300, 560, 12)
doc7.text('$50.00', 400, 560, 12)
doc7.text('$100.00', 480, 560, 12)

doc7.text('Product B', 56, 540, 12)
doc7.text('1', 300, 540, 12)
doc7.text('$75.00', 400, 540, 12)
doc7.text('$75.00', 480, 540, 12)

doc7.text('Total: $175.00', 400, 500, 14)

// Apply "PAID" stamp with rotation
doc7.useFormXObject(paidStamp, {
  x: 250,
  y: 350,
  rotate: -15,
  opacity: 0.7
})

// Page 2 - Unpaid invoice
doc7.addPage()
doc7.useFormXObject(companyLogo, { x: 56, y: 750 })
doc7.text('INVOICE #1002', 400, 780, 18)
doc7.text('Date: 2024-01-20', 400, 760, 12)

doc7.text('Bill To:', 56, 680, 14)
doc7.text('Jane Smith', 56, 660, 12)
doc7.text('456 Oak Ave', 56, 645, 12)
doc7.text('Other City, USA', 56, 630, 12)

doc7.text('Item', 56, 580, 12)
doc7.text('Quantity', 300, 580, 12)
doc7.text('Price', 400, 580, 12)
doc7.text('Total', 480, 580, 12)

doc7.text('Service X', 56, 560, 12)
doc7.text('5', 300, 560, 12)
doc7.text('$30.00', 400, 560, 12)
doc7.text('$150.00', 480, 560, 12)

doc7.text('Total: $150.00', 400, 500, 14)
doc7.text('Status: Pending Payment', 56, 400, 12)

doc7.save('examples-output/xobject-7-invoice.pdf')
console.log('✅ Example 7: Invoice template created')

console.log('\n📄 All Form XObject examples created successfully!')
console.log('   7 PDFs demonstrating:')
console.log('   1. Simple logo reuse with different scales')
console.log('   2. Page header/footer templates across pages')
console.log('   3. Rotated templates (arrows in all directions)')
console.log('   4. Watermark template with rotation and opacity')
console.log('   5. Complex graphics (award badges)')
console.log('   6. Templates using SVG path data')
console.log('   7. Real-world use case (invoice with logo and stamp)\n')
