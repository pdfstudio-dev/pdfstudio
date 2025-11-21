import { PDFDocument } from '../src/core/PDFDocument'
import * as path from 'path'
import * as fs from 'fs'

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'output')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

/**
 * Example 1: User password protection
 * Requires password to open the document
 */
function example1() {
  console.log('Generating Example 1: User password protection...')

  const doc = new PDFDocument({
    security: {
      userPassword: 'user123'  // Password required to open
    }
  })

  doc.text('Confidential Document', 100, 700, 24)
  doc.text('This document is protected with a user password.', 100, 670, 12)
  doc.text('Password: user123', 100, 650, 12)
  doc.text('', 100, 630, 12)
  doc.text('You needed to enter this password to open the document.', 100, 610, 12)

  doc.save(path.join(outputDir, 'security-1-user-password.pdf'))
  console.log('  > Saved: security-1-user-password.pdf')
  console.log('  > Password to open: user123')
}

/**
 * Example 2: Owner password protection
 * Requires password to change permissions/security settings
 */
function example2() {
  console.log('Generating Example 2: Owner password protection...')

  const doc = new PDFDocument({
    security: {
      ownerPassword: 'owner456'  // Password required to modify security
    }
  })

  doc.text('Owner-Protected Document', 100, 700, 24)
  doc.text('This document has an owner password.', 100, 670, 12)
  doc.text('Owner password: owner456', 100, 650, 12)
  doc.text('', 100, 630, 12)
  doc.text('The document can be opened without a password,', 100, 610, 12)
  doc.text('but changing security settings requires the owner password.', 100, 590, 12)

  doc.save(path.join(outputDir, 'security-2-owner-password.pdf'))
  console.log('  > Saved: security-2-owner-password.pdf')
  console.log('  > Owner password: owner456')
}

/**
 * Example 3: Both user and owner passwords
 */
function example3() {
  console.log('Generating Example 3: User + Owner passwords...')

  const doc = new PDFDocument({
    security: {
      userPassword: 'user123',    // Password to open
      ownerPassword: 'owner456'   // Password to change security
    }
  })

  doc.text('Fully Password Protected', 100, 700, 24)
  doc.text('This document has both user and owner passwords.', 100, 670, 12)
  doc.text('', 100, 650, 12)
  doc.text('User password: user123 (required to open)', 100, 630, 12)
  doc.text('Owner password: owner456 (required to change security)', 100, 610, 12)

  doc.save(path.join(outputDir, 'security-3-both-passwords.pdf'))
  console.log('  > Saved: security-3-both-passwords.pdf')
  console.log('  > User password: user123')
  console.log('  > Owner password: owner456')
}

/**
 * Example 4: No printing allowed
 */
function example4() {
  console.log('Generating Example 4: No printing allowed...')

  const doc = new PDFDocument({
    security: {
      ownerPassword: 'owner789',
      permissions: {
        printing: false  // Disable printing
      }
    }
  })

  doc.text('No Printing Allowed', 100, 700, 24)
  doc.text('This document cannot be printed.', 100, 670, 12)
  doc.text('', 100, 650, 12)
  doc.text('Try to print this document - you will be denied.', 100, 630, 12)
  doc.text('', 100, 610, 12)
  doc.text('Owner password: owner789', 100, 590, 12)

  doc.save(path.join(outputDir, 'security-4-no-printing.pdf'))
  console.log('  > Saved: security-4-no-printing.pdf')
  console.log('  > Printing disabled')
}

/**
 * Example 5: Low resolution printing only
 */
function example5() {
  console.log('Generating Example 5: Low resolution printing only...')

  const doc = new PDFDocument({
    security: {
      ownerPassword: 'owner789',
      permissions: {
        printing: 'lowResolution'  // Allow only low-res printing
      }
    }
  })

  doc.text('Low Resolution Printing Only', 100, 700, 24)
  doc.text('This document can only be printed at low resolution.', 100, 670, 12)
  doc.text('', 100, 650, 12)
  doc.text('High quality printing is disabled.', 100, 630, 12)
  doc.text('', 100, 610, 12)
  doc.text('Owner password: owner789', 100, 590, 12)

  doc.save(path.join(outputDir, 'security-5-low-res-print.pdf'))
  console.log('  > Saved: security-5-low-res-print.pdf')
  console.log('  > Low resolution printing only')
}

