import type { ArrayItem, MinArray } from 'ts-lib-extended';
import { Validator } from '.';
import { BaseType } from '../types';


// function xyz<T extends ArrayItem<A>, A extends MinArray<BaseType, 2> = MinArray<T, 2>>(...x_: A): T {
//   return null as unknown as T;
// }

export class EqualsValidator<TValue extends ArrayItem<A>, A extends MinArray<BaseType, 2>> extends Validator<TValue> {
  private _strictValues: A;

  constructor(
    ...strictValues_: A
  ) {
    super();
    this._strictValues = strictValues_;
  }

  protected validateValue(value_: BaseType): TValue {
    if (!this._strictValues.includes(value_)) {
      this.throwValidationError('no equality found');
    }

    return value_ as TValue;
  }
}

/**
 * Validator for precisely defined values (not just of specific type)
 *
 * @export
 * @interface StrictValidatorInterface
 * @extends {ValidatorInterface<TValue>}
 * @template TValue
 */
export interface EqualsValidatorInterface<TValue extends StrictValueType> extends ValidatorInterface<TValue> {}
