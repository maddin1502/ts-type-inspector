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
    6,
    () => {
      expect(ti.enum(NumberEnum).isValid(0)).toBe(true);
      expect(ti.enum(NumberEnum).isValid(1)).toBe(true);
      expect(ti.enum(NumberEnum).isValid(2)).toBe(true);
      expect(ti.enum(StringEnum).isValid('a')).toBe(true);
      expect(ti.enum(StringEnum).isValid('b')).toBe(true);
      expect(ti.enum(StringEnum).isValid('c')).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'correct conditions'],
    6,
    () => {
      expect(ti.enum(NumberEnum).values(ti.number).isValid(0)).toBe(true);
      expect(ti.enum(NumberEnum).values(ti.number.accept(NumberEnum.b)).isValid(1)).toBe(true);
      expect(ti.enum(NumberEnum).values(ti.number.accept(2)).isValid(2)).toBe(true);
      expect(ti.enum(StringEnum).values(ti.string).isValid('a')).toBe(true);
      expect(ti.enum(StringEnum).values(ti.string.accept(StringEnum.b)).isValid('b')).toBe(true);
      expect(ti.enum(StringEnum).values(ti.string.accept('c')).isValid('c')).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    6,
    () => {
      expect(ti.enum(NumberEnum).isValid('a')).toBe(false);
      expect(ti.enum(NumberEnum).isValid('b')).toBe(false);
      expect(ti.enum(NumberEnum).isValid('c')).toBe(false);
      expect(ti.enum(StringEnum).isValid(0)).toBe(false);
      expect(ti.enum(StringEnum).isValid(1)).toBe(false);
      expect(ti.enum(StringEnum).isValid(2)).toBe(false);
    }
  );

  jce.test(
    ['isValid', 'incorrect conditions'],
    4,
    () => {
      expect(ti.enum(NumberEnum).values(ti.number.reject(NumberEnum.a)).isValid(0)).toBe(false);
      expect(ti.enum(StringEnum).values(ti.string.reject(StringEnum.a)).isValid('a')).toBe(false);
      expect(ti.enum(NumberEnum).values(ti.number.accept(1,2)).isValid(0)).toBe(false);
      expect(ti.enum(StringEnum).values(ti.string.accept('a', 'b')).isValid('c')).toBe(false);
    }
  );
});
