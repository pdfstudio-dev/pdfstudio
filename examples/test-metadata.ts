import { PDFDocument } from '../src/core/PDFDocument'
import * as path from 'path'
import * as fs from 'fs'

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'output')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

/**
 * Example 1: Basic metadata (without XMP)
 */
function example1() {
  console.log('Generating Example 1: Basic metadata...')

  const doc = new PDFDocument({
    info: {
      Title: 'Basic Metadata Example',
      Author: 'John Doe',
      Subject: 'PDF Metadata Demonstration',
      Keywords: 'pdf, metadata, example',
      Creator: 'PDFStudio Examples'
    }
  })

  doc.text('Basic Metadata Example', 100, 750, 24)
  doc.text('This PDF has basic metadata fields:', 100, 720, 12)
  doc.text('- Title: Basic Metadata Example', 120, 700, 11)
  doc.text('- Author: John Doe', 120, 680, 11)
  doc.text('- Subject: PDF Metadata Demonstration', 120, 660, 11)
  doc.text('- Keywords: pdf, metadata, example', 120, 640, 11)

  doc.text('View Properties in your PDF viewer to see metadata.', 100, 600, 11)

  doc.save(path.join(outputDir, 'metadata-1-basic.pdf'))
  console.log('  > Saved: metadata-1-basic.pdf')
}

/**
 * Example 2: XMP metadata with Dublin Core
 */
function example2() {
  console.log('Generating Example 2: XMP metadata with Dublin Core...')

  const doc = new PDFDocument({
    info: {
      Title: 'XMP Metadata Example',
      Author: 'Jane Smith',
      Subject: 'Advanced Document Metadata',
      Keywords: 'xmp, dublin core, metadata'
    }
  })

  // Enable XMP metadata stream
  doc.enableXMPMetadata()

  // Set extended metadata (Dublin Core)
  doc.setExtendedMetadata({
    description: 'This document demonstrates XMP metadata with Dublin Core elements',
    language: 'en-US',
    rights: 'Copyright 2024 PDFStudio. All rights reserved.',
    category: 'Technical Documentation',
    contentType: 'application/pdf',
    identifier: 'DOC-2024-001'
  })

  doc.text('XMP Metadata with Dublin Core', 100, 750, 24)
  doc.text('This PDF includes XMP metadata stream with:', 100, 720, 12)

  doc.text('Dublin Core Metadata:', 100, 690, 14)
  doc.text('- Description: Extended document description', 120, 670, 11)
  doc.text('- Language: en-US', 120, 650, 11)
  doc.text('- Rights: Copyright information', 120, 630, 11)
  doc.text('- Category: Technical Documentation', 120, 610, 11)
  doc.text('- Content Type: application/pdf', 120, 590, 11)
  doc.text('- Identifier: DOC-2024-001', 120, 570, 11)

  doc.text('Use a metadata viewer to see full XMP data.', 100, 530, 11)

  doc.save(path.join(outputDir, 'metadata-2-xmp-dublin-core.pdf'))
  console.log('  > Saved: metadata-2-xmp-dublin-core.pdf')
}

/**
 * Example 3: Custom metadata properties
 */
function example3() {
  console.log('Generating Example 3: Custom metadata properties...')

  const doc = new PDFDocument({
    info: {
      Title: 'Custom Metadata Properties',
      Author: 'Engineering Team',
      Subject: 'Project Documentation'
    }
  })

  // Enable XMP and add custom properties
  doc.enableXMPMetadata()
    .setExtendedMetadata({
      description: 'Internal project documentation with custom metadata',
      language: 'en-US',
      custom: {
        department: 'Engineering',
        projectCode: 'PROJ-2024-123',
        version: '2.1.0',
        reviewedBy: 'Technical Lead',
        approvalDate: new Date('2024-01-15'),
        confidential: true,
        buildNumber: 42
      }
    })

  doc.text('Custom Metadata Properties', 100, 750, 24)
  doc.text('This PDF includes custom metadata properties:', 100, 720, 12)

  doc.text('Custom Properties:', 100, 690, 14)
  doc.text('- department: Engineering', 120, 670, 11)
  doc.text('- projectCode: PROJ-2024-123', 120, 650, 11)
  doc.text('- version: 2.1.0', 120, 630, 11)
  doc.text('- reviewedBy: Technical Lead', 120, 610, 11)
  doc.text('- approvalDate: 2024-01-15', 120, 590, 11)
  doc.text('- confidential: true', 120, 570, 11)
  doc.text('- buildNumber: 42', 120, 550, 11)

  doc.text('Custom properties are stored in XMP under pdfstudio namespace.', 100, 510, 11)

  doc.save(path.join(outputDir, 'metadata-3-custom-properties.pdf'))
  console.log('  > Saved: metadata-3-custom-properties.pdf')
}

