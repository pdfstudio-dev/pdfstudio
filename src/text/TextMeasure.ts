import { PDFBaseFont } from '../types'

/**
 * TextMeasure - Calculates text width for PDF fonts
 * Uses approximate widths for standard Type1 fonts
 */
export class TextMeasure {
  /**
   * Approximate character widths for Helvetica (in 1000 units)
   * These are based on standard font metrics
   */
  private static readonly HELVETICA_WIDTHS: Record<string, number> = {
    ' ': 278,
    '!': 278,
    '"': 355,
    '#': 556,
    '$': 556,
    '%': 889,
    '&': 667,
    "'": 191,
    '(': 333,
    ')': 333,
    '*': 389,
    '+': 584,
    ',': 278,
    '-': 333,
    '.': 278,
    '/': 278,
    '0': 556,
    '1': 556,
    '2': 556,
    '3': 556,
    '4': 556,
    '5': 556,
    '6': 556,
    '7': 556,
    '8': 556,
    '9': 556,
    ':': 278,
    ';': 278,
    '<': 584,
    '=': 584,
    '>': 584,
    '?': 556,
    '@': 1015,
    'A': 667,
    'B': 667,
    'C': 722,
    'D': 722,
    'E': 667,
    'F': 611,
    'G': 778,
    'H': 722,
    'I': 278,
    'J': 500,
    'K': 667,
    'L': 556,
    'M': 833,
    'N': 722,
    'O': 778,
    'P': 667,
    'Q': 778,
    'R': 722,
    'S': 667,
    'T': 611,
    'U': 722,
    'V': 667,
    'W': 944,
    'X': 667,
    'Y': 667,
    'Z': 611,
    '[': 278,
    '\\': 278,
    ']': 278,
    '^': 469,
    '_': 556,
    '`': 333,
    'a': 556,
    'b': 556,
    'c': 500,
    'd': 556,
    'e': 556,
    'f': 278,
    'g': 556,
    'h': 556,
    'i': 222,
    'j': 222,
    'k': 500,
    'l': 222,
    'm': 833,
    'n': 556,
    'o': 556,
    'p': 556,
    'q': 556,
    'r': 333,
    's': 500,
    't': 278,
    'u': 556,
    'v': 500,
    'w': 722,
    'x': 500,
    'y': 500,
    'z': 500,
    '{': 334,
    '|': 260,
    '}': 334,
    '~': 584
  }

  /**
   * Measure the width of a text string
   * @param text Text to measure
   * @param fontSize Font size in points
   * @param font Font name (currently only uses Helvetica metrics)
   * @returns Width in points
   */
  static measureText(text: string, fontSize: number, font: PDFBaseFont = 'Helvetica'): number {
    let width = 0

    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      const charWidth = this.HELVETICA_WIDTHS[char] || 556 // Default width for unknown chars

      width += charWidth
    }

    // Convert from 1000-unit font metrics to actual points
    return (width * fontSize) / 1000
  }

  /**
   * Split text into words
   */
  static splitIntoWords(text: string): string[] {
    return text.split(/(\s+)/)
  }

  /**
   * Break text into lines that fit within a given width
   * @param text Text to wrap
   * @param maxWidth Maximum width in points
   * @param fontSize Font size
   * @param font Font name
   * @returns Array of lines
   */
  static wrapText(text: string, maxWidth: number, fontSize: number, font: PDFBaseFont = 'Helvetica'): string[] {
    const words = this.splitIntoWords(text)
    const lines: string[] = []
    let currentLine = ''

    for (const word of words) {
      const testLine = currentLine + word
      const testWidth = this.measureText(testLine, fontSize, font)

      if (testWidth > maxWidth && currentLine.length > 0) {
        // Line is too long, push current line and start new one
        lines.push(currentLine.trimEnd())
        currentLine = word.trimStart()
      } else {
        currentLine = testLine
      }
    }

    // Add last line
    if (currentLine.length > 0) {
      lines.push(currentLine.trimEnd())
    }

    return lines
  }

  /**
   * Calculate line height based on font size
   */
  static calculateLineHeight(fontSize: number, lineGap: number = 0): number {
    // Standard line height is 120% of font size
    return fontSize * 1.2 + lineGap
  }
}
