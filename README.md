<div align="center">

# PDFStudio

**Modern PDF generation library for Node.js AND Browsers with native charts and advanced graphics**

[![npm version](https://img.shields.io/npm/v/%40pdfstudio%2Fpdfstudio.svg)](https://www.npmjs.com/package/@pdfstudio/pdfstudio)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D14-green.svg)](https://nodejs.org/)
[![Browser](https://img.shields.io/badge/Browser-Compatible-success.svg)](BROWSER.md)
[![Tests](https://img.shields.io/badge/tests-268%20passing-brightgreen.svg)](https://github.com/pdfstudio-dev/pdfstudio)

[Features](#-features) • [Quick Start](#-quick-start) • [Browser Support](#-browser-support) • [Examples](#-examples) • [API](#-api-reference) • [Documentation](#-documentation)

---

### 🌍 Multi-Language Support

PDFStudio is available in multiple programming languages:

| Language | Repository | Status | Package |
|----------|------------|--------|---------|
| **Node.js/TypeScript** | [pdfstudio](https://github.com/pdfstudio-dev/pdfstudio) ⭐ | ✅ Stable | [![npm](https://img.shields.io/npm/v/%40pdfstudio%2Fpdfstudio)](https://npmjs.com/package/@pdfstudio/pdfstudio) |
| **PHP** | [pdfstudio-php](https://github.com/pdfstudio-dev/pdfstudio-php) | 🚧 In Development | Coming Soon |
| **Java** | [pdfstudio-java](https://github.com/pdfstudio-dev/pdfstudio-java) | 📋 Planned | Coming Soon |
| **Python** | [pdfstudio-python](https://github.com/pdfstudio-dev/pdfstudio-python) | 📋 Planned | Coming Soon |

</div>

---

## 🎯 Why PDFStudio?

PDFStudio is the **only isomorphic PDF library** (Node.js + Browser) that combines professional document generation with **native chart support**. Built from the ground up in TypeScript, it delivers powerful visualization capabilities, advanced graphics, and full browser compatibility out of the box.

```typescript
import { PDFDocument } from '@pdfstudio/pdfstudio'

const doc = new PDFDocument()

// Native chart support - no external libraries needed
doc.barChart({
  data: [
    { label: 'Q1', value: 45 },
    { label: 'Q2', value: 62 },
    { label: 'Q3', value: 55 },
    { label: 'Q4', value: 71 }
  ],
  x: 100, y: 400, width: 400, height: 250,
  title: 'Quarterly Sales',
  showGrid: true,
  showValues: true
})

doc.save('sales-report.pdf')
```

### Key Differentiators

| Feature | PDFStudio v0.3.3 | PDFKit | jsPDF | pdfmake |
|---------|------------------|--------|-------|---------|
| **Browser Support** | ✅ **Native** | ❌ Node only | ✅ | ✅ |
| **Node.js Support** | ✅ | ✅ | ⚠️ Limited | ✅ |
| **Native Charts** | ✅ 7 types | ❌ | ❌ | Limited |
| **TypeScript-First** | ✅ Full types | ⚠️ @types | ⚠️ @types | ⚠️ @types |
| **Vector Graphics** | ✅ Advanced | ✅ Basic | ⚠️ Limited | ❌ |
| **Text Flow (moveDown/Up)** | ✅ | ✅ | ❌ | ❌ |
| **Rounded Rectangles** | ✅ | ✅ | ⚠️ Limited | ❌ |
| **Multi-Column Text** | ✅ | ✅ | ❌ | ⚠️ Limited |
| **Bulleted Lists** | ✅ 8 styles | ✅ | ❌ | ✅ |
| **Global Config** | ✅ Unique | ❌ | ❌ | ❌ |
| **Professional Forms** | ✅ AcroForms | ⚠️ Basic | ❌ | ❌ |
| **QR Codes** | ✅ 9 data types | ❌ | ⚠️ Plugin | ❌ |
| **Active Development** | ✅ 2025 | ⚠️ Slow | ✅ | ✅ |

---

## ✨ Features

<details>
<summary><b>📊 Charts & Visualizations (7 Types)</b></summary>

- **Bar Charts** - Vertical & horizontal with gradients and shadows
- **Grouped Bar Charts** - Multiple series side-by-side
- **Stacked Bar Charts** - Cumulative data visualization
- **Line Charts** - Smooth or straight lines with area fill
- **Multi-Line Charts** - Multiple series on shared axes
- **Pie Charts** - Automatic percentage calculation
- **Donut Charts** - Center hole with custom text
- **Chart Features**: Legends (6 positions), grids, gradients, shadows, borders

</details>

<details>
<summary><b>📄 Multi-Page Documents</b></summary>

- Unlimited pages with individual sizes
- Page navigation and reordering
- Automatic page numbering (6 positions, custom formats)
- Headers & footers with images and text
- Page rotation (0°, 90°, 180°, 270°)
- 14+ standard sizes (Letter, Legal, A4, A3, Tabloid, etc.)

</details>

<details>
<summary><b>✍️ Advanced Text</b></summary>

- Automatic word wrap without cutting words
- Full alignment (left, center, right, justify)
- Vertical alignment (top, center, bottom)
- Text decorations (underline, strike-through)
- Clickable hyperlinks
- Fine spacing control (character, word, line)
- Paragraph formatting (indent, line gap)
- **🆕 Text rotation** at any angle (v0.3.0)
- **🆕 Multi-column layout** with configurable gap (v0.3.0)
- **🆕 Text flow control** with moveDown()/moveUp() (v0.3.0)
- **🆕 Named destinations & internal links** (v0.3.0)
- **✨ NEW: Ellipsis truncation** for overflow handling (v0.3.1)
- **✨ NEW: Paragraph gap** for precise spacing (v0.3.1)
- Custom fonts (TrueType/OpenType)
- Font optimization (ToUnicode CMap, compression, subsetting)
- 14 base fonts + unlimited custom fonts
- 5 encodings (WinAnsi, MacRoman, Standard, etc.)

</details>

<details>
<summary><b>📝 Professional Text Features (v0.3.0)</b></summary>

**🎉 NEW**: Industry-standard text layout and advanced typography

- **`moveDown([lines])`** - Natural text flow control, move cursor down
- **`moveUp([lines])`** - Move cursor up by lines
- **`getCurrentY()` / `getCurrentX()`** - Get current position
- **`roundedRect(x, y, w, h, radius)`** - Rectangles with rounded corners
- **Text Rotation** - `rotation` option for rotating text at any angle
- **Multi-Column Text** - `columns` and `columnGap` options for newspaper-style layouts
- **`list(items, x, y, options)`** - Bulleted & numbered lists with 8 styles:
  - Bullets: `disc` (•), `circle` (◦), `square` (▪)
  - Numbers: `decimal`, `lower-alpha`, `upper-alpha`, `lower-roman`, `upper-roman`
  - Custom: any string ('★', '→', etc.)
- **Named Destinations** - `destination` option to create anchors
- **GoTo Links** - `goTo` option for internal navigation

```typescript
// Text flow with cursor control
doc.text('First line', 100, 750, 14)
   .moveDown()
   .text('Second line', 100, doc.getCurrentY(), 12)

// Rounded rectangles
doc.roundedRect(100, 100, 200, 150, 15).stroke()

// Rotated text
doc.text('Rotated 45°', 100, 550, 12, { rotation: 45 })

// Multi-column layout
doc.text(longText, 100, 480, 10, {
  width: 400,
  columns: 2,
  columnGap: 20
})

// Bulleted list
doc.list(['Item 1', 'Item 2', 'Item 3'], 100, 400, {
  bulletStyle: 'disc'
})

// Internal navigation
doc.text('Chapter 1', 100, 750, 16, { destination: 'chapter1' })
doc.text('Go to Chapter 1', 100, 500, 12, { goTo: 'chapter1' })
```

</details>

<details>
<summary><b>📐 Text Layout Features (v0.3.1)</b></summary>

**✨ NEW**: Ellipsis truncation and paragraph spacing for professional layouts

- **`ellipsis`** - Auto-truncate text with "..." when exceeding height limit
- **`paragraphGap`** - Add precise spacing after paragraphs
- Custom ellipsis characters supported
- Binary search algorithm for optimal truncation (O(log n))
- Works with all text features (multi-column, rotation, alignment)
- Perfect for content cards, previews, and professional documents

```typescript
// Ellipsis: Truncate long content
doc.text(longDescription, {
  x: 50, y: 500,
  width: 200,
  height: 60,        // Fixed height
  ellipsis: true     // Add "..." when text exceeds height
})

// Custom ellipsis
doc.text(articleContent, {
  x: 50, y: 400,
  width: 400,
  height: 100,
  ellipsis: '...[Read More]'  // Custom truncation indicator
})

// Paragraph gap: Professional spacing
doc.text('First paragraph with some content.', {
  x: 50, y: 700,
  width: 500,
  paragraphGap: 20   // 20pt space after this paragraph
})

doc.text('Second paragraph automatically positioned.', {
  x: 50,
  y: doc.getCurrentY(),  // Use current position
  width: 500,
  paragraphGap: 15
})

// Combined: Ellipsis + ParagraphGap + Multi-Column
doc.text(longArticle, {
  x: 50, y: 600,
  width: 500,
  height: 120,
  fontSize: 10,
  columns: 2,
  columnGap: 20,
  align: 'justify',
  ellipsis: '…',
  paragraphGap: 25
})
```

**Use Cases:**
- 📦 Product catalogs with fixed-size descriptions
- 📰 Article previews and content cards
- 📚 Documentation with consistent paragraph spacing
- 🎨 Content boxes with height constraints
- 📊 Reports with professional typography

</details>

<details>
<summary><b>🎨 Vector Graphics</b></summary>

- **Shapes**: Rectangles, circles, ellipses, polygons, arcs, sectors
- **Paths**: Bezier curves (cubic & quadratic), SVG path parsing
- **Transformations**: Rotate, scale, translate with matrix support
- **Clipping**: Vector masks with non-zero/even-odd winding
- **Gradients**: Linear & radial with multiple color stops
- **Patterns**: Tiling patterns with custom drawing
- **Blend Modes**: 16 modes (multiply, screen, overlay, etc.)
- **Dash Patterns**: Dotted/dashed lines with custom patterns
- **Graphics State**: Save/restore for complex compositions

</details>

<details>
<summary><b>📊 Tables</b></summary>

- Auto page breaks with header repetition
- Styled headers (background, text color, bold)
- Cell spanning (colspan, rowspan)
- Alternate row colors (zebra striping)
- Customizable borders (all sides, dash styles)
- Per-cell styling (colors, alignment, font)
- Cell padding and alignment

</details>

<details>
<summary><b>🔒 Security & Professional Features</b></summary>

- **Encryption**: User & owner passwords with permissions
- **Interactive Forms**: Text fields, checkboxes, radio buttons, dropdowns, buttons
- **Digital Signatures**: Signature field placeholders
- **Bookmarks**: Multi-level document outlines
- **Layers**: Optional Content Groups (OCG) for toggleable content
- **PDF/A Compliance**: PDF/A-1b, 2b, 3b with color profiles
- **Compression**: Images, streams, fonts with configurable levels

</details>

<details>
<summary><b>📎 Annotations & Attachments</b></summary>

- **9 Annotation Types**: Text (sticky notes), Highlight, Underline, Strikeout, Square, Circle, FreeText, Stamp, Ink
- **File Attachments**: Document-level and page-level with 4 icon types
- **Watermarks**: Text and image watermarks with 9 positions
- **Links**: External URLs and internal page jumps

</details>

<details>
<summary><b>📱 QR Codes</b></summary>

- **9 Data Types**: Text, URL, Email, Phone, SMS, WiFi, vCard, Geo, Event
- Center logo/image support
- Error correction levels (L, M, Q, H)
- Custom colors and sizes
- Quiet zone configuration

</details>

<details>
<summary><b>🌍 International Support</b></summary>

- 5 font encodings (WinAnsi, MacRoman, Standard, MacExpert, PDFDoc)
- Full support for Spanish, French, German, Portuguese, Italian
- Special characters (ñ, á, é, í, ó, ú, ü, ß, ç, etc.)
- Custom TrueType/OpenType fonts for any language
- Multi-language metadata

</details>

<details>
<summary><b>⚙️ Global Configuration</b></summary>

- Configure Creator, Producer, and Annotation Author globally
- Set company-wide branding defaults once, use everywhere
- Perfect for multi-language applications
- Per-document overrides when needed
- TypeScript-safe configuration

</details>

---

## 📦 Installation

```bash
npm install @pdfstudio/pdfstudio
```

```bash
yarn add @pdfstudio/pdfstudio
```

```bash
pnpm add @pdfstudio/pdfstudio
```

**Requirements:** Node.js >= 14.0.0

---

## 🚀 Quick Start

### Hello World

```typescript
import { PDFDocument } from '@pdfstudio/pdfstudio'

const doc = new PDFDocument()
doc.text('Hello, PDFStudio!', 100, 750, 24)
doc.save('hello.pdf')
```

### Basic Chart

```typescript
import { PDFDocument } from '@pdfstudio/pdfstudio'

const doc = new PDFDocument()

doc.barChart({
  data: [
    { label: 'Jan', value: 45 },
    { label: 'Feb', value: 62 },
    { label: 'Mar', value: 55 }
  ],
  x: 100,
  y: 400,
  width: 400,
  height: 250,
  title: 'Monthly Sales'
})

doc.save('chart.pdf')
```

---

<div align="center">

## 🎨 **Prototype PDFs Faster with Visual Editor**

[![PDF UI Studio - Visual PDF Editor](https://img.shields.io/badge/🎨_Try_Free-PDF_UI_Studio-7C3AED?style=for-the-badge&labelColor=1F2937)](https://pdfuistudio.io/?ref=pdfstudio-npm)

**Design PDFs visually with drag & drop • Export production-ready JavaScript code**

Stop writing code from scratch—design your PDF layouts visually and export PDFKit-compatible JavaScript instantly. Perfect for prototyping invoices, certificates, and reports.

✨ **AI-powered templates** • 🎯 **Real-time preview** • 💻 **Exports clean JS code** • 🚀 **Free to start**

### [**→ Try Visual Editor (Free)**](https://pdfuistudio.io/?ref=pdfstudio-npm)

</div>

---

## 🌐 Browser Support

**NEW in v0.2.0**: PDFStudio now works natively in web browsers! Generate PDFs client-side without a server - same powerful API, zero configuration needed.

### Why Browser Support Matters

- ✅ **Offline PDF Generation** - Work without internet or server
- ✅ **Privacy-First** - Data never leaves the user's device
- ✅ **Instant Results** - No upload/download delays
- ✅ **Cost Savings** - Reduce server load and bandwidth
- ✅ **JAMstack Ready** - Perfect for static site generators

### Quick Browser Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>PDFStudio Browser Demo</title>
</head>
<body>
  <button onclick="generateInvoice()">Generate Invoice</button>

  <script src="node_modules/@pdfstudio/pdfstudio/dist/pdfstudio.standalone.js"></script>
  <script>
    async function generateInvoice() {
      const { PDFDocument } = PDFStudio;

      const doc = new PDFDocument({
        title: 'Invoice #12345',
        author: 'Your Company'
      });

      // Add header
      doc.text('INVOICE', 250, 750, 28, 'Helvetica-Bold');
      doc.text('Invoice #12345', 50, 720, 12);

      // Add table
      doc.table({
        headers: ['Item', 'Qty', 'Price', 'Total'],
        rows: [
          ['Product A', '2', '$50.00', '$100.00'],
          ['Product B', '1', '$75.00', '$75.00']
        ],
        x: 50,
        y: 600,
        width: 500
      });

      // Add chart
      doc.barChart({
        data: [
          { label: 'Q1', value: 45 },
          { label: 'Q2', value: 62 },
          { label: 'Q3', value: 55 },
          { label: 'Q4', value: 71 }
        ],
        x: 80,
        y: 300,
        width: 450,
        height: 200,
        title: 'Quarterly Sales'
      });

      // Download PDF
      await doc.save('invoice-12345.pdf');
    }
  </script>
</body>
</html>
```

### Key Browser Features

- ✅ **Zero Server Dependencies** - Everything runs client-side
- ✅ **100% API Parity** - Identical API to Node.js version
- ✅ **All Features Supported** - Charts, tables, QR codes, encryption, forms, etc.
- ✅ **Modern Browsers** - Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- ✅ **Small Bundle Size** - ~600KB minified (including all features)
- ✅ **TypeScript Support** - Full type definitions included
- ✅ **Auto-Download** - Trigger file downloads or get as Blob
- ✅ **File Input Support** - Load images/fonts from `<input type="file">`
- ✅ **URL Loading** - Load resources from remote URLs
- ✅ **Encryption** - MD5-based PDF encryption works in browsers

### Installation Options

#### Option 1: Standalone Script (Quickest)

```html
<script src="node_modules/@pdfstudio/pdfstudio/dist/pdfstudio.standalone.js"></script>
<script>
  const { PDFDocument } = PDFStudio; // Global variable
</script>
```

#### Option 2: Module Bundlers (Webpack, Vite, Rollup)

```bash
npm install @pdfstudio/pdfstudio
```

```javascript
import { PDFDocument } from '@pdfstudio/pdfstudio';
// Automatically uses browser build when detected
```

#### Option 3: CDN (jsDelivr, unpkg)

```html
<script src="https://cdn.jsdelivr.net/npm/@pdfstudio/pdfstudio/dist/pdfstudio.standalone.js"></script>
```

### Advanced Browser Examples

```javascript
const { PDFDocument } = PDFStudio;

// Get PDF as Blob (for uploading, viewing, etc.)
const doc = new PDFDocument();
doc.text('Hello World', 100, 100, 24);
const buffer = await doc.toBuffer();
const blob = new Blob([buffer], { type: 'application/pdf' });

// View PDF in new tab
const url = URL.createObjectURL(blob);
window.open(url, '_blank');

// Upload to server
const formData = new FormData();
formData.append('pdf', blob, 'document.pdf');
await fetch('/api/upload', { method: 'POST', body: formData });

// Load image from File input
const fileInput = document.getElementById('imageUpload');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  await doc.image(file, 100, 500, { width: 200 });
});

// Load custom font from URL
await doc.registerFont({
  name: 'CustomFont',
  source: 'https://example.com/fonts/custom.ttf'
});

// Generate encrypted PDF
const secureDoc = new PDFDocument({
  security: {
    userPassword: 'user123',
    ownerPassword: 'owner456',
    permissions: {
      printing: 'highResolution',
      modifying: false,
      copying: false
    }
  }
});
```

### Browser vs Node.js Differences

| Feature | Node.js | Browser |
|---------|---------|---------|
| **File I/O** | `fs.readFile/writeFile` | `fetch()` / `FileReader` / `Blob` |
| **Image Processing** | `sharp` (optional) | Canvas API |
| **Font Loading** | File paths | URLs or File objects |
| **File Save** | Writes to disk | Triggers download |
| **Buffer Support** | Native | Polyfilled |
| **Crypto** | Node crypto | Web Crypto + MD5 polyfill |

### What's New in Browser Support (v0.2.0)

- 🎉 **Complete Platform Abstraction** - Seamless Node.js/Browser compatibility
- 🔐 **Browser Encryption** - Pure JavaScript MD5 implementation for PDF encryption
- 📦 **Optimized Build** - Automatic tree-shaking and polyfills via esbuild
- 🖼️ **Canvas-Based Image Processing** - No dependencies for image handling
- 📁 **Smart File System** - Automatic detection and adapter pattern
- 🧪 **Fully Tested** - All 180 tests pass in both environments

### Browser Examples Included

Check out `examples/browser/index.html` for 80+ interactive examples including:
- Charts (7 types)
- Tables with styling
- QR Codes
- Forms and encryption
- Image handling
- Multi-page documents
- Real-world examples (invoices, reports, certificates)

📖 **[Full Browser Documentation →](BROWSER.md)**
📖 **[Browser Migration Guide →](BROWSER_MIGRATION.md)**

### Multi-Page Document

```typescript
import { PDFDocument } from '@pdfstudio/pdfstudio'

const doc = new PDFDocument({
  margins: 50,
  pageNumbers: {
    enabled: true,
    position: 'bottom-center',
    format: 'Page {current} of {total}'
  }
})

// Page 1
doc.text('First Page', 100, 750, 20)

// Page 2
doc.addPage()
doc.text('Second Page', 100, 750, 20)

doc.save('multi-page.pdf')
```

---

## 📚 Examples

### Creating Reports with Tables

```typescript
import { PDFDocument } from '@pdfstudio/pdfstudio'

const doc = new PDFDocument({ margins: 50 })

// Title
doc.text('Sales Report Q4 2024', 100, 750, 24)

// Summary chart
doc.barChart({
  data: [
    { label: 'Oct', value: 45000 },
    { label: 'Nov', value: 52000 },
    { label: 'Dec', value: 61000 }
  ],
  x: 100,
  y: 450,
  width: 400,
  height: 200,
  title: 'Monthly Revenue',
  showGrid: true,
  showValues: true,
  barColors: ['#3498db']
})

// Detailed table
doc.table({
  x: 100,
  y: 200,
  headers: ['Product', 'Units', 'Revenue'],
  rows: [
    ['Product A', '1,250', '$45,000'],
    ['Product B', '890', '$52,000'],
    ['Product C', '1,430', '$61,000']
  ],
  headerStyle: {
    backgroundColor: '#3498db',
    textColor: '#ffffff',
    bold: true
  },
  borders: {
    horizontal: true,
    vertical: true,
    headerBottom: true
  }
})

doc.save('sales-report.pdf')
```

### Interactive Forms

```typescript
import { PDFDocument } from '@pdfstudio/pdfstudio'

const doc = new PDFDocument()

doc.text('Customer Feedback Form', 200, 750, 20)

doc.setForm({ enabled: true })

// Text field
doc.addFormField({
  type: 'text',
  name: 'name',
  x: 100,
  y: 700,
  width: 300,
  height: 25,
  placeholder: 'Your Name',
  required: true
})

// Checkbox
doc.addFormField({
  type: 'checkbox',
  name: 'subscribe',
  x: 100,
  y: 650,
  width: 15,
  height: 15
})
doc.text('Subscribe to newsletter', 120, 653, 12)

// Submit button
doc.addFormField({
  type: 'button',
  name: 'submit',
  x: 100,
  y: 600,
  width: 100,
  height: 30,
  label: 'Submit',
  action: { type: 'submit', url: 'https://example.com/submit' }
})

doc.save('feedback-form.pdf')
```

### Professional Documents with Headers/Footers

```typescript
import { PDFDocument, configure } from '@pdfstudio/pdfstudio'

// Configure global branding
configure({
  defaultCreator: 'Acme Corporation',
  defaultProducer: 'Acme Document System v2.0'
})

const doc = new PDFDocument({
  margins: { top: 100, right: 50, bottom: 80, left: 50 },
  info: {
    Title: 'Annual Report 2024',
    Author: 'Finance Department',
    Subject: 'Financial Summary'
  }
})

// Configure header
doc.setHeaderFooter({
  header: {
    content: {
      left: { text: 'Acme Corporation', fontSize: 10 },
      right: { text: '2024 Annual Report', fontSize: 10 }
    },
    line: { enabled: true, width: 0.5, color: '#333333' }
  },
  footer: {
    content: {
      center: { text: 'Page {current} of {total}', fontSize: 9 }
    },
    line: { enabled: true, width: 0.5, color: '#333333' }
  }
})

// Add content
doc.text('Annual Report 2024', 100, doc.getContentY(), 28)
doc.text('Executive Summary', 100, doc.getContentY() - 40, 18)

// Add pages...
doc.addPage()
doc.text('Financial Overview', 100, doc.getContentY(), 18)

doc.save('annual-report.pdf')
```

### QR Codes with Logo

```typescript
import { PDFDocument } from '@pdfstudio/pdfstudio'

const doc = new PDFDocument()

doc.text('Scan to visit our website', 200, 750, 16)

await doc.qrCode({
  data: {
    type: 'url',
    url: 'https://example.com'
  },
  x: 250,
  y: 400,
  size: 200,
  errorCorrectionLevel: 'H',
  logo: {
    source: './assets/logo.png',
    size: 50,
    borderRadius: 10,
    backgroundColor: '#ffffff'
  }
})

doc.save('qr-with-logo.pdf')
```

### Advanced Vector Graphics

```typescript
import { PDFDocument } from '@pdfstudio/pdfstudio'

const doc = new PDFDocument()

// Gradient rectangle
doc.rectWithGradient(100, 600, 200, 150, {
  type: 'linear',
  x0: 100, y0: 600,
  x1: 300, y1: 750,
  colorStops: [
    { offset: 0, color: [0.2, 0.4, 0.8] },
    { offset: 1, color: [0.8, 0.2, 0.4] }
  ]
})

// Bezier curve with dash pattern
doc.setStrokeColor(0.2, 0.6, 0.8)
doc.setLineWidth(3)
doc.dash([10, 5])  // Dashed line
doc.moveTo(100, 400)
doc.bezierCurveTo(200, 500, 300, 300, 400, 400)
doc.stroke()

// Clipped circle with pattern
doc.saveGraphicsState()
doc.clipCircle(250, 250, 80)
// ... draw content inside circle
doc.restoreGraphicsState()

doc.save('vector-graphics.pdf')
```

---

## 📖 API Reference

### PDFDocument Constructor

```typescript
new PDFDocument(options?: PDFDocumentOptions)
```

<details>
<summary><b>Common Options</b></summary>

```typescript
interface PDFDocumentOptions {
  // Page configuration
  size?: PageSize | [number, number]           // Letter, A4, Legal, or custom [width, height]
  layout?: 'portrait' | 'landscape'            // Page orientation
  margins?: number | Margins                   // All sides or {top, right, bottom, left}

  // Document metadata
  info?: {
    Title?: string
    Author?: string
    Subject?: string
    Keywords?: string
    Creator?: string                           // Or use global config
    Producer?: string                          // Or use global config
  }

  // Page numbers
  pageNumbers?: {
    enabled: boolean
    position?: 'top-left' | 'top-center' | 'top-right' |
               'bottom-left' | 'bottom-center' | 'bottom-right'
    format?: string | ((current: number, total: number) => string)
    fontSize?: number
    color?: string
    margin?: number
    startPage?: number
    excludePages?: number[]
  }

  // Font configuration
  font?: {
    baseFont?: PDFBaseFont                     // Helvetica, Times-Roman, Courier, etc.
    encoding?: PDFEncoding                     // WinAnsiEncoding, MacRomanEncoding, etc.
  }

  // Security
  security?: {
    userPassword?: string
    ownerPassword?: string
    permissions?: PDFPermissions
  }

  // PDF/A compliance
  pdfA?: {
    conformanceLevel: 'PDF/A-1b' | 'PDF/A-2b' | 'PDF/A-3b'
    colorProfile?: 'sRGB' | 'AdobeRGB' | 'CoatedFOGRA39'
  }

  // Compression
  compression?: {
    enabled: boolean
    level?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
    images?: 'low' | 'medium' | 'high' | 'maximum'
  }
}
```

</details>

### Chart Methods

```typescript
// Bar chart
doc.barChart(options: BarChartOptions): PDFDocument

// Grouped bar chart
doc.groupedBarChart(options: GroupedBarChartOptions): PDFDocument

// Stacked bar chart
doc.stackedBarChart(options: StackedBarChartOptions): PDFDocument

// Line chart
doc.lineChart(options: LineChartOptions): PDFDocument

// Multi-line chart
doc.multiLineChart(options: MultiLineChartOptions): PDFDocument

// Pie chart
doc.pieChart(options: PieChartOptions): PDFDocument

// Donut chart
doc.donutChart(options: DonutChartOptions): PDFDocument
```

<details>
<summary><b>Common Chart Options</b></summary>

```typescript
interface BaseChartOptions {
  // Position & size
  x: number
  y: number
  width: number
  height: number

  // Styling
  title?: string
  titleFontSize?: number
  showGrid?: boolean
  gridStyle?: GridStyle
  showAxes?: boolean
  showLabels?: boolean
  showValues?: boolean

  // Colors
  barColors?: string[] | Color[]

  // Advanced
  gradient?: GradientOptions
  shadow?: ShadowOptions
  legend?: LegendOptions
  border?: BorderOptions
  orientation?: 'vertical' | 'horizontal'      // Bar charts only
}
```

</details>

### Text Methods

```typescript
// Simple text
doc.text(text: string, x: number, y: number, fontSize?: number): PDFDocument

// Advanced text
doc.text(text: string, options: TextOptions): PDFDocument

// Text measurements
doc.widthOfString(text: string, fontSize?: number, font?: string): number
doc.heightOfString(text: string, fontSize?: number, lineGap?: number): number

// Outlined text
doc.textOutline(options: TextOutlineOptions): PDFDocument
```

<details>
<summary><b>Text Options</b></summary>

```typescript
interface TextOptions {
  // Position
  x?: number
  y?: number

  // Size
  width?: number                               // For wrapping
  height?: number                              // Bounding box
  fontSize?: number

  // Alignment
  align?: 'left' | 'center' | 'right' | 'justify'
  valign?: 'top' | 'center' | 'bottom'

  // Styling
  color?: string | Color
  font?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean

  // Spacing
  lineGap?: number
  lineHeight?: number
  characterSpacing?: number
  wordSpacing?: number

  // Paragraphs
  indent?: number
  paragraphGap?: number

  // Links
  link?: string

  // Advanced
  continued?: boolean                          // Continue inline
  ellipsis?: boolean                           // Auto truncation
}
```

</details>

### Vector Graphics Methods

```typescript
// Shapes
doc.rect(x: number, y: number, width: number, height: number): PDFDocument
doc.circle(options: CircleOptions): PDFDocument
doc.ellipse(options: EllipseOptions): PDFDocument
doc.polygon(options: PolygonOptions): PDFDocument
doc.arc(options: ArcOptions): PDFDocument
doc.sector(options: SectorOptions): PDFDocument

// Path operations
doc.moveTo(x: number, y: number): PDFDocument
doc.lineTo(x: number, y: number): PDFDocument
doc.curveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): PDFDocument
doc.bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): PDFDocument
doc.quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): PDFDocument
doc.closePath(): PDFDocument
doc.path(svgPath: string): PDFDocument

// Rendering
doc.fill(color?: Color): PDFDocument
doc.stroke(): PDFDocument
doc.fillAndStroke(): PDFDocument

// Clipping
doc.clip(): PDFDocument
doc.clipEvenOdd(): PDFDocument
doc.clipRect(x: number, y: number, width: number, height: number): PDFDocument
doc.clipCircle(x: number, y: number, radius: number): PDFDocument
doc.clipPath(svgPath: string): PDFDocument

// Graphics state
doc.setFillColor(r: number, g: number, b: number): PDFDocument
doc.setStrokeColor(r: number, g: number, b: number): PDFDocument
doc.setLineWidth(width: number): PDFDocument
doc.setLineCap(cap: 0 | 1 | 2): PDFDocument
doc.setLineJoin(join: 0 | 1 | 2): PDFDocument
doc.setDashPattern(pattern: number[], phase?: number): PDFDocument
doc.dash(pattern: number[], phase?: number): PDFDocument
doc.undash(): PDFDocument
doc.opacity(value: number): PDFDocument
doc.blendMode(mode: string): PDFDocument

// Transformations
doc.saveGraphicsState(): PDFDocument
doc.restoreGraphicsState(): PDFDocument
doc.transform(a: number, b: number, c: number, d: number, e: number, f: number): PDFDocument
doc.rotate(angle: number): PDFDocument
doc.scale(sx: number, sy?: number): PDFDocument
doc.translate(x: number, y: number): PDFDocument

// Gradients & Patterns
doc.fillWithGradient(gradient: Gradient): PDFDocument
doc.rectWithGradient(x: number, y: number, width: number, height: number, gradient: Gradient): PDFDocument
doc.fillWithPattern(pattern: TilingPatternOptions): PDFDocument
doc.rectWithPattern(x: number, y: number, width: number, height: number, pattern: TilingPatternOptions): PDFDocument
```

### Table Methods

```typescript
doc.table(options: TableOptions): PDFDocument
```

<details>
<summary><b>Table Options</b></summary>

```typescript
interface TableOptions {
  // Position & data
  x: number
  y: number
  width?: number
  headers: string[]
  rows: (string | TableCell)[][]

  // Styling
  headerStyle?: {
    backgroundColor?: string
    textColor?: string
    fontSize?: number
    bold?: boolean
    align?: 'left' | 'center' | 'right'
  }
  rowHeight?: number
  alternateRowColor?: string
  cellPadding?: number
  defaultAlign?: 'left' | 'center' | 'right'

  // Borders
  borders?: {
    all?: boolean
    horizontal?: boolean
    vertical?: boolean
    outer?: boolean
    headerBottom?: boolean
    style?: TableBorderStyle
  }

  // Auto page breaks
  autoPageBreak?: boolean
  repeatHeader?: boolean
  bottomMargin?: number
}
```

</details>

### Image Methods

```typescript
doc.image(source: string | Buffer, options: ImageOptions): PDFDocument
doc.image(source: string | Buffer, x: number, y: number, options?: ImageOptions): PDFDocument
```

### QR Code Methods

```typescript
await doc.qrCode(options: QRCodeOptions): Promise<PDFDocument>
```

### Form Methods

```typescript
doc.setForm(options: FormOptions): PDFDocument
doc.addFormField(field: FormField): PDFDocument
```

### Annotation Methods

```typescript
doc.addAnnotation(annotation: Annotation): PDFDocument
doc.addNote(options): PDFDocument
doc.addHighlight(options): PDFDocument
doc.addUnderline(options): PDFDocument
doc.addStrikeOut(options): PDFDocument
doc.addSquare(options): PDFDocument
doc.addCircle(options): PDFDocument
doc.addFreeText(options): PDFDocument
doc.addStamp(options): PDFDocument
doc.addInk(options): PDFDocument
```

### Link Methods

```typescript
doc.addLink(link: Link): PDFDocument
doc.addExternalLink(options: ExternalLink): PDFDocument
doc.addInternalLink(options: InternalLink): PDFDocument
```

### Watermark Methods

```typescript
doc.addWatermark(watermark: Watermark): PDFDocument
doc.addTextWatermark(options): PDFDocument
doc.addImageWatermark(options): PDFDocument
```

### Attachment Methods

```typescript
doc.attachFile(attachment: FileAttachment): PDFDocument
doc.addFileAnnotation(annotation: FileAttachmentAnnotation): PDFDocument
```

### Bookmark Methods

```typescript
doc.setBookmarks(bookmarks: BookmarkOptions[]): PDFDocument
doc.addBookmark(bookmark: BookmarkOptions): PDFDocument
doc.addSimpleBookmark(title: string, page?: number, options?): PDFDocument
```

### Font Methods

```typescript
doc.registerFont(customFont: CustomFont): PDFDocument
doc.useFont(fontName: string): PDFDocument
doc.useBaseFont(baseFont: PDFBaseFont): PDFDocument
```

### Metadata Methods

```typescript
doc.enableXMPMetadata(): PDFDocument
doc.setExtendedMetadata(metadata: ExtendedMetadata): PDFDocument
doc.updateInfo(info: Partial<DocumentInfo>): PDFDocument
```

### Page Methods

```typescript
doc.addPage(size?: PageSize | [number, number]): PDFDocument
doc.switchToPage(pageIndex: number): PDFDocument
doc.getCurrentPageNumber(): number
doc.getPageCount(): number
doc.rotatePage(pageIndex: number, rotation: PageRotation): PDFDocument
doc.rotateCurrentPage(rotation: PageRotation): PDFDocument
doc.duplicatePage(pageIndex: number): PDFDocument
doc.reorderPages(newOrder: number[]): PDFDocument
doc.deletePage(pageIndex: number): PDFDocument
```

### Layer Methods

```typescript
doc.createLayer(options: LayerOptions): PDFDocument
doc.beginLayer(layerName: string): PDFDocument
doc.endLayer(): PDFDocument
```

### Advanced Methods

```typescript
doc.createFormXObject(options: FormXObjectOptions): PDFDocument
doc.useFormXObject(name: string, placement: FormXObjectPlacementOptions): PDFDocument
doc.beginTransparencyGroup(isolated?: boolean, knockout?: boolean): PDFDocument
doc.endTransparencyGroup(): PDFDocument
```

---

## ⚙️ Global Configuration

Configure default metadata values once at application startup:

```typescript
import { configure, resetConfig, PDFStudioConfig } from '@pdfstudio/pdfstudio'

// Set company-wide defaults
configure({
  defaultCreator: 'Acme Corporation',
  defaultProducer: 'Acme Document System v2.0',
  defaultAnnotationAuthor: 'Acme Bot'
})

// All subsequent PDFs use these defaults
const doc = new PDFDocument({
  info: {
    Title: 'Invoice #12345',
    Author: 'Billing System'
    // Creator & Producer automatically use configured defaults
  }
})

// Override per document if needed
const specialDoc = new PDFDocument({
  info: {
    Creator: 'Custom Tool',  // Overrides global default
    Producer: 'v1.0'
  }
})

// Reset to library defaults
resetConfig()
```

**Configuration Options:**
- `defaultCreator` - Default Creator metadata (default: `'PDFStudio'`)
- `defaultProducer` - Default Producer metadata (default: `'PDFStudio PDF Library'`)
- `defaultAnnotationAuthor` - Default author for annotations (default: `'PDFStudio'`)

Perfect for:
- Company branding across all documents
- Multi-language applications
- SaaS platforms with white-labeling

---

## 📐 Page Sizes

```typescript
// Standard sizes
const doc = new PDFDocument({ size: 'Letter' })    // 8.5" × 11" (612 × 792 pts)
const doc = new PDFDocument({ size: 'Legal' })     // 8.5" × 14" (612 × 1008 pts)
const doc = new PDFDocument({ size: 'A4' })        // 210 × 297 mm (595 × 842 pts)

// Custom size
const doc = new PDFDocument({ size: [600, 800] })  // Width × Height in points
```

**Available Sizes:**
- **ISO A Series**: A3, A4, A5, A6
- **ISO B Series**: B4, B5
- **North American**: Letter, Legal, Tabloid, Ledger, Executive, HalfLetter, Statement
- **Other**: Folio

---

## 🎨 Use Cases

- **Business Reports** - Charts, tables, headers/footers
- **Invoices & Receipts** - Formatted layouts with QR codes
- **Certificates** - Vector graphics with custom fonts
- **Forms** - Interactive AcroForms
- **Product Catalogs** - Multi-page with images
- **Technical Documentation** - Bookmarks, annotations, attachments
- **Marketing Materials** - Watermarks, security, metadata
- **Data Visualizations** - Native charts without external dependencies

---

## 📚 Documentation

- [Chart Examples](https://github.com/pdfstudio-dev/pdfstudio/tree/main/examples)
- [TypeScript Types](https://github.com/pdfstudio-dev/pdfstudio/blob/main/src/types.ts)
- [Contributing Guide](https://github.com/pdfstudio-dev/pdfstudio/blob/main/CONTRIBUTING.md)
- [Changelog](https://github.com/pdfstudio-dev/pdfstudio/blob/main/CHANGELOG.md)

---

## 🔧 TypeScript

PDFStudio is built with TypeScript and provides complete type definitions:

```typescript
import {
  PDFDocument,
  PDFDocumentOptions,
  BarChartOptions,
  TextOptions,
  configure,
  PDFStudioConfig
} from '@pdfstudio/pdfstudio'

const options: PDFDocumentOptions = {
  size: 'Letter',
  margins: 50,
  info: {
    Title: 'My Document'
  }
}

const doc = new PDFDocument(options)

const chartOptions: BarChartOptions = {
  data: [{ label: 'Q1', value: 100 }],
  x: 100,
  y: 400,
  width: 400,
  height: 250
}

doc.barChart(chartOptions)
```

---

## 🛠️ Development

```bash
# Clone repository
git clone https://github.com/pdfstudio-dev/pdfstudio.git
cd pdfstudio

# Install dependencies
npm install

# Run tests
npm test                # Run all 180 tests

# Build
npm run build           # Compile TypeScript

# Development
npm run dev             # Watch mode

# Run examples
npm run examples        # Generate all example PDFs
```

---

## 📋 Requirements

- **Node.js**: >= 14.0.0
- **TypeScript**: >= 5.0 (dev dependency)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/pdfstudio-dev/pdfstudio/blob/main/CONTRIBUTING.md) for details.

**Quick Start:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](https://github.com/pdfstudio-dev/pdfstudio/blob/HEAD/LICENSE) file for details.

---

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/pdfstudio-dev/pdfstudio/issues)
- **Discussions**: [GitHub Discussions](https://github.com/pdfstudio-dev/pdfstudio/discussions)
- **Email**: pdfstudio@ideas2code.dev

---

## ⭐ Acknowledgments

Built with:
- [fontkit](https://github.com/foliojs/fontkit) - Font parsing
- [pako](https://github.com/nodeca/pako) - Zlib compression
- [qrcode](https://github.com/soldair/node-qrcode) - QR code generation
- [sharp](https://github.com/lovell/sharp) - Image processing

Inspired by [PDFKit](https://github.com/foliojs/pdfkit) with modern enhancements.

---

<div align="center">

**[⬆ Back to Top](#pdfstudio)**

Made with ❤️ for the Node.js community from MN, USA

</div>
