import { JestClassExtended } from 'jest-class-extended';
import { TypeInspector } from '../../../src/inspector';
import { NullishValidator } from '../../../src/validator/nullish';

const ti = new TypeInspector();
const jce = new JestClassExtended(NullishValidator);

jce.describe(() => {
  jce.test(
    'isValid',
    4,
    () => {
      expect(ti.nullish.isValid(null)).toBe(true);
      expect(ti.nullish.isValid(undefined)).toBe(true);
      expect(ti.nullish.isValid(0)).toBe(false);
      expect(ti.nullish.isValid('')).toBe(false);
    }
  );
});
