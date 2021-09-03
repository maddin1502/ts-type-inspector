import type { ArrayItem, MinArray } from 'ts-lib-extended';
import { Validator } from '.';
import type { AnyLike } from '../types';

/**
 * Validator for precisely defined values (not just of specific type)
 * Keep in mind that object are compaired by reference (equality)
 *
 * @export
 * @class StrictValidator
 * @extends {Validator<TValue>}
 * @template TValue
 * @template A
 */
export class StrictValidator<TValue extends ArrayItem<A>, A extends MinArray<AnyLike, 1> = MinArray<TValue, 1>> extends Validator<TValue> {
  private _strictValues: A;

  constructor(
    ...strictValues_: A
  ) {
    super();
    this._strictValues = strictValues_;
  }

  protected validateValue(value_: AnyLike): TValue {
    if (!this._strictValues.includes(value_)) {
      this.throwValidationError('no equality found');
    }

    return value_ as TValue;
  }
}
