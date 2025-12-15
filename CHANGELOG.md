# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.3] - 2025-02-14

### 📝 Documentation
- Updated README.md version reference in comparison table to v0.3.2

## [0.3.2] - 2025-02-14

### 🐛 Bug Fixes

#### Table Header Positioning (Critical Bug Fix)
- **Fixed table headers rendering below data rows instead of above**
- Root cause: Incorrect handling of PDF coordinate system where Y-axis grows upward from bottom
- Solution: Comprehensive coordinate system overhaul in Table.ts affecting 8 critical locations:
  - Changed `rect(x, y, width, height)` to `rect(x, y, width, -height)` for downward drawing (3 locations)
  - Inverted `calculateTextY()` logic to properly position text in downward-drawing cells
  - Fixed header border Y position from `y + height` to `y - height`
  - Fixed row border Y position from `y + height` to `y - height`
  - Corrected vertical border drawing direction
  - Rewrote outer borders logic to properly handle top/bottom/left/right borders

### ✅ Testing
- Added comprehensive table test suite with 39 new unit tests
- Total test count increased from 229 to 268 tests
- All tests passing (268/268)
- Coverage includes: basic rendering, column handling, styling, alignment, borders, page breaks, edge cases

## [0.3.1] - 2025-02-02

### 🎉 New Text Layout Features

PDFStudio v0.3.1 adds two highly-requested professional text formatting features that solve common layout challenges.

### ✨ Added

#### 📏 Ellipsis (Text Truncation with Overflow Indicator)
- **`ellipsis`** option in `TextOptions` for automatic text truncation when content exceeds available height
- Support for both boolean (`true` = "...") and custom string ellipsis characters
- Intelligent binary search algorithm for optimal truncation point (O(log n) performance)
- Respects word boundaries when possible
- Works seamlessly with multi-column layout, text alignment, and all existing text features
- Perfect for: product descriptions, article previews, content cards, summaries

```typescript
doc.text(longText, {
  width: 200,
  height: 60,      // Limited height
  ellipsis: true   // Auto-truncate with "..."
})

// Custom ellipsis
doc.text(article, {
  width: 400,
  height: 80,
  ellipsis: '...[Read More]'  // Custom indicator
})
```

#### 📐 Paragraph Gap (Precise Paragraph Spacing)
- **`paragraphGap`** option in `TextOptions` for adding space after paragraphs
- Measured in points for precise control
- Automatically updates `currentY` position for seamless flow with `getCurrentY()`
- Works with both full `TextOptions` object and simple text signature
- Enables professional typography with consistent vertical rhythm
- Perfect for: documentation, reports, articles, formatted documents

```typescript
doc.text('First paragraph', {
  x: 50, y: 700,
  width: 500,
  paragraphGap: 20   // 20pt space after
})

doc.text('Second paragraph', {
  x: 50,
  y: doc.getCurrentY(),  // Auto-positioned
  width: 500,
  paragraphGap: 15
})
```

### 🔧 Technical Implementation

- **New Method**: `TextMeasure.truncateWithEllipsis()` - Binary search algorithm for efficient text truncation
- **Enhanced**: `PDFWriter.text()` - Now applies ellipsis before multi-column layout for accuracy
- **Enhanced**: `PDFWriter.text()` - Applies paragraph gap after text rendering, before graphics state restore
- **Type Definitions**:
  - `ellipsis?: boolean | string` in `TextOptions`
  - `paragraphGap?: number` in `TextOptions`

### 📊 Examples & Documentation

- **`examples/test-ellipsis-paragraphgap.ts`** - Comprehensive test suite with 5 test cases
- **`examples/example-product-catalog.ts`** - Real-world product catalog with truncated descriptions
- **`examples/example-article-preview.ts`** - Newsletter with article previews using custom ellipsis
- **`examples/example-documentation.ts`** - Professional documentation with consistent paragraph spacing

### 🧪 Testing

- **Unit Tests**: `tests/text/TextMeasure.test.ts` - 17 test cases for `truncateWithEllipsis()`
- **Integration Tests**: `tests/core/PDFWriter-ellipsis-paragraphgap.test.ts` - 30+ test cases
- All tests passing with edge case coverage

### 📈 Performance

- **Ellipsis Truncation**: O(log n) complexity using binary search (efficient for long texts)
- **Paragraph Gap**: O(1) - simple Y-position adjustment
- **Memory**: No additional memory overhead

### 🎯 Use Cases