/**
 * Example 6: No copying/extracting text
 */
function example6() {
  console.log('Generating Example 6: No copying text...')

  const doc = new PDFDocument({
    security: {
      ownerPassword: 'owner789',
      permissions: {
        copying: false  // Disable text/image copying
      }
    }
  })

  doc.text('No Copying Allowed', 100, 700, 24)
  doc.text('You cannot copy text or images from this document.', 100, 670, 12)
  doc.text('', 100, 650, 12)
  doc.text('Try to select and copy this text - you will be denied.', 100, 630, 12)
  doc.text('', 100, 610, 12)
  doc.text('This is confidential information that should not be extracted.', 100, 590, 12)

  doc.save(path.join(outputDir, 'security-6-no-copying.pdf'))
  console.log('  > Saved: security-6-no-copying.pdf')
  console.log('  > Copying disabled')
}

/**
 * Example 7: No modifying allowed
 */
function example7() {
  console.log('Generating Example 7: No modifications allowed...')

  const doc = new PDFDocument({
    security: {
      ownerPassword: 'owner789',
      permissions: {
        modifying: false  // Disable document modification
      }
    }
  })

  doc.text('Read-Only Document', 100, 700, 24)
  doc.text('This document cannot be modified.', 100, 670, 12)
  doc.text('', 100, 650, 12)
  doc.text('Editing is disabled to preserve document integrity.', 100, 630, 12)

  doc.save(path.join(outputDir, 'security-7-no-modifying.pdf'))
  console.log('  > Saved: security-7-no-modifying.pdf')
  console.log('  > Modification disabled')
}

/**
 * Example 8: No annotations allowed
 */
function example8() {
  console.log('Generating Example 8: No annotations allowed...')

  const doc = new PDFDocument({
    security: {
      ownerPassword: 'owner789',
      permissions: {
        annotating: false  // Disable adding comments/annotations
      }
    }
  })

  doc.text('No Annotations Allowed', 100, 700, 24)
  doc.text('You cannot add comments or annotations to this document.', 100, 670, 12)
  doc.text('', 100, 650, 12)
  doc.text('Try to add a comment - you will be denied.', 100, 630, 12)

  doc.save(path.join(outputDir, 'security-8-no-annotations.pdf'))
  console.log('  > Saved: security-8-no-annotations.pdf')
  console.log('  > Annotations disabled')
}

/**
 * Example 9: No form filling
 */
function example9() {
  console.log('Generating Example 9: No form filling...')

  const doc = new PDFDocument({
    security: {
      ownerPassword: 'owner789',
      permissions: {
        fillingForms: false  // Disable filling form fields
      }
    },
    form: {
      needAppearances: true
    }
  })

  doc.text('Form - No Filling Allowed', 100, 700, 24)
  doc.text('This form cannot be filled out.', 100, 670, 12)

  // Add a text field (just for demonstration)
  doc.addFormField({
    type: 'text',
    name: 'name',
    page: 0,
    x: 100,
    y: 600,
    width: 200,
    height: 30,
    fontSize: 12
  })

  doc.text('Name:', 100, 635, 12)

  doc.save(path.join(outputDir, 'security-9-no-form-filling.pdf'))
  console.log('  > Saved: security-9-no-form-filling.pdf')
  console.log('  > Form filling disabled')
}

/**
 * Example 10: Multiple restrictions combined
 */
function example10() {
  console.log('Generating Example 10: Multiple restrictions...')

  const doc = new PDFDocument({
    security: {
      userPassword: 'view123',
      ownerPassword: 'admin456',
      permissions: {
        printing: 'lowResolution',  // Only low-res printing
        modifying: false,            // No modifications
        copying: false,              // No copying
        annotating: false,           // No annotations
        fillingForms: true,          // Allow form filling
        contentAccessibility: true,  // Allow accessibility tools
        documentAssembly: false      // No page assembly
      }
    }
  })

  doc.text('Highly Restricted Document', 100, 700, 24)
  doc.text('This document has multiple security restrictions:', 100, 670, 12)
  doc.text('', 100, 650, 12)
  doc.text('- Requires password to open (view123)', 100, 630, 11)
  doc.text('- Only low-resolution printing allowed', 100, 610, 11)
  doc.text('- No modifications allowed', 100, 590, 11)
  doc.text('- No copying text or images', 100, 570, 11)
  doc.text('- No annotations allowed', 100, 550, 11)
  doc.text('- No document assembly (page reordering)', 100, 530, 11)
  doc.text('- Form filling IS allowed', 100, 510, 11)
  doc.text('- Accessibility tools ARE allowed', 100, 490, 11)
  doc.text('', 100, 470, 12)
  doc.text('Owner password: admin456', 100, 450, 11)

  doc.save(path.join(outputDir, 'security-10-multiple-restrictions.pdf'))
  console.log('  > Saved: security-10-multiple-restrictions.pdf')
  console.log('  > User password: view123')
  console.log('  > Owner password: admin456')
  console.log('  > Multiple restrictions applied')
}

