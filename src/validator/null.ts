import type { Validatable } from '../types.js';
import { Validator } from './index.js';

/**
 * Validator for null values
 *
 * @since 1.0.0
 * @export
 */
export type NullValidatable = Validatable<null>;

/**
 * Validator for null values
 *
 * @since 1.0.0
 * @export
 * @class NullValidator
 * @extends {Validator<null>}
 * @implements {NullValidatable}
 */
export class NullValidator extends Validator<null> implements NullValidatable {
  protected validateBaseType(value_: unknown): null {
    if (value_ !== null) {
      this.throwValidationError('value is not null');
    }

    return value_;
  }
}
