import { JestClassExtended } from 'jest-class-extended';
import tva from '../../../src';
import { NumberValidator } from '../../../src/validator/number';

const jce = new JestClassExtended(NumberValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    4,
    () => {
      expect(tva.number.isValid(42)).toBe(true);
      expect(tva.number.isValid(1+1)).toBe(true);
      expect(tva.number.isValid(0)).toBe(true);
      expect(tva.number.isValid(-42)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    9,
    () => {
      expect(tva.number.isValid(undefined)).toBe(false);
      expect(tva.number.isValid(null)).toBe(false);
      expect(tva.number.isValid('42')).toBe(false);
      expect(tva.number.isValid(NaN)).toBe(false);
      expect(tva.number.isValid(Infinity)).toBe(false);
      expect(tva.number.isValid(true)).toBe(false);
      expect(tva.number.isValid({ oh: 'no'})).toBe(false);
      expect(tva.number.isValid(/.*oh.*no:+/)).toBe(false);
      expect(tva.number.isValid(() => ({ oh: 'no'}))).toBe(false);
    }
  );

  jce.test(
    ['isValid', 'correct conditions'],
    13,
    () => {
      expect(tva.number.positive.isValid(42)).toBe(true);
      expect(tva.number.negative.isValid(-42)).toBe(true);
      expect(tva.number.notZero.isValid(42)).toBe(true);
      expect(tva.number.notZero.isValid(-42)).toBe(true);
      expect(tva.number.min(-42).max(42).isValid(42)).toBe(true);
      expect(tva.number.min(-42).max(42).isValid(-42)).toBe(true);
      expect(tva.number.allow(42, -42).isValid(42)).toBe(true);
      expect(tva.number.allow(42, -42).isValid(-42)).toBe(true);
      expect(tva.number.deny(-42).isValid(42)).toBe(true);
      expect(tva.number.deny(42).isValid(-42)).toBe(true);
      expect(tva.number.allowInfinity.isValid(Infinity)).toBe(true);
      expect(tva.number.allowNaN.isValid(NaN)).toBe(true);
      expect(tva.number.custom(value_ => value_ === 42 ? undefined : 'invalid').isValid(42)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'incorrect conditions'],
    11,
    () => {
      expect(tva.number.positive.isValid(-42)).toBe(false);
      expect(tva.number.negative.isValid(42)).toBe(false);
      expect(tva.number.notZero.isValid(0)).toBe(false);
      expect(tva.number.min(42).max(-42).isValid(42)).toBe(false);
      expect(tva.number.min(-42).max(42).isValid(-43)).toBe(false);
      expect(tva.number.min(-42).max(42).isValid(43)).toBe(false);
      expect(tva.number.allow(-42).isValid(42)).toBe(false);
      expect(tva.number.allow(42).isValid(-42)).toBe(false);
      expect(tva.number.deny(42).isValid(42)).toBe(false);
      expect(tva.number.deny(-42).isValid(-42)).toBe(false);
      expect(tva.number.custom(value_ => value_ === -42 ? undefined : 'invalid').isValid(42)).toBe(false);
    }
  );
});
