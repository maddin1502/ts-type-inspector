import { Validator } from '.';
import { CustomValidation } from '../types';

/**
 * Validator for custom value validation.
 *
 * @since 1.0.0
 * @export
 * @class CustomValidator
 * @extends {Validator<Out>}
 * @template Out
 */
export class CustomValidator<Out> extends Validator<Out> {
  /**
   * @param {CustomValidation<Out>} _validationCallback Return an error message if validation fails; else undefined
   * @memberof CustomValidator
   */
  constructor(
    private readonly _validationCallback: CustomValidation<unknown>
  ) {
    super();
  }

  protected validateBaseType(value_: unknown): Out {
    const result = this._validationCallback(value_);

    if (result !== undefined) {
      this.throwValidationError(result);
    }

    return value_ as Out;
  }
}
