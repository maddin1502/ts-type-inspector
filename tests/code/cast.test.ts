import {
  castToBigint,
  castToBoolean,
  castToDate,
  castToJson,
  castToNumber,
  castToString
} from '@/cast.js';
import { isValidationError } from '@/error.js';
import { TypeInspector } from '@/inspector.js';
import type { Validator } from '@/types.js';
import { DefaultStringValidator } from '@/validator/string.js';
import { describe, expect, test } from 'vitest';

const ti = new TypeInspector();

/**
 * A hand-written custom validator (as shown in the README): a string validator
 * with an additional `mySpecialCheck` condition (value has to be all digits).
 */
class MySpecialStringValidator extends DefaultStringValidator {
  public get mySpecialCheck(): this {
    return this.setupCondition((value_) => {
      if (!/^\d+$/.test(value_)) {
        this.throwValidationError('string is not all digits');
      }
    });
  }
}

describe('cast - caster functions', () => {
  test('castToString', () => {
    expect(castToString('abc')).toBe('abc');
    expect(castToString(42)).toBe('42');
    expect(castToString(42n)).toBe('42');
    expect(castToString(true)).toBe('true');
    expect(() => castToString(Infinity)).toThrow();
    expect(() => castToString(NaN)).toThrow();
    expect(() => castToString({})).toThrow();
    expect(() => castToString(null)).toThrow();
  });

  test('castToNumber', () => {
    expect(castToNumber(42)).toBe(42);
    expect(castToNumber('3.14')).toBe(3.14);
    expect(castToNumber('  10  ')).toBe(10);
    expect(castToNumber(10n)).toBe(10);
    expect(castToNumber(true)).toBe(1);
    expect(castToNumber(false)).toBe(0);
    expect(() => castToNumber('')).toThrow();
    expect(() => castToNumber('   ')).toThrow();
    expect(() => castToNumber('abc')).toThrow();
    expect(() => castToNumber({})).toThrow();
  });

  test('castToBoolean', () => {
    expect(castToBoolean(true)).toBe(true);
    expect(castToBoolean(false)).toBe(false);
    expect(castToBoolean(1)).toBe(true);
    expect(castToBoolean(0)).toBe(false);
    expect(castToBoolean(1n)).toBe(true);
    expect(castToBoolean(0n)).toBe(false);
    expect(castToBoolean('TRUE')).toBe(true);
    expect(castToBoolean('yes')).toBe(true);
    expect(castToBoolean('1')).toBe(true);
    expect(castToBoolean('False')).toBe(false);
    expect(castToBoolean('no')).toBe(false);
    expect(castToBoolean('0')).toBe(false);
    expect(() => castToBoolean(2)).toThrow();
    expect(() => castToBoolean(2n)).toThrow();
    expect(() => castToBoolean('maybe')).toThrow();
    expect(() => castToBoolean({})).toThrow();
  });

  test('castToBigint', () => {
    expect(castToBigint(42n)).toBe(42n);
    expect(castToBigint(42)).toBe(42n);
    expect(castToBigint('123')).toBe(123n);
    expect(castToBigint(true)).toBe(1n);
    expect(castToBigint(false)).toBe(0n);
    expect(() => castToBigint(3.14)).toThrow();
    expect(() => castToBigint('')).toThrow();
    expect(() => castToBigint('abc')).toThrow();
    expect(() => castToBigint({})).toThrow();
  });

  test('castToDate', () => {
    const date = new Date('2020-01-02T00:00:00.000Z');
    expect(castToDate(date)).toBe(date);
    expect(castToDate('2020-01-02').getTime()).toBe(
      new Date('2020-01-02').getTime()
    );
    expect(castToDate(0).getTime()).toBe(0);
    expect(() => castToDate(new Date('invalid'))).toThrow();
    expect(() => castToDate('not a date')).toThrow();
    expect(() => castToDate({})).toThrow();
  });

  test('castToJson', () => {
    expect(castToJson('{"a":1}')).toStrictEqual({ a: 1 });
    expect(castToJson('[1,2,3]')).toStrictEqual([1, 2, 3]);
    expect(() => castToJson('{invalid}')).toThrow();
    expect(() => castToJson(42)).toThrow();
  });
});

