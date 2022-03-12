import { JestClassExtended } from 'jest-class-extended';
import { TypeInspector } from '../../../src/inspector';
import { ArrayValidator } from '../../../src/validator/array';

const ti = new TypeInspector();
const jce = new JestClassExtended(ArrayValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    3,
    () => {
      expect(ti.array(ti.number).isValid([1, 2, 42])).toBe(true);
      expect(ti.array(ti.string).isValid(['1', '2', '42'])).toBe(true);
      expect(ti.array(ti.undefined).isValid([])).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    6,
    () => {
      expect(ti.array(ti.number).isValid(['1', '2', '42'])).toBe(false);
      expect(ti.array(ti.number).isValid([1, 2, '42'])).toBe(false);
      expect(ti.array(ti.string).isValid([1, 2, 42])).toBe(false);
      expect(ti.array(ti.string).isValid(['1', '2', 42])).toBe(false);
      expect(ti.array(ti.undefined).isValid(['1', 2])).toBe(false);
      expect(ti.array(ti.number).isValid(43)).toBe(false);
    }
  );

  jce.test(
    ['isValid', 'correct conditions'],
    5,
    () => {
      expect(ti.array(ti.number).length(1).isValid([42])).toBe(true);
      expect(ti.array(ti.string).length(3).isValid(['1', '2', '42'])).toBe(true);
      expect(ti.array(ti.string).min(2).max(4).isValid(['1', '2', '42'])).toBe(true);
      expect(ti.array(ti.string).accept('1', '2', '42').isValid(['1', '2', '42'])).toBe(true);
      expect(ti.array(ti.string).reject('3', '4', '24').isValid(['1', '2', '42'])).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'incorrect conditions'],
    7,
    () => {
      expect(ti.array(ti.number).length(3).isValid([42])).toBe(false);
      expect(ti.array(ti.string).length(1).isValid(['1', '2', '42'])).toBe(false);
      expect(ti.array(ti.string).min(2).isValid(['42'])).toBe(false);
      expect(ti.array(ti.string).max(2).isValid(['1', '2', '42'])).toBe(false);
      expect(ti.array(ti.string).accept('1', '2', '24').isValid(['1', '2', '42'])).toBe(false);
      expect(ti.array(ti.string).reject('3', '4', '42').isValid(['1', '2', '42'])).toBe(false);
      expect(ti.array(ti.string).isValid({ length: 2 })).toBe(false);
    }
  );
});
