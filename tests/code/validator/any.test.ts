import { describe, expect, test } from 'vitest';
import { TypeInspector } from '../../../src/inspector';
import { AnyValidator } from '../../../src/validator/any';

const ti = new TypeInspector();

describe(AnyValidator.name, () => {
  test('isValid - success', () => {
    expect.assertions(10);
    expect(ti.any.isValid(undefined)).toBe(true);
    expect(ti.any.isValid({})).toBe(true);
    expect(ti.any.isValid(null)).toBe(true);
    expect(ti.any.isValid([])).toBe(true);
    expect(ti.any.isValid(42)).toBe(true);
    expect(ti.any.isValid('hello')).toBe(true);
    expect(ti.any.isValid(() => true)).toBe(true);
    expect(ti.any.isValid(true)).toBe(true);
    expect(ti.any.isValid('')).toBe(true);
    expect(ti.any.isValid(NaN)).toBe(true);
  });

  test('isValid - incorrect conditions', () => {
    expect.assertions(4);
    expect(ti.any.notNullish.isValid(undefined)).toBe(false);
    expect(ti.any.notNullish.isValid(null)).toBe(false);
    expect(ti.any.notFalsy.isValid('')).toBe(false);
    expect(ti.any.notFalsy.isValid(NaN)).toBe(false);
  });
});
