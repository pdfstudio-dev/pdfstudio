import { AnnotationManager } from '../../../src/core/managers/AnnotationManager'
import { Annotation, Link, FileAttachmentAnnotation } from '../../../src/types'

describe('AnnotationManager', () => {
  let manager: AnnotationManager

  beforeEach(() => {
    manager = new AnnotationManager()
  })

  describe('addAnnotation', () => {
    it('should add an annotation', () => {
      const annotation: Annotation = {
        type: 'text',
        page: 0,
        x: 100,
        y: 200,
        contents: 'Test annotation'
      }

      manager.addAnnotation(annotation)
      expect(manager.getAllAnnotations()).toHaveLength(1)
      expect(manager.getAllAnnotations()[0]).toEqual(annotation)
    })

    it('should add multiple annotations', () => {
      const annot1: Annotation = {
        type: 'text',
        page: 0,
        x: 100,
        y: 200,
        contents: 'Annotation 1'
      }
      const annot2: Annotation = {
        type: 'highlight',
        page: 1,
        quadPoints: [150, 250, 250, 250, 150, 270, 250, 270],
        contents: 'Annotation 2'
      }

      manager.addAnnotation(annot1)
      manager.addAnnotation(annot2)
      expect(manager.getAllAnnotations()).toHaveLength(2)
    })
  })

  describe('addLink', () => {
    it('should add a link', () => {
      const link: Link = {
        type: 'url',
        page: 0,
        x: 100,
        y: 200,
        width: 200,
        height: 30,
        url: 'https://example.com'
      }

      manager.addLink(link)
      expect(manager.getAllLinks()).toHaveLength(1)
      expect(manager.getAllLinks()[0]).toEqual(link)
    })
  })

  describe('addAttachmentAnnotation', () => {
    it('should add attachment annotation', () => {
      const attachment: FileAttachmentAnnotation = {
        page: 0,
        x: 100,
        y: 200,
        name: 'test.pdf',
        file: Buffer.from('test')
      }

      manager.addAttachmentAnnotation(attachment)
      expect(manager.getAllAttachmentAnnotations()).toHaveLength(1)
    })
  })

  describe('getAnnotationsForPage', () => {
    it('should return annotations for specific page', () => {
      const annot1: Annotation = {
        type: 'text',
        page: 0,
        x: 100,
        y: 200,
        contents: 'Page 0'
      }
      const annot2: Annotation = {
        type: 'text',
        page: 1,
        x: 100,
        y: 200,
        contents: 'Page 1'
      }

      manager.addAnnotation(annot1)
      manager.addAnnotation(annot2)

      const page0Annots = manager.getAnnotationsForPage(0)
      const page1Annots = manager.getAnnotationsForPage(1)

      expect(page0Annots).toHaveLength(1)
      expect(page1Annots).toHaveLength(1)
      expect(page0Annots[0].contents).toBe('Page 0')
      expect(page1Annots[0].contents).toBe('Page 1')
    })
  })

  describe('getLinksForPage', () => {
    it('should return links for specific page', () => {
      const link1: Link = {
        type: 'url',
        page: 0,
        x: 100,
        y: 200,
        width: 200,
        height: 30,
        url: 'https://page0.com'
      }
      const link2: Link = {
        type: 'url',
        page: 1,
        x: 100,
        y: 200,
        width: 200,
        height: 30,
        url: 'https://page1.com'
      }

      manager.addLink(link1)
      manager.addLink(link2)

      const page0Links = manager.getLinksForPage(0)
      expect(page0Links).toHaveLength(1)
      expect((page0Links[0] as any).url).toBe('https://page0.com')
    })
  })

  describe('getTotalCount', () => {
    it('should return total count of all annotation types', () => {
      const annotation: Annotation = {
        type: 'text',
        page: 0,
        x: 100,
        y: 200,
        contents: 'Test'
      }
      const link: Link = {
        type: 'url',
        page: 0,
        x: 100,
        y: 200,
        width: 200,
        height: 30,
        url: 'https://example.com'
      }
      const attachment: FileAttachmentAnnotation = {
        page: 0,
        x: 100,
        y: 200,
        name: 'test.pdf',
        file: Buffer.from('test')
      }

      manager.addAnnotation(annotation)
      manager.addLink(link)
      manager.addAttachmentAnnotation(attachment)

      expect(manager.getTotalCount()).toBe(3)
    })
  })

  describe('clear', () => {
    it('should clear all annotations, links, and attachments', () => {
      const annotation: Annotation = {
        type: 'text',
        page: 0,
        x: 100,
        y: 200,
        contents: 'Test'
      }
      manager.addAnnotation(annotation)

      manager.clear()
      expect(manager.getTotalCount()).toBe(0)
      expect(manager.getAllAnnotations()).toHaveLength(0)
      expect(manager.getAllLinks()).toHaveLength(0)
      expect(manager.getAllAttachmentAnnotations()).toHaveLength(0)
    })
  })
})
