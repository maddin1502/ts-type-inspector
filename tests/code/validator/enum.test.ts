import { JestClassExtended } from 'jest-class-extended';
import { TypeInspector } from '../../../src/inspector';
import { EnumValidator } from '../../../src/validator/enum';

enum NumberEnum {
  a,
  b,
  c
}

enum StringEnum {
  a = 'a',
  b = 'b',
  c = 'c'
}

const ti = new TypeInspector();
const jce = new JestClassExtended(EnumValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    12,
    () => {
      expect(ti.enum(NumberEnum, ti.number).isValid(0)).toBe(true);
      expect(ti.enum(NumberEnum, ti.number).isValid(1)).toBe(true);
      expect(ti.enum(NumberEnum, ti.number).isValid(2)).toBe(true);
      expect(ti.enum(StringEnum, ti.string).isValid('a')).toBe(true);
      expect(ti.enum(StringEnum, ti.string).isValid('b')).toBe(true);
      expect(ti.enum(StringEnum, ti.string).isValid('c')).toBe(true);

      expect(ti.enum(NumberEnum).isValid(0)).toBe(true);
      expect(ti.enum(NumberEnum).isValid(1)).toBe(true);
      expect(ti.enum(NumberEnum).isValid(2)).toBe(true);
      expect(ti.enum(StringEnum).isValid('a')).toBe(true);
      expect(ti.enum(StringEnum).isValid('b')).toBe(true);
      expect(ti.enum(StringEnum).isValid('c')).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    16,
    () => {
      expect(ti.enum(NumberEnum, ti.number).isValid('a')).toBe(false);
      expect(ti.enum(NumberEnum, ti.number).isValid('b')).toBe(false);
      expect(ti.enum(NumberEnum, ti.number).isValid('c')).toBe(false);
      expect(ti.enum(StringEnum, ti.string).isValid(0)).toBe(false);
      expect(ti.enum(StringEnum, ti.string).isValid(1)).toBe(false);
      expect(ti.enum(StringEnum, ti.string).isValid(2)).toBe(false);

      expect(ti.enum(NumberEnum).isValid('a')).toBe(false);
      expect(ti.enum(NumberEnum).isValid('b')).toBe(false);
      expect(ti.enum(NumberEnum).isValid('c')).toBe(false);
      expect(ti.enum(StringEnum).isValid(0)).toBe(false);
      expect(ti.enum(StringEnum).isValid(1)).toBe(false);
      expect(ti.enum(StringEnum).isValid(2)).toBe(false);

      expect(ti.enum(NumberEnum, ti.number).isValid(3)).toBe(false);
      expect(ti.enum(StringEnum, ti.string).isValid('d')).toBe(false);

      expect(ti.enum(NumberEnum, ti.number.accept(1,2)).isValid(0)).toBe(false);
      expect(ti.enum(StringEnum, ti.string.accept('a', 'b')).isValid('c')).toBe(false);
    }
  );
});
