/**
 * Input validation utilities
 * Provides consistent validation across the library
 */

import { ValidationError } from '../errors/PDFErrors'

/**
 * Validates that a number is finite (not NaN, not Infinity)
 */
export function validateFiniteNumber(
  value: number,
  paramName: string,
  allowZero: boolean = true,
  allowNegative: boolean = true
): void {
  if (!Number.isFinite(value)) {
    throw new ValidationError(
      `${paramName} must be a finite number, got: ${value}`,
      paramName,
      value
    )
  }

  if (!allowZero && value === 0) {
    throw new ValidationError(
      `${paramName} cannot be zero`,
      paramName,
      value
    )
  }

  if (!allowNegative && value < 0) {
    throw new ValidationError(
      `${paramName} must be non-negative, got: ${value}`,
      paramName,
      value
    )
  }
}

/**
 * Validates that a number is positive (> 0)
 */
export function validatePositiveNumber(value: number, paramName: string): void {
  validateFiniteNumber(value, paramName, false, false)
}

/**
 * Validates that a number is non-negative (>= 0)
 */
export function validateNonNegativeNumber(value: number, paramName: string): void {
  validateFiniteNumber(value, paramName, true, false)
}

/**
 * Validates coordinates (x, y)
 */
export function validateCoordinates(x: number, y: number): void {
  validateFiniteNumber(x, 'x')
  validateFiniteNumber(y, 'y')
}

/**
 * Validates dimensions (width, height) - must be positive
 */
export function validateDimensions(width: number, height: number): void {
  validatePositiveNumber(width, 'width')
  validatePositiveNumber(height, 'height')
}

/**
 * Validates a rectangle (x, y, width, height)
 */
export function validateRectangle(
  x: number,
  y: number,
  width: number,
  height: number
): void {
  validateCoordinates(x, y)
  validateDimensions(width, height)
}

/**
 * Validates that an array is not empty
 */
export function validateNonEmptyArray<T>(
  array: T[],
  paramName: string
): void {
  if (!Array.isArray(array)) {
    throw new ValidationError(
      `${paramName} must be an array, got: ${typeof array}`,
      paramName,
      array
    )
  }

  if (array.length === 0) {
    throw new ValidationError(
      `${paramName} cannot be empty`,
      paramName,
      array
    )
  }
}

/**
 * Validates that a value is within a range
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  paramName: string
): void {
  validateFiniteNumber(value, paramName)

  if (value < min || value > max) {
    throw new ValidationError(
      `${paramName} must be between ${min} and ${max}, got: ${value}`,
      paramName,
      value
    )
  }
}

/**
 * Validates RGB color components (0-1 range)
 */
export function validateRGBColor(r: number, g: number, b: number): void {
  validateRange(r, 0, 1, 'red')
  validateRange(g, 0, 1, 'green')
  validateRange(b, 0, 1, 'blue')
}

/**
 * Validates opacity (0-1 range)
 */
export function validateOpacity(opacity: number): void {
  validateRange(opacity, 0, 1, 'opacity')
}

/**
 * Validates that a string is not empty
 */
export function validateNonEmptyString(value: string, paramName: string): void {
  if (typeof value !== 'string') {
    throw new ValidationError(
      `${paramName} must be a string, got: ${typeof value}`,
      paramName,
      value
    )
  }

  if (value.trim().length === 0) {
    throw new ValidationError(
      `${paramName} cannot be empty`,
      paramName,
      value
    )
  }
}

/**
 * Validates page index
 */
export function validatePageIndex(
  pageIndex: number,
  totalPages: number
): void {
  validateFiniteNumber(pageIndex, 'pageIndex', true, false)

  if (!Number.isInteger(pageIndex)) {
    throw new ValidationError(
      `Page index must be an integer, got: ${pageIndex}`,
      'pageIndex',
      pageIndex
    )
  }

  if (pageIndex < 0 || pageIndex >= totalPages) {
    throw new ValidationError(
      `Page index ${pageIndex} is out of range. Document has ${totalPages} pages (valid indices: 0-${totalPages - 1})`,
      'pageIndex',
      pageIndex
    )
  }
}

/**
 * Validates rotation angle (must be 0, 90, 180, or 270)
 */
export function validateRotation(rotation: number): void {
  const validRotations = [0, 90, 180, 270]
  if (!validRotations.includes(rotation)) {
    throw new ValidationError(
      `Rotation must be 0, 90, 180, or 270 degrees, got: ${rotation}`,
      'rotation',
      rotation
    )
  }
}

/**
 * Validates font size (must be positive)
 */
export function validateFontSize(fontSize: number): void {
  validatePositiveNumber(fontSize, 'fontSize')

  // Reasonable font size range (1-1000 points)
  if (fontSize > 1000) {
    throw new ValidationError(
      `Font size ${fontSize} is unusually large (max recommended: 1000pt)`,
      'fontSize',
      fontSize
    )
  }
}

/**
 * Validates line width (must be non-negative)
 */
export function validateLineWidth(lineWidth: number): void {
  validateNonNegativeNumber(lineWidth, 'lineWidth')

  // Reasonable line width range (0-1000 points)
  if (lineWidth > 1000) {
    throw new ValidationError(
      `Line width ${lineWidth} is unusually large (max recommended: 1000pt)`,
      'lineWidth',
      lineWidth
    )
  }
}