1. **Product Catalogs** - Fit descriptions in fixed-size cards
2. **Article Previews** - Show excerpts with "Read More" indicators
3. **Content Cards** - Truncate content to fixed heights
4. **Documentation** - Professional paragraph spacing
5. **Reports** - Consistent vertical rhythm
6. **Newsletters** - Preview content with ellipsis

### 💡 Combined Features Example

```typescript
// Ellipsis + ParagraphGap + Multi-Column
doc.text(longArticle, {
  x: 50, y: 700,
  width: 500,
  height: 120,
  fontSize: 10,
  columns: 2,
  columnGap: 20,
  align: 'justify',
  ellipsis: '...[Continue Reading]',
  paragraphGap: 25  // Space before next section
})

doc.text('Next section...', {
  x: 50,
  y: doc.getCurrentY(),  // Automatically positioned
  width: 500
})
```

### 🔄 Compatibility

- ✅ Fully backward compatible - existing code works without changes
- ✅ Works with all text features: rotation, multi-column, alignment, decorations
- ✅ Compatible with `moveDown()`, `moveUp()`, `getCurrentY()`
- ✅ Node.js and Browser support

### 📚 Breaking Changes

None - this is a feature addition with full backward compatibility.

---

## [0.3.0] - 2025-01-25

### 🎉 Major New Feature: Advanced Text Features & Industry-Standard API

PDFStudio now implements industry-standard text layout features, including multi-column layout, text flow control, lists, and internal navigation. This release adds 6 professional features that complete our comprehensive text handling capabilities.

### ✨ Added

#### 📝 Text Flow Control (PDFKit Compatible)
- **`moveDown([lines])`** - Move cursor down by specified number of lines for natural text flow
- **`moveUp([lines])`** - Move cursor up by specified number of lines
- **`getCurrentY()`** / **`getCurrentX()`** - Get current cursor position for precise positioning
- Automatic line height tracking for consistent spacing

```typescript
doc.text('First line', 100, 750, 14)
   .moveDown()     // Move 1 line down
   .text('Second line', 100, doc.getCurrentY(), 12)
   .moveDown(2)    // Move 2 lines down
   .moveUp(1)      // Move back up 1 line
```

#### 🔲 Rounded Rectangles (PDFKit Compatible)
- **`roundedRect(x, y, width, height, radius)`** - Draw rectangles with rounded corners
- Support for uniform corner radius or different horizontal/vertical radii `[rx, ry]`
- Perfect circular arcs using Bezier curves (k = 0.5522847498)
- Compatible with all fill/stroke operations

```typescript
doc.roundedRect(100, 100, 200, 150, 15).stroke()
doc.roundedRect(100, 300, 200, 150, [20, 10]).fillAndStroke('#3498db', '#2c3e50')
```

#### 🔄 Text Rotation (PDFKit Compatible)
- **`rotation`** option in `TextOptions` for rotating text at any angle
- Rotation in degrees (clockwise), around the text anchor point (x, y)
- Automatic graphics state save/restore
- Works with all text options (alignment, decoration, etc.)

```typescript
doc.text('Rotated 45°', 100, 550, 12, { rotation: 45 })
doc.text('Rotated 90°', 250, 550, 12, { rotation: 90 })
```

#### 📰 Multi-Column Text Layout (PDFKit Compatible)
- **`columns`** option for flowing text into multiple columns (2, 3, 4+)
- **`columnGap`** option for space between columns (default: 18pt = 1/4 inch, same as PDFKit)
- Automatic equal distribution of lines across columns
- Word wrapping within each column
- Compatible with all text formatting options

```typescript
doc.text(longText, 100, 480, 10, {
  width: 400,
  height: 120,
  columns: 2,       // Flow into 2 columns
  columnGap: 20,    // 20pt gap between columns
  align: 'justify'
})
```

#### 🔗 Named Destinations & Internal Links (PDFKit Compatible)
- **`destination`** option to create named anchors anywhere in the document
- **`goTo`** option to create links that navigate to named destinations
- Named destinations stored in document-level registry
- Support for different fit types (Fit, FitH, FitV, XYZ)
- Perfect for table of contents, cross-references, and navigation

```typescript
// Create a named destination
doc.text('Chapter 1', 100, 750, 16, { destination: 'chapter1' })

// Link to the destination from anywhere
doc.text('Go to Chapter 1', 100, 500, 12, { goTo: 'chapter1' })
```

