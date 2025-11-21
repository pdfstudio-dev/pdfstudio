import { PDFDocument } from '../src'

console.log('📊 Testing stacked bar chart with borders...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

// Title
doc.text('STACKED BAR CHART WITH BORDERS', 140, 720, 24)

// Example 1: Stacked bar chart with simple border
doc.text('1. Revenue Breakdown (Black Border, 2px)', 50, 670, 12)
doc.stackedBarChart({
  data: [
    {
      label: 'Q1',
      values: [30, 25, 20],
      series: ['Online', 'Retail', 'Wholesale']
    },
    {
      label: 'Q2',
      values: [35, 30, 25],
      series: ['Online', 'Retail', 'Wholesale']
    },
    {
      label: 'Q3',
      values: [40, 35, 28],
      series: ['Online', 'Retail', 'Wholesale']
    },
    {
      label: 'Q4',
      values: [45, 40, 30],
      series: ['Online', 'Retail', 'Wholesale']
    }
  ],
  x: 50,
  y: 450,
  width: 500,
  height: 180,
  title: 'Quarterly Revenue by Channel',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showValues: false,
  colors: ['#e74c3c', '#3498db', '#2ecc71'],
  legend: {
    show: true
  },
  border: {
    show: true,
    color: '#000000',
    width: 2,
    padding: 15
  }
})

// Example 2: Stacked bar chart with purple border
doc.text('2. Resource Allocation (Purple Border, 3px)', 50, 250, 12)
doc.stackedBarChart({
  data: [
    {
      label: 'Project A',
      values: [20, 15, 10, 8],
      series: ['Development', 'Design', 'Testing', 'Marketing']
    },
    {
      label: 'Project B',
      values: [25, 18, 12, 10],
      series: ['Development', 'Design', 'Testing', 'Marketing']
    },
    {
      label: 'Project C',
      values: [30, 20, 15, 12],
      series: ['Development', 'Design', 'Testing', 'Marketing']
    }
  ],
  x: 50,
  y: 50,
  width: 500,
  height: 150,
  title: 'Project Resource Distribution',
  showAxes: true,
  showGrid: false,
  showLabels: true,
  showValues: true,
  colors: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12'],
  legend: {
    show: true
  },
  border: {
    show: true,
    color: '#9b59b6',
    width: 3,
    padding: 20
  }
})

doc.save('examples-output/test-stacked-bar-border.pdf')

console.log('✅ PDF created: examples-output/test-stacked-bar-border.pdf')
console.log('   Stacked bar charts with:')
console.log('   - Simple black border (2px)')
console.log('   - Purple border with values shown (3px)\n')
