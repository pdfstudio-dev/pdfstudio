/**
 * Unicode to WinAnsiEncoding substitution map
 *
 * WinAnsiEncoding only supports characters 0x00-0xFF (256 characters).
 * This map provides ASCII/WinAnsi alternatives for common Unicode characters.
 */
export const UNICODE_SUBSTITUTIONS: Record<string, string> = {
  // Bullets and list markers
  '\u2022': '\xB7',  // • (bullet) → · (middle dot)
  '\u25E6': '\xB0',  // ◦ (white bullet) → ° (degree sign)
  '\u25AA': '\xA7',  // ▪ (black small square) → § (section sign)
  '\u25CF': '\xB7',  // ● (black circle) → · (middle dot)
  '\u25CB': '\xB0',  // ○ (white circle) → ° (degree sign)
  '\u25A0': '\xA7',  // ■ (black square) → § (section sign)
  '\u25A1': '\xB0',  // □ (white square) → ° (degree sign)
  '\u2023': '\xB7',  // ‣ (triangular bullet) → · (middle dot)
  '\u2043': '\xB7',  // ⁃ (hyphen bullet) → · (middle dot)

  // Arrows
  '\u2190': '<-',    // ← (left arrow)
  '\u2192': '->',    // → (right arrow)
  '\u2191': '^',     // ↑ (up arrow)
  '\u2193': 'v',     // ↓ (down arrow)
  '\u2194': '<->',   // ↔ (left-right arrow)
  '\u21D0': '<=',    // ⇐ (double left arrow)
  '\u21D2': '=>',    // ⇒ (double right arrow)
  '\u21D4': '<=>',   // ⇔ (double left-right arrow)

  // Quotation marks
  '\u2018': '\'',    // ' (left single quote)
  '\u2019': '\'',    // ' (right single quote)
  '\u201A': ',',     // ‚ (single low quote)
  '\u201B': '\'',    // ‛ (single reversed quote)
  '\u201C': '"',     // " (left double quote)
  '\u201D': '"',     // " (right double quote)
  '\u201E': '"',     // „ (double low quote)
  '\u201F': '"',     // ‟ (double reversed quote)
  '\u2039': '<',     // ‹ (single left angle quote)
  '\u203A': '>',     // › (single right angle quote)
  '\u00AB': '<<',    // « (left double angle quote) - Actually IN WinAnsi but we provide alternative
  '\u00BB': '>>',    // » (right double angle quote) - Actually IN WinAnsi but we provide alternative

  // Dashes
  '\u2013': '-',     // – (en dash)
  '\u2014': '--',    // — (em dash)
  '\u2015': '--',    // ― (horizontal bar)

  // Mathematical operators
  '\u2212': '-',     // − (minus sign)
  '\u00D7': 'x',     // × (multiplication) - Actually IN WinAnsi
  '\u2260': '!=',    // ≠ (not equal)
  '\u2264': '<=',    // ≤ (less than or equal)
  '\u2265': '>=',    // ≥ (greater than or equal)
  '\u2248': '~=',    // ≈ (approximately equal)
  '\u221E': 'inf',   // ∞ (infinity)
  '\u2211': 'SUM',   // ∑ (summation)
  '\u221A': 'sqrt',  // √ (square root)
  '\u00B1': '+/-',   // ± (plus-minus) - Actually IN WinAnsi

  // Checkmarks and crosses
  '\u2713': 'OK',    // ✓ (check mark)
  '\u2714': 'OK',    // ✔ (heavy check mark)
  '\u2717': 'X',     // ✗ (ballot x)
  '\u2718': 'X',     // ✘ (heavy ballot x)
  '\u2611': '[X]',   // ☑ (checked box)
  '\u2610': '[ ]',   // ☐ (unchecked box)

  // Stars and symbols
  '\u2605': '*',     // ★ (black star)
  '\u2606': '*',     // ☆ (white star)
  '\u2729': '*',     // ✩ (stress outlined white star)
  '\u272A': '*',     // ✪ (circled white star)

  // Fractions (common ones)
  '\u00BC': '1/4',   // ¼
  '\u00BD': '1/2',   // ½
  '\u00BE': '3/4',   // ¾
  '\u2153': '1/3',   // ⅓
  '\u2154': '2/3',   // ⅔

  // Currency (that's not in WinAnsi)
  '\u20AC': 'EUR',   // € (euro) - Actually IN WinAnsi at 0x80
  '\u00A3': 'GBP',   // £ (pound) - Actually IN WinAnsi
  '\u00A5': 'JPY',   // ¥ (yen) - Actually IN WinAnsi

  // Common symbols
  '\u2026': '...',   // … (ellipsis)
  '\u00A9': '(c)',   // © (copyright) - Actually IN WinAnsi
  '\u00AE': '(R)',   // ® (registered) - Actually IN WinAnsi
  '\u2122': '(TM)',  // ™ (trademark)
  '\u00B0': 'deg',   // ° (degree) - Actually IN WinAnsi
  '\u00B6': 'P',     // ¶ (pilcrow/paragraph) - Actually IN WinAnsi
  '\u00A7': 'S',     // § (section) - Actually IN WinAnsi

  // Spaces
  '\u00A0': ' ',     // Non-breaking space
  '\u2002': ' ',     // En space
  '\u2003': ' ',     // Em space
  '\u2009': ' ',     // Thin space
  '\u200B': '',      // Zero-width space
}

/**
 * Substitute Unicode characters not supported in WinAnsiEncoding
 * with ASCII/WinAnsi alternatives
 *
 * @param text - Text to process
 * @returns Text with Unicode characters replaced
 */
export function substituteUnicode(text: string): string {
  if (!text) return text

  let result = ''

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const code = text.charCodeAt(i)

    // Check if character is in WinAnsiEncoding range (0x00-0xFF)
    if (code <= 0xFF) {
      // Character is safe, keep it
      result += char
    } else {
      // Character is outside WinAnsi range, try to substitute
      const substitution = UNICODE_SUBSTITUTIONS[char]
      if (substitution) {
        result += substitution
      } else {
        // No substitution available, use '?' as fallback
        result += '?'
      }
    }
  }

  return result
}

/**
 * Detect if text contains characters not supported in WinAnsiEncoding
 *
 * @param text - Text to check
 * @returns Array of unsupported characters (unique)
 */
export function detectUnsupportedChars(text: string): string[] {
  if (!text) return []

  const unsupported = new Set<string>()

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const code = text.charCodeAt(i)

    // Characters outside WinAnsi range (0x00-0xFF) are unsupported
    if (code > 0xFF) {
      unsupported.add(char)
    }
  }

  return Array.from(unsupported)
}

/**
 * Get substitution for a specific character
 *
 * @param char - Character to get substitution for
 * @returns Substitution string or undefined if no substitution available
 */
export function getSubstitution(char: string): string | undefined {
  return UNICODE_SUBSTITUTIONS[char]
}
