import type { Validator } from '@/types.js';
import type { Constructor } from 'ts-lib-extended';
import { DefaultValidator } from './index.js';

/**
 * Validator for class instances (uses the `instanceof` operator)
 *
 * @export
 * @interface InstanceValidator
 * @template Out
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {Validator<Out, ValidationParams>}
 * @since 4.0.0
 */
export interface InstanceValidator<
  Out,
  ValidationParams = unknown
> extends Validator<Out, ValidationParams> {}

/**
 * Validator for class instances (uses the `instanceof` operator)
 *
 * @export
 * @class DefaultInstanceValidator
 * @template Out
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {DefaultValidator<Out, ValidationParams>}
 * @implements {InstanceValidator<Out, ValidationParams>}
 * @since 4.0.0
 */
export class DefaultInstanceValidator<Out, ValidationParams = unknown>
  extends DefaultValidator<Out, ValidationParams>
  implements InstanceValidator<Out, ValidationParams>
{
  /**
   * Creates an instance of DefaultInstanceValidator.
   *
   * @constructor
   * @param {Constructor<Out>} _constructor the class/constructor to check against
   */
  constructor(private readonly _constructor: Constructor<Out>) {
    super();
  }

  protected validateBaseType(
    value_: unknown,
    _params_?: ValidationParams
  ): Out {
    if (value_ instanceof this._constructor) {
      return value_;
    }

    this.throwValidationError('value is not an instance of the expected type');
  }
}
