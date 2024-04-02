import type {
  CustomValidation,
  ExtendedValidationParameters,
  NoParameters,
  Validator
} from '../types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for custom value validation.
 *
 * @export
 * @interface CustomValidator
 * @template Out
 * @template {ExtendedValidationParameters} [EVP=NoParameters]
 * @extends {Validator<Out, EVP>}
 * @since 1.0.0
 */
export interface CustomValidator<
  Out,
  EVP extends ExtendedValidationParameters = NoParameters
> extends Validator<Out, EVP> {}

/**
 * Validator for custom value validation.
 *
 * @export
 * @class DefaultCustomValidator
 * @template Out
 * @template {ExtendedValidationParameters} [EVP=NoParameters]
 * @extends {DefaultValidator<Out, EVP>}
 * @implements {CustomValidator<Out, EVP>}
 * @since 1.0.0
 */
export class DefaultCustomValidator<
    Out,
    EVP extends ExtendedValidationParameters = NoParameters
  >
  extends DefaultValidator<Out, EVP>
  implements CustomValidator<Out, EVP>
{
  /**
   * Creates an instance of CustomValidator.
   *
   * @constructor
   * @param {CustomValidation<unknown, EVP>} _validationCallback  Return an error message if validation fails; else undefined
   */
  constructor(
    private readonly _validationCallback: CustomValidation<unknown, EVP>
  ) {
    super();
  }

  protected validateBaseType(value_: unknown): Out {
    const result = this._validationCallback(value_);

    if (result === undefined) {
      return value_ as Out;
    }

    this.throwValidationError(result);
  }
}
