import { describe, expect, test } from 'vitest';
import { ExtendedValidationParametersValidator } from './testTypes.js';

describe(ExtendedValidationParametersValidator, () => {
  test('extended validation params', () => {
    expect.assertions(8);
    const evpv = new ExtendedValidationParametersValidator()
      .extendedFailureCondition;
    expect(evpv.isValid('42')).toBe(true);
    expect(() => evpv.validate('42')).not.toThrow();
    expect(evpv.isValid('24', { failOn: 'condition' })).toBe(false);
    expect(() => evpv.validate('24', { failOn: 'condition' })).toThrow(
      'extended failure on condition'
    );
    expect(evpv.isValid('24', { failOn: 'custom' })).toBe(false);
    expect(() => evpv.validate('24', { failOn: 'custom' })).toThrow(
      'extended failure on custom'
    );
    expect(evpv.isValid('24', { failOn: 'validate' })).toBe(false);
    expect(() => evpv.validate('24', { failOn: 'validate' })).toThrow(
      'extended failure on validate'
    );
  });
});
