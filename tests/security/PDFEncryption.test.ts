import { PDFEncryption } from '../../src/security/PDFEncryption';
import { PDFSecurityOptions } from '../../src/types';

const TEST_DOC_ID = 'abcdef0123456789abcdef0123456789';

function createEncryption(
  security: PDFSecurityOptions,
  pdfVersion = '1.4',
  documentId = TEST_DOC_ID
): PDFEncryption {
  return new PDFEncryption(security, pdfVersion, documentId);
}

describe('PDFEncryption', () => {
  // =====================
  // Construction & Initialization
  // =====================
  describe('Construction & Initialization', () => {
    it('should create encryption with user password only', () => {
      // Arrange & Act
      const enc = createEncryption({ userPassword: 'secret' });

      // Assert
      expect(enc).toBeInstanceOf(PDFEncryption);
      expect(enc.isEnabled()).toBe(true);
    });

    it('should create encryption with owner password only', () => {
      // Arrange & Act
      const enc = createEncryption({ ownerPassword: 'admin' });

      // Assert
      expect(enc).toBeInstanceOf(PDFEncryption);
      expect(enc.isEnabled()).toBe(true);
    });

    it('should create encryption with both passwords', () => {
      // Arrange & Act
      const enc = createEncryption({
        userPassword: 'user123',
        ownerPassword: 'owner456',
      });

      // Assert
      expect(enc).toBeInstanceOf(PDFEncryption);
      expect(enc.isEnabled()).toBe(true);
    });

    it('should create encryption with permissions', () => {
      // Arrange & Act
      const enc = createEncryption({
        userPassword: 'pass',
        permissions: {
          printing: false,
          modifying: false,
          copying: false,
          annotating: false,
        },
      });

      // Assert
      expect(enc).toBeInstanceOf(PDFEncryption);
      expect(enc.isEnabled()).toBe(true);
    });

    it('should be enabled when passwords are provided', () => {
      // Arrange
      const enc = createEncryption({ userPassword: 'test' });

      // Act
      const enabled = enc.isEnabled();

      // Assert
      expect(enabled).toBe(true);
    });

    it('should not be enabled when no passwords are provided (empty options)', () => {
      // Arrange
      const enc = createEncryption({});

      // Act
      const enabled = enc.isEnabled();

      // Assert
      expect(enabled).toBe(false);
    });
  });

  // =====================
  // Encryption Dictionary
  // =====================
  describe('Encryption Dictionary', () => {
    it('should return valid encryption dictionary with O, U, P, R, V', () => {
      // Arrange
      const enc = createEncryption({ userPassword: 'test' });

      // Act
      const dict = enc.getEncryptionDictionary();

      // Assert
      expect(dict).toHaveProperty('O');
      expect(dict).toHaveProperty('U');
      expect(dict).toHaveProperty('P');
      expect(dict).toHaveProperty('R');
      expect(dict).toHaveProperty('V');
    });

    it('should produce O (owner hash) as a Buffer of 32 bytes', () => {
      // Arrange
      const enc = createEncryption({ userPassword: 'test' });

      // Act
      const dict = enc.getEncryptionDictionary();

      // Assert
      expect(Buffer.isBuffer(dict.O)).toBe(true);
      expect(dict.O.length).toBe(32);
    });

    it('should produce U (user hash) as a Buffer of 32 bytes', () => {
      // Arrange
      const enc = createEncryption({ userPassword: 'test' });

      // Act
      const dict = enc.getEncryptionDictionary();

      // Assert
      expect(Buffer.isBuffer(dict.U)).toBe(true);
      expect(dict.U.length).toBe(32);
    });

    it('should produce P as a number representing permission flags', () => {
      // Arrange
      const enc = createEncryption({ userPassword: 'test' });

      // Act
      const dict = enc.getEncryptionDictionary();

      // Assert
      expect(typeof dict.P).toBe('number');
    });

    it('should produce R as 2 or 3 (revision)', () => {
      // Arrange
      const enc = createEncryption({ userPassword: 'test' });

      // Act
      const dict = enc.getEncryptionDictionary();

      // Assert
      expect([2, 3]).toContain(dict.R);
    });

    it('should produce V as 1 or 2 (version)', () => {
      // Arrange
      const enc = createEncryption({ userPassword: 'test' });

      // Act
      const dict = enc.getEncryptionDictionary();

      // Assert
      expect([1, 2]).toContain(dict.V);
    });

    it('should produce R=3 and V=2 for PDF 1.4+ (128-bit)', () => {
      // Arrange
      const enc = createEncryption({ userPassword: 'test' }, '1.4');

      // Act
      const dict = enc.getEncryptionDictionary();

      // Assert
      expect(dict.R).toBe(3);
      expect(dict.V).toBe(2);
    });

    it('should produce R=2 and V=1 for PDF 1.3 (40-bit)', () => {
      // Arrange
      const enc = createEncryption({ userPassword: 'test' }, '1.3');

      // Act
      const dict = enc.getEncryptionDictionary();

      // Assert
      expect(dict.R).toBe(2);
      expect(dict.V).toBe(1);
    });

    it('should produce consistent dictionary for the same inputs', () => {
      // Arrange
      const security: PDFSecurityOptions = { userPassword: 'test', ownerPassword: 'admin' };
      const enc1 = createEncryption(security);
      const enc2 = createEncryption(security);

      // Act
      const dict1 = enc1.getEncryptionDictionary();
      const dict2 = enc2.getEncryptionDictionary();

      // Assert
      expect(dict1.O).toEqual(dict2.O);
      expect(dict1.U).toEqual(dict2.U);
      expect(dict1.P).toBe(dict2.P);
      expect(dict1.R).toBe(dict2.R);
      expect(dict1.V).toBe(dict2.V);
    });

    it('should produce different O values for different owner passwords', () => {
      // Arrange
      const enc1 = createEncryption({ userPassword: 'user', ownerPassword: 'owner1' });
      const enc2 = createEncryption({ userPassword: 'user', ownerPassword: 'owner2' });

      // Act
      const dict1 = enc1.getEncryptionDictionary();
      const dict2 = enc2.getEncryptionDictionary();

      // Assert
      expect(dict1.O).not.toEqual(dict2.O);
    });

    it('should produce different U values for different user passwords', () => {
      // Arrange
      const enc1 = createEncryption({ userPassword: 'user1', ownerPassword: 'owner' });
      const enc2 = createEncryption({ userPassword: 'user2', ownerPassword: 'owner' });

      // Act
      const dict1 = enc1.getEncryptionDictionary();
      const dict2 = enc2.getEncryptionDictionary();

      // Assert
      expect(dict1.U).not.toEqual(dict2.U);
    });
  });

  // =====================
  // Permission Flags
  // =====================
  describe('Permission Flags', () => {
    it('should set default permissions (all allowed) when no permissions specified', () => {
      // Arrange
      const enc = createEncryption({ userPassword: 'test' });

      // Act
      const dict = enc.getEncryptionDictionary();

      // Assert
      expect(dict.P).toBeGreaterThan(0);
      // All permission bits should be set by default
      expect(dict.P & (1 << 2)).not.toBe(0); // printing
      expect(dict.P & (1 << 3)).not.toBe(0); // modifying
      expect(dict.P & (1 << 4)).not.toBe(0); // copying
      expect(dict.P & (1 << 5)).not.toBe(0); // annotating
      expect(dict.P & (1 << 11)).not.toBe(0); // high quality print
    });

    it('should change P value when restricting printing', () => {
      // Arrange
      const encAllowed = createEncryption({
        userPassword: 'test',
        permissions: { printing: 'highResolution' },
      });
      const encRestricted = createEncryption({
        userPassword: 'test',
        permissions: { printing: false },
      });

      // Act
      const pAllowed = encAllowed.getEncryptionDictionary().P;
      const pRestricted = encRestricted.getEncryptionDictionary().P;

      // Assert
      expect(pAllowed).not.toBe(pRestricted);
      expect(pRestricted & (1 << 2)).toBe(0);
      expect(pAllowed & (1 << 2)).not.toBe(0);
    });

    it('should change P value when restricting copying', () => {
      // Arrange
      const encAllowed = createEncryption({
        userPassword: 'test',
        permissions: { copying: true },
      });
      const encRestricted = createEncryption({
        userPassword: 'test',
        permissions: { copying: false },
      });

      // Act
      const pAllowed = encAllowed.getEncryptionDictionary().P;
      const pRestricted = encRestricted.getEncryptionDictionary().P;

      // Assert
      expect(pAllowed).not.toBe(pRestricted);
      expect(pRestricted & (1 << 4)).toBe(0);
      expect(pAllowed & (1 << 4)).not.toBe(0);
    });

    it('should change P value when restricting modifying', () => {
      // Arrange
      const encAllowed = createEncryption({
        userPassword: 'test',
        permissions: { modifying: true },
      });
      const encRestricted = createEncryption({
        userPassword: 'test',
        permissions: { modifying: false },
      });

      // Act
      const pAllowed = encAllowed.getEncryptionDictionary().P;
      const pRestricted = encRestricted.getEncryptionDictionary().P;

      // Assert
      expect(pAllowed).not.toBe(pRestricted);
      expect(pRestricted & (1 << 3)).toBe(0);
      expect(pAllowed & (1 << 3)).not.toBe(0);
    });

    it('should produce different P for all restricted vs all allowed', () => {
      // Arrange
      const encAllAllowed = createEncryption({
        userPassword: 'test',
        permissions: {
          printing: 'highResolution',
          modifying: true,
          copying: true,
          annotating: true,
          fillingForms: true,
          contentAccessibility: true,
          documentAssembly: true,
        },
      });
      const encAllRestricted = createEncryption({
        userPassword: 'test',
        permissions: {
          printing: false,
          modifying: false,
          copying: false,
          annotating: false,
          fillingForms: false,
          contentAccessibility: false,
          documentAssembly: false,
        },
      });

      // Act
      const pAllowed = encAllAllowed.getEncryptionDictionary().P;
      const pRestricted = encAllRestricted.getEncryptionDictionary().P;

      // Assert
      expect(pAllowed).not.toBe(pRestricted);
    });

    it('should deny high-res printing when printing is lowResolution', () => {
      // Arrange
      const enc = createEncryption({
        userPassword: 'test',
        permissions: { printing: 'lowResolution' },
      });

      // Act
      const dict = enc.getEncryptionDictionary();

      // Assert
      expect(dict.P & (1 << 2)).not.toBe(0); // bit 3: printing allowed
      expect(dict.P & (1 << 11)).toBe(0); // bit 12: high quality cleared
    });

    it('should allow high-res printing when printing is highResolution', () => {
      // Arrange
      const enc = createEncryption({
        userPassword: 'test',
        permissions: { printing: 'highResolution' },
      });

      // Act
      const dict = enc.getEncryptionDictionary();

      // Assert
      expect(dict.P & (1 << 2)).not.toBe(0); // bit 3: printing set
      expect(dict.P & (1 << 11)).not.toBe(0); // bit 12: high quality set
    });

    it('should deny annotating when annotating is false', () => {
      // Arrange
      const encAllowed = createEncryption({ userPassword: 'test', permissions: {} });
      const encDenied = createEncryption({
        userPassword: 'test',
        permissions: { annotating: false },
      });

      // Act
      const pAllowed = encAllowed.getEncryptionDictionary().P;
      const pDenied = encDenied.getEncryptionDictionary().P;

      // Assert
      expect(pDenied & (1 << 5)).toBe(0);
      expect(pAllowed & (1 << 5)).not.toBe(0);
    });

    it('should deny filling forms when fillingForms is false', () => {
      // Arrange
      const encDenied = createEncryption({
        userPassword: 'test',
        permissions: { fillingForms: false },
      });

      // Act
      const pDenied = encDenied.getEncryptionDictionary().P;

      // Assert
      expect(pDenied & (1 << 8)).toBe(0);
    });

    it('should deny content accessibility when contentAccessibility is false', () => {
      // Arrange
      const encDenied = createEncryption({
        userPassword: 'test',
        permissions: { contentAccessibility: false },
      });

      // Act
      const pDenied = encDenied.getEncryptionDictionary().P;

      // Assert
      expect(pDenied & (1 << 9)).toBe(0);
    });

    it('should deny document assembly when documentAssembly is false', () => {
      // Arrange
      const encDenied = createEncryption({
        userPassword: 'test',
        permissions: { documentAssembly: false },
      });

      // Act
      const pDenied = encDenied.getEncryptionDictionary().P;

      // Assert
      expect(pDenied & (1 << 10)).toBe(0);
    });

    it('should clear all permission bits when all permissions are restricted', () => {
      // Arrange
      const enc = createEncryption({
        userPassword: 'test',
        permissions: {
          printing: false,
          modifying: false,
          copying: false,
          annotating: false,
          fillingForms: false,
          contentAccessibility: false,
          documentAssembly: false,
        },
      });

      // Act
      const dict = enc.getEncryptionDictionary();

      // Assert
      expect(dict.P & (1 << 2)).toBe(0); // printing
      expect(dict.P & (1 << 3)).toBe(0); // modifying
      expect(dict.P & (1 << 4)).toBe(0); // copying
      expect(dict.P & (1 << 5)).toBe(0); // annotating
      expect(dict.P & (1 << 8)).toBe(0); // fillingForms
      expect(dict.P & (1 << 9)).toBe(0); // contentAccessibility
      expect(dict.P & (1 << 10)).toBe(0); // documentAssembly
      expect(dict.P & (1 << 11)).toBe(0); // high quality print
    });
  });

  // =====================
  // Data Encryption
  // =====================
  describe('Data Encryption', () => {
    it('should return a Buffer from encryptData', () => {
      // Arrange
      const enc = createEncryption({ userPassword: 'test' });
      enc.getEncryptionDictionary();
      const data = Buffer.from('Hello, World!');

      // Act
      const encrypted = enc.encryptData(data, 1, 0);

      // Assert
      expect(Buffer.isBuffer(encrypted)).toBe(true);
    });

    it('should return different data than input', () => {
      // Arrange
      const enc = createEncryption({ userPassword: 'test' });
      enc.getEncryptionDictionary();
      const data = Buffer.from('Hello, World!');

      // Act
      const encrypted = enc.encryptData(data, 1, 0);

      // Assert
      expect(encrypted).not.toEqual(data);
    });

    it('should produce same encrypted output for same data and object number (deterministic)', () => {
      // Arrange
      const enc = createEncryption({ userPassword: 'test' });
      enc.getEncryptionDictionary();
      const data = Buffer.from('Consistent test');

      // Act
      const encrypted1 = enc.encryptData(data, 5, 0);
      const encrypted2 = enc.encryptData(data, 5, 0);

      // Assert
      expect(encrypted1).toEqual(encrypted2);
    });

    it('should produce different encrypted output for different object numbers', () => {
      // Arrange
      const enc = createEncryption({ userPassword: 'test' });
      enc.getEncryptionDictionary();
      const data = Buffer.from('Same content for both');

      // Act
      const encrypted1 = enc.encryptData(data, 1, 0);
      const encrypted2 = enc.encryptData(data, 2, 0);

      // Assert
      expect(encrypted1).not.toEqual(encrypted2);
    });

    it('should produce encrypted data with same length as input (RC4 stream cipher)', () => {
      // Arrange
      const enc = createEncryption({ userPassword: 'test' });
      enc.getEncryptionDictionary();
      const data = Buffer.from('Test data for RC4 encryption');

      // Act
      const encrypted = enc.encryptData(data, 1, 0);

      // Assert
      expect(encrypted.length).toBe(data.length);
    });

    it('should throw when encryption key is not initialized', () => {
      // Arrange
      const enc = createEncryption({ userPassword: 'test' });
      const data = Buffer.from('test');

      // Act & Assert
      expect(() => enc.encryptData(data, 1, 0)).toThrow('Encryption key not initialized');
    });

    it('should produce different output for different generation numbers', () => {
      // Arrange
      const enc = createEncryption({ userPassword: 'test' });
      enc.getEncryptionDictionary();
      const data = Buffer.from('Generation test');

      // Act
      const encrypted1 = enc.encryptData(data, 1, 0);
      const encrypted2 = enc.encryptData(data, 1, 1);

      // Assert
      expect(encrypted1).not.toEqual(encrypted2);
    });
  });

  // =====================
  // PDF Version Handling
  // =====================
  describe('PDF Version Handling', () => {
    it('should work with PDF version 1.4', () => {
      // Arrange
      const enc = createEncryption({ userPassword: 'test' }, '1.4');

      // Act
      const dict = enc.getEncryptionDictionary();

      // Assert
      expect(dict.R).toBe(3);
      expect(dict.V).toBe(2);
      expect(dict.O.length).toBe(32);
      expect(dict.U.length).toBe(32);
    });

    it('should work with PDF version 1.7', () => {
      // Arrange
      const enc = createEncryption({ userPassword: 'test' }, '1.7');

      // Act
      const dict = enc.getEncryptionDictionary();

      // Assert
      expect(dict.R).toBe(3);
      expect(dict.V).toBe(2);
      expect(dict.O.length).toBe(32);
      expect(dict.U.length).toBe(32);
    });

    it('should use 40-bit encryption for PDF version 1.3', () => {
      // Arrange
      const enc = createEncryption({ userPassword: 'test' }, '1.3');

      // Act
      const dict = enc.getEncryptionDictionary();

      // Assert
      expect(dict.R).toBe(2);
      expect(dict.V).toBe(1);
    });

    it('should use 128-bit encryption for PDF version 1.5', () => {
      // Arrange
      const enc = createEncryption({ userPassword: 'test' }, '1.5');

      // Act
      const dict = enc.getEncryptionDictionary();

      // Assert
      expect(dict.R).toBe(3);
      expect(dict.V).toBe(2);
    });

    it('should produce different dictionaries for 40-bit vs 128-bit versions', () => {
      // Arrange
      const enc13 = createEncryption({ userPassword: 'test' }, '1.3');
      const enc14 = createEncryption({ userPassword: 'test' }, '1.4');

      // Act
      const dict13 = enc13.getEncryptionDictionary();
      const dict14 = enc14.getEncryptionDictionary();

      // Assert
      expect(dict13.O).not.toEqual(dict14.O);
      expect(dict13.U).not.toEqual(dict14.U);
      expect(dict13.R).not.toBe(dict14.R);
      expect(dict13.V).not.toBe(dict14.V);
    });
  });

  // =====================
  // Password Handling
  // =====================
  describe('Password Handling', () => {
    it('should use user password as owner password when owner is not specified', () => {
      // Arrange
      const encUserOnly = createEncryption({ userPassword: 'shared' });
      const encBoth = createEncryption({ userPassword: 'shared', ownerPassword: 'shared' });

      // Act
      const dict1 = encUserOnly.getEncryptionDictionary();
      const dict2 = encBoth.getEncryptionDictionary();

      // Assert
      expect(dict1.O).toEqual(dict2.O);
      expect(dict1.U).toEqual(dict2.U);
    });

    it('should handle empty password', () => {
      // Arrange
      const enc = createEncryption({ userPassword: '' });

      // Act & Assert
      expect(enc.isEnabled()).toBe(false);

      // Should still produce a valid dictionary
      const dict = enc.getEncryptionDictionary();
      expect(dict.O.length).toBe(32);
      expect(dict.U.length).toBe(32);
    });

    it('should handle very long password (truncated to 32 bytes per PDF spec)', () => {
      // Arrange
      const longPassword = 'a'.repeat(100);
      const enc = createEncryption({ userPassword: longPassword });

      // Act
      const dict = enc.getEncryptionDictionary();

      // Assert
      expect(dict.O.length).toBe(32);
      expect(dict.U.length).toBe(32);
    });

    it('should handle special characters in password', () => {
      // Arrange
      const enc = createEncryption({ userPassword: '!@#$%^&*()_+-=[]{}|;:,.<>?' });

      // Act
      const dict = enc.getEncryptionDictionary();

      // Assert
      expect(dict.O.length).toBe(32);
      expect(dict.U.length).toBe(32);
    });

    it('should handle password that is exactly 32 bytes', () => {
      // Arrange
      const password32 = 'a'.repeat(32);
      const enc = createEncryption({ userPassword: password32 });

      // Act
      const dict = enc.getEncryptionDictionary();

      // Assert
      expect(dict.O.length).toBe(32);
      expect(dict.U.length).toBe(32);
    });

    it('should produce different results for different document IDs', () => {
      // Arrange
      const security: PDFSecurityOptions = { userPassword: 'test' };
      const enc1 = createEncryption(security, '1.4', 'aaaa0000bbbb1111cccc2222dddd3333');
      const enc2 = createEncryption(security, '1.4', '11112222333344445555666677778888');

      // Act
      const dict1 = enc1.getEncryptionDictionary();
      const dict2 = enc2.getEncryptionDictionary();

      // Assert
      // O depends only on passwords, not document ID
      expect(dict1.O).toEqual(dict2.O);
      // U depends on document ID
      expect(dict1.U).not.toEqual(dict2.U);
    });
  });

  // =====================
  // Edge Cases
  // =====================
  describe('Edge Cases', () => {
    it('should encrypt an empty buffer', () => {
      // Arrange
      const enc = createEncryption({ userPassword: 'test' });
      enc.getEncryptionDictionary();
      const data = Buffer.alloc(0);

      // Act
      const encrypted = enc.encryptData(data, 1, 0);

      // Assert
      expect(encrypted.length).toBe(0);
    });

    it('should encrypt a large buffer', () => {
      // Arrange
      const enc = createEncryption({ userPassword: 'test' });
      enc.getEncryptionDictionary();
      const data = Buffer.alloc(10000, 0x42);

      // Act
      const encrypted = enc.encryptData(data, 1, 0);

      // Assert
      expect(encrypted.length).toBe(10000);
      expect(encrypted).not.toEqual(data);
    });

    it('should encrypt a single byte buffer', () => {
      // Arrange
      const enc = createEncryption({ userPassword: 'test' });
      enc.getEncryptionDictionary();
      const data = Buffer.from([0xff]);

      // Act
      const encrypted = enc.encryptData(data, 1, 0);

      // Assert
      expect(encrypted.length).toBe(1);
    });
  });
});
