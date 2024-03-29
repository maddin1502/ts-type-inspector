import { TypeInspector } from '@/inspector.js';
import { CustomValidator } from '@/validator/custom.js';
import { describe, expect, test } from 'vitest';

const ti = new TypeInspector();

describe(CustomValidator, () => {
  test('isValid', () => {
    expect.assertions(2);
    expect(
      ti
        .custom((value_) => {
          if (value_ !== 42) {
            return 'this is not the answer';
          }
        })
        .isValid(42)
    ).toBe(true);

    expect(
      ti
        .custom((value_) => {
          if (value_ !== 42) {
            return 'this is not the answer';
          }
        })
        .isValid(24)
    ).toBe(false);
  });
});
