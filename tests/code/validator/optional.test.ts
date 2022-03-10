import { JestClassExtended } from 'jest-class-extended';
import { TypeInspector } from '../../../src/inspector';
import { OptionalValidator } from '../../../src/validator/optional';

const ti = new TypeInspector();
const jce = new JestClassExtended(OptionalValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    2,
    () => {
      expect(ti.optional(ti.number).isValid(42)).toBe(true);
      expect(ti.optional(ti.number).isValid(undefined)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    2,
    () => {
      expect(ti.optional(ti.number).isValid('42')).toBe(false);
      expect(ti.optional(ti.number).isValid(null)).toBe(false);
    }
  );
});
