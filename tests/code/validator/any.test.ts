import { TypeInspector } from '@/inspector.js';
import { DefaultAnyValidator } from '@/validator/any.js';
import { describe, expect, test } from 'vitest';

class AnyValidatorWithParams extends DefaultAnyValidator<{ test?: string }> {
  constructor() {
    super();
    this.custom((value_, params_) => {
      if (params_?.test !== undefined && params_.test !== value_) {
        return 'failure';
      }
    });
  }
}

const ti = new TypeInspector();

describe(DefaultAnyValidator, () => {
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

  test('params', () => {
    expect.assertions(8);
    const avwp = new AnyValidatorWithParams();
    expect(avwp.isValid('42')).toBe(true);
    expect(() => avwp.validate('42')).not.toThrow();
    expect(avwp.isValid('42', {})).toBe(true);
    expect(() => avwp.validate('42', {})).not.toThrow();
    expect(avwp.isValid('42', { test: '42' })).toBe(true);
    expect(() => avwp.validate('42', { test: '42' })).not.toThrow();
    expect(avwp.isValid('24', { test: '42' })).toBe(false);
    expect(() => avwp.validate('24', { test: '42' })).toThrow();
  });
});