#### 📋 Bulleted & Numbered Lists (PDFKit Compatible)
- **`list(items, x, y, options)`** - Render bulleted or numbered lists automatically
- **8 Built-in Bullet Styles:**
  - `disc` (•), `circle` (◦), `square` (▪)
  - `decimal` (1. 2. 3.)
  - `lower-alpha` (a. b. c.), `upper-alpha` (A. B. C.)
  - `lower-roman` (i. ii. iii.), `upper-roman` (I. II. III.)
  - Custom strings ('★', '→', etc.)
- Automatic word wrapping for long list items
- Configurable indents, gaps, and spacing
- Roman numeral conversion algorithm included

```typescript
// Bulleted list
doc.list(['First item', 'Second item', 'Third item'], 100, 700, {
  bulletStyle: 'disc',
  fontSize: 11
})

// Numbered list
doc.list(['Step 1', 'Step 2', 'Step 3'], 100, 600, {
  bulletStyle: 'decimal'
})

// Roman numerals
doc.list(['Chapter I', 'Chapter II', 'Chapter III'], 100, 500, {
  bulletStyle: 'upper-roman'
})
```

### 🔧 API Enhancements
- **Enhanced `text()` Signature** - Now accepts options object as 4th parameter for PDFKit compatibility
  - `text(text, x, y, fontSize, options)` - NEW
  - `text(text, x, y, fontSize, font)` - Existing
  - `text(text, x, y, fontSize)` - Existing
- **New Types**:
  - `BulletStyle` - Type for list bullet styles
  - `ListOptions` - Complete options for list() method
  - `GoToLink` - Link type for named destination navigation
  - `NamedDestination` - Destination definition with fit options

### 📊 Updated Type Definitions
- **`TextOptions`** extended with:
  - `rotation?: number` - Rotate text in degrees
  - `columns?: number` - Number of columns for text flow
  - `columnGap?: number` - Gap between columns
  - `goTo?: string` - Navigate to named destination
  - `destination?: string` - Create named destination
- **`ListOptions`** - New complete interface for list configuration

### 🎨 Examples
- **`examples/test-new-features.ts`** - Comprehensive demo of all 6 new features
  - Text flow control with moveDown/moveUp
  - Rounded rectangles with different radii
  - Text rotation at various angles
  - Multi-column layout with justified text
  - Bulleted and numbered lists
  - Different list styles (disc, decimal, alpha, roman, custom)
  - Named destinations and goTo links

### 📈 Improvements
- **Better Code Organization** - New helper methods for column rendering and list generation
- **Roman Numeral Conversion** - Efficient algorithm for I, II, III, IV, V, etc.
- **Bezier Curve Optimization** - Precise rounded corners using standard k constant
- **Cursor Position Tracking** - Automatic tracking of X, Y, and line height for text flow

### 🧪 Testing
- **All 180 Tests Pass** - Full compatibility maintained across all features
- **Example PDF Generated** - `examples-output/test-new-features.pdf` demonstrates all new features
- **TypeScript Compilation** - Zero errors, strict mode enabled
- **Build Success** - Both Node.js and browser builds working perfectly

### 📦 Bundle Size
- **Node.js Build**: No change (tree-shaking removes unused code)
- **Browser Build**: 602KB minified (no significant increase)

### 📊 Complete Feature Set

PDFStudio v0.3.0 includes all industry-standard text features:

| Feature | Status |
|---------|--------|
| moveDown/moveUp | ✅ Implemented |
| roundedRect() | ✅ Implemented |
| Text Rotation | ✅ Implemented |
| Columns | ✅ Implemented |
| goTo/destination | ✅ Implemented |
| list() | ✅ Implemented |
| **Browser Support** | ✅ **Unique to PDFStudio** |
| **Native Charts** | ✅ **7 types built-in** |
| **QR Codes** | ✅ **9 data types** |
| **Global Config** | ✅ **Unique to PDFStudio** |

**Result**: PDFStudio now provides a complete, professional-grade PDF generation API with unique capabilities not available in other libraries.

### 🎯 Migration from PDFKit

All new features are **100% compatible** with PDFKit's API. Code using these features can be migrated to PDFStudio with zero changes:

```typescript
// This code works identically in both PDFKit and PDFStudio
doc.roundedRect(100, 100, 200, 100, 10).stroke()
   .text('Hello', 100, 250, 14)
   .moveDown()
   .text('World', 100, doc.getCurrentY(), 14)
   .list(['Item 1', 'Item 2', 'Item 3'], 100, 400)
```

---

## [0.2.0] - 2025-01-21

