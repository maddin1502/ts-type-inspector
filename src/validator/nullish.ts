import type { ObjectLike, Validator } from '../types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for nullish values (null or undefined)
 *
 * @export
 * @interface NullishValidator
 * @template {ObjectLike} [ValidationParams=any] extended validation parameters
 * @extends {Validator<null | undefined, ValidationParams>}
 * @since 1.0.0
 */
export interface NullishValidator<ValidationParams extends ObjectLike = any>
  extends Validator<null | undefined, ValidationParams> {}

/**
 * Validator for nullish values (null or undefined)
 *
 * @export
 * @class DefaultNullishValidator
 * @template {ObjectLike} [ValidationParams=any] extended validation parameters
 * @extends {DefaultValidator<null | undefined, ValidationParams>}
 * @implements {NullishValidator<ValidationParams>}
 * @since 1.0.0
 */
export class DefaultNullishValidator<ValidationParams extends ObjectLike = any>
  extends DefaultValidator<null | undefined, ValidationParams>
  implements NullishValidator<ValidationParams>
{
  protected validateBaseType(
    value_: unknown,
    _params_?: ValidationParams
  ): null | undefined {
    if (value_ === null || value_ === undefined) {
      return value_;
    }

    this.throwValidationError('value is not nullish');
  }
}
