import { TypeInspector } from '@/inspector.js';
import { ObjectValidator } from '@/validator/object.js';
import { describe, expect, test } from 'vitest';

const ti = new TypeInspector();

describe(ObjectValidator, () => {
  test('isValid - success', () => {
    expect.assertions(2);
    expect(
      ti
        .partial({
          stringProperty: ti.string,
          arrayProperty: ti.array(ti.boolean),
          unionProperty: ti.union(ti.undefined, ti.date),
          dateProperty: ti.date,
          methodProperty: ti.method,
          strictStringProperty: ti.strict('world')
        })
        .isValid({
          stringProperty: 'hello',
          arrayProperty: [true, false, false, true, false],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
    ).toBe(true);

    expect(
      ti.partial({ test: ti.string }).isValid({ test: 'hello', test2: 'world' })
    ).toBe(true);
  });

  test('isValid - failure', () => {
    expect.assertions(13);
    expect(
      ti
        .partial({
          stringProperty: ti.string,
          numberProperty: ti.number,
          arrayProperty: ti.array(ti.boolean),
          unionProperty: ti.union(ti.undefined, ti.date),
          dateProperty: ti.date,
          methodProperty: ti.method,
          strictStringProperty: ti.strict('world')
        })
        .isValid({
          stringProperty: 42,
          numberProperty: 42,
          arrayProperty: [true, false, false, true, false],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
    ).toBe(false);

    expect(
      ti
        .partial({
          stringProperty: ti.string,
          numberProperty: ti.number,
          arrayProperty: ti.array(ti.boolean),
          unionProperty: ti.union(ti.undefined, ti.date),
          dateProperty: ti.date,
          methodProperty: ti.method,
          strictStringProperty: ti.strict('world')
        })
        .isValid({
          stringProperty: 'hello',
          numberProperty: 'hello',
          arrayProperty: [true, false, false, true, false],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
    ).toBe(false);

    expect(
      ti
        .partial({
          stringProperty: ti.string,
          numberProperty: ti.number,
          arrayProperty: ti.array(ti.boolean),
          unionProperty: ti.union(ti.undefined, ti.date),
          dateProperty: ti.date,
          methodProperty: ti.method,
          strictStringProperty: ti.strict('world')
        })
        .isValid({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [true, false, false, 1, false],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
    ).toBe(false);

    expect(
      ti
        .partial({
          stringProperty: ti.string,
          numberProperty: ti.number,
          arrayProperty: ti.array(ti.boolean),
          unionProperty: ti.union(ti.undefined, ti.date),
          dateProperty: ti.date,
          methodProperty: ti.method,
          strictStringProperty: ti.strict('world')
        })
        .isValid({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [true, false, false, true, false],
          unionProperty: null,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
    ).toBe(false);

    expect(
      ti
        .partial({
          stringProperty: ti.string,
          numberProperty: ti.number,
          arrayProperty: ti.array(ti.boolean),
          unionProperty: ti.union(ti.undefined, ti.date),
          dateProperty: ti.date,
          methodProperty: ti.method,
          strictStringProperty: ti.strict('world')
        })
        .isValid({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [true, false, false, true, false],
          unionProperty: undefined,
          dateProperty: Date.now(),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
    ).toBe(false);

    expect(
      ti
        .partial({
          stringProperty: ti.string,
          numberProperty: ti.number,
          arrayProperty: ti.array(ti.boolean),
          unionProperty: ti.union(ti.undefined, ti.date),
          dateProperty: ti.date,
          methodProperty: ti.method,
          strictStringProperty: ti.strict('world')
        })
        .isValid({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [true, false, false, true, false],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: {},
          strictStringProperty: 'world'
        })
    ).toBe(false);

    expect(
      ti
        .partial({
          stringProperty: ti.string,
          numberProperty: ti.number,
          arrayProperty: ti.array(ti.boolean),
          unionProperty: ti.union(ti.undefined, ti.date),
          dateProperty: ti.date,
          methodProperty: ti.method,
          strictStringProperty: ti.strict('world')
        })
        .isValid({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [true, false, false, true, false],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'hello'
        })
    ).toBe(false);

    expect(
      ti
        .partial({
          stringProperty: ti.string,
          numberProperty: ti.number,
          arrayProperty: ti.array(ti.boolean),
          unionProperty: ti.union(ti.undefined, ti.date),
          dateProperty: ti.date,
          methodProperty: ti.method,
          strictStringProperty: ti.strict('world')
        })
        .isValid({})
    ).toBe(false);

    expect(ti.partial({}).isValid(undefined)).toBe(false);
    expect(ti.partial({}).isValid(1)).toBe(false);
    expect(ti.partial({}).isValid(() => true)).toBe(false);
    expect(ti.partial({}).isValid(ObjectValidator)).toBe(false);
    expect(ti.partial({}).isValid(null)).toBe(false);
  });

  test('validate - success', () => {
    expect.assertions(2);
    expect(() =>
      ti
        .partial({
          stringProperty: ti.string,
          arrayProperty: ti.array(ti.boolean),
          unionProperty: ti.union(ti.undefined, ti.date),
          dateProperty: ti.date,
          methodProperty: ti.method,
          strictStringProperty: ti.strict('world')
        })
        .validate({
          stringProperty: 'hello',
          arrayProperty: [true, false, false, true, false],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
    ).not.toThrow();

    expect(() =>
      ti
        .partial({
          test: ti.string
        })
        .isValid({
          test: 'hello',
          test2: 'world'
        })
    ).not.toThrow();
  });

  test('validate - failure', () => {
    expect.assertions(8);
    expect(() =>
      ti
        .partial({
          stringProperty: ti.string,
          numberProperty: ti.number,
          arrayProperty: ti.array(ti.boolean),
          unionProperty: ti.union(ti.undefined, ti.date),
          dateProperty: ti.date,
          methodProperty: ti.method,
          strictStringProperty: ti.strict('world')
        })
        .validate({
          stringProperty: 42,
          numberProperty: 42,
          arrayProperty: [true, false, false, true, false],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
    ).toThrow('value is not a string');

    expect(() =>
      ti
        .partial({
          stringProperty: ti.string,
          numberProperty: ti.number,
          arrayProperty: ti.array(ti.boolean),
          unionProperty: ti.union(ti.undefined, ti.date),
          dateProperty: ti.date,
          methodProperty: ti.method,
          strictStringProperty: ti.strict('world')
        })
        .validate({
          stringProperty: 'hello',
          numberProperty: 'hello',
          arrayProperty: [true, false, false, true, false],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
    ).toThrow('value is not a number');

    expect(() =>
      ti
        .partial({
          stringProperty: ti.string,
          numberProperty: ti.number,
          arrayProperty: ti.array(ti.boolean),
          unionProperty: ti.union(ti.undefined, ti.date),
          dateProperty: ti.date,
          methodProperty: ti.method,
          strictStringProperty: ti.strict('world')
        })
        .validate({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [true, false, false, 1, false],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
    ).toThrow('value is not a boolean');

    expect(() =>
      ti
        .partial({
          stringProperty: ti.string,
          numberProperty: ti.number,
          arrayProperty: ti.array(ti.boolean),
          unionProperty: ti.union(ti.undefined, ti.date),
          dateProperty: ti.date,
          methodProperty: ti.method,
          strictStringProperty: ti.strict('world')
        })
        .validate({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [true, false, false, true, false],
          unionProperty: null,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
    ).toThrow('value does not match any of the possible types');

    expect(() =>
      ti
        .partial({
          stringProperty: ti.string,
          numberProperty: ti.number,
          arrayProperty: ti.array(ti.boolean),
          unionProperty: ti.union(ti.undefined, ti.date),
          dateProperty: ti.date,
          methodProperty: ti.method,
          strictStringProperty: ti.strict('world')
        })
        .validate({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [true, false, false, true, false],
          unionProperty: undefined,
          dateProperty: Date.now(),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
    ).toThrow('value is not a date');

    expect(() =>
      ti
        .partial({
          stringProperty: ti.string,
          numberProperty: ti.number,
          arrayProperty: ti.array(ti.boolean),
          unionProperty: ti.union(ti.undefined, ti.date),
          dateProperty: ti.date,
          methodProperty: ti.method,
          strictStringProperty: ti.strict('world')
        })
        .validate({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [true, false, false, true, false],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: {},
          strictStringProperty: 'world'
        })
    ).toThrow('value is not a method');

    expect(() =>
      ti
        .partial({
          stringProperty: ti.string,
          numberProperty: ti.number,
          arrayProperty: ti.array(ti.boolean),
          unionProperty: ti.union(ti.undefined, ti.date),
          dateProperty: ti.date,
          methodProperty: ti.method,
          strictStringProperty: ti.strict('world')
        })
        .validate({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [true, false, false, true, false],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'hello'
        })
    ).toThrow('no equality found');

    expect(() =>
      ti
        .partial({
          stringProperty: ti.string,
          numberProperty: ti.number,
          arrayProperty: ti.array(ti.boolean),
          unionProperty: ti.union(ti.undefined, ti.date),
          dateProperty: ti.date,
          methodProperty: ti.method,
          strictStringProperty: ti.strict('world')
        })
        .validate({})
    ).toThrow('value is not a string');
  });
});
