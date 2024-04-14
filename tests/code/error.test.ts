import { ValidationError, isValidationError } from '@/error.js';
import { describe, expect, test } from 'vitest';

describe(ValidationError, () => {
  test('isValidationError', () => {
    expect.assertions(2);
    expect(isValidationError(new Error())).toBe(false);
    expect(isValidationError(new ValidationError(''))).toBe(true);
  });
});
