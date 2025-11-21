#!/usr/bin/env ts-node

/**
 * Generate example PDFs for documentation screenshots
 * Run with: ts-node scripts/generate-examples.ts
 */

import { PDFDocument } from '../src'
import * as fs from 'fs'
import * as path from 'path'

const outputDir = path.join(__dirname, '../docs/examples')

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

console.log('🎨 Generating example PDFs for documentation...\n')

// Example 1: Bar Chart
console.log('1️⃣  Generating bar chart example...')
const barChartDoc = new PDFDocument({
  size: 'Letter',
  margins: 54
})

barChartDoc.text('Monthly Sales Report', 150, barChartDoc.getContentY() - 30, 24)
barChartDoc.text('Q1 2024 Performance Analysis', 130, barChartDoc.getContentY() - 60, 14)

barChartDoc.barChart({
  data: [
    { label: 'Jan', value: 145 },
    { label: 'Feb', value: 182 },
    { label: 'Mar', value: 168 },
    { label: 'Apr', value: 205 }
  ],
  x: barChartDoc.getContentX(),
  y: barChartDoc.getContentY() - 450,
  width: barChartDoc.getContentWidth(),
  height: 300,
  barColors: ['#3498db', '#2ecc71', '#f39c12', '#e74c3c'],
  title: 'Revenue (in thousands USD)',
  showAxes: true,
  showGrid: true,
  showLabels: true,
  showValues: true
})

barChartDoc.save(path.join(outputDir, 'bar-chart-example.pdf'))
console.log('   ✅ Saved: bar-chart-example.pdf')

// Example 2: Line Chart
console.log('2️⃣  Generating line chart example...')
const lineChartDoc = new PDFDocument({
  size: 'Letter',
  margins: 54
})

lineChartDoc.text('Website Traffic', 180, lineChartDoc.getContentY() - 30, 24)
lineChartDoc.text('Daily Active Users - Last 7 Days', 135, lineChartDoc.getContentY() - 60, 14)

lineChartDoc.lineChart({
  data: [
    { label: 'Mon', value: 1250 },
    { label: 'Tue', value: 1420 },
    { label: 'Wed', value: 1380 },
    { label: 'Thu', value: 1650 },
    { label: 'Fri', value: 1820 },
    { label: 'Sat', value: 1580 },
    { label: 'Sun', value: 1340 }
  ],
  x: lineChartDoc.getContentX(),
  y: lineChartDoc.getContentY() - 450,
  width: lineChartDoc.getContentWidth(),
  height: 300,
  lineColor: '#3498db',
  lineWidth: 2,
  showPoints: true,
  fillArea: true,
  fillOpacity: 0.2,
  title: 'Active Users',
  showAxes: true,
  showGrid: true,
  showLabels: true
})

lineChartDoc.save(path.join(outputDir, 'line-chart-example.pdf'))
console.log('   ✅ Saved: line-chart-example.pdf')

// Example 3: Pie Chart
console.log('3️⃣  Generating pie chart example...')
const pieChartDoc = new PDFDocument({
  size: 'Letter',
  margins: 54
})

pieChartDoc.text('Market Share Analysis', 160, pieChartDoc.getContentY() - 30, 24)
pieChartDoc.text('Distribution by Product Category', 130, pieChartDoc.getContentY() - 60, 14)

pieChartDoc.pieChart({
  data: [
    { label: 'Electronics', value: 35 },
    { label: 'Clothing', value: 25 },
    { label: 'Home & Garden', value: 20 },
    { label: 'Sports', value: 15 },
    { label: 'Books', value: 5 }
  ],
  x: 300,
  y: 500,
  radius: 120,
  showLabels: true,
  showPercentages: true,
  title: 'Sales by Category',
  legend: {
    show: true,
    position: 'right'
  }
})

pieChartDoc.save(path.join(outputDir, 'pie-chart-example.pdf'))
console.log('   ✅ Saved: pie-chart-example.pdf')

// Example 4: Multi-page Document
console.log('4️⃣  Generating multi-page document example...')
const multiPageDoc = new PDFDocument({
  size: 'Letter',
  margins: 72,
  pageNumbers: {
    enabled: true,
    position: 'bottom-center',
    format: 'Page {current} of {total}',
    excludePages: [0]
  }
})

// Cover page
multiPageDoc.text('ANNUAL REPORT 2024', multiPageDoc.getContentX() + 100, 400, 28)
multiPageDoc.text('Company Performance Overview', multiPageDoc.getContentX() + 80, 350, 16)

// Page 2: Bar Chart
multiPageDoc.addPage()
multiPageDoc.text('Quarterly Revenue', multiPageDoc.getContentX(), multiPageDoc.getContentY() - 50, 20)

multiPageDoc.barChart({
  data: [
    { label: 'Q1', value: 250 },
    { label: 'Q2', value: 320 },
    { label: 'Q3', value: 290 },
    { label: 'Q4', value: 410 }
  ],
  x: multiPageDoc.getContentX(),
  y: multiPageDoc.getContentY() - 450,
  width: multiPageDoc.getContentWidth(),
  height: 300,
  barColor: '#2ecc71',
  title: 'Revenue by Quarter (Millions)',
  showAxes: true,
  showGrid: true,
  showValues: true
})

