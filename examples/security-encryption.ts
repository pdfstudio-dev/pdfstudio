import { PDFDocument } from '../src'

console.log('🔒 Generating PDFs con security y encryption...\n')

// ======================
// Example 1: Solo password de usuario (userPassword)
// ======================
console.log('1️⃣ Solo password de usuario...')

const doc1 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  info: {
    Title: 'Protected Document - User Password Only'
  },
  security: {
    userPassword: 'secreto123'  // ← Password to open
  }
})

doc1.text('PASSWORD PROTECTED DOCUMENT', 100, 700, 20)
doc1.text('', 100, 660)
doc1.text('This PDF requires password to open:', 100, 640, 14)
doc1.text('Password: secreto123', 100, 615, 12)
doc1.text('', 100, 590)
doc1.text('Once opened, the user has ALL permissions:', 100, 570, 12)
doc1.text('✓ Can print', 120, 550, 11)
doc1.text('✓ Can modify', 120, 530, 11)
doc1.text('✓ Can copy text', 120, 510, 11)
doc1.text('✓ Can add annotations', 120, 490, 11)

doc1.save('examples-output/security-01-user-password.pdf')
console.log('   ✅ examples-output/security-01-user-password.pdf')
console.log('      Password: secreto123\n')

// ======================
// Example 2: User y Owner passwords (different)
// ======================
console.log('2️⃣ User y Owner passwords...')

const doc2 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  info: {
    Title: 'Document with Owner Password'
  },
  security: {
    userPassword: 'usuario123',   // ← To open
    ownerPassword: 'admin456'     // ← To change permissions
  }
})

doc2.text('DOCUMENT WITH OWNER PASSWORD', 150, 700, 20)
doc2.text('', 100, 660)
doc2.text('This PDF has TWO password levels:', 100, 640, 14)
doc2.text('', 100, 615)
doc2.text('1. User Password: usuario123', 120, 595, 12)
doc2.text('   → Opens the document with normal permissions', 130, 575, 11)
doc2.text('', 100, 550)
doc2.text('2. Owner Password: admin456', 120, 530, 12)
doc2.text('   → Full access + can change permissions', 130, 510, 11)

doc2.save('examples-output/security-02-owner-password.pdf')
console.log('   ✅ examples-output/security-02-owner-password.pdf')
console.log('      User Password: usuario123')
console.log('      Owner Password: admin456\n')

// ======================
// Example 3: Permissions granulares - No printing
// ======================
console.log('3️⃣ Permissions: Sin printing...')

const doc3 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  info: {
    Title: 'Document sin Printing'
  },
  security: {
    userPassword: 'leer123',
    ownerPassword: 'admin123',
    permissions: {
      printing: false,         // ← ❌ No permitir imprimir
      modifying: true,
      copying: true,
      annotating: true
    }
  }
})

doc3.text('DOCUMENT WITHOUT PRINT PERMISSION', 120, 700, 20)
doc3.text('', 100, 660)
doc3.text('Configured permissions:', 100, 640, 14)
doc3.text('', 100, 615)
doc3.text('❌ Printing: Disabled', 120, 595, 12)
doc3.text('✅ Modification: Allowed', 120, 575, 12)
doc3.text('✅ Copy text: Allowed', 120, 555, 12)
doc3.text('✅ Annotations: Allowed', 120, 535, 12)
doc3.text('', 100, 510)
doc3.text('When trying to print, the viewer will show it as disabled.', 100, 490, 11)

doc3.save('examples-output/security-03-no-printing.pdf')
console.log('   ✅ examples-output/security-03-no-printing.pdf')
console.log('      Password: leer123')
console.log('      Permissions: No printing\n')

// ======================
// Example 4: Read-only (no modify, no copy)
// ======================
console.log('4️⃣ Permissions: Read-only...')

const doc4 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  info: {
    Title: 'Document de Solo Lectura'
  },
  security: {
    userPassword: 'ver123',
    ownerPassword: 'admin123',
    permissions: {
      printing: 'highResolution',  // ✅ Permitir printing
      modifying: false,             // ❌ No modificar
      copying: false,               // ❌ No copiar
      annotating: false,            // ❌ No anotar
      fillingForms: false,          // ❌ No llenar formularios
      contentAccessibility: true,   // ✅ Accesibilidad (lectores de pantalla)
      documentAssembly: false       // ❌ No reorganizar
    }
  }
})