/**
 * Example 11: Read-only with accessibility
 */
function example11() {
  console.log('Generating Example 11: Read-only with accessibility...')

  const doc = new PDFDocument({
    security: {
      ownerPassword: 'owner789',
      permissions: {
        printing: false,
        modifying: false,
        copying: false,
        annotating: false,
        contentAccessibility: true  // Allow screen readers
      }
    }
  })

  doc.text('Accessible Read-Only Document', 100, 700, 24)
  doc.text('This document is read-only but accessible to assistive technologies.', 100, 670, 12)
  doc.text('', 100, 650, 12)
  doc.text('Screen readers and accessibility tools can access the content,', 100, 630, 12)
  doc.text('but users cannot print, copy, or modify the document.', 100, 610, 12)

  doc.save(path.join(outputDir, 'security-11-accessible-readonly.pdf'))
  console.log('  > Saved: security-11-accessible-readonly.pdf')
  console.log('  > Read-only with accessibility enabled')
}

/**
 * Example 12: High security corporate document
 */
function example12() {
  console.log('Generating Example 12: High security corporate document...')

  const doc = new PDFDocument({
    security: {
      userPassword: 'corporate2025',
      ownerPassword: 'admin-secure-2025',
      permissions: {
        printing: false,
        modifying: false,
        copying: false,
        annotating: false,
        fillingForms: false,
        contentAccessibility: true,
        documentAssembly: false
      }
    },
    info: {
      Title: 'Confidential Corporate Report',
      Author: 'Company Inc.',
      Subject: 'Q4 2024 Financial Report',
      Keywords: 'confidential, financial, report'
    }
  })

  doc.text('CONFIDENTIAL', 250, 750, 28)
  doc.text('Q4 2024 Financial Report', 150, 710, 20)
  doc.text('Company Inc.', 220, 685, 14)

  doc.text('', 100, 660, 12)
  doc.text('This document contains confidential financial information.', 100, 640, 12)
  doc.text('Unauthorized distribution is prohibited.', 100, 620, 12)
  doc.text('', 100, 600, 12)
  doc.text('Security Features:', 100, 580, 14)
  doc.text('- Password protected (corporate2025)', 100, 560, 11)
  doc.text('- Printing disabled', 100, 540, 11)
  doc.text('- Copying disabled', 100, 520, 11)
  doc.text('- Modifications disabled', 100, 500, 11)
  doc.text('- Full encryption enabled', 100, 480, 11)

  // Add watermark
  doc.addTextWatermark({
    text: 'CONFIDENTIAL',
    position: 'diagonal',
    rotation: 45,
    opacity: 0.1,
    fontSize: 72,
    color: [0.8, 0, 0]
  })

  doc.save(path.join(outputDir, 'security-12-corporate-confidential.pdf'))
  console.log('  > Saved: security-12-corporate-confidential.pdf')
  console.log('  > User password: corporate2025')
  console.log('  > Owner password: admin-secure-2025')
  console.log('  > Maximum security applied')
}

// Run all examples
console.log('\n=== PDFStudio Security/Encryption Examples ===\n')

example1()
example2()
example3()
example4()
example5()
example6()
example7()
example8()
example9()
example10()
example11()
example12()

console.log('\n=== All security examples generated successfully! ===')
console.log(`Output directory: ${outputDir}`)
console.log('\nNOTE: Open these PDFs to test password protection and permissions.')
console.log('Some features may require Adobe Acrobat Reader to fully test.\n')
