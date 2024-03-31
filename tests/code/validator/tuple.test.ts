import { TypeInspector } from '@/inspector.js';
import { TupleValidator } from '@/validator/tuple.js';
import { describe, expect, test } from 'vitest';

const ti = new TypeInspector();

describe(TupleValidator, () => {
  test('isValid - success', () => {
    expect.assertions(3);
    expect(
      ti
        .tuple(
          ti.string,
          ti.number,
          ti.array(ti.boolean),
          ti.union(ti.undefined, ti.date),
          ti.date,
          ti.method,
          ti.strict('world')
        )
        .isValid([
          'hello',
          42,
          [true, false, false, true, false],
          undefined,
          new Date('1970-01-01'),
          () => null,
          'world'
        ])
    ).toBe(true);

    expect(ti.tuple(ti.string).isValid(['hello', 'world'])).toBe(true);
    expect(ti.tuple().isValid(['hello', 'world'])).toBe(true);
  });

  test('isValid - failure', () => {
    expect.assertions(13);
    expect(
      ti
        .tuple(
          ti.string,
          ti.number,
          ti.array(ti.boolean),
          ti.union(ti.undefined, ti.date),
          ti.date,
          ti.method,
          ti.strict('world')
        )
        .isValid([
          42,
          42,
          [true, false, false, true, false],
          undefined,
          new Date('1970-01-01'),
          () => null,
          'world'
        ])
    ).toBe(false);

    expect(
      ti
        .tuple(
          ti.string,
          ti.number,
          ti.array(ti.boolean),
          ti.union(ti.undefined, ti.date),
          ti.date,
          ti.method,
          ti.strict('world')
        )
        .isValid([
          'hello',
          'hello',
          [true, false, false, true, false],
          undefined,
          new Date('1970-01-01'),
          () => null,
          'world'
        ])
    ).toBe(false);

    expect(
      ti
        .tuple(
          ti.string,
          ti.number,
          ti.array(ti.boolean),
          ti.union(ti.undefined, ti.date),
          ti.date,
          ti.method,
          ti.strict('world')
        )
        .isValid([
          'hello',
          42,
          [true, false, false, 1, false],
          undefined,
          new Date('1970-01-01'),
          () => null,
          'world'
        ])
    ).toBe(false);

    expect(
      ti
        .tuple(
          ti.string,
          ti.number,
          ti.array(ti.boolean),
          ti.union(ti.undefined, ti.date),
          ti.date,
          ti.method,
          ti.strict('world')
        )
        .isValid([
          'hello',
          42,
          [true, false, false, true, false],
          null,
          new Date('1970-01-01'),
          () => null,
          'world'
        ])
    ).toBe(false);

    expect(
      ti
        .tuple(
          ti.string,
          ti.number,
          ti.array(ti.boolean),
          ti.union(ti.undefined, ti.date),
          ti.date,
          ti.method,
          ti.strict('world')
        )
        .isValid([
          'hello',
          42,
          [true, false, false, true, false],
          undefined,
          Date.now(),
          () => null,
          'world'
        ])
    ).toBe(false);

    expect(
      ti
        .tuple(
          ti.string,
          ti.number,
          ti.array(ti.boolean),
          ti.union(ti.undefined, ti.date),
          ti.date,
          ti.method,
          ti.strict('world')
        )
        .isValid([
          'hello',
          42,
          [true, false, false, true, false],
          undefined,
          new Date('1970-01-01'),
          {},
          'world'
        ])
    ).toBe(false);

    expect(
      ti
        .tuple(
          ti.string,
          ti.number,
          ti.array(ti.boolean),
          ti.union(ti.undefined, ti.date),
          ti.date,
          ti.method,
          ti.strict('world')
        )
        .isValid([
          'hello',
          42,
          [true, false, false, true, false],
          undefined,
          new Date('1970-01-01'),
          () => null,
          'hello'
        ])
    ).toBe(false);

    expect(
      ti
        .tuple(
          ti.string,
          ti.number,
          ti.array(ti.boolean),
          ti.union(ti.undefined, ti.date),
          ti.date,
          ti.method,
          ti.strict('world')
        )
        .isValid([])
    ).toBe(false);

    expect(ti.tuple().isValid(undefined)).toBe(false);
    expect(ti.tuple().isValid(1)).toBe(false);
    expect(ti.tuple().isValid(() => true)).toBe(false);
    expect(ti.tuple().isValid(TupleValidator)).toBe(false);
    expect(ti.tuple().isValid(null)).toBe(false);
  });

  test('isValid - correct conditions', () => {
    expect.assertions(1);
    expect(ti.tuple(ti.string).noOverload.isValid(['hello'])).toBe(true);
  });

  test('isValid - incorrect conditions', () => {
    expect.assertions(1);
    expect(ti.tuple(ti.string).noOverload.isValid(['hello', 'world'])).toBe(
      false
    );
  });

  test('validate - success', () => {
    expect.assertions(2);
    expect(() =>
      ti
        .tuple(
          ti.string,
          ti.number,
          ti.array(ti.boolean),
          ti.union(ti.undefined, ti.date),
          ti.date,
          ti.method,
          ti.strict('world')
        )
        .validate([
          'hello',
          42,
          [true, false, false, true, false],
          undefined,
          new Date('1970-01-01'),
          () => null,
          'world'
        ])
    ).not.toThrow();

    expect(() => ti.tuple(ti.string).isValid(['hello', 'world'])).not.toThrow();
  });

  test('validate - failure', () => {
    expect.assertions(8);
    expect(() =>
      ti
        .tuple(
          ti.string,
          ti.number,
          ti.array(ti.boolean),
          ti.union(ti.undefined, ti.date),
          ti.date,
          ti.method,
          ti.strict('world')
        )
        .validate([
          42,
          42,
          [true, false, false, true, false],
          undefined,
          new Date('1970-01-01'),
          () => null,
          'world'
        ])
    ).toThrow('value is not a string');

    expect(() =>
      ti
        .tuple(
          ti.string,
          ti.number,
          ti.array(ti.boolean),
          ti.union(ti.undefined, ti.date),
          ti.date,
          ti.method,
          ti.strict('world')
        )
        .validate([
          'hello',
          'hello',
          [true, false, false, true, false],
          undefined,
          new Date('1970-01-01'),
          () => null,
          'world'
        ])
    ).toThrow('value is not a number');

    expect(() =>
      ti
        .tuple(
          ti.string,
          ti.number,
          ti.array(ti.boolean),
          ti.union(ti.undefined, ti.date),
          ti.date,
          ti.method,
          ti.strict('world')
        )
        .validate([
          'hello',
          42,
          [true, false, false, 1, false],
          undefined,
          new Date('1970-01-01'),
          () => null,
          'world'
        ])
    ).toThrow('value is not a boolean');

    expect(() =>
      ti
        .tuple(
          ti.string,
          ti.number,
          ti.array(ti.boolean),
          ti.union(ti.undefined, ti.date),
          ti.date,
          ti.method,
          ti.strict('world')
        )
        .validate([
          'hello',
          42,
          [true, false, false, true, false],
          null,
          new Date('1970-01-01'),
          () => null,
          'world'
        ])
    ).toThrow('value does not match any of the possible types');

    expect(() =>
      ti
        .tuple(
          ti.string,
          ti.number,
          ti.array(ti.boolean),
          ti.union(ti.undefined, ti.date),
          ti.date,
          ti.method,
          ti.strict('world')
        )
        .validate([
          'hello',
          42,
          [true, false, false, true, false],
          undefined,
          Date.now(),
          () => null,
          'world'
        ])
    ).toThrow('value is not a date');

    expect(() =>
      ti
        .tuple(
          ti.string,
          ti.number,
          ti.array(ti.boolean),
          ti.union(ti.undefined, ti.date),
          ti.date,
          ti.method,
          ti.strict('world')
        )
        .validate([
          'hello',
          42,
          [true, false, false, true, false],
          undefined,
          new Date('1970-01-01'),
          {},
          'world'
        ])
    ).toThrow('value is not a method');

    expect(() =>
      ti
        .tuple(
          ti.string,
          ti.number,
          ti.array(ti.boolean),
          ti.union(ti.undefined, ti.date),
          ti.date,
          ti.method,
          ti.strict('world')
        )
        .validate([
          'hello',
          42,
          [true, false, false, true, false],
          undefined,
          new Date('1970-01-01'),
          () => null,
          'hello'
        ])
    ).toThrow('no equality found');

    expect(() =>
      ti
        .tuple(
          ti.string,
          ti.number,
          ti.array(ti.boolean),
          ti.union(ti.undefined, ti.date),
          ti.date,
          ti.method,
          ti.strict('world')
        )
        .validate([])
    ).toThrow('too few entries');
  });
});
