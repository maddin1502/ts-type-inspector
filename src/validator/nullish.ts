import type {
  ExtendedValidationParameters,
  NoParameters,
  Validator
} from '../types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for nullish values (null or undefined)
 *
 * @export
 * @interface NullishValidator
 * @template {ExtendedValidationParameters} [EVP=NoParameters]
 * @extends {Validator<null | undefined, EVP>}
 * @since 1.0.0
 */
export interface NullishValidator<
  EVP extends ExtendedValidationParameters = NoParameters
> extends Validator<null | undefined, EVP> {}

/**
 * Validator for nullish values (null or undefined)
 *
 * @export
 * @class DefaultNullishValidator
 * @template {ExtendedValidationParameters} [EVP=NoParameters]
 * @extends {DefaultValidator<null | undefined, EVP>}
 * @implements {NullishValidator<EVP>}
 * @since 1.0.0
 */
export class DefaultNullishValidator<
    EVP extends ExtendedValidationParameters = NoParameters
  >
  extends DefaultValidator<null | undefined, EVP>
  implements NullishValidator<EVP>
{
  protected validateBaseType(value_: unknown): null | undefined {
    if (value_ === null || value_ === undefined) {
      return value_;
    }

    this.throwValidationError('value is not nullish');
  }
}
