import { JestClassExtended } from 'jest-class-extended';
import tva from '../../../src';
import { AnyValidator } from '../../../src/validator/any';

const jce = new JestClassExtended(AnyValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    8,
    () => {
      expect(tva.any.isValid(undefined)).toBe(true);
      expect(tva.any.isValid({})).toBe(true);
      expect(tva.any.isValid(null)).toBe(true);
      expect(tva.any.isValid([])).toBe(true);
      expect(tva.any.isValid(42)).toBe(true);
      expect(tva.any.isValid('hello')).toBe(true);
      expect(tva.any.isValid(() => true)).toBe(true);
      expect(tva.any.isValid(true)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'incorrect conditions'],
    2,
    () => {
      expect(tva.any.notNullish.isValid(undefined)).toBe(false);
      expect(tva.any.notNullish.isValid(null)).toBe(false);
    }
  );
});
