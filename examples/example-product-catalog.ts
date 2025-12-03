import { PDFDocument } from '../src'

console.log('📦 Generating Product Catalog with Ellipsis...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 40
})

// Title
doc.text('PRODUCT CATALOG 2025', 40, 750, 28, 'Helvetica-Bold')
doc.text('Premium Collection', 40, 720, 14, 'Helvetica')

// Draw separator line
doc.setStrokeColor(0.2, 0.2, 0.8)
doc.setLineWidth(2)
doc.moveTo(40, 710)
doc.lineTo(572, 710)
doc.stroke()

// Products data
const products = [
  {
    name: 'Professional Wireless Headphones',
    sku: 'WH-2000XM5',
    price: '$349.99',
    description: 'Industry-leading noise cancellation technology with exceptional sound quality. Features 30-hour battery life, multipoint connection, and premium comfort padding. Perfect for travel, work, and entertainment. Includes USB-C charging, 3.5mm cable, and carrying case. Available in Black, Silver, and Blue.',
    category: 'Audio',
    inStock: true
  },
  {
    name: 'Ultra-Wide Curved Gaming Monitor',
    sku: 'MON-34UC',
    price: '$899.99',
    description: 'Immersive 34-inch curved display with 3440x1440 resolution and 144Hz refresh rate. HDR10 support, 1ms response time, and AMD FreeSync Premium. Built-in KVM switch, USB-C connectivity with 90W power delivery. Ergonomic stand with height, tilt, and swivel adjustment. Ideal for gaming, creative work, and productivity.',
    category: 'Displays',
    inStock: true
  },
  {
    name: 'Mechanical Gaming Keyboard RGB',
    sku: 'KB-MX-RGB',
    price: '$159.99',
    description: 'Premium mechanical keyboard with Cherry MX switches (choice of Red, Blue, or Brown). Per-key RGB lighting, programmable macros, and dedicated media controls. Aircraft-grade aluminum frame, braided USB-C cable, and magnetic wrist rest. N-key rollover and anti-ghosting technology. Onboard memory for profiles.',
    category: 'Peripherals',
    inStock: false
  },
  {
    name: 'Portable SSD 2TB USB-C',
    sku: 'SSD-2TB-C',
    price: '$199.99',
    description: 'Lightning-fast external SSD with read speeds up to 1050MB/s and write speeds up to 1000MB/s. Compact and durable design with drop resistance up to 2 meters. USB 3.2 Gen 2 connectivity, backward compatible. Hardware encryption available. Compatible with Windows, Mac, iPad Pro, and Android devices.',
    category: 'Storage',
    inStock: true
  },
  {
    name: 'Webcam 4K Pro with Auto-Framing',
    sku: 'CAM-4K-AF',
    price: '$249.99',
    description: 'Professional-grade 4K webcam with AI-powered auto-framing and light correction. Dual microphones with noise reduction, 90-degree field of view. Works perfectly with Zoom, Teams, Google Meet. Privacy shutter, USB-C connection, tripod mount included. Ideal for content creators, streamers, and remote workers.',
    category: 'Video',
    inStock: true
  },
  {
    name: 'Ergonomic Office Chair Pro',
    sku: 'CHAIR-ERG-P',
    price: '$599.99',
    description: 'Premium ergonomic office chair with full adjustability including lumbar support, armrests, seat depth, and recline tension. Breathable mesh back, high-density foam cushion. Supports up to 300 lbs. Aluminum base with smooth-rolling casters. 10-year warranty. Designed for all-day comfort and productivity.',
    category: 'Furniture',
    inStock: true
  }
]

let yPosition = 680
const leftMargin = 40
const cardHeight = 110
const cardSpacing = 15

console.log(`✓ Rendering ${products.length} products...\n`)

