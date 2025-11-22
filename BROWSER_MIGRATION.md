# Browser Migration Summary

## 🎉 What's New

PDFStudio v0.2.0 is now **isomorphic** - it works in both Node.js AND browsers!

## 🏗️ Architecture Changes

### Platform Abstraction Layer

Created a new platform abstraction layer to support multiple environments:

```
src/
├── platform/
│   ├── interfaces/          # Abstract interfaces
│   │   ├── IFileSystem.ts
│   │   └── IImageProcessor.ts
│   ├── node/               # Node.js implementations
│   │   ├── NodeFileSystem.ts
│   │   └── NodeImageProcessor.ts
│   ├── browser/            # Browser implementations
│   │   ├── BrowserFileSystem.ts
│   │   └── BrowserImageProcessor.ts
│   └── PlatformFactory.ts  # Auto-detects environment
```

### Key Changes

#### 1. Image Processing
- **Node.js**: Still uses `sharp` for optimal performance
- **Browser**: Uses Canvas API for image processing
- **Interface**: `IImageProcessor` provides unified API

#### 2. File System
- **Node.js**: Uses native `fs` module
- **Browser**: Uses FileReader API, fetch API, and Blob API
- **Interface**: `IFileSystem` provides unified API

#### 3. Async APIs
Several methods are now async to support browser file loading:

```typescript
// Before (Node.js only)
doc.registerFont({ name: 'MyFont', source: './font.ttf' });
doc.save('output.pdf');

// After (Node.js + Browser)
await doc.registerFont({ name: 'MyFont', source: './font.ttf' });
await doc.save('output.pdf');
```

### Breaking Changes

#### Async Methods

The following methods are now `async`:

- `PDFDocument.registerFont()` → `async registerFont()`
- `PDFDocument.save()` → `async save()`
- `PDFDocument.toBuffer()` → `async toBuffer()`
- `PDFDocument.end()` → `async end()`
- `PDFWriter.registerCustomFont()` → `async registerCustomFont()`
- `PDFWriter.generate()` → `async generate()`
- `PDFWriter.embedImage()` → `async embedImage()`
- `ImageParser.load()` → `async load()`

#### Migration Example

**Before (v0.1.x):**
```typescript
const doc = new PDFDocument();
doc.registerFont({ name: 'MyFont', source: './font.ttf' });
doc.text('Hello', 100, 100);
doc.save('output.pdf');
```

**After (v0.2.x):**
```typescript
const doc = new PDFDocument();
await doc.registerFont({ name: 'MyFont', source: './font.ttf' });
doc.text('Hello', 100, 100);
await doc.save('output.pdf');
```

### Dependencies Changes

#### New Dependencies
- `buffer` - Buffer polyfill for browsers
- `esbuild` - Build tool for browser bundle

#### Modified Dependencies
- `sharp` - Moved to `optionalDependencies` (not required in browsers)

### Build System

New build scripts:

```json
{
  "scripts": {
    "build": "npm run build:node && npm run build:browser",
    "build:node": "tsc",
    "build:browser": "node scripts/build-browser.js"
  }
}
```

Output files:
- `dist/index.js` - Node.js version (CommonJS)
- `dist/pdfstudio.standalone.js` - Browser version (IIFE, minified)
- `dist/pdfstudio.standalone.debug.js` - Browser version (IIFE, debug)

## 🚀 New Features

### Browser Support
- ✅ Generate PDFs directly in the browser
- ✅ No server required
- ✅ Same API as Node.js
- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)

### File Handling
- ✅ Load images from URLs
- ✅ Load images from File objects (`<input type="file">`)
- ✅ Load images from data URLs
- ✅ Load fonts from URLs or File objects
- ✅ Download PDFs or get as Blob

### Browser-Specific Features
```javascript
// Download PDF
await doc.save('output.pdf'); // Triggers download

// Get as Blob (for upload, viewing, etc.)
const buffer = await doc.toBuffer();
const blob = new Blob([buffer], { type: 'application/pdf' });
const url = URL.createObjectURL(blob);

// View in browser
window.open(url, '_blank');

// Upload to server
const formData = new FormData();
formData.append('pdf', blob, 'document.pdf');
await fetch('/api/upload', { method: 'POST', body: formData });
```

## 📚 Documentation

New documentation:
- `BROWSER.md` - Complete browser guide
- `examples/browser/` - Browser examples
- `examples/browser/README.md` - Browser examples documentation
- Updated main README with browser section

## 🔄 Migration Checklist

For existing users upgrading from v0.1.x to v0.2.x:

- [ ] Update all `doc.save()` calls to `await doc.save()`
- [ ] Update all `doc.registerFont()` calls to `await doc.registerFont()`
- [ ] Update all `doc.toBuffer()` calls to `await doc.toBuffer()`
- [ ] Update all `doc.end()` calls to `await doc.end()`
- [ ] Update all `ImageParser.load()` calls to `await ImageParser.load()`
- [ ] Wrap affected code in `async` functions
- [ ] Test your application

### Example Migration

**Before:**
```typescript
function generateInvoice() {
  const doc = new PDFDocument();
  doc.registerFont({ name: 'Arial', source: './arial.ttf' });
  doc.text('Invoice', 100, 100);
  doc.save('invoice.pdf');
}
```

**After:**
```typescript
async function generateInvoice() {
  const doc = new PDFDocument();
  await doc.registerFont({ name: 'Arial', source: './arial.ttf' });
  doc.text('Invoice', 100, 100);
  await doc.save('invoice.pdf');
}
```

## 🎯 Benefits

1. **Universal**: Write once, run anywhere (Node.js + Browser)
2. **No Breaking API**: Same API for both environments
3. **Better Performance**: Optimized implementations for each platform
4. **Modern**: Uses latest browser APIs (Canvas, Blob, Web Crypto)
5. **Future-Proof**: Foundation for other platforms (React Native, Electron)

## 🐛 Known Limitations

### Browser Version
1. **Memory**: Large PDFs (>50MB) may hit browser memory limits
2. **Performance**: Image processing slightly slower than Node.js (Canvas vs sharp)
3. **Sync Crypto**: Some crypto operations are async in browsers

## 📞 Support

- 📖 [Browser Documentation](BROWSER.md)
- 📖 [Main Documentation](README.md)
- 💬 [GitHub Issues](https://github.com/pdfstudio-dev/pdfstudio/issues)
- 📧 Email: hello@ideas2code.dev
