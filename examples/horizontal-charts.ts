import { PDFDocument } from '../src'

console.log('📊 Generating PDFs with horizontal bar charts...\\n')

// ======================
// Example 1: Chart horizontal basic
// ======================
console.log('1️⃣ Chart horizontal basic...')

const doc1 = new PDFDocument({
  size: 'Letter',
  margins: 50
})

doc1.text('Basic Horizontal Bar Chart', doc1.getContentX() + 100, doc1.getContentY() - 30, 20)

doc1.barChart({
  data: [
    { label: 'Product A', value: 125 },
    { label: 'Product B', value: 85 },
    { label: 'Product C', value: 155 },
    { label: 'Product D', value: 95 },
    { label: 'Product E', value: 140 }
  ],
  x: doc1.getContentX(),
  y: doc1.getContentY() - 450,
  width: doc1.getContentWidth(),
  height: 300,
  barColor: '#3498db',
  title: 'Sales by Product',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showValues: true,
  orientation: 'horizontal'
})

doc1.save('examples-output/horizontal-01-basic.pdf')
console.log('   ✅ examples-output/horizontal-01-basic.pdf\\n')

// ======================
// Example 2: Chart horizontal with colors individuales
// ======================
console.log('2️⃣ Chart horizontal with colors...')

const doc2 = new PDFDocument({
  size: 'Letter',
  margins: 54
})

doc2.text('Country Ranking by GDP', doc2.getContentX() + 130, doc2.getContentY() - 30, 20)

doc2.barChart({
  data: [
    { label: 'United States', value: 250 },
    { label: 'China', value: 175 },
    { label: 'Japan', value: 52 },
    { label: 'Germany', value: 45 },
    { label: 'India', value: 38 },
    { label: 'United Kingdom', value: 32 }
  ],
  x: doc2.getContentX(),
  y: doc2.getContentY() - 500,
  width: doc2.getContentWidth(),
  height: 350,
  barColors: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'],
  title: 'GDP by Country (in trillions USD)',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showValues: true,
  orientation: 'horizontal'
})

doc2.save('examples-output/horizontal-02-colors.pdf')
console.log('   ✅ examples-output/horizontal-02-colors.pdf\\n')

// ======================
// Example 3: Chart horizontal with gradient
// ======================
console.log('3️⃣ Chart horizontal with gradient...')

const doc3 = new PDFDocument({
  size: 'Letter',
  margins: 50
})

doc3.text('Customer Satisfaction', doc3.getContentX() + 130, doc3.getContentY() - 30, 22)

doc3.barChart({
  data: [
    { label: 'Very Satisfied', value: 45 },
    { label: 'Satisfied', value: 35 },
    { label: 'Neutral', value: 12 },
    { label: 'Dissatisfied', value: 5 },
    { label: 'Very Dissatisfied', value: 3 }
  ],
  x: doc3.getContentX(),
  y: doc3.getContentY() - 450,
  width: doc3.getContentWidth(),
  height: 300,
  barColor: '#2ecc71',
  gradient: {
    enabled: true,
    type: 'linear',
    colors: ['#27ae60', '#2ecc71']
  },
  title: 'Satisfaction Survey (%)',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showValues: true,
  orientation: 'horizontal'
})

doc3.save('examples-output/horizontal-03-gradient.pdf')
console.log('   ✅ examples-output/horizontal-03-gradient.pdf\\n')

// ======================
// Example 4: Chart horizontal with shadows
// ======================
console.log('4️⃣ Chart horizontal with shadows...')

const doc4 = new PDFDocument({
  size: 'Letter',
  margins: 54
})

doc4.text('Top 5 Programming Languages', doc4.getContentX() + 90, doc4.getContentY() - 30, 20)

