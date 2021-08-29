import type { ArrayItem, MinArray } from 'ts-lib-extended';
import { Validator } from '.';
import type { AnyLike } from '../types';

// function xyz<T extends ArrayItem<A>, A extends MinArray<BaseType, 2> = MinArray<T, 2>>(...x_: A): T {
//   return null as unknown as T;
// }

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
export class StrictValidator<TValue extends ArrayItem<A>, A extends MinArray<AnyLike, 1>> extends Validator<TValue> {
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
