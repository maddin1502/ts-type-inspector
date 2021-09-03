import { ArrayItem, MinArray } from 'ts-lib-extended';
import { Validatable } from '../types';
import { Validator } from './index';

// export type ValidatorsValue<A>
//   = A extends ArrayLike<infer V>
//     ? V extends Validatable<infer T>
//       ? T
//       : never
//     : never;

export type ValidatorsValue<A extends IterableIterator<any> | ArrayLike<any>>
  = ArrayItem<A> extends Validatable<infer T>
    ? T
    : never

/**
 * Validator for union type values (like "string | number")
 *
 * @export
 * @class UnionValidator
 * @extends {Validator<ValidatorsValue<V>>}
 * @template V
 */
export class UnionValidator<TValue extends ValidatorsValue<A>, A extends MinArray<Validatable<any>, 2> = MinArray<Validatable<TValue>, 2>> extends Validator<TValue> {
  private _validators: A;

  constructor(
    ...validators_: A
  ) {
    super();
    this._validators = validators_;
  }

  protected validateValue(value_: unknown): TValue {
    const errors: Error[] = [];

    for (let i = 0; i < this._validators.length; i++) {
      const validator = this._validators[i];

      try {
        validator.validate(value_);
        break;
      } catch (reason_) {
        errors.push(this.detectError(reason_));
      }
    }

    if (errors.length === this._validators.length) {
      this.throwValidationError('value does not match any of the possible types', undefined, errors);
    }

    return value_ as TValue;
  }
}
