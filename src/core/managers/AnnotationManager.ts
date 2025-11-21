import { Annotation, Link, FileAttachmentAnnotation } from '../../types'

/**
 * AnnotationManager - Manages PDF annotations, links, and attachments
 *
 * Responsibilities:
 * - Manage PDF annotations (highlights, comments, etc.)
 * - Manage hyperlinks (internal and external)
 * - Manage file attachment annotations
 * - Track annotations per page
 */
export class AnnotationManager {
  private annotations: Annotation[] = []
  private links: Link[] = []
  private attachmentAnnotations: FileAttachmentAnnotation[] = []

  /**
   * Add an annotation
   */
  addAnnotation(annotation: Annotation): void {
    this.annotations.push(annotation)
  }

  /**
   * Add a hyperlink
   */
  addLink(link: Link): void {
    this.links.push(link)
  }

  /**
   * Add a file attachment annotation
   */
  addAttachmentAnnotation(attachment: FileAttachmentAnnotation): void {
    this.attachmentAnnotations.push(attachment)
  }

  /**
   * Get all annotations
   */
  getAllAnnotations(): Annotation[] {
    return this.annotations
  }

  /**
   * Get all links
   */
  getAllLinks(): Link[] {
    return this.links
  }

  /**
   * Get all attachment annotations
   */
  getAllAttachmentAnnotations(): FileAttachmentAnnotation[] {
    return this.attachmentAnnotations
  }

  /**
   * Get annotations for a specific page
   */
  getAnnotationsForPage(pageIndex: number): Annotation[] {
    return this.annotations.filter(a => a.page === pageIndex)
  }

  /**
   * Get links for a specific page
   */
  getLinksForPage(pageIndex: number): Link[] {
    return this.links.filter(l => l.page === pageIndex || (l.page === undefined && pageIndex === 0))
  }

  /**
   * Get attachment annotations for a specific page
   */
  getAttachmentAnnotationsForPage(pageIndex: number): FileAttachmentAnnotation[] {
    return this.attachmentAnnotations.filter(a => a.page === pageIndex || (a.page === undefined && pageIndex === 0))
  }

  /**
   * Get total count of all annotation types
   */
  getTotalCount(): number {
    return this.annotations.length + this.links.length + this.attachmentAnnotations.length
  }

  /**
   * Clear all annotations (for testing/reset)
   */
  clear(): void {
    this.annotations = []
    this.links = []
    this.attachmentAnnotations = []
  }
}
