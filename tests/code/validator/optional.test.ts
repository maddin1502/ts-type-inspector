import { TypeInspector } from '@/inspector.js';
import { DefaultOptionalValidator } from '@/validator/optional.js';
import { describe, expect, test } from 'vitest';

const ti = new TypeInspector();

describe(DefaultOptionalValidator, () => {
  test('isValid - success', () => {
    expect.assertions(2);
    expect(ti.optional(ti.number).isValid(42)).toBe(true);
    expect(ti.optional(ti.number).isValid(undefined)).toBe(true);
  });

  test('isValid - failure', () => {
    expect.assertions(2);
    expect(ti.optional(ti.number).isValid('42')).toBe(false);
    expect(ti.optional(ti.number).isValid(null)).toBe(false);
  });
});
