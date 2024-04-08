import type { ArrayItem } from 'ts-lib-extended';
import type { AnyLike, Validator } from '../types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for precisely defined values (not just of specific type)
 * Keep in mind that object are compaired by reference (equality)
 *
 * @export
 * @interface StrictValidator
 * @template {AnyLike[]} V
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {Validator<ArrayItem<V>, ValidationParams>}
 * @since 1.0.0
 */
export interface StrictValidator<
  V extends AnyLike[],
  ValidationParams = unknown
> extends Validator<ArrayItem<V>, ValidationParams> {}

/**
 * Validator for precisely defined values (not just of specific type)
 * Keep in mind that object are compaired by reference (equality)
 *
 * @export
 * @class DefaultStrictValidator
 * @template {AnyLike[]} V
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {DefaultValidator<ArrayItem<V>, ValidationParams>}
 * @implements {StrictValidator<V, ValidationParams>}
 * @since 1.0.0
 */
export class DefaultStrictValidator<
    V extends AnyLike[],
    ValidationParams = unknown
  >
  extends DefaultValidator<ArrayItem<V>, ValidationParams>
  implements StrictValidator<V, ValidationParams>
{
  private readonly _strictValues: V;

  constructor(...strictValues_: V) {
    super();
    this._strictValues = strictValues_;
  }

  protected validateBaseType(
    value_: unknown,
    _params_?: ValidationParams
  ): ArrayItem<V> {
    if (!this._strictValues.some((strictValue_) => strictValue_ === value_)) {
      this.throwValidationError('no equality found');
    }

    return value_ as ArrayItem<V>;
  }
}
