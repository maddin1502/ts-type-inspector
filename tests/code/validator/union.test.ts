import { describe, expect, test } from 'vitest';
import { TypeInspector } from '../../../src/inspector';
import { UnionValidator } from '../../../src/validator/union';

const ti = new TypeInspector();

describe(UnionValidator.name, () => {
  test('isValid - success', () => {
    expect.assertions(4);
    expect(ti.union(ti.string, ti.number).isValid(42)).toBe(true);
    expect(ti.union(ti.string, ti.number).isValid('42')).toBe(true);
    expect(ti.union(ti.string, ti.string).isValid('')).toBe(true);
    expect(ti.union(ti.number, ti.number).isValid(NaN)).toBe(true);
  });

  test('isValid - failure', () => {
    expect.assertions(4);
    expect(ti.union(ti.string, ti.number).isValid(undefined)).toBe(false);
    expect(ti.union(ti.string, ti.number).isValid(null)).toBe(false);
    expect(ti.union(ti.string, ti.string).isValid(42)).toBe(false);
    expect(ti.union(ti.string, ti.number.rejectNaN).isValid(NaN)).toBe(false);
  });
});
