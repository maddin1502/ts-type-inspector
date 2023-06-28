import { describe, expect, test } from 'vitest';
import { TypeInspector } from '../../../src/inspector.js';
import { OptionalValidator } from '../../../src/validator/optional.js';

const ti = new TypeInspector();

describe(OptionalValidator.name, () => {
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
