import { JestClassExtended } from 'jest-class-extended';
import { InspectorGadget } from '../../../src/inspectorGadget';
import { BooleanValidator } from '../../../src/validator/boolean';

const ig = new InspectorGadget();
const jce = new JestClassExtended(BooleanValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    2,
    () => {
      expect(ig.boolean.isValid(true)).toBe(true);
      expect(ig.boolean.isValid(false)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    7,
    () => {
      expect(ig.boolean.isValid(null)).toBe(false);
      expect(ig.boolean.isValid(undefined)).toBe(false);
      expect(ig.boolean.isValid('42')).toBe(false);
      expect(ig.boolean.isValid(42)).toBe(false);
      expect(ig.boolean.isValid({ oh: 'no' })).toBe(false);
      expect(ig.boolean.isValid(/.*oh.*no:+/)).toBe(false);
      expect(ig.boolean.isValid(() => ({ oh: 'no' }))).toBe(false);
    }
  );

  jce.test(
    ['isValid', 'correct conditions'],
    2,
    () => {
      expect(ig.boolean.true.isValid(true)).toBe(true);
      expect(ig.boolean.false.isValid(false)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'incorrect conditions'],
    4,
    () => {
      expect(ig.boolean.true.isValid(false)).toBe(false);
      expect(ig.boolean.false.isValid(true)).toBe(false);
      expect(ig.boolean.true.false.isValid(false)).toBe(false);
      expect(ig.boolean.true.false.isValid(true)).toBe(false);
    }
  );
});