/**
 * Example 4: Complete metadata (all fields)
 */
function example4() {
  console.log('Generating Example 4: Complete metadata...')

  const doc = new PDFDocument({
    info: {
      Title: 'Complete Metadata Example',
      Author: 'Dr. Sarah Johnson',
      Subject: 'Comprehensive Metadata Demonstration',
      Keywords: 'metadata, xmp, dublin core, pdf, complete',
      Creator: 'PDFStudio Advanced Examples'
    }
  })

  // Enable XMP with all extended metadata
  doc.enableXMPMetadata()
    .setExtendedMetadata({
      // Dublin Core
      description: 'A comprehensive example demonstrating all available metadata fields in PDFStudio',
      language: 'en-US',
      rights: 'Copyright 2024 PDFStudio Technologies Inc. Licensed under MIT License.',
      category: 'Examples and Documentation',
      contentType: 'application/pdf',
      identifier: 'ISBN-978-3-16-148410-0',
      source: 'PDFStudio Documentation Project',
      relation: 'Part of PDFStudio Examples Suite',
      coverage: 'Global',

      // PDF-specific
      trapped: 'False',

      // Custom properties
      custom: {
        organization: 'PDFStudio Technologies Inc.',
        division: 'Research & Development',
        projectName: 'Metadata Enhancement',
        documentType: 'Technical Example',
        revision: '1.2.3',
        status: 'Released',
        priority: 'High',
        tags: 'example,metadata,complete',
        lastReviewedBy: 'Quality Assurance Team',
        lastReviewDate: new Date('2024-11-15'),
        isPublic: true,
        pageCount: 1,
        estimatedReadingTime: 5
      }
    })

  doc.text('Complete Metadata Example', 100, 750, 24)
  doc.text('This PDF demonstrates all available metadata features:', 100, 720, 12)

  doc.text('Standard Info Dictionary:', 100, 690, 14)
  doc.text('✓ Title, Author, Subject, Keywords, Creator', 120, 670, 11)

  doc.text('Dublin Core Metadata:', 100, 640, 14)
  doc.text('✓ Description, Language, Rights, Category', 120, 620, 11)
  doc.text('✓ Content Type, Identifier, Source, Relation', 120, 600, 11)
  doc.text('✓ Coverage', 120, 580, 11)

  doc.text('PDF-Specific Metadata:', 100, 550, 14)
  doc.text('✓ Trapped status', 120, 530, 11)

  doc.text('Custom Properties (13 fields):', 100, 500, 14)
  doc.text('✓ Organization, Division, Project Name', 120, 480, 11)
  doc.text('✓ Document Type, Revision, Status, Priority', 120, 460, 11)
  doc.text('✓ Tags, Review Information, Dates', 120, 440, 11)
  doc.text('✓ Boolean flags, Numeric values', 120, 420, 11)

  doc.text('Use exiftool or similar tools to extract all metadata:', 100, 380, 11)
  doc.text('$ exiftool metadata-4-complete.pdf', 120, 360, 10)

  doc.save(path.join(outputDir, 'metadata-4-complete.pdf'))
  console.log('  > Saved: metadata-4-complete.pdf')
}

/**
 * Example 5: Updating metadata dynamically
 */
function example5() {
  console.log('Generating Example 5: Updating metadata dynamically...')

  const doc = new PDFDocument({
    info: {
      Title: 'Initial Title',
      Author: 'Initial Author'
    }
  })

  doc.enableXMPMetadata()

  doc.text('Dynamic Metadata Updates', 100, 750, 24)
  doc.text('Page 1: Initial metadata', 100, 720, 14)

  // Update metadata after first page
  doc.updateInfo({
    Title: 'Updated Title',
    Author: 'Updated Author',
    Subject: 'Dynamically Updated Subject',
    Keywords: 'dynamic, update, metadata'
  })

  doc.setExtendedMetadata({
    description: 'Metadata was updated after creating the first page',
    custom: {
      updateCount: 1,
      lastUpdateDate: new Date()
    }
  })

  doc.addPage()
  doc.text('Dynamic Metadata Updates', 100, 750, 24)
  doc.text('Page 2: Metadata has been updated', 100, 720, 14)

  doc.text('The following fields were updated:', 100, 690, 12)
  doc.text('- Title: [Initial Title] becomes [Updated Title]', 120, 670, 11)
  doc.text('- Author: [Initial Author] becomes [Updated Author]', 120, 650, 11)
  doc.text('- Subject: Added dynamically', 120, 630, 11)
  doc.text('- Keywords: Added dynamically', 120, 610, 11)
  doc.text('- Extended metadata: Added custom update tracking', 120, 590, 11)

  // Update again
  doc.updateInfo({
    Keywords: 'dynamic, update, metadata, final'
  })

  doc.setExtendedMetadata({
    custom: {
      updateCount: 2,
      lastUpdateDate: new Date(),
      finalVersion: true
    }
  })

  doc.save(path.join(outputDir, 'metadata-5-dynamic-updates.pdf'))
  console.log('  > Saved: metadata-5-dynamic-updates.pdf')
}

