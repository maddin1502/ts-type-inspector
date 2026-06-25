import { TypeInspector } from '@/inspector.js';
import { DefaultMapValidator } from '@/validator/map.js';
import { describe, expect, test } from 'vitest';

const ti = new TypeInspector();

describe(DefaultMapValidator, () => {
  test('isValid - success', () => {
    expect.assertions(2);
    expect(
      ti.map(ti.string, ti.number).isValid(
        new Map([
          ['a', 1],
          ['b', 2]
        ])
      )
    ).toBe(true);
    // mixed key types exercise the key-trace branches (string/number/symbol)
    expect(
      ti.map(ti.any, ti.number).isValid(
        new Map<unknown, number>([
          ['s', 1],
          [2, 2],
          [Symbol('x'), 3]
        ])
      )
    ).toBe(true);
  });

  test('isValid - failure', () => {
    expect.assertions(5);
    expect(ti.map(ti.string, ti.number).isValid(undefined)).toBe(false);
    expect(ti.map(ti.string, ti.number).isValid({})).toBe(false);
    expect(ti.map(ti.string, ti.number).isValid([])).toBe(false);
    // invalid value (primitive key -> traced)
    expect(
      ti.map(ti.string, ti.number).isValid(new Map([['a', 'nope']]))
    ).toBe(false);
    // invalid key
    expect(
      ti.map(ti.string, ti.number).isValid(new Map([[1, 1]]))
    ).toBe(false);
  });

  test('validate - object key uses no trace', () => {
    expect.assertions(1);
    const objectKeyMap = new Map<unknown, unknown>([[{}, 'not a number']]);
    expect(() => ti.map(ti.any, ti.number).validate(objectKeyMap)).toThrow();
  });
});
