import { JestClassExtended } from 'jest-class-extended';
import { InspectorGadget } from '../../../src/inspectorGadget';
import { UndefinedValidator } from '../../../src/validator/undefined';

const ig = new InspectorGadget();
const jce = new JestClassExtended(UndefinedValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    1,
    () => {
      expect(ig.undefined.isValid(undefined)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    8,
    () => {
      expect(ig.undefined.isValid(null)).toBe(false);
      expect(ig.undefined.isValid(Date.now())).toBe(false);
      expect(ig.undefined.isValid(new Date('nonsense'))).toBe(false);
      expect(ig.undefined.isValid('42')).toBe(false);
      expect(ig.undefined.isValid(42)).toBe(false);
      expect(ig.undefined.isValid({ oh: 'no' })).toBe(false);
      expect(ig.undefined.isValid(/.*oh.*no:+/)).toBe(false);
      expect(ig.undefined.isValid(() => ({ oh: 'no' }))).toBe(false);
    }
  );
});
