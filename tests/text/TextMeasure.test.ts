import { TextMeasure } from '../../src/text/TextMeasure'
import { PDFBaseFont } from '../../src/types'

describe('TextMeasure', () => {
  describe('measureText', () => {
    it('should measure text with default font', () => {
      const width = TextMeasure.measureText('Hello World', 12, 'Helvetica')
      expect(width).toBeGreaterThan(0)
      expect(typeof width).toBe('number')
    })

    it('should return 0 for empty string', () => {
      const width = TextMeasure.measureText('', 12, 'Helvetica')
      expect(width).toBe(0)
    })

    it('should scale with font size', () => {
      const width10 = TextMeasure.measureText('Test', 10, 'Helvetica')
      const width20 = TextMeasure.measureText('Test', 20, 'Helvetica')

      // Larger font should be wider (approximately double)
      expect(width20).toBeGreaterThan(width10)
      expect(width20 / width10).toBeCloseTo(2, 0.1)
    })

    it('should work with different fonts', () => {
      const fonts: PDFBaseFont[] = ['Helvetica', 'Times-Roman', 'Courier']

      fonts.forEach(font => {
        const width = TextMeasure.measureText('Test', 12, font)
        expect(width).toBeGreaterThan(0)
      })
    })
  })

  describe('wrapText', () => {
    it('should wrap text that exceeds max width', () => {
      const text = 'This is a very long text that should be wrapped into multiple lines'
      const lines = TextMeasure.wrapText(text, 100, 12, 'Helvetica')

      expect(lines.length).toBeGreaterThan(1)
      lines.forEach(line => {
        const width = TextMeasure.measureText(line, 12, 'Helvetica')
        expect(width).toBeLessThanOrEqual(100)
      })
    })

    it('should not wrap text that fits in one line', () => {
      const text = 'Short'
      const lines = TextMeasure.wrapText(text, 500, 12, 'Helvetica')

      expect(lines).toHaveLength(1)
      expect(lines[0]).toBe(text)
    })

    it('should preserve words (not break in middle)', () => {
      const text = 'Hello World Testing'
      const lines = TextMeasure.wrapText(text, 100, 12, 'Helvetica')

      lines.forEach(line => {
        // Each line should not end/start with partial words
        // (unless word itself is too long)
        expect(line.trim()).toBe(line)
      })
    })

    it('should handle single word longer than max width', () => {
      const text = 'Supercalifragilisticexpialidocious'
      const lines = TextMeasure.wrapText(text, 50, 12, 'Helvetica')

      // May break the long word or keep it as one line depending on implementation
      expect(lines.length).toBeGreaterThanOrEqual(1)
    })

    it('should handle empty text', () => {
      const lines = TextMeasure.wrapText('', 100, 12, 'Helvetica')
      expect(lines.length).toBeGreaterThanOrEqual(0)
    })

    it('should handle text with multiple spaces', () => {
      const text = 'Hello    World'
      const lines = TextMeasure.wrapText(text, 500, 12, 'Helvetica')
      expect(lines[0]).toContain('Hello')
      expect(lines[0]).toContain('World')
    })
  })

  describe('calculateLineHeight', () => {
    it('should calculate line height with default line gap', () => {
      const lineHeight = TextMeasure.calculateLineHeight(12, 0)

      // Default is 120% of font size
      expect(lineHeight).toBeCloseTo(14.4, 1)
    })

    it('should add line gap to height', () => {
      const lineHeight = TextMeasure.calculateLineHeight(12, 5)

      // 12 * 1.2 + 5 = 19.4
      expect(lineHeight).toBeCloseTo(19.4, 1)
    })

    it('should scale with font size', () => {
      const height10 = TextMeasure.calculateLineHeight(10, 0)
      const height20 = TextMeasure.calculateLineHeight(20, 0)

      expect(height20).toBeGreaterThan(height10)
    })
  })

  describe('truncateWithEllipsis', () => {
    it('should return original text if it fits', () => {
      const text = 'Short text'
      const result = TextMeasure.truncateWithEllipsis(text, 500, 12, 'Helvetica')

      expect(result).toBe(text)
    })

    it('should truncate text that exceeds max width', () => {
      const text = 'This is a very long text that needs to be truncated'
      const result = TextMeasure.truncateWithEllipsis(text, 100, 12, 'Helvetica')

      // Should be shorter than original
      expect(result.length).toBeLessThan(text.length)
      // Should end with ellipsis
      expect(result).toMatch(/\.\.\.$/)
    })

    it('should use default ellipsis "..."', () => {
      const text = 'Long text that will be truncated for sure because it is very long'
      const result = TextMeasure.truncateWithEllipsis(text, 100, 12, 'Helvetica')

      expect(result).toContain('...')
      expect(result.endsWith('...')).toBe(true)
    })

    it('should use custom ellipsis character', () => {
      const text = 'Long text that will be truncated'
      const customEllipsis = '…'
      const result = TextMeasure.truncateWithEllipsis(text, 100, 12, 'Helvetica', customEllipsis)

      expect(result).toContain(customEllipsis)
      expect(result.endsWith(customEllipsis)).toBe(true)
      expect(result).not.toContain('...')
    })

    it('should respect max width including ellipsis', () => {
      const text = 'This is a long text'
      const maxWidth = 80
      const result = TextMeasure.truncateWithEllipsis(text, maxWidth, 12, 'Helvetica')

      const resultWidth = TextMeasure.measureText(result, 12, 'Helvetica')
      expect(resultWidth).toBeLessThanOrEqual(maxWidth + 1) // +1 for rounding
    })

    it('should return only ellipsis if max width is too small', () => {
      const text = 'Any text'
      const result = TextMeasure.truncateWithEllipsis(text, 5, 12, 'Helvetica', '...')

      expect(result).toBe('...')
    })

    it('should handle empty text', () => {
      const result = TextMeasure.truncateWithEllipsis('', 100, 12, 'Helvetica')

      expect(result).toBe('')
    })

    it('should work with different fonts', () => {
      const text = 'Testing with different fonts'
      const fonts: PDFBaseFont[] = ['Helvetica', 'Times-Roman', 'Courier']

      fonts.forEach(font => {
        const result = TextMeasure.truncateWithEllipsis(text, 100, 12, font)
        expect(result.length).toBeGreaterThan(0)
        expect(result.endsWith('...')).toBe(true)
      })
    })

    it('should handle very short max width gracefully', () => {
      const text = 'Test'
      const result = TextMeasure.truncateWithEllipsis(text, 1, 12, 'Helvetica', '…')

      // Should at minimum return the ellipsis
      expect(result).toBe('…')
    })

    it('should use binary search efficiently (performance)', () => {
      const longText = 'A'.repeat(1000)
      const startTime = Date.now()

      const result = TextMeasure.truncateWithEllipsis(longText, 100, 12, 'Helvetica')

      const endTime = Date.now()
      const duration = endTime - startTime

      // Should complete quickly (binary search is O(log n))
      expect(duration).toBeLessThan(100) // 100ms threshold
      expect(result.endsWith('...')).toBe(true)
    })

    it('should truncate exactly at character boundary', () => {
      const text = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const result = TextMeasure.truncateWithEllipsis(text, 100, 12, 'Helvetica')

      // Should end with ellipsis
      expect(result.endsWith('...')).toBe(true)

      // The part before ellipsis should be from original text
      const textPart = result.slice(0, -3)
      expect(text.startsWith(textPart)).toBe(true)
    })

    it('should handle Unicode characters', () => {
      const text = 'Hello 世界 Testing émojis 🎉🎊'
      const result = TextMeasure.truncateWithEllipsis(text, 100, 12, 'Helvetica')

      expect(result.endsWith('...')).toBe(true)
      expect(result.length).toBeGreaterThan(3) // More than just ellipsis
    })

    it('should handle different ellipsis strings', () => {
      const text = 'Testing different ellipsis lengths'

      const short = TextMeasure.truncateWithEllipsis(text, 100, 12, 'Helvetica', '.')
      const medium = TextMeasure.truncateWithEllipsis(text, 100, 12, 'Helvetica', '...')
      const long = TextMeasure.truncateWithEllipsis(text, 100, 12, 'Helvetica', '[...]')

      // All should be truncated and end with their respective ellipsis
      expect(short.endsWith('.')).toBe(true)
      expect(medium.endsWith('...')).toBe(true)
      expect(long.endsWith('[...]')).toBe(true)
    })
  })
})
