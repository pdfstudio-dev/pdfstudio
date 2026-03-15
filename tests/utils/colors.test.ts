import { hexToRgb, parseColor } from '../../src/utils/colors';
import { ValidationError } from '../../src/errors';

describe('hexToRgb', () => {
  it('should parse standard hex color', () => {
    const result = hexToRgb('#FF0000');

    expect(result).toEqual([1, 0, 0]);
  });

  it('should parse hex without # prefix', () => {
    const result = hexToRgb('FF0000');

    expect(result).toEqual([1, 0, 0]);
  });

  it('should parse shorthand hex', () => {
    const result = hexToRgb('#F00');

    expect(result).toEqual([1, 0, 0]);
  });

  it('should parse lowercase hex', () => {
    const result = hexToRgb('#ff0000');

    expect(result).toEqual([1, 0, 0]);
  });

  it('should return [0, 0, 0] for #000000', () => {
    const result = hexToRgb('#000000');

    expect(result).toEqual([0, 0, 0]);
  });

  it('should return [1, 1, 1] for #FFFFFF', () => {
    const result = hexToRgb('#FFFFFF');

    expect(result).toEqual([1, 1, 1]);
  });

  it('should throw ValidationError on invalid hex characters', () => {
    expect(() => hexToRgb('#GGGGGG')).toThrow(ValidationError);
  });

  it('should throw ValidationError on wrong length', () => {
    expect(() => hexToRgb('#FF')).toThrow(ValidationError);
  });
});

describe('parseColor', () => {
  it('should parse hex string colors', () => {
    const result = parseColor('#FF0000');

    expect(result).toEqual([1, 0, 0]);
  });

  it('should parse RGB array [255, 0, 0] to [1, 0, 0]', () => {
    const result = parseColor([255, 0, 0]);

    expect(result).toEqual([1, 0, 0]);
  });

  it('should parse [0, 0, 0] to [0, 0, 0]', () => {
    const result = parseColor([0, 0, 0]);

    expect(result).toEqual([0, 0, 0]);
  });

  it('should parse [128, 128, 128] to approximately [0.502, 0.502, 0.502]', () => {
    const result = parseColor([128, 128, 128]);

    expect(result[0]).toBeCloseTo(0.502, 3);
    expect(result[1]).toBeCloseTo(0.502, 3);
    expect(result[2]).toBeCloseTo(0.502, 3);
  });

  it('should throw on RGB values out of range', () => {
    expect(() => parseColor([256, 0, 0])).toThrow(ValidationError);
  });

  it('should throw on negative RGB values', () => {
    expect(() => parseColor([-1, 0, 0])).toThrow(ValidationError);
  });

  it('should throw on NaN values in array', () => {
    expect(() => parseColor([NaN, 0, 0])).toThrow(ValidationError);
  });
});
