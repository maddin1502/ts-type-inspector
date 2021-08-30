import { JestClassExtended } from 'jest-class-extended';
import tva from '../../../src';
import { BooleanValidator } from '../../../src/validator/boolean';

const jce = new JestClassExtended(BooleanValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    2,
    () => {
      expect(tva.boolean.isValid(true)).toBe(true);
      expect(tva.boolean.isValid(false)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    7,
    () => {
      expect(tva.boolean.isValid(null)).toBe(false);
      expect(tva.boolean.isValid(undefined)).toBe(false);
      expect(tva.boolean.isValid('42')).toBe(false);
      expect(tva.boolean.isValid(42)).toBe(false);
      expect(tva.boolean.isValid({ oh: 'no'})).toBe(false);
      expect(tva.boolean.isValid(/.*oh.*no:+/)).toBe(false);
      expect(tva.boolean.isValid(() => ({ oh: 'no'}))).toBe(false);
    }
  );

  jce.test(
    ['isValid', 'correct conditions'],
    2,
    () => {
      expect(tva.boolean.true.isValid(true)).toBe(true);
      expect(tva.boolean.false.isValid(false)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'incorrect conditions'],
    4,
    () => {
      expect(tva.boolean.true.isValid(false)).toBe(false);
      expect(tva.boolean.false.isValid(true)).toBe(false);
      expect(tva.boolean.true.false.isValid(false)).toBe(false);
      expect(tva.boolean.true.false.isValid(true)).toBe(false);
    }
  );
});