products.forEach((product, index) => {
  // Check if we need a new page
  if (yPosition < 100) {
    doc.addPage()
    yPosition = 750
  }

  // Product card background
  if (!product.inStock) {
    // Out of stock - gray background
    doc.setFillColor(0.95, 0.95, 0.95)
  } else {
    // In stock - white background with subtle border
    doc.setFillColor(1, 1, 1)
  }

  doc.roundedRect(leftMargin, yPosition - cardHeight, 532, cardHeight, 8)
  doc.fill()

  // Border
  if (product.inStock) {
    doc.setStrokeColor(0.8, 0.8, 0.9)
  } else {
    doc.setStrokeColor(0.7, 0.7, 0.7)
  }
  doc.setLineWidth(1)
  doc.roundedRect(leftMargin, yPosition - cardHeight, 532, cardHeight, 8)
  doc.stroke()

  // Product name (bold)
  doc.text(product.name, leftMargin + 15, yPosition - 15, 14, 'Helvetica-Bold')

  // SKU and Category
  doc.text(`SKU: ${product.sku}`, leftMargin + 15, yPosition - 32, 9, {
  })
  doc.text(`Category: ${product.category}`, leftMargin + 120, yPosition - 32, 9, {
  })

  // Price (right aligned, highlighted)
  const priceX = leftMargin + 532 - 15
  doc.text(product.price, priceX - doc.widthOfString(product.price, 16, 'Helvetica-Bold'),
    yPosition - 20, 16, 'Helvetica-Bold')

  // Stock status badge
  const stockX = leftMargin + 532 - 15
  const stockY = yPosition - 38
  if (product.inStock) {
    doc.setFillColor(0.13, 0.77, 0.49) // Green
    doc.roundedRect(stockX - 70, stockY - 6, 70, 14, 4)
    doc.fill()
    doc.text('IN STOCK', stockX - 65, stockY - 2, 8, 'Helvetica-Bold')
  } else {
    doc.setFillColor(0.87, 0.37, 0.37) // Red
    doc.roundedRect(stockX - 85, stockY - 6, 85, 14, 4)
    doc.fill()
    doc.text('OUT OF STOCK', stockX - 80, stockY - 2, 8, 'Helvetica-Bold')
  }

  // Description box with ellipsis (key feature!)
  const descBoxX = leftMargin + 15
  const descBoxY = yPosition - 50
  const descBoxWidth = 500
  const descBoxHeight = 48

  // Draw subtle background for description
  doc.setFillColor(0.98, 0.98, 1)
  doc.roundedRect(descBoxX, descBoxY - descBoxHeight, descBoxWidth, descBoxHeight, 4)
  doc.fill()

  // Description text with ellipsis - automatically truncates with "..."
  doc.text(product.description, {
    x: descBoxX + 8,
    y: descBoxY - 8,
    width: descBoxWidth - 16,
    height: descBoxHeight - 12,  // Limited height
    fontSize: 9,
    align: 'left',
    lineGap: 2,
    ellipsis: '...'  // ← ELLIPSIS FEATURE: Truncate long descriptions
  })

  console.log(`  ${index + 1}. ${product.name} - ${product.inStock ? 'IN STOCK' : 'OUT OF STOCK'}`)

  // Move to next product position
  yPosition -= (cardHeight + cardSpacing)
})

// Footer on last page
const pageCount = doc.getPageCount()
doc.switchToPage(pageCount - 1)

doc.setStrokeColor(0.8, 0.8, 0.8)
doc.setLineWidth(1)
doc.moveTo(40, 50)
doc.lineTo(572, 50)
doc.stroke()

doc.text('For more information, visit www.example.com or call 1-800-PRODUCTS', 40, 35, 9, {
})

doc.text(`Page ${pageCount} • Product Catalog 2025 • All prices in USD`, 40, 22, 8, {
})

// Save the PDF
doc.save('examples/output/example-product-catalog.pdf')

console.log('\n✅ Product catalog generated successfully!')
console.log('📄 PDF saved to: examples/output/example-product-catalog.pdf')
console.log('\n💡 Key Feature Demonstrated:')
console.log('   - Ellipsis: Product descriptions automatically truncated with "..."')
console.log('   - Long descriptions fit perfectly in fixed-height boxes\n')
