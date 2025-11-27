import { PDFDocument } from '../src'

console.log('🎨 Generating PDFs with all features...\n')

// ====================
// 1. DIFFERENT COLORS PER BAR
// ====================
console.log('1️⃣  Different colors per bar...')
const doc1 = new PDFDocument()
doc1.text('PDF UI Studio - User Growth 2024', 160, 750, 18)
doc1.barChart({
  data: [
    { label: 'Jan', value: 245 },
    { label: 'Feb', value: 362 },
    { label: 'Mar', value: 438 },
    { label: 'Apr', value: 571 },
    { label: 'May', value: 655 }
  ],
  x: 50,
  y: 350,
  width: 500,
  height: 300,
  barColors: ['#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95', '#3B0764'],
  title: 'New User Sign-Ups',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showValues: true,
  legend: {
    show: true,
    position: 'top-right'
  }
})
doc1.save('examples-output/01-different-colors.pdf')

// ====================
// 2. GRADIENTS
// ====================
console.log('2️⃣  Gradients on bars...')
const doc2 = new PDFDocument()
doc2.text('PDF UI Studio - Templates Created', 160, 750, 18)
doc2.barChart({
  data: [
    { label: 'Q1', value: 1250 },
    { label: 'Q2', value: 2340 },
    { label: 'Q3', value: 3180 },
    { label: 'Q4', value: 4290 }
  ],
  x: 50,
  y: 350,
  width: 500,
  height: 300,
  barColor: '#7C3AED',
  gradient: {
    enabled: true,
    type: 'linear',
    colors: ['#7C3AED', '#5B21B6']
  },
  title: 'AI Templates Generated',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showValues: true
})
doc2.save('examples-output/02-gradients.pdf')

// ====================
// 3. SHADOWS
// ====================
console.log('3️⃣  Shadows on bars...')
const doc3 = new PDFDocument()
doc3.text('PDF UI Studio - Feature Usage', 170, 750, 18)
doc3.barChart({
  data: [
    { label: 'Visual Editor', value: 4520 },
    { label: 'AI Templates', value: 3895 },
    { label: 'Code Export', value: 5140 },
    { label: 'Preview', value: 4710 }
  ],
  x: 50,
  y: 350,
  width: 500,
  height: 300,
  barColor: '#7C3AED',
  shadow: {
    enabled: true,
    offsetX: 3,
    offsetY: 3
  },
  title: 'Most Used Features',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showValues: true
})
doc3.save('examples-output/03-shadows.pdf')

// ====================
// 4. CUSTOM GRID
// ====================
console.log('4️⃣  Custom grid...')
const doc4 = new PDFDocument()
doc4.text('4. Custom Grid', 220, 750, 18)
doc4.barChart({
  data: [
    { label: 'Week 1', value: 45 },
    { label: 'Week 2', value: 52 },
    { label: 'Week 3', value: 38 },
    { label: 'Week 4', value: 71 }
  ],
  x: 50,
  y: 350,
  width: 500,
  height: 300,
  barColor: '#2ecc71',
  title: 'Weekly Performance',
  showAxes: true,
  showGrid: true,
  gridStyle: {
    color: '#cccccc',
    width: 1
  },
  showLabels: true,
  showValues: true
})
doc4.save('examples-output/04-custom-grid.pdf')

// ====================
// 5. HORIZONTAL BARS
// ====================
console.log('5️⃣  Horizontal bars...')
const doc5 = new PDFDocument()
doc5.text('5. Horizontal Bars', 210, 750, 18)
doc5.barChart({
  data: [
    { label: 'Marketing', value: 85 },
    { label: 'Development', value: 92 },
    { label: 'Sales', value: 78 },
    { label: 'Support', value: 65 }
  ],
  x: 50,
  y: 300,
  width: 500,
  height: 350,
  barColor: '#9b59b6',
  orientation: 'horizontal',
  title: 'Performance by Department',
  showAxes: true,
  showLabels: true,
  showValues: true
})
doc5.save('examples-output/05-horizontal.pdf')

