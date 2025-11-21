/**
 * GraphicsStateManager - Manages PDF graphics states (ExtGState)
 *
 * Responsibilities:
 * - Register extended graphics states
 * - Generate unique ExtGState IDs
 * - Track current blend mode and opacity
 * - Prevent duplicate ExtGState definitions
 */
export class GraphicsStateManager {
  private extGStates: Map<string, number> = new Map()
  private nextExtGStateId: number = 1
  private currentBlendMode: string = 'Normal'
  private currentOpacity: number = 1.0

  /**
   * Register an ExtGState and get its ID
   * If the ExtGState is already registered (same hash), returns existing ID
   */
  registerExtGState(hash: string): number {
    const existing = this.extGStates.get(hash)
    if (existing) {
      return existing
    }

    const id = this.nextExtGStateId++
    this.extGStates.set(hash, id)
    return id
  }

  /**
   * Get ExtGState ID by hash
   */
  getExtGState(hash: string): number | undefined {
    return this.extGStates.get(hash)
  }

  /**
   * Get all registered ExtGStates
   */
  getAllExtGStates(): Map<string, number> {
    return this.extGStates
  }

  /**
   * Set current blend mode
   */
  setBlendMode(mode: string): void {
    this.currentBlendMode = mode
  }

  /**
   * Get current blend mode
   */
  getBlendMode(): string {
    return this.currentBlendMode
  }

  /**
   * Set current opacity
   */
  setOpacity(opacity: number): void {
    this.currentOpacity = opacity
  }

  /**
   * Get current opacity
   */
  getOpacity(): number {
    return this.currentOpacity
  }

  /**
   * Check if an ExtGState is already registered
   */
  hasExtGState(hash: string): boolean {
    return this.extGStates.has(hash)
  }

  /**
   * Get the next available ExtGState ID (for internal use)
   */
  getNextExtGStateId(): number {
    return this.nextExtGStateId
  }

  /**
   * Get total number of registered ExtGStates
   */
  getExtGStateCount(): number {
    return this.extGStates.size
  }

  /**
   * Reset blend mode and opacity to defaults
   */
  resetState(): void {
    this.currentBlendMode = 'Normal'
    this.currentOpacity = 1.0
  }

  /**
   * Clear all ExtGStates (for testing/reset)
   */
  clear(): void {
    this.extGStates.clear()
    this.nextExtGStateId = 1
    this.resetState()
  }
}
