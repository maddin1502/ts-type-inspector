import { describe, expect, test } from 'vitest';
import { ExtendedValidationParametersValidator } from '../testTypes.js';

describe(ExtendedValidationParametersValidator, () => {
  test('extended validation params', () => {
    expect.assertions(8);
    const evpv = new ExtendedValidationParametersValidator()
      .extendedFailureCondition;
    expect(evpv.isValid(undefined)).toBe(true);
    expect(() => evpv.validate(undefined)).not.toThrow();
    expect(evpv.isValid(undefined, { failOn: 'condition' })).toBe(false);
    expect(() => evpv.validate(undefined, { failOn: 'condition' })).toThrow(
      'extended failure on condition'
    );
    expect(evpv.isValid(undefined, { failOn: 'custom' })).toBe(false);
    expect(() => evpv.validate(undefined, { failOn: 'custom' })).toThrow(
      'extended failure on custom'
    );
    expect(evpv.isValid(undefined, { failOn: 'validate' })).toBe(false);
    expect(() => evpv.validate(undefined, { failOn: 'validate' })).toThrow(
      'extended failure on validate'
    );
  });
});
