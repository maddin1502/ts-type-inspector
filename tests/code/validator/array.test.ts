import { JestClassExtended } from 'jest-class-extended';
import tva from '../../../src';
import { ArrayValidator } from '../../../src/validator/array';

const jce = new JestClassExtended(ArrayValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    3,
    () => {
      expect(tva.array(tva.number).isValid([1, 2, 42 ])).toBe(true);
      expect(tva.array(tva.string).isValid(['1', '2', '42'])).toBe(true);
      expect(tva.array(tva.undefined).isValid([])).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    6,
    () => {
      expect(tva.array(tva.number).isValid(['1', '2', '42'])).toBe(false);
      expect(tva.array(tva.number).isValid([1, 2, '42'])).toBe(false);
      expect(tva.array(tva.string).isValid([1, 2 ,42 ])).toBe(false);
      expect(tva.array(tva.string).isValid(['1', '2' ,42 ])).toBe(false);
      expect(tva.array(tva.undefined).isValid(['1', 2])).toBe(false);
      expect(tva.array(tva.number).isValid(43)).toBe(false);
    }
  );

  jce.test(
    ['isValid', 'correct conditions'],
    5,
    () => {
      expect(tva.array(tva.number).length(1).isValid([ 42 ])).toBe(true);
      expect(tva.array(tva.string).length(3).isValid(['1', '2', '42'])).toBe(true);
      expect(tva.array(tva.string).min(2).max(4).isValid(['1', '2', '42'])).toBe(true);
      expect(tva.array(tva.string).allow('1', '2', '42').isValid(['1', '2', '42'])).toBe(true);
      expect(tva.array(tva.string).deny('3', '4', '24').isValid(['1', '2', '42'])).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'incorrect conditions'],
    5,
    () => {
      expect(tva.array(tva.number).length(3).isValid([ 42 ])).toBe(false);
      expect(tva.array(tva.string).length(1).isValid(['1', '2', '42'])).toBe(false);
      expect(tva.array(tva.string).max(2).isValid(['1', '2', '42'])).toBe(false);
      expect(tva.array(tva.string).allow('1', '2', '24').isValid(['1', '2', '42'])).toBe(false);
      expect(tva.array(tva.string).deny('3', '4', '42').isValid(['1', '2', '42'])).toBe(false);
    }
  );
});
