import { TypeInspector } from '@/inspector.js';
import { DefaultDictionaryValidator } from '@/validator/dictionary.js';
import { describe, expect, test } from 'vitest';
import { ExtendedValidationParametersValidator } from '../../testTypes.js';

const ti = new TypeInspector();

describe(DefaultDictionaryValidator, () => {
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

  test('extended validation params', () => {
    expect.assertions(8);
    const ddvEvpv = new DefaultDictionaryValidator(
      new ExtendedValidationParametersValidator().extendedFailureCondition
    );
    expect(ddvEvpv.isValid({ hello: 'world' })).toBe(true);
    expect(() => ddvEvpv.validate({ hello: 'world' })).not.toThrow();
    expect(
      ddvEvpv.isValid(
        { hello: 'world' },
        {
          extendedItemValidationParameters: { failOn: 'condition' }
        }
      )
    ).toBe(false);
    expect(() =>
      ddvEvpv.validate(
        { hello: 'world' },
        {
          extendedItemValidationParameters: { failOn: 'condition' }
        }
      )
    ).toThrow('extended failure on condition');
    expect(
      ddvEvpv.isValid(
        { hello: 'world' },
        {
          extendedItemValidationParameters: { failOn: 'custom' }
        }
      )
    ).toBe(false);
    expect(() =>
      ddvEvpv.validate(
        { hello: 'world' },
        {
          extendedItemValidationParameters: { failOn: 'custom' }
        }
      )
    ).toThrow('extended failure on custom');
    expect(
      ddvEvpv.isValid(
        { hello: 'world' },
        {
          extendedItemValidationParameters: { failOn: 'validate' }
        }
      )
    ).toBe(false);
    expect(() =>
      ddvEvpv.validate(
        { hello: 'world' },
        {
          extendedItemValidationParameters: { failOn: 'validate' }
        }
      )
    ).toThrow('extended failure on validate');
  });
});
