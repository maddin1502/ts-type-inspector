import { TypeInspector } from '@/inspector.js';
import { DefaulUndefinedValidator } from '@/validator/undefined.js';
import { describe, expect, test } from 'vitest';

const ti = new TypeInspector();

describe(DefaulUndefinedValidator, () => {
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
