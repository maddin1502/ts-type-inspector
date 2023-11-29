import type { ArrayItem } from 'ts-lib-extended';
import type { AnyLike, Validatable } from '../types.js';
import { Validator } from './index.js';

/**
 * Validator for precisely defined values (not just of specific type)
 * Keep in mind that object are compaired by reference (equality)
 *
 * @since 1.0.0
 * @export
 * @template V
 */
export type StrictValidatable<V extends AnyLike[]> = Validatable<ArrayItem<V>>;

/**
 * Validator for precisely defined values (not just of specific type)
 * Keep in mind that object are compaired by reference (equality)
 *
 * @since 1.0.0
 * @export
 * @class StrictValidator
 * @extends {Validator<ArrayItem<V>>}
 * @implements {StrictValidatable<V>}
 * @template V
 */
export class StrictValidator<V extends AnyLike[]>
  extends Validator<ArrayItem<V>>
  implements StrictValidatable<V>
{
  private _strictValues: V;

  constructor(...strictValues_: V) {
    super();
    this._strictValues = strictValues_;
  }

  protected validateBaseType(value_: unknown): ArrayItem<V> {
    if (!this._strictValues.some((value) => value === value_)) {
      this.throwValidationError('no equality found');
    }

    return value_ as ArrayItem<V>;
  }
}
