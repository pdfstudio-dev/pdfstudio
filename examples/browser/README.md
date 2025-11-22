# Browser Examples

This directory contains examples of using PDFStudio in web browsers.

## Getting Started

1. **Build the browser bundle:**
   ```bash
   npm install
   npm run build:browser
   ```

2. **Serve the example HTML:**
   ```bash
   # Using Python (Python 3)
   python3 -m http.server 8000

   # Using Node.js (with http-server package)
   npx http-server -p 8000

   # Or any other static file server
   ```

3. **Open in browser:**
   Navigate to http://localhost:8000/examples/browser/

## Features Demonstrated

- ✅ **Simple PDF Generation** - Basic text and shapes
- ✅ **Charts** - Bar charts, pie charts, line charts
- ✅ **QR Codes** - Generate QR codes inline
- ✅ **Tables** - Professional table layouts
- ✅ **Invoices** - Complete invoice templates
- ✅ **Reports** - Multi-section reports

## Usage in Your Application

### Using CDN (Coming Soon)
```html
<script src="https://cdn.jsdelivr.net/npm/@pdfstudio/pdfstudio/dist/pdfstudio.standalone.js"></script>
```

### Using npm
```bash
npm install @pdfstudio/pdfstudio
```

```javascript
import { PDFDocument } from '@pdfstudio/pdfstudio';

const doc = new PDFDocument();
doc.text('Hello World!', 100, 100);
await doc.save('output.pdf'); // Triggers download
```

### Using with Bundlers (Webpack, Vite, etc.)
```javascript
import { PDFDocument } from '@pdfstudio/pdfstudio';

// Your bundler will automatically use the browser version
```

## Important Notes

### Images
When loading images in the browser, you can use:
- **URLs**: `doc.addImage('https://example.com/image.jpg', ...)`
- **File objects**: From `<input type="file">` elements
- **Data URLs**: Base64-encoded images
- **Buffers**: Binary image data

### Fonts
Custom fonts work the same way in browsers:
```javascript
await doc.registerFont({
  name: 'CustomFont',
  source: 'https://example.com/font.ttf', // URL
  // OR
  source: fileInputElement.files[0], // File object
});
```

### File Output
In browsers, `doc.save('filename.pdf')` triggers a download instead of writing to the filesystem.

To get the PDF as a Blob:
```javascript
const buffer = await doc.toBuffer();
const blob = new Blob([buffer], { type: 'application/pdf' });
const url = URL.createObjectURL(blob);
// Use url for viewing in iframe, uploading, etc.
```

## Browser Compatibility

PDFStudio works in all modern browsers:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

Requires support for:
- ES2020
- Canvas API
- Blob API
- Web Crypto API

## Performance Tips

1. **Large PDFs**: Use pagination and avoid generating very large PDFs (>50MB) in the browser
2. **Images**: Compress images before adding them to PDFs
3. **Fonts**: Only load fonts you need, use subsetting when possible
4. **Workers**: For heavy processing, consider using Web Workers (advanced)

## Troubleshooting

### "sharp is not defined" error
This means the browser bundle wasn't built correctly. Run `npm run build:browser`.

### Large bundle size
The standalone bundle includes all dependencies. For smaller bundles:
- Use tree-shaking with modern bundlers (Webpack 5, Vite, Rollup)
- Only import what you need
- Consider code splitting

### Memory issues
Large PDFs can consume significant memory. Consider:
- Processing in chunks
- Using streaming where possible
- Limiting concurrent PDF generations

## Examples

See `index.html` for complete working examples!