doc4.barChart({
  data: [
    { label: 'JavaScript', value: 95 },
    { label: 'Python', value: 88 },
    { label: 'Java', value: 75 },
    { label: 'TypeScript', value: 68 },
    { label: 'C#', value: 52 }
  ],
  x: doc4.getContentX(),
  y: doc4.getContentY() - 450,
  width: doc4.getContentWidth(),
  height: 300,
  barColors: ['#f1c40f', '#3498db', '#e67e22', '#2980b9', '#9b59b6'],
  shadow: {
    enabled: true,
    color: '#000000',
    blur: 5,
    offsetX: 3,
    offsetY: -2
  },
  title: 'Popularity (Index)',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showValues: true,
  orientation: 'horizontal'
})

doc4.save('examples-output/horizontal-04-shadows.pdf')
console.log('   ✅ examples-output/horizontal-04-shadows.pdf\\n')

// ======================
// Example 5: Vertical vs Horizontal Comparison
// ======================
console.log('5️⃣ Vertical vs Horizontal Comparison...')

const comparisonData = [
  { label: 'Jan', value: 45 },
  { label: 'Feb', value: 62 },
  { label: 'Mar', value: 38 },
  { label: 'Apr', value: 71 },
  { label: 'May', value: 55 }
]

const doc5 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  pageNumbers: {
    enabled: true,
    position: 'bottom-center',
    format: 'Page {current}'
  }
})

// Page 1: Vertical
doc5.text('COMPARISON: VERTICAL vs HORIZONTAL', doc5.getContentX() + 80, doc5.getContentY() - 30, 20)
doc5.text('Vertical Chart', doc5.getContentX() + 160, doc5.getContentY() - 70, 16)

doc5.barChart({
  data: comparisonData,
  x: doc5.getContentX(),
  y: doc5.getContentY() - 500,
  width: doc5.getContentWidth(),
  height: 300,
  barColors: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'],
  title: 'Monthly Sales (Vertical)',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showValues: true,
  orientation: 'vertical'
})

// Page 2: Horizontal
doc5.addPage()
doc5.text('Horizontal Chart', doc5.getContentX() + 150, doc5.getContentY() - 30, 16)

doc5.barChart({
  data: comparisonData,
  x: doc5.getContentX(),
  y: doc5.getContentY() - 450,
  width: doc5.getContentWidth(),
  height: 300,
  barColors: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'],
  title: 'Monthly Sales (Horizontal)',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showValues: true,
  orientation: 'horizontal'
})

doc5.text('The same dataset can be visualized', doc5.getContentX(), doc5.getContentY() - 520, 11)
doc5.text('both vertically and horizontally as needed.', doc5.getContentX(), doc5.getContentY() - 540, 11)

doc5.save('examples-output/horizontal-05-comparison.pdf')
console.log('   ✅ examples-output/horizontal-05-comparison.pdf\\n')

// ======================
// Example 6: Chart horizontal with many items
// ======================
console.log('6️⃣ Chart horizontal with many items...')

const doc6 = new PDFDocument({
  size: 'Letter',
  margins: 50
})

doc6.text('Tech Companies Ranking', doc6.getContentX() + 130, doc6.getContentY() - 30, 20)

doc6.barChart({
  data: [
    { label: 'Apple', value: 280 },
    { label: 'Microsoft', value: 265 },
    { label: 'Alphabet', value: 182 },
    { label: 'Amazon', value: 170 },
    { label: 'Meta', value: 118 },
    { label: 'Tesla', value: 95 },
    { label: 'NVIDIA', value: 88 },
    { label: 'Samsung', value: 75 },
    { label: 'TSMC', value: 68 },
    { label: 'Tencent', value: 55 }
  ],
  x: doc6.getContentX(),
  y: doc6.getContentY() - 580,
  width: doc6.getContentWidth(),
  height: 450,
  barColor: '#3498db',
  title: 'Market Value (in trillions USD)',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showValues: true,
  orientation: 'horizontal'
})

doc6.save('examples-output/horizontal-06-many-items.pdf')
console.log('   ✅ examples-output/horizontal-06-many-items.pdf\\n')

