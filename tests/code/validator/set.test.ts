import { TypeInspector } from '@/inspector.js';
import { DefaultSetValidator } from '@/validator/set.js';
import { describe, expect, test } from 'vitest';

const ti = new TypeInspector();

describe(DefaultSetValidator, () => {
  test('isValid - success', () => {
    expect.assertions(2);
    expect(ti.set(ti.number).isValid(new Set([1, 2, 3]))).toBe(true);
    expect(ti.set(ti.string).isValid(new Set(['a', 'b']))).toBe(true);
  });

  test('isValid - failure', () => {
    expect.assertions(4);
    expect(ti.set(ti.number).isValid(undefined)).toBe(false);
    expect(ti.set(ti.number).isValid({})).toBe(false);
    expect(ti.set(ti.number).isValid([1, 2, 3])).toBe(false);
    expect(
      ti.set(ti.number).isValid(new Set<unknown>([1, 'nope', 3]))
    ).toBe(false);
  });

  test('validate - reports item index in path', () => {
    expect.assertions(1);
    expect(() =>
      ti.set(ti.number).validate(new Set<unknown>([1, 'nope']))
    ).toThrow('1');
  });
});
