import { PDFDocument } from '../src'

// Create a new PDF document
const doc = new PDFDocument()

// Add a title (PDF coordinates: origin at bottom-left, Y increases upward)
// For A4 page (841.89 points high), y=750 is near the top
doc.text('PDF UI Studio - Growth Report 2024', 150, 750, 20)

// Create a bar chart
doc.barChart({
  data: [
    { label: 'Jan', value: 245 },
    { label: 'Feb', value: 362 },
    { label: 'Mar', value: 438 },
    { label: 'Apr', value: 571 },
    { label: 'May', value: 655 }
  ],
  x: 50,
  y: 350,  // Middle of the page
  width: 500,
  height: 300,
  barColor: '#7C3AED',
  title: 'New Users Sign-Ups',
  showAxes: true,
  showGrid: true,    // Enable grid lines
  showLabels: true,
  showValues: true
})

// Save to file
doc.save('chart.pdf')

console.log('✅ PDF generated successfully: chart.pdf')
