import * as crypto from 'crypto'
import { PDFPermissions, PDFSecurityOptions } from '../types'

/**
 * PDFEncryption - Handles PDF encryption and security
 * Implements RC4 encryption (40-bit and 128-bit)
 */
export class PDFEncryption {
  private userPassword: string
  private ownerPassword: string
  private permissions: PDFPermissions
  private pdfVersion: string
  private encryptionKey: Buffer | null = null
  private documentId: string

  constructor(security: PDFSecurityOptions, pdfVersion: string, documentId: string) {
    this.userPassword = security.userPassword || ''
    this.ownerPassword = security.ownerPassword || security.userPassword || ''
    this.permissions = security.permissions || {}
    this.pdfVersion = pdfVersion
    this.documentId = documentId
  }

  /**
   * Calculate permission flags as 32-bit integer
   * PDF Reference 1.7, Table 3.20
   */
  private calculatePermissionFlags(): number {
    let flags = 0xFFFFFFFC // Default: all permissions enabled (-4 in signed int32)

    // Bit 3 (printing)
    if (this.permissions.printing === false) {
      flags &= ~(1 << 2) // Clear bit 3 (no printing at all)
      flags &= ~(1 << 11) // Clear bit 12 (no high res print)
    } else if (this.permissions.printing === 'lowResolution') {
      // Bit 3 stays set (allow printing)
      flags &= ~(1 << 11) // Clear bit 12 (only low res allowed)
    }
    // highResolution or undefined: bit 3 stays set, bit 12 gets set below

    // Bit 4 (modifying)
    if (this.permissions.modifying === false) {
      flags &= ~(1 << 3) // Clear bit 4
    }

    // Bit 5 (copying/extracting)
    if (this.permissions.copying === false) {
      flags &= ~(1 << 4) // Clear bit 5
    }

    // Bit 6 (annotations)
    if (this.permissions.annotating === false) {
      flags &= ~(1 << 5) // Clear bit 6
    }

    // Bit 9 (fill in forms) - PDF 1.4+
    if (this.permissions.fillingForms === false) {
      flags &= ~(1 << 8) // Clear bit 9
    }

    // Bit 10 (extract for accessibility) - PDF 1.4+
    if (this.permissions.contentAccessibility === false) {
      flags &= ~(1 << 9) // Clear bit 10
    }

    // Bit 11 (assemble document) - PDF 1.4+
    if (this.permissions.documentAssembly === false) {
      flags &= ~(1 << 10) // Clear bit 11
    }

    // Bit 12 (high quality printing) - PDF 1.4+
    if (this.permissions.printing === 'highResolution' || this.permissions.printing === undefined) {
      flags |= (1 << 11) // Set bit 12
    }

    return flags >>> 0 // Convert to unsigned 32-bit
  }

  /**
   * Pad or truncate password to 32 bytes
   * PDF Reference 1.7, Algorithm 3.2
   */
  private padPassword(password: string): Buffer {
    const paddingString = Buffer.from([
      0x28, 0xbf, 0x4e, 0x5e, 0x4e, 0x75, 0x8a, 0x41,
      0x64, 0x00, 0x4e, 0x56, 0xff, 0xfa, 0x01, 0x08,
      0x2e, 0x2e, 0x00, 0xb6, 0xd0, 0x68, 0x3e, 0x80,
      0x2f, 0x0c, 0xa9, 0xfe, 0x64, 0x53, 0x69, 0x7a
    ])

    const passwordBuffer = Buffer.from(password, 'latin1')
    const result = Buffer.alloc(32)

    if (passwordBuffer.length >= 32) {
      passwordBuffer.copy(result, 0, 0, 32)
    } else {
      passwordBuffer.copy(result, 0)
      paddingString.copy(result, passwordBuffer.length, 0, 32 - passwordBuffer.length)
    }

    return result
  }

  /**
   * Compute owner password hash (O entry)
   * PDF Reference 1.7, Algorithm 3.3
   */
  private computeOwnerPassword(): Buffer {
    const ownerPadded = this.padPassword(this.ownerPassword)

    // Step 1: MD5 hash of padded owner password
    let hash = crypto.createHash('md5').update(ownerPadded).digest()

    // Step 2: For 128-bit, do 50 additional MD5 iterations
    if (this.use128Bit()) {
      for (let i = 0; i < 50; i++) {
        hash = crypto.createHash('md5').update(hash).digest()
      }
    }

    // Step 3: Create RC4 encryption key
    const keyLength = this.use128Bit() ? 16 : 5
    const encKey = hash.slice(0, keyLength)

    // Step 4: Encrypt padded user password
    const userPadded = this.padPassword(this.userPassword)
    let encrypted = this.rc4Encrypt(encKey, userPadded)

    // Step 5: For 128-bit, do 19 additional RC4 iterations with different keys
    if (this.use128Bit()) {
      for (let i = 1; i <= 19; i++) {
        const newKey = Buffer.alloc(keyLength)
        for (let j = 0; j < keyLength; j++) {
          newKey[j] = encKey[j] ^ i
        }
        encrypted = this.rc4Encrypt(newKey, encrypted)
      }
    }

    return encrypted
  }

