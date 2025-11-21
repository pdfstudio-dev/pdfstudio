/**
 * XMP Metadata Generator for PDF/A Compliance
 *
 * XMP (Extensible Metadata Platform) is required for PDF/A conformance.
 * This module generates the XMP metadata stream that includes document
 * metadata and PDF/A identification.
 */

import type { DocumentInfo, PDFAConformanceLevel, ExtendedMetadata } from '../types'
import { getConfig } from '../config/defaults'

/**
 * Format a date for XMP (ISO 8601 format)
 */
function formatXMPDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  // Get timezone offset
  const offset = -date.getTimezoneOffset()
  const offsetHours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0')
  const offsetMinutes = String(Math.abs(offset) % 60).padStart(2, '0')
  const offsetSign = offset >= 0 ? '+' : '-'

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${offsetHours}:${offsetMinutes}`
}

/**
 * Escape XML special characters
 */
function escapeXML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Get PDF/A part number from conformance level
 */
function getPDFAPart(level: PDFAConformanceLevel): number {
  if (level === 'PDF/A-1b') return 1
  if (level === 'PDF/A-2b') return 2
  if (level === 'PDF/A-3b') return 3
  return 1
}

/**
 * Get PDF/A conformance letter (always 'B' for basic level)
 */
function getPDFAConformance(level: PDFAConformanceLevel): string {
  // All our supported levels are 'B' (basic)
  return 'B'
}

/**
 * Generate XMP metadata XML
 *
 * @param info - Document metadata
 * @param conformanceLevel - PDF/A conformance level (optional)
 * @returns XMP metadata as XML string
 */
export function generateXMPMetadata(
  info: DocumentInfo,
  conformanceLevel?: PDFAConformanceLevel
): string {
  const now = new Date()
  const creationDate = info.CreationDate || now
  const modDate = info.ModDate || now

  const config = getConfig()
  const title = info.Title ? escapeXML(info.Title) : ''
  const author = info.Author ? escapeXML(info.Author) : ''
  const subject = info.Subject ? escapeXML(info.Subject) : ''
  const keywords = info.Keywords ? escapeXML(info.Keywords) : ''
  const creator = info.Creator ? escapeXML(info.Creator) : escapeXML(config.defaultCreator)
  const producer = info.Producer ? escapeXML(info.Producer) : escapeXML(config.defaultProducer)

  const createDate = formatXMPDate(creationDate)
  const modifyDate = formatXMPDate(modDate)

  const extended = info.extendedMetadata

  // Build XMP packet
  let xmp = `<?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?>\n`
  xmp += `<x:xmpmeta xmlns:x="adobe:ns:meta/">\n`
  xmp += `  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">\n`
  xmp += `    <rdf:Description rdf:about=""\n`
  xmp += `        xmlns:pdf="http://ns.adobe.com/pdf/1.3/"\n`
  xmp += `        xmlns:xmp="http://ns.adobe.com/xap/1.0/"\n`
  xmp += `        xmlns:dc="http://purl.org/dc/elements/1.1/"\n`

  // Add PDF/A namespace if conformance level is specified
  if (conformanceLevel) {
    xmp += `        xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/"\n`
  }

  // Add custom namespace if custom properties exist
  if (extended?.custom) {
    xmp += `        xmlns:pdfstudio="http://pdfstudio.ai/ns/1.0/"\n`
  }

  xmp += `        xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/">\n`

  // PDF/A identification (if specified)
  if (conformanceLevel) {
    const pdfaPart = getPDFAPart(conformanceLevel)
    const pdfaConformance = getPDFAConformance(conformanceLevel)
    xmp += `      <pdfaid:part>${pdfaPart}</pdfaid:part>\n`
    xmp += `      <pdfaid:conformance>${pdfaConformance}</pdfaid:conformance>\n`
  }

  // PDF metadata
  if (keywords) {
    xmp += `      <pdf:Keywords>${keywords}</pdf:Keywords>\n`
  }
  xmp += `      <pdf:Producer>${producer}</pdf:Producer>\n`

  // PDF/X metadata (if specified)
  if (extended?.gts_pdfxVersion) {
    xmp += `      <pdf:GTS_PDFXVersion>${escapeXML(extended.gts_pdfxVersion)}</pdf:GTS_PDFXVersion>\n`
  }
  if (extended?.gts_pdfxConformance) {
    xmp += `      <pdf:GTS_PDFXConformance>${escapeXML(extended.gts_pdfxConformance)}</pdf:GTS_PDFXConformance>\n`
  }
  if (extended?.trapped) {
    xmp += `      <pdf:Trapped>${extended.trapped}</pdf:Trapped>\n`
  }

  // XMP metadata
  xmp += `      <xmp:CreatorTool>${creator}</xmp:CreatorTool>\n`
  xmp += `      <xmp:CreateDate>${createDate}</xmp:CreateDate>\n`
  xmp += `      <xmp:ModifyDate>${modifyDate}</xmp:ModifyDate>\n`

  // Dublin Core metadata
  if (title) {
    xmp += `      <dc:title>\n`
    xmp += `        <rdf:Alt>\n`
    xmp += `          <rdf:li xml:lang="x-default">${title}</rdf:li>\n`
    xmp += `        </rdf:Alt>\n`
    xmp += `      </dc:title>\n`
  }

  if (author) {
    xmp += `      <dc:creator>\n`
    xmp += `        <rdf:Seq>\n`
    xmp += `          <rdf:li>${author}</rdf:li>\n`
    xmp += `        </rdf:Seq>\n`
    xmp += `      </dc:creator>\n`
  }

  if (subject || extended?.description) {
    xmp += `      <dc:description>\n`
    xmp += `        <rdf:Alt>\n`
    xmp += `          <rdf:li xml:lang="x-default">${escapeXML(extended?.description || subject)}</rdf:li>\n`
    xmp += `        </rdf:Alt>\n`
    xmp += `      </dc:description>\n`
  }

  // Extended Dublin Core metadata
  if (extended?.language) {
    xmp += `      <dc:language>\n`
    xmp += `        <rdf:Bag>\n`
    xmp += `          <rdf:li>${escapeXML(extended.language)}</rdf:li>\n`
    xmp += `        </rdf:Bag>\n`
    xmp += `      </dc:language>\n`
  }

  if (extended?.identifier) {
    xmp += `      <dc:identifier>${escapeXML(extended.identifier)}</dc:identifier>\n`
  }

  if (extended?.source) {
    xmp += `      <dc:source>${escapeXML(extended.source)}</dc:source>\n`
  }

  if (extended?.relation) {
    xmp += `      <dc:relation>${escapeXML(extended.relation)}</dc:relation>\n`
  }

  if (extended?.coverage) {
    xmp += `      <dc:coverage>${escapeXML(extended.coverage)}</dc:coverage>\n`
  }

  if (extended?.category) {
    xmp += `      <dc:subject>\n`
    xmp += `        <rdf:Bag>\n`
    xmp += `          <rdf:li>${escapeXML(extended.category)}</rdf:li>\n`
    xmp += `        </rdf:Bag>\n`
    xmp += `      </dc:subject>\n`
  }

  if (extended?.contentType) {
    xmp += `      <dc:format>${escapeXML(extended.contentType)}</dc:format>\n`
  }

  // Rights metadata
  if (extended?.rights) {
    xmp += `      <xmpRights:Marked>True</xmpRights:Marked>\n`
    xmp += `      <xmpRights:WebStatement>${escapeXML(extended.rights)}</xmpRights:WebStatement>\n`
    xmp += `      <dc:rights>\n`
    xmp += `        <rdf:Alt>\n`
    xmp += `          <rdf:li xml:lang="x-default">${escapeXML(extended.rights)}</rdf:li>\n`
    xmp += `        </rdf:Alt>\n`
    xmp += `      </dc:rights>\n`
  }

  // Custom metadata
  if (extended?.custom) {
    for (const [key, value] of Object.entries(extended.custom)) {
      let valueStr: string
      if (value instanceof Date) {
        valueStr = formatXMPDate(value)
      } else if (typeof value === 'boolean') {
        valueStr = value ? 'True' : 'False'
      } else {
        valueStr = escapeXML(String(value))
      }
      xmp += `      <pdfstudio:${escapeXML(key)}>${valueStr}</pdfstudio:${escapeXML(key)}>\n`
    }
  }

  xmp += `    </rdf:Description>\n`
  xmp += `  </rdf:RDF>\n`
  xmp += `</x:xmpmeta>\n`
  xmp += `<?xpacket end="w"?>`

  return xmp
}

/**
 * Get sRGB ICC color profile data (embedded for PDF/A compliance)
 *
 * For PDF/A, we need to embed an ICC color profile. For simplicity,
 * we return a minimal sRGB profile identifier. In production, you would
 * embed the actual ICC profile data.
 *
 * @returns ICC profile data buffer
 */
export function getSRGBColorProfile(): Buffer {
  // This is a placeholder. In a production implementation, you would
  // embed the actual sRGB ICC profile binary data.
  // For now, we'll use a minimal profile identifier
  const profileData = 'sRGB IEC61966-2.1'
  return Buffer.from(profileData, 'utf-8')
}
