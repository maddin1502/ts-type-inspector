import { describe, expect, test } from 'vitest';
import { TypeInspector } from '../../../src/inspector.js';
import { NullValidator } from '../../../src/validator/null.js';

const ti = new TypeInspector();

describe(NullValidator.name, () => {
  test('isValid', () => {
    expect.assertions(2);
    expect(ti.null.isValid(null)).toBe(true);
    expect(ti.null.isValid(undefined)).toBe(false);
  });
});
