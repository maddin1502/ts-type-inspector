import { describe, expect, test } from 'vitest';
import { TypeInspector } from '../../../src/inspector.js';
import { BooleanValidator } from '../../../src/validator/boolean.js';

const ti = new TypeInspector();

describe(BooleanValidator.name, () => {
  test('isValid - success', () => {
    expect.assertions(2);
    expect(ti.boolean.isValid(true)).toBe(true);
    expect(ti.boolean.isValid(false)).toBe(true);
  });

  test('isValid - failure', () => {
    expect.assertions(7);
    expect(ti.boolean.isValid(null)).toBe(false);
    expect(ti.boolean.isValid(undefined)).toBe(false);
    expect(ti.boolean.isValid('42')).toBe(false);
    expect(ti.boolean.isValid(42)).toBe(false);
    expect(ti.boolean.isValid({ oh: 'no' })).toBe(false);
    expect(ti.boolean.isValid(/.*oh.*no:+/)).toBe(false);
    expect(ti.boolean.isValid(() => ({ oh: 'no' }))).toBe(false);
  });

  test('isValid - correct conditions', () => {
    expect.assertions(2);
    expect(ti.boolean.true.isValid(true)).toBe(true);
    expect(ti.boolean.false.isValid(false)).toBe(true);
  });

  test('isValid - incorrect conditions', () => {
    expect.assertions(4);
    expect(ti.boolean.true.isValid(false)).toBe(false);
    expect(ti.boolean.false.isValid(true)).toBe(false);
    expect(ti.boolean.true.false.isValid(false)).toBe(false);
    expect(ti.boolean.true.false.isValid(true)).toBe(false);
  });
});
