import { Validator, ValidatorInterface } from '.';

export class UndefinedValidator
  extends Validator<undefined>
  implements UndefinedValidatorInterface
{
  protected validateValue(value_: unknown): undefined {
    if (value_ !== undefined) {
      this.throwValidationError('value is defined');
    }

    return value_;
  }
}

/**
 * Validator for undefined values
 *
 * @export
 * @interface UndefinedValidatorInterface
 * @extends {ValidatorInterface<undefined>}
 */
export interface UndefinedValidatorInterface extends ValidatorInterface<undefined> {}
