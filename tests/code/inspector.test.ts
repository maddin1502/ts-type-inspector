import { describe, expect, test } from 'vitest';
import { TypeInspector } from '../../src/inspector.js';

const ti = new TypeInspector();

describe(TypeInspector.name, () => {
  test('boolean', () => {
    expect.assertions(1);
    expect(ti.boolean === ti.boolean).toBe(false);
  });

  test('number', () => {
    expect.assertions(1);
    expect(ti.number === ti.number).toBe(false);
  });

  test('string', () => {
    expect.assertions(1);
    expect(ti.string === ti.string).toBe(false);
  });

  test('method', () => {
    expect.assertions(1);
    expect(ti.method === ti.method).toBe(false);
  });

  test('date', () => {
    expect.assertions(1);
    expect(ti.date === ti.date).toBe(false);
  });

  test('undefined', () => {
    expect.assertions(1);
    expect(ti.undefined === ti.undefined).toBe(false);
  });

  test('array', () => {
    expect.assertions(1);
    expect(ti.array(ti.any) === ti.array(ti.any)).toBe(false);
  });

  test('strict', () => {
    expect.assertions(1);
    expect(ti.strict(ti.any) === ti.strict(ti.any)).toBe(false);
  });

  test('union', () => {
    expect.assertions(1);
    expect(ti.union(ti.any, ti.any) === ti.union(ti.any, ti.any)).toBe(false);
  });

  test('object', () => {
    expect.assertions(1);
    expect(ti.object({}) === ti.object({})).toBe(false);
  });

  test('dictionary', () => {
    expect.assertions(1);
    expect(ti.dictionary(ti.any) === ti.dictionary(ti.any)).toBe(false);
  });

  test('any', () => {
    expect.assertions(1);
    expect(ti.any === ti.any).toBe(false);
  });

  test('optional', () => {
    expect.assertions(1);
    expect(ti.optional(ti.any) === ti.optional(ti.any)).toBe(false);
  });
});
