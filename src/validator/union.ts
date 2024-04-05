import type {
  ObjectLike,
  UnionValidators,
  UnionValidatorsItem,
  Validator
} from '../types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for union type values (like "string | number")
 *
 * @export
 * @interface UnionValidator
 * @template {UnionValidators} V
 * @template {ObjectLike} [ValidationParams=any] extended validation parameters
 * @extends {Validator<UnionValidatorsItem<V>, ValidationParams>}
 * @since 1.0.0
 */
export interface UnionValidator<
  V extends UnionValidators,
  ValidationParams extends ObjectLike = any
> extends Validator<UnionValidatorsItem<V>, ValidationParams> {}

/**
 * Validator for union type values (like "string | number")
 *
 * @export
 * @class DefaultUnionValidator
 * @template {UnionValidators} V
 * @template {ObjectLike} [ValidationParams=any] extended validation parameters
 * @extends {DefaultValidator<UnionValidatorsItem<V>, ValidationParams>}
 * @implements {UnionValidator<V, ValidationParams>}
 * @since 1.0.0
 */
export class DefaultUnionValidator<
    V extends UnionValidators,
    ValidationParams extends ObjectLike = any
  >
  extends DefaultValidator<UnionValidatorsItem<V>, ValidationParams>
  implements UnionValidator<V, ValidationParams>
{
  private readonly _validators: V;

  constructor(...validators_: V) {
    super();
    this._validators = validators_;
  }

  protected validateBaseType(
    value_: unknown,
    _params_?: ValidationParams
  ): UnionValidatorsItem<V> {
    const errors: Error[] = [];

    for (let i = 0; i < this._validators.length; i++) {
      const validator = this._validators[i];

      try {
        validator.validate(value_);
        break;
      } catch (reason_) {
        errors.push(this.detectError(reason_).error);
      }
    }

    if (errors.length === this._validators.length) {
      this.throwValidationError(
        'value does not match any of the possible types',
        undefined,
        errors
      );
    }

    return value_ as UnionValidatorsItem<V>;
  }
}
