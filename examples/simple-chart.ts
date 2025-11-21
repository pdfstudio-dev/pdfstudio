import { PDFDocument } from '../src'

// Create a new PDF document
const doc = new PDFDocument()

// Add a title (PDF coordinates: origin at bottom-left, Y increases upward)
// For A4 page (841.89 points high), y=750 is near the top
doc.text('Sales Report Q1 2024', 200, 750, 20)

// Create a bar chart
doc.barChart({
  data: [
    { label: 'Jan', value: 45 },
    { label: 'Feb', value: 62 },
    { label: 'Mar', value: 38 },
    { label: 'Apr', value: 71 },
    { label: 'May', value: 55 }
  ],
  x: 50,
  y: 350,  // Middle of the page
  width: 500,
  height: 300,
  barColor: '#3498db',
  title: 'Monthly Sales',
  showAxes: true,
  showGrid: true,    // Enable grid lines
  showLabels: true,
  showValues: true
})

// Save to file
doc.save('chart.pdf')

console.log('✅ PDF generated successfully: chart.pdf')
