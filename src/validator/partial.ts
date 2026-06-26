import type { ValidationError } from '@/error.js';
import type {
  PartialPropertyValidators,
  PropertyValidator,
  Validator
} from '@/types.js';
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
 * @extends {Validator<Out, ValidationParams>}
 * @since 2.0.0
 */
export interface PartialValidator<
  Out extends RecordLike,
  ValidationParams = unknown
> extends Validator<Out, ValidationParams> {
  /**
   * Retrieve the validator defined for a specific property (may be undefined).
   *
   * @template {keyof Out} Key
   * @param {Key} key_
   * @returns {PropertyValidator<Out[Key], ValidationParams> | undefined}
   * @since 4.0.0
   */
  prop<Key extends keyof Out>(
    key_: Key
  ): PropertyValidator<Out[Key], ValidationParams> | undefined;
  /**
   * Retrieve the validators defined for all (specified) properties.
   *
   * @returns {PartialPropertyValidators<Out, ValidationParams>}
   * @since 4.0.0
   */
  props(): PartialPropertyValidators<Out, ValidationParams>;
}

/**
 * Validator for object based values. This is an **UNSAFE** validator that only validates some properties and ignores others
 *
 * @export
 * @class DefaultPartialValidator
 * @template {RecordLike} Out
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {PropertiesValidator<Out, ValidationParams, PartialPropertyValidators<Out, ValidationParams>>}
 * @implements {PartialValidator<Out, ValidationParams>}
 * @since 2.0.0
 */
export class DefaultPartialValidator<
    Out extends RecordLike,
    ValidationParams = unknown
  >
  extends PropertiesValidator<
    Out,
    ValidationParams,
    PartialPropertyValidators<Out, ValidationParams>
  >
  implements PartialValidator<Out, ValidationParams>
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