// ======================
// Example 7: Chart horizontal tamaño Tabloid
// ======================
console.log('7️⃣ Chart horizontal in Tabloid...')

const doc7 = new PDFDocument({
  size: 'Tabloid',  // 11" × 17"
  margins: 72
})

doc7.text('EXECUTIVE REPORT - PERFORMANCE BY REGION', doc7.getContentX() + 160, doc7.getContentY() - 50, 26)

doc7.barChart({
  data: [
    { label: 'North America', value: 325 },
    { label: 'Western Europe', value: 285 },
    { label: 'Asia-Pacific', value: 410 },
    { label: 'Latin America', value: 165 },
    { label: 'Middle East', value: 125 },
    { label: 'Africa', value: 95 },
    { label: 'Eastern Europe', value: 145 },
    { label: 'Oceania', value: 75 }
  ],
  x: doc7.getContentX(),
  y: doc7.getContentY() - 750,
  width: doc7.getContentWidth(),
  height: 550,
  barColors: [
    '#e74c3c', '#3498db', '#2ecc71', '#f39c12',
    '#9b59b6', '#1abc9c', '#e67e22', '#34495e'
  ],
  gradient: {
    enabled: true,
    type: 'linear',
    colors: ['#3498db', '#2980b9']
  },
  shadow: {
    enabled: true,
    offsetX: 3,
    offsetY: -2
  },
  title: 'Sales by Region (in millions USD)',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showValues: true,
  orientation: 'horizontal'
})

doc7.save('examples-output/horizontal-07-tabloid.pdf')
console.log('   ✅ examples-output/horizontal-07-tabloid.pdf\\n')

// ======================
// Example 8: Chart horizontal with legend
// ======================
console.log('8️⃣ Chart horizontal with legend...')

const doc8 = new PDFDocument({
  size: 'Letter',
  margins: 54
})

doc8.text('Budget Distribution', doc8.getContentX() + 130, doc8.getContentY() - 30, 20)

doc8.barChart({
  data: [
    { label: 'Marketing', value: 45 },
    { label: 'Development', value: 85 },
    { label: 'Operations', value: 35 },
    { label: 'Human Resources', value: 25 },
    { label: 'Research', value: 60 }
  ],
  x: doc8.getContentX(),
  y: doc8.getContentY() - 450,
  width: doc8.getContentWidth() - 120,  // Space for legend
  height: 300,
  barColors: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'],
  title: 'Annual Budget by Department (%)',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showValues: true,
  orientation: 'horizontal',
  legend: {
    show: true,
    position: 'right',
    fontSize: 10
  }
})

doc8.save('examples-output/horizontal-08-legend.pdf')
console.log('   ✅ examples-output/horizontal-08-legend.pdf\\n')

// ======================
// Summary
// ======================
console.log('✅ All horizontal chart examples generated!\\n')
console.log('📁 Files generated:')
console.log('   • horizontal-01-basic.pdf')
console.log('   • horizontal-02-colors.pdf')
console.log('   • horizontal-03-gradient.pdf')
console.log('   • horizontal-04-shadows.pdf')
console.log('   • horizontal-05-comparison.pdf (vertical vs horizontal)')
console.log('   • horizontal-06-many-items.pdf')
console.log('   • horizontal-07-tabloid.pdf')
console.log('   • horizontal-08-legend.pdf\\n')
console.log('📊 Features demonstrated:')
console.log('   ✓ Horizontal orientation')
console.log('   ✓ Custom colors')
console.log('   ✓ Gradients')
console.log('   ✓ Shadows')
console.log('   ✓ Grids and axes')
console.log('   ✓ Legends')
console.log('   ✓ Multiple items')
console.log('   ✓ Different page sizes\\n')
console.log('💡 When to use horizontal charts:')
console.log('   • Long labels (country names, products, etc.)')
console.log('   • Many items to compare')
console.log('   • Rankings and classifications')
console.log('   • When vertical space is limited')
