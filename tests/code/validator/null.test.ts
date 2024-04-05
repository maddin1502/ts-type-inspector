import { TypeInspector } from '@/inspector.js';
import { DefaultNullValidator } from '@/validator/null.js';
import { describe, expect, test } from 'vitest';

const ti = new TypeInspector();

describe(DefaultNullValidator, () => {
  test('isValid', () => {
    expect.assertions(2);
    expect(ti.null.isValid(null)).toBe(true);
    expect(ti.null.isValid(undefined)).toBe(false);
  });
});
