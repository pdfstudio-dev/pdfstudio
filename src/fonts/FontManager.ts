import * as fontkit from 'fontkit'
import * as fs from 'fs'
import * as pako from 'pako'
import { CustomFont } from '../types'
import { FontError, CompressionError } from '../errors'
import { logger } from '../utils/logger'

/**
 * Font information for PDF embedding
 */
export interface FontInfo {
  name: string
  fontData: Buffer
  font: fontkit.Font
  subset: boolean
  usedChars: Set<number>  // Track which character codes are used (for subsetting)
  usedGlyphs: Set<number> // Track which glyph IDs are used (for subsetting)
}

/**
 * FontManager - Handles custom TrueType/OpenType fonts
 */
export class FontManager {
  private loadedFonts: Map<string, FontInfo> = new Map()

  /**
   * Load a custom font
   */
  loadFont(customFont: CustomFont): FontInfo {
    // Check if already loaded
    if (this.loadedFonts.has(customFont.name)) {
      return this.loadedFonts.get(customFont.name)!
    }

    // Load font data
    let fontData: Buffer
    if (Buffer.isBuffer(customFont.source)) {
      fontData = customFont.source
    } else if (typeof customFont.source === 'string') {
      if (!fs.existsSync(customFont.source)) {
        throw new Error(`Font file not found: ${customFont.source}`)
      }
      fontData = fs.readFileSync(customFont.source)
    } else {
      throw new Error('Invalid font source: must be a file path or Buffer')
    }

    // Parse font with fontkit
    let font: fontkit.Font
    try {
      const fontCollection = fontkit.create(fontData)
      // If it's a collection (.ttc), use the first font
      if ('fonts' in fontCollection && fontCollection.fonts) {
        font = fontCollection.fonts[0]
      } else {
        font = fontCollection as fontkit.Font
      }
    } catch (error) {
      throw new FontError(
        `Failed to parse font '${customFont.name}': ${error instanceof Error ? error.message : 'Unknown error'}`,
        customFont.name,
        error instanceof Error ? error : undefined
      )
    }

    const fontInfo: FontInfo = {
      name: customFont.name,
      fontData,
      font,
      subset: customFont.subset ?? false,
      usedChars: new Set<number>(),
      usedGlyphs: new Set<number>()
    }

    this.loadedFonts.set(customFont.name, fontInfo)
    return fontInfo
  }

  /**
   * Get loaded font by name
   */
  getFont(name: string): FontInfo | undefined {
    return this.loadedFonts.get(name)
  }

  /**
   * Generate font descriptor for PDF
   */
  generateFontDescriptor(fontInfo: FontInfo, fontFileId: number): string {
    const font = fontInfo.font

    // Font flags (see PDF spec)
    let flags = 0
    flags |= 1 << 5  // Fixed pitch (if monospace)
    flags |= 1 << 2  // Symbolic (non-standard encoding)
    flags |= 1 << 6  // Italic

    return `<<
  /Type /FontDescriptor
  /FontName /${this.sanitizeFontName(fontInfo.name)}
  /Flags ${flags}
  /FontBBox [${font.bbox.minX} ${font.bbox.minY} ${font.bbox.maxX} ${font.bbox.maxY}]
  /ItalicAngle ${font.italicAngle || 0}
  /Ascent ${font.ascent}
  /Descent ${font.descent}
  /CapHeight ${font.capHeight || font.ascent}
  /StemV 80
  /FontFile2 ${fontFileId} 0 R
>>`
  }

  /**
   * Generate font dictionary for PDF
   */
  generateFontDictionary(fontInfo: FontInfo, fontDescriptorId: number): string {
    const font = fontInfo.font
    const glyphCount = font.numGlyphs

    // Generate widths array (first 256 characters for simplicity)
    const widths: number[] = []
    const maxChar = 256

    for (let i = 0; i < maxChar; i++) {
      try {
        // Get glyph for character code
        const glyph = font.glyphsForString(String.fromCharCode(i))[0]
        if (glyph) {
          const width = Math.round((glyph.advanceWidth / font.unitsPerEm) * 1000)
          widths.push(width)
        } else {
          widths.push(0)
        }
      } catch (e) {
        widths.push(0)
      }
    }

    return `<<
  /Type /Font
  /Subtype /TrueType
  /BaseFont /${this.sanitizeFontName(fontInfo.name)}
  /FirstChar 0
  /LastChar ${maxChar - 1}
  /Widths [${widths.join(' ')}]
  /FontDescriptor ${fontDescriptorId} 0 R
  /Encoding /WinAnsiEncoding
>>`
  }

