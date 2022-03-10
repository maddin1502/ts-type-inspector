import { JestClassExtended } from 'jest-class-extended';
import { TypeInspector } from '../../../src/inspector';
import { DictionaryValidator } from '../../../src/validator/dictionary';

const ti = new TypeInspector();
const jce = new JestClassExtended(DictionaryValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    2,
    () => {
      expect(ti.dictionary(ti.boolean).isValid({ test: true })).toBe(true);
      expect(ti.dictionary(ti.boolean).isValid({
        test: true,
        test2: false
      })).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    3,
    () => {
      expect(ti.dictionary(ti.boolean).isValid({ test: 42 })).toBe(false);
      expect(ti.dictionary(ti.boolean).isValid({
        test: true,
        test2: 42
      })).toBe(false);
      expect(ti.dictionary(ti.boolean).isValid(undefined)).toBe(false);
    }
  );

  jce.test(
    ['isValid', 'correct conditions'],
    2,
    () => {
      expect(
        ti.dictionary(
          ti.boolean
        ).keys(
          ti.string.length(4)
        ).isValid({ test: true })).toBe(true);
      expect(
        ti.dictionary(
          ti.boolean
        ).keys(
          ti.union(
            ti.strict('test'),
            ti.strict('test2')
          )
        ).isValid({
          test: true,
          test2: false
        })
      ).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'incorrect conditions'],
    2,
    () => {
      expect(
        ti.dictionary(
          ti.boolean
        ).keys(
          ti.string.length(3)
        ).isValid({ test: true })
      ).toBe(false);
      expect(
        ti.dictionary(
          ti.boolean
        ).keys(
          ti.union(
            ti.strict('test'),
            ti.strict('test2')
          )
        ).isValid({
          test2: true,
          test3: false
        })
      ).toBe(false);
    }
  );
});
