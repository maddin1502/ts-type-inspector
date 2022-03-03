import { Validator } from '.';

/**
 * Validator for undefined values
 *
 * @export
 * @class UndefinedValidator
 * @extends {Validator<undefined>}
 */
export class UndefinedValidator extends Validator<undefined> {
  protected validateBaseType(value_: unknown): undefined {
    if (value_ !== undefined) {
      this.throwValidationError('value is defined');
    }

    return value_;
  }
}
