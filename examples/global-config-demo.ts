import { PDFDocument, configure, resetConfig } from '../src'
import * as path from 'path'
import * as fs from 'fs'

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'output')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

console.log('=== PDFStudio Global Configuration Demo ===\n')

/**
 * Example 1: Default Configuration (Library Defaults)
 */
console.log('1️⃣  Creating PDF with default configuration...')

const doc1 = new PDFDocument({
  info: {
    Title: 'Default Configuration Example',
    Author: 'Test User'
  }
})

doc1.text('Default Configuration', 200, 750, 20)
doc1.text('This PDF uses library default values:', 100, 700, 14)
doc1.text('• Creator: PDFStudio', 120, 670, 12)
doc1.text('• Producer: PDFStudio PDF Library', 120, 650, 12)
doc1.text('• Annotation Author: PDFStudio', 120, 630, 12)

doc1.text('Check PDF properties to verify metadata!', 100, 580, 12)

// Add an annotation to test annotation author
doc1.addAnnotation({
  type: 'text',
  page: 0,
  x: 100,
  y: 500,
  contents: 'This annotation uses the default author'
})

doc1.save(path.join(outputDir, 'config-1-default.pdf'))
console.log('   ✅ Saved: config-1-default.pdf\n')

/**
 * Example 2: Custom Company Configuration
 */
console.log('2️⃣  Configuring custom company defaults...')

configure({
  defaultCreator: 'Acme Corporation',
  defaultProducer: 'Acme PDF Generator v2.0',
  defaultAnnotationAuthor: 'Acme System'
})

const doc2 = new PDFDocument({
  info: {
    Title: 'Custom Configuration Example',
    Author: 'Jane Doe'
  }
})

doc2.enableXMPMetadata()

doc2.text('Custom Configuration', 200, 750, 20)
doc2.text('This PDF uses company-specific defaults:', 100, 700, 14)
doc2.text('• Creator: Acme Corporation', 120, 670, 12)
doc2.text('• Producer: Acme PDF Generator v2.0', 120, 650, 12)
doc2.text('• Annotation Author: Acme System', 120, 630, 12)

doc2.text('Configuration applies to all new PDFs!', 100, 580, 12)

// Add an annotation with custom author
doc2.addAnnotation({
  type: 'text',
  page: 0,
  x: 100,
  y: 500,
  contents: 'Annotation with company default author'
})

doc2.save(path.join(outputDir, 'config-2-custom-company.pdf'))
console.log('   ✅ Saved: config-2-custom-company.pdf\n')

/**
 * Example 3: Override Configuration Per Document
 */
console.log('3️⃣  Overriding configuration per document...')

// Global config is still set to Acme Corporation
const doc3 = new PDFDocument({
  info: {
    Title: 'Per-Document Override',
    Author: 'Bob Smith',
    Creator: 'Special Project Tool',  // Override global default
    Producer: 'Special Project Tool v1.0'  // Override global default
  }
})

doc3.text('Per-Document Override', 200, 750, 20)
doc3.text('This PDF overrides global configuration:', 100, 700, 14)
doc3.text('• Creator: Special Project Tool (overridden)', 120, 670, 12)
doc3.text('• Producer: Special Project Tool v1.0 (overridden)', 120, 650, 12)

doc3.text('Global config is still active for other PDFs!', 100, 600, 12)

// Add annotation with explicit author (overrides default)
doc3.addAnnotation({
  type: 'text',
  page: 0,
  x: 100,
  y: 500,
  contents: 'Custom annotation text',
  author: 'Bob Smith'  // Explicit author overrides default
})

doc3.save(path.join(outputDir, 'config-3-override.pdf'))
console.log('   ✅ Saved: config-3-override.pdf\n')

/**
 * Example 4: Reset to Library Defaults
 */
console.log('4️⃣  Resetting to library defaults...')

resetConfig()

const doc4 = new PDFDocument({
  info: {
    Title: 'Reset Configuration Example',
    Author: 'Test User'
  }
})

doc4.text('Reset Configuration', 200, 750, 20)
doc4.text('Configuration has been reset to library defaults:', 100, 700, 14)
doc4.text('• Creator: PDFStudio', 120, 670, 12)
doc4.text('• Producer: PDFStudio PDF Library', 120, 650, 12)
doc4.text('• Annotation Author: PDFStudio', 120, 630, 12)

doc4.text('Use resetConfig() for testing or cleanup!', 100, 580, 12)

doc4.save(path.join(outputDir, 'config-4-reset.pdf'))
console.log('   ✅ Saved: config-4-reset.pdf\n')

/**
 * Example 5: Partial Configuration
 */
console.log('5️⃣  Setting partial configuration...')

configure({
  defaultCreator: 'My Application',
  // Only override Creator, keep other defaults
})

const doc5 = new PDFDocument({
  info: {
    Title: 'Partial Configuration Example',
    Author: 'Test User'
  }
})

doc5.text('Partial Configuration', 200, 750, 20)
doc5.text('Only Creator was customized:', 100, 700, 14)
doc5.text('• Creator: My Application (custom)', 120, 670, 12)
doc5.text('• Producer: PDFStudio PDF Library (default)', 120, 650, 12)
doc5.text('• Annotation Author: PDFStudio (default)', 120, 630, 12)

doc5.text('You can configure only what you need!', 100, 580, 12)

doc5.save(path.join(outputDir, 'config-5-partial.pdf'))
console.log('   ✅ Saved: config-5-partial.pdf\n')

/**
 * Example 6: Multiple Languages Configuration
 */
console.log('6️⃣  Multi-language configuration example...')

resetConfig()

configure({
  defaultCreator: 'Sistema de Documentos',
  defaultProducer: 'Generador PDF Empresarial',
  defaultAnnotationAuthor: 'Sistema Automático'
})

const doc6 = new PDFDocument({
  info: {
    Title: 'Configuración Multiidioma',
    Author: 'Usuario de Prueba',
    Subject: 'Ejemplo de metadatos en español',
    Keywords: 'pdf, configuración, español'
  }
})

doc6.enableXMPMetadata()

doc6.text('Multi-Language Configuration', 170, 750, 20)
doc6.text('Configuration supports any language:', 140, 700, 14)
doc6.text('• Creator: Sistema de Documentos', 120, 670, 12)
doc6.text('• Producer: Generador PDF Empresarial', 120, 650, 12)
doc6.text('• Annotation Author: Sistema Automático', 120, 630, 12)

doc6.text('Perfect for international applications!', 140, 580, 12)

doc6.save(path.join(outputDir, 'config-6-multilingual.pdf'))
console.log('   ✅ Saved: config-6-multilingual.pdf\n')

// Reset to defaults for cleanup
resetConfig()

console.log('=== Summary ===')
console.log('Generated 6 PDF examples demonstrating global configuration:')
console.log('  1. config-1-default.pdf - Library defaults')
console.log('  2. config-2-custom-company.pdf - Company-wide configuration')
console.log('  3. config-3-override.pdf - Per-document overrides')
console.log('  4. config-4-reset.pdf - Reset to defaults')
console.log('  5. config-5-partial.pdf - Partial configuration')
console.log('  6. config-6-multilingual.pdf - Multi-language support')
console.log('\n📁 Output directory:', outputDir)
console.log('\n💡 Usage Pattern:')
console.log('   import { configure } from "pdfstudio"')
console.log('   configure({ defaultCreator: "My Company" })')
console.log('   // All subsequent PDFs use these defaults!')
console.log()
