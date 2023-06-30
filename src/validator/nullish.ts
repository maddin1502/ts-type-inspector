import type { Validatable } from '../types.js';
import { Validator } from './index.js';

/**
 * Validator for nullish values (null or undefined)
 *
 * @since 1.0.0
 * @export
 */
export type NullishValidatable = Validatable<null | undefined>;

/**
 * Validator for nullish values (null or undefined)
 *
 * @since 1.0.0
 * @export
 * @class NullishValidator
 * @extends {(Validator<null | undefined>)}
 * @implements {NullishValidatable}
 */
export class NullishValidator
  extends Validator<null | undefined>
  implements NullishValidatable
{
  protected validateBaseType(value_: unknown): null | undefined {
    if (value_ !== null && value_ !== undefined) {
      this.throwValidationError('value is not nullish');
    }

    return value_;
  }
}
