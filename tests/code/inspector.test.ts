import { TypeInspector } from '@/inspector.js';
import { describe, expect, test } from 'vitest';

const ti = new TypeInspector();

describe(TypeInspector, () => {
  test('any', () => {
    expect.assertions(1);
    expect(ti.any === ti.any).toBe(false);
  });

  test('array', () => {
    expect.assertions(1);
    expect(ti.array(ti.any) === ti.array(ti.any)).toBe(false);
  });

  test('boolean', () => {
    expect.assertions(1);
    expect(ti.boolean === ti.boolean).toBe(false);
  });

  test('custom', () => {
    expect.assertions(1);
    expect(ti.custom(() => undefined) === ti.custom(() => undefined)).toBe(
      false
    );
  });

  test('date', () => {
    expect.assertions(1);
    expect(ti.date === ti.date).toBe(false);
  });

  test('dictionary', () => {
    expect.assertions(1);
    expect(ti.dictionary(ti.any) === ti.dictionary(ti.any)).toBe(false);
  });

  test('enum', () => {
    expect.assertions(1);
    expect(ti.enum({}) === ti.enum({})).toBe(false);
  });

  test('exclude', () => {
    expect.assertions(1);
    expect(
      ti.exclude<string, string | undefined>(ti.undefined) ===
        ti.exclude<string, string | undefined>(ti.undefined)
    ).toBe(false);
  });

  test('method', () => {
    expect.assertions(1);
    expect(ti.method === ti.method).toBe(false);
  });

  test('null', () => {
    expect.assertions(1);
    expect(ti.null === ti.null).toBe(false);
  });

  test('nullish', () => {
    expect.assertions(1);
    expect(ti.nullish === ti.nullish).toBe(false);
  });

  test('number', () => {
    expect.assertions(1);
    expect(ti.number === ti.number).toBe(false);
  });

  test('object', () => {
    expect.assertions(1);
    expect(ti.object({}) === ti.object({})).toBe(false);
  });

  test('optional', () => {
    expect.assertions(1);
    expect(ti.optional(ti.any) === ti.optional(ti.any)).toBe(false);
  });

  test('partial', () => {
    expect.assertions(1);
    expect(ti.partial({}) === ti.partial({})).toBe(false);
  });

  test('strict', () => {
    expect.assertions(1);
    expect(ti.strict(ti.any) === ti.strict(ti.any)).toBe(false);
  });

  test('string', () => {
    expect.assertions(1);
    expect(ti.string === ti.string).toBe(false);
  });

  test('tuple', () => {
    expect.assertions(1);
    expect(ti.tuple(ti.any) === ti.tuple(ti.any)).toBe(false);
  });

  test('undefined', () => {
    expect.assertions(1);
    expect(ti.undefined === ti.undefined).toBe(false);
  });

  test('union', () => {
    expect.assertions(1);
    expect(ti.union(ti.any, ti.any) === ti.union(ti.any, ti.any)).toBe(false);
  });
});
