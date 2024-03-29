import { TypeInspector } from '@/inspector.js';
import { EnumValidator } from '@/validator/enum.js';
import { describe, expect, test } from 'vitest';

enum NumberEnum {
  a,
  b,
  c
}

enum StringEnum {
  a = 'a',
  b = 'b',
  c = 'c'
}

const ti = new TypeInspector();

describe(EnumValidator, () => {
  test('isValid - success', () => {
    expect.assertions(6);
    expect(ti.enum(NumberEnum).isValid(0)).toBe(true);
    expect(ti.enum(NumberEnum).isValid(1)).toBe(true);
    expect(ti.enum(NumberEnum).isValid(2)).toBe(true);
    expect(ti.enum(StringEnum).isValid('a')).toBe(true);
    expect(ti.enum(StringEnum).isValid('b')).toBe(true);
    expect(ti.enum(StringEnum).isValid('c')).toBe(true);
  });

  test('isValid - correct conditions', () => {
    expect.assertions(6);
    expect(ti.enum(NumberEnum).values(ti.number).isValid(0)).toBe(true);
    expect(
      ti.enum(NumberEnum).values(ti.number.accept(NumberEnum.b)).isValid(1)
    ).toBe(true);
    expect(ti.enum(NumberEnum).values(ti.number.accept(2)).isValid(2)).toBe(
      true
    );
    expect(ti.enum(StringEnum).values(ti.string).isValid('a')).toBe(true);
    expect(
      ti.enum(StringEnum).values(ti.string.accept(StringEnum.b)).isValid('b')
    ).toBe(true);
    expect(ti.enum(StringEnum).values(ti.string.accept('c')).isValid('c')).toBe(
      true
    );
  });

  test('isValid - failure', () => {
    expect.assertions(6);
    expect(ti.enum(NumberEnum).isValid('a')).toBe(false);
    expect(ti.enum(NumberEnum).isValid('b')).toBe(false);
    expect(ti.enum(NumberEnum).isValid('c')).toBe(false);
    expect(ti.enum(StringEnum).isValid(0)).toBe(false);
    expect(ti.enum(StringEnum).isValid(1)).toBe(false);
    expect(ti.enum(StringEnum).isValid(2)).toBe(false);
  });

  test('isValid - incorrect conditions', () => {
    expect.assertions(4);
    expect(
      ti.enum(NumberEnum).values(ti.number.reject(NumberEnum.a)).isValid(0)
    ).toBe(false);
    expect(
      ti.enum(StringEnum).values(ti.string.reject(StringEnum.a)).isValid('a')
    ).toBe(false);
    expect(ti.enum(NumberEnum).values(ti.number.accept(1, 2)).isValid(0)).toBe(
      false
    );
    expect(
      ti.enum(StringEnum).values(ti.string.accept('a', 'b')).isValid('c')
    ).toBe(false);
  });
});
