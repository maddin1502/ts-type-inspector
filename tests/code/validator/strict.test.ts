import { JestClassExtended } from 'jest-class-extended';
import tva from '../../../src';
import { StrictValidator } from '../../../src/validator/strict';

const jce = new JestClassExtended(StrictValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    7,
    () => {
      expect(tva.strict('hello').isValid('hello')).toBe(true);
      expect(tva.strict(undefined).isValid(undefined)).toBe(true);
      expect(tva.strict(null).isValid(null)).toBe(true);
      expect(tva.strict(42).isValid(42)).toBe(true);
      const obj = new Object();
      expect(tva.strict(obj).isValid(obj)).toBe(true);
      expect(tva.strict(new Date('2020-01-01').getTime()).isValid(new Date('2020-01-01').getTime())).toBe(true);
      expect(tva.strict(1, 'hello', false).isValid(false)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    6,
    () => {
      expect(tva.strict('hello').isValid('world')).toBe(false);
      expect(tva.strict(42).isValid('42')).toBe(false);
      expect(tva.strict(undefined).isValid(null)).toBe(false);
      expect(tva.strict(new Object()).isValid(new Object())).toBe(false);
      expect(tva.strict(new Date('2020-01-01')).isValid(new Date('2020-01-01'))).toBe(false);
      expect(tva.strict(1, 'hello', false).isValid(true)).toBe(false);
    }
  );
});
