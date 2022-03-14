import type { UnitedValidators, UnitedValidatorsItem, Validatable } from '../types';
import { Validator } from './index';

export type UnionValidatable<Out extends UnitedValidatorsItem<U>, U extends UnitedValidators = UnitedValidators<Out>> = Validatable<Out>;

/**
 * Validator for union type values (like "string | number")
 *
 * @since 1.0.0
 * @export
 * @class UnionValidator
 * @extends {Validator<Out>}
 * @implements {UnionValidatable<Out, U>}
 * @template Out
 * @template U
 */
export class UnionValidator<Out extends UnitedValidatorsItem<U>, U extends UnitedValidators = UnitedValidators<Out>>
  extends Validator<Out>
  implements UnionValidatable<Out, U>
{
  private _validators: U;

  constructor(
    ...validators_: U
  ) {
    super();
    this._validators = validators_;
  }

  protected validateBaseType(value_: unknown): Out {
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

    return value_ as Out;
  }
}
