import { TypeInspector } from '@/inspector.js';
import { DefaultExcludeValidator } from '@/validator/exclude.js';
import { describe, expect, test } from 'vitest';

const ti = new TypeInspector();

describe(DefaultExcludeValidator, () => {
  test('isValid - success', () => {
    expect.assertions(2);
    expect(
      ti.exclude<string, string | number>(ti.number).isValid('hello')
    ).toBe(true);
    expect(
      ti
        .exclude<string, string | number | boolean>(
          ti.union(ti.number, ti.boolean)
        )
        .isValid('hello')
    ).toBe(true);
  });

  test('isValid - failure', () => {
    expect.assertions(2);
    expect(ti.exclude<string, string | number>(ti.number).isValid(42)).toBe(
      false
    );
    expect(
      ti
        .exclude<string, string | number | boolean>(
          ti.union(ti.number, ti.boolean)
        )
        .isValid(false)
    ).toBe(false);
  });
});
