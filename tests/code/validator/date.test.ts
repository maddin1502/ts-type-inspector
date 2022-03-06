import { JestClassExtended } from 'jest-class-extended';
import { InspectorGadget } from '../../../src/inspectorGadget';
import { DateValidator } from '../../../src/validator/date';

const ig = new InspectorGadget();
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
      expect(ig.date.isValid(new Date())).toBe(true);
      expect(ig.date.isValid(date1)).toBe(true);
      expect(ig.date.isValid(date2)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    9,
    () => {
      expect(ig.date.isValid(undefined)).toBe(false);
      expect(ig.date.isValid(null)).toBe(false);
      expect(ig.date.isValid(Date.now())).toBe(false);
      expect(ig.date.isValid(new Date('nonsense'))).toBe(false);
      expect(ig.date.isValid('42')).toBe(false);
      expect(ig.date.isValid(42)).toBe(false);
      expect(ig.date.isValid({ oh: 'no' })).toBe(false);
      expect(ig.date.isValid(/.*oh.*no:+/)).toBe(false);
      expect(ig.date.isValid(() => ({ oh: 'no' }))).toBe(false);
    }
  );

  jce.test(
    ['isValid', 'correct conditions'],
    21,
    () => {
      expect(ig.date.earliest(date1).latest(date2).isValid(date1)).toBe(true);
      expect(ig.date.earliest(date1).latest(date2).isValid(date2)).toBe(true);
      expect(ig.date.accept(date1, date2).isValid(date1)).toBe(true);
      expect(ig.date.accept(date1, date2).isValid(date2)).toBe(true);
      expect(ig.date.reject(date1).isValid(date2)).toBe(true);
      expect(ig.date.reject(date2).isValid(date1)).toBe(true);
      expect(ig.date.custom(value_ => value_ === date1 ? undefined : 'invalid').isValid(date1)).toBe(true);

      expect(ig.date.earliest(dateNumber1).latest(dateNumber2).isValid(date1)).toBe(true);
      expect(ig.date.earliest(dateNumber1).latest(dateNumber2).isValid(date2)).toBe(true);
      expect(ig.date.accept(dateNumber1, dateNumber2).isValid(date1)).toBe(true);
      expect(ig.date.accept(dateNumber1, dateNumber2).isValid(date2)).toBe(true);
      expect(ig.date.reject(dateNumber1).isValid(date2)).toBe(true);
      expect(ig.date.reject(dateNumber2).isValid(date1)).toBe(true);

      expect(ig.date.earliest(dateString1).latest(dateString2).isValid(date1)).toBe(true);
      expect(ig.date.earliest(dateString1).latest(dateString2).isValid(date2)).toBe(true);
      expect(ig.date.accept(dateString1, dateString2).isValid(date1)).toBe(true);
      expect(ig.date.accept(dateString1, dateString2).isValid(date2)).toBe(true);
      expect(ig.date.reject(dateString1).isValid(date2)).toBe(true);
      expect(ig.date.reject(dateString2).isValid(date1)).toBe(true);
      expect(ig.date.earliest('invalid date string').latest(dateString2).isValid(date1)).toBe(true);
      expect(ig.date.earliest(dateString1).latest('invalid date string').isValid(date1)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'incorrect conditions'],
    20,
    () => {
      expect(ig.date.earliest(date2).latest(date1).isValid(date1)).toBe(false);
      expect(ig.date.earliest(date2).latest(date1).isValid(date2)).toBe(false);
      expect(ig.date.accept(date2).isValid(date1)).toBe(false);
      expect(ig.date.accept(date1).isValid(date2)).toBe(false);
      expect(ig.date.reject(date1).isValid(date1)).toBe(false);
      expect(ig.date.reject(date2).isValid(date2)).toBe(false);
      expect(ig.date.custom(value_ => value_ === date2 ? undefined : 'invalid').isValid(date1)).toBe(false);

      expect(ig.date.earliest(dateNumber2).latest(dateNumber1).isValid(date1)).toBe(false);
      expect(ig.date.earliest(dateNumber2).latest(dateNumber1).isValid(date2)).toBe(false);
      expect(ig.date.accept(dateNumber2).isValid(date1)).toBe(false);
      expect(ig.date.accept(dateNumber1).isValid(date2)).toBe(false);
      expect(ig.date.reject(dateNumber1).isValid(date1)).toBe(false);
      expect(ig.date.reject(dateNumber2).isValid(date2)).toBe(false);

      expect(ig.date.earliest(dateString2).latest(dateString1).isValid(date1)).toBe(false);
      expect(ig.date.earliest(dateString2).latest(dateString1).isValid(date2)).toBe(false);
      expect(ig.date.accept(dateString2).isValid(date1)).toBe(false);
      expect(ig.date.accept(dateString1).isValid(date2)).toBe(false);
      expect(ig.date.reject(dateString1).isValid(date1)).toBe(false);
      expect(ig.date.reject(dateString2).isValid(date2)).toBe(false);

      expect(ig.date.accept('invalid date string').isValid(date1)).toBe(false);
    }
  );
});
