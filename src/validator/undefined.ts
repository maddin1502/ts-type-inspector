import { Validator } from '.';
import type { Validatable } from '../types';

export type UndefinedValidatable = Validatable<undefined>;

/**
 * Validator for undefined values
 *
 * @since 1.0.0
 * @export
 * @class UndefinedValidator
 * @extends {Validator<undefined>}
 * @implements {UndefinedValidatable}
 */
export class UndefinedValidator
  extends Validator<undefined>
  implements UndefinedValidatable
{
  protected validateBaseType(value_: unknown): undefined {
    if (value_ !== undefined) {
      this.throwValidationError('value is defined');
    }

    return value_;
  }
}
