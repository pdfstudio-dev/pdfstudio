# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-17

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
