import { generateXMPMetadata, getSRGBColorProfile } from '../../src/utils/xmp';
import { resetConfig } from '../../src/config/defaults';
import type { DocumentInfo } from '../../src/types';

describe('XMP Metadata', () => {
  beforeEach(() => {
    resetConfig();
  });

  describe('generateXMPMetadata', () => {
    it('should generate valid XMP packet structure with minimal info', () => {
      // Arrange
      const info: DocumentInfo = {};

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).toContain('<?xpacket begin=');
      expect(xmp).toContain('<x:xmpmeta xmlns:x="adobe:ns:meta/">');
      expect(xmp).toContain('<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">');
      expect(xmp).toContain('</rdf:RDF>');
      expect(xmp).toContain('</x:xmpmeta>');
      expect(xmp).toContain('<?xpacket end="w"?>');
    });

    it('should use default creator and producer when not provided', () => {
      // Arrange
      const info: DocumentInfo = {};

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).toContain('<xmp:CreatorTool>PDFStudio</xmp:CreatorTool>');
      expect(xmp).toContain('<pdf:Producer>PDFStudio PDF Library</pdf:Producer>');
    });

    it('should include title in Dublin Core metadata', () => {
      // Arrange
      const info: DocumentInfo = { Title: 'My Document' };

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).toContain('<dc:title>');
      expect(xmp).toContain('<rdf:li xml:lang="x-default">My Document</rdf:li>');
      expect(xmp).toContain('</dc:title>');
    });

    it('should include author in Dublin Core metadata', () => {
      // Arrange
      const info: DocumentInfo = { Author: 'John Doe' };

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).toContain('<dc:creator>');
      expect(xmp).toContain('<rdf:Seq>');
      expect(xmp).toContain('<rdf:li>John Doe</rdf:li>');
    });

    it('should include subject as dc:description', () => {
      // Arrange
      const info: DocumentInfo = { Subject: 'Test Subject' };

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).toContain('<dc:description>');
      expect(xmp).toContain('<rdf:li xml:lang="x-default">Test Subject</rdf:li>');
    });

    it('should include keywords in PDF metadata', () => {
      // Arrange
      const info: DocumentInfo = { Keywords: 'pdf, test, metadata' };

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).toContain('<pdf:Keywords>pdf, test, metadata</pdf:Keywords>');
    });

    it('should not include keywords element when Keywords is not set', () => {
      // Arrange
      const info: DocumentInfo = {};

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).not.toContain('<pdf:Keywords>');
    });

    it('should use custom creator and producer when provided', () => {
      // Arrange
      const info: DocumentInfo = {
        Creator: 'Custom App',
        Producer: 'Custom Producer v1.0',
      };

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).toContain('<xmp:CreatorTool>Custom App</xmp:CreatorTool>');
      expect(xmp).toContain('<pdf:Producer>Custom Producer v1.0</pdf:Producer>');
    });

    it('should format dates using provided CreationDate and ModDate', () => {
      // Arrange
      const info: DocumentInfo = {
        CreationDate: new Date(2024, 0, 15, 10, 30, 0),
        ModDate: new Date(2024, 5, 20, 14, 45, 0),
      };

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).toContain('<xmp:CreateDate>2024-01-15T10:30:00');
      expect(xmp).toContain('<xmp:ModifyDate>2024-06-20T14:45:00');
    });

    it('should escape XML special characters in text fields', () => {
      // Arrange
      const info: DocumentInfo = {
        Title: 'Title with <special> & "characters"',
        Author: "Author's name",
      };

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).toContain('Title with &lt;special&gt; &amp; &quot;characters&quot;');
      expect(xmp).toContain('Author&apos;s name');
    });

    it('should generate full metadata with all fields populated', () => {
      // Arrange
      const info: DocumentInfo = {
        Title: 'Full Document',
        Author: 'Jane Smith',
        Subject: 'Complete metadata test',
        Keywords: 'full, test',
        Creator: 'TestApp',
        Producer: 'TestProducer',
        CreationDate: new Date(2024, 0, 1),
        ModDate: new Date(2024, 0, 2),
      };

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).toContain('Full Document');
      expect(xmp).toContain('Jane Smith');
      expect(xmp).toContain('Complete metadata test');
      expect(xmp).toContain('full, test');
      expect(xmp).toContain('TestApp');
      expect(xmp).toContain('TestProducer');
    });

    it('should not include dc:title when Title is not set', () => {
      // Arrange
      const info: DocumentInfo = {};

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).not.toContain('<dc:title>');
    });

    it('should not include dc:creator when Author is not set', () => {
      // Arrange
      const info: DocumentInfo = {};

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).not.toContain('<dc:creator>');
    });

    it('should not include dc:description when neither Subject nor description is set', () => {
      // Arrange
      const info: DocumentInfo = {};

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).not.toContain('<dc:description>');
    });
  });

  describe('generateXMPMetadata with PDF/A conformance', () => {
    it('should include PDF/A-1b identification', () => {
      // Arrange
      const info: DocumentInfo = { Title: 'PDF/A Doc' };

      // Act
      const xmp = generateXMPMetadata(info, 'PDF/A-1b');

      // Assert
      expect(xmp).toContain('xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/"');
      expect(xmp).toContain('<pdfaid:part>1</pdfaid:part>');
      expect(xmp).toContain('<pdfaid:conformance>B</pdfaid:conformance>');
    });

    it('should include PDF/A-2b identification', () => {
      // Arrange
      const info: DocumentInfo = {};

      // Act
      const xmp = generateXMPMetadata(info, 'PDF/A-2b');

      // Assert
      expect(xmp).toContain('<pdfaid:part>2</pdfaid:part>');
      expect(xmp).toContain('<pdfaid:conformance>B</pdfaid:conformance>');
    });

    it('should include PDF/A-3b identification', () => {
      // Arrange
      const info: DocumentInfo = {};

      // Act
      const xmp = generateXMPMetadata(info, 'PDF/A-3b');

      // Assert
      expect(xmp).toContain('<pdfaid:part>3</pdfaid:part>');
      expect(xmp).toContain('<pdfaid:conformance>B</pdfaid:conformance>');
    });

    it('should not include PDF/A namespace when no conformance level', () => {
      // Arrange
      const info: DocumentInfo = {};

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).not.toContain('pdfaid');
    });
  });

  describe('generateXMPMetadata with extended metadata', () => {
    it('should include language metadata', () => {
      // Arrange
      const info: DocumentInfo = {
        extendedMetadata: { language: 'en-US' },
      };

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).toContain('<dc:language>');
      expect(xmp).toContain('<rdf:Bag>');
      expect(xmp).toContain('<rdf:li>en-US</rdf:li>');
    });

    it('should include rights metadata', () => {
      // Arrange
      const info: DocumentInfo = {
        extendedMetadata: { rights: 'Copyright 2024 Acme Corp' },
      };

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).toContain('<xmpRights:Marked>True</xmpRights:Marked>');
      expect(xmp).toContain(
        '<xmpRights:WebStatement>Copyright 2024 Acme Corp</xmpRights:WebStatement>'
      );
      expect(xmp).toContain('<dc:rights>');
    });

    it('should include identifier metadata', () => {
      // Arrange
      const info: DocumentInfo = {
        extendedMetadata: { identifier: 'ISBN-978-3-16-148410-0' },
      };

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).toContain('<dc:identifier>ISBN-978-3-16-148410-0</dc:identifier>');
    });

    it('should include source metadata', () => {
      // Arrange
      const info: DocumentInfo = {
        extendedMetadata: { source: 'Original Document v1' },
      };

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).toContain('<dc:source>Original Document v1</dc:source>');
    });

    it('should include relation metadata', () => {
      // Arrange
      const info: DocumentInfo = {
        extendedMetadata: { relation: 'Related Document' },
      };

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).toContain('<dc:relation>Related Document</dc:relation>');
    });

    it('should include coverage metadata', () => {
      // Arrange
      const info: DocumentInfo = {
        extendedMetadata: { coverage: 'Worldwide' },
      };

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).toContain('<dc:coverage>Worldwide</dc:coverage>');
    });

    it('should include category as dc:subject', () => {
      // Arrange
      const info: DocumentInfo = {
        extendedMetadata: { category: 'Technical Documentation' },
      };

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).toContain('<dc:subject>');
      expect(xmp).toContain('<rdf:li>Technical Documentation</rdf:li>');
    });

    it('should include contentType as dc:format', () => {
      // Arrange
      const info: DocumentInfo = {
        extendedMetadata: { contentType: 'application/pdf' },
      };

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).toContain('<dc:format>application/pdf</dc:format>');
    });

    it('should prefer extended description over subject for dc:description', () => {
      // Arrange
      const info: DocumentInfo = {
        Subject: 'Subject Text',
        extendedMetadata: { description: 'Extended Description' },
      };

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).toContain('<rdf:li xml:lang="x-default">Extended Description</rdf:li>');
      expect(xmp).not.toContain('Subject Text');
    });

    it('should include PDF/X version metadata', () => {
      // Arrange
      const info: DocumentInfo = {
        extendedMetadata: { gts_pdfxVersion: 'PDF/X-1a:2003' },
      };

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).toContain('<pdf:GTS_PDFXVersion>PDF/X-1a:2003</pdf:GTS_PDFXVersion>');
    });

    it('should include PDF/X conformance metadata', () => {
      // Arrange
      const info: DocumentInfo = {
        extendedMetadata: { gts_pdfxConformance: 'PDF/X-1a:2003' },
      };

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).toContain('<pdf:GTS_PDFXConformance>PDF/X-1a:2003</pdf:GTS_PDFXConformance>');
    });

    it('should include trapped metadata', () => {
      // Arrange
      const info: DocumentInfo = {
        extendedMetadata: { trapped: 'True' },
      };

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).toContain('<pdf:Trapped>True</pdf:Trapped>');
    });

    it('should include custom metadata with string values', () => {
      // Arrange
      const info: DocumentInfo = {
        extendedMetadata: {
          custom: { department: 'Engineering', project: 'Alpha' },
        },
      };

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).toContain('xmlns:pdfstudio="http://pdfstudio.ai/ns/1.0/"');
      expect(xmp).toContain('<pdfstudio:department>Engineering</pdfstudio:department>');
      expect(xmp).toContain('<pdfstudio:project>Alpha</pdfstudio:project>');
    });

    it('should include custom metadata with boolean values', () => {
      // Arrange
      const info: DocumentInfo = {
        extendedMetadata: {
          custom: { approved: true, draft: false },
        },
      };

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).toContain('<pdfstudio:approved>True</pdfstudio:approved>');
      expect(xmp).toContain('<pdfstudio:draft>False</pdfstudio:draft>');
    });

    it('should include custom metadata with numeric values', () => {
      // Arrange
      const info: DocumentInfo = {
        extendedMetadata: {
          custom: { version: 3, priority: 1 },
        },
      };

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).toContain('<pdfstudio:version>3</pdfstudio:version>');
      expect(xmp).toContain('<pdfstudio:priority>1</pdfstudio:priority>');
    });

    it('should include custom metadata with Date values formatted as XMP dates', () => {
      // Arrange
      const reviewDate = new Date(2024, 6, 15, 9, 0, 0);
      const info: DocumentInfo = {
        extendedMetadata: {
          custom: { reviewDate },
        },
      };

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).toContain('<pdfstudio:reviewDate>2024-07-15T09:00:00');
    });

    it('should not include pdfstudio namespace when no custom metadata', () => {
      // Arrange
      const info: DocumentInfo = {
        extendedMetadata: { language: 'en-US' },
      };

      // Act
      const xmp = generateXMPMetadata(info);

      // Assert
      expect(xmp).not.toContain('xmlns:pdfstudio');
    });
  });

  describe('getSRGBColorProfile', () => {
    it('should return a Buffer', () => {
      // Arrange & Act
      const profile = getSRGBColorProfile();

      // Assert
      expect(Buffer.isBuffer(profile)).toBe(true);
    });

    it('should contain sRGB profile identifier', () => {
      // Arrange & Act
      const profile = getSRGBColorProfile();

      // Assert
      expect(profile.toString('utf-8')).toBe('sRGB IEC61966-2.1');
    });
  });
});
