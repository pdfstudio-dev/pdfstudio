import { QRCodeGenerator } from '../../src/qrcode/QRCodeGenerator';
import { ValidationError } from '../../src/errors';

/**
 * Extended tests for QRCodeGenerator to improve coverage.
 * Covers convertDataToText (all data types), calculateOptimalSize (all version thresholds),
 * and generate with version/maskPattern options.
 */
describe('QRCodeGenerator - extended coverage', () => {
  // Helper to access private convertDataToText for direct unit testing
  const convertDataToText = (data: any): string => {
    return (QRCodeGenerator as any).convertDataToText(data);
  };

  describe('convertDataToText - email', () => {
    it('should format email with address only', () => {
      // Arrange
      const data = { email: { address: 'user@example.com' } };

      // Act
      const result = convertDataToText(data);

      // Assert
      expect(result).toBe('mailto:user@example.com');
    });

    it('should format email with subject and body', () => {
      // Arrange
      const data = {
        email: {
          address: 'user@example.com',
          subject: 'Hello World',
          body: 'Body text here',
        },
      };

      // Act
      const result = convertDataToText(data);

      // Assert
      expect(result).toBe(
        `mailto:user@example.com?subject=${encodeURIComponent('Hello World')}&body=${encodeURIComponent('Body text here')}`
      );
    });

    it('should format email with subject only (no body)', () => {
      // Arrange
      const data = {
        email: { address: 'test@test.com', subject: 'Only Subject' },
      };

      // Act
      const result = convertDataToText(data);

      // Assert
      expect(result).toBe(`mailto:test@test.com?subject=${encodeURIComponent('Only Subject')}`);
    });

    it('should format email with body only (no subject)', () => {
      // Arrange
      const data = {
        email: { address: 'test@test.com', body: 'Only Body' },
      };

      // Act
      const result = convertDataToText(data);

      // Assert
      expect(result).toBe(`mailto:test@test.com?body=${encodeURIComponent('Only Body')}`);
    });
  });

  describe('convertDataToText - phone', () => {
    it('should format phone number with tel: prefix', () => {
      // Arrange
      const data = { phone: '+1234567890' };

      // Act
      const result = convertDataToText(data);

      // Assert
      expect(result).toBe('tel:+1234567890');
    });
  });

  describe('convertDataToText - sms', () => {
    it('should format sms with phone only', () => {
      // Arrange
      const data = { sms: { phone: '+1234567890' } };

      // Act
      const result = convertDataToText(data);

      // Assert
      expect(result).toBe('sms:+1234567890');
    });

    it('should format sms with phone and message', () => {
      // Arrange
      const data = { sms: { phone: '+1234567890', message: 'Hi there' } };

      // Act
      const result = convertDataToText(data);

      // Assert
      expect(result).toBe('smsto:+1234567890:Hi there');
    });
  });

  describe('convertDataToText - wifi', () => {
    it('should format wifi with defaults (WPA, not hidden)', () => {
      // Arrange
      const data = { wifi: { ssid: 'MyNetwork', password: 'secret123' } };

      // Act
      const result = convertDataToText(data);

      // Assert
      expect(result).toBe('WIFI:T:WPA;S:MyNetwork;P:secret123;H:false;;');
    });

    it('should format wifi with custom encryption and hidden flag', () => {
      // Arrange
      const data = {
        wifi: {
          ssid: 'HiddenNet',
          password: 'pass',
          encryption: 'WEP' as const,
          hidden: true,
        },
      };

      // Act
      const result = convertDataToText(data);

      // Assert
      expect(result).toBe('WIFI:T:WEP;S:HiddenNet;P:pass;H:true;;');
    });

    it('should format wifi with nopass encryption', () => {
      // Arrange
      const data = {
        wifi: {
          ssid: 'OpenNet',
          password: '',
          encryption: 'nopass' as const,
        },
      };

      // Act
      const result = convertDataToText(data);

      // Assert
      expect(result).toBe('WIFI:T:nopass;S:OpenNet;P:;H:false;;');
    });
  });

  describe('convertDataToText - vcard', () => {
    it('should format minimal vcard with first and last name only', () => {
      // Arrange
      const data = {
        vcard: { firstName: 'John', lastName: 'Doe' },
      };

      // Act
      const result = convertDataToText(data);

      // Assert
      expect(result).toContain('BEGIN:VCARD');
      expect(result).toContain('VERSION:3.0');
      expect(result).toContain('N:Doe;John;;;');
      expect(result).toContain('FN:John Doe');
      expect(result).toContain('END:VCARD');
      expect(result).not.toContain('ORG:');
      expect(result).not.toContain('TITLE:');
      expect(result).not.toContain('TEL:');
      expect(result).not.toContain('EMAIL:');
      expect(result).not.toContain('URL:');
      expect(result).not.toContain('ADR:');
    });

    it('should format full vcard with all fields', () => {
      // Arrange
      const data = {
        vcard: {
          firstName: 'Jane',
          lastName: 'Smith',
          organization: 'Acme Corp',
          title: 'Engineer',
          phone: '+15551234567',
          email: 'jane@acme.com',
          url: 'https://acme.com',
          address: {
            street: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            zip: '62701',
            country: 'USA',
          },
        },
      };

      // Act
      const result = convertDataToText(data);

      // Assert
      expect(result).toContain('N:Smith;Jane;;;');
      expect(result).toContain('FN:Jane Smith');
      expect(result).toContain('ORG:Acme Corp');
      expect(result).toContain('TITLE:Engineer');
      expect(result).toContain('TEL:+15551234567');
      expect(result).toContain('EMAIL:jane@acme.com');
      expect(result).toContain('URL:https://acme.com');
      expect(result).toContain('ADR:;;123 Main St;Springfield;IL;62701;USA');
    });

    it('should format vcard address with partial fields', () => {
      // Arrange
      const data = {
        vcard: {
          firstName: 'Bob',
          lastName: 'Lee',
          address: { city: 'NYC', country: 'US' },
        },
      };

      // Act
      const result = convertDataToText(data);

      // Assert
      // Missing fields default to empty string
      expect(result).toContain('ADR:;;;NYC;;');
    });
  });

  describe('convertDataToText - geo', () => {
    it('should format geo coordinates', () => {
      // Arrange
      const data = { geo: { latitude: 40.7128, longitude: -74.006 } };

      // Act
      const result = convertDataToText(data);

      // Assert
      expect(result).toBe('geo:40.7128,-74.006');
    });
  });

  describe('convertDataToText - event', () => {
    it('should format event with title and startDate only', () => {
      // Arrange
      const startDate = new Date(2025, 5, 15, 10, 30, 0); // June 15, 2025 10:30
      const data = { event: { title: 'Meeting', startDate } };

      // Act
      const result = convertDataToText(data);

      // Assert
      expect(result).toContain('BEGIN:VEVENT');
      expect(result).toContain('SUMMARY:Meeting');
      expect(result).toContain('DTSTART:20250615T103000');
      expect(result).toContain('END:VEVENT');
      expect(result).not.toContain('DTEND:');
      expect(result).not.toContain('LOCATION:');
      expect(result).not.toContain('DESCRIPTION:');
    });

    it('should format event with all optional fields', () => {
      // Arrange
      const startDate = new Date(2025, 0, 1, 9, 0, 0); // Jan 1, 2025 09:00
      const endDate = new Date(2025, 0, 1, 17, 0, 0); // Jan 1, 2025 17:00
      const data = {
        event: {
          title: 'Conference',
          location: 'Room 42',
          startDate,
          endDate,
          description: 'Annual meeting',
        },
      };

      // Act
      const result = convertDataToText(data);

      // Assert
      expect(result).toContain('SUMMARY:Conference');
      expect(result).toContain('LOCATION:Room 42');
      expect(result).toContain('DTSTART:20250101T090000');
      expect(result).toContain('DTEND:20250101T170000');
      expect(result).toContain('DESCRIPTION:Annual meeting');
    });

    it('should format event without endDate but with location and description', () => {
      // Arrange
      const startDate = new Date(2025, 11, 25, 18, 0, 0); // Dec 25, 2025 18:00
      const data = {
        event: {
          title: 'Party',
          location: 'Home',
          startDate,
          description: 'Holiday celebration',
        },
      };

      // Act
      const result = convertDataToText(data);

      // Assert
      expect(result).toContain('LOCATION:Home');
      expect(result).toContain('DTSTART:20251225T180000');
      expect(result).not.toContain('DTEND:');
      expect(result).toContain('DESCRIPTION:Holiday celebration');
    });
  });

  describe('convertDataToText - string passthrough', () => {
    it('should return a plain string as-is', () => {
      // Arrange
      const data = 'https://example.com';

      // Act
      const result = convertDataToText(data);

      // Assert
      expect(result).toBe('https://example.com');
    });
  });

  describe('convertDataToText - text field', () => {
    it('should return text field value', () => {
      // Arrange
      const data = { text: 'Hello plain text' };

      // Act
      const result = convertDataToText(data);

      // Assert
      expect(result).toBe('Hello plain text');
    });
  });

  describe('convertDataToText - invalid data', () => {
    it('should throw ValidationError for empty object', () => {
      // Arrange
      const data = {};

      // Act & Assert
      expect(() => convertDataToText(data)).toThrow(ValidationError);
      expect(() => convertDataToText(data)).toThrow('No valid QR code data provided');
    });

    it('should throw ValidationError for object with no recognized fields', () => {
      // Arrange
      const data = { unknownField: 'value' };

      // Act & Assert
      expect(() => convertDataToText(data)).toThrow(ValidationError);
    });
  });

  describe('calculateOptimalSize - version thresholds', () => {
    it('should return version 1 for short data (<=25 chars)', () => {
      // Arrange
      const data = 'a'.repeat(10); // 10 chars -> version 1

      // Act
      const result = QRCodeGenerator.calculateOptimalSize(data, 5);

      // Assert
      expect(result).toBe(10); // version 1 * 10 = 10
    });

    it('should return version 2 for data >25 chars', () => {
      // Arrange
      const data = 'a'.repeat(26);

      // Act
      const result = QRCodeGenerator.calculateOptimalSize(data, 5);

      // Assert
      expect(result).toBe(20); // version 2 * 10
    });

    it('should return version 3 for data >47 chars', () => {
      // Arrange
      const data = 'a'.repeat(48);

      // Act
      const result = QRCodeGenerator.calculateOptimalSize(data, 5);

      // Assert
      expect(result).toBe(30); // version 3 * 10
    });

    it('should return version 4 for data >77 chars', () => {
      // Arrange
      const data = 'a'.repeat(78);

      // Act
      const result = QRCodeGenerator.calculateOptimalSize(data, 5);

      // Assert
      expect(result).toBe(40); // version 4 * 10
    });

    it('should return version 5 for data >114 chars', () => {
      // Arrange
      const data = 'a'.repeat(115);

      // Act
      const result = QRCodeGenerator.calculateOptimalSize(data, 5);

      // Assert
      expect(result).toBe(50); // version 5 * 10
    });

    it('should return version 10 for data >154 chars', () => {
      // Arrange
      const data = 'a'.repeat(155);

      // Act
      const result = QRCodeGenerator.calculateOptimalSize(data, 5);

      // Assert
      expect(result).toBe(100); // version 10 * 10
    });

    it('should return version 15 for data >300 chars', () => {
      // Arrange
      const data = 'a'.repeat(301);

      // Act
      const result = QRCodeGenerator.calculateOptimalSize(data, 5);

      // Assert
      expect(result).toBe(150); // version 15 * 10
    });

    it('should return version 20 for data >600 chars', () => {
      // Arrange
      const data = 'a'.repeat(601);

      // Act
      const result = QRCodeGenerator.calculateOptimalSize(data, 5);

      // Assert
      expect(result).toBe(200); // version 20 * 10
    });

    it('should respect targetSize when it exceeds version-based size', () => {
      // Arrange
      const data = 'a'.repeat(10); // version 1 -> 10px
      const targetSize = 250;

      // Act
      const result = QRCodeGenerator.calculateOptimalSize(data, targetSize);

      // Assert
      expect(result).toBe(250); // targetSize wins via Math.max
    });
  });

  describe('generate - with maskPattern option', () => {
    it('should generate QR code with maskPattern 0', async () => {
      // Arrange & Act
      const buffer = await QRCodeGenerator.generate({
        data: 'mask test 0',
        x: 0,
        y: 0,
        maskPattern: 0,
      });

      // Assert
      expect(Buffer.isBuffer(buffer)).toBe(true);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('should generate QR code with maskPattern 7', async () => {
      // Arrange & Act
      const buffer = await QRCodeGenerator.generate({
        data: 'mask test 7',
        x: 0,
        y: 0,
        maskPattern: 7,
      });

      // Assert
      expect(Buffer.isBuffer(buffer)).toBe(true);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('should ignore maskPattern outside valid range (negative)', async () => {
      // Arrange & Act
      const buffer = await QRCodeGenerator.generate({
        data: 'mask test invalid',
        x: 0,
        y: 0,
        maskPattern: -1,
      });

      // Assert - should still generate successfully (maskPattern ignored)
      expect(Buffer.isBuffer(buffer)).toBe(true);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('should ignore maskPattern outside valid range (>7)', async () => {
      // Arrange & Act
      const buffer = await QRCodeGenerator.generate({
        data: 'mask test out of range',
        x: 0,
        y: 0,
        maskPattern: 8,
      });

      // Assert
      expect(Buffer.isBuffer(buffer)).toBe(true);
      expect(buffer.length).toBeGreaterThan(0);
    });
  });

  describe('generate - with version option', () => {
    it('should generate QR code with explicit version', async () => {
      // Arrange & Act
      const buffer = await QRCodeGenerator.generate({
        data: 'version test',
        x: 0,
        y: 0,
        version: 5,
      });

      // Assert
      expect(Buffer.isBuffer(buffer)).toBe(true);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('should generate QR code with higher version', async () => {
      // Arrange & Act
      const buffer = await QRCodeGenerator.generate({
        data: 'high version',
        x: 0,
        y: 0,
        version: 10,
      });

      // Assert
      expect(Buffer.isBuffer(buffer)).toBe(true);
      expect(buffer.length).toBeGreaterThan(0);
    });
  });

  describe('generate - data types via public API', () => {
    it('should generate QR code for email data', async () => {
      // Arrange & Act
      const buffer = await QRCodeGenerator.generate({
        data: { email: { address: 'test@example.com', subject: 'Hi' } },
        x: 0,
        y: 0,
      });

      // Assert
      expect(Buffer.isBuffer(buffer)).toBe(true);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('should generate QR code for phone data', async () => {
      // Arrange & Act
      const buffer = await QRCodeGenerator.generate({
        data: { phone: '+15551234567' },
        x: 0,
        y: 0,
      });

      // Assert
      expect(Buffer.isBuffer(buffer)).toBe(true);
    });

    it('should generate QR code for sms data with message', async () => {
      // Arrange & Act
      const buffer = await QRCodeGenerator.generate({
        data: { sms: { phone: '+15551234567', message: 'Hello' } },
        x: 0,
        y: 0,
      });

      // Assert
      expect(Buffer.isBuffer(buffer)).toBe(true);
    });

    it('should generate QR code for wifi data', async () => {
      // Arrange & Act
      const buffer = await QRCodeGenerator.generate({
        data: { wifi: { ssid: 'TestNet', password: 'pass123' } },
        x: 0,
        y: 0,
      });

      // Assert
      expect(Buffer.isBuffer(buffer)).toBe(true);
    });

    it('should generate QR code for vcard data', async () => {
      // Arrange & Act
      const buffer = await QRCodeGenerator.generate({
        data: {
          vcard: {
            firstName: 'John',
            lastName: 'Doe',
            organization: 'Test Inc',
            phone: '+1555000',
            email: 'john@test.com',
          },
        },
        x: 0,
        y: 0,
      });

      // Assert
      expect(Buffer.isBuffer(buffer)).toBe(true);
    });

    it('should generate QR code for geo data', async () => {
      // Arrange & Act
      const buffer = await QRCodeGenerator.generate({
        data: { geo: { latitude: 51.5074, longitude: -0.1278 } },
        x: 0,
        y: 0,
      });

      // Assert
      expect(Buffer.isBuffer(buffer)).toBe(true);
    });

    it('should generate QR code for event data', async () => {
      // Arrange & Act
      const buffer = await QRCodeGenerator.generate({
        data: {
          event: {
            title: 'Test Event',
            startDate: new Date(2025, 6, 1, 10, 0, 0),
            endDate: new Date(2025, 6, 1, 12, 0, 0),
            location: 'Office',
            description: 'A test event',
          },
        },
        x: 0,
        y: 0,
      });

      // Assert
      expect(Buffer.isBuffer(buffer)).toBe(true);
    });

    it('should generate QR code for text data object', async () => {
      // Arrange & Act
      const buffer = await QRCodeGenerator.generate({
        data: { text: 'Plain text content' },
        x: 0,
        y: 0,
      });

      // Assert
      expect(Buffer.isBuffer(buffer)).toBe(true);
    });
  });

  describe('generate - with custom colors and options', () => {
    it('should accept custom foreground and background colors', async () => {
      // Arrange & Act
      const buffer = await QRCodeGenerator.generate({
        data: 'color test',
        x: 0,
        y: 0,
        foregroundColor: '#FF0000',
        backgroundColor: '#00FF00',
      });

      // Assert
      expect(Buffer.isBuffer(buffer)).toBe(true);
    });

    it('should accept custom error correction level', async () => {
      // Arrange & Act
      const buffer = await QRCodeGenerator.generate({
        data: 'ecc test',
        x: 0,
        y: 0,
        errorCorrectionLevel: 'H',
      });

      // Assert
      expect(Buffer.isBuffer(buffer)).toBe(true);
    });

    it('should accept custom margin', async () => {
      // Arrange & Act
      const buffer = await QRCodeGenerator.generate({
        data: 'margin test',
        x: 0,
        y: 0,
        margin: 0,
      });

      // Assert
      expect(Buffer.isBuffer(buffer)).toBe(true);
    });

    it('should accept custom size', async () => {
      // Arrange & Act
      const buffer = await QRCodeGenerator.generate({
        data: 'size test',
        x: 0,
        y: 0,
        size: 200,
      });

      // Assert
      expect(Buffer.isBuffer(buffer)).toBe(true);
    });
  });
});
