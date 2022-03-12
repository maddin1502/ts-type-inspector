import { JestClassExtended } from 'jest-class-extended';
import { TypeInspector } from '../../../src/inspector';
import { BooleanValidator } from '../../../src/validator/boolean';

const ti = new TypeInspector();
const jce = new JestClassExtended(BooleanValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    2,
    () => {
      expect(ti.boolean.isValid(true)).toBe(true);
      expect(ti.boolean.isValid(false)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    7,
    () => {
      expect(ti.boolean.isValid(null)).toBe(false);
      expect(ti.boolean.isValid(undefined)).toBe(false);
      expect(ti.boolean.isValid('42')).toBe(false);
      expect(ti.boolean.isValid(42)).toBe(false);
      expect(ti.boolean.isValid({ oh: 'no' })).toBe(false);
      expect(ti.boolean.isValid(/.*oh.*no:+/)).toBe(false);
      expect(ti.boolean.isValid(() => ({ oh: 'no' }))).toBe(false);
    }
  );

  jce.test(
    ['isValid', 'correct conditions'],
    2,
    () => {
      expect(ti.boolean.true.isValid(true)).toBe(true);
      expect(ti.boolean.false.isValid(false)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'incorrect conditions'],
    4,
    () => {
      expect(ti.boolean.true.isValid(false)).toBe(false);
      expect(ti.boolean.false.isValid(true)).toBe(false);
      expect(ti.boolean.true.false.isValid(false)).toBe(false);
      expect(ti.boolean.true.false.isValid(true)).toBe(false);
    }
  );
});
