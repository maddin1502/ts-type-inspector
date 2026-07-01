import type { Validator } from '@/types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for symbol values
 *
 * @export
 * @interface SymbolValidator
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {Validator<symbol, ValidationParams>}
 * @since 4.0.0
 */
export interface SymbolValidator<ValidationParams = unknown> extends Validator<
  symbol,
  ValidationParams
> {}

/**
 * Validator for symbol values
 *
 * @export
 * @class DefaultSymbolValidator
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {DefaultValidator<symbol, ValidationParams>}
 * @implements {SymbolValidator<ValidationParams>}
 * @since 4.0.0
 */
export class DefaultSymbolValidator<ValidationParams = unknown>
  extends DefaultValidator<symbol, ValidationParams>
  implements SymbolValidator<ValidationParams>
{
  protected validateBaseType(
    value_: unknown,
    _params_?: ValidationParams
  ): symbol {
    if (typeof value_ === 'symbol') {
      return value_;
    }

    this.throwValidationError('value is not a symbol');
  }
}
