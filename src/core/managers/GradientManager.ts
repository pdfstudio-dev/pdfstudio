import { Gradient } from '../../types'

/**
 * GradientManager - Manages gradients in PDF documents
 *
 * Responsibilities:
 * - Register linear and radial gradients
 * - Generate unique gradient IDs
 * - Prevent duplicate gradient definitions
 * - Hash gradients for deduplication
 */
export class GradientManager {
  private gradients: Map<string, { id: number; gradient: Gradient }> = new Map()
  private nextGradientId: number = 1

  /**
   * Register a gradient and get its ID
   * If the gradient is already registered (same hash), returns existing ID
   */
  registerGradient(hash: string, gradient: Gradient): number {
    const existing = this.gradients.get(hash)
    if (existing) {
      return existing.id
    }

    const id = this.nextGradientId++
    this.gradients.set(hash, { id, gradient })
    return id
  }

  /**
   * Get gradient by hash
   */
  getGradient(hash: string): { id: number; gradient: Gradient } | undefined {
    return this.gradients.get(hash)
  }

  /**
   * Get all registered gradients
   */
  getAllGradients(): Map<string, { id: number; gradient: Gradient }> {
    return this.gradients
  }

  /**
   * Check if a gradient is already registered
   */
  hasGradient(hash: string): boolean {
    return this.gradients.has(hash)
  }

  /**
   * Get the next available gradient ID (for internal use)
   */
  getNextGradientId(): number {
    return this.nextGradientId
  }

  /**
   * Get total number of registered gradients
   */
  getGradientCount(): number {
    return this.gradients.size
  }

  /**
   * Clear all registered gradients (for testing/reset)
   */
  clear(): void {
    this.gradients.clear()
    this.nextGradientId = 1
  }
}