### 🎉 Major New Feature: Browser Support

PDFStudio now works natively in web browsers! Generate PDFs client-side with 100% API parity to the Node.js version.

### ✨ Added

#### 🌐 Browser Compatibility
- **Complete Platform Abstraction** - Seamless Node.js/Browser compatibility via adapter pattern
- **100% API Parity** - Identical API across Node.js and browsers
- **All Features Supported** - Charts, tables, QR codes, encryption, forms, annotations, etc.
- **Zero Server Dependencies** - Everything runs client-side
- **Modern Browser Support** - Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Small Bundle Size** - ~600KB minified (including all features)
- **TypeScript Support** - Full type definitions for browser environment

#### 🔐 Browser-Specific Implementations
- **Pure JavaScript MD5** - Custom MD5 implementation for PDF encryption in browsers
- **Web Crypto API Integration** - Secure random number generation
- **Canvas-Based Image Processing** - No dependencies for image handling
- **File System Abstraction** - `BrowserFileSystem` using Fetch API, FileReader, and Blob
- **Image Processor Abstraction** - `BrowserImageProcessor` using Canvas/OffscreenCanvas
- **Buffer Polyfill** - Full Buffer support via npm buffer package
- **Automatic Download** - Trigger file downloads or get as Blob for uploading

#### 📦 Build System
- **Dual Build Target** - Separate builds for Node.js (CommonJS) and Browser (IIFE)
- **esbuild Integration** - Fast, optimized browser bundling
- **Automatic Tree-Shaking** - Remove unused code
- **Smart Polyfills** - Only include necessary polyfills (Buffer, crypto)
- **Module Replacement** - Replace Node modules (fs, sharp) with browser equivalents
- **Source Maps** - Debug support for both minified and debug builds

#### 📚 Documentation
- **BROWSER.md** - Complete browser usage guide (406 lines)
- **BROWSER_MIGRATION.md** - Migration guide for existing users (211 lines)
- **80+ Browser Examples** - Interactive examples in `examples/browser/index.html`
- **Updated README** - Expanded browser support section with examples

#### 🔧 API Improvements
- **Async/Await Throughout** - All I/O operations now async
  - `registerFont()` → `async registerFont()`
  - `save()` → `async save()`
  - `toBuffer()` → `async toBuffer()`
  - `image()` → `async image()`
- **Enhanced Text Method** - Added signature `text(text, x, y, fontSize, font)` for PDFKit compatibility
- **Robust Error Handling** - `escapePDFString()` handles undefined values gracefully

### 🐛 Fixed
- **Table Text Alignment** - Corrected vertical centering in table cells with proper baseline calculations
- **File Attachments** - Fixed `escapePDFString()` crash when attachment name is undefined
- **Font Selection** - Fixed font parameter being ignored in simple text() calls
- **Crypto Compatibility** - MD5 hashing now works in browsers (previously unsupported)

### 🎨 Examples & Demos
- **Invoice Generator** - Real-world invoice with tables and totals
- **Business Report** - Multi-page report with KPIs and charts
- **Certificate** - Professional certificate with vector graphics
- **QR Code Examples** - Email, URL, WiFi, vCard, and more
- **Form Examples** - Interactive forms with encryption
- **Chart Gallery** - All 7 chart types with styling options

### 📐 Platform Differences
| Feature | Node.js | Browser |
|---------|---------|---------|
| File I/O | `fs` module | `fetch()` / `FileReader` / `Blob` |
| Image Processing | `sharp` (optional) | Canvas API |
| Font Loading | File paths | URLs or File objects |
| File Save | Disk write | Download trigger |
| Buffer | Native | Polyfilled |
| Crypto | Node crypto | Web Crypto + MD5 polyfill |

### 🔄 Breaking Changes
- **Async Operations** - Methods involving I/O are now async (add `await`)
  - `doc.save()` → `await doc.save()`
  - `doc.toBuffer()` → `await doc.toBuffer()`
  - `doc.registerFont()` → `await doc.registerFont()`
  - `doc.image()` → `await doc.image()`

### 📦 Dependencies
- **Added**: `buffer@^6.0.3` - Buffer polyfill for browsers
- **Added**: `esbuild@^0.19.0` - Browser bundle builder
- **Changed**: `sharp@^0.34.5` → `optionalDependencies` (not needed in browser)

### ⚡ Performance
- **Optimized Bundle** - Tree-shaking reduces unused code
- **Lazy Loading** - Platform adapters loaded on demand
- **Efficient Polyfills** - Minimal overhead for browser environment

