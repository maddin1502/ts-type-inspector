import { JestClassExtended } from 'jest-class-extended';
import tva from '../../../src';
import { OptionalValidator } from '../../../src/validator/optional';

const jce = new JestClassExtended(OptionalValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    2,
    () => {
      expect(tva.optional(tva.number).isValid(42)).toBe(true);
      expect(tva.optional(tva.number).isValid(undefined)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    2,
    () => {
      expect(tva.optional(tva.number).isValid('42')).toBe(false);
      expect(tva.optional(tva.number).isValid(null)).toBe(false);
    }
  );
});
