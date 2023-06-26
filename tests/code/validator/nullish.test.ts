import { describe, expect, test } from 'vitest';
import { TypeInspector } from '../../../src/inspector';
import { NullishValidator } from '../../../src/validator/nullish';

const ti = new TypeInspector();

describe(NullishValidator.name, () => {
  test('isValid', () => {
    expect.assertions(4);
    expect(ti.nullish.isValid(null)).toBe(true);
    expect(ti.nullish.isValid(undefined)).toBe(true);
    expect(ti.nullish.isValid(0)).toBe(false);
    expect(ti.nullish.isValid('')).toBe(false);
  });
});