  /**
   * Compute encryption key
   * PDF Reference 1.7, Algorithm 3.2
   */
  private computeEncryptionKey(ownerPassword: Buffer): Buffer {
    const userPadded = this.padPassword(this.userPassword)
    const permissionsBytes = Buffer.alloc(4)
    const permissions = this.calculatePermissionFlags()
    permissionsBytes.writeUInt32LE(permissions, 0)
    const documentIdBuffer = Buffer.from(this.documentId, 'hex')

    // Concatenate: user password + O entry + permissions + document ID
    const data = Buffer.concat([
      userPadded,
      ownerPassword,
      permissionsBytes,
      documentIdBuffer
    ])

    // MD5 hash
    let hash = crypto.createHash('md5').update(data).digest()

    // For 128-bit, do 50 additional iterations
    if (this.use128Bit()) {
      for (let i = 0; i < 50; i++) {
        hash = crypto.createHash('md5').update(hash.slice(0, this.getKeyLength())).digest()
      }
    }

    // Return first n bytes (5 for 40-bit, 16 for 128-bit)
    return hash.slice(0, this.getKeyLength())
  }

  /**
   * Compute user password hash (U entry)
   * PDF Reference 1.7, Algorithm 3.4 (40-bit) and 3.5 (128-bit)
   */
  private computeUserPassword(encryptionKey: Buffer): Buffer {
    if (this.use128Bit()) {
      // Algorithm 3.5 (128-bit)
      const paddingString = this.padPassword('')
      const documentIdBuffer = Buffer.from(this.documentId, 'hex')
      const data = Buffer.concat([paddingString, documentIdBuffer])

      let hash = crypto.createHash('md5').update(data).digest()
      let encrypted = this.rc4Encrypt(encryptionKey, hash)

      // 19 iterations with modified keys
      for (let i = 1; i <= 19; i++) {
        const newKey = Buffer.alloc(encryptionKey.length)
        for (let j = 0; j < encryptionKey.length; j++) {
          newKey[j] = encryptionKey[j] ^ i
        }
        encrypted = this.rc4Encrypt(newKey, encrypted)
      }

      // Pad to 32 bytes
      const result = Buffer.alloc(32)
      encrypted.copy(result, 0)
      return result
    } else {
      // Algorithm 3.4 (40-bit)
      const paddingString = this.padPassword('')
      return this.rc4Encrypt(encryptionKey, paddingString)
    }
  }

  /**
   * RC4 encryption algorithm
   */
  private rc4Encrypt(key: Buffer, data: Buffer): Buffer {
    // Initialize S-box
    const S = new Array(256)
    for (let i = 0; i < 256; i++) {
      S[i] = i
    }

    // Key-scheduling algorithm (KSA)
    let j = 0
    for (let i = 0; i < 256; i++) {
      j = (j + S[i] + key[i % key.length]) % 256
      ;[S[i], S[j]] = [S[j], S[i]] // Swap
    }

    // Pseudo-random generation algorithm (PRGA)
    const result = Buffer.alloc(data.length)
    let i = 0
    j = 0
    for (let k = 0; k < data.length; k++) {
      i = (i + 1) % 256
      j = (j + S[i]) % 256
      ;[S[i], S[j]] = [S[j], S[i]] // Swap
      const K = S[(S[i] + S[j]) % 256]
      result[k] = data[k] ^ K
    }

    return result
  }

  /**
   * Encrypt a string or buffer
   */
  encryptData(data: Buffer, objectNumber: number, generation: number): Buffer {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not initialized')
    }

    // Generate object-specific key
    // PDF Reference 1.7, Algorithm 3.1
    const objBytes = Buffer.alloc(5)
    objBytes.writeUInt32LE(objectNumber, 0)
    objBytes.writeUInt8(generation, 4)

    const md5Input = Buffer.concat([this.encryptionKey, objBytes])
    const hash = crypto.createHash('md5').update(md5Input).digest()
    const objectKey = hash.slice(0, Math.min(this.encryptionKey.length + 5, 16))

    return this.rc4Encrypt(objectKey, data)
  }

  /**
   * Check if using 128-bit encryption
   */
  private use128Bit(): boolean {
    // Use 128-bit for PDF 1.4+
    const version = parseFloat(this.pdfVersion)
    return version >= 1.4
  }

  /**
   * Get encryption key length
   */
  private getKeyLength(): number {
    return this.use128Bit() ? 16 : 5
  }

  /**
   * Get encryption dictionary for PDF
   */
  getEncryptionDictionary(): { O: Buffer; U: Buffer; P: number; R: number; V: number } {
    const O = this.computeOwnerPassword()
    this.encryptionKey = this.computeEncryptionKey(O)
    const U = this.computeUserPassword(this.encryptionKey)
    const P = this.calculatePermissionFlags()

    // Revision and Version
    const use128 = this.use128Bit()
    const R = use128 ? 3 : 2  // Revision (2 for 40-bit, 3 for 128-bit)
    const V = use128 ? 2 : 1  // Version (1 for 40-bit, 2 for 128-bit)

    return { O, U, P, R, V }
  }

  /**
   * Check if encryption is needed
   */
  isEnabled(): boolean {
    return !!(this.userPassword || this.ownerPassword)
  }
}