describe('cast - primitive getters via inspector', () => {
  test('asString', () => {
    expect(ti.asString.validate(42)).toBe('42');
    expect(ti.asString.longest(2).isValid(42)).toBe(true);
    expect(ti.asString.longest(1).isValid(42)).toBe(false);
    expect(ti.asString.isValid({})).toBe(false);
  });

  test('asNumber', () => {
    expect(ti.asNumber.validate('42')).toBe(42);
    expect(ti.asNumber.max(50).isValid('42')).toBe(true);
    expect(ti.asNumber.max(50).isValid('99')).toBe(false);
    expect(ti.asNumber.positive.isValid('42')).toBe(true);
    expect(ti.asNumber.isValid('abc')).toBe(false);
  });

  test('asBoolean', () => {
    expect(ti.asBoolean.validate('yes')).toBe(true);
    expect(ti.asBoolean.true.isValid('true')).toBe(true);
    expect(ti.asBoolean.false.isValid('true')).toBe(false);
    expect(ti.asBoolean.isValid('maybe')).toBe(false);
  });

  test('asBigint', () => {
    expect(ti.asBigint.validate('42')).toBe(42n);
    expect(ti.asBigint.max(50n).isValid('42')).toBe(true);
    expect(ti.asBigint.max(50n).isValid('99')).toBe(false);
    expect(ti.asBigint.isValid('abc')).toBe(false);
  });

  test('asDate', () => {
    expect(ti.asDate.validate('2020-01-02').getTime()).toBe(
      new Date('2020-01-02').getTime()
    );
    expect(ti.asDate.earliest('2019-01-01').isValid('2020-01-02')).toBe(true);
    expect(ti.asDate.earliest('2021-01-01').isValid('2020-01-02')).toBe(false);
    expect(ti.asDate.isValid('not a date')).toBe(false);
  });
});

describe('cast - with a custom follow-up validator (call form)', () => {
  test('returns the passed validator instance', () => {
    const mine = ti.number.max(10);
    expect(ti.asNumber(mine)).toBe(mine);
  });

  test('casts, then validates with the custom validator (incl. its conditions)', () => {
    const validator = ti.asNumber(ti.number.max(10));
    expect(validator.validate('5')).toBe(5);
    expect(validator.isValid('50')).toBe(false); // max(10) on the cast value
    expect(validator.isValid('abc')).toBe(false); // cast fails
  });

  test('works for every primitive cast', () => {
    expect(ti.asString(ti.string.length(2)).validate(42)).toBe('42');
    expect(ti.asString(ti.string.length(2)).isValid(5)).toBe(false);
    expect(ti.asBoolean(ti.boolean.true).validate('yes')).toBe(true);
    expect(ti.asBoolean(ti.boolean.true).isValid('no')).toBe(false);
    expect(ti.asBigint(ti.bigint.max(10n)).validate('5')).toBe(5n);
    expect(ti.asBigint(ti.bigint.max(10n)).isValid('50')).toBe(false);
    expect(
      ti.asDate(ti.date.earliest('2019-01-01')).isValid('2020-01-02')
    ).toBe(true);
    expect(
      ti.asDate(ti.date.earliest('2021-01-01')).isValid('2020-01-02')
    ).toBe(false);
  });

  test('chaining continues on the custom validator', () => {
    const validator = ti.asDate(ti.date).earliest('2019-01-01');
    expect(validator.isValid('2020-01-02')).toBe(true);
    expect(validator.isValid('2018-01-02')).toBe(false);
  });

  test('with a hand-written custom validator (README example)', () => {
    // ti.asString(mySpecialStringValidator).mySpecialCheck.length(5)
    const validator = ti
      .asString(new MySpecialStringValidator())
      .mySpecialCheck.length(2);

    // 42 -> "42": all digits (mySpecialCheck) and length 2 -> ok
    expect(validator.validate(42)).toBe('42');
    // true -> "true": not all digits -> custom check fails
    expect(validator.isValid(true)).toBe(false);
    // 5 -> "5": all digits but length 1 -> inherited length(2) fails
    expect(validator.isValid(5)).toBe(false);
    // the custom validator instance is returned (so its members are chainable)
    const mine = new MySpecialStringValidator();
    expect(ti.asString(mine)).toBe(mine);
  });

  test('the call form also works when chained off another validator', () => {
    const validator = ti.string.length(2).asNumber(ti.number.max(50));
    expect(validator.validate('42')).toBe(42);
    expect(validator.isValid('421')).toBe(false); // source length check
    expect(validator.isValid('99')).toBe(false); // target max check
  });

  test('usable inside containers', () => {
    expect(
      ti.object({ v: ti.asString(ti.string.length(2)) }).validate({ v: 42 })
    ).toStrictEqual({ v: '42' });
  });
});

