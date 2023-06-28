import { describe, expect, test } from 'vitest';
import { TypeInspector } from '../../../src/inspector.js';
import { ArrayValidator } from '../../../src/validator/array.js';

const ti = new TypeInspector();

describe(ArrayValidator.name, () => {
  test('isValid - success', () => {
    expect.assertions(3);
    expect(ti.array(ti.number).isValid([1, 2, 42])).toBe(true);
    expect(ti.array(ti.string).isValid(['1', '2', '42'])).toBe(true);
    expect(ti.array(ti.undefined).isValid([])).toBe(true);
  });

  test('isValid - failure', () => {
    expect.assertions(6);
    expect(ti.array(ti.number).isValid(['1', '2', '42'])).toBe(false);
    expect(ti.array(ti.number).isValid([1, 2, '42'])).toBe(false);
    expect(ti.array(ti.string).isValid([1, 2, 42])).toBe(false);
    expect(ti.array(ti.string).isValid(['1', '2', 42])).toBe(false);
    expect(ti.array(ti.undefined).isValid(['1', 2])).toBe(false);
    expect(ti.array(ti.number).isValid(43)).toBe(false);
  });

  test('isValid - correct conditions', () => {
    expect.assertions(5);
    expect(ti.array(ti.number).length(1).isValid([42])).toBe(true);
    expect(ti.array(ti.string).length(3).isValid(['1', '2', '42'])).toBe(true);
    expect(ti.array(ti.string).min(2).max(4).isValid(['1', '2', '42'])).toBe(
      true
    );
    expect(
      ti.array(ti.string).accept('1', '2', '42').isValid(['1', '2', '42'])
    ).toBe(true);
    expect(
      ti.array(ti.string).reject('3', '4', '24').isValid(['1', '2', '42'])
    ).toBe(true);
  });

  test('isValid - incorrect conditions', () => {
    expect.assertions(7);
    expect(ti.array(ti.number).length(3).isValid([42])).toBe(false);
    expect(ti.array(ti.string).length(1).isValid(['1', '2', '42'])).toBe(false);
    expect(ti.array(ti.string).min(2).isValid(['42'])).toBe(false);
    expect(ti.array(ti.string).max(2).isValid(['1', '2', '42'])).toBe(false);
    expect(
      ti.array(ti.string).accept('1', '2', '24').isValid(['1', '2', '42'])
    ).toBe(false);
    expect(
      ti.array(ti.string).reject('3', '4', '42').isValid(['1', '2', '42'])
    ).toBe(false);
    expect(ti.array(ti.string).isValid({ length: 2 })).toBe(false);
  });
});
