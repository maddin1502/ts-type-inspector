import { TypeInspector } from '@/inspector.js';
import { DefaultSymbolValidator } from '@/validator/symbol.js';
import { describe, expect, test } from 'vitest';

const ti = new TypeInspector();

describe(DefaultSymbolValidator, () => {
  test('isValid - success', () => {
    expect.assertions(2);
    expect(ti.symbol.isValid(Symbol('test'))).toBe(true);
    expect(ti.symbol.isValid(Symbol.iterator)).toBe(true);
  });

  test('isValid - failure', () => {
    expect.assertions(5);
    expect(ti.symbol.isValid(undefined)).toBe(false);
    expect(ti.symbol.isValid(null)).toBe(false);
    expect(ti.symbol.isValid('symbol')).toBe(false);
    expect(ti.symbol.isValid(42)).toBe(false);
    expect(ti.symbol.isValid({ oh: 'no' })).toBe(false);
  });
});
