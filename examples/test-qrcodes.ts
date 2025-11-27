/**
 * QR Code Examples
 * Demonstrates all QR code capabilities
 */

import { PDFDocument } from '../src'

async function main() {
  console.log('🔲 Testing QR Codes...\n')

  // Example 1: Basic URL QR Code
  await createExample1()

  // Example 2: vCard (Contact Information)
  await createExample2()

  // Example 3: WiFi Credentials
  await createExample3()

  // Example 4: Multiple Types (Email, SMS, Phone, Geo)
  await createExample4()

  // Example 5: Custom Colors and Sizes
  await createExample5()

  // Example 6: Calendar Event
  await createExample6()

  console.log('✅ All QR code examples created successfully!')
}

/**
 * Example 1: Basic URL QR Code
 */
async function createExample1() {
  const doc = new PDFDocument({
    size: 'Letter',
    margins: 50
  })

  // Title
  doc.text('Example 1: Basic URL QR Code', 50, 750, 18)
  doc.text('Scan to visit website', 50, 730, 12)

  // Simple URL QR code
  await doc.qrCode({
    x: 200,
    y: 550,
    size: 150,
    data: 'https://github.com/pdfstudio-dev/pdfstudio'
  })

  // Label
  doc.text('GitHub Repository', 200, 520, 10)
  doc.text('https://github.com/pdfstudio-dev/pdfstudio', 50, 500, 8)

  doc.save('examples-output/qr-1-basic-url.pdf')
  console.log('✓ Example 1: Basic URL QR code created')
}

/**
 * Example 2: vCard (Contact Information)
 */
async function createExample2() {
  const doc = new PDFDocument({
    size: 'Letter',
    margins: 50
  })

  // Title
  doc.text('Example 2: vCard QR Code', 50, 750, 18)
  doc.text('Scan to add contact to phone', 50, 730, 12)

  // vCard QR code with contact info
  await doc.qrCode({
    x: 200,
    y: 450,
    size: 200,
    data: {
      vcard: {
        firstName: 'John',
        lastName: 'Doe',
        organization: 'Acme Corporation',
        title: 'Senior Developer',
        phone: '+1-555-123-4567',
        email: 'john.doe@acme.com',
        url: 'https://acme.com',
        address: {
          street: '123 Main Street',
          city: 'San Francisco',
          state: 'CA',
          zip: '94102',
          country: 'USA'
        }
      }
    },
    foregroundColor: '#2c3e50',
    errorCorrectionLevel: 'H' // High error correction for complex data
  })

  // Display contact information
  doc.text('Contact Information:', 50, 420, 12)
  doc.text('Name: John Doe', 50, 400, 10)
  doc.text('Title: Senior Developer', 50, 385, 10)
  doc.text('Company: Acme Corporation', 50, 370, 10)
  doc.text('Phone: +1-555-123-4567', 50, 355, 10)
  doc.text('Email: john.doe@acme.com', 50, 340, 10)

  doc.save('examples-output/qr-2-vcard.pdf')
  console.log('✓ Example 2: vCard QR code created')
}

/**
 * Example 3: WiFi Credentials
 */
async function createExample3() {
  const doc = new PDFDocument({
    size: 'Letter',
    margins: 50
  })

  // Title
  doc.text('Example 3: WiFi QR Code', 50, 750, 18)
  doc.text('Scan to connect to WiFi network', 50, 730, 12)

  // WiFi QR code
  await doc.qrCode({
    x: 200,
    y: 500,
    size: 180,
    data: {
      wifi: {
        ssid: 'Office-Network',
        password: 'SecurePassword123!',
        encryption: 'WPA',
        hidden: false
      }
    },
    foregroundColor: '#3498db',
    backgroundColor: '#ecf0f1'
  })

  // Display WiFi information
  doc.text('Network Information:', 50, 470, 12)
  doc.text('SSID: Office-Network', 50, 450, 10)
  doc.text('Password: SecurePassword123!', 50, 435, 10)
  doc.text('Encryption: WPA', 50, 420, 10)

  // Warning
  doc.text('WARNING: Do not share WiFi credentials publicly', 50, 390, 8)

  doc.save('examples-output/qr-3-wifi.pdf')
  console.log('✓ Example 3: WiFi QR code created')
}

/**
 * Example 4: Multiple Communication Types
 */
async function createExample4() {
  const doc = new PDFDocument({
    size: 'Letter',
    margins: 50
  })

  // Title
  doc.text('Example 4: Communication QR Codes', 50, 750, 18)

  // Email QR code
  doc.text('Email', 80, 680, 12)
  await doc.qrCode({
    x: 50,
    y: 550,
    size: 100,
    data: {
      email: {
        address: 'support@example.com',
        subject: 'Question about your service',
        body: 'Hello, I have a question...'
      }
    },
    foregroundColor: '#e74c3c'
  })
  doc.text('support@example.com', 50, 530, 8)

  // Phone QR code
  doc.text('Phone Call', 250, 680, 12)
  await doc.qrCode({
    x: 220,
    y: 550,
    size: 100,
    data: {
      phone: '+1-800-555-1234'
    },
    foregroundColor: '#27ae60'
  })
  doc.text('+1-800-555-1234', 220, 530, 8)

  // SMS QR code
  doc.text('SMS', 420, 680, 12)
  await doc.qrCode({
    x: 390,
    y: 550,
    size: 100,
    data: {
      sms: {
        phone: '+1-555-123-4567',
        message: 'Hello from QR code!'
      }
    },
    foregroundColor: '#3498db'
  })
  doc.text('Send SMS', 390, 530, 8)

  // Geographic coordinates
  doc.text('Location (Geo Coordinates)', 200, 480, 12)
  await doc.qrCode({
    x: 200,
    y: 350,
    size: 120,
    data: {
      geo: {
        latitude: 37.7749,
        longitude: -122.4194
      }
    },
    foregroundColor: '#f39c12'
  })
  doc.text('San Francisco, CA', 200, 320, 8)
  doc.text('Lat: 37.7749, Lon: -122.4194', 200, 305, 8)

  doc.save('examples-output/qr-4-communications.pdf')
  console.log('✓ Example 4: Communication QR codes created')
}