// Page 3: Summary
multiPageDoc.addPage()
multiPageDoc.text('Summary', multiPageDoc.getContentX(), multiPageDoc.getContentY() - 50, 20)
multiPageDoc.text('Total Revenue: $1,270M', multiPageDoc.getContentX(), multiPageDoc.getContentY() - 100, 14)
multiPageDoc.text('Growth Rate: 28%', multiPageDoc.getContentX(), multiPageDoc.getContentY() - 130, 14)
multiPageDoc.text('Active Customers: 125,000', multiPageDoc.getContentX(), multiPageDoc.getContentY() - 160, 14)

multiPageDoc.save(path.join(outputDir, 'multi-page-example.pdf'))
console.log('   ✅ Saved: multi-page-example.pdf')

// Example 5: Vector Graphics
console.log('5️⃣  Generating vector graphics example...')
const vectorDoc = new PDFDocument({
  size: 'Letter',
  margins: 54
})

vectorDoc.text('Vector Graphics Demo', 170, vectorDoc.getContentY() - 30, 24)
vectorDoc.text('Transformations & Bezier Curves', 135, vectorDoc.getContentY() - 60, 14)

// Rotated square
vectorDoc.saveGraphicsState()
vectorDoc.translate(150, 500)
vectorDoc.rotate(45)
vectorDoc.setStrokeColor(0.2, 0.4, 0.8)
vectorDoc.setFillColor(0.8, 0.9, 1)
vectorDoc.setLineWidth(2)
vectorDoc.rect(-40, -40, 80, 80)
vectorDoc.fillAndStroke()
vectorDoc.restoreGraphicsState()

// Star shape using transformations
vectorDoc.saveGraphicsState()
vectorDoc.translate(350, 500)
vectorDoc.setFillColor(0.95, 0.77, 0.06)
vectorDoc.setStrokeColor(0.85, 0.65, 0.13)
vectorDoc.setLineWidth(2)

for (let i = 0; i < 5; i++) {
  const angle = (i * 144) * Math.PI / 180
  const x = 50 * Math.cos(angle)
  const y = 50 * Math.sin(angle)

  if (i === 0) {
    vectorDoc.moveTo(x, y)
  } else {
    vectorDoc.lineTo(x, y)
  }
}
vectorDoc.closePath()
vectorDoc.fillAndStroke()
vectorDoc.restoreGraphicsState()

// Bezier heart
vectorDoc.setFillColor(0.9, 0.2, 0.3)
vectorDoc.moveTo(250, 300)
vectorDoc.bezierCurveTo(250, 270, 200, 250, 200, 270)
vectorDoc.bezierCurveTo(200, 290, 250, 320, 250, 350)
vectorDoc.bezierCurveTo(250, 320, 300, 290, 300, 270)
vectorDoc.bezierCurveTo(300, 250, 250, 270, 250, 300)
vectorDoc.closePath()
vectorDoc.fill()

// Dashed line
vectorDoc.setStrokeColor(0.2, 0.8, 0.4)
vectorDoc.setLineWidth(3)
vectorDoc.dash([10, 5, 2, 5])
vectorDoc.moveTo(100, 150)
vectorDoc.lineTo(450, 150)
vectorDoc.stroke()

vectorDoc.save(path.join(outputDir, 'vector-graphics-example.pdf'))
console.log('   ✅ Saved: vector-graphics-example.pdf')

// Example 6: Table
console.log('6️⃣  Generating table example...')
const tableDoc = new PDFDocument({
  size: 'Letter',
  margins: 54
})

tableDoc.text('Employee Directory', 180, tableDoc.getContentY() - 30, 24)

tableDoc.table({
  x: tableDoc.getContentX(),
  y: tableDoc.getContentY() - 100,
  headers: ['Name', 'Department', 'Email', 'Phone'],
  rows: [
    ['John Smith', 'Engineering', 'john@company.com', '+1-555-0101'],
    ['Sarah Johnson', 'Marketing', 'sarah@company.com', '+1-555-0102'],
    ['Mike Davis', 'Sales', 'mike@company.com', '+1-555-0103'],
    ['Emily Brown', 'HR', 'emily@company.com', '+1-555-0104'],
    ['David Wilson', 'Finance', 'david@company.com', '+1-555-0105']
  ],
  headerStyle: {
    backgroundColor: '#3498db',
    textColor: '#ffffff',
    fontSize: 11,
    bold: true
  },
  fontSize: 10,
  alternateRowColor: '#f8f9fa',
  cellPadding: 8,
  borders: {
    top: { color: '#dee2e6', width: 1 },
    bottom: { color: '#dee2e6', width: 1 },
    left: { color: '#dee2e6', width: 1 },
    right: { color: '#dee2e6', width: 1 },
    horizontal: { color: '#dee2e6', width: 1 },
    vertical: { color: '#dee2e6', width: 1 }
  }
})

tableDoc.save(path.join(outputDir, 'table-example.pdf'))
console.log('   ✅ Saved: table-example.pdf')

console.log('\n✨ Done! Generated 6 example PDFs in docs/examples/')
console.log('\n📸 Next steps:')
console.log('   1. Open the PDFs')
console.log('   2. Take screenshots (PNG format recommended)')
console.log('   3. Save screenshots to docs/images/')
console.log('   4. Update README.md with screenshot links\n')
