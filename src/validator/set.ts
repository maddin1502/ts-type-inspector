import type { ValidationError } from '@/error.js';
import type { PropertyValidator, Validator } from '@/types.js';
import { ContainerValidator } from './container.js';

/**
 * Validator for Set values. Each item has to match the item validator.
 *
 * @export
 * @interface SetValidator
 * @template V
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {Validator<Set<V>, ValidationParams>}
 * @since 4.0.0
 */
export interface SetValidator<V, ValidationParams = unknown> extends Validator<
  Set<V>,
  ValidationParams
> {}

/**
 * Validator for Set values. Each item has to match the item validator.
 *
 * @export
 * @class DefaultSetValidator
 * @template V
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {ContainerValidator<Set<V>, ValidationParams>}
 * @implements {SetValidator<V, ValidationParams>}
 * @since 4.0.0
 */
export class DefaultSetValidator<V, ValidationParams = unknown>
  extends ContainerValidator<Set<V>, ValidationParams>
  implements SetValidator<V, ValidationParams>
{
  constructor(
    private readonly _itemValidator: PropertyValidator<V, ValidationParams>
  ) {
    super();
  }

  protected validateBaseType(
    value_: unknown,
    params_?: ValidationParams
  ): Set<V> {
    if (!(value_ instanceof Set)) {
      this.throwValidationError('value is not a set');
    }

    const set: Set<unknown> = value_;
    const errors: ValidationError[] = [];
    let index = 0;

    for (const item of set) {
      this.validateChild(errors, () => item, this._itemValidator, index, params_);
      index++;
    }

    this.throwOnErrors(errors, 'one or more items are invalid');

    return value_ as Set<V>;
  }
}
