import { PDFDocument } from '../../src/core/PDFDocument'
import { TextOptions } from '../../src/types'

describe('PDFDocument - Ellipsis and ParagraphGap Features', () => {
  let doc: PDFDocument

  beforeEach(() => {
    doc = new PDFDocument({ size: 'Letter' })
  })

  describe('Ellipsis Feature', () => {
    it('should apply ellipsis when text exceeds height', () => {
      const longText = 'This is a very long text that should be truncated with an ellipsis character when it exceeds the available height. '.repeat(5)

      const options: TextOptions = {
        x: 50,
        y: 700,
        width: 200,
        height: 60,
        fontSize: 10,
        ellipsis: true
      }

      // Should not throw
      expect(() => {
        doc.text(longText, options as TextOptions & { x: number; y: number })
      }).not.toThrow()
    })

    it('should support custom ellipsis character', () => {
      const longText = 'Long text to be truncated. '.repeat(10)

      const options: TextOptions = {
        x: 50,
        y: 700,
        width: 200,
        height: 60,
        fontSize: 10,
        ellipsis: '…'
      }

      expect(() => {
        doc.text(longText, options as TextOptions & { x: number; y: number })
      }).not.toThrow()
    })

    it('should not apply ellipsis if text fits', () => {
      const shortText = 'Short text'

      const options: TextOptions = {
        x: 50,
        y: 700,
        width: 200,
        height: 100,
        fontSize: 10,
        ellipsis: true
      }

      expect(() => {
        doc.text(shortText, options as TextOptions & { x: number; y: number })
      }).not.toThrow()
    })

    it('should work with ellipsis disabled', () => {
      const text = 'Normal text without ellipsis'

      const options: TextOptions = {
        x: 50,
        y: 700,
        width: 200,
        fontSize: 10
      }

      expect(() => {
        doc.text(text, options as TextOptions & { x: number; y: number })
      }).not.toThrow()
    })

    it('should handle ellipsis with multi-column layout', () => {
      const longText = 'This is a long text that will be in multiple columns. '.repeat(10)

      const options: TextOptions = {
        x: 50,
        y: 700,
        width: 400,
        height: 100,
        fontSize: 10,
        columns: 2,
        ellipsis: true
      }

      expect(() => {
        doc.text(longText, options as TextOptions & { x: number; y: number })
      }).not.toThrow()
    })

    it('should handle ellipsis with text alignment', () => {
      const longText = 'Long text with alignment. '.repeat(10)

      const options: TextOptions = {
        x: 50,
        y: 700,
        width: 200,
        height: 60,
        fontSize: 10,
        ellipsis: true,
        align: 'justify'
      }

      expect(() => {
        doc.text(longText, options as TextOptions & { x: number; y: number })
      }).not.toThrow()
    })

    it('should require both width and height for ellipsis', () => {
      const text = 'Text'

      // No width - ellipsis shouldn't apply
      expect(() => {
        doc.text(text, {
          x: 50,
          y: 700,
          height: 60,
          fontSize: 10,
          ellipsis: true
        })
      }).not.toThrow()

      // No height - ellipsis shouldn't apply
      expect(() => {
        doc.text(text, {
          x: 50,
          y: 700,
          width: 200,
          fontSize: 10,
          ellipsis: true
        })
      }).not.toThrow()
    })
  })

  describe('ParagraphGap Feature', () => {
    it('should apply paragraph gap after text', () => {
      const text = 'First paragraph'

      const options: TextOptions = {
        x: 50,
        y: 700,
        width: 200,
        fontSize: 12,
        paragraphGap: 20
      }

      doc.text(text, options as TextOptions & { x: number; y: number })
      const yAfter = doc.getCurrentY()

      // Y should have moved down from initial position
      // (700 - line height - paragraphGap should be less than 700)
      expect(yAfter).toBeLessThan(700)
      expect(yAfter).toBeGreaterThan(0)
    })

    it('should work without paragraph gap', () => {
      const text = 'Paragraph without gap'

      const options: TextOptions = {
        x: 50,
        y: 700,
        width: 200,
        fontSize: 12
      }

      expect(() => {
        doc.text(text, options as TextOptions & { x: number; y: number })
      }).not.toThrow()
    })

    it('should support different gap sizes', () => {
      const text = 'Test paragraph'

      // Small gap
      doc.text(text, {
        x: 50,
        y: 700,
        width: 200,
        fontSize: 12,
        paragraphGap: 5
      })

      // Medium gap
      doc.text(text, {
        x: 50,
        y: doc.getCurrentY(),
        width: 200,
        fontSize: 12,
        paragraphGap: 15
      })

      // Large gap
      doc.text(text, {
        x: 50,
        y: doc.getCurrentY(),
        width: 200,
        fontSize: 12,
        paragraphGap: 30
      })

      expect(doc.getCurrentY()).toBeLessThan(700)
    })

    it('should work with getCurrentY() for positioning', () => {
      const initialY = 700

      doc.text('First', {
        x: 50,
        y: initialY,
        width: 200,
        fontSize: 12,
        paragraphGap: 10
      })

      const y1 = doc.getCurrentY()
      expect(y1).toBeLessThan(initialY)

      doc.text('Second', {
        x: 50,
        y: y1,
        width: 200,
        fontSize: 12,
        paragraphGap: 10
      })

      const y2 = doc.getCurrentY()
      expect(y2).toBeLessThan(y1)
    })

    it('should combine with moveDown()', () => {
      doc.text('Paragraph', {
        x: 50,
        y: 700,
        width: 200,
        fontSize: 12,
        paragraphGap: 10
      })

      const yAfterGap = doc.getCurrentY()

      doc.moveDown(2)

      const yAfterMoveDown = doc.getCurrentY()

      expect(yAfterMoveDown).toBeLessThan(yAfterGap)
    })
  })

  describe('Combined Features', () => {
    it('should support ellipsis and paragraphGap together', () => {
      const longText = 'Long text that will be truncated. '.repeat(20)

      const options: TextOptions = {
        x: 50,
        y: 700,
        width: 400,
        height: 80,
        fontSize: 10,
        ellipsis: true,
        paragraphGap: 25
      }

      doc.text(longText, options as TextOptions & { x: number; y: number })
      const yAfter = doc.getCurrentY()

      // Should have moved down from initial position (700 - height - paragraphGap)
      expect(yAfter).toBeLessThan(700)
    })

    it('should work with rotation, ellipsis and paragraphGap', () => {
      const text = 'Rotated text with ellipsis and gap. '.repeat(5)

      const options: TextOptions = {
        x: 300,
        y: 400,
        width: 200,
        height: 60,
        fontSize: 10,
        rotation: 45,
        ellipsis: true,
        paragraphGap: 15
      }

      expect(() => {
        doc.text(text, options as TextOptions & { x: number; y: number })
      }).not.toThrow()
    })

    it('should work with all text options combined', () => {
      const text = 'Complex text with many options. '.repeat(10)

      const options: TextOptions = {
        x: 50,
        y: 700,
        width: 400,
        height: 100,
        fontSize: 11,
        align: 'justify',
        columns: 2,
        columnGap: 20,
        ellipsis: '…',
        paragraphGap: 20,
        lineGap: 3
      }

      expect(() => {
        doc.text(text, options as TextOptions & { x: number; y: number })
      }).not.toThrow()
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero paragraph gap', () => {
      expect(() => {
        doc.text('Text', {
          x: 50,
          y: 700,
          width: 200,
          fontSize: 12,
          paragraphGap: 0
        })
      }).not.toThrow()
    })

    it('should handle very large paragraph gap', () => {
      expect(() => {
        doc.text('Text', {
          x: 50,
          y: 700,
          width: 200,
          fontSize: 12,
          paragraphGap: 100
        })
      }).not.toThrow()
    })

    it('should handle empty string with ellipsis', () => {
      expect(() => {
        doc.text('', {
          x: 50,
          y: 700,
          width: 200,
          height: 60,
          fontSize: 12,
          ellipsis: true
        })
      }).not.toThrow()
    })

    it('should handle very small height with ellipsis', () => {
      const text = 'Some text'

      const options: TextOptions = {
        x: 50,
        y: 700,
        width: 200,
        height: 5, // Very small
        fontSize: 12,
        ellipsis: true
      }

      expect(() => {
        doc.text(text, options as TextOptions & { x: number; y: number })
      }).not.toThrow()
    })

    it('should handle ellipsis as empty string', () => {
      const text = 'Text to truncate. '.repeat(10)

      const options: TextOptions = {
        x: 50,
        y: 700,
        width: 200,
        height: 60,
        fontSize: 12,
        ellipsis: '' // Empty ellipsis
      }

      expect(() => {
        doc.text(text, options as TextOptions & { x: number; y: number })
      }).not.toThrow()
    })
  })

  describe('Simple text() signature', () => {
    it('should support simple signature without options', () => {
      expect(() => {
        doc.text('Simple text', 50, 700, 12)
      }).not.toThrow()
    })

    it('should support text options object syntax', () => {
      expect(() => {
        doc.text('Text with options', {
          x: 50,
          y: 700,
          fontSize: 12,
          width: 200,
          paragraphGap: 15
        })
      }).not.toThrow()
    })

    it('should update currentY with paragraphGap', () => {
      const yBefore = 700
      doc.text('Text', {
        x: 50,
        y: yBefore,
        fontSize: 12,
        width: 200,
        paragraphGap: 20
      })

      const yAfter = doc.getCurrentY()
      expect(yAfter).toBeLessThan(yBefore)
    })
  })
})
