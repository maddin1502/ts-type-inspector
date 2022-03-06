import { JestClassExtended } from 'jest-class-extended';
import { InspectorGadget } from '../../../src/inspectorGadget';
import { StrictValidator } from '../../../src/validator/strict';

const ig = new InspectorGadget();
const jce = new JestClassExtended(StrictValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    7,
    () => {
      expect(ig.strict('hello').isValid('hello')).toBe(true);
      expect(ig.strict(undefined).isValid(undefined)).toBe(true);
      expect(ig.strict(null).isValid(null)).toBe(true);
      expect(ig.strict(42).isValid(42)).toBe(true);
      const obj = new Object();
      expect(ig.strict(obj).isValid(obj)).toBe(true);
      expect(ig.strict(new Date('2020-01-01').getTime()).isValid(new Date('2020-01-01').getTime())).toBe(true);
      expect(ig.strict(1, 'hello', false).isValid(false)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    6,
    () => {
      expect(ig.strict('hello').isValid('world')).toBe(false);
      expect(ig.strict(42).isValid('42')).toBe(false);
      expect(ig.strict(undefined).isValid(null)).toBe(false);
      expect(ig.strict(new Object()).isValid(new Object())).toBe(false);
      expect(ig.strict(new Date('2020-01-01')).isValid(new Date('2020-01-01'))).toBe(false);
      expect(ig.strict(1, 'hello', false).isValid(true)).toBe(false);
    }
  );
});
