import { JestClassExtended } from 'jest-class-extended';
import { InspectorGadget } from '../../../src/inspectorGadget';
import { ArrayValidator } from '../../../src/validator/array';

const ig = new InspectorGadget();
const jce = new JestClassExtended(ArrayValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    3,
    () => {
      expect(ig.array(ig.number).isValid([1, 2, 42])).toBe(true);
      expect(ig.array(ig.string).isValid(['1', '2', '42'])).toBe(true);
      expect(ig.array(ig.undefined).isValid([])).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    6,
    () => {
      expect(ig.array(ig.number).isValid(['1', '2', '42'])).toBe(false);
      expect(ig.array(ig.number).isValid([1, 2, '42'])).toBe(false);
      expect(ig.array(ig.string).isValid([1, 2, 42])).toBe(false);
      expect(ig.array(ig.string).isValid(['1', '2', 42])).toBe(false);
      expect(ig.array(ig.undefined).isValid(['1', 2])).toBe(false);
      expect(ig.array(ig.number).isValid(43)).toBe(false);
    }
  );

  jce.test(
    ['isValid', 'correct conditions'],
    5,
    () => {
      expect(ig.array(ig.number).length(1).isValid([42])).toBe(true);
      expect(ig.array(ig.string).length(3).isValid(['1', '2', '42'])).toBe(true);
      expect(ig.array(ig.string).min(2).max(4).isValid(['1', '2', '42'])).toBe(true);
      expect(ig.array(ig.string).accept('1', '2', '42').isValid(['1', '2', '42'])).toBe(true);
      expect(ig.array(ig.string).reject('3', '4', '24').isValid(['1', '2', '42'])).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'incorrect conditions'],
    7,
    () => {
      expect(ig.array(ig.number).length(3).isValid([42])).toBe(false);
      expect(ig.array(ig.string).length(1).isValid(['1', '2', '42'])).toBe(false);
      expect(ig.array(ig.string).min(2).isValid(['42'])).toBe(false);
      expect(ig.array(ig.string).max(2).isValid(['1', '2', '42'])).toBe(false);
      expect(ig.array(ig.string).accept('1', '2', '24').isValid(['1', '2', '42'])).toBe(false);
      expect(ig.array(ig.string).reject('3', '4', '42').isValid(['1', '2', '42'])).toBe(false);
      expect(ig.array(ig.string).isValid({ length: 2 })).toBe(false);
    }
  );
});
