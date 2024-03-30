import type { EmptyObject } from 'ts-lib-extended';
import type { ExtendedValidationParameters, Validatable } from '../types.js';
import { Validator } from './index.js';

/**
 * Validator for optional (maybe undefined) properties/values
 *
 * @export
 * @template V
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @since 1.0.0
 */
export type OptionalValidatable<
  V,
  EVP extends ExtendedValidationParameters = EmptyObject
> = Validatable<undefined | V, EVP>;

/**
 * Validator for optional (maybe undefined) properties/values
 *
 * @export
 * @class OptionalValidator
 * @template V
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @extends {Validator<undefined | V, EVP>}
 * @implements {OptionalValidatable<V, EVP>}
 * @since 1.0.0
 */
export class OptionalValidator<
    V,
    EVP extends ExtendedValidationParameters = EmptyObject
  >
  extends Validator<undefined | V, EVP>
  implements OptionalValidatable<V, EVP>
{
  constructor(private readonly _validator: Validatable<V>) {
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
