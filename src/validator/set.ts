import type { ValidationError } from '@/error.js';
import type { NestedValidator, Validator } from '@/types.js';
import { DefaultValidator } from './index.js';

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
 * @extends {DefaultValidator<Set<V>, ValidationParams>}
 * @implements {SetValidator<V, ValidationParams>}
 * @since 4.0.0
 */
export class DefaultSetValidator<V, ValidationParams = unknown>
  extends DefaultValidator<Set<V>, ValidationParams>
  implements SetValidator<V, ValidationParams>
{
  constructor(
    private readonly _itemValidator: NestedValidator<V, ValidationParams>
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

    const set = value_ as Set<unknown>;
    const errors: ValidationError[] = [];
    let index = 0;

    for (const item of set) {
      try {
        this.validateNested(item, this._itemValidator, params_);
      } catch (reason_) {
        if (this.aggregatesErrors) {
          errors.push(this.collectNestedError(reason_, index));
        } else {
          this.rethrowError(reason_, index);
        }
      }

      index++;
    }

    if (errors.length > 0) {
      this.throwValidationError(
        'one or more items are invalid',
        undefined,
        errors
      );
    }

    return value_ as Set<V>;
  }
}
