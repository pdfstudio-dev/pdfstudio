# 🌐 Browser Support

PDFStudio now works in web browsers! Generate professional PDFs client-side without needing a server.

## Quick Start

### Option 1: Using Standalone Bundle (Recommended)

1. **Build the bundle:**
   ```bash
   npm install @pdfstudio/pdfstudio
   npm run build:browser
   ```

2. **Include in HTML:**
   ```html
   <script src="node_modules/@pdfstudio/pdfstudio/dist/pdfstudio.standalone.js"></script>
   <script>
     const { PDFDocument } = PDFStudio;

     async function generatePDF() {
       const doc = new PDFDocument({
         title: 'My Browser PDF',
         author: 'Your Name'
       });

       doc.text('Hello from the browser!', 100, 100, 24);

       // In browser, this triggers a download
       await doc.save('output.pdf');
     }
   </script>
   ```

### Option 2: Using Module Bundlers (Webpack, Vite, Rollup)

```javascript
import { PDFDocument } from '@pdfstudio/pdfstudio';

async function generatePDF() {
  const doc = new PDFDocument();
  doc.text('Hello World', 100, 100);
  await doc.save('output.pdf');
}
```

Your bundler will automatically use the browser-compatible version.

### Option 3: CDN (Coming Soon)

```html
<script src="https://cdn.jsdelivr.net/npm/@pdfstudio/pdfstudio"></script>
```

## Features

All PDFStudio features work in browsers:

- ✅ **Text & Graphics** - Full PDF rendering
- ✅ **Charts** - Bar, pie, line charts
- ✅ **Tables** - Professional layouts
- ✅ **QR Codes** - Generate QR codes inline
- ✅ **Images** - From URLs, File objects, or data URLs
- ✅ **Custom Fonts** - Load fonts from URLs or File objects
- ✅ **Watermarks** - Text and image watermarks
- ✅ **Security** - Password protection and encryption
- ✅ **Metadata** - Title, author, keywords, etc.

## API Differences

The API is identical to Node.js, with a few browser-specific behaviors:

### File Output

```javascript
// Node.js: Saves to filesystem
await doc.save('/path/to/output.pdf');

// Browser: Triggers download
await doc.save('output.pdf'); // Downloads as "output.pdf"

// Get as Blob instead (for uploading, viewing, etc.)
const buffer = await doc.toBuffer();
const blob = new Blob([buffer], { type: 'application/pdf' });
const url = URL.createObjectURL(blob);

// Use for preview
document.getElementById('pdf-viewer').src = url;

// Or upload to server
const formData = new FormData();
formData.append('pdf', blob, 'document.pdf');
await fetch('/upload', { method: 'POST', body: formData });
```

### Loading Images

```javascript
// From URL
doc.addImage('https://example.com/image.jpg', 100, 100);

// From File input
const fileInput = document.getElementById('imageInput');
const file = fileInput.files[0];
doc.addImage(file, 100, 100);

// From Data URL
doc.addImage('data:image/png;base64,iVBORw0K...', 100, 100);

// From Buffer
const response = await fetch('https://example.com/image.jpg');
const buffer = Buffer.from(await response.arrayBuffer());
doc.addImage(buffer, 100, 100);
```

### Loading Fonts

```javascript
// From URL
await doc.registerFont({
  name: 'MyFont',
  source: 'https://example.com/font.ttf'
});

// From File input
const fontFile = document.getElementById('fontInput').files[0];
await doc.registerFont({
  name: 'MyFont',
  source: fontFile
});
```

## Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>PDF Generator</title>
</head>
<body>
  <h1>PDF Generator</h1>

  <div>
    <h3>Upload an Image:</h3>
    <input type="file" id="imageInput" accept="image/*">
  </div>

  <button onclick="generatePDF()">Generate PDF</button>

  <script src="node_modules/@pdfstudio/pdfstudio/dist/pdfstudio.standalone.js"></script>
  <script>
    async function generatePDF() {
      const { PDFDocument } = PDFStudio;

      const doc = new PDFDocument({
        title: 'Invoice',
        author: 'Your Company'
      });

      // Header
      doc.fillColor(0.2, 0.3, 0.8);
      doc.rect(0, 0, 612, 80);
      doc.fill();

      doc.fillColor(1, 1, 1);
      doc.text('INVOICE', 50, 30, 28, 'Helvetica-Bold');

      // Body
      doc.fillColor(0, 0, 0);
      doc.text('Invoice #12345', 50, 120, 14);
      doc.text('Date: ' + new Date().toLocaleDateString(), 50, 140, 12);

      // Add table
      doc.table({
        headers: ['Item', 'Qty', 'Price', 'Total'],
        rows: [
          ['Service A', '5', '$100', '$500'],
          ['Service B', '3', '$150', '$450'],
        ],
        x: 50,
        y: 180,
        width: 500
      });

      // Add image if selected
      const imageInput = document.getElementById('imageInput');
      if (imageInput.files.length > 0) {
        const file = imageInput.files[0];
        doc.addImage(file, 50, 350, { width: 200 });
      }

      // Add QR code
      await doc.qrCode({
        data: 'https://yourcompany.com/invoice/12345',
        x: 450,
        y: 350,
        size: 100
      });

      // Total
      doc.text('Total: $950.00', 400, 500, 18, 'Helvetica-Bold');

      // Save (triggers download)
      await doc.save('invoice-12345.pdf');

      alert('PDF generated successfully!');
    }
  </script>
