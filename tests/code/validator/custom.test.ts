import { describe, expect, test } from 'vitest';
import { TypeInspector } from '../../../src/inspector';
import { CustomValidator } from '../../../src/validator/custom';

const ti = new TypeInspector();

describe(CustomValidator.name, () => {
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
