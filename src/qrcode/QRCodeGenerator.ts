import * as QRCode from 'qrcode'
import { QRCodeOptions, QRCodeData, QRCodeLogoOptions } from '../types'
import { ImageParser } from '../images/ImageParser'
import { ImageError } from '../errors'
import { logger } from '../utils/logger'
import { PlatformFactory } from '../platform'

/**
 * QRCodeGenerator - Generates QR codes with customization options
 * Supports URLs, vCards, WiFi credentials, emails, and more
 * Now compatible with both Node.js and Browser environments
 */
export class QRCodeGenerator {
  /**
   * Generate QR code as PNG buffer
   */
  static async generate(options: QRCodeOptions): Promise<Buffer> {
    // Convert data to QR code text format
    const qrText = this.convertDataToText(options.data)

    // Prepare QR code generation options
    // QR codes have a specific module count based on version/data
    // We generate at a scale where each module is exactly N pixels for perfect sharpness
    const scale = 10 // Each QR module will be 10x10 pixels (crisp rendering)

    const qrOptions: any = {
      errorCorrectionLevel: options.errorCorrectionLevel || 'M',
      margin: options.margin ?? 4,
      color: {
        dark: options.foregroundColor || '#000000',
        light: options.backgroundColor || '#FFFFFF'
      },
      scale: scale, // Use scale instead of width for pixel-perfect modules
      width: (options.size || 150) // Fallback width
    }

    // Add version if specified
    if (options.version) {
      qrOptions.version = options.version
    }

    // Add mask pattern if specified (0-7 are valid values)
    if (options.maskPattern !== undefined && options.maskPattern >= 0 && options.maskPattern <= 7) {
      qrOptions.maskPattern = options.maskPattern as QRCode.QRCodeMaskPattern
    }

    // Generate base QR code
    let qrBuffer: Buffer
    try {
      // Detect environment: Node.js has toBuffer, browser has toDataURL
      const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

      if (isBrowser) {
        // Browser: use toDataURL and convert to buffer
        const dataUrl = await (QRCode.toDataURL(qrText, qrOptions) as unknown as Promise<string>)
        // Convert data URL to buffer
        const base64Data = dataUrl.split(',')[1]
        const binaryString = atob(base64Data)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        qrBuffer = Buffer.from(bytes)
      } else {
        // Node.js: use toBuffer
        qrOptions.type = 'png'
        qrBuffer = await (QRCode.toBuffer(qrText, qrOptions) as unknown as Promise<Buffer>)
      }
    } catch (error) {
      throw new ImageError(
        `Failed to generate QR code: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'QRCode',
        error instanceof Error ? error : undefined
      )
    }

    // Add logo if specified
    if (options.logo) {
      qrBuffer = await this.addLogoToQR(qrBuffer, options.logo, options.size || 100)
    }

    return qrBuffer
  }

  /**
   * Convert various data types to QR code text format
   */
  private static convertDataToText(data: string | QRCodeData): string {
    // If string, return as-is
    if (typeof data === 'string') {
      return data
    }

    // Handle structured data types
    if (data.url) {
      return data.url
    }

    if (data.text) {
      return data.text
    }

    if (data.email) {
      const { address, subject, body } = data.email
      let mailto = `mailto:${address}`
      const params: string[] = []
      if (subject) params.push(`subject=${encodeURIComponent(subject)}`)
      if (body) params.push(`body=${encodeURIComponent(body)}`)
      if (params.length > 0) mailto += `?${params.join('&')}`
      return mailto
    }

    if (data.phone) {
      return `tel:${data.phone}`
    }

    if (data.sms) {
      const { phone, message } = data.sms
      if (message) {
        return `smsto:${phone}:${message}`
      }
      return `sms:${phone}`
    }

    if (data.wifi) {
      const { ssid, password, encryption = 'WPA', hidden = false } = data.wifi
      return `WIFI:T:${encryption};S:${ssid};P:${password};H:${hidden ? 'true' : 'false'};;`
    }

    if (data.vcard) {
      const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0']

      // Name
      lines.push(`N:${data.vcard.lastName};${data.vcard.firstName};;;`)
      lines.push(`FN:${data.vcard.firstName} ${data.vcard.lastName}`)

      // Organization
      if (data.vcard.organization) {
        lines.push(`ORG:${data.vcard.organization}`)
      }
      if (data.vcard.title) {
        lines.push(`TITLE:${data.vcard.title}`)
      }

      // Contact info
      if (data.vcard.phone) {
        lines.push(`TEL:${data.vcard.phone}`)
      }
      if (data.vcard.email) {
        lines.push(`EMAIL:${data.vcard.email}`)
      }
      if (data.vcard.url) {
        lines.push(`URL:${data.vcard.url}`)
      }

      // Address
      if (data.vcard.address) {
        const { street = '', city = '', state = '', zip = '', country = '' } = data.vcard.address
        lines.push(`ADR:;;${street};${city};${state};${zip};${country}`)
      }

      lines.push('END:VCARD')
      return lines.join('\n')
    }

    if (data.geo) {
      return `geo:${data.geo.latitude},${data.geo.longitude}`
    }

    if (data.event) {
      const lines: string[] = ['BEGIN:VEVENT']

      lines.push(`SUMMARY:${data.event.title}`)

      if (data.event.location) {
        lines.push(`LOCATION:${data.event.location}`)
      }

      // Format dates as YYYYMMDDTHHMMSS
      const formatDate = (date: Date): string => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')
        return `${year}${month}${day}T${hours}${minutes}${seconds}`
      }

      lines.push(`DTSTART:${formatDate(data.event.startDate)}`)
      if (data.event.endDate) {
        lines.push(`DTEND:${formatDate(data.event.endDate)}`)
      }

      if (data.event.description) {
        lines.push(`DESCRIPTION:${data.event.description}`)
      }

      lines.push('END:VEVENT')
      return lines.join('\n')
    }

    throw new Error('No valid QR code data provided')
  }

  /**
   * Add logo/image to center of QR code
   */
  private static async addLogoToQR(
    qrBuffer: Buffer,
    logoOptions: QRCodeLogoOptions,
    qrSize: number
  ): Promise<Buffer> {
    try {
      const imageProcessor = PlatformFactory.getImageProcessor()
      const fs = PlatformFactory.getFileSystem()

      // Load QR code image
      const qrImage = imageProcessor.load(qrBuffer)
      const qrMetadata = await qrImage.metadata()
      const qrWidth = qrMetadata.width || 400
      const qrHeight = qrMetadata.height || 400

      // Load logo image (from file path, URL, File, or buffer)
      let logoBuffer: Buffer
      if (typeof logoOptions.source === 'string' || logoOptions.source instanceof File) {
        logoBuffer = await fs.readFile(logoOptions.source)
      } else {
        logoBuffer = logoOptions.source
      }

      // Calculate logo size (default to 20% of QR code size, max 30%)
      const logoSizePercent = Math.min(
        (logoOptions.width || qrWidth * 0.2) / qrWidth,
        0.3
      )
      const logoSize = Math.floor(qrWidth * logoSizePercent)

      // Resize logo
      let logoProcessed = imageProcessor.load(logoBuffer)
        .resize(logoSize, logoSize, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })

      let logoImageBuffer = await logoProcessed.png().toBuffer()

      // Apply border radius if specified
      if (logoOptions.borderRadius && logoOptions.borderRadius > 0) {
        const radius = Math.min(logoOptions.borderRadius, logoSize / 2)

        // Create rounded corners mask using SVG
        const mask = Buffer.from(
          `<svg width="${logoSize}" height="${logoSize}">
            <rect x="0" y="0" width="${logoSize}" height="${logoSize}" rx="${radius}" ry="${radius}" fill="white"/>
          </svg>`
        )

        // Apply mask to logo
        const maskBuffer = await imageProcessor.load(mask).png().toBuffer()
        logoImageBuffer = await imageProcessor.load(logoImageBuffer)
          .composite([{
            input: maskBuffer,
            top: 0,
            left: 0,
            blend: 'dest-in'
          }])
          .png()
          .toBuffer()
      }

      // Calculate logo background size (logo + margin)
      const margin = logoOptions.margin || 10
      const bgSize = logoSize + (margin * 2)

      // Create background for logo (white by default)
      const bgColor = logoOptions.backgroundColor || '#FFFFFF'
      const bgRgb = this.hexToRgb(bgColor)

      const logoBackground = await imageProcessor.create({
        width: bgSize,
        height: bgSize,
        channels: 4,
        background: { r: bgRgb.r, g: bgRgb.g, b: bgRgb.b, alpha: 1 }
      })
      .composite([{
        input: logoImageBuffer,
        top: margin,
        left: margin
      }])
      .png()
      .toBuffer()

      // Composite logo+background onto QR code (centered)
      const left = Math.floor((qrWidth - bgSize) / 2)
      const top = Math.floor((qrHeight - bgSize) / 2)

      const result = await qrImage
        .composite([{
          input: logoBackground,
          top: top,
          left: left
        }])
        .png()
        .toBuffer()

      return result
    } catch (error) {
      logger.error(
        'Error adding logo to QR code, returning original QR code',
        'QRCodeGenerator',
        { error: error instanceof Error ? error.message : 'Unknown error' }
      )
      // Return original QR code if logo processing fails
      return qrBuffer
    }
  }

  /**
   * Convert hex color to RGB
   */
  private static hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : { r: 255, g: 255, b: 255 }
  }

  /**
   * Calculate optimal QR code size based on data length
   */
  static calculateOptimalSize(data: string, targetSize: number = 100): number {
    const dataLength = data.length

    // Estimate QR version needed (rough approximation)
    let version = 1
    if (dataLength > 25) version = 2
    if (dataLength > 47) version = 3
    if (dataLength > 77) version = 4
    if (dataLength > 114) version = 5
    if (dataLength > 154) version = 10
    if (dataLength > 300) version = 15
    if (dataLength > 600) version = 20

    // QR codes get more modules as version increases
    // Return at least the target size
    return Math.max(targetSize, version * 10)
  }
}