### 🧪 Testing
- **All 180 Tests Pass** - Full compatibility maintained
- **Cross-Platform Testing** - Verified on Node.js and browsers
- **Browser Examples** - Comprehensive manual testing suite

---

## [0.1.1] - 2025-01-17

### 🎉 Initial Release

First stable release of PDFStudio - A modern PDF generation library for Node.js with advanced charts and vector graphics.

### ✨ Added

#### 📊 Charts and Visualizations
- **Bar Charts** - Vertical and horizontal orientation with customizable colors
- **Grouped Bar Charts** - Compare multiple data series side by side
- **Stacked Bar Charts** - Stack values to show totals and distribution
- **Line Charts** - Simple line charts with optional points
- **Multi-Line Charts** - Multiple series in the same chart for comparisons
- **Area Charts** - Filled area under the curve with configurable opacity
- **Pie Charts** - Circular charts with automatic percentage calculation
- **Donut Charts** - Donut charts with center hole and custom text
- **Chart Gradients** - Gradient effects for bars (linear and radial)
- **Chart Shadows** - Shadow effects for enhanced visualization
- **Chart Legends** - Automatic legends with 6 different positions
- **Customizable Grids** - Full control over grid and axis styling

#### 📄 Multi-Page Documents
- **Unlimited Pages** - Create documents of any size
- **Page Navigation** - Switch between pages for editing
- **Different Sizes** - Each page can have a different size
- **Automatic Numbering** - 6 positions with customizable formats
- **14+ Page Sizes** - Letter, Legal, A4, A3, Tabloid, and more
- **Custom Sizes** - Any size in points

#### ⚙️ Global Configuration
- **Default Metadata Configuration** - Configure Creator, Producer, and Annotation Author globally
- **Company Branding** - Set company-wide defaults once, use everywhere
- **Multi-language Support** - Perfect for international applications (Spanish, French, German, etc.)
- **Per-Document Override** - Override global defaults when needed
- **Configuration Functions** - `configure()`, `resetConfig()` for easy management
- **TypeScript Support** - Full type safety with `PDFStudioConfig` interface

#### ✍️ Advanced Text
- **Automatic Word Wrap** - Smart line breaking without cutting words
- **Full Alignment** - Left, center, right, justify
- **Vertical Alignment** - Top, center, bottom in text boxes
- **Text Decorations** - Underline and strike-through
- **Clickable Links** - PDF hyperlinks with annotations
- **Fine Spacing** - Control character, word, and line spacing
- **Paragraph Formatting** - First-line indent and line gap
- **Custom Fonts** - Full TrueType/OpenType support (.ttf, .otf, .ttc)
- **Font Optimization** - ToUnicode CMap for better text selection
- **Font Compression** - Automatic FlateDecode (~25% reduction)

#### 🎨 Vector Graphics
- **Affine Transformations** - Rotate, scale, translate with full support
- **Graphics State Management** - Save/restore for complex transformations
- **Bezier Curves** - Cubic and quadratic curves for smooth drawings
- **Clipping Paths** - Vector masks for advanced effects
- **Dash Patterns** - Dashed lines with custom patterns
- **Path Operations** - Advanced path operations (close, fillAndStroke)
- **Numerical Precision** - No scientific notation, compatible with all viewers

#### 📐 Advanced Margins
- **Uniform Margins** - Single value for all sides
- **Individual Margins** - Top, right, bottom, left customization
- **Dynamic Margins** - Change margins between pages
- **Helper Methods** - Calculate content area automatically

#### 📊 Advanced Tables
- **Styled Tables** - Headers, borders, customizable colors
- **Auto Page Breaks** - Tables continue automatically on new pages
- **Header Repetition** - Headers repeat on each page
- **Configurable Margins** - Control bottom margin before page break

#### 📎 Attachments and Annotations
- **Document-Level Attachments** - Attach files to document (sidebar panel)
- **Page-Level Annotations** - File attachment icons visible on specific pages
- **4 Icon Types** - PushPin, Paperclip, Graph, Tag
- **Automatic Compression** - FlateDecode for attached files
- **Text Annotations** - Comments, highlights, stamps, ink annotations
- **Hyperlinks** - Internal (page) and external (URL) links

#### 🌍 International Support
- **5 Encodings** - WinAnsiEncoding, MacRomanEncoding, StandardEncoding, and more
- **Special Characters** - Full support for Spanish (ñ, á, é, í, ó, ú)
- **Multi-language** - French, German, Portuguese, Italian
- **14 Type1 Fonts** - Helvetica, Times, Courier (with variants)
- **Custom Fonts** - TrueType/OpenType for any language

