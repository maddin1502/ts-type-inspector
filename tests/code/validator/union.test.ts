import { JestClassExtended } from 'jest-class-extended';
import { TypeInspector } from '../../../src/inspector';
import { UnionValidator } from '../../../src/validator/union';

const ti = new TypeInspector();
const jce = new JestClassExtended(UnionValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    4,
    () => {
      expect(ti.union(ti.string, ti.number).isValid(42)).toBe(true);
      expect(ti.union(ti.string, ti.number).isValid('42')).toBe(true);
      expect(ti.union(ti.string, ti.string).isValid('')).toBe(true);
      expect(ti.union(ti.number, ti.number).isValid(NaN)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    4,
    () => {
      expect(ti.union(ti.string, ti.number).isValid(undefined)).toBe(false);
      expect(ti.union(ti.string, ti.number).isValid(null)).toBe(false);
      expect(ti.union(ti.string, ti.string).isValid(42)).toBe(false);
      expect(ti.union(ti.string, ti.number.rejectNaN).isValid(NaN)).toBe(false);
    }
  );
});
