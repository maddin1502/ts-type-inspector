import { JestClassExtended } from 'jest-class-extended';
import { ValidationError } from '../../src/error';
import { InspectorGadget } from '../../src/inspectorGadget';

const ig = new InspectorGadget();
const jce = new JestClassExtended(InspectorGadget);

jce.describe(() => {
  jce.test(
    ['object', 'failure - complex property path'],
    2,
    () => {
      try {
        ig.object({
          prop1: ig.array(
            ig.object({
              prop2: ig.object({
                prop3: ig.array(
                  ig.boolean
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
      const value = ig.object({
        prop1: ig.array(
          ig.object({
            prop2: ig.object({
              prop3: ig.array(
                ig.boolean
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
        ig.object({
          prop1: ig.array(
            ig.object({
              prop2: ig.object({
                prop3: ig.array(
                  ig.boolean.error('bad value')
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
        ig.object({
          prop1: ig.array(
            ig.object({
              prop2: ig.object({
                prop3: ig.array(
                  ig.boolean.error(() => 'bad value')
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
      const validator = ig.object({
        prop1: ig.array(
          ig.object({
            prop2: ig.object({
              prop3: ig.array(
                ig.boolean
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
      const booleanValidator = ig.boolean;
      const array2validator = ig.array(booleanValidator);
      const object3Validator = ig.object({
        prop3: array2validator
      });
      const object2Validator = ig.object({
        prop2: object3Validator
      });
      const array1Validator = ig.array(object2Validator);
      const object1Validator = ig.object({
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
      const validator = ig.object({
        prop1: ig.array(ig.object({
          prop2: ig.object({
            prop3: ig.array(
              ig.number.custom(value_ => value_ % 7 === 0 ? undefined : 'the number is not divisible by 7')
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
        ig.dictionary(
          ig.array(
            ig.dictionary(
              ig.dictionary(
                ig.array(
                  ig.boolean
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
        ig.dictionary(
          ig.array(
            ig.dictionary(
              ig.dictionary(
                ig.array(
                  ig.boolean.error('bad value')
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
      const validator = ig.dictionary(
        ig.array(
          ig.dictionary(
            ig.dictionary(
              ig.array(
                ig.boolean
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
      const booleanValidator = ig.boolean;
      const array2validator = ig.array(booleanValidator);
      const dictionary3Validator = ig.dictionary(array2validator);
      const dictionary2Validator = ig.dictionary(dictionary3Validator);
      const array1Validator = ig.array(dictionary2Validator);
      const dictionary1Validator = ig.dictionary(array1Validator);

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
      const validator = ig.dictionary(
        ig.array(
          ig.dictionary(
            ig.dictionary(
              ig.array(
                ig.number.custom(value_ => value_ % 7 === 0 ? undefined : 'the number is not divisible by 7')
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
      const validator = ig.dictionary(
        ig.array(
          ig.dictionary(
            ig.dictionary(
              ig.array(
                ig.number.custom(() => { throw new Error('something went really wrong'); })
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
      const validator = ig.object({
        prop1: ig.array(
          ig.object({
            prop11: ig.undefined,
            prop12: ig.object({
              prop121: ig.optional(
                ig.array(
                  ig.strict(42)
                )
              )
            })
          })
        ),
        prop2: ig.number
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
        () => ig.object<ErrorReason>({ prop: ig.number }).validate(new ErrorReason())
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
        () => ig.object<MessageReason>({ prop: ig.number }).validate(new MessageReason())
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
        () => ig.object<UnknownReason>({ prop: ig.number }).validate(new UnknownReason())
      ).toThrow('unknown error');
    }
  );
});
