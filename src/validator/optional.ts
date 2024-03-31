import type { EmptyObject } from 'ts-lib-extended';
import type { ExtendedValidationParameters, Validator } from '../types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for optional (maybe undefined) properties/values
 *
 * @export
 * @interface OptionalValidator
 * @template V
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @extends {Validator<undefined | V, EVP>}
 * @since 1.0.0
 */
export interface OptionalValidator<
  V,
  EVP extends ExtendedValidationParameters = EmptyObject
> extends Validator<undefined | V, EVP> {}

/**
 * Validator for optional (maybe undefined) properties/values
 *
 * @export
 * @class DefaultOptionalValidator
 * @template V
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @extends {DefaultValidator<undefined | V, EVP>}
 * @implements {OptionalValidator<V, EVP>}
 * @since 1.0.0
 */
export class DefaultOptionalValidator<
    V,
    EVP extends ExtendedValidationParameters = EmptyObject
  >
  extends DefaultValidator<undefined | V, EVP>
  implements OptionalValidator<V, EVP>
{
  constructor(private readonly _validator: Validator<V>) {
    super();
  }

  protected validateBaseType(value_: unknown): undefined | V {
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
