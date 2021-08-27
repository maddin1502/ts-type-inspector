import { Validator, ValidatorInterface } from '.';

export class OptionalValidator<TValue>
  extends Validator<undefined | TValue>
  implements OptionalValidatorInterface<TValue>
{
  constructor(
    private _validator: ValidatorInterface<TValue>
  ) {
    super();
  }

  protected validateValue(value_: unknown): undefined | TValue {
    if (typeof value_ === 'undefined') {
      return value_;
    }

    let validatedValue: TValue;

    try {
      validatedValue = this._validator.validate(value_);
    } catch (error_) {
      this.rethrowError(error_);
    }

    return validatedValue;
  }
}

/**
 * Validator for optional (maybe undefined) properties/values
 *
 * @export
 * @interface OptionalValidatorInterface
 * @extends {(ValidatorInterface<undefined | T>)}
 * @template T
 */
export interface OptionalValidatorInterface<T> extends ValidatorInterface<undefined | T> {}
