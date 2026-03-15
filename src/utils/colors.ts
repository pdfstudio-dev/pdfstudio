import { Color } from '../types';
import { ValidationError } from '../errors';

/**
 * Convert hex color to RGB array (0-1 range for PDF)
 */
export function hexToRgb(hex: string): [number, number, number] {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Expand shorthand (e.g. "F0A" -> "FF00AA")
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
    throw new ValidationError(
      `Invalid hex color: #${hex}. Expected format: #RRGGBB or #RGB`,
      'color',
      hex
    );
  }

  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  return [r, g, b];
}

/**
 * Normalize color to RGB array (0-1 range for PDF)
 */
export function parseColor(color: Color): [number, number, number] {
  if (typeof color === 'string') {
    return hexToRgb(color);
  }

  // Validate RGB array values
  for (let i = 0; i < 3; i++) {
    if (typeof color[i] !== 'number' || isNaN(color[i])) {
      throw new ValidationError('RGB color values must be numbers', 'color', color);
    }
    if (color[i] < 0 || color[i] > 255) {
      throw new ValidationError(`RGB color value ${color[i]} out of range (0-255)`, 'color', color);
    }
  }

  // If array, assume 0-255 range and convert to 0-1
  return [color[0] / 255, color[1] / 255, color[2] / 255];
}
