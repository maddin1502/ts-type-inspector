import type { ObjectLike, Validator } from '../types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for optional (maybe undefined) properties/values
 *
 * @export
 * @interface OptionalValidator
 * @template V
 * @template {ObjectLike} [ValidationParams=any] extended validation parameters
 * @extends {Validator<undefined | V, ValidationParams>}
 * @since 1.0.0
 */
export interface OptionalValidator<V, ValidationParams extends ObjectLike = any>
  extends Validator<undefined | V, ValidationParams> {}

/**
 * Validator for optional (maybe undefined) properties/values
 *
 * @export
 * @class DefaultOptionalValidator
 * @template V
 * @template {ObjectLike} [ValidationParams=any] extended validation parameters
 * @extends {DefaultValidator<undefined | V, ValidationParams>}
 * @implements {OptionalValidator<V, ValidationParams>}
 * @since 1.0.0
 */
export class DefaultOptionalValidator<
    V,
    ValidationParams extends ObjectLike = any
  >
  extends DefaultValidator<undefined | V, ValidationParams>
  implements OptionalValidator<V, ValidationParams>
{
  constructor(private readonly _validator: Validator<V>) {
    super();
  }

  protected validateBaseType(
    value_: unknown,
    _params_?: ValidationParams
  ): undefined | V {
    if (typeof value_ === 'undefined') {
      return value_;
    }

    try {
      return this._validator.validate(value_);
    } catch (reason_) {
      this.rethrowError(reason_);
    }
  }
}
