import { describe, expect, test } from 'vitest';
import { TypeInspector } from '../../../src/inspector.js';
import { DictionaryValidator } from '../../../src/validator/dictionary.js';

const ti = new TypeInspector();

describe(DictionaryValidator.name, () => {
  test('isValid - success', () => {
    expect.assertions(2);
    expect(ti.dictionary(ti.boolean).isValid({ test: true })).toBe(true);
    expect(
      ti.dictionary(ti.boolean).isValid({
        test: true,
        test2: false
      })
    ).toBe(true);
  });

  test('isValid - failure', () => {
    expect.assertions(3);
    expect(ti.dictionary(ti.boolean).isValid({ test: 42 })).toBe(false);
    expect(
      ti.dictionary(ti.boolean).isValid({
        test: true,
        test2: 42
      })
    ).toBe(false);
    expect(ti.dictionary(ti.boolean).isValid(undefined)).toBe(false);
  });

  test('isValid - correct conditions', () => {
    expect.assertions(2);
    expect(
      ti
        .dictionary(ti.boolean)
        .keys(ti.string.length(4))
        .isValid({ test: true })
    ).toBe(true);
    expect(
      ti
        .dictionary(ti.boolean)
        .keys(ti.union(ti.strict('test'), ti.strict('test2')))
        .isValid({
          test: true,
          test2: false
        })
    ).toBe(true);
  });

  test('isValid - incorrect conditions', () => {
    expect.assertions(2);
    expect(
      ti
        .dictionary(ti.boolean)
        .keys(ti.string.length(3))
        .isValid({ test: true })
    ).toBe(false);
    expect(
      ti
        .dictionary(ti.boolean)
        .keys(ti.union(ti.strict('test'), ti.strict('test2')))
        .isValid({
          test2: true,
          test3: false
        })
    ).toBe(false);
  });
});