describe('cast - chaining from another validator', () => {
  test('string conditions run before the cast', () => {
    const validator = ti.string.length(2).asNumber.max(50);
    expect(validator.validate('42')).toBe(42);
    // fails the string length check (before casting)
    expect(validator.isValid('421')).toBe(false);
    // passes length but fails the number max
    expect(validator.isValid('99')).toBe(false);
  });

  test('source conditions are validated before the cast happens', () => {
    expect.assertions(4);
    const validator = ti.number.max(100).asString;
    // max(100) passes -> value is cast to string
    expect(validator.validate(50)).toBe('50');
    // max(100) fails BEFORE the cast -> source error, no conversion
    expect(validator.isValid(150)).toBe(false);
    try {
      validator.validate(150);
    } catch (reason) {
      expect(isValidationError(reason)).toBe(true);
      expect((reason as Error).message).toBe('number is greater than maximum');
    }
  });

  test('target conditions are validated after the cast', () => {
    const validator = ti.number.max(100).asString.length(2);
    expect(validator.isValid(50)).toBe(true); // "50" -> length 2
    expect(validator.isValid(5)).toBe(false); // "5"  -> length 1
  });

  test('cast failure produces a validation error', () => {
    expect.assertions(2);
    try {
      ti.string.asNumber.validate('abc');
    } catch (reason) {
      expect(isValidationError(reason)).toBe(true);
      expect((reason as Error).message).toBe('value cannot be cast to number');
    }
  });
});

describe('cast - asType', () => {
  test('with follow-up validator (chaining stays typed)', () => {
    const validator = ti.asType((value_) => Number(value_), ti.number).max(50);
    expect(validator.validate('42')).toBe(42);
    expect(validator.isValid('99')).toBe(false);
  });

  test('without follow-up validator', () => {
    const validator = ti.asType((value_) => BigInt(value_ as string));
    expect(validator.validate('7')).toBe(7n);
  });

  test('caster throwing turns into a validation error', () => {
    const validator = ti.asType((value_) => {
      if (typeof value_ !== 'string') {
        throw new Error('nope');
      }
      return value_.toUpperCase();
    });
    expect(validator.validate('abc')).toBe('ABC');
    expect(validator.isValid(42)).toBe(false);
  });

  test('rejects a non-Default validator as target', () => {
    const fake = {
      validate: (value_: unknown) => value_
    } as unknown as Validator<unknown>;
    expect(() => ti.asType((value_) => value_, fake)).toThrow(
      'cast target must be a Default* validator'
    );
  });
});

describe('cast - asJson', () => {
  test('parses and validates objects', () => {
    const validator = ti.asJson(ti.object({ a: ti.number, b: ti.string }));
    expect(validator.validate('{"a":1,"b":"x"}')).toStrictEqual({
      a: 1,
      b: 'x'
    });
    expect(validator.isValid('{"a":"nope"}')).toBe(false);
  });

  test('parses and validates tuples with chaining', () => {
    const validator = ti.asJson(ti.tuple(ti.number, ti.string)).noOverload;
    expect(validator.validate('[42,"x"]')).toStrictEqual([42, 'x']);
    expect(validator.isValid('[42,"x",true]')).toBe(false);
  });

  test('invalid json fails', () => {
    expect(ti.asJson(ti.object({ a: ti.number })).isValid('{bad}')).toBe(false);
    expect(ti.asJson(ti.object({ a: ti.number })).isValid(42)).toBe(false);
  });
});

