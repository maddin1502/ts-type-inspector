import { JestClassExtended } from 'jest-class-extended';
import { TypeInspector } from '../../../src/inspector';
import { ExcludeValidator } from '../../../src/validator/exclude';

const ti = new TypeInspector();
const jce = new JestClassExtended(ExcludeValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    2,
    () => {
      expect(ti.exclude<string, string | number>(ti.number).isValid('hello')).toBe(true);
      expect(ti.exclude<string, string | number | boolean>(ti.union(ti.number, ti.boolean)).isValid('hello')).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    2,
    () => {
      expect(ti.exclude<string, string | number>(ti.number).isValid(42)).toBe(false);
      expect(ti.exclude<string, string | number | boolean>(ti.union(ti.number, ti.boolean)).isValid(false)).toBe(false);
    }
  );
});
