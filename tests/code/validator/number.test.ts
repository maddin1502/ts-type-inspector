import { JestClassExtended } from 'jest-class-extended';
import { TypeInspector } from '../../../src/inspector';
import { NumberValidator } from '../../../src/validator/number';

const ti = new TypeInspector();
const jce = new JestClassExtended(NumberValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    6,
    () => {
      expect(ti.number.isValid(42)).toBe(true);
      expect(ti.number.isValid(1 + 1)).toBe(true);
      expect(ti.number.isValid(0)).toBe(true);
      expect(ti.number.isValid(-42)).toBe(true);
      expect(ti.number.isValid(NaN)).toBe(true);
      expect(ti.number.isValid(Infinity)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    7,
    () => {
      expect(ti.number.isValid(undefined)).toBe(false);
      expect(ti.number.isValid(null)).toBe(false);
      expect(ti.number.isValid('42')).toBe(false);
      expect(ti.number.isValid(true)).toBe(false);
      expect(ti.number.isValid({ oh: 'no' })).toBe(false);
      expect(ti.number.isValid(/.*oh.*no:+/)).toBe(false);
      expect(ti.number.isValid(() => ({ oh: 'no' }))).toBe(false);
    }
  );

  jce.test(
    ['isValid', 'correct conditions'],
    14,
    () => {
      expect(ti.number.positive.isValid(42)).toBe(true);
      expect(ti.number.negative.isValid(-42)).toBe(true);
      expect(ti.number.rejectZero.isValid(42)).toBe(true);
      expect(ti.number.rejectZero.isValid(-42)).toBe(true);
      expect(ti.number.min(-42).max(42).isValid(42)).toBe(true);
      expect(ti.number.min(-42).max(42).isValid(-42)).toBe(true);
      expect(ti.number.accept(42, -42).isValid(42)).toBe(true);
      expect(ti.number.accept(42, -42).isValid(-42)).toBe(true);
      expect(ti.number.reject(-42).isValid(42)).toBe(true);
      expect(ti.number.reject(42).isValid(-42)).toBe(true);
      expect(ti.number.rejectInfinity.isValid(NaN)).toBe(true);
      expect(ti.number.rejectNaN.isValid(Infinity)).toBe(true);
      expect(ti.number.custom(value_ => value_ === 42 ? undefined : 'invalid').isValid(42)).toBe(true);
      expect(ti.number.finite.isValid(42)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'incorrect conditions'],
    14,
    () => {
      expect(ti.number.positive.isValid(-42)).toBe(false);
      expect(ti.number.negative.isValid(42)).toBe(false);
      expect(ti.number.rejectZero.isValid(0)).toBe(false);
      expect(ti.number.min(42).max(-42).isValid(42)).toBe(false);
      expect(ti.number.min(-42).max(42).isValid(-43)).toBe(false);
      expect(ti.number.min(-42).max(42).isValid(43)).toBe(false);
      expect(ti.number.accept(-42).isValid(42)).toBe(false);
      expect(ti.number.accept(42).isValid(-42)).toBe(false);
      expect(ti.number.reject(42).isValid(42)).toBe(false);
      expect(ti.number.reject(-42).isValid(-42)).toBe(false);
      expect(ti.number.rejectInfinity.isValid(Infinity)).toBe(false);
      expect(ti.number.rejectNaN.isValid(NaN)).toBe(false);
      expect(ti.number.custom(value_ => value_ === -42 ? undefined : 'invalid').isValid(42)).toBe(false);
      expect(ti.number.finite.isValid(Infinity)).toBe(false);
    }
  );
});
