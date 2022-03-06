import { JestClassExtended } from 'jest-class-extended';
import { InspectorGadget } from '../../../src/inspectorGadget';
import { NumberValidator } from '../../../src/validator/number';

const ig = new InspectorGadget();
const jce = new JestClassExtended(NumberValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    6,
    () => {
      expect(ig.number.isValid(42)).toBe(true);
      expect(ig.number.isValid(1 + 1)).toBe(true);
      expect(ig.number.isValid(0)).toBe(true);
      expect(ig.number.isValid(-42)).toBe(true);
      expect(ig.number.isValid(NaN)).toBe(true);
      expect(ig.number.isValid(Infinity)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    7,
    () => {
      expect(ig.number.isValid(undefined)).toBe(false);
      expect(ig.number.isValid(null)).toBe(false);
      expect(ig.number.isValid('42')).toBe(false);
      expect(ig.number.isValid(true)).toBe(false);
      expect(ig.number.isValid({ oh: 'no' })).toBe(false);
      expect(ig.number.isValid(/.*oh.*no:+/)).toBe(false);
      expect(ig.number.isValid(() => ({ oh: 'no' }))).toBe(false);
    }
  );

  jce.test(
    ['isValid', 'correct conditions'],
    13,
    () => {
      expect(ig.number.positive.isValid(42)).toBe(true);
      expect(ig.number.negative.isValid(-42)).toBe(true);
      expect(ig.number.rejectZero.isValid(42)).toBe(true);
      expect(ig.number.rejectZero.isValid(-42)).toBe(true);
      expect(ig.number.min(-42).max(42).isValid(42)).toBe(true);
      expect(ig.number.min(-42).max(42).isValid(-42)).toBe(true);
      expect(ig.number.accept(42, -42).isValid(42)).toBe(true);
      expect(ig.number.accept(42, -42).isValid(-42)).toBe(true);
      expect(ig.number.deny(-42).isValid(42)).toBe(true);
      expect(ig.number.deny(42).isValid(-42)).toBe(true);
      expect(ig.number.rejectInfinity.isValid(NaN)).toBe(true);
      expect(ig.number.rejectNaN.isValid(Infinity)).toBe(true);
      expect(ig.number.custom(value_ => value_ === 42 ? undefined : 'invalid').isValid(42)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'incorrect conditions'],
    13,
    () => {
      expect(ig.number.positive.isValid(-42)).toBe(false);
      expect(ig.number.negative.isValid(42)).toBe(false);
      expect(ig.number.rejectZero.isValid(0)).toBe(false);
      expect(ig.number.min(42).max(-42).isValid(42)).toBe(false);
      expect(ig.number.min(-42).max(42).isValid(-43)).toBe(false);
      expect(ig.number.min(-42).max(42).isValid(43)).toBe(false);
      expect(ig.number.accept(-42).isValid(42)).toBe(false);
      expect(ig.number.accept(42).isValid(-42)).toBe(false);
      expect(ig.number.deny(42).isValid(42)).toBe(false);
      expect(ig.number.deny(-42).isValid(-42)).toBe(false);
      expect(ig.number.rejectInfinity.isValid(Infinity)).toBe(false);
      expect(ig.number.rejectNaN.isValid(NaN)).toBe(false);
      expect(ig.number.custom(value_ => value_ === -42 ? undefined : 'invalid').isValid(42)).toBe(false);
    }
  );
});