describe('cast - value propagation through containers', () => {
  test('object converts and rebuilds', () => {
    const input = { myValue: '42', keep: 'x' };
    const result = ti
      .object({ myValue: ti.asNumber.max(50), keep: ti.string })
      .validate(input);
    expect(result).toStrictEqual({ myValue: 42, keep: 'x' });
    // rebuilt (not the same reference) because a value changed
    expect(result).not.toBe(input);
  });

  test('object keeps the same reference when nothing is cast', () => {
    const input = { a: 1 };
    expect(ti.object({ a: ti.number }).validate(input)).toBe(input);
  });

  test('partial converts (single and multiple properties)', () => {
    expect(
      ti.partial<{ a: number; b: string }>({ a: ti.asNumber }).validate({
        a: '5',
        b: 'untouched'
      })
    ).toStrictEqual({ a: 5, b: 'untouched' });
    // two converted properties -> exercises the "already copied" path
    expect(
      ti
        .partial<{ a: number; b: number }>({ a: ti.asNumber, b: ti.asNumber })
        .validate({ a: '5', b: '6' })
    ).toStrictEqual({ a: 5, b: 6 });
  });

  test('array converts', () => {
    expect(ti.array(ti.asNumber).validate(['1', '2', '3'])).toStrictEqual([
      1, 2, 3
    ]);
  });

  test('array keeps reference when nothing is cast', () => {
    const input = [1, 2, 3];
    expect(ti.array(ti.number).validate(input)).toBe(input);
  });

  test('tuple converts', () => {
    expect(
      ti.tuple(ti.asNumber, ti.string).validate(['42', 'x'])
    ).toStrictEqual([42, 'x']);
    // two converted items -> exercises the "already copied" path
    expect(
      ti.tuple(ti.asNumber, ti.asString).validate(['42', 7])
    ).toStrictEqual([42, '7']);
  });

  test('dictionary converts', () => {
    expect(
      ti.dictionary(ti.asNumber).validate({ a: '1', b: '2' })
    ).toStrictEqual({ a: 1, b: 2 });
  });

  test('map converts keys and values', () => {
    const result = ti
      .map(ti.asNumber, ti.asString)
      .validate(new Map([['1', 5]]));
    expect([...result.entries()]).toStrictEqual([[1, '5']]);
  });

  test('map keeps reference when nothing is cast', () => {
    const input = new Map([['a', 1]]);
    expect(ti.map(ti.string, ti.number).validate(input)).toBe(input);
  });

  test('set converts items', () => {
    const result = ti.set(ti.asNumber).validate(new Set(['1', '2']));
    expect([...result]).toStrictEqual([1, 2]);
  });

  test('set keeps reference when nothing is cast', () => {
    const input = new Set([1, 2]);
    expect(ti.set(ti.number).validate(input)).toBe(input);
  });

  test('union returns the converted value of the matching validator', () => {
    const validator = ti.union(ti.number, ti.asNumber);
    expect(validator.validate(42)).toBe(42);
    expect(validator.validate('42')).toBe(42);
    expect(validator.isValid('abc')).toBe(false);
  });

  test('optional forwards the converted value', () => {
    const validator = ti.optional(ti.asNumber);
    expect(validator.validate(undefined)).toBeUndefined();
    expect(validator.validate('42')).toBe(42);
  });

  test('nested object casts propagate with full property path on error', () => {
    expect.assertions(2);
    const validator = ti.object({
      outer: ti.object({ inner: ti.asNumber.max(10) })
    });
    expect(validator.validate({ outer: { inner: '5' } })).toStrictEqual({
      outer: { inner: 5 }
    });
    try {
      validator.validate({ outer: { inner: '50' } });
    } catch (reason) {
      expect((reason as { propertyPath?: string }).propertyPath).toBe(
        'outer.inner'
      );
    }
  });

  test('object aggregate mode rebuilds on full success', () => {
    expect(
      ti
        .object({ a: ti.asNumber, b: ti.asNumber })
        .aggregate.validate({ a: '1', b: '2' })
    ).toStrictEqual({ a: 1, b: 2 });
  });
});

describe('cast - validOrDefault / validOrFallback return converted value', () => {
  test('validOrDefault', () => {
    expect(ti.asNumber.validOrDefault('42')).toBe(42);
    expect(ti.asNumber.validOrDefault('abc')).toBeUndefined();
  });

  test('validOrFallback', () => {
    expect(ti.asNumber.validOrFallback('42', 0)).toBe(42);
    expect(ti.asNumber.validOrFallback('abc', -1)).toBe(-1);
  });
});
