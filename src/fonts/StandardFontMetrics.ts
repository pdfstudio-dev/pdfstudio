/**
 * Standard PDF Font Metrics
 * Character widths for the 14 standard PDF fonts
 * Widths are in 1/1000th of font size (font units)
 */

/**
 * Helvetica character widths (same for Helvetica, Helvetica-Bold, Helvetica-Oblique, Helvetica-BoldOblique)
 */
export const HELVETICA_WIDTHS: Record<string, number> = {
  // Printable ASCII characters
  ' ': 278, '!': 278, '"': 355, '#': 556, '$': 556, '%': 889, '&': 667, "'": 191,
  '(': 333, ')': 333, '*': 389, '+': 584, ',': 278, '-': 333, '.': 278, '/': 278,
  '0': 556, '1': 556, '2': 556, '3': 556, '4': 556, '5': 556, '6': 556, '7': 556,
  '8': 556, '9': 556, ':': 278, ';': 278, '<': 584, '=': 584, '>': 584, '?': 556,
  '@': 1015, 'A': 667, 'B': 667, 'C': 722, 'D': 722, 'E': 667, 'F': 611, 'G': 778,
  'H': 722, 'I': 278, 'J': 500, 'K': 667, 'L': 556, 'M': 833, 'N': 722, 'O': 778,
  'P': 667, 'Q': 778, 'R': 722, 'S': 667, 'T': 611, 'U': 722, 'V': 667, 'W': 944,
  'X': 667, 'Y': 667, 'Z': 611, '[': 278, '\\': 278, ']': 278, '^': 469, '_': 556,
  '`': 333, 'a': 556, 'b': 556, 'c': 500, 'd': 556, 'e': 556, 'f': 278, 'g': 556,
  'h': 556, 'i': 222, 'j': 222, 'k': 500, 'l': 222, 'm': 833, 'n': 556, 'o': 556,
  'p': 556, 'q': 556, 'r': 333, 's': 500, 't': 278, 'u': 556, 'v': 500, 'w': 722,
  'x': 500, 'y': 500, 'z': 500, '{': 334, '|': 260, '}': 334, '~': 584
}

/**
 * Times-Roman character widths (same for Times-Roman, Times-Bold, Times-Italic, Times-BoldItalic)
 */
export const TIMES_WIDTHS: Record<string, number> = {
  ' ': 250, '!': 333, '"': 408, '#': 500, '$': 500, '%': 833, '&': 778, "'": 180,
  '(': 333, ')': 333, '*': 500, '+': 564, ',': 250, '-': 333, '.': 250, '/': 278,
  '0': 500, '1': 500, '2': 500, '3': 500, '4': 500, '5': 500, '6': 500, '7': 500,
  '8': 500, '9': 500, ':': 278, ';': 278, '<': 564, '=': 564, '>': 564, '?': 444,
  '@': 921, 'A': 722, 'B': 667, 'C': 667, 'D': 722, 'E': 611, 'F': 556, 'G': 722,
  'H': 722, 'I': 333, 'J': 389, 'K': 722, 'L': 611, 'M': 889, 'N': 722, 'O': 722,
  'P': 556, 'Q': 722, 'R': 667, 'S': 556, 'T': 611, 'U': 722, 'V': 722, 'W': 944,
  'X': 722, 'Y': 722, 'Z': 611, '[': 333, '\\': 278, ']': 333, '^': 469, '_': 500,
  '`': 333, 'a': 444, 'b': 500, 'c': 444, 'd': 500, 'e': 444, 'f': 333, 'g': 500,
  'h': 500, 'i': 278, 'j': 278, 'k': 500, 'l': 278, 'm': 778, 'n': 500, 'o': 500,
  'p': 500, 'q': 500, 'r': 333, 's': 389, 't': 278, 'u': 500, 'v': 500, 'w': 722,
  'x': 500, 'y': 500, 'z': 444, '{': 480, '|': 200, '}': 480, '~': 541
}

/**
 * Courier character widths (monospaced - all characters same width)
 */
export const COURIER_WIDTHS: Record<string, number> = {
  // All characters in Courier have the same width (monospaced)
  ' ': 600, '!': 600, '"': 600, '#': 600, '$': 600, '%': 600, '&': 600, "'": 600,
  '(': 600, ')': 600, '*': 600, '+': 600, ',': 600, '-': 600, '.': 600, '/': 600,
  '0': 600, '1': 600, '2': 600, '3': 600, '4': 600, '5': 600, '6': 600, '7': 600,
  '8': 600, '9': 600, ':': 600, ';': 600, '<': 600, '=': 600, '>': 600, '?': 600,
  '@': 600, 'A': 600, 'B': 600, 'C': 600, 'D': 600, 'E': 600, 'F': 600, 'G': 600,
  'H': 600, 'I': 600, 'J': 600, 'K': 600, 'L': 600, 'M': 600, 'N': 600, 'O': 600,
  'P': 600, 'Q': 600, 'R': 600, 'S': 600, 'T': 600, 'U': 600, 'V': 600, 'W': 600,
  'X': 600, 'Y': 600, 'Z': 600, '[': 600, '\\': 600, ']': 600, '^': 600, '_': 600,
  '`': 600, 'a': 600, 'b': 600, 'c': 600, 'd': 600, 'e': 600, 'f': 600, 'g': 600,
  'h': 600, 'i': 600, 'j': 600, 'k': 600, 'l': 600, 'm': 600, 'n': 600, 'o': 600,
  'p': 600, 'q': 600, 'r': 600, 's': 600, 't': 600, 'u': 600, 'v': 600, 'w': 600,
  'x': 600, 'y': 600, 'z': 600, '{': 600, '|': 600, '}': 600, '~': 600
}

/**
 * Get character widths for a given font
 */
export function getFontMetrics(fontName: string): Record<string, number> {
  const fontLower = fontName.toLowerCase()

  if (fontLower.includes('courier')) {
    return COURIER_WIDTHS
  } else if (fontLower.includes('times')) {
    return TIMES_WIDTHS
  } else {
    // Default to Helvetica for Helvetica and unknown fonts
    return HELVETICA_WIDTHS
  }
}

/**
 * Calculate the width of a string in font units
 * @param text The text to measure
 * @param fontName The font name (e.g., 'Helvetica', 'Times-Roman', 'Courier')
 * @returns Width in font units (1/1000th of font size)
 */
export function measureText(text: string, fontName: string): number {
  const metrics = getFontMetrics(fontName)
  let width = 0

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    width += metrics[char] || 500 // Default to 500 for unknown characters
  }

  return width
}
