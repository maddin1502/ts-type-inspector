import { JestClassExtended } from 'jest-class-extended';
import { TypeInspector } from '../../../src/inspector';
import { UndefinedValidator } from '../../../src/validator/undefined';

const ti = new TypeInspector();
const jce = new JestClassExtended(UndefinedValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    1,
    () => {
      expect(ti.undefined.isValid(undefined)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    8,
    () => {
      expect(ti.undefined.isValid(null)).toBe(false);
      expect(ti.undefined.isValid(Date.now())).toBe(false);
      expect(ti.undefined.isValid(new Date('nonsense'))).toBe(false);
      expect(ti.undefined.isValid('42')).toBe(false);
      expect(ti.undefined.isValid(42)).toBe(false);
      expect(ti.undefined.isValid({ oh: 'no' })).toBe(false);
      expect(ti.undefined.isValid(/.*oh.*no:+/)).toBe(false);
      expect(ti.undefined.isValid(() => ({ oh: 'no' }))).toBe(false);
    }
  );
});