doc4.text('READ-ONLY DOCUMENT', 150, 700, 20)
doc4.text('', 100, 660)
doc4.text('Strict permission configuration:', 100, 640, 14)
doc4.text('', 100, 615)
doc4.text('✅ Print: Yes (high resolution)', 120, 595, 12)
doc4.text('❌ Modify: No', 120, 575, 12)
doc4.text('❌ Copy text: No', 120, 555, 12)
doc4.text('❌ Add annotations: No', 120, 535, 12)
doc4.text('❌ Fill forms: No', 120, 515, 12)
doc4.text('✅ Accessibility: Yes (screen readers)', 120, 495, 12)
doc4.text('❌ Reorganize pages: No', 120, 475, 12)

doc4.save('examples-output/security-04-read-only.pdf')
console.log('   ✅ examples-output/security-04-read-only.pdf')
console.log('      Password: ver123')
console.log('      Permissions: Read-only + printing\n')

// ======================
// Example 5: Low resolution printing
// ======================
console.log('5️⃣ Permissions: Low resolution printing...')

const doc5 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  info: {
    Title: 'Document - Limited Printing'
  },
  security: {
    userPassword: 'usuario',
    permissions: {
      printing: 'lowResolution',  // ← Low resolution only
      modifying: false,
      copying: false
    }
  }
})

doc5.text('LOW RESOLUTION PRINTING ONLY', 100, 700, 18)
doc5.text('', 100, 660)
doc5.text('This document allows:', 100, 640, 14)
doc5.text('', 100, 615)
doc5.text('✓ Printing in LOW resolution (150 DPI)', 120, 595, 12)
doc5.text('✗ Printing in HIGH resolution (blocked)', 120, 575, 12)
doc5.text('✗ Modification (blocked)', 120, 555, 12)
doc5.text('✗ Copy text (blocked)', 120, 535, 12)
doc5.text('', 100, 510)
doc5.text('Useful to prevent high-quality copies.', 100, 490, 11)

doc5.save('examples-output/security-05-low-res-printing.pdf')
console.log('   ✅ examples-output/security-05-low-res-printing.pdf')
console.log('      Password: usuario')
console.log('      Permissions: Low resolution printing\n')

// ======================
// Example 6: Complete confidential document
// ======================
console.log('6️⃣ Complete confidential document...')

const doc6 = new PDFDocument({
  size: 'Letter',
  margins: 60,
  pdfVersion: '1.4',  // RC4 128-bit encryption
  info: {
    Title: 'CONFIDENTIAL DOCUMENT - Project Alpha',
    Author: 'Legal Department',
    Subject: 'Classified information',
    Keywords: 'confidential, classified, restricted',
    displayTitle: true
  },
  security: {
    userPassword: 'proyecto.alpha.2024',
    ownerPassword: 'admin.legal.xyz.2024',
    permissions: {
      printing: false,              // ❌ Sin printing
      modifying: false,             // ❌ Sin modification
      copying: false,               // ❌ Sin copia
      annotating: false,            // ❌ Sin anotaciones
      fillingForms: false,          // ❌ Sin formularios
      contentAccessibility: true,   // ✅ Accesibilidad
      documentAssembly: false       // ❌ Sin reorganización
    }
  }
})

doc6.text('CONFIDENTIAL', 230, 720, 28)
doc6.text('PROJECT ALPHA', 210, 680, 22)
doc6.text('', 100, 640)
doc6.text('CLASSIFICATION LEVEL: RESTRICTED', 150, 610, 14)
doc6.text('', 100, 580)
doc6.text('This document contains confidential information.', 100, 555, 12)
doc6.text('Access permitted only to authorized personnel.', 100, 535, 12)
doc6.text('', 100, 510)
doc6.text('Protection:', 100, 485, 12)
doc6.text('• Encryption RC4 128-bit', 120, 465, 11)
doc6.text('• Password required to open', 120, 445, 11)
doc6.text('• All permissions disabled', 120, 425, 11)
doc6.text('• Only accessibility for screen readers', 120, 405, 11)

