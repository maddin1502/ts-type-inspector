import { JestClassExtended } from 'jest-class-extended';
import { TypeInspector } from '../../../src/inspector';
import { StrictValidator } from '../../../src/validator/strict';

const ti = new TypeInspector();
const jce = new JestClassExtended(StrictValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    7,
    () => {
      expect(ti.strict('hello').isValid('hello')).toBe(true);
      expect(ti.strict(undefined).isValid(undefined)).toBe(true);
      expect(ti.strict(null).isValid(null)).toBe(true);
      expect(ti.strict(42).isValid(42)).toBe(true);
      const obj = new Object();
      expect(ti.strict(obj).isValid(obj)).toBe(true);
      expect(ti.strict(new Date('2020-01-01').getTime()).isValid(new Date('2020-01-01').getTime())).toBe(true);
      expect(ti.strict(1, 'hello', false).isValid(false)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    6,
    () => {
      expect(ti.strict('hello').isValid('world')).toBe(false);
      expect(ti.strict(42).isValid('42')).toBe(false);
      expect(ti.strict(undefined).isValid(null)).toBe(false);
      expect(ti.strict(new Object()).isValid(new Object())).toBe(false);
      expect(ti.strict(new Date('2020-01-01')).isValid(new Date('2020-01-01'))).toBe(false);
      expect(ti.strict(1, 'hello', false).isValid(true)).toBe(false);
    }
  );
});
