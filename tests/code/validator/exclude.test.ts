import { describe, expect, test } from 'vitest';
import { TypeInspector } from '../../../src/inspector';
import { ExcludeValidator } from '../../../src/validator/exclude';

const ti = new TypeInspector();

describe(ExcludeValidator.name, () => {
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
