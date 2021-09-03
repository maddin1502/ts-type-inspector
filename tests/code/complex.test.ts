import { JestClassExtended } from 'jest-class-extended';
import tva, { TypedValueApprover } from '../../src';
import { ValidationError } from '../../src/error';

const jce = new JestClassExtended(TypedValueApprover);

jce.describe(() => {
  jce.test(
    ['object', 'failure - complex property path'],
    2,
    () => {
      try {
        tva.object({
          prop1: tva.array(
            tva.object({
              prop2: tva.object({
                prop3: tva.array(
                  tva.boolean
                )
              })
            })
          )
        }).validate({
          prop1: [{
            prop2: {
              prop3: [false, 42]
            }
          }]
        });
      } catch (error) {
        const validationError = error as ValidationError;
        expect(validationError.message).toBe('value is not a boolean');
        expect(validationError.propertyPath).toBe('prop1.0.prop2.prop3.1');
      }
    }
  );

  jce.test(
    ['object', 'success - complex property path - refrence'],
    1,
    () => {
      const unknown = {
        prop1: [{
          prop2: {
            prop3: [false, true]
          }
        }]
      };
      const value = tva.object({
        prop1: tva.array(
          tva.object({
            prop2: tva.object({
              prop3: tva.array(
                tva.boolean
              )
            })
          })
        )
      }).validate(unknown);

      expect(value).toBe(unknown);
    }
  );

  jce.test(
    ['object', 'failure - complex property path - custom error'],
    2,
    () => {
      try {
        tva.object({
          prop1: tva.array(
            tva.object({
              prop2: tva.object({
                prop3: tva.array(
                  tva.boolean.error('bad value')
                )
              })
            })
          )
        }).validate({
          prop1: [{
            prop2: {
              prop3: [false, 42]
            }
          }]
        });
      } catch (error) {
        const validationError = error as ValidationError;
        expect(validationError.message).toBe('bad value');
        expect(validationError.propertyPath).toBe('prop1.0.prop2.prop3.1');
      }
    }
  );

  jce.test(
    ['object', 'failure - complex property path - custom error callback'],
    2,
    () => {
      try {
        tva.object({
          prop1: tva.array(
            tva.object({
              prop2: tva.object({
                prop3: tva.array(
                  tva.boolean.error(() => 'bad value')
                )
              })
            })
          )
        }).validate({
          prop1: [{
            prop2: {
              prop3: [false, 42]
            }
          }]
        });
      } catch (error) {
        const validationError = error as ValidationError;
        expect(validationError.message).toBe('bad value');
        expect(validationError.propertyPath).toBe('prop1.0.prop2.prop3.1');
      }
    }
  );

  jce.test(
    ['object', 'failure - complex property path - isValid'],
    4,
    () => {
      const validator = tva.object({
        prop1: tva.array(
          tva.object({
            prop2: tva.object({
              prop3: tva.array(
                tva.boolean
              )
            })
          })
        )
      });

      const isValid = validator.isValid({
        prop1: [{
          prop2: {
            prop3: [false, 42]
          }
        }]
      });

      expect(isValid).toBe(false);
      expect(validator.validationError).toBeDefined();
      expect(validator.validationError?.message).toBe('value is not a boolean');
      expect(validator.validationError?.propertyPath).toBe('prop1.0.prop2.prop3.1');
    }
  );

  jce.test(
    ['object', 'failure - complex property path - isValid - recursive'],
    19,
    () => {
      const booleanValidator = tva.boolean;
      const array2validator = tva.array(booleanValidator);
      const object3Validator = tva.object({
        prop3: array2validator
      });
      const object2Validator = tva.object({
        prop2: object3Validator
      });
      const array1Validator = tva.array(object2Validator);
      const object1Validator = tva.object({
        prop1: array1Validator
      });

      const isValid = object1Validator.isValid({
        prop1: [{
          prop2: {
            prop3: [false, 42]
          }
        }]
      });

      expect(isValid).toBe(false);
      expect(object1Validator.validationError).toBeDefined();
      expect(object1Validator.validationError?.message).toBe('value is not a boolean');
      expect(object1Validator.validationError?.propertyPath).toBe('prop1.0.prop2.prop3.1');
      expect(array1Validator.validationError).toBeDefined();
      expect(array1Validator.validationError?.message).toBe('value is not a boolean');
      expect(array1Validator.validationError?.propertyPath).toBe('0.prop2.prop3.1');
      expect(object2Validator.validationError).toBeDefined();
      expect(object2Validator.validationError?.message).toBe('value is not a boolean');
      expect(object2Validator.validationError?.propertyPath).toBe('prop2.prop3.1');
      expect(object3Validator.validationError).toBeDefined();
      expect(object3Validator.validationError?.message).toBe('value is not a boolean');
      expect(object3Validator.validationError?.propertyPath).toBe('prop3.1');
      expect(array2validator.validationError).toBeDefined();
      expect(array2validator.validationError?.message).toBe('value is not a boolean');
      expect(array2validator.validationError?.propertyPath).toBe('1');
      expect(booleanValidator.validationError).toBeDefined();
      expect(booleanValidator.validationError?.message).toBe('value is not a boolean');
      expect(booleanValidator.validationError?.propertyPath).toBeUndefined();
    }
  );

  jce.test(
    ['object', 'failure - complex property path - custom validation'],
    4,
    () => {
      const validator = tva.object({
        prop1: tva.array(tva.object({
          prop2: tva.object({
            prop3: tva.array(
              tva.number.custom(value_ => value_ % 7 === 0 ? undefined : 'the number is not divisible by 7')
            )
          })
        }))
      });

      const isValid = validator.isValid({
        prop1: [{
          prop2: {
            prop3: [7, 14, 21, 27]
          }
        }]
      });

      expect(isValid).toBe(false);
      expect(validator.validationError).toBeDefined();
      expect(validator.validationError?.message).toBe('the number is not divisible by 7');
      expect(validator.validationError?.propertyPath).toBe('prop1.0.prop2.prop3.3');
    }
  );

  jce.test(
    ['dictionary', 'failure - complex property path'],
    2,
    () => {
      try {
        tva.dictionary(
          tva.array(
            tva.dictionary(
              tva.dictionary(
                tva.array(
                  tva.boolean
                )
              )
            )
          )
        ).validate({
          prop1: [{
            prop2: {
              prop3: [false, 42]
            }
          }]
        });
      } catch (error) {
        const validationError = error as ValidationError;
        expect(validationError.message).toBe('value is not a boolean');
        expect(validationError.propertyPath).toBe('prop1.0.prop2.prop3.1');
      }
    }
  );

  jce.test(
    ['dictionary', 'failure - complex property path - custom error'],
    2,
    () => {
      try {
        tva.dictionary(
          tva.array(
            tva.dictionary(
              tva.dictionary(
                tva.array(
                  tva.boolean.error('bad value')
                )
              )
            )
          )
        ).validate({
          prop1: [{
            prop2: {
              prop3: [false, 42]
            }
          }]
        });
      } catch (error) {
        const validationError = error as ValidationError;
        expect(validationError.message).toBe('bad value');
        expect(validationError.propertyPath).toBe('prop1.0.prop2.prop3.1');
      }
    }
  );

  jce.test(
    ['dictionary', 'failure - complex property path - isValid'],
    4,
    () => {
      const validator = tva.dictionary(
        tva.array(
          tva.dictionary(
            tva.dictionary(
              tva.array(
                tva.boolean
              )
            )
          )
        )
      );

      const isValid = validator.isValid({
        prop1: [{
          prop2: {
            prop3: [false, 42]
          }
        }]
      });

      expect(isValid).toBe(false);
      expect(validator.validationError).toBeDefined();
      expect(validator.validationError?.message).toBe('value is not a boolean');
      expect(validator.validationError?.propertyPath).toBe('prop1.0.prop2.prop3.1');
    }
  );

  jce.test(
    ['dictionary', 'failure - complex property path - isValid - recursive'],
    19,
    () => {
      const booleanValidator = tva.boolean;
      const array2validator = tva.array(booleanValidator);
      const dictionary3Validator = tva.dictionary(array2validator);
      const dictionary2Validator = tva.dictionary(dictionary3Validator);
      const array1Validator = tva.array(dictionary2Validator);
      const dictionary1Validator = tva.dictionary(array1Validator);

      const isValid = dictionary1Validator.isValid({
        prop1: [{
          prop2: {
            prop3: [false, 42]
          }
        }]
      });

      expect(isValid).toBe(false);
      expect(dictionary1Validator.validationError).toBeDefined();
      expect(dictionary1Validator.validationError?.message).toBe('value is not a boolean');
      expect(dictionary1Validator.validationError?.propertyPath).toBe('prop1.0.prop2.prop3.1');
      expect(array1Validator.validationError).toBeDefined();
      expect(array1Validator.validationError?.message).toBe('value is not a boolean');
      expect(array1Validator.validationError?.propertyPath).toBe('0.prop2.prop3.1');
      expect(dictionary2Validator.validationError).toBeDefined();
      expect(dictionary2Validator.validationError?.message).toBe('value is not a boolean');
      expect(dictionary2Validator.validationError?.propertyPath).toBe('prop2.prop3.1');
      expect(dictionary3Validator.validationError).toBeDefined();
      expect(dictionary3Validator.validationError?.message).toBe('value is not a boolean');
      expect(dictionary3Validator.validationError?.propertyPath).toBe('prop3.1');
      expect(array2validator.validationError).toBeDefined();
      expect(array2validator.validationError?.message).toBe('value is not a boolean');
      expect(array2validator.validationError?.propertyPath).toBe('1');
      expect(booleanValidator.validationError).toBeDefined();
      expect(booleanValidator.validationError?.message).toBe('value is not a boolean');
      expect(booleanValidator.validationError?.propertyPath).toBeUndefined();
    }
  );

  jce.test(
    ['dictionary', 'failure - complex property path - custom validation'],
    4,
    () => {
      const validator = tva.dictionary(
        tva.array(
          tva.dictionary(
            tva.dictionary(
              tva.array(
                tva.number.custom(value_ => value_ % 7 === 0 ? undefined : 'the number is not divisible by 7')
              )
            )
          )
        )
      );

      const isValid = validator.isValid({
        prop1: [{
          prop2: {
            prop3: [7, 14, 21, 27]
          }
        }]
      });

      expect(isValid).toBe(false);
      expect(validator.validationError).toBeDefined();
      expect(validator.validationError?.message).toBe('the number is not divisible by 7');
      expect(validator.validationError?.propertyPath).toBe('prop1.0.prop2.prop3.3');
    }
  );

  jce.test(
    ['dictionary', 'failure - unknown error'],
    1,
    () => {
      const validator = tva.dictionary(
        tva.array(
          tva.dictionary(
            tva.dictionary(
              tva.array(
                tva.number.custom(() => { throw new Error('something went really wrong'); })
              )
            )
          )
        )
      );

      expect(
        () => {
          validator.validate({
            prop1: [{
              prop2: {
                prop3: [42]
              }
            }]
          });
        }
      ).toThrow('something went really wrong');
    }
  );

  jce.test(
    ['object', 'failure - strict, optional, array'],
    4,
    () => {
      const validator = tva.object({
        prop1: tva.array(
          tva.object({
            prop11: tva.undefined,
            prop12: tva.object({
              prop121: tva.optional(
                tva.array(
                  tva.strict(42)
                )
              )
            })
          })
        ),
        prop2: tva.number
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
      expect(validator.validationError?.propertyPath).toBe('prop1.1.prop12.prop121.2');
    }
  );

  jce.test(
    ['object', 'failure - unexpected exceptions'],
    3,
    () => {
      class ErrorReason {
        private _number = 42;
        public get prop(): number {
          if (this._number === 42) {
            throw new Error('simple error');
          }

          return this._number;
        }
      }

      expect(
        () => tva.object<ErrorReason>({ prop: tva.number }).validate(new ErrorReason())
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

      expect(
        () => tva.object<MessageReason>({ prop: tva.number }).validate(new MessageReason())
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

      expect(
        () => tva.object<UnknownReason>({ prop: tva.number }).validate(new UnknownReason())
      ).toThrow('unknown error');
    }
  );
});
