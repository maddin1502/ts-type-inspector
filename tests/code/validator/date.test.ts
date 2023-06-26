import { describe, expect, test } from 'vitest';
import { TypeInspector } from '../../../src/inspector';
import { DateValidator } from '../../../src/validator/date';

const ti = new TypeInspector();

const dateString1 = '2020-01-02';
const date1 = new Date(dateString1);
const dateNumber1 = date1.getTime();
const dateString2 = '2021-01-01T00:00:00';
const date2 = new Date(dateString2);
const dateNumber2 = date2.getTime();

describe(DateValidator.name, () => {
  test('isValid - success', () => {
    expect.assertions(3);
    expect(ti.date.isValid(new Date())).toBe(true);
    expect(ti.date.isValid(date1)).toBe(true);
    expect(ti.date.isValid(date2)).toBe(true);
  });

  test('isValid - failure', () => {
    expect.assertions(9);
    expect(ti.date.isValid(undefined)).toBe(false);
    expect(ti.date.isValid(null)).toBe(false);
    expect(ti.date.isValid(Date.now())).toBe(false);
    expect(ti.date.isValid(new Date('nonsense'))).toBe(false);
    expect(ti.date.isValid('42')).toBe(false);
    expect(ti.date.isValid(42)).toBe(false);
    expect(ti.date.isValid({ oh: 'no' })).toBe(false);
    expect(ti.date.isValid(/.*oh.*no:+/)).toBe(false);
    expect(ti.date.isValid(() => ({ oh: 'no' }))).toBe(false);
  });

  test('isValid - correct conditions', () => {
    expect.assertions(21);
    expect(ti.date.earliest(date1).latest(date2).isValid(date1)).toBe(true);
    expect(ti.date.earliest(date1).latest(date2).isValid(date2)).toBe(true);
    expect(ti.date.accept(date1, date2).isValid(date1)).toBe(true);
    expect(ti.date.accept(date1, date2).isValid(date2)).toBe(true);
    expect(ti.date.reject(date1).isValid(date2)).toBe(true);
    expect(ti.date.reject(date2).isValid(date1)).toBe(true);
    expect(
      ti.date
        .custom((value_) => (value_ === date1 ? undefined : 'invalid'))
        .isValid(date1)
    ).toBe(true);

    expect(
      ti.date.earliest(dateNumber1).latest(dateNumber2).isValid(date1)
    ).toBe(true);
    expect(
      ti.date.earliest(dateNumber1).latest(dateNumber2).isValid(date2)
    ).toBe(true);
    expect(ti.date.accept(dateNumber1, dateNumber2).isValid(date1)).toBe(true);
    expect(ti.date.accept(dateNumber1, dateNumber2).isValid(date2)).toBe(true);
    expect(ti.date.reject(dateNumber1).isValid(date2)).toBe(true);
    expect(ti.date.reject(dateNumber2).isValid(date1)).toBe(true);

    expect(
      ti.date.earliest(dateString1).latest(dateString2).isValid(date1)
    ).toBe(true);
    expect(
      ti.date.earliest(dateString1).latest(dateString2).isValid(date2)
    ).toBe(true);
    expect(ti.date.accept(dateString1, dateString2).isValid(date1)).toBe(true);
    expect(ti.date.accept(dateString1, dateString2).isValid(date2)).toBe(true);
    expect(ti.date.reject(dateString1).isValid(date2)).toBe(true);
    expect(ti.date.reject(dateString2).isValid(date1)).toBe(true);
    expect(
      ti.date.earliest('invalid date string').latest(dateString2).isValid(date1)
    ).toBe(true);
    expect(
      ti.date.earliest(dateString1).latest('invalid date string').isValid(date1)
    ).toBe(true);
  });

  test('isValid - incorrect conditions', () => {
    expect.assertions(20);
    expect(ti.date.earliest(date2).latest(date1).isValid(date1)).toBe(false);
    expect(ti.date.earliest(date2).latest(date1).isValid(date2)).toBe(false);
    expect(ti.date.accept(date2).isValid(date1)).toBe(false);
    expect(ti.date.accept(date1).isValid(date2)).toBe(false);
    expect(ti.date.reject(date1).isValid(date1)).toBe(false);
    expect(ti.date.reject(date2).isValid(date2)).toBe(false);
    expect(
      ti.date
        .custom((value_) => (value_ === date2 ? undefined : 'invalid'))
        .isValid(date1)
    ).toBe(false);

    expect(
      ti.date.earliest(dateNumber2).latest(dateNumber1).isValid(date1)
    ).toBe(false);
    expect(
      ti.date.earliest(dateNumber2).latest(dateNumber1).isValid(date2)
    ).toBe(false);
    expect(ti.date.accept(dateNumber2).isValid(date1)).toBe(false);
    expect(ti.date.accept(dateNumber1).isValid(date2)).toBe(false);
    expect(ti.date.reject(dateNumber1).isValid(date1)).toBe(false);
    expect(ti.date.reject(dateNumber2).isValid(date2)).toBe(false);

    expect(
      ti.date.earliest(dateString2).latest(dateString1).isValid(date1)
    ).toBe(false);
    expect(
      ti.date.earliest(dateString2).latest(dateString1).isValid(date2)
    ).toBe(false);
    expect(ti.date.accept(dateString2).isValid(date1)).toBe(false);
    expect(ti.date.accept(dateString1).isValid(date2)).toBe(false);
    expect(ti.date.reject(dateString1).isValid(date1)).toBe(false);
    expect(ti.date.reject(dateString2).isValid(date2)).toBe(false);

    expect(ti.date.accept('invalid date string').isValid(date1)).toBe(false);
  });
});