// ====================
// 6. GROUPED BARS
// ====================
console.log('6️⃣  Grouped bars...')
const doc6 = new PDFDocument()
doc6.text('6. Grouped Bars', 220, 750, 18)
doc6.groupedBarChart({
  data: [
    {
      label: 'Q1',
      values: [45, 62, 38],
      series: ['2022', '2023', '2024']
    },
    {
      label: 'Q2',
      values: [52, 71, 55],
      series: ['2022', '2023', '2024']
    },
    {
      label: 'Q3',
      values: [48, 65, 58],
      series: ['2022', '2023', '2024']
    },
    {
      label: 'Q4',
      values: [68, 85, 78],
      series: ['2022', '2023', '2024']
    }
  ],
  x: 50,
  y: 350,
  width: 500,
  height: 300,
  colors: ['#e74c3c', '#3498db', '#2ecc71'],
  title: 'Annual Comparison by Quarter',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showValues: false,
  legend: {
    show: true,
    position: 'top-right'
  }
})
doc6.save('examples-output/06-grouped.pdf')

// ====================
// 7. STACKED BARS
// ====================
console.log('7️⃣  Stacked bars...')
const doc7 = new PDFDocument()
doc7.text('7. Stacked Bars', 220, 750, 18)
doc7.stackedBarChart({
  data: [
    {
      label: 'Q1',
      values: [45, 30, 15],
      series: ['Sales', 'Costs', 'Profits']
    },
    {
      label: 'Q2',
      values: [62, 35, 20],
      series: ['Sales', 'Costs', 'Profits']
    },
    {
      label: 'Q3',
      values: [55, 32, 18],
      series: ['Sales', 'Costs', 'Profits']
    },
    {
      label: 'Q4',
      values: [78, 40, 25],
      series: ['Sales', 'Costs', 'Profits']
    }
  ],
  x: 50,
  y: 350,
  width: 500,
  height: 300,
  colors: ['#3498db', '#e74c3c', '#2ecc71'],
  title: 'Quarterly Financial Analysis',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showValues: false,
  legend: {
    show: true,
    position: 'top-right'
  }
})
doc7.save('examples-output/07-stacked.pdf')

// ====================
// 8. COMBINATION OF FEATURES
// ====================
console.log('8️⃣  All features combined...')
const doc8 = new PDFDocument()
doc8.text('8. All Features', 190, 750, 18)
doc8.barChart({
  data: [
    { label: 'Ene', value: 145 },
    { label: 'Feb', value: 162 },
    { label: 'Mar', value: 138 },
    { label: 'Abr', value: 171 },
    { label: 'May', value: 155 }
  ],
  x: 50,
  y: 350,
  width: 500,
  height: 300,
  barColors: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'],
  gradient: {
    enabled: true,
    colors: ['#3498db', '#2980b9']
  },
  shadow: {
    enabled: true,
    offsetX: 2,
    offsetY: 2
  },
  title: 'Complete Dashboard',
  showAxes: true,
  showGrid: true,
  gridStyle: {
    color: '#dddddd',
    width: 0.8
  },
  showLabels: true,
  showValues: true,
  legend: {
    show: true,
    position: 'top-right',
    fontSize: 10
  }
})
doc8.save('examples-output/08-all-combined.pdf')

console.log('\n✅ All PDFs generated successfully in examples-output/')
console.log('📂 Files created:')
console.log('   - 01-different-colors.pdf')
console.log('   - 02-gradients.pdf')
console.log('   - 03-shadows.pdf')
console.log('   - 04-custom-grid.pdf')
console.log('   - 05-horizontal.pdf')
console.log('   - 06-grouped.pdf')
console.log('   - 07-stacked.pdf')
console.log('   - 08-all-combined.pdf')
