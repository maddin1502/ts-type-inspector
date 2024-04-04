import type { Validator } from '../types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for undefined values
 *
 * @export
 * @interface UndefinedValidator
 * @template [ValidationParams=any] extended validation parameters
 * @extends {Validator<undefined, ValidationParams>}
 * @since 1.0.0
 */
export interface UndefinedValidator<ValidationParams = any>
  extends Validator<undefined, ValidationParams> {}

/**
 * Validator for undefined values
 *
 * @export
 * @class DefaulUndefinedValidator
 * @template [ValidationParams=any] extended validation parameters
 * @extends {DefaultValidator<undefined, ValidationParams>}
 * @implements {UndefinedValidator<ValidationParams>}
 * @since 1.0.0
 */
export class DefaulUndefinedValidator<ValidationParams = any>
  extends DefaultValidator<undefined, ValidationParams>
  implements UndefinedValidator<ValidationParams>
{
  protected validateBaseType(
    value_: unknown,
    _params_?: ValidationParams
  ): undefined {
    if (value_ === undefined) {
      return value_;
    }

    this.throwValidationError('value is defined');
  }
}
