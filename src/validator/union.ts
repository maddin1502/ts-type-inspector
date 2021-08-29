import { MinArray } from 'ts-lib-extended';
import { Validator } from './index';

type ValidatorsValue<A>
  = A extends ArrayLike<infer V>
    ? V extends Validator<infer T>
      ? T
      : never
    : never;


function xyz<TValue extends ValidatorsValue<A>, A extends MinArray<Validator<any>, 2> = MinArray<Validator<TValue>, 2>>(...v_: A): TValue {
  return null as unknown as TValue;
}
/**
 * Validator for union type values (like "string | number")
 *
 * @export
 * @class UnionValidator
 * @extends {Validator<ValidatorsValue<V>>}
 * @template V
 */
export class UnionValidator<TValue extends ValidatorsValue<A>, A extends MinArray<Validator<any>, 2> = MinArray<Validator<TValue>, 2>> extends Validator<TValue> {
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
