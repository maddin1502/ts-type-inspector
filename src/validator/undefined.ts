import type { Validator } from '@/types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for undefined values
 *
 * @export
 * @interface UndefinedValidator
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {Validator<undefined, ValidationParams>}
 * @since 1.0.0
 */
export interface UndefinedValidator<ValidationParams = unknown>
  extends Validator<undefined, ValidationParams> {}

/**
 * Validator for undefined values
 *
 * @export
 * @class DefaultUndefinedValidator
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {DefaultValidator<undefined, ValidationParams>}
 * @implements {UndefinedValidator<ValidationParams>}
 * @since 1.0.0
 */
export class DefaultUndefinedValidator<ValidationParams = unknown>
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

/**
 * Validator for undefined values
 *
 * @export
 * @deprecated misspelled name - use {@link DefaultUndefinedValidator} instead
 * @since 1.0.0
 */
export const DefaulUndefinedValidator = DefaultUndefinedValidator;

/**
 * Validator for undefined values
 *
 * @export
 * @deprecated misspelled name - use {@link DefaultUndefinedValidator} instead
 * @since 1.0.0
 */
export type DefaulUndefinedValidator<ValidationParams = unknown> =
  DefaultUndefinedValidator<ValidationParams>;
