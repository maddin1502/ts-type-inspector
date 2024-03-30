import type { EmptyObject } from 'ts-lib-extended';
import type {
  CustomValidation,
  ExtendedValidationParameters,
  Validatable
} from '../types.js';
import { Validator } from './index.js';

/**
 * Validator for custom value validation.
 *
 * @export
 * @template Out
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @since 1.0.0
 */
export type CustomValidatable<
  Out,
  EVP extends ExtendedValidationParameters = EmptyObject
> = Validatable<Out, EVP>;

/**
 * Validator for custom value validation.
 *
 * @export
 * @class CustomValidator
 * @template Out
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @extends {Validator<Out, EVP>}
 * @implements {CustomValidatable<Out, EVP>}
 * @since 1.0.0
 */
export class CustomValidator<
    Out,
    EVP extends ExtendedValidationParameters = EmptyObject
  >
  extends Validator<Out, EVP>
  implements CustomValidatable<Out, EVP>
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
