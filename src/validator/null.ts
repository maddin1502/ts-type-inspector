import type { EmptyObject } from 'ts-lib-extended';
import type { ExtendedValidationParameters, Validator } from '../types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for null values
 *
 * @export
 * @interface NullValidator
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @extends {Validator<null, EVP>}
 * @since 1.0.0
 */
export interface NullValidator<
  EVP extends ExtendedValidationParameters = EmptyObject
> extends Validator<null, EVP> {}

/**
 * Validator for null values
 *
 * @export
 * @class DefaultNullValidator
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @extends {DefaultValidator<null, EVP>}
 * @implements {NullValidator<EVP>}
 * @since 1.0.0
 */
export class DefaultNullValidator<
    EVP extends ExtendedValidationParameters = EmptyObject
  >
  extends DefaultValidator<null, EVP>
  implements NullValidator<EVP>
{
  protected validateBaseType(value_: unknown): null {
    if (value_ === null) {
      return value_;
    }

    this.throwValidationError('value is not null');
  }
}
