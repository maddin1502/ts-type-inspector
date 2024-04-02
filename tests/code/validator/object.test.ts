import { TypeInspector } from '@/inspector.js';
import { ContainerExtendedValidationParameters } from '@/types.js';
import { DefaultObjectValidator } from '@/validator/object.js';
import { describe, expect, test } from 'vitest';
import {
  ExtendedValidationParametersValidator,
  TestExtendedValidationParameters
} from '../../testTypes.js';

const ti = new TypeInspector();

describe(DefaultObjectValidator, () => {
  test('isValid - success', () => {
    expect.assertions(2);
    expect(
      ti
        .object({
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
          strictStringProperty: 'world'
        })
    ).toBe(true);

    expect(
      ti.object({ test: ti.string }).isValid({ test: 'hello', test2: 'world' })
    ).toBe(true);
  });

  test('isValid - failure', () => {
    expect.assertions(13);
    expect(
      ti
        .object({
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
        .object({
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
        .object({
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
        .object({
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
        .object({
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
        .object({
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
        .object({
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
        .object({
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

    expect(ti.object({}).isValid(undefined)).toBe(false);
    expect(ti.object({}).isValid(1)).toBe(false);
    expect(ti.object({}).isValid(() => true)).toBe(false);
    expect(ti.object({}).isValid(DefaultObjectValidator)).toBe(false);
    expect(ti.object({}).isValid(null)).toBe(false);
  });

  test('isValid - correct conditions', () => {
    expect.assertions(1);
    expect(
      ti.object({ p1: ti.string }).noOverload.isValid({ p1: 'hello' })
    ).toBe(true);
  });

  test('isValid - incorrect conditions', () => {
    expect.assertions(1);
    expect(
      ti
        .object({ p1: ti.string })
        .noOverload.isValid({ p1: 'hello', p2: 'world' })
    ).toBe(false);
  });

  test('validate - success', () => {
    expect.assertions(2);
    expect(() =>
      ti
        .object({
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
          strictStringProperty: 'world'
        })
    ).not.toThrow();

    expect(() =>
      ti
        .object({
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
        .object({
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
        .object({
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
        .object({
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
        .object({
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
        .object({
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
        .object({
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
        .object({
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
        .object({
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

  test('extended validation params', () => {
    expect.assertions(8);
    const dovEvpv = new DefaultObjectValidator<
      { prop1: unknown },
      ContainerExtendedValidationParameters<TestExtendedValidationParameters>
    >({
      prop1: new ExtendedValidationParametersValidator()
        .extendedFailureCondition
    });
    expect(dovEvpv.isValid({ hello: 'world' })).toBe(true);
    expect(() => dovEvpv.validate({ hello: 'world' })).not.toThrow();
    expect(
      dovEvpv.isValid(
        { hello: 'world' },
        {
          extendedItemValidationParameters: { failOn: 'condition' }
        }
      )
    ).toBe(false);
    expect(() =>
      dovEvpv.validate(
        { hello: 'world' },
        {
          extendedItemValidationParameters: { failOn: 'condition' }
        }
      )
    ).toThrow('extended failure on condition');
    expect(
      dovEvpv.isValid(
        { hello: 'world' },
        {
          extendedItemValidationParameters: { failOn: 'custom' }
        }
      )
    ).toBe(false);
    expect(() =>
      dovEvpv.validate(
        { hello: 'world' },
        {
          extendedItemValidationParameters: { failOn: 'custom' }
        }
      )
    ).toThrow('extended failure on custom');
    expect(
      dovEvpv.isValid(
        { hello: 'world' },
        {
          extendedItemValidationParameters: { failOn: 'validate' }
        }
      )
    ).toBe(false);
    expect(() =>
      dovEvpv.validate(
        { hello: 'world' },
        {
          extendedItemValidationParameters: { failOn: 'validate' }
        }
      )
    ).toThrow('extended failure on validate');
  });
});
