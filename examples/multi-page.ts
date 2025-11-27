import { PDFDocument } from '../src'

console.log('📄 Generating PDF con multiple pages...\n')

const doc = new PDFDocument()

// ======================
// PÁGINA 1: Cover
// ======================
doc.text('PDF UI Studio', 230, 500, 36)
doc.text('Platform Analytics 2024', 190, 450, 24)
doc.text('User Growth & Feature Adoption Report', 140, 400, 16)
doc.text('Page 1 of 5', 260, 50, 10)

// ======================
// PÁGINA 2: Monthly User Growth
// ======================
doc.addPage()
doc.text('Monthly User Sign-Ups - 2024', 180, 750, 20)
doc.text('Page 2 of 5', 260, 50, 10)

doc.barChart({
  data: [
    { label: 'Jan', value: 245 },
    { label: 'Feb', value: 362 },
    { label: 'Mar', value: 438 },
    { label: 'Apr', value: 571 },
    { label: 'May', value: 655 },
    { label: 'Jun', value: 768 }
  ],
  x: 50,
  y: 350,
  width: 500,
  height: 300,
  barColors: ['#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95', '#3B0764', '#2E1065'],
  title: 'New Users per Month (First Half)',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showValues: true
})

// ======================
// PÁGINA 3: Quarterly Platform Growth
// ======================
doc.addPage()
doc.text('Platform Growth Comparison by Quarter', 140, 750, 20)
doc.text('Page 3 of 5', 260, 50, 10)

doc.groupedBarChart({
  data: [
    {
      label: 'Q1',
      values: [1045, 1862, 2755],
      series: ['2022', '2023', '2024']
    },
    {
      label: 'Q2',
      values: [1252, 2071, 3168],
      series: ['2022', '2023', '2024']
    },
    {
      label: 'Q3',
      values: [1448, 2365, 3572],
      series: ['2022', '2023', '2024']
    },
    {
      label: 'Q4',
      values: [1768, 2785, 4088],
      series: ['2022', '2023', '2024']
    }
  ],
  x: 50,
  y: 350,
  width: 500,
  height: 300,
  colors: ['#7C3AED', '#6D28D9', '#5B21B6'],
  title: 'Active Users Growth 2022-2024',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  legend: {
    show: true,
    position: 'top-right'
  }
})

// ======================
// PÁGINA 4: Feature Usage Analysis
// ======================
doc.addPage()
doc.text('Quarterly Feature Adoption', 180, 750, 20)
doc.text('Page 4 of 5', 260, 50, 10)

doc.stackedBarChart({
  data: [
    {
      label: 'Q1',
      values: [2145, 1885, 1660],
      series: ['Visual Editor', 'AI Templates', 'Code Export']
    },
    {
      label: 'Q2',
      values: [3162, 2590, 2172],
      series: ['Visual Editor', 'AI Templates', 'Code Export']
    },
    {
      label: 'Q3',
      values: [4155, 3288, 2867],
      series: ['Visual Editor', 'AI Templates', 'Code Export']
    },
    {
      label: 'Q4',
      values: [5378, 4195, 3583],
      series: ['Visual Editor', 'AI Templates', 'Code Export']
    }
  ],
  x: 50,
  y: 350,
  width: 500,
  height: 300,
  colors: ['#7C3AED', '#6D28D9', '#5B21B6'],
  title: 'Feature Usage Breakdown 2024',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  legend: {
    show: true,
    position: 'top-right'
  }
})

// ======================
// PÁGINA 5: Executive Summary
// ======================
doc.addPage()
doc.text('Executive Summary', 220, 750, 20)
doc.text('Page 5 of 5', 260, 50, 10)

doc.text('2024 Year Summary:', 50, 650, 16)
doc.text('• Total Active Users: 12,450', 70, 620, 12)
doc.text('• Growth vs 2023: +68%', 70, 600, 12)
doc.text('• Best Quarter: Q4 (4,088 new users)', 70, 580, 12)
doc.text('• PDFs Generated: 156,000+', 70, 560, 12)

doc.text('Plan Distribution:', 50, 510, 16)

doc.barChart({
  data: [
    { label: 'Free', value: 7892 },
    { label: 'Professional', value: 3285 },
    { label: 'Annual', value: 988 },
    { label: 'Lifetime', value: 285 }
  ],
  x: 50,
  y: 180,
  width: 500,
  height: 250,
  barColors: ['#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95'],
  title: 'Users by Plan Type',
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
