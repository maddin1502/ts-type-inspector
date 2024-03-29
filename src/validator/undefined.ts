import type {
  EmptyObject,
  ExtendedValidationParameters,
  Validatable
} from '../types.js';
import { Validator } from './index.js';

/**
 * Validator for undefined values
 *
 * @export
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @since 1.0.0
 */
export type UndefinedValidatable<
  EVP extends ExtendedValidationParameters = EmptyObject
> = Validatable<undefined, EVP>;

/**
 * Validator for undefined values
 *
 * @export
 * @class UndefinedValidator
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @extends {Validator<undefined, EVP>}
 * @implements {UndefinedValidatable<EVP>}
 * @since 1.0.0
 */
export class UndefinedValidator<
    EVP extends ExtendedValidationParameters = EmptyObject
  >
  extends Validator<undefined, EVP>
  implements UndefinedValidatable<EVP>
{
  protected validateBaseType(value_: unknown): undefined {
    if (value_ !== undefined) {
      this.throwValidationError('value is defined');
    }

    return value_;
  }
}
