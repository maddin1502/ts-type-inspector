import { Validator } from '.';
import type { Validatable } from '../types';

export type OptionalValidatable<V> = Validatable<undefined | V>;

/**
 * Validator for optional (maybe undefined) properties/values
 *
 * @since 1.0.0
 * @export
 * @class OptionalValidator
 * @extends {(Validator<undefined | V>)}
 * @implements {OptionalValidatable<V>}
 * @template V
 */
export class OptionalValidator<V>
  extends Validator<undefined | V>
  implements OptionalValidatable<V>
{
  constructor(
    private readonly _validator: Validatable<V>
  ) {
    super();
  }

  protected validateBaseType(value_: unknown): undefined | V {
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
