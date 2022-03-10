import { Validator } from '.';

/**
 * Validator for null values
 *
 * @since 1.0.0
 * @export
 * @class NullValidator
 * @extends {Validator<undefined>}
 */
export class NullValidator extends Validator<null> {
  protected validateBaseType(value_: unknown): null {
    if (value_ !== null) {
      this.throwValidationError('value is not null');
    }

    return value_;
  }
}
