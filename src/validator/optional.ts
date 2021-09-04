import { Validator } from '.';
import type { Validatable } from '../types';

/**
 * Validator for optional (maybe undefined) properties/values
 *
 * @export
 * @class OptionalValidator
 * @extends {(Validator<undefined | V>)}
 * @template V
 */
export class OptionalValidator<V> extends Validator<undefined | V> {
  constructor(
    private _validator: Validatable<V>
  ) {
    super();
  }

  protected validateValue(value_: unknown): undefined | V {
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
