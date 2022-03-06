import { JestClassExtended } from 'jest-class-extended';
import { InspectorGadget } from '../../../src/inspectorGadget';
import { OptionalValidator } from '../../../src/validator/optional';

const ig = new InspectorGadget();
const jce = new JestClassExtended(OptionalValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    2,
    () => {
      expect(ig.optional(ig.number).isValid(42)).toBe(true);
      expect(ig.optional(ig.number).isValid(undefined)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    2,
    () => {
      expect(ig.optional(ig.number).isValid('42')).toBe(false);
      expect(ig.optional(ig.number).isValid(null)).toBe(false);
    }
  );
});
