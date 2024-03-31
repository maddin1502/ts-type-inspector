import type { EmptyObject } from 'ts-lib-extended';
import type { ExtendedValidationParameters, Validator } from '../types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for undefined values
 *
 * @export
 * @interface UndefinedValidator
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @extends {Validator<undefined, EVP>}
 * @since 1.0.0
 */
export interface UndefinedValidator<
  EVP extends ExtendedValidationParameters = EmptyObject
> extends Validator<undefined, EVP> {}

/**
 * Validator for undefined values
 *
 * @export
 * @class DefaulUndefinedValidator
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @extends {DefaultValidator<undefined, EVP>}
 * @implements {UndefinedValidator<EVP>}
 * @since 1.0.0
 */
export class DefaulUndefinedValidator<
    EVP extends ExtendedValidationParameters = EmptyObject
  >
  extends DefaultValidator<undefined, EVP>
  implements UndefinedValidator<EVP>
{
  protected validateBaseType(value_: unknown): undefined {
    if (value_ === undefined) {
      return value_;
    }

    this.throwValidationError('value is defined');
  }
}