doc6.save('examples-output/security-06-confidential.pdf')
console.log('   ✅ examples-output/security-06-confidential.pdf')
console.log('      User Password: proyecto.alpha.2024')
console.log('      Owner Password: admin.legal.xyz.2024')
console.log('      Nivel: Máxima security\n')

// ======================
// Example 7: Sin password pero con permissions restringidos
// ======================
console.log('7️⃣ Sin password pero con restricciones...')

const doc7 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  info: {
    Title: 'Document Público con Restricciones'
  },
  security: {
    ownerPassword: 'admin789',  // Solo owner password
    // NO userPassword - se puede abrir sin password
    permissions: {
      printing: 'highResolution',
      modifying: false,           // ❌ No modificar
      copying: false,             // ❌ No copiar
      annotating: false           // ❌ No anotar
    }
  }
})

doc7.text('PUBLIC DOCUMENT WITH RESTRICTIONS', 100, 700, 20)
doc7.text('', 100, 660)
doc7.text('Features:', 100, 640, 14)
doc7.text('', 100, 615)
doc7.text('✓ Open WITHOUT password (public access)', 120, 595, 12)
doc7.text('✓ Can be printed', 120, 575, 12)
doc7.text('✗ Cannot be modified', 120, 555, 12)
doc7.text('✗ Text cannot be copied', 120, 535, 12)
doc7.text('✗ Annotations cannot be added', 120, 515, 12)
doc7.text('', 100, 490)
doc7.text('Owner Password (admin789) required to change permissions.', 100, 470, 11)

doc7.save('examples-output/security-07-public-restricted.pdf')
console.log('   ✅ examples-output/security-07-public-restricted.pdf')
console.log('      Open without password')
console.log('      Owner Password: admin789\n')

// ======================
// Summary
// ======================
console.log('✅ All security examples generated!\n')
console.log('📁 Files generated:')
console.log('   • security-01-user-password.pdf (Password: secreto123)')
console.log('   • security-02-owner-password.pdf (User: usuario123 | Owner: admin456)')
console.log('   • security-03-no-printing.pdf (Password: leer123)')
console.log('   • security-04-read-only.pdf (Password: ver123)')
console.log('   • security-05-low-res-printing.pdf (Password: usuario)')
console.log('   • security-06-confidential.pdf (Password: proyecto.alpha.2024)')
console.log('   • security-07-public-restricted.pdf (No password)\n')

console.log('🔒 Implemented security features:')
console.log('   ✓ userPassword - Password to open document')
console.log('   ✓ ownerPassword - Password to change permissions')
console.log('   ✓ printing - Printing control (false, lowResolution, highResolution)')
console.log('   ✓ modifying - Allow/block modification')
console.log('   ✓ copying - Allow/block text copying')
console.log('   ✓ annotating - Allow/block annotations')
console.log('   ✓ fillingForms - Allow/block form filling')
console.log('   ✓ contentAccessibility - Accessibility (screen readers)')
console.log('   ✓ documentAssembly - Allow/block reorganization\n')

console.log('🔐 Encryption:')
console.log('   • Algorithm: RC4')
console.log('   • Bits: 40-bit (PDF 1.3) or 128-bit (PDF 1.4+)')
console.log('   • Standard: PDF Reference 1.7, Algorithms 3.2-3.5\n')

console.log('💡 How to test:')
console.log('   1. Open any PDF in Adobe Reader, Preview, Chrome, etc.')
console.log('   2. It will ask for password (if it has userPassword)')
console.log('   3. Once opened, try to:')
console.log('      - Print (File > Print)')
console.log('      - Copy text (Select + Cmd+C)')
console.log('      - Modify (add annotations)')
console.log('   4. Blocked options will appear disabled/grayed out\n')

console.log('⚠️  Important notes:')
console.log('   • RC4 is considered weak for maximum security')
console.log('   • For critical production, consider AES-256 (PDF 1.7 ext3)')
console.log('   • Permissions are honor system - they can be removed with tools')
console.log('   • Real content encryption is NOT implemented in this version')
console.log('   • Password protection DOES work correctly')
