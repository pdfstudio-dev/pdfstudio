import {
  validateFiniteNumber,
  validatePositiveNumber,
  validateNonNegativeNumber,
  validateCoordinates,
  validateDimensions,
  validateRectangle,
  validateNonEmptyArray,
  validateRange,
  validateRGBColor,
  validateOpacity,
  validateFontSize,
  validateLineWidth,
  validatePageIndex,
  validateRotation,
} from '../../src/utils/validation';
import { ValidationError, PageError } from '../../src/errors';

describe('Validation Functions', () => {
  describe('validateFiniteNumber', () => {
    it('should accept finite numbers', () => {
      expect(() => validateFiniteNumber(0, 'value')).not.toThrow();
      expect(() => validateFiniteNumber(100, 'value')).not.toThrow();
      expect(() => validateFiniteNumber(-50, 'value')).not.toThrow();
      expect(() => validateFiniteNumber(3.14, 'value')).not.toThrow();
    });

    it('should reject NaN', () => {
      expect(() => validateFiniteNumber(NaN, 'value')).toThrow(ValidationError);
      expect(() => validateFiniteNumber(NaN, 'value')).toThrow(/must be a finite number/);
    });

    it('should reject Infinity', () => {
      expect(() => validateFiniteNumber(Infinity, 'value')).toThrow(ValidationError);
      expect(() => validateFiniteNumber(-Infinity, 'value')).toThrow(ValidationError);
    });

    it('should reject zero when allowZero is false', () => {
      expect(() => validateFiniteNumber(0, 'value', false)).toThrow(ValidationError);
      expect(() => validateFiniteNumber(0, 'value', false)).toThrow(/cannot be zero/);
    });

    it('should reject negative when allowNegative is false', () => {
      expect(() => validateFiniteNumber(-5, 'value', true, false)).toThrow(ValidationError);
      expect(() => validateFiniteNumber(-5, 'value', true, false)).toThrow(/must be non-negative/);
    });
  });

  describe('validatePositiveNumber', () => {
    it('should accept positive numbers', () => {
      expect(() => validatePositiveNumber(1, 'value')).not.toThrow();
      expect(() => validatePositiveNumber(100, 'value')).not.toThrow();
      expect(() => validatePositiveNumber(0.001, 'value')).not.toThrow();
    });

    it('should reject zero', () => {
      expect(() => validatePositiveNumber(0, 'value')).toThrow(ValidationError);
      expect(() => validatePositiveNumber(0, 'value')).toThrow(/cannot be zero/);
    });

    it('should reject negative numbers', () => {
      expect(() => validatePositiveNumber(-1, 'value')).toThrow(ValidationError);
    });

    it('should reject NaN and Infinity', () => {
      expect(() => validatePositiveNumber(NaN, 'value')).toThrow(ValidationError);
      expect(() => validatePositiveNumber(Infinity, 'value')).toThrow(ValidationError);
    });
  });

  describe('validateNonNegativeNumber', () => {
    it('should accept non-negative numbers', () => {
      expect(() => validateNonNegativeNumber(0, 'value')).not.toThrow();
      expect(() => validateNonNegativeNumber(100, 'value')).not.toThrow();
      expect(() => validateNonNegativeNumber(0.5, 'value')).not.toThrow();
    });

    it('should reject negative numbers', () => {
      expect(() => validateNonNegativeNumber(-1, 'value')).toThrow(ValidationError);
      expect(() => validateNonNegativeNumber(-0.1, 'value')).toThrow(/must be non-negative/);
    });

    it('should reject NaN and Infinity', () => {
      expect(() => validateNonNegativeNumber(NaN, 'value')).toThrow(ValidationError);
      expect(() => validateNonNegativeNumber(Infinity, 'value')).toThrow(ValidationError);
    });
  });

  describe('validateCoordinates', () => {
    it('should accept valid coordinates', () => {
      expect(() => validateCoordinates(0, 0)).not.toThrow();
      expect(() => validateCoordinates(100, 200)).not.toThrow();
      expect(() => validateCoordinates(-10, -20)).not.toThrow();
    });

    it('should reject NaN coordinates', () => {
      expect(() => validateCoordinates(NaN, 100)).toThrow(ValidationError);
      expect(() => validateCoordinates(100, NaN)).toThrow(ValidationError);
    });

    it('should reject Infinity coordinates', () => {
      expect(() => validateCoordinates(Infinity, 100)).toThrow(ValidationError);
      expect(() => validateCoordinates(100, Infinity)).toThrow(ValidationError);
    });
  });

  describe('validateDimensions', () => {
    it('should accept valid positive dimensions', () => {
      expect(() => validateDimensions(100, 200)).not.toThrow();
      expect(() => validateDimensions(0.1, 0.1)).not.toThrow();
    });

    it('should reject zero dimensions', () => {
      expect(() => validateDimensions(0, 100)).toThrow(ValidationError);
      expect(() => validateDimensions(100, 0)).toThrow(/cannot be zero/);
    });

    it('should reject negative dimensions', () => {
      expect(() => validateDimensions(-100, 200)).toThrow(ValidationError);
      expect(() => validateDimensions(100, -200)).toThrow(/must be non-negative/);
    });

    it('should reject NaN and Infinity', () => {
      expect(() => validateDimensions(NaN, 100)).toThrow(ValidationError);
      expect(() => validateDimensions(100, Infinity)).toThrow(ValidationError);
    });
  });

  describe('validateRectangle', () => {
    it('should accept valid rectangles', () => {
      expect(() => validateRectangle(0, 0, 100, 200)).not.toThrow();
      expect(() => validateRectangle(10, 20, 30, 40)).not.toThrow();
    });

    it('should reject invalid coordinates', () => {
      expect(() => validateRectangle(NaN, 0, 100, 200)).toThrow(ValidationError);
    });

    it('should reject invalid dimensions', () => {
      expect(() => validateRectangle(0, 0, 0, 200)).toThrow(ValidationError);
      expect(() => validateRectangle(0, 0, 100, -200)).toThrow(ValidationError);
    });
  });

  describe('validateNonEmptyArray', () => {
    it('should accept non-empty arrays', () => {
      expect(() => validateNonEmptyArray([1], 'array')).not.toThrow();
      expect(() => validateNonEmptyArray([1, 2, 3], 'array')).not.toThrow();
    });

    it('should reject empty arrays', () => {
      expect(() => validateNonEmptyArray([], 'array')).toThrow(ValidationError);
      expect(() => validateNonEmptyArray([], 'array')).toThrow(/cannot be empty/);
    });
  });

  describe('validateRange', () => {
    it('should accept values in range', () => {
      expect(() => validateRange(0, 0, 1, 'value')).not.toThrow();
      expect(() => validateRange(0.5, 0, 1, 'value')).not.toThrow();
      expect(() => validateRange(1, 0, 1, 'value')).not.toThrow();
    });

    it('should reject values below min', () => {
      expect(() => validateRange(-0.1, 0, 1, 'value')).toThrow(ValidationError);
      expect(() => validateRange(-0.1, 0, 1, 'value')).toThrow(/must be between 0 and 1/);
    });

    it('should reject values above max', () => {
      expect(() => validateRange(1.1, 0, 1, 'value')).toThrow(ValidationError);
      expect(() => validateRange(1.1, 0, 1, 'value')).toThrow(/must be between 0 and 1/);
    });

    it('should reject NaN and Infinity', () => {
      expect(() => validateRange(NaN, 0, 1, 'value')).toThrow(ValidationError);
      expect(() => validateRange(Infinity, 0, 1, 'value')).toThrow(ValidationError);
    });
  });

  describe('validateRGBColor', () => {
    it('should accept valid RGB values', () => {
      expect(() => validateRGBColor(0, 0, 0)).not.toThrow();
      expect(() => validateRGBColor(1, 1, 1)).not.toThrow();
      expect(() => validateRGBColor(0.5, 0.7, 0.9)).not.toThrow();
    });

    it('should reject values outside 0-1 range', () => {
      expect(() => validateRGBColor(-0.1, 0.5, 0.5)).toThrow(ValidationError);
      expect(() => validateRGBColor(0.5, 1.1, 0.5)).toThrow(ValidationError);
      expect(() => validateRGBColor(0.5, 0.5, 2.0)).toThrow(ValidationError);
    });

    it('should reject NaN and Infinity', () => {
      expect(() => validateRGBColor(NaN, 0.5, 0.5)).toThrow(ValidationError);
      expect(() => validateRGBColor(0.5, Infinity, 0.5)).toThrow(ValidationError);
    });
  });

  describe('validateOpacity', () => {
    it('should accept valid opacity values', () => {
      expect(() => validateOpacity(0)).not.toThrow();
      expect(() => validateOpacity(0.5)).not.toThrow();
      expect(() => validateOpacity(1)).not.toThrow();
    });

    it('should reject values outside 0-1 range', () => {
      expect(() => validateOpacity(-0.1)).toThrow(ValidationError);
      expect(() => validateOpacity(1.1)).toThrow(ValidationError);
      expect(() => validateOpacity(-0.1)).toThrow(/must be between 0 and 1/);
    });

    it('should reject NaN and Infinity', () => {
      expect(() => validateOpacity(NaN)).toThrow(ValidationError);
      expect(() => validateOpacity(Infinity)).toThrow(ValidationError);
    });
  });

  describe('validateFontSize', () => {
    it('should accept valid font sizes', () => {
      expect(() => validateFontSize(8)).not.toThrow();
      expect(() => validateFontSize(12)).not.toThrow();
      expect(() => validateFontSize(72)).not.toThrow();
    });

    it('should reject zero and negative sizes', () => {
      expect(() => validateFontSize(0)).toThrow(ValidationError);
      expect(() => validateFontSize(-10)).toThrow(ValidationError);
    });

    it('should reject excessively large sizes', () => {
      expect(() => validateFontSize(1001)).toThrow(ValidationError);
      expect(() => validateFontSize(1001)).toThrow(/is unusually large/);
    });

    it('should reject NaN and Infinity', () => {
      expect(() => validateFontSize(NaN)).toThrow(ValidationError);
      expect(() => validateFontSize(Infinity)).toThrow(ValidationError);
    });
  });

  describe('validateLineWidth', () => {
    it('should accept valid line widths', () => {
      expect(() => validateLineWidth(0)).not.toThrow();
      expect(() => validateLineWidth(1)).not.toThrow();
      expect(() => validateLineWidth(10)).not.toThrow();
    });

    it('should reject negative widths', () => {
      expect(() => validateLineWidth(-1)).toThrow(ValidationError);
      expect(() => validateLineWidth(-1)).toThrow(/must be non-negative/);
    });

    it('should reject NaN and Infinity', () => {
      expect(() => validateLineWidth(NaN)).toThrow(ValidationError);
      expect(() => validateLineWidth(Infinity)).toThrow(ValidationError);
    });
  });

  describe('validatePageIndex', () => {
    it('should accept valid page indices', () => {
      expect(() => validatePageIndex(0, 1)).not.toThrow();
      expect(() => validatePageIndex(5, 10)).not.toThrow();
    });

    it('should reject negative indices', () => {
      expect(() => validatePageIndex(-1, 10)).toThrow(ValidationError);
      expect(() => validatePageIndex(-1, 10)).toThrow(/must be non-negative/);
    });

    it('should reject indices >= page count', () => {
      expect(() => validatePageIndex(10, 10)).toThrow(ValidationError);
      expect(() => validatePageIndex(10, 10)).toThrow(/is out of range/);
    });

    it('should reject NaN and Infinity', () => {
      expect(() => validatePageIndex(NaN, 10)).toThrow(ValidationError);
      expect(() => validatePageIndex(Infinity, 10)).toThrow(ValidationError);
    });
  });

  describe('validateRotation', () => {
    it('should accept valid rotations', () => {
      expect(() => validateRotation(0)).not.toThrow();
      expect(() => validateRotation(90)).not.toThrow();
      expect(() => validateRotation(180)).not.toThrow();
      expect(() => validateRotation(270)).not.toThrow();
    });

    it('should reject invalid rotations', () => {
      expect(() => validateRotation(45)).toThrow(ValidationError);
      expect(() => validateRotation(360)).toThrow(ValidationError);
      expect(() => validateRotation(-90)).toThrow(ValidationError);
      expect(() => validateRotation(45)).toThrow(/must be 0, 90, 180, or 270/);
    });
  });
});
