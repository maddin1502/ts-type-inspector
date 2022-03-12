import { JestClassExtended } from 'jest-class-extended';
import { TypeInspector } from '../../../src/inspector';
import { CustomValidator } from '../../../src/validator/custom';

const ti = new TypeInspector();
const jce = new JestClassExtended(CustomValidator);

jce.describe(() => {
  jce.test(
    'isValid',
    2,
    () => {
      expect(ti.custom(value_ => {
        if (value_ !== 42) {
          return 'this is not the answer';
        }
      }).isValid(42)).toBe(true);


      expect(ti.custom(value_ => {
        if (value_ !== 42) {
          return 'this is not the answer';
        }
      }).isValid(24)).toBe(false);
    }
  );
});
