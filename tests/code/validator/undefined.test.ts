import { JestClassExtended } from 'jest-class-extended';
import tva from '../../../src';
import { UndefinedValidator } from '../../../src/validator/undefined';

const jce = new JestClassExtended(UndefinedValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    1,
    () => {
      expect(tva.undefined.isValid(undefined)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    8,
    () => {
      expect(tva.undefined.isValid(null)).toBe(false);
      expect(tva.undefined.isValid(Date.now())).toBe(false);
      expect(tva.undefined.isValid(new Date('nonsense'))).toBe(false);
      expect(tva.undefined.isValid('42')).toBe(false);
      expect(tva.undefined.isValid(42)).toBe(false);
      expect(tva.undefined.isValid({ oh: 'no'})).toBe(false);
      expect(tva.undefined.isValid(/.*oh.*no:+/)).toBe(false);
      expect(tva.undefined.isValid(() => ({ oh: 'no'}))).toBe(false);
    }
  );
});
