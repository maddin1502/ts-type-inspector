import type {
  ExtendedValidationParameters,
  NoParameters,
  Validator
} from '../types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for undefined values
 *
 * @export
 * @interface UndefinedValidator
 * @template {ExtendedValidationParameters} [EVP=NoParameters]
 * @extends {Validator<undefined, EVP>}
 * @since 1.0.0
 */
export interface UndefinedValidator<
  EVP extends ExtendedValidationParameters = NoParameters
> extends Validator<undefined, EVP> {}

/**
 * Validator for undefined values
 *
 * @export
 * @class DefaulUndefinedValidator
 * @template {ExtendedValidationParameters} [EVP=NoParameters]
 * @extends {DefaultValidator<undefined, EVP>}
 * @implements {UndefinedValidator<EVP>}
 * @since 1.0.0
 */
export class DefaulUndefinedValidator<
    EVP extends ExtendedValidationParameters = NoParameters
  >
  extends DefaultValidator<undefined, EVP>
  implements UndefinedValidator<EVP>
{
  protected validateBaseType(value_: unknown, _params_?: EVP): undefined {
    if (value_ === undefined) {
      return value_;
    }

    this.throwValidationError('value is defined');
  }
}
