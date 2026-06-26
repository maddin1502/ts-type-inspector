import { TypeInspector } from '@/inspector.js';
import { describe, expect, test } from 'vitest';

const ti = new TypeInspector();

describe('validOrDefault / validOrFallback', () => {
  test('validOrDefault returns the value when valid, else undefined', () => {
    expect.assertions(2);
    expect(ti.number.validOrDefault(42)).toBe(42);
    expect(ti.number.validOrDefault('nope')).toBeUndefined();
  });

  test('validOrFallback returns the value when valid, else the fallback', () => {
    expect.assertions(2);
    expect(ti.number.validOrFallback(42, 0)).toBe(42);
    expect(ti.number.validOrFallback('nope', 0)).toBe(0);
  });
});
