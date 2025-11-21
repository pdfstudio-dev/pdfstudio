import { Color } from '../types'

/**
 * Convert hex color to RGB array (0-1 range for PDF)
 */
export function hexToRgb(hex: string): [number, number, number] {
  // Remove # if present
  hex = hex.replace(/^#/, '')

  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  return [r, g, b]
}

/**
 * Normalize color to RGB array (0-1 range for PDF)
 */
export function parseColor(color: Color): [number, number, number] {
  if (typeof color === 'string') {
    return hexToRgb(color)
  }

  // If array, assume 0-255 range and convert to 0-1
  return [
    color[0] / 255,
    color[1] / 255,
    color[2] / 255
  ]
}
