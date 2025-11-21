import { PDFDocument } from '../src'

console.log('📊 Testing grouped bar chart with borders...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

// Title
doc.text('GROUPED BAR CHART WITH BORDERS', 140, 720, 24)

// Example 1: Grouped bar chart with simple border
doc.text('1. Sales by Region (Black Border, 2px)', 50, 670, 12)
doc.groupedBarChart({
  data: [
    {
      label: 'Q1',
      values: [45, 55, 38],
      series: ['North', 'South', 'West']
    },
    {
      label: 'Q2',
      values: [52, 60, 42],
      series: ['North', 'South', 'West']
    },
    {
      label: 'Q3',
      values: [58, 68, 48],
      series: ['North', 'South', 'West']
    },
    {
      label: 'Q4',
      values: [65, 75, 55],
      series: ['North', 'South', 'West']
    }
  ],
  x: 50,
  y: 450,
  width: 500,
  height: 180,
  title: 'Quarterly Sales by Region',
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

// Example 2: Grouped bar chart with green border
doc.text('2. Product Comparison (Green Border, 3px)', 50, 250, 12)
doc.groupedBarChart({
  data: [
    {
      label: 'Jan',
      values: [30, 40, 25, 35],
      series: ['Product A', 'Product B', 'Product C', 'Product D']
    },
    {
      label: 'Feb',
      values: [35, 45, 30, 40],
      series: ['Product A', 'Product B', 'Product C', 'Product D']
    },
    {
      label: 'Mar',
      values: [40, 50, 35, 45],
      series: ['Product A', 'Product B', 'Product C', 'Product D']
    }
  ],
  x: 50,
  y: 50,
  width: 500,
  height: 150,
  title: 'Monthly Product Performance',
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
    color: '#2ecc71',
    width: 3,
    padding: 20
  }
})

doc.save('examples-output/test-grouped-bar-border.pdf')

console.log('✅ PDF created: examples-output/test-grouped-bar-border.pdf')
console.log('   Grouped bar charts with:')
console.log('   - Simple black border (2px)')
console.log('   - Green border with values shown (3px)\n')
