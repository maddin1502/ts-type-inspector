import { flattenValidationError } from '@/error.js';
import { TypeInspector } from '@/inspector.js';
import { describe, expect, test } from 'vitest';

const ti = new TypeInspector();

describe('aggregate (collect-all) mode', () => {
  test('object collects all invalid properties', () => {
    expect.assertions(3);
    const validator = ti.object({
      a: ti.string,
      b: ti.number,
      c: ti.boolean
    }).aggregate;
    // a + b invalid, c valid
    expect(validator.isValid({ a: 1, b: 'x', c: true })).toBe(false);
    const error = validator.validationError;
    expect(error?.subErrors?.length).toBe(2);
    expect(
      flattenValidationError(error!)
        .map((entry) => entry.path)
        .sort()
    ).toEqual(['a', 'b']);
  });

  test('partial collects all invalid properties', () => {
    expect.assertions(2);
    const validator = ti.partial({ a: ti.string, b: ti.number }).aggregate;
    expect(validator.isValid({ a: 1, b: 'x' })).toBe(false);
    expect(validator.validationError?.subErrors?.length).toBe(2);
  });

  test('array collects all invalid items', () => {
    expect.assertions(3);
    const validator = ti.array(ti.number).aggregate;
    expect(validator.isValid([1, 'x', 'y'])).toBe(false);
    const error = validator.validationError;
    expect(error?.subErrors?.length).toBe(2);
    expect(flattenValidationError(error!).map((e) => e.path)).toEqual(['1', '2']);
  });

  test('tuple collects all invalid items', () => {
    expect.assertions(2);
    const validator = ti.tuple(ti.string, ti.number).aggregate;
    expect(validator.isValid([1, 'x'])).toBe(false);
    expect(validator.validationError?.subErrors?.length).toBe(2);
  });

  test('dictionary collects all invalid values', () => {
    expect.assertions(2);
    const validator = ti.dictionary(ti.number).aggregate;
    expect(validator.isValid({ a: 'x', b: 'y' })).toBe(false);
    expect(validator.validationError?.subErrors?.length).toBe(2);
  });

  test('map collects all invalid entries', () => {
    expect.assertions(2);
    const validator = ti.map(ti.string, ti.number).aggregate;
    expect(
      validator.isValid(
        new Map([
          ['a', 'x'],
          ['b', 'y']
        ])
      )
    ).toBe(false);
    expect(validator.validationError?.subErrors?.length).toBe(2);
  });

  test('set collects all invalid items', () => {
    expect.assertions(2);
    const validator = ti.set(ti.number).aggregate;
    expect(validator.isValid(new Set<unknown>(['x', 'y']))).toBe(false);
    expect(validator.validationError?.subErrors?.length).toBe(2);
  });

  test('aggregate is a no-op on valid input', () => {
    expect.assertions(1);
    expect(ti.array(ti.number).aggregate.isValid([1, 2, 3])).toBe(true);
  });
});

describe(flattenValidationError, () => {
  test('single leaf error -> one entry without path', () => {
    expect.assertions(1);
    const validator = ti.string;
    validator.isValid(42);
    expect(flattenValidationError(validator.validationError!)).toEqual([
      { path: undefined, message: 'value is not a string' }
    ]);
  });

  test('nested single error -> one entry with full path', () => {
    expect.assertions(1);
    const validator = ti.object({ a: ti.object({ b: ti.string }) });
    validator.isValid({ a: { b: 1 } });
    expect(flattenValidationError(validator.validationError!)).toEqual([
      { path: 'a.b', message: 'value is not a string' }
    ]);
  });
});
