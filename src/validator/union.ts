import type { UnitedValidators, UnitedValidatorsItem } from '../types';
import { Validator } from './index';

/**
 * Validator for union type values (like "string | number")
 *
 * @since 1.0.0
 * @export
 * @class UnionValidator
 * @extends {Validator<V>}
 * @template V
 * @template U
 */
export class UnionValidator<V extends UnitedValidatorsItem<U>, U extends UnitedValidators = UnitedValidators<V>> extends Validator<V> {
  private _validators: U;

  constructor(
    ...validators_: U
  ) {
    super();
    this._validators = validators_;
  }

  protected validateBaseType(value_: unknown): V {
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

    return value_ as V;
  }
}
