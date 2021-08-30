import { JestClassExtended } from 'jest-class-extended';
import tva from '../../../src';
import { UnionValidator } from '../../../src/validator/union';

const jce = new JestClassExtended(UnionValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    4,
    () => {
      expect(tva.union(tva.string, tva.number).isValid(42)).toBe(true);
      expect(tva.union(tva.string, tva.number).isValid('42')).toBe(true);
      expect(tva.union(tva.string, tva.string.allowEmpty).isValid('')).toBe(true);
      expect(tva.union(tva.number, tva.number.allowNaN).isValid(NaN)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    4,
    () => {
      expect(tva.union(tva.string, tva.number).isValid(undefined)).toBe(false);
      expect(tva.union(tva.string, tva.number).isValid(null)).toBe(false);
      expect(tva.union(tva.string, tva.string).isValid(42)).toBe(false);
      expect(tva.union(tva.string, tva.number).isValid(NaN)).toBe(false);
    }
  );
});
