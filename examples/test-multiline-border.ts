import { PDFDocument } from '../src'

console.log('📊 Testing multi-line chart with borders...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

// Title
doc.text('MULTI-LINE CHART WITH BORDERS', 150, 720, 24)

// Example 1: Multi-line chart with simple border
doc.text('1. Product Performance (Black Border, 2px)', 50, 670, 12)
doc.multiLineChart({
  data: [
    {
      label: 'Jan',
      values: [30, 45, 25],
      series: ['Product A', 'Product B', 'Product C']
    },
    {
      label: 'Feb',
      values: [45, 55, 35],
      series: ['Product A', 'Product B', 'Product C']
    },
    {
      label: 'Mar',
      values: [35, 50, 40],
      series: ['Product A', 'Product B', 'Product C']
    },
    {
      label: 'Apr',
      values: [60, 65, 45],
      series: ['Product A', 'Product B', 'Product C']
    },
    {
      label: 'May',
      values: [55, 70, 50],
      series: ['Product A', 'Product B', 'Product C']
    },
    {
      label: 'Jun',
      values: [75, 80, 60],
      series: ['Product A', 'Product B', 'Product C']
    }
  ],
  x: 50,
  y: 480,
  width: 500,
  height: 150,
  title: 'Monthly Product Performance',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showPoints: true,
  colors: ['#3498db', '#e74c3c', '#2ecc71'],
  legend: {
    show: true,
    position: 'top-right'
  },
  border: {
    show: true,
    color: '#000000',
    width: 2,
    padding: 15
  }
})

// Example 2: Multi-line chart with legend on right and blue border
doc.text('2. Revenue Streams (Blue Border, 3px)', 50, 280, 12)
doc.multiLineChart({
  data: [
    {
      label: 'Q1',
      values: [120, 90, 60, 45],
      series: ['Online', 'Retail', 'Wholesale', 'Other']
    },
    {
      label: 'Q2',
      values: [150, 110, 70, 50],
      series: ['Online', 'Retail', 'Wholesale', 'Other']
    },
    {
      label: 'Q3',
      values: [180, 130, 85, 55],
      series: ['Online', 'Retail', 'Wholesale', 'Other']
    },
    {
      label: 'Q4',
      values: [200, 145, 95, 60],
      series: ['Online', 'Retail', 'Wholesale', 'Other']
    }
  ],
  x: 50,
  y: 90,
  width: 400,
  height: 150,
  title: 'Quarterly Revenue by Channel',
  showAxes: true,
  showGrid: false,
  showLabels: true,
  showPoints: true,
  colors: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12'],
  legend: {
    show: true,
    position: 'right'
  },
  border: {
    show: true,
    color: '#3498db',
    width: 3,
    padding: 20
  }
})

doc.save('examples-output/test-multiline-border.pdf')

console.log('✅ PDF created: examples-output/test-multiline-border.pdf')
console.log('   Multi-line charts with:')
console.log('   - Simple black border (2px)')
console.log('   - Blue border with legend on right (3px)\n')
