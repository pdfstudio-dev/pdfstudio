import { PDFEncryption } from '../src/security/PDFEncryption'

// Test the encryption class directly
console.log('=== Testing PDFEncryption Implementation ===\n')

const security = {
  userPassword: 'user',
  ownerPassword: 'owner',
  permissions: {
    printing: 'highResolution' as const,
    modifying: true,
    copying: true,
    annotating: true
  }
}

const documentId = '0123456789abcdef0123456789abcdef'
const pdfVersion = '1.4'

const encryption = new PDFEncryption(security, pdfVersion, documentId)

console.log('1. Encryption enabled:', encryption.isEnabled())

const encDict = encryption.getEncryptionDictionary()

console.log('\n2. Encryption Dictionary:')
console.log('   V (Version):', encDict.V)
console.log('   R (Revision):', encDict.R)
console.log('   P (Permissions):', encDict.P, '(0x' + encDict.P.toString(16) + ')')
console.log('   O (Owner hash):', encDict.O.toString('hex'))
console.log('   U (User hash):', encDict.U.toString('hex'))

// Test encrypting a simple string
const testString = Buffer.from('Hello, World!')
console.log('\n3. Test Encryption:')
console.log('   Original:', testString.toString())
console.log('   Original (hex):', testString.toString('hex'))

const encrypted = encryption.encryptData(testString, 1, 0)
console.log('   Encrypted (hex):', encrypted.toString('hex'))

console.log('\n4. Expected values for PDF 1.4 (128-bit):')
console.log('   V should be: 2')
console.log('   R should be: 3')
console.log('   O length should be: 32 bytes')
console.log('   U length should be: 32 bytes')
console.log('\n5. Actual lengths:')
console.log('   O length:', encDict.O.length, 'bytes')
console.log('   U length:', encDict.U.length, 'bytes')

console.log('\n=== Test Complete ===')
