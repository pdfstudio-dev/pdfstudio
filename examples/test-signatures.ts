import { PDFDocument } from '../src'
import type { Color } from '../src/types'

console.log('✍️  Testing PDF Digital Signatures...\n')

// ======================
// Example 1: Simple Signature Field
// ======================

const doc1 = new PDFDocument({
  size: 'Letter',
  margins: 50
})

doc1.text('Simple Signature Field Example', 50, 750, 24)
doc1.text('HOW TO USE:', 50, 700, 14)
doc1.text('1. Open this PDF in Adobe Acrobat Reader or compatible PDF viewer', 70, 675, 11)
doc1.text('2. Click on the blue signature box below', 70, 660, 11)
doc1.text('3. Choose "Sign Yourself" or "Request Signatures"', 70, 645, 11)
doc1.text('4. Follow the prompts to add your digital signature', 70, 630, 11)

doc1.text('Please sign below:', 50, 280, 14)
doc1.text('Signature:', 50, 265, 12)

// Add signature field dynamically
doc1.addSignatureField({
  name: 'signature1',
  page: 0,
  x: 100,
  y: 200,
  width: 250,
  height: 60,
  reason: 'I approve this document',
  location: 'New York, NY',
  contactInfo: 'pdfstudio@ideas2code.dev',
  borderColor: [0, 0, 0.8] as Color,
  borderWidth: 2
})

// Add arrow pointing to signature field
doc1.text('→ CLICK IN THIS BLUE BOX TO SIGN →', 115, 235, 9)

doc1.text('← Interactive Signature Field', 365, 220, 10)

doc1.text('This PDF contains an interactive signature field.', 50, 150, 10)
doc1.text('The signature field is the blue-bordered box above.', 50, 135, 10)
doc1.text('You can sign it digitally using Adobe Acrobat Reader.', 50, 120, 10)

// Add decorative element (helps with rendering)
doc1.circle({ x: 450, y: 230, radius: 30, strokeColor: [0.8, 0.8, 0.8] as Color, strokeWidth: 1 })
doc1.text('✓', 443, 225, 20)

doc1.save('examples-output/test-signatures-1-simple.pdf')
console.log('✅ Example 1: Simple signature field created')

// ======================
// Example 2: Multiple Signature Fields
// ======================

const doc2 = new PDFDocument({
  size: 'Letter',
  margins: 50
})

doc2.text('Contract Agreement', 50, 750, 24)
doc2.text('This contract requires signatures from multiple parties:', 50, 700, 12)

// Add some contract text
doc2.text('TERMS AND CONDITIONS', 50, 650, 14)
doc2.text('1. Party A agrees to provide services as described.', 70, 620, 11)
doc2.text('2. Party B agrees to compensation as outlined.', 70, 605, 11)
doc2.text('3. Both parties agree to the terms stated herein.', 70, 590, 11)

// Add first signature field
doc2.text('Party A Signature:', 50, 450, 12)
doc2.addSignatureField({
  name: 'partyA',
  page: 0,
  x: 180,
  y: 430,
  width: 180,
  height: 40,
  reason: 'Agreement approval',
  location: 'Company HQ',
  borderColor: [0, 0, 0.8] as Color,
  borderWidth: 1
})

// Add second signature field
doc2.text('Party B Signature:', 50, 350, 12)
doc2.addSignatureField({
  name: 'partyB',
  page: 0,
  x: 180,
  y: 330,
  width: 180,
  height: 40,
  reason: 'Agreement approval',
  location: 'Remote Office',
  borderColor: [0.8, 0, 0] as Color,
  borderWidth: 1
})

// Add witness signature field
doc2.text('Witness Signature:', 50, 250, 12)
doc2.addSignatureField({
  name: 'witness',
  page: 0,
  x: 180,
  y: 230,
  width: 180,
  height: 40,
  reason: 'Witness',
  location: 'Present at signing',
  borderColor: [0, 0.6, 0] as Color,
  borderWidth: 1
})

doc2.text('Date:', 400, 450, 12)
doc2.text('_______________', 400, 430, 12)

doc2.text('Date:', 400, 350, 12)
doc2.text('_______________', 400, 330, 12)

doc2.text('Date:', 400, 250, 12)
doc2.text('_______________', 400, 230, 12)

doc2.save('examples-output/test-signatures-2-contract.pdf')
console.log('✅ Example 2: Contract with multiple signatures created')

// ======================
// Example 3: Styled Signature Fields
// ======================

const doc3 = new PDFDocument({
  size: 'Letter',
  margins: 50
})

doc3.text('Invoice Approval', 50, 750, 24)
doc3.text('Invoice #: INV-2024-001', 50, 720, 12)
doc3.text('Amount: $5,000.00', 50, 705, 12)
doc3.text('Date: January 15, 2024', 50, 690, 12)

// Invoice items
doc3.text('ITEMS:', 50, 650, 14)
doc3.text('1. Consulting Services       $3,000.00', 70, 620, 11)
doc3.text('2. Software License          $1,500.00', 70, 605, 11)
doc3.text('3. Support & Maintenance     $  500.00', 70, 590, 11)
doc3.text('                   TOTAL:    $5,000.00', 70, 570, 11)

