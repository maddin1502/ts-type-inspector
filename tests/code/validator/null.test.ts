import { JestClassExtended } from 'jest-class-extended';
import { TypeInspector } from '../../../src/inspector';
import { NullValidator } from '../../../src/validator/null';

const ti = new TypeInspector();
const jce = new JestClassExtended(NullValidator);

jce.describe(() => {
  jce.test(
    'isValid',
    2,
    () => {
      expect(ti.null.isValid(null)).toBe(true);
      expect(ti.null.isValid(undefined)).toBe(false);
    }
  );
});
