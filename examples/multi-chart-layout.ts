import { PDFDocument } from '../src'

console.log('📊 Generating PDF con multiple charts en una page...\n')

// ======================
// Dashboard con 4 charts different en una page
// ======================

const doc = new PDFDocument({
  size: 'Letter',  // 612 x 792 puntos
  margins: 40
})

// Obtener dimensiones de la page
const pageWidth = doc.getPageWidth()
const pageHeight = doc.getPageHeight()
const contentX = doc.getContentX()
const contentY = doc.getContentY()
const contentWidth = doc.getContentWidth()
const contentHeight = doc.getContentHeight()

console.log(`📐 Dimensiones de la page:`)
console.log(`   Size total: ${pageWidth} x ${pageHeight} puntos`)
console.log(`   Content area: ${contentWidth} x ${contentHeight} puntos`)
console.log(`   Posición inicial: x=${contentX}, y=${contentY}\n`)

// Título del dashboard
doc.text('DASHBOARD DE VENTAS - Q1 2024', contentX + 130, contentY - 20, 18)

// ======================
// Definir layout en cuadrantes (2x2)
// ======================

const spacing = 20  // Espacio entre charts
const chartWidth = (contentWidth - spacing) / 2
const chartHeight = (contentHeight - 80) / 2  // 80 para el título

// Cuadrante Superior Izquierdo
const chart1X = contentX
const chart1Y = contentY - 60
const chart1Width = chartWidth
const chart1Height = chartHeight

// Cuadrante Superior Derecho
const chart2X = contentX + chartWidth + spacing
const chart2Y = contentY - 60
const chart2Width = chartWidth
const chart2Height = chartHeight

// Cuadrante Inferior Izquierdo
const chart3X = contentX
const chart3Y = contentY - 60 - chartHeight - spacing
const chart3Width = chartWidth
const chart3Height = chartHeight

// Cuadrante Inferior Derecho
const chart4X = contentX + chartWidth + spacing
const chart4Y = contentY - 60 - chartHeight - spacing
const chart4Width = chartWidth
const chart4Height = chartHeight

console.log('📊 Chart 1 (Superior Izquierda - Vertical):')
console.log(`   Posición: x=${chart1X}, y=${chart1Y}`)
console.log(`   Size: ${chart1Width} x ${chart1Height}\n`)

// ======================
// GRÁFICA 1: Sales por Producto (Vertical)
// ======================
doc.barChart({
  data: [
    { label: 'Ene', value: 125 },
    { label: 'Feb', value: 185 },
    { label: 'Mar', value: 95 },
    { label: 'Abr', value: 145 }
  ],
  x: chart1X,
  y: chart1Y - chart1Height + 50,
  width: chart1Width,
  height: chart1Height - 80,
  barColors: ['#3498db', '#2ecc71', '#e74c3c', '#f39c12'],
  title: 'Sales Monthlyes',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showValues: true,
  orientation: 'vertical',
  gradient: {
    enabled: true,
    type: 'linear',
    colors: ['#3498db', '#2980b9']
  }
})

console.log('📊 Chart 2 (Superior Derecha - Horizontal):')
console.log(`   Posición: x=${chart2X}, y=${chart2Y}`)
console.log(`   Size: ${chart2Width} x ${chart2Height}\n`)

// ======================
// GRÁFICA 2: Top Productos (Horizontal)
// ======================
doc.barChart({
  data: [
    { label: 'Laptop Pro', value: 88 },
    { label: 'Smartphone', value: 125 },
    { label: 'Tablet', value: 65 },
    { label: 'Monitor 4K', value: 45 }
  ],
  x: chart2X,
  y: chart2Y - chart2Height + 50,
  width: chart2Width,
  height: chart2Height - 80,
  barColors: ['#9b59b6', '#e74c3c', '#1abc9c', '#f39c12'],
  title: 'Top Productos',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showValues: true,
  orientation: 'horizontal',
  shadow: {
    enabled: true,
    offsetX: 2,
    offsetY: -2
  }
})

console.log('📊 Chart 3 (Inferior Izquierda - Agrupada):')
console.log(`   Posición: x=${chart3X}, y=${chart3Y}`)
console.log(`   Size: ${chart3Width} x ${chart3Height}\n`)

// ======================
// GRÁFICA 3: Comparison Quarterly (Agrupada)
// ======================
doc.groupedBarChart({
  data: [
    {
      label: 'Q1',
      values: [120, 95],
      series: ['2023', '2024']
    },
    {
      label: 'Q2',
      values: [135, 115],
      series: ['2023', '2024']
    },
    {
      label: 'Q3',
      values: [110, 125],
      series: ['2023', '2024']
    }
  ],
  x: chart3X,
  y: chart3Y - chart3Height + 50,
  width: chart3Width,
  height: chart3Height - 80,
  colors: ['#95a5a6', '#2ecc71'],
  title: 'Comparison Annual',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showValues: true,
  orientation: 'vertical',
  legend: {
    show: true,
    position: 'top-right',
    fontSize: 9
  }
})

console.log('📊 Chart 4 (Inferior Derecha - Apilada):')
console.log(`   Posición: x=${chart4X}, y=${chart4Y}`)
console.log(`   Size: ${chart4Width} x ${chart4Height}\n`)

// ======================
// GRÁFICA 4: Distribución de Sales (Apilada Horizontal)
// ======================
doc.stackedBarChart({
  data: [
    {
      label: 'Región Norte',
      values: [45, 35, 20],
      series: ['Online', 'Tienda', 'Mayorista']
    },
    {
      label: 'Región Sur',
      values: [55, 28, 17],
      series: ['Online', 'Tienda', 'Mayorista']
    },
    {
      label: 'Región Este',
      values: [38, 42, 20],
      series: ['Online', 'Tienda', 'Mayorista']
    }
  ],
  x: chart4X,
  y: chart4Y - chart4Height + 50,
  width: chart4Width,
  height: chart4Height - 80,
  colors: ['#3498db', '#e74c3c', '#f39c12'],
  title: 'Canales de Venta',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showValues: false,
  orientation: 'horizontal',
  legend: {
    show: true,
    position: 'top-right',
    fontSize: 9
  }
})

// Guardar el PDF
doc.save('examples-output/multi-chart-layout.pdf')
console.log('✅ PDF generado: examples-output/multi-chart-layout.pdf\n')

console.log('📋 Summary del layout:')
console.log('   ┌─────────────────┬─────────────────┐')
console.log('   │   Sales        │   Top           │')
console.log('   │   Monthlyes     │   Productos     │')
console.log('   │   (Vertical)    │   (Horizontal)  │')
console.log('   ├─────────────────┼─────────────────┤')
console.log('   │   Comparison   │   Canales       │')
console.log('   │   Annual         │   de Venta      │')
console.log('   │   (Agrupada)    │   (Apilada)     │')
console.log('   └─────────────────┴─────────────────┘\n')

console.log('🎨 Features demostradas:')
console.log('   ✓ Posicionamiento personalizado (x, y)')
console.log('   ✓ Sizes personalizados (width, height)')
console.log('   ✓ 4 charts en una sola page')
console.log('   ✓ Diferentes tipos de charts')
console.log('   ✓ Diferentes orientaciones')
console.log('   ✓ Gradientes y sombras')
console.log('   ✓ Leyendas')
