import { JestClassExtended } from 'jest-class-extended';
import { InspectorGadget } from '../../../src/inspectorGadget';
import { UnionValidator } from '../../../src/validator/union';

const ig = new InspectorGadget();
const jce = new JestClassExtended(UnionValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    4,
    () => {
      expect(ig.union(ig.string, ig.number).isValid(42)).toBe(true);
      expect(ig.union(ig.string, ig.number).isValid('42')).toBe(true);
      expect(ig.union(ig.string, ig.string).isValid('')).toBe(true);
      expect(ig.union(ig.number, ig.number).isValid(NaN)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    4,
    () => {
      expect(ig.union(ig.string, ig.number).isValid(undefined)).toBe(false);
      expect(ig.union(ig.string, ig.number).isValid(null)).toBe(false);
      expect(ig.union(ig.string, ig.string).isValid(42)).toBe(false);
      expect(ig.union(ig.string, ig.number.rejectNaN).isValid(NaN)).toBe(false);
    }
  );
});
