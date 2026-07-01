import type { ValidationError } from '@/error.js';
import type { PartialPropertyValidators, Validator } from '@/types.js';
import { isObject } from '@/utils.js';
import type { RecordLike } from 'ts-lib-extended';
import { PropertiesValidator } from './properties.js';

/**
 * Validator for object based values. This is an **UNSAFE** validator that only validates some properties and ignores others
 *
 * @export
 * @interface PartialValidator
 * @template {RecordLike} Out
 * @template [ValidationParams=unknown] extended validation parameters
 * @template {PartialPropertyValidators<Out, ValidationParams>} [PV=PartialPropertyValidators<Out, ValidationParams>] the concrete property validators map
 * @extends {Validator<Out, ValidationParams>}
 * @since 2.0.0
 */
export interface PartialValidator<
  Out extends RecordLike,
  ValidationParams = unknown,
  PV extends PartialPropertyValidators<
    Out,
    ValidationParams
  > = PartialPropertyValidators<Out, ValidationParams>
> extends Validator<Out, ValidationParams> {
  /**
   * Retrieve the validator defined for a specific property (may be undefined).
   *
   * @template {keyof PV} Key
   * @param {Key} key_
   * @returns {PV[Key]}
   * @since 4.0.0
   */
  prop<Key extends keyof PV>(key_: Key): PV[Key];
  /**
   * Retrieve the validators defined for all (specified) properties.
   *
   * @returns {PV}
   * @since 4.0.0
   */
  props(): PV;
}

/**
 * Validator for object based values. This is an **UNSAFE** validator that only validates some properties and ignores others
 *
 * @export
 * @class DefaultPartialValidator
 * @template {RecordLike} Out
 * @template [ValidationParams=unknown] extended validation parameters
 * @template {PartialPropertyValidators<Out, ValidationParams>} [PV=PartialPropertyValidators<Out, ValidationParams>] the concrete property validators map (lets `prop`/`props` return the exact validator types)
 * @extends {PropertiesValidator<Out, ValidationParams, PV>}
 * @implements {PartialValidator<Out, ValidationParams>}
 * @since 2.0.0
 */
export class DefaultPartialValidator<
    Out extends RecordLike,
    ValidationParams = unknown,
    PV extends PartialPropertyValidators<
      Out,
      ValidationParams
    > = PartialPropertyValidators<Out, ValidationParams>
  >
  extends PropertiesValidator<Out, ValidationParams, PV>
  implements PartialValidator<Out, ValidationParams, PV>
{

  protected validateBaseType(value_: unknown, params_?: ValidationParams): Out {
    if (!isObject(value_)) {
      this.throwValidationError('value is not an object');
    }

    const errors: ValidationError[] = [];

    for (const validatorKey in this._propertyValidators) {
      const propertyValidator = this._propertyValidators[validatorKey];

      if (propertyValidator) {
        this.validateChild(
          errors,
          () => value_[validatorKey],
          propertyValidator,
          validatorKey,
          params_
        );
      }
    }

    this.throwOnErrors(errors, 'one or more properties are invalid');

    return value_;
  }
}
