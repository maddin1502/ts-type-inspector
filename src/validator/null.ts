import type { Validator } from '../types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for null values
 *
 * @export
 * @interface NullValidator
 * @template [ValidationParams=any] extended validation parameters
 * @extends {Validator<null, ValidationParams>}
 * @since 1.0.0
 */
export interface NullValidator<ValidationParams = any>
  extends Validator<null, ValidationParams> {}

/**
 * Validator for null values
 *
 * @export
 * @class DefaultNullValidator
 * @template [ValidationParams=any] extended validation parameters
 * @extends {DefaultValidator<null, ValidationParams>}
 * @implements {NullValidator<ValidationParams>}
 * @since 1.0.0
 */
export class DefaultNullValidator<ValidationParams = any>
  extends DefaultValidator<null, ValidationParams>
  implements NullValidator<ValidationParams>
{
  protected validateBaseType(
    value_: unknown,
    _params_?: ValidationParams
  ): null {
    if (value_ === null) {
      return value_;
    }

    this.throwValidationError('value is not null');
  }
}