</body>
</html>
```

## Advanced Usage

### Viewing PDF in Browser

```javascript
const buffer = await doc.toBuffer();
const blob = new Blob([buffer], { type: 'application/pdf' });
const url = URL.createObjectURL(blob);

// Open in new tab
window.open(url, '_blank');

// Or embed in iframe
document.getElementById('pdf-viewer').src = url;

// Remember to revoke when done
URL.revokeObjectURL(url);
```

### Uploading to Server

```javascript
const buffer = await doc.toBuffer();
const blob = new Blob([buffer], { type: 'application/pdf' });

const formData = new FormData();
formData.append('file', blob, 'document.pdf');
formData.append('title', 'My Document');

const response = await fetch('/api/upload-pdf', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log('Uploaded:', result.url);
```

### Using Web Workers (Advanced)

For heavy PDFs, use Web Workers to avoid blocking the main thread:

```javascript
// worker.js
importScripts('node_modules/@pdfstudio/pdfstudio/dist/pdfstudio.standalone.js');

self.onmessage = async function(e) {
  const { PDFDocument } = PDFStudio;
  const doc = new PDFDocument();

  // ... generate PDF ...

  const buffer = await doc.toBuffer();
  self.postMessage(buffer);
};

// main.js
const worker = new Worker('worker.js');

worker.onmessage = function(e) {
  const buffer = e.data;
  const blob = new Blob([buffer], { type: 'application/pdf' });
  // ... handle PDF ...
};

worker.postMessage({ /* config */ });
```

## Browser Compatibility

PDFStudio requires modern browsers with:

- ✅ ES2020 support
- ✅ Canvas API
- ✅ Blob API
- ✅ Web Crypto API
- ✅ FileReader API

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Tips

1. **Compression**: Always enable compression for smaller file sizes
   ```javascript
   doc.setCompression({ level: 6 });
   ```

2. **Image Optimization**: Resize images before adding
   ```javascript
   // Resize to max 800px before adding
   const resizedImage = await resizeImage(file, 800);
   doc.addImage(resizedImage, x, y);
   ```

3. **Font Subsetting**: Use font subsetting to reduce file size
   ```javascript
   await doc.registerFont({
     name: 'MyFont',
     source: 'font.ttf',
     subset: true // Only include used characters
   });
   ```

4. **Pagination**: Break large documents into pages
   ```javascript
   // Don't generate 1000-page PDFs at once
   // Consider generating in batches or offering pagination
   ```

5. **Memory Management**: Clear references when done
   ```javascript
   const buffer = await doc.toBuffer();
   doc = null; // Allow GC to clean up
   ```

## Limitations

Browser version has some limitations compared to Node.js:

1. **No filesystem access**: Can't read/write files directly (use File API instead)
2. **Memory limits**: Large PDFs (>50MB) may hit browser memory limits
3. **No native image processing**: sharp is replaced with Canvas API (slightly slower)
4. **Synchronous crypto not available**: Some crypto operations are async

## Troubleshooting

### Bundle Size Too Large

The standalone bundle is ~2MB minified. To reduce:

1. Use a modern bundler with tree-shaking:
   ```javascript
   import { PDFDocument } from '@pdfstudio/pdfstudio';
   // Only imports what you use
   ```

2. Use dynamic imports:
   ```javascript
   const { PDFDocument } = await import('@pdfstudio/pdfstudio');
   ```

3. Consider splitting code:
   ```javascript
   // Only load heavy features when needed
   if (needsCharts) {
     await import('@pdfstudio/pdfstudio/charts');
   }
   ```

### "Cannot find module" Errors

Make sure you've built the browser bundle:
```bash
npm run build:browser
```

### Memory Errors

For large PDFs:
1. Use pagination
2. Clear references after generation
3. Consider using Web Workers
4. Avoid loading many large images at once

### CORS Errors with Images

Images from URLs must allow CORS:
```javascript
// Server must send: Access-Control-Allow-Origin: *

// Or use a proxy:
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
doc.addImage(proxyUrl + imageUrl, x, y);
```

## Examples

See `examples/browser/` for complete working examples!

## Support

- 📖 [Full Documentation](README.md)
- 💬 [GitHub Issues](https://github.com/pdfstudio-dev/pdfstudio/issues)
- 📧 Email: hello@ideas2code.dev

## License

MIT License - see [LICENSE](LICENSE) for details
