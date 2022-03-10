import { Enumerable } from 'ts-lib-extended';
import { Validator } from '.';
import { EnumerableMapValue, EnumerableValue, Validatable } from '../types';

/**
 * Validator for enum values
 *
 * @since 1.0.0
 * @export
 * @class EnumValidator
 * @extends {Validator<TValue>}
 * @template T
 * @template TEnum
 * @template TValue
 */
export class EnumValidator<T, TEnum extends Enumerable<T>, TValue extends EnumerableValue<T, TEnum>>
  extends Validator<TValue>
{
  /**
   * Creates an instance of EnumValidator.
   * @param {TEnum} _enum
   * @param {Validatable<EnumerableMapValue<TValue>>} [_validator] validator for additional base type validation
   * @memberof EnumValidator
   */
  constructor(
    private readonly _enum: TEnum,
    private readonly _validator?: Validatable<EnumerableMapValue<TValue>>
  ) {
    super();
  }

  protected validateBaseType(value_: unknown): TValue {
    if (this._validator && !this._validator.isValid(value_)) {
      this.throwValidationError('value does not match enums base type');
    }

    if (!this.isEnumValue(this._enum, value_)) {
      this.throwValidationError('value does not exist in enum');
    }

    return value_;
  }

  private isEnumValue(enum_: TEnum, value_: unknown): value_ is TValue {
    const enumValues = Object.values(enum_);

    for (let i = 0; i < enumValues.length; i++) {
      if (enumValues[i] === value_) {
        return true;
      }
    }

    return false;
  }
}
