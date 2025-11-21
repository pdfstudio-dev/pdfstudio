# Contributing to PDFStudio

First off, thank you for considering contributing to PDFStudio! 🎉

It's people like you that make PDFStudio such a great tool for the Node.js community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Guidelines](#coding-guidelines)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

## 🤝 How Can I Contribute?

There are many ways to contribute to PDFStudio:

### 1. Report Bugs 🐛
Found a bug? Please report it! See [Reporting Bugs](#reporting-bugs) below.

### 2. Suggest Features 💡
Have an idea for a new feature? We'd love to hear it! See [Suggesting Enhancements](#suggesting-enhancements).

### 3. Write Code 💻
Fix bugs, implement features, or improve performance.

### 4. Improve Documentation 📚
Fix typos, clarify explanations, or add examples.

### 5. Write Tests 🧪
Add test coverage for existing features or new functionality.

### 6. Review Pull Requests 👀
Help review and test pull requests from other contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 14.0.0
- npm or yarn
- Git
- TypeScript knowledge (helpful but not required)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/pdfstudio.git
cd pdfstudio
```

3. Add the upstream repository:

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/pdfstudio.git
```

### Install Dependencies

```bash
npm install
```

### Build the Project

```bash
npm run build
```

### Run Tests

```bash
npm test
```

### Run Examples

```bash
# Run a single example
npm run example

# Run all examples
npm run examples
```

## 🔧 Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `test/` - Test additions/changes
- `refactor/` - Code refactoring
- `perf/` - Performance improvements

### 2. Make Your Changes

- Write clean, readable code
- Follow the coding guidelines (see below)
- Add tests for new functionality
- Update documentation as needed
- Keep commits atomic and well-described

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- ImageManager.test.ts

# Check test coverage
npm test -- --coverage
```

### 4. Commit Your Changes

Write clear, concise commit messages:

```bash
git add .
git commit -m "feat: add support for rounded rectangles"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Test additions/changes
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `chore:` - Maintenance tasks

### 5. Keep Your Branch Updated

```bash
git fetch upstream
git rebase upstream/main
```

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 7. Submit a Pull Request

Go to GitHub and create a Pull Request from your fork to the main repository.

## 📝 Coding Guidelines

### TypeScript Style

- Use TypeScript for all new code
- Provide proper type annotations
- Avoid `any` types when possible
- Use interfaces for object shapes

```typescript
// ✅ Good
interface ChartOptions {
  title: string
  data: ChartData[]
  colors?: string[]
}

// ❌ Avoid
function drawChart(options: any) { ... }
```

### Code Style

- **Indentation**: 2 spaces (no tabs)
- **Line length**: Max 100 characters (soft limit)
- **Quotes**: Single quotes for strings
- **Semicolons**: Use semicolons
- **Naming**:
  - `camelCase` for variables and functions
  - `PascalCase` for classes and interfaces
  - `UPPER_SNAKE_CASE` for constants

```typescript
// ✅ Good
const MAX_PAGE_SIZE = 1000
class PDFDocument { ... }
function drawBarChart() { ... }

// ❌ Avoid
const max_page_size = 1000
class pdfDocument { ... }
function DrawBarChart() { ... }
```

### Function Guidelines

- Keep functions small and focused
- One function = one responsibility
- Use descriptive names
- Add JSDoc comments for public APIs

```typescript
/**
 * Draws a bar chart on the current page
 * @param options - Chart configuration options
 * @returns The PDFDocument instance for chaining
 */
drawBarChart(options: BarChartOptions): PDFDocument {
  // Implementation
}
```

### Error Handling

- Use custom error classes (PDFStudioError, ValidationError, etc.)
- Provide helpful error messages
- Validate input parameters

```typescript
// ✅ Good
if (fontSize <= 0) {
  throw new ValidationError(
    'Font size must be positive',
    'fontSize',
    fontSize
  )
}

// ❌ Avoid
if (fontSize <= 0) {
  throw new Error('Invalid font size')
}
```

## 🧪 Testing

### Writing Tests

- Write tests for all new functionality
- Use descriptive test names
- Follow the AAA pattern (Arrange, Act, Assert)
- Test edge cases and error conditions

```typescript
describe('BarChart', () => {
  describe('drawBarChart', () => {
    it('should throw error for empty data array', () => {
      const doc = new PDFDocument()

      expect(() => {
        doc.barChart({ data: [], x: 0, y: 0, width: 100, height: 100 })
      }).toThrow(ValidationError)
    })

    it('should draw bars with correct heights', () => {
      const doc = new PDFDocument()
      const data = [
        { label: 'A', value: 50 },
        { label: 'B', value: 100 }
      ]

      doc.barChart({ data, x: 0, y: 0, width: 400, height: 300 })

      // Assertions
      expect(doc.getPageCount()).toBe(1)
    })
  })
})
```

### Test Coverage

- Aim for >80% code coverage
- Focus on testing public APIs
- Test error paths as well as happy paths

## 📤 Submitting Changes

### Pull Request Process

1. **Update Documentation**
   - Update README if adding features
   - Add JSDoc comments
   - Update CHANGELOG.md

2. **Ensure Tests Pass**
   ```bash
   npm test
   npm run build
   ```

3. **Write a Good PR Description**
   - What does this PR do?
   - Why is this change needed?
   - How has it been tested?
   - Screenshots (if applicable)

4. **PR Title Format**
   ```
   feat: add rounded rectangle support
   fix: correct margin calculation for A4 pages
   docs: improve chart API documentation
   ```

5. **Link Related Issues**
   - Reference issue numbers: `Fixes #123`
   - Explain how the PR addresses the issue

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Manual testing performed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] CHANGELOG.md updated
```

## 🐛 Reporting Bugs

### Before Submitting

1. **Check existing issues** - Your bug may already be reported
2. **Update to latest version** - Bug may already be fixed
3. **Test in isolation** - Ensure it's not an issue with your code

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Create document with...
2. Call method...
3. See error

**Expected behavior**
What you expected to happen.

**Actual behavior**
What actually happened.

**Code Example**
```javascript
const doc = new PDFDocument()
// Minimal code to reproduce
```

**Environment**
- PDFStudio version: [e.g., 1.0.0]
- Node.js version: [e.g., 18.0.0]
- OS: [e.g., Windows 11, macOS 13, Ubuntu 22.04]

**Additional context**
Any other relevant information.
```

