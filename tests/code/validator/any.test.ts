import { JestClassExtended } from 'jest-class-extended';
import { AnyValidator } from '../../../src/validator/any';
import { InspectorGadget } from '../../../src/inspectorGadget';

const ig = new InspectorGadget();
const jce = new JestClassExtended(AnyValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    8,
    () => {
      expect(ig.any.isValid(undefined)).toBe(true);
      expect(ig.any.isValid({})).toBe(true);
      expect(ig.any.isValid(null)).toBe(true);
      expect(ig.any.isValid([])).toBe(true);
      expect(ig.any.isValid(42)).toBe(true);
      expect(ig.any.isValid('hello')).toBe(true);
      expect(ig.any.isValid(() => true)).toBe(true);
      expect(ig.any.isValid(true)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'incorrect conditions'],
    2,
    () => {
      expect(ig.any.notNullish.isValid(undefined)).toBe(false);
      expect(ig.any.notNullish.isValid(null)).toBe(false);
    }
  );
});