#### 🖼️ Images
- **PNG Support** - Full PNG with filters and transparency
- **JPEG Support** - Complete JPEG support with color spaces
- **Image Compression** - Automatic compression for optimal file size
- **QR Codes** - Generate QR codes with customizable options

#### 🔒 Security and Metadata
- **PDF Metadata** - Author, Title, Subject, Keywords, Creator, Producer
- **Creation/Modification Dates** - Automatic timestamp tracking
- **XMP Metadata** - Extended metadata support
- **Encryption** - 40/128/256-bit AES encryption
- **Permissions** - Granular permission control (print, copy, modify, etc.)
- **Password Protection** - User and owner passwords

#### 📋 Forms and Fields
- **Text Fields** - Input text fields with validation
- **Checkboxes** - Boolean checkbox fields
- **Radio Buttons** - Single-choice radio button groups
- **Dropdowns** - Selection dropdown menus
- **Signature Fields** - Digital signature field support

#### 🎨 Advanced Features
- **Watermarks** - Text and image watermarks (background/foreground)
- **Bookmarks/Outlines** - PDF navigation bookmarks
- **Layers (OCG)** - Optional Content Groups for layer management
- **Patterns** - Tiling patterns for fills
- **Blend Modes** - Graphics state blend modes
- **PDF/A Compliance** - Long-term archival support

#### 💻 Developer Experience
- **TypeScript** - Full type definitions included
- **Type-safe API** - Compile-time type checking
- **Fluent API** - Method chaining for clean code
- **Pure PDF** - Generates PDF 1.4 from scratch
- **Minimal Dependencies** - Only 4 runtime dependencies
- **Well Tested** - 180 unit tests with 100% pass rate
- **Comprehensive Docs** - 1800+ lines of documentation
- **Code Examples** - 20+ working examples included

### 🏗️ Architecture
- **Refactored Core** - Modular architecture with specialized managers
- **7 Manager Classes** - ImageManager, GradientManager, AnnotationManager, WatermarkManager, LayerManager, PatternManager, GraphicsStateManager
- **Clean Separation** - Single Responsibility Principle applied
- **Maintainable** - Easy to extend and modify

### 🧪 Testing
- **180 Tests** - Comprehensive test coverage
- **9 Test Suites** - Validation, errors, and manager tests
- **100% Pass Rate** - All tests passing
- **Fast Execution** - Tests run in ~0.75 seconds

### 📦 Package
- **Node.js 14+** - Compatible with Node.js 14.0.0 and above
- **TypeScript 5+** - Full TypeScript 5.0+ support
- **MIT License** - Open source and permissive
- **NPM Ready** - Optimized for npm distribution

### 🔧 Technical Details
- **PDF Version** - PDF 1.4 specification
- **Compression** - FlateDecode (zlib) for streams
- **Font Encoding** - Multiple encoding support
- **Color Spaces** - DeviceRGB, DeviceGray, DeviceCMYK
- **Image Formats** - PNG, JPEG with full support
- **Cross-platform** - Works on Windows, macOS, Linux

### 📚 Documentation
- **README** - 1815 lines of comprehensive documentation
- **API Reference** - Complete API documentation with examples
- **Quick Start Guide** - Get started in minutes
- **Type Definitions** - Full TypeScript definitions
- **Code Examples** - 20+ examples covering all features
- **Changelog** - This file with version history

### 🎯 Use Cases
- Business documents with charts
- Invoices and quotes
- Contracts and legal documents
- Academic papers and theses
- Lab reports and documentation
- Brochures and catalogs
- Sales reports and dashboards
- Financial analysis
- Technical diagrams
- Vector logos and designs

---

## [0.1.0] - Development

### Development Phase
- Initial development and prototyping
- Feature implementation
- Testing and bug fixes
- Documentation writing

---

## Versioning

This project uses [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality in a backwards compatible manner
- **PATCH** version for backwards compatible bug fixes

## Links

- [npm package](https://www.npmjs.com/package/pdfstudio)
- [GitHub repository](https://github.com/USERNAME/pdfstudio)
- [Issue tracker](https://github.com/USERNAME/pdfstudio/issues)
- [Documentation](https://github.com/USERNAME/pdfstudio#readme)

---

**PDFStudio** - Modern PDF generation for Node.js
