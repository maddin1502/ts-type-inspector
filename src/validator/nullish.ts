import type { EmptyObject } from 'ts-lib-extended';
import type { ExtendedValidationParameters, Validatable } from '../types.js';
import { Validator } from './index.js';

/**
 * Validator for nullish values (null or undefined)
 *
 * @export
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @since 1.0.0
 */
export type NullishValidatable<
  EVP extends ExtendedValidationParameters = EmptyObject
> = Validatable<null | undefined, EVP>;

/**
 * Validator for nullish values (null or undefined)
 *
 * @export
 * @class NullishValidator
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @extends {Validator<null | undefined, EVP>}
 * @implements {NullishValidatable<EVP>}
 * @since 1.0.0
 */
export class NullishValidator<
    EVP extends ExtendedValidationParameters = EmptyObject
  >
  extends Validator<null | undefined, EVP>
  implements NullishValidatable<EVP>
{
  protected validateBaseType(value_: unknown): null | undefined {
    if (value_ === null || value_ === undefined) {
      return value_;
    }

    this.throwValidationError('value is not nullish');
  }
}
