import type { ValidationError } from '@/error.js';
import type { PropertyValidators, Validator } from '@/types.js';
import { isObject } from '@/utils.js';
import type { RecordLike } from 'ts-lib-extended';
import { PropertiesValidator } from './properties.js';

/**
 * Validator for object based values. Each property has to match its specified validator
 *
 * @export
 * @interface ObjectValidator
 * @template {RecordLike} Out
 * @template [ValidationParams=unknown] extended validation parameters
 * @template {PropertyValidators<Out, ValidationParams>} [PV=PropertyValidators<Out, ValidationParams>] the concrete property validators map
 * @extends {Validator<Out, ValidationParams>}
 * @since 1.0.0
 */
export interface ObjectValidator<
  Out extends RecordLike,
  ValidationParams = unknown,
  PV extends PropertyValidators<Out, ValidationParams> = PropertyValidators<
    Out,
    ValidationParams
  >
> extends Validator<Out, ValidationParams> {
  /**
   * Reject objects that contain more keys than have been validated
   * USE FOR POJOs ONLY!. Getter/Setter/Methods will lead to false negative results
   *
   * @readonly
   * @type {this}
   * @since 1.0.0
   */
  get noOverload(): this;
  /**
   * Reject array values (arrays are objects too and pass by default)
   *
   * @readonly
   * @type {this}
   * @since 4.0.0
   */
  get rejectArray(): this;
  /**
   * Retrieve the validator defined for a specific property.
   *
   * @template {keyof PV} Key
   * @param {Key} key_
   * @returns {PV[Key]}
   * @since 4.0.0
   */
  prop<Key extends keyof PV>(key_: Key): PV[Key];
  /**
   * Retrieve the validators defined for all properties.
   *
   * @returns {PV}
   * @since 4.0.0
   */
  props(): PV;
}

/**
 * Validator for object based values. Each property has to match its specified validator
 *
 * @export
 * @class DefaultObjectValidator
 * @template {RecordLike} Out
 * @template [ValidationParams=unknown] extended validation parameters
 * @template {PropertyValidators<Out, ValidationParams>} [PV=PropertyValidators<Out, ValidationParams>] the concrete property validators map (lets `prop`/`props` return the exact validator types)
 * @extends {PropertiesValidator<Out, ValidationParams, PV>}
 * @implements {ObjectValidator<Out, ValidationParams>}
 * @since 1.0.0
 */
export class DefaultObjectValidator<
    Out extends RecordLike,
    ValidationParams = unknown,
    PV extends PropertyValidators<Out, ValidationParams> = PropertyValidators<
      Out,
      ValidationParams
    >
  >
  extends PropertiesValidator<Out, ValidationParams, PV>
  implements ObjectValidator<Out, ValidationParams, PV>
{
  public get noOverload(): this {
    return this.setupCondition((value_) => this.checkOverload(value_));
  }

  public get rejectArray(): this {
    return this.setupCondition((value_) => this.checkArray(value_));
  }

  protected validateBaseType(value_: unknown, params_?: ValidationParams): Out {
    if (!isObject(value_)) {
      this.throwValidationError('value is not an object');
    }

    const errors: ValidationError[] = [];
    let result: RecordLike = value_;

    // keep optional parameters in mind! The value must be validated even if it is undefined
    for (const validatorKey in this._propertyValidators) {
      this.validateChild(
        errors,
        () => value_[validatorKey],
        this._propertyValidators[validatorKey],
        validatorKey,
        params_,
        (validated) => {
          if (result === value_) {
            result = { ...value_ };
          }

          (result as Record<PropertyKey, unknown>)[validatorKey] = validated;
        }
      );
    }

    this.throwOnErrors(errors, 'one or more properties are invalid');

    return result as Out;
  }

  private checkOverload(value_: RecordLike): void {
    for (const propertyKey in value_) {
      if (!(propertyKey in this._propertyValidators)) {
        this.throwValidationError('value is overloaded');
      }
    }
  }

  private checkArray(value_: RecordLike): void {
    if (Array.isArray(value_)) {
      this.throwValidationError('value must not be an array');
    }
  }
}
