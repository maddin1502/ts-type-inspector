import type { EmptyObject } from 'ts-lib-extended';
import type { ExtendedValidationParameters, Validatable } from '../types.js';
import { Validator } from './index.js';

/**
 * Validator for null values
 *
 * @export
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @since 1.0.0
 */
export type NullValidatable<
  EVP extends ExtendedValidationParameters = EmptyObject
> = Validatable<null, EVP>;

/**
 * Validator for null values
 *
 * @export
 * @class NullValidator
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @extends {Validator<null, EVP>}
 * @implements {NullValidatable<EVP>}
 * @since 1.0.0
 */
export class NullValidator<
    EVP extends ExtendedValidationParameters = EmptyObject
  >
  extends Validator<null, EVP>
  implements NullValidatable<EVP>
{
  protected validateBaseType(value_: unknown): null {
    if (value_ === null) {
      return value_;
    }

    this.throwValidationError('value is not null');
  }
}
