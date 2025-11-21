import { PDFDocument } from '../src'

console.log('📑 Testing Optional Content Groups (Layers)...\n')

// ======================
// Example 1: Basic Layers
// ======================

const doc1 = new PDFDocument({ size: 'Letter', margins: 50 })

// Create layers
doc1.createLayer({ name: 'Background', visible: true })
doc1.createLayer({ name: 'Text', visible: true })
doc1.createLayer({ name: 'Watermark', visible: false })

doc1.text('Example 1: Basic Layers', 50, 750, 20)
doc1.text('Open the Layers panel to toggle layers on/off', 50, 720, 12)

// Draw on Background layer
doc1.beginLayer('Background')
doc1.setFillColor(0.95, 0.95, 1)
doc1.rect(50, 600, 500, 100)
doc1.fill()
doc1.endLayer()

// Draw on Text layer
doc1.beginLayer('Text')
doc1.setFillColor(0, 0, 0)
doc1.text('This text is on the "Text" layer', 60, 660, 14)
doc1.text('You can toggle it in the Layers panel', 60, 640, 12)
doc1.endLayer()

// Draw on Watermark layer (initially hidden)
doc1.beginLayer('Watermark')
doc1.setFillColor(1, 0, 0)
doc1.opacity(0.3)
doc1.text('CONFIDENTIAL', 150, 500, 48)
doc1.opacity(1)
doc1.endLayer()

doc1.text('Try toggling the "Watermark" layer to see it appear/disappear', 50, 400, 12)

doc1.save('examples-output/layers-1-basic.pdf')
console.log('✅ Example 1: Basic layers created')

// ======================
// Example 2: Print vs Screen Layers
// ======================

const doc2 = new PDFDocument({ size: 'Letter', margins: 50 })

// Create layers with different print/view settings
doc2.createLayer({ name: 'Always', visible: true, printable: true })
doc2.createLayer({ name: 'ScreenOnly', visible: true, printable: false })
doc2.createLayer({ name: 'PrintOnly', visible: false, printable: true })

doc2.text('Example 2: Print vs Screen Layers', 50, 750, 20)

// Always visible layer
doc2.beginLayer('Always')
doc2.setFillColor(0, 0, 0)
doc2.text('This content is visible on screen AND when printing', 50, 700, 12)
doc2.endLayer()

// Screen only layer
doc2.beginLayer('ScreenOnly')
doc2.setFillColor(0, 0, 1)
doc2.text('This content is visible on SCREEN but NOT when printing', 50, 650, 12)
doc2.rect(50, 630, 500, 2)
doc2.setFillColor(0, 0, 1)
doc2.fill()
doc2.endLayer()

// Print only layer
doc2.beginLayer('PrintOnly')
doc2.setFillColor(1, 0, 0)
doc2.text('This content is visible when PRINTING but NOT on screen', 50, 600, 12)
doc2.rect(50, 580, 500, 2)
doc2.setFillColor(1, 0, 0)
doc2.fill()
doc2.endLayer()

doc2.text('Toggle layers and try printing to see the differences', 50, 500, 12)

doc2.save('examples-output/layers-2-print-screen.pdf')
console.log('✅ Example 2: Print vs screen layers created')

// ======================
// Example 3: Design Workflow Layers
// ======================

const doc3 = new PDFDocument({ size: 'Letter', margins: 50 })

// Create layers for design workflow
doc3.createLayer({ name: 'Final', visible: true })
doc3.createLayer({ name: 'Drafts', visible: true })
doc3.createLayer({ name: 'Guidelines', visible: false })
doc3.createLayer({ name: 'Notes', visible: false })

doc3.text('Example 3: Design Workflow Layers', 50, 750, 20)

// Final content
doc3.beginLayer('Final')
doc3.setFillColor(0, 0, 0)
doc3.text('Final Document Title', 200, 650, 24)
doc3.text('This is the final approved content', 50, 600, 14)
doc3.endLayer()

// Draft versions
doc3.beginLayer('Drafts')
doc3.setFillColor(0.7, 0.7, 0.7)
doc3.opacity(0.5)
doc3.text('Draft Title v1', 200, 550, 18)
doc3.text('Draft Title v2', 200, 520, 18)
doc3.opacity(1)
doc3.endLayer()

// Design guidelines
doc3.beginLayer('Guidelines')
doc3.setStrokeColor(1, 0, 0)
doc3.setLineWidth(1)
// Center lines (dash pattern not available yet, use solid lines)
doc3.moveTo(306, 0)
doc3.lineTo(306, 792)
doc3.stroke()
doc3.moveTo(0, 396)
doc3.lineTo(612, 396)
doc3.stroke()
doc3.endLayer()

// Design notes
doc3.beginLayer('Notes')
doc3.setFillColor(0, 0.5, 0)
doc3.text('NOTE: Center title in final version', 50, 450, 10)
doc3.text('NOTE: Increase font size for better readability', 50, 430, 10)
doc3.endLayer()

doc3.text('Toggle "Guidelines" and "Notes" layers to see design aids', 50, 350, 12)

doc3.save('examples-output/layers-3-workflow.pdf')
console.log('✅ Example 3: Design workflow layers created')

// ======================
// Example 4: Multi-language Content
// ======================

const doc4 = new PDFDocument({ size: 'Letter', margins: 50 })

// Create layers for different languages
doc4.createLayer({ name: 'English', visible: true })
doc4.createLayer({ name: 'Spanish', visible: false })
doc4.createLayer({ name: 'French', visible: false })

doc4.text('Example 4: Multi-language Content', 50, 750, 20)
doc4.text('Toggle language layers to switch content', 50, 720, 12)

// English layer
doc4.beginLayer('English')
doc4.setFillColor(0, 0, 0)
doc4.text('Welcome', 50, 650, 24)
doc4.text('This is an example of multi-language support using layers.', 50, 620, 14)
doc4.text('Toggle between language layers to view different translations.', 50, 600, 14)
doc4.endLayer()

// Spanish layer (intentionally in Spanish as example text)
doc4.beginLayer('Spanish')
doc4.setFillColor(0, 0, 0)
doc4.text('Bienvenido', 50, 650, 24)
doc4.text('Este es un ejemplo de soporte multiidioma usando capas.', 50, 620, 14)
doc4.text('Alterna entre las capas de idioma para ver diferentes traducciones.', 50, 600, 14)
doc4.endLayer()

// French layer
doc4.beginLayer('French')
doc4.setFillColor(0, 0, 0)
doc4.text('Bienvenue', 50, 650, 24)
doc4.text('Ceci est un exemple de support multilingue utilisant des calques.', 50, 620, 14)
doc4.text('Basculez entre les calques de langue pour afficher différentes traductions.', 50, 600, 14)
doc4.endLayer()

doc4.save('examples-output/layers-4-multilang.pdf')
console.log('✅ Example 4: Multi-language layers created')

console.log('\n📑 All layer examples created successfully!')
console.log('   4 PDFs demonstrating:')
console.log('   1. Basic layers (visible/hidden)')
console.log('   2. Print vs screen layers')
console.log('   3. Design workflow layers (drafts, guidelines, notes)')
console.log('   4. Multi-language content layers\n')
