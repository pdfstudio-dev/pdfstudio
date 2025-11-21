import { PDFDocument } from '../src'

console.log('📊 Testing multi-line charts...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

// Title
doc.text('MULTI-LINE CHART EXAMPLES', 130, 720, 24)

// Example 1: Multiple series comparison
doc.text('1. Product Performance Comparison', 50, 670, 14)
doc.multiLineChart({
  data: [
    {
      label: 'Q1',
      values: [125, 138, 145],
      series: ['Product A', 'Product B', 'Product C']
    },
    {
      label: 'Q2',
      values: [142, 151, 162],
      series: ['Product A', 'Product B', 'Product C']
    },
    {
      label: 'Q3',
      values: [138, 165, 168],
      series: ['Product A', 'Product B', 'Product C']
    },
    {
      label: 'Q4',
      values: [165, 175, 190],
      series: ['Product A', 'Product B', 'Product C']
    }
  ],
  x: 50,
  y: 400,
  width: 450,
  height: 200,
  colors: ['#e74c3c', '#3498db', '#2ecc71'],
  showPoints: true,
  showAxes: true,
  showGrid: true,
  showLabels: true,
  title: 'Quarterly Sales by Product',
  legend: {
    show: true,
    position: 'right',
    fontSize: 10
  }
})

// Example 2: Year-over-year comparison
doc.text('2. Year-over-Year Growth', 50, 350, 14)
doc.multiLineChart({
  data: [
    {
      label: 'Jan',
      values: [45, 52, 61],
      series: ['2022', '2023', '2024']
    },
    {
      label: 'Feb',
      values: [48, 58, 68],
      series: ['2022', '2023', '2024']
    },
    {
      label: 'Mar',
      values: [52, 62, 75],
      series: ['2022', '2023', '2024']
    },
    {
      label: 'Apr',
      values: [55, 68, 82],
      series: ['2022', '2023', '2024']
    },
    {
      label: 'May',
      values: [58, 72, 88],
      series: ['2022', '2023', '2024']
    },
    {
      label: 'Jun',
      values: [62, 78, 95],
      series: ['2022', '2023', '2024']
    }
  ],
  x: 50,
  y: 80,
  width: 450,
  height: 200,
  colors: ['#95a5a6', '#3498db', '#2ecc71'],
  lineWidth: 2,
  showPoints: true,
  showAxes: true,
  showGrid: true,
  showLabels: true,
  title: 'Revenue Growth (2022-2024)',
  legend: {
    show: true,
    position: 'top-right',
    fontSize: 10
  }
})

doc.save('examples-output/test-multiline-chart.pdf')

console.log('✅ PDF created: examples-output/test-multiline-chart.pdf')
console.log('   Multi-line charts with:')
console.log('   - Product performance comparison (3 series)')
console.log('   - Year-over-year comparison (3 series)')
console.log('   - Legend positioning\n')
