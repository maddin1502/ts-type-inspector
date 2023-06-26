import { describe, expect, test } from 'vitest';
import { ValidationError } from '../../src/error';
import { TypeInspector } from '../../src/inspector';

const ti = new TypeInspector();

describe(() => {
  test('object - failure - complex property path', () => {
    expect.assertions(2);
    try {
      ti.object({
        prop1: ti.array(
          ti.object({
            prop2: ti.object({
              prop3: ti.array(ti.boolean)
            })
          })
        )
      }).validate({
        prop1: [
          {
            prop2: {
              prop3: [false, 42]
            }
          }
        ]
      });
    } catch (error) {
      const validationError = error as ValidationError;
      expect(validationError.message).toBe('value is not a boolean');
      expect(validationError.propertyPath).toBe('prop1.0.prop2.prop3.1');
    }
  });

  test('object - success - complex property path - refrence', () => {
    expect.assertions(1);
    const unknown = {
      prop1: [
        {
          prop2: {
            prop3: [false, true]
          }
        }
      ]
    };
    const value = ti
      .object({
        prop1: ti.array(
          ti.object({
            prop2: ti.object({
              prop3: ti.array(ti.boolean)
            })
          })
        )
      })
      .validate(unknown);

    expect(value).toBe(unknown);
  });

  test('object - failure - complex property path - custom error', () => {
    expect.assertions(2);
    try {
      ti.object({
        prop1: ti.array(
          ti.object({
            prop2: ti.object({
              prop3: ti.array(ti.boolean.onError(() => 'bad value'))
            })
          })
        )
      }).validate({
        prop1: [
          {
            prop2: {
              prop3: [false, 42]
            }
          }
        ]
      });
    } catch (error) {
      const validationError = error as ValidationError;
      expect(validationError.message).toBe('bad value');
      expect(validationError.propertyPath).toBe('prop1.0.prop2.prop3.1');
    }
  });

  test('object - failure - complex property path - custom error callback', () => {
    expect.assertions(2);
    try {
      ti.object({
        prop1: ti.array(
          ti.object({
            prop2: ti.object({
              prop3: ti.array(ti.boolean.onError(() => 'bad value'))
            })
          })
        )
      }).validate({
        prop1: [
          {
            prop2: {
              prop3: [false, 42]
            }
          }
        ]
      });
    } catch (error) {
      const validationError = error as ValidationError;
      expect(validationError.message).toBe('bad value');
      expect(validationError.propertyPath).toBe('prop1.0.prop2.prop3.1');
    }
  });

  test('object - failure - complex property path - isValid', () => {
    expect.assertions(4);
    const validator = ti.object({
      prop1: ti.array(
        ti.object({
          prop2: ti.object({
            prop3: ti.array(ti.boolean)
          })
        })
      )
    });

    const isValid = validator.isValid({
      prop1: [
        {
          prop2: {
            prop3: [false, 42]
          }
        }
      ]
    });

    expect(isValid).toBe(false);
    expect(validator.validationError).toBeDefined();
    expect(validator.validationError?.message).toBe('value is not a boolean');
    expect(validator.validationError?.propertyPath).toBe(
      'prop1.0.prop2.prop3.1'
    );
  });

  test('object - failure - complex property path - isValid - recursive', () => {
    expect.assertions(19);
    const booleanValidator = ti.boolean;
    const array2validator = ti.array(booleanValidator);
    const object3Validator = ti.object({
      prop3: array2validator
    });
    const object2Validator = ti.object({
      prop2: object3Validator
    });
    const array1Validator = ti.array(object2Validator);
    const object1Validator = ti.object({
      prop1: array1Validator
    });

    const isValid = object1Validator.isValid({
      prop1: [
        {
          prop2: {
            prop3: [false, 42]
          }
        }
      ]
    });

    expect(isValid).toBe(false);
    expect(object1Validator.validationError).toBeDefined();
    expect(object1Validator.validationError?.message).toBe(
      'value is not a boolean'
    );
    expect(object1Validator.validationError?.propertyPath).toBe(
      'prop1.0.prop2.prop3.1'
    );
    expect(array1Validator.validationError).toBeDefined();
    expect(array1Validator.validationError?.message).toBe(
      'value is not a boolean'
    );
    expect(array1Validator.validationError?.propertyPath).toBe(
      '0.prop2.prop3.1'
    );
    expect(object2Validator.validationError).toBeDefined();
    expect(object2Validator.validationError?.message).toBe(
      'value is not a boolean'
    );
    expect(object2Validator.validationError?.propertyPath).toBe(
      'prop2.prop3.1'
    );
    expect(object3Validator.validationError).toBeDefined();
    expect(object3Validator.validationError?.message).toBe(
      'value is not a boolean'
    );
    expect(object3Validator.validationError?.propertyPath).toBe('prop3.1');
    expect(array2validator.validationError).toBeDefined();
    expect(array2validator.validationError?.message).toBe(
      'value is not a boolean'
    );
    expect(array2validator.validationError?.propertyPath).toBe('1');
    expect(booleanValidator.validationError).toBeDefined();
    expect(booleanValidator.validationError?.message).toBe(
      'value is not a boolean'
    );
    expect(booleanValidator.validationError?.propertyPath).toBeUndefined();
  });

  test('object - failure - complex property path - custom validation', () => {
    expect.assertions(4);
    const validator = ti.object({
      prop1: ti.array(
        ti.object({
          prop2: ti.object({
            prop3: ti.array(
              ti.number.custom((value_) =>
                value_ % 7 === 0
                  ? undefined
                  : 'the number is not divisible by 7'
              )
            )
          })
        })
      )
    });

    const isValid = validator.isValid({
      prop1: [
        {
          prop2: {
            prop3: [7, 14, 21, 27]
          }
        }
      ]
    });

    expect(isValid).toBe(false);
    expect(validator.validationError).toBeDefined();
    expect(validator.validationError?.message).toBe(
      'the number is not divisible by 7'
    );
    expect(validator.validationError?.propertyPath).toBe(
      'prop1.0.prop2.prop3.3'
    );
  });

  test('dictionary - failure - complex property path', () => {
    expect.assertions(2);
    try {
      ti.dictionary(
        ti.array(ti.dictionary(ti.dictionary(ti.array(ti.boolean))))
      ).validate({
        prop1: [
          {
            prop2: {
              prop3: [false, 42]
            }
          }
        ]
      });
    } catch (error) {
      const validationError = error as ValidationError;
      expect(validationError.message).toBe('value is not a boolean');
      expect(validationError.propertyPath).toBe('prop1.0.prop2.prop3.1');
    }
  });

  test('dictionary - failure - complex property path - custom error', () => {
    expect.assertions(2);
    try {
      ti.dictionary(
        ti.array(
          ti.dictionary(
            ti.dictionary(ti.array(ti.boolean.onError(() => 'bad value')))
          )
        )
      ).validate({
        prop1: [
          {
            prop2: {
              prop3: [false, 42]
            }
          }
        ]
      });
    } catch (error) {
      const validationError = error as ValidationError;
      expect(validationError.message).toBe('bad value');
      expect(validationError.propertyPath).toBe('prop1.0.prop2.prop3.1');
    }
  });

  test('dictionary - failure - complex property path - isValid', () => {
    expect.assertions(4);
    const validator = ti.dictionary(
      ti.array(ti.dictionary(ti.dictionary(ti.array(ti.boolean))))
    );

    const isValid = validator.isValid({
      prop1: [
        {
          prop2: {
            prop3: [false, 42]
          }
        }
      ]
    });

    expect(isValid).toBe(false);
    expect(validator.validationError).toBeDefined();
    expect(validator.validationError?.message).toBe('value is not a boolean');
    expect(validator.validationError?.propertyPath).toBe(
      'prop1.0.prop2.prop3.1'
    );
  });

  test('dictionary - failure - complex property path - isValid - recursive', () => {
    expect.assertions(19);
    const booleanValidator = ti.boolean;
    const array2validator = ti.array(booleanValidator);
    const dictionary3Validator = ti.dictionary(array2validator);
    const dictionary2Validator = ti.dictionary(dictionary3Validator);
    const array1Validator = ti.array(dictionary2Validator);
    const dictionary1Validator = ti.dictionary(array1Validator);

    const isValid = dictionary1Validator.isValid({
      prop1: [
        {
          prop2: {
            prop3: [false, 42]
          }
        }
      ]
    });

    expect(isValid).toBe(false);
    expect(dictionary1Validator.validationError).toBeDefined();
    expect(dictionary1Validator.validationError?.message).toBe(
      'value is not a boolean'
    );
    expect(dictionary1Validator.validationError?.propertyPath).toBe(
      'prop1.0.prop2.prop3.1'
    );
    expect(array1Validator.validationError).toBeDefined();
    expect(array1Validator.validationError?.message).toBe(
      'value is not a boolean'
    );
    expect(array1Validator.validationError?.propertyPath).toBe(
      '0.prop2.prop3.1'
    );
    expect(dictionary2Validator.validationError).toBeDefined();
    expect(dictionary2Validator.validationError?.message).toBe(
      'value is not a boolean'
    );
    expect(dictionary2Validator.validationError?.propertyPath).toBe(
      'prop2.prop3.1'
    );
    expect(dictionary3Validator.validationError).toBeDefined();
    expect(dictionary3Validator.validationError?.message).toBe(
      'value is not a boolean'
    );
    expect(dictionary3Validator.validationError?.propertyPath).toBe('prop3.1');
    expect(array2validator.validationError).toBeDefined();
    expect(array2validator.validationError?.message).toBe(
      'value is not a boolean'
    );
    expect(array2validator.validationError?.propertyPath).toBe('1');
    expect(booleanValidator.validationError).toBeDefined();
    expect(booleanValidator.validationError?.message).toBe(
      'value is not a boolean'
    );
    expect(booleanValidator.validationError?.propertyPath).toBeUndefined();
  });

  test('dictionary - failure - complex property path - custom validation', () => {
    expect.assertions(4);
    const validator = ti.dictionary(
      ti.array(
        ti.dictionary(
          ti.dictionary(
            ti.array(
              ti.number.custom((value_) =>
                value_ % 7 === 0
                  ? undefined
                  : 'the number is not divisible by 7'
              )
            )
          )
        )
      )
    );

    const isValid = validator.isValid({
      prop1: [
        {
          prop2: {
            prop3: [7, 14, 21, 27]
          }
        }
      ]
    });

    expect(isValid).toBe(false);
    expect(validator.validationError).toBeDefined();
    expect(validator.validationError?.message).toBe(
      'the number is not divisible by 7'
    );
    expect(validator.validationError?.propertyPath).toBe(
      'prop1.0.prop2.prop3.3'
    );
  });

  test('dictionary - failure - unknown error', () => {
    expect.assertions(1);
    const validator = ti.dictionary(
      ti.array(
        ti.dictionary(
          ti.dictionary(
            ti.array(
              ti.number.custom(() => {
                throw new Error('something went really wrong');
              })
            )
          )
        )
      )
    );

    expect(() => {
      validator.validate({
        prop1: [
          {
            prop2: {
              prop3: [42]
            }
          }
        ]
      });
    }).toThrow('something went really wrong');
  });

  test('object - failure - strict, optional, array', () => {
    expect.assertions(4);
    const validator = ti.object({
      prop1: ti.array(
        ti.object({
          prop11: ti.undefined,
          prop12: ti.object({
            prop121: ti.optional(ti.array(ti.strict(42)))
          })
        })
      ),
      prop2: ti.number
    });

    const isValid = validator.isValid({
      prop1: [
        {
          prop11: undefined,
          prop12: {
            prop121: [42]
          }
        },
        {
          prop11: undefined,
          prop12: {
            prop121: [42, 42, 41, 42]
          }
        }
      ],
      prop2: 42
    });

    expect(isValid).toBe(false);
    expect(validator.validationError).toBeDefined();
    expect(validator.validationError?.message).toBe('no equality found');
    expect(validator.validationError?.propertyPath).toBe(
      'prop1.1.prop12.prop121.2'
    );
  });

  test('object - failure - unexpected exceptions', () => {
    expect.assertions(3);
    class ErrorReason {
      private _number = 42;
      public get prop(): number {
        if (this._number === 42) {
          throw new Error('simple error');
        }

        return this._number;
      }
    }

    expect(() =>
      ti.object<ErrorReason>({ prop: ti.number }).validate(new ErrorReason())
    ).toThrow('simple error');

    class MessageReason {
      private _number = 42;
      public get prop(): number {
        if (this._number === 42) {
          throw { message: 'message error' };
        }

        return this._number;
      }
    }

    expect(() =>
      ti
        .object<MessageReason>({ prop: ti.number })
        .validate(new MessageReason())
    ).toThrow('message error');

    class UnknownReason {
      private _number = 42;
      public get prop(): number {
        if (this._number === 42) {
          throw 42;
        }

        return this._number;
      }
    }

    expect(() =>
      ti
        .object<UnknownReason>({ prop: ti.number })
        .validate(new UnknownReason())
    ).toThrow('unknown error');
  });
});