/**
 * Example 6: Multilingual metadata
 */
function example6() {
  console.log('Generating Example 6: Multilingual metadata...')

  const doc = new PDFDocument({
    info: {
      Title: 'Multilingual Document',
      Author: 'International Team',
      Subject: 'Internationalization Example',
      Keywords: 'multilingual, i18n, international'
    }
  })

  doc.enableXMPMetadata()
    .setExtendedMetadata({
      description: 'This document demonstrates metadata in multiple languages',
      language: 'en-US',
      rights: '© 2024 All rights reserved',
      custom: {
        titleEN: 'Multilingual Document',
        titleES: 'Documento Multilingüe',
        titleFR: 'Document Multilingue',
        titleDE: 'Mehrsprachiges Dokument',
        region: 'Europe',
        supportedLanguages: 'en,es,fr,de'
      }
    })

  doc.text('Multilingual Metadata Example', 100, 750, 24)
  doc.text('This document includes metadata in multiple languages:', 100, 720, 12)

  doc.text('Language-Specific Fields:', 100, 690, 14)
  doc.text('• Spanish (es-ES): Description and rights in Spanish', 120, 670, 11)
  doc.text('• English: Title translations in custom properties', 120, 650, 11)
  doc.text('• French: Titre en français', 120, 630, 11)
  doc.text('• German: Titel auf Deutsch', 120, 610, 11)

  doc.text('Custom Properties:', 100, 580, 14)
  doc.text('- titleEN: Multilingual Document', 120, 560, 11)
  doc.text('- titleES: Documento Multilingüe', 120, 540, 11)
  doc.text('- titleFR: Document Multilingue', 120, 520, 11)
  doc.text('- titleDE: Mehrsprachiges Dokument', 120, 500, 11)

  doc.save(path.join(outputDir, 'metadata-6-multilingual.pdf'))
  console.log('  > Saved: metadata-6-multilingual.pdf')
}

/**
 * Example 7: Copyright and rights management
 */
function example7() {
  console.log('Generating Example 7: Copyright and rights management...')

  const doc = new PDFDocument({
    info: {
      Title: 'Copyrighted Document',
      Author: 'Content Creator LLC',
      Subject: 'Rights Management Example',
      Keywords: 'copyright, rights, legal, licensing'
    }
  })

  doc.enableXMPMetadata()
    .setExtendedMetadata({
      description: 'Example document demonstrating copyright and rights management metadata',
      language: 'en-US',
      rights: 'Copyright © 2024 Content Creator LLC. All rights reserved. This document may not be reproduced without written permission.',
      custom: {
        licenseType: 'Proprietary',
        licenseURL: 'https://example.com/license',
        copyrightYear: 2024,
        copyrightHolder: 'Content Creator LLC',
        usageRights: 'View Only',
        attributionRequired: true,
        commercialUse: false,
        derivativeWorks: false,
        distributionAllowed: false
      }
    })

  doc.text('Copyright & Rights Management', 100, 750, 24)
  doc.text('This document demonstrates rights management metadata:', 100, 720, 12)

  doc.text('Copyright Information:', 100, 690, 14)
  doc.text('© 2024 Content Creator LLC', 120, 670, 11)
  doc.text('All rights reserved', 120, 650, 11)

  doc.text('License Terms:', 100, 620, 14)
  doc.text('✗ Commercial use prohibited', 120, 600, 11)
  doc.text('✗ Derivative works prohibited', 120, 580, 11)
  doc.text('✗ Distribution prohibited', 120, 560, 11)
  doc.text('✓ Attribution required', 120, 540, 11)
  doc.text('License: Proprietary', 120, 520, 11)

  doc.text('This information is embedded in XMP metadata', 100, 480, 11)
  doc.text('and can be read by rights management systems.', 100, 460, 11)

  doc.save(path.join(outputDir, 'metadata-7-copyright.pdf'))
  console.log('  > Saved: metadata-7-copyright.pdf')
}

// Run all examples
console.log('\n=== PDFStudio Metadata Examples ===\n')

example1()
example2()
example3()
example4()
example5()
example6()
example7()

console.log('\n=== All metadata examples generated successfully! ===')
console.log(`Output directory: ${outputDir}`)
console.log('\nTo view XMP metadata, use:')
console.log('  exiftool examples/output/metadata-*.pdf')
console.log('  or')
console.log('  strings examples/output/metadata-2-xmp-dublin-core.pdf | grep -A 50 "<?xpacket"\n')
