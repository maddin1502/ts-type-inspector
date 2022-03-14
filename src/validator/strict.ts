import { Validator } from '.';
import type { AnyLike, StrictValues, StrictValuesItem, Validatable } from '../types';

export type StrictValidatable<Out extends StrictValuesItem<S>, S extends StrictValues = StrictValues<Out>> = Validatable<Out>;

/**
 * Validator for precisely defined values (not just of specific type)
 * Keep in mind that object are compaired by reference (equality)
 *
 * @since 1.0.0
 * @export
 * @class StrictValidator
 * @extends {Validator<Out>}
 * @template Out
 * @template S
 */
export class StrictValidator<Out extends StrictValuesItem<S>, S extends StrictValues = StrictValues<Out>> extends Validator<Out> {
  private _strictValues: S;

  constructor(
    ...strictValues_: S
  ) {
    super();
    this._strictValues = strictValues_;
  }

  protected validateBaseType(value_: AnyLike): Out {
    if (!this._strictValues.includes(value_)) {
      this.throwValidationError('no equality found');
    }

    return value_ as Out;
  }
}