/**
 * Example 5: Custom Colors and Sizes
 */
async function createExample5() {
  const doc = new PDFDocument({
    size: 'Letter',
    margins: 50
  })

  // Title
  doc.text('Example 5: Custom Styling', 50, 750, 18)
  doc.text('Different colors, sizes, and error correction levels', 50, 730, 12)

  const url = 'https://example.com'

  // Small QR (Error Level L)
  doc.text('Small (L)', 80, 680, 10)
  await doc.qrCode({
    x: 50,
    y: 600,
    size: 80,
    data: url,
    errorCorrectionLevel: 'L',
    foregroundColor: '#000000'
  })
  doc.text('80x80, Level L', 50, 575, 7)

  // Medium QR (Error Level M)
  doc.text('Medium (M)', 220, 680, 10)
  await doc.qrCode({
    x: 180,
    y: 590,
    size: 100,
    data: url,
    errorCorrectionLevel: 'M',
    foregroundColor: '#2c3e50'
  })
  doc.text('100x100, Level M', 180, 565, 7)

  // Large QR (Error Level Q)
  doc.text('Large (Q)', 360, 680, 10)
  await doc.qrCode({
    x: 310,
    y: 580,
    size: 120,
    data: url,
    errorCorrectionLevel: 'Q',
    foregroundColor: '#e74c3c'
  })
  doc.text('120x120, Level Q', 310, 555, 7)

  // Extra Large QR (Error Level H - best for logos)
  doc.text('X-Large (H)', 230, 520, 10)
  await doc.qrCode({
    x: 180,
    y: 360,
    size: 150,
    data: url,
    errorCorrectionLevel: 'H',
    foregroundColor: '#27ae60',
    backgroundColor: '#ecf0f1'
  })
  doc.text('150x150, Level H (best for logos)', 180, 330, 7)
  doc.text('Custom colors', 180, 318, 7)

  // Color examples
  doc.text('Color Variations:', 50, 280, 12)

  const colors = [
    { name: 'Blue', fg: '#3498db', bg: '#ffffff' },
    { name: 'Purple', fg: '#9b59b6', bg: '#ffffff' },
    { name: 'Orange', fg: '#e67e22', bg: '#ffffff' },
    { name: 'Teal', fg: '#1abc9c', bg: '#ecf0f1' }
  ]

  for (let i = 0; i < colors.length; i++) {
    const { name, fg, bg } = colors[i]
    const x = 50 + (i * 130)

    doc.text(name, x + 20, 250, 8)
    await doc.qrCode({
      x,
      y: 170,
      size: 70,
      data: url,
      foregroundColor: fg,
      backgroundColor: bg,
      errorCorrectionLevel: 'M'
    })
  }

  doc.save('examples-output/qr-5-styling.pdf')
  console.log('✓ Example 5: Custom styling QR codes created')
}

/**
 * Example 6: Calendar Event
 */
async function createExample6() {
  const doc = new PDFDocument({
    size: 'Letter',
    margins: 50
  })

  // Title
  doc.text('Example 6: Calendar Event QR Code', 50, 750, 18)
  doc.text('Scan to add event to calendar', 50, 730, 12)

  // Create a date for next week
  const startDate = new Date()
  startDate.setDate(startDate.getDate() + 7)
  startDate.setHours(14, 0, 0, 0)

  const endDate = new Date(startDate)
  endDate.setHours(16, 0, 0, 0)

  // Calendar event QR code
  await doc.qrCode({
    x: 200,
    y: 450,
    size: 200,
    data: {
      event: {
        title: 'Team Meeting',
        location: 'Conference Room A, Building 2',
        startDate: startDate,
        endDate: endDate,
        description: 'Quarterly planning meeting for Q1 2025'
      }
    },
    foregroundColor: '#8e44ad',
    errorCorrectionLevel: 'H'
  })

  // Display event information
  doc.text('Event Details:', 50, 420, 12)
  doc.text('Title: Team Meeting', 50, 400, 10)
  doc.text('Location: Conference Room A, Building 2', 50, 385, 10)
  doc.text(`Date: ${startDate.toLocaleDateString()}`, 50, 370, 10)
  doc.text(`Time: ${startDate.toLocaleTimeString()} - ${endDate.toLocaleTimeString()}`, 50, 355, 10)
  doc.text('Description: Quarterly planning meeting for Q1 2025', 50, 340, 10)

  doc.save('examples-output/qr-6-calendar.pdf')
  console.log('✓ Example 6: Calendar event QR code created')
}

// Run all examples
main().catch(console.error)
