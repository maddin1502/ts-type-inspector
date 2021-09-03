import { Validator } from '.';
import { Validatable } from '../types';

/**
 * Validator for optional (maybe undefined) properties/values
 *
 * @export
 * @class OptionalValidator
 * @extends {(Validator<undefined | TValue>)}
 * @template TValue
 */
export class OptionalValidator<TValue> extends Validator<undefined | TValue> {
  constructor(
    private _validator: Validatable<TValue>
  ) {
    super();
  }

  protected validateValue(value_: unknown): undefined | TValue {
    if (typeof value_ === 'undefined') {
      return value_;
    }

    try {
      return this._validator.validate(value_);
    } catch (reason_) {
      this.rethrowError(reason_);
    }
  }
}