// Manager approval
doc3.text('Manager Approval:', 50, 450, 14)
doc3.addSignatureField({
  name: 'managerSignature',
  page: 0,
  x: 50,
  y: 380,
  width: 220,
  height: 60,
  reason: 'Invoice approval',
  location: 'Finance Department',
  contactInfo: 'manager@company.com',
  borderColor: [0.2, 0.4, 0.8] as Color,
  borderWidth: 2,
  showLabels: true
})

// CFO approval
doc3.text('CFO Approval:', 320, 450, 14)
doc3.addSignatureField({
  name: 'cfoSignature',
  page: 0,
  x: 320,
  y: 380,
  width: 220,
  height: 60,
  reason: 'Final invoice approval',
  location: 'Executive Office',
  contactInfo: 'cfo@company.com',
  borderColor: [0.8, 0.2, 0.2] as Color,
  borderWidth: 2,
  showLabels: true
})

doc3.text('Approved by:________________    Date:__________', 50, 350, 10)
doc3.text('Approved by:________________    Date:__________', 320, 350, 10)

doc3.save('examples-output/test-signatures-3-invoice.pdf')
console.log('✅ Example 3: Styled invoice signature fields created')

// ======================
// Example 4: Form with Signature
// ======================

const doc4 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  form: {
    fields: [
      {
        type: 'text',
        name: 'fullName',
        page: 0,
        x: 200,
        y: 680,
        width: 300,
        height: 25,
        fontSize: 12,
        required: true
      },
      {
        type: 'text',
        name: 'email',
        page: 0,
        x: 200,
        y: 640,
        width: 300,
        height: 25,
        fontSize: 12,
        required: true
      },
      {
        type: 'text',
        name: 'phone',
        page: 0,
        x: 200,
        y: 600,
        width: 200,
        height: 25,
        fontSize: 12
      },
      {
        type: 'checkbox',
        name: 'agree',
        page: 0,
        x: 50,
        y: 500,
        width: 15,
        height: 15,
        required: true
      }
    ]
  },
  signature: [
    {
      name: 'applicantSignature',
      page: 0,
      x: 50,
      y: 400,
      width: 250,
      height: 60,
      reason: 'Application submission',
      location: 'Online',
      borderColor: [0, 0, 0] as Color,
      borderWidth: 1
    }
  ]
})

doc4.text('Application Form', 50, 750, 24)

doc4.text('Personal Information', 50, 720, 16)
doc4.text('Full Name *:', 50, 690, 12)
doc4.text('Email *:', 50, 650, 12)
doc4.text('Phone:', 50, 610, 12)

doc4.text('Terms and Conditions', 50, 540, 16)
doc4.text('I agree to the terms and conditions *', 75, 505, 12)

doc4.text('Signature *:', 50, 470, 14)
doc4.text('By signing below, you certify that all information is accurate.', 50, 455, 10)

doc4.text('* Required fields', 50, 350, 10)

doc4.save('examples-output/test-signatures-4-form.pdf')
console.log('✅ Example 4: Form with signature field created')

// ======================
// Example 5: Document Certification
// ======================

const doc5 = new PDFDocument({
  size: 'Letter',
  margins: 50
})

doc5.text('Document Certification', 50, 750, 24)
doc5.text('Certificate of Authenticity', 50, 710, 18)

doc5.text('This document certifies that:', 50, 670, 12)
doc5.text('• The information contained herein is accurate and complete', 70, 650, 11)
doc5.text('• All data has been verified by authorized personnel', 70, 635, 11)
doc5.text('• This certificate is valid as of the date of signature', 70, 620, 11)

doc5.text('Document ID: DOC-2024-12345', 50, 580, 11)
doc5.text('Issue Date: January 15, 2024', 50, 565, 11)
doc5.text('Valid Until: January 15, 2025', 50, 550, 11)

// Certification signature
doc5.text('Authorized Signature:', 50, 450, 14)
doc5.addSignatureField({
  name: 'certificationSignature',
  page: 0,
  x: 50,
  y: 350,
  width: 250,
  height: 80,
  reason: 'Document certification',
  location: 'Certification Authority',
  contactInfo: 'certify@authority.com',
  borderColor: [0.6, 0, 0.6] as Color,
  borderWidth: 2
})

doc5.text('Name: _______________________________', 50, 320, 10)
doc5.text('Title: _______________________________', 50, 305, 10)
doc5.text('Date:  _______________________________', 50, 290, 10)

// Add official seal placeholder
doc5.circle({ x: 450, y: 380, radius: 50, strokeColor: [0, 0, 0] as Color, strokeWidth: 2 })
doc5.text('OFFICIAL', 420, 385, 10)
doc5.text('SEAL', 432, 370, 10)

doc5.save('examples-output/test-signatures-5-certification.pdf')
console.log('✅ Example 5: Document certification created')

console.log('\n✍️  All signature examples created successfully!')
console.log('   5 PDFs demonstrating:')
console.log('   1. Simple signature field')
console.log('   2. Multi-party contract signatures')
console.log('   3. Styled invoice approval signatures')
console.log('   4. Form with signature field')
console.log('   5. Document certification\n')
console.log('📝 Note: These PDFs contain signature fields that can be signed')
console.log('   using Adobe Acrobat Reader or other PDF viewers.\n')
