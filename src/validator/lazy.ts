import type { Validator } from '@/types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator that resolves its inner validator lazily (on validation), enabling
 * recursive/self-referential schemas.
 *
 * @export
 * @interface LazyValidator
 * @template Out
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {Validator<Out, ValidationParams>}
 * @since 4.0.0
 */
export interface LazyValidator<
  Out,
  ValidationParams = unknown
> extends Validator<Out, ValidationParams> {}

/**
 * Validator that resolves its inner validator lazily (on validation), enabling
 * recursive/self-referential schemas.
 *
 * @export
 * @class DefaultLazyValidator
 * @template Out
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {DefaultValidator<Out, ValidationParams>}
 * @implements {LazyValidator<Out, ValidationParams>}
 * @since 4.0.0
 */
export class DefaultLazyValidator<Out, ValidationParams = unknown>
  extends DefaultValidator<Out, ValidationParams>
  implements LazyValidator<Out, ValidationParams>
{
  /**
   * Creates an instance of DefaultLazyValidator.
   *
   * @constructor
   * @param {() => Validator<Out, ValidationParams>} _validatorFactory produces the actual validator on demand
   */
  constructor(
    private readonly _validatorFactory: () => Validator<Out, ValidationParams>
  ) {
    super();
  }

  protected validateBaseType(value_: unknown, params_?: ValidationParams): Out {
    try {
      return this._validatorFactory().validate(value_, params_);
    } catch (reason_) {
      this.rethrowError(reason_, undefined, params_);
    }
  }
}
