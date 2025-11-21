import { PDFDocument } from '../src/core/PDFDocument'
import * as path from 'path'

/**
 * Test simple de file attachments
 */
const doc = new PDFDocument()

// Título
doc.text('Test de File Attachments', 100, 750, 24)
doc.text('This PDF tiene file attachments embebidos', 100, 720, 14)

// 1. Adjuntar un archivo JSON (desde Buffer)
const jsonData = {
  nombre: 'PDFStudio',
  version: '1.0.0',
  fecha: new Date().toISOString(),
  caracteristicas: ['charts', 'forms', 'attachments', 'compression']
}

doc.attachFile({
  name: 'datos.json',
  file: Buffer.from(JSON.stringify(jsonData, null, 2)),
  description: 'Datos en formato JSON',
  mimeType: 'application/json'
})

doc.text('1. Archivo JSON adjunto (datos.json)', 100, 680, 12)
doc.text('   - Open el panel de "Attachments" para verlo', 120, 660, 10)

// 2. Adjuntar un archivo de texto (desde Buffer)
const textoData = `
Esto es un archivo de texto adjunto al PDF.

PDFStudio soporta:
- Attachments a nivel de document (panel de adjuntos)
- Attachments a nivel de page (iconos visibles)
- Múltiples formatos de archivo
- Archivos desde Buffer o rutas de archivo

Creado: ${new Date().toLocaleString('es-ES')}
`

doc.attachFile({
  name: 'notas.txt',
  file: Buffer.from(textoData),
  description: 'Notas en texto plano',
  mimeType: 'text/plain'
})

doc.text('2. Archivo de texto adjunto (notas.txt)', 100, 630, 12)

// 3. Page-level attachment annotation (ícono visible en la page)
doc.text('3. Attachment con ícono visible ->', 100, 580, 12)
doc.addFileAnnotation({
  name: 'info-rapida.txt',
  file: Buffer.from('¡Haz clic en el ícono para ver este archivo!\\n\\nEsto es un attachment a nivel de page.'),
  x: 300,
  y: 575,
  icon: 'Paperclip',
  description: 'Información rápida'
})

// 4. Diferentes iconos
doc.text('4. Diferentes iconos disponibles:', 100, 530, 12)

doc.text('PushPin ->', 120, 500, 10)
doc.addFileAnnotation({
  name: 'pushpin.txt',
  file: Buffer.from('Archivo con ícono PushPin'),
  x: 200,
  y: 495,
  icon: 'PushPin'
})

doc.text('Graph ->', 120, 470, 10)
doc.addFileAnnotation({
  name: 'graph-data.json',
  file: Buffer.from('{"data": [1, 2, 3, 4, 5]}'),
  x: 200,
  y: 465,
  icon: 'Graph',
  mimeType: 'application/json'
})

doc.text('Tag ->', 120, 440, 10)
doc.addFileAnnotation({
  name: 'tag.txt',
  file: Buffer.from('Archivo con ícono Tag'),
  x: 200,
  y: 435,
  icon: 'Tag'
})

// Instrucciones
doc.text('Como ver los attachments:', 100, 380, 16)
doc.text('- En Adobe Acrobat: View > Show/Hide > Navigation Panes > Attachments', 120, 360, 10)
doc.text('- Los iconos en la pagina son clickeables directamente', 120, 345, 10)
doc.text('- Preview (Mac) tiene soporte limitado', 120, 330, 10)

// Guardar
const outputPath = path.join(__dirname, 'output', 'mi-test-attachments.pdf')
doc.save(outputPath)

console.log('✅ PDF generado successfully!')
console.log(`📄 Archivo: ${outputPath}`)
console.log('\\n📎 File attachments incluidos:')
console.log('   - datos.json (document-level)')
console.log('   - notas.txt (document-level)')
console.log('   - info-rapida.txt (page-level con ícono Paperclip)')
console.log('   - pushpin.txt (page-level con ícono PushPin)')
console.log('   - graph-data.json (page-level con ícono Graph)')
console.log('   - tag.txt (page-level con ícono Tag)')
console.log('\\n👉 Open el PDF y verifica los attachments!')
