import { PDFDocument } from '../src'
import sharp from 'sharp'

/**
 * Example: QR Codes with Custom Logos
 *
 * This example demonstrates how to create QR codes with custom logos/images in the center.
 * Logos can be added from file paths or buffers, with customizable size, margin, and styling.
 */

async function createExampleLogo() {
  // Create a simple company logo as an example
  const logoSvg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <!-- Background circle -->
      <circle cx="100" cy="100" r="100" fill="#3498db"/>

      <!-- Company initials -->
      <text
        x="100"
        y="130"
        font-size="80"
        font-weight="bold"
        font-family="Arial, sans-serif"
        text-anchor="middle"
        fill="white">
        AC
      </text>
    </svg>
  `

  return await sharp(Buffer.from(logoSvg)).png().toBuffer()
}

async function main() {
  console.log('🎨 QR Code with Logo Examples\n')

  // Create a sample logo
  const logo = await createExampleLogo()

  // Example 1: Business Card QR with Logo
  const doc1 = new PDFDocument({ size: 'Letter' })

  doc1.text('Business Card - QR with Company Logo', 50, 750, 16)
  doc1.text('Scan to save contact information', 50, 730, 10)

  await doc1.qrCode({
    x: 200,
    y: 400,
    size: 250,
    data: {
      vcard: {
        firstName: 'Alice',
        lastName: 'Cooper',
        organization: 'Acme Corporation',
        title: 'CEO',
        phone: '+1-555-123-4567',
        email: 'alice.cooper@acme.com',
        url: 'https://acme.com'
      }
    },
    errorCorrectionLevel: 'H', // High error correction for logos
    logo: {
      source: logo,
      margin: 10,
      backgroundColor: '#ffffff'
    }
  })

  doc1.save('examples-output/qr-logo-business-card.pdf')
  console.log('✓ Business card QR code created')

  // Example 2: WiFi QR with Styled Logo
  const doc2 = new PDFDocument({ size: 'Letter' })

  doc2.text('WiFi Access - QR with Branded Logo', 50, 750, 16)
  doc2.text('Scan to connect to the network', 50, 730, 10)

  await doc2.qrCode({
    x: 200,
    y: 400,
    size: 250,
    data: {
      wifi: {
        ssid: 'Acme-Corp-WiFi',
        password: 'SecurePassword2024!',
        encryption: 'WPA'
      }
    },
    foregroundColor: '#2c3e50',
    backgroundColor: '#ecf0f1',
    errorCorrectionLevel: 'H',
    logo: {
      source: logo,
      margin: 12,
      borderRadius: 20, // Rounded corners
      backgroundColor: '#ffffff'
    }
  })

  doc2.save('examples-output/qr-logo-wifi.pdf')
  console.log('✓ WiFi QR code created')

  // Example 3: Product URL QR with Logo
  const doc3 = new PDFDocument({ size: 'Letter' })

  doc3.text('Product Information - QR with Logo', 50, 750, 16)
  doc3.text('Scan to view product details', 50, 730, 10)

  await doc3.qrCode({
    x: 200,
    y: 400,
    size: 250,
    data: 'https://acme.com/products/widget-2024',
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    errorCorrectionLevel: 'H',
    logo: {
      source: logo,
      width: 50, // Custom logo size
      margin: 8
    }
  })

  doc3.save('examples-output/qr-logo-product.pdf')
  console.log('✓ Product QR code created')

  // Example 4: Event QR with Large Logo
  const doc4 = new PDFDocument({ size: 'Letter' })

  doc4.text('Event Registration - QR with Logo', 50, 750, 16)
  doc4.text('Scan to register for the event', 50, 730, 10)

  await doc4.qrCode({
    x: 200,
    y: 350,
    size: 300,
    data: {
      event: {
        title: 'Acme Corp Annual Conference 2024',
        location: 'San Francisco Convention Center',
        startDate: new Date('2024-06-15T09:00:00'),
        endDate: new Date('2024-06-15T17:00:00'),
        description: 'Join us for our annual technology conference'
      }
    },
    errorCorrectionLevel: 'H',
    logo: {
      source: logo,
      width: 80, // Larger logo for larger QR
      margin: 15,
      borderRadius: 25
    }
  })

  doc4.save('examples-output/qr-logo-event.pdf')
  console.log('✓ Event QR code created')

  // Example 5: Using logo from file path
  // First save the logo to a temp file
  const logoPath = '/tmp/acme-logo.png'
  await sharp(logo).toFile(logoPath)

  const doc5 = new PDFDocument({ size: 'Letter' })

  doc5.text('QR with Logo from File Path', 50, 750, 16)
  doc5.text('This example loads the logo from a file', 50, 730, 10)

  await doc5.qrCode({
    x: 200,
    y: 400,
    size: 250,
    data: 'https://acme.com/about',
    errorCorrectionLevel: 'H',
    logo: {
      source: logoPath, // Can use file path instead of buffer
      margin: 10
    }
  })

  doc5.save('examples-output/qr-logo-from-file.pdf')
  console.log('✓ QR with logo from file created')

  console.log('\n✅ All examples completed!')
  console.log('\nGenerated files in examples-output/:')
  console.log('  - qr-logo-business-card.pdf')
  console.log('  - qr-logo-wifi.pdf')
  console.log('  - qr-logo-product.pdf')
  console.log('  - qr-logo-event.pdf')
  console.log('  - qr-logo-from-file.pdf')
  console.log('\n💡 Tips:')
  console.log('  - Use errorCorrectionLevel: "H" for best logo visibility')
  console.log('  - Keep logo size under 30% of QR code size')
  console.log('  - Add margin around logo for better scanning')
  console.log('  - Use rounded corners for a polished look')
}

main().catch(console.error)
