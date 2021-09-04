import { Validator } from '.';
import type { AnyLike, StrictValues, StrictValuesItem } from '../types';

/**
 * Validator for precisely defined values (not just of specific type)
 * Keep in mind that object are compaired by reference (equality)
 *
 * @export
 * @class StrictValidator
 * @extends {Validator<V>}
 * @template V
 * @template S
 */
export class StrictValidator<V extends StrictValuesItem<S>, S extends StrictValues = StrictValues<V>> extends Validator<V> {
  private _strictValues: S;

  constructor(
    ...strictValues_: S
  ) {
    super();
    this._strictValues = strictValues_;
  }

  protected validateValue(value_: AnyLike): V {
    if (!this._strictValues.includes(value_)) {
      this.throwValidationError('no equality found');
    }

    return value_ as V;
  }
}
