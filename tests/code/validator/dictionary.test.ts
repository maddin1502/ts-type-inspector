import { JestClassExtended } from 'jest-class-extended';
import { InspectorGadget } from '../../../src/inspectorGadget';
import { DictionaryValidator } from '../../../src/validator/dictionary';

const ig = new InspectorGadget();
const jce = new JestClassExtended(DictionaryValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    2,
    () => {
      expect(ig.dictionary(ig.boolean).isValid({ test: true })).toBe(true);
      expect(ig.dictionary(ig.boolean).isValid({
        test: true,
        test2: false
      })).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    3,
    () => {
      expect(ig.dictionary(ig.boolean).isValid({ test: 42 })).toBe(false);
      expect(ig.dictionary(ig.boolean).isValid({
        test: true,
        test2: 42
      })).toBe(false);
      expect(ig.dictionary(ig.boolean).isValid(undefined)).toBe(false);
    }
  );

  jce.test(
    ['isValid', 'correct conditions'],
    2,
    () => {
      expect(
        ig.dictionary(
          ig.boolean
        ).keys(
          ig.string.length(4)
        ).isValid({ test: true })).toBe(true);
      expect(
        ig.dictionary(
          ig.boolean
        ).keys(
          ig.union(
            ig.strict('test'),
            ig.strict('test2')
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
        ig.dictionary(
          ig.boolean
        ).keys(
          ig.string.length(3)
        ).isValid({ test: true })
      ).toBe(false);
      expect(
        ig.dictionary(
          ig.boolean
        ).keys(
          ig.union(
            ig.strict('test'),
            ig.strict('test2')
          )
        ).isValid({
          test2: true,
          test3: false
        })
      ).toBe(false);
    }
  );
});