  /**
   * Generate embedded font file stream (compressed)
   */
  generateFontFileStream(fontInfo: FontInfo): { data: Buffer; length: number; length1: number } {
    // Use subsetted font if subsetting is enabled
    const { data: fontData, isSubset } = this.generateSubsettedFont(fontInfo)

    let compressed: Buffer
    try {
      compressed = Buffer.from(pako.deflate(fontData))
    } catch (error) {
      throw new CompressionError(
        `Failed to compress font data for '${fontInfo.name}': ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      )
    }

    return {
      data: compressed,
      length: compressed.length,
      length1: fontData.length  // Original uncompressed size
    }
  }

  /**
   * Sanitize font name for PDF (remove spaces and special characters)
   */
  private sanitizeFontName(name: string): string {
    return name.replace(/[^a-zA-Z0-9]/g, '')
  }

  /**
   * Get text width for custom font
   */
  getTextWidth(fontInfo: FontInfo, text: string, fontSize: number): number {
    const run = fontInfo.font.layout(text)
    return (run.advanceWidth / fontInfo.font.unitsPerEm) * fontSize
  }

  /**
   * Get all loaded fonts
   */
  getAllFonts(): Map<string, FontInfo> {
    return this.loadedFonts
  }

  /**
   * Track character usage for subsetting
   */
  trackCharacterUsage(fontInfo: FontInfo, text: string): void {
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i)
      fontInfo.usedChars.add(charCode)

      // Get glyph ID for this character
      try {
        const glyphs = fontInfo.font.glyphsForString(text[i])
        if (glyphs && glyphs.length > 0) {
          fontInfo.usedGlyphs.add(glyphs[0].id)
        }
      } catch (e) {
        // Ignore errors for unsupported characters
      }
    }
  }

  /**
   * Generate ToUnicode CMap for better text selection and copy-paste
   */
  generateToUnicodeCMap(fontInfo: FontInfo): string {
    const usedCharsArray = Array.from(fontInfo.usedChars).sort((a, b) => a - b)

    if (usedCharsArray.length === 0) {
      // No characters used, return minimal CMap
      return this.generateMinimalCMap()
    }

    let cmap = `/CIDInit /ProcSet findresource begin
12 dict begin
begincmap
/CIDSystemInfo <<
  /Registry (Adobe)
  /Ordering (UCS)
  /Supplement 0
>> def
/CMapName /Adobe-Identity-UCS def
/CMapType 2 def
1 begincodespacerange
<00> <FF>
endcodespacerange
`

    // Group consecutive characters into ranges for efficiency
    const ranges: Array<{ start: number; end: number }> = []
    let rangeStart = usedCharsArray[0]
    let rangeEnd = usedCharsArray[0]

    for (let i = 1; i < usedCharsArray.length; i++) {
      if (usedCharsArray[i] === rangeEnd + 1) {
        rangeEnd = usedCharsArray[i]
      } else {
        ranges.push({ start: rangeStart, end: rangeEnd })
        rangeStart = usedCharsArray[i]
        rangeEnd = usedCharsArray[i]
      }
    }
    ranges.push({ start: rangeStart, end: rangeEnd })

    // Generate bfrange entries
    cmap += `${ranges.length} beginbfrange\n`
    ranges.forEach(range => {
      const startHex = range.start.toString(16).padStart(2, '0')
      const endHex = range.end.toString(16).padStart(2, '0')
      const unicodeHex = range.start.toString(16).padStart(4, '0')
      cmap += `<${startHex}> <${endHex}> <${unicodeHex}>\n`
    })
    cmap += `endbfrange\n`

    cmap += `endcmap
CMapName currentdict /CMap defineresource pop
end
end`

    return cmap
  }

  /**
   * Generate minimal ToUnicode CMap (when no characters tracked)
   */
  private generateMinimalCMap(): string {
    return `/CIDInit /ProcSet findresource begin
12 dict begin
begincmap
/CIDSystemInfo <<
  /Registry (Adobe)
  /Ordering (UCS)
  /Supplement 0
>> def
/CMapName /Adobe-Identity-UCS def
/CMapType 2 def
1 begincodespacerange
<00> <FF>
endcodespacerange
1 beginbfrange
<00> <FF> <0000>
endbfrange
endcmap
CMapName currentdict /CMap defineresource pop
end
end`
  }

  /**
   * Generate subsetted font data (if subsetting is enabled)
   */
  generateSubsettedFont(fontInfo: FontInfo): { data: Buffer; isSubset: boolean } {
    // If subsetting is not enabled or no characters used, return full font
    if (!fontInfo.subset || fontInfo.usedGlyphs.size === 0) {
      return {
        data: fontInfo.fontData,
        isSubset: false
      }
    }

    try {
      // Create subset using fontkit
      const subset = fontInfo.font.createSubset()

      // Include all used glyphs
      const glyphIds = Array.from(fontInfo.usedGlyphs).sort((a, b) => a - b)

      for (const glyphId of glyphIds) {
        const glyph = fontInfo.font.getGlyph(glyphId)
        if (glyph) {
          subset.includeGlyph(glyph)
        }
      }

      // Encode the subset (returns Uint8Array, convert to Buffer)
      const subsetData = subset.encode()
      const subsetBuffer = Buffer.from(subsetData)

      logger.info(
        `Font subsetting complete for ${fontInfo.name}`,
        'FontManager',
        {
          original: `${fontInfo.fontData.length} bytes (${fontInfo.font.numGlyphs} glyphs)`,
          subset: `${subsetBuffer.length} bytes (${fontInfo.usedGlyphs.size} glyphs)`,
          reduction: `${Math.round((1 - subsetBuffer.length / fontInfo.fontData.length) * 100)}%`
        }
      )

      return {
        data: subsetBuffer,
        isSubset: true
      }
    } catch (error) {
      logger.warn(
        `Font subsetting failed for ${fontInfo.name}, falling back to full font`,
        'FontManager',
        { error: error instanceof Error ? error.message : 'Unknown error' }
      )
      return {
        data: fontInfo.fontData,
        isSubset: false
      }
    }
  }
}
