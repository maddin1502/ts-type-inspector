import { Validator } from '.';
import { CustomValidation } from '../types';

/**
 * Validator for custom value validation.
 *
 * @since 1.0.0
 * @export
 * @class CustomValidator
 * @extends {Validator<V>}
 * @template V
 */
export class CustomValidator<V> extends Validator<V> {
  /**
   * Creates an instance of CustomValidator.
   *
   * @param {CustomValidation<V>} _validationCallback Return an error message if validation fails; else undefined
   * @memberof CustomValidator
   */
  constructor(
    private readonly _validationCallback: CustomValidation<unknown>
  ) {
    super();
  }

  protected validateBaseType(value_: unknown): V {
    const result = this._validationCallback(value_);

    if (result !== undefined) {
      this.throwValidationError(result);
    }

    return value_ as V;
  }
}
