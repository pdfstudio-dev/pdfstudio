import { PDFDocument } from '../src'

console.log('🔍 Testing graph 4 alone...\n')

const doc = new PDFDocument({
  size: 'Letter',
  margins: 50
})

doc.text('GRAPH 4 TEST (Labels + Legend + Border)', 120, 720, 20)

// Test 4: Pie + Labels + Legend - WITH BORDER (centered on page)
doc.pieChart({
  data: [
    { label: 'X', value: 50 },
    { label: 'Y', value: 50 }
  ],
  x: 200,
  y: 500,
  radius: 60,
  showLabels: true,
  showPercentages: false,
  legend: {
    show: true,
    position: 'right',
    fontSize: 10,
    itemSpacing: 5
  },
  border: {
    show: true,
    color: '#ff00ff',  // PURPLE
    width: 6,
    padding: 20
  }
})

doc.save('examples-output/test-border-graph4.pdf')

console.log('✅ PDF created: examples-output/test-border-graph4.pdf')
console.log('   Should see PURPLE border around pie + labels + legend\n')
