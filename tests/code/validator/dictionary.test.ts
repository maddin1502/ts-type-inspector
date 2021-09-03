import { JestClassExtended } from 'jest-class-extended';
import tva from '../../../src';
import { DictionaryValidator } from '../../../src/validator/dictionary';

const jce = new JestClassExtended(DictionaryValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    2,
    () => {
      expect(tva.dictionary(tva.boolean).isValid({ test: true })).toBe(true);
      expect(tva.dictionary(tva.boolean).isValid({
        test: true,
        test2: false
      })).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    3,
    () => {
      expect(tva.dictionary(tva.boolean).isValid({ test: 42 })).toBe(false);
      expect(tva.dictionary(tva.boolean).isValid({
        test: true,
        test2: 42
      })).toBe(false);
      expect(tva.dictionary(tva.boolean).isValid(undefined)).toBe(false);
    }
  );

  jce.test(
    ['isValid', 'correct conditions'],
    2,
    () => {
      expect(
        tva.dictionary(
          tva.boolean
        ).key(
          tva.string.length(4)
        ).isValid({ test: true })).toBe(true);
      expect(
        tva.dictionary(
          tva.boolean
        ).key(
          tva.union(
            tva.strict('test'),
            tva.strict('test2')
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
        tva.dictionary(
          tva.boolean
        ).key(
          tva.string.length(3)
        ).isValid({ test: true })
      ).toBe(false);
      expect(
        tva.dictionary(
          tva.boolean
        ).key(
          tva.union(
            tva.strict('test'),
            tva.strict('test2')
          )
        ).isValid({
          test2: true,
          test3: false
        })
      ).toBe(false);
    }
  );
});
