import { TypeInspector } from '@/inspector.js';
import { NullishValidator } from '@/validator/nullish.js';
import { describe, expect, test } from 'vitest';

const ti = new TypeInspector();

describe(NullishValidator, () => {
  test('isValid', () => {
    expect.assertions(4);
    expect(ti.nullish.isValid(null)).toBe(true);
    expect(ti.nullish.isValid(undefined)).toBe(true);
    expect(ti.nullish.isValid(0)).toBe(false);
    expect(ti.nullish.isValid('')).toBe(false);
  });
});
