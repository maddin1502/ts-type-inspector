import { TypeInspector } from '@/inspector.js';
import { describe, expect, test } from 'vitest';

const ti = new TypeInspector();

describe('prop / props', () => {
  test('object: prop returns the exact validator that was defined', () => {
    expect.assertions(3);
    const nameValidator = ti.string;
    const ageValidator = ti.number;
    const validator = ti.object({ name: nameValidator, age: ageValidator });

    expect(validator.prop('name')).toBe(nameValidator);
    expect(validator.prop('age')).toBe(ageValidator);
    expect(validator.props()).toEqual({
      name: nameValidator,
      age: ageValidator
    });
  });

  test('object: prop resolves to the precise validator type', () => {
    expect.assertions(2);
    const validator = ti.object({ name: ti.string, age: ti.number });

    const nameValidator = validator.prop('name');
    const ageValidator = validator.prop('age');

    expect(nameValidator.shortest(2).isValid('x')).toBe(false);
    expect(ageValidator.positive.isValid(-1)).toBe(false);
  });

  test('partial: prop returns the defined validator or undefined', () => {
    expect.assertions(2);
    const nameValidator = ti.string;
    const validator = ti.partial<{ name: string; age: number }>({
      name: nameValidator
    });

    expect(validator.prop('name')).toBe(nameValidator);
    expect(validator.prop('age')).toBeUndefined();
  });

  test('the retrieved validator is the real instance (usable after narrowing)', () => {
    expect.assertions(2);
    const nameValidator = ti.string.shortest(2);
    const validator = ti.object({ name: nameValidator });

    expect(validator.prop('name')).toBe(nameValidator);
    expect(nameValidator.isValid('x')).toBe(false);
  });
});
