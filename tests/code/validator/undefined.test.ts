import { describe, expect, test } from 'vitest';
import { TypeInspector } from '../../../src/inspector.js';
import { UndefinedValidator } from '../../../src/validator/undefined.js';

const ti = new TypeInspector();

describe(UndefinedValidator.name, () => {
  test('isValid - success', () => {
    expect.assertions(1);
    expect(ti.undefined.isValid(undefined)).toBe(true);
  });

  test('isValid - failure', () => {
    expect.assertions(8);
    expect(ti.undefined.isValid(null)).toBe(false);
    expect(ti.undefined.isValid(Date.now())).toBe(false);
    expect(ti.undefined.isValid(new Date('nonsense'))).toBe(false);
    expect(ti.undefined.isValid('42')).toBe(false);
    expect(ti.undefined.isValid(42)).toBe(false);
    expect(ti.undefined.isValid({ oh: 'no' })).toBe(false);
    expect(ti.undefined.isValid(/.*oh.*no:+/)).toBe(false);
    expect(ti.undefined.isValid(() => ({ oh: 'no' }))).toBe(false);
  });
});
