import { TilingPatternOptions } from '../../types'

/**
 * PatternManager - Manages tiling patterns in PDF documents
 *
 * Responsibilities:
 * - Register tiling patterns
 * - Generate unique pattern IDs
 * - Prevent duplicate pattern definitions
 * - Hash patterns for deduplication
 */
export class PatternManager {
  private patterns: Map<string, { id: number; pattern: TilingPatternOptions }> = new Map()
  private nextPatternId: number = 1

  /**
   * Register a pattern and get its ID
   * If the pattern is already registered (same hash), returns existing ID
   */
  registerPattern(hash: string, pattern: TilingPatternOptions): number {
    const existing = this.patterns.get(hash)
    if (existing) {
      return existing.id
    }

    const id = this.nextPatternId++
    this.patterns.set(hash, { id, pattern })
    return id
  }

  /**
   * Get pattern by hash
   */
  getPattern(hash: string): { id: number; pattern: TilingPatternOptions } | undefined {
    return this.patterns.get(hash)
  }

  /**
   * Get all registered patterns
   */
  getAllPatterns(): Map<string, { id: number; pattern: TilingPatternOptions }> {
    return this.patterns
  }

  /**
   * Check if a pattern is already registered
   */
  hasPattern(hash: string): boolean {
    return this.patterns.has(hash)
  }

  /**
   * Get the next available pattern ID (for internal use)
   */
  getNextPatternId(): number {
    return this.nextPatternId
  }

  /**
   * Get total number of registered patterns
   */
  getPatternCount(): number {
    return this.patterns.size
  }

  /**
   * Clear all registered patterns (for testing/reset)
   */
  clear(): void {
    this.patterns.clear()
    this.nextPatternId = 1
  }
}
