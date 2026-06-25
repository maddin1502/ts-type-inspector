import { TypeInspector } from '@/inspector.js';
import { DefaultBigIntValidator } from '@/validator/bigint.js';
import { describe, expect, test } from 'vitest';

const ti = new TypeInspector();

describe(DefaultBigIntValidator, () => {
  test('isValid - success', () => {
    expect.assertions(3);
    expect(ti.bigint.isValid(42n)).toBe(true);
    expect(ti.bigint.isValid(0n)).toBe(true);
    expect(ti.bigint.isValid(-42n)).toBe(true);
  });

  test('isValid - failure', () => {
    expect.assertions(5);
    expect(ti.bigint.isValid(undefined)).toBe(false);
    expect(ti.bigint.isValid(null)).toBe(false);
    expect(ti.bigint.isValid(42)).toBe(false);
    expect(ti.bigint.isValid('42')).toBe(false);
    expect(ti.bigint.isValid({ oh: 'no' })).toBe(false);
  });

  test('isValid - correct conditions', () => {
    expect.assertions(7);
    expect(ti.bigint.positive.isValid(42n)).toBe(true);
    expect(ti.bigint.negative.isValid(-42n)).toBe(true);
    expect(ti.bigint.rejectZero.isValid(42n)).toBe(true);
    expect(ti.bigint.min(-42n).max(42n).isValid(42n)).toBe(true);
    expect(ti.bigint.min(-42n).max(42n).isValid(-42n)).toBe(true);
    expect(ti.bigint.accept(42n, -42n).isValid(42n)).toBe(true);
    expect(ti.bigint.reject(-42n).isValid(42n)).toBe(true);
  });

  test('isValid - incorrect conditions', () => {
    expect.assertions(8);
    expect(ti.bigint.positive.isValid(0n)).toBe(false);
    expect(ti.bigint.positive.isValid(-42n)).toBe(false);
    expect(ti.bigint.negative.isValid(0n)).toBe(false);
    expect(ti.bigint.rejectZero.isValid(0n)).toBe(false);
    expect(ti.bigint.min(-42n).max(42n).isValid(-43n)).toBe(false);
    expect(ti.bigint.min(-42n).max(42n).isValid(43n)).toBe(false);
    expect(ti.bigint.accept(-42n).isValid(42n)).toBe(false);
    expect(ti.bigint.reject(42n).isValid(42n)).toBe(false);
  });
});
