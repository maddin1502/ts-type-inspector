import { JestClassExtended } from 'jest-class-extended';
import { AnyValidator } from '../../../src/validator/any';
import { TypeInspector } from '../../../src/inspector';

const ti = new TypeInspector();
const jce = new JestClassExtended(AnyValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    10,
    () => {
      expect(ti.any.isValid(undefined)).toBe(true);
      expect(ti.any.isValid({})).toBe(true);
      expect(ti.any.isValid(null)).toBe(true);
      expect(ti.any.isValid([])).toBe(true);
      expect(ti.any.isValid(42)).toBe(true);
      expect(ti.any.isValid('hello')).toBe(true);
      expect(ti.any.isValid(() => true)).toBe(true);
      expect(ti.any.isValid(true)).toBe(true);
      expect(ti.any.isValid('')).toBe(true);
      expect(ti.any.isValid(NaN)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'incorrect conditions'],
    4,
    () => {
      expect(ti.any.notNullish.isValid(undefined)).toBe(false);
      expect(ti.any.notNullish.isValid(null)).toBe(false);
      expect(ti.any.notFalsy.isValid('')).toBe(false);
      expect(ti.any.notFalsy.isValid(NaN)).toBe(false);
    }
  );
});