## 💡 Suggesting Enhancements

### Enhancement Template

```markdown
**Feature Description**
Clear description of the proposed feature.

**Use Case**
Why is this feature needed? What problem does it solve?

**Proposed API**
```javascript
doc.newFeature({
  option1: value1,
  option2: value2
})
```

**Alternatives Considered**
Other ways to solve this problem.

**Additional Context**
Screenshots, mockups, or references to similar features.
```

## 🎯 Priority Areas

We especially welcome contributions in these areas:

### High Priority
- [ ] SVG path parsing
- [ ] Font subsetting implementation
- [ ] Performance optimizations
- [ ] Additional chart types (scatter, radar)
- [ ] More comprehensive examples

### Medium Priority
- [ ] Rounded rectangles
- [ ] Line cap/join styles
- [ ] Blend modes
- [ ] CID font support
- [ ] WOFF/WOFF2 fonts

### Documentation
- [ ] More code examples
- [ ] Video tutorials
- [ ] Migration guides
- [ ] API reference improvements

## 📚 Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [PDF Reference 1.4](https://opensource.adobe.com/dc-acrobat-sdk-docs/pdfstandards/PDF32000_2008.pdf)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Git Best Practices](https://www.git-scm.com/book/en/v2)

## 🙏 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## 💬 Questions?

- Open a [Discussion](https://github.com/USERNAME/pdfstudio/discussions)
- Ask in [Issues](https://github.com/USERNAME/pdfstudio/issues)
- Email: support@pdfstudio.dev

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to PDFStudio!** 🙌

Together we're building the best PDF generation library for Node.js.
