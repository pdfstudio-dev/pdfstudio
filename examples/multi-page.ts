import { PDFDocument } from '../src'

console.log('📄 Generating PDF con multiple pages...\n')

const doc = new PDFDocument()

// ======================
// PÁGINA 1: Cover
// ======================
doc.text('PDFStudio', 250, 500, 36)
doc.text('Report Annual 2024', 200, 450, 24)
doc.text('Analysis de Sales y Rendimiento', 150, 400, 16)
doc.text('Page 1 de 5', 260, 50, 10)

// ======================
// PÁGINA 2: Sales Monthlyes
// ======================
doc.addPage()
doc.text('Sales Monthlyes - 2024', 200, 750, 20)
doc.text('Page 2 de 5', 260, 50, 10)

doc.barChart({
  data: [
    { label: 'Ene', value: 145 },
    { label: 'Feb', value: 162 },
    { label: 'Mar', value: 138 },
    { label: 'Abr', value: 171 },
    { label: 'May', value: 155 },
    { label: 'Jun', value: 168 }
  ],
  x: 50,
  y: 350,
  width: 500,
  height: 300,
  barColors: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'],
  title: 'Sales por Mes (Primer Semestre)',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showValues: true
})

// ======================
// PÁGINA 3: Comparison Quarterly
// ======================
doc.addPage()
doc.text('Comparison Annual por Trimestre', 160, 750, 20)
doc.text('Page 3 de 5', 260, 50, 10)

doc.groupedBarChart({
  data: [
    {
      label: 'Q1',
      values: [45, 62, 55],
      series: ['2022', '2023', '2024']
    },
    {
      label: 'Q2',
      values: [52, 71, 68],
      series: ['2022', '2023', '2024']
    },
    {
      label: 'Q3',
      values: [48, 65, 72],
      series: ['2022', '2023', '2024']
    },
    {
      label: 'Q4',
      values: [68, 85, 88],
      series: ['2022', '2023', '2024']
    }
  ],
  x: 50,
  y: 350,
  width: 500,
  height: 300,
  colors: ['#e74c3c', '#3498db', '#2ecc71'],
  title: 'Comparison 2022-2024',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  legend: {
    show: true,
    position: 'top-right'
  }
})

// ======================
// PÁGINA 4: Analysis Financial
// ======================
doc.addPage()
doc.text('Analysis Financial Quarterly', 180, 750, 20)
doc.text('Page 4 de 5', 260, 50, 10)

doc.stackedBarChart({
  data: [
    {
      label: 'Q1',
      values: [145, 85, 60],
      series: ['Ingresos', 'Costos', 'Ganancias']
    },
    {
      label: 'Q2',
      values: [162, 90, 72],
      series: ['Ingresos', 'Costos', 'Ganancias']
    },
    {
      label: 'Q3',
      values: [155, 88, 67],
      series: ['Ingresos', 'Costos', 'Ganancias']
    },
    {
      label: 'Q4',
      values: [178, 95, 83],
      series: ['Ingresos', 'Costos', 'Ganancias']
    }
  ],
  x: 50,
  y: 350,
  width: 500,
  height: 300,
  colors: ['#3498db', '#e74c3c', '#2ecc71'],
  title: 'Desglose Financial 2024',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  legend: {
    show: true,
    position: 'top-right'
  }
})

// ======================
// PÁGINA 5: Summary Final
// ======================
doc.addPage()
doc.text('Summary Executive', 220, 750, 20)
doc.text('Page 5 de 5', 260, 50, 10)

doc.text('Summary del Año 2024:', 50, 650, 16)
doc.text('• Total de sales: $640,000', 70, 620, 12)
doc.text('• Crecimiento vs 2023: +15%', 70, 600, 12)
doc.text('• Mejor trimestre: Q4 ($178,000)', 70, 580, 12)
doc.text('• Mejor mes: Abril ($171,000)', 70, 560, 12)

doc.text('Rendimiento por Departamento:', 50, 510, 16)

doc.barChart({
  data: [
    { label: 'Sales', value: 92 },
    { label: 'Marketing', value: 85 },
    { label: 'Desarrollo', value: 88 },
    { label: 'Soporte', value: 78 }
  ],
  x: 50,
  y: 180,
  width: 500,
  height: 250,
  barColors: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12'],
  title: 'Eficiencia por Área (%)',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showValues: true
})

// Guardar el PDF
doc.save('examples-output/multi-page-report.pdf')

console.log('✅ PDF multipage generado successfully!')
console.log(`📄 Total de pages: ${doc.getPageCount()}`)
console.log('📂 Archivo: examples-output/multi-page-report.pdf')
