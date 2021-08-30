import { JestClassExtended } from 'jest-class-extended';
import tva from '../../../src';
import { DateValidator } from '../../../src/validator/date';

const jce = new JestClassExtended(DateValidator);

const dateString1 = '2020-01-02';
const date1 = new Date(dateString1);
const dateNumber1 = date1.getTime();
const dateString2 = '2021-01-01T00:00:00';
const date2 = new Date(dateString2);
const dateNumber2 = date2.getTime();

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    3,
    () => {
      expect(tva.date.isValid(new Date())).toBe(true);
      expect(tva.date.isValid(date1)).toBe(true);
      expect(tva.date.isValid(date2)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    9,
    () => {
      expect(tva.date.isValid(undefined)).toBe(false);
      expect(tva.date.isValid(null)).toBe(false);
      expect(tva.date.isValid(Date.now())).toBe(false);
      expect(tva.date.isValid(new Date('nonsense'))).toBe(false);
      expect(tva.date.isValid('42')).toBe(false);
      expect(tva.date.isValid(42)).toBe(false);
      expect(tva.date.isValid({ oh: 'no'})).toBe(false);
      expect(tva.date.isValid(/.*oh.*no:+/)).toBe(false);
      expect(tva.date.isValid(() => ({ oh: 'no'}))).toBe(false);
    }
  );

  jce.test(
    ['isValid', 'correct conditions'],
    21,
    () => {
      expect(tva.date.min(date1).max(date2).isValid(date1)).toBe(true);
      expect(tva.date.min(date1).max(date2).isValid(date2)).toBe(true);
      expect(tva.date.allow(date1, date2).isValid(date1)).toBe(true);
      expect(tva.date.allow(date1, date2).isValid(date2)).toBe(true);
      expect(tva.date.deny(date1).isValid(date2)).toBe(true);
      expect(tva.date.deny(date2).isValid(date1)).toBe(true);
      expect(tva.date.custom(value_ => value_ === date1 ? undefined : 'invalid').isValid(date1)).toBe(true);

      expect(tva.date.min(dateNumber1).max(dateNumber2).isValid(date1)).toBe(true);
      expect(tva.date.min(dateNumber1).max(dateNumber2).isValid(date2)).toBe(true);
      expect(tva.date.allow(dateNumber1, dateNumber2).isValid(date1)).toBe(true);
      expect(tva.date.allow(dateNumber1, dateNumber2).isValid(date2)).toBe(true);
      expect(tva.date.deny(dateNumber1).isValid(date2)).toBe(true);
      expect(tva.date.deny(dateNumber2).isValid(date1)).toBe(true);

      expect(tva.date.min(dateString1).max(dateString2).isValid(date1)).toBe(true);
      expect(tva.date.min(dateString1).max(dateString2).isValid(date2)).toBe(true);
      expect(tva.date.allow(dateString1, dateString2).isValid(date1)).toBe(true);
      expect(tva.date.allow(dateString1, dateString2).isValid(date2)).toBe(true);
      expect(tva.date.deny(dateString1).isValid(date2)).toBe(true);
      expect(tva.date.deny(dateString2).isValid(date1)).toBe(true);
      expect(tva.date.min('invalid date string').max(dateString2).isValid(date1)).toBe(true);
      expect(tva.date.min(dateString1).max('invalid date string').isValid(date1)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'incorrect conditions'],
    20,
    () => {
      expect(tva.date.min(date2).max(date1).isValid(date1)).toBe(false);
      expect(tva.date.min(date2).max(date1).isValid(date2)).toBe(false);
      expect(tva.date.allow(date2).isValid(date1)).toBe(false);
      expect(tva.date.allow(date1).isValid(date2)).toBe(false);
      expect(tva.date.deny(date1).isValid(date1)).toBe(false);
      expect(tva.date.deny(date2).isValid(date2)).toBe(false);
      expect(tva.date.custom(value_ => value_ === date2 ? undefined : 'invalid').isValid(date1)).toBe(false);

      expect(tva.date.min(dateNumber2).max(dateNumber1).isValid(date1)).toBe(false);
      expect(tva.date.min(dateNumber2).max(dateNumber1).isValid(date2)).toBe(false);
      expect(tva.date.allow(dateNumber2).isValid(date1)).toBe(false);
      expect(tva.date.allow(dateNumber1).isValid(date2)).toBe(false);
      expect(tva.date.deny(dateNumber1).isValid(date1)).toBe(false);
      expect(tva.date.deny(dateNumber2).isValid(date2)).toBe(false);

      expect(tva.date.min(dateString2).max(dateString1).isValid(date1)).toBe(false);
      expect(tva.date.min(dateString2).max(dateString1).isValid(date2)).toBe(false);
      expect(tva.date.allow(dateString2).isValid(date1)).toBe(false);
      expect(tva.date.allow(dateString1).isValid(date2)).toBe(false);
      expect(tva.date.deny(dateString1).isValid(date1)).toBe(false);
      expect(tva.date.deny(dateString2).isValid(date2)).toBe(false);

      expect(tva.date.allow('invalid date string').isValid(date1)).toBe(false);
    }
  );
});
