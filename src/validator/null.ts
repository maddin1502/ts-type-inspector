import { Validator } from '.';

/**
 * Validator for null values
 *
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
