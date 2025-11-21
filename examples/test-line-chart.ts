import { PDFDocument } from '../src'

console.log('📈 Testing line charts...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

// Title
doc.text('LINE CHART EXAMPLES', 150, 720, 24)

// Example 1: Simple line chart
doc.text('1. Simple Line Chart', 50, 670, 14)
doc.lineChart({
  data: [
    { label: 'Jan', value: 45 },
    { label: 'Feb', value: 62 },
    { label: 'Mar', value: 58 },
    { label: 'Apr', value: 71 },
    { label: 'May', value: 68 },
    { label: 'Jun', value: 85 }
  ],
  x: 50,
  y: 400,
  width: 500,
  height: 200,
  lineColor: '#3498db',
  showPoints: true,
  showAxes: true,
  showGrid: true,
  showLabels: true,
  title: 'Monthly Revenue (in thousands)'
})

// Example 2: Line chart with filled area
doc.text('2. Area Chart (Filled)', 50, 350, 14)
doc.lineChart({
  data: [
    { label: 'Week 1', value: 120 },
    { label: 'Week 2', value: 145 },
    { label: 'Week 3', value: 135 },
    { label: 'Week 4', value: 160 }
  ],
  x: 50,
  y: 80,
  width: 500,
  height: 200,
  lineColor: '#2ecc71',
  pointColor: '#27ae60',
  fillArea: true,
  fillColor: '#2ecc71',
  fillOpacity: 0.3,
  showPoints: true,
  showAxes: true,
  showLabels: true,
  title: 'Weekly Active Users'
})

// Save first page
doc.save('examples-output/test-line-chart.pdf')

console.log('✅ PDF created: examples-output/test-line-chart.pdf')
console.log('   Single line charts with:')
console.log('   - Basic line chart')
console.log('   - Filled area chart\n')
