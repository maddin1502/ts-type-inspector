import { isObject } from '@/utils.js';
import { describe, expect, test } from 'vitest';

describe(isObject, () => {
  test('true for non-null objects', () => {
    expect.assertions(6);
    expect(isObject({})).toBe(true);
    expect(isObject({ prop: 42 })).toBe(true);
    expect(isObject([])).toBe(true); // arrays are objects too
    expect(isObject(new Date())).toBe(true);
    expect(isObject(/.*/)).toBe(true);
    expect(isObject(new Map())).toBe(true);
  });

  test('false for null, undefined and primitives', () => {
    expect.assertions(7);
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(42)).toBe(false);
    expect(isObject('42')).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject(Symbol('s'))).toBe(false);
    expect(isObject(() => ({}))).toBe(false); // functions are not plain objects
  });
});
