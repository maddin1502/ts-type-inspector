import { Enumerable, EnumerableBase, EnumerableValue } from 'ts-lib-extended';
import { Validator } from '.';
import { Validatable } from '../types';

/**
 * Validator for enum values
 *
 * @since 1.0.0
 * @export
 * @class EnumValidator
 * @extends {Validator<EnumerableValue<E>>}
 * @template E
 */
export class EnumValidator<E extends Enumerable<unknown>>
  extends Validator<EnumerableValue<E>>
{
  /**
   * @param {E} _enum
   * @param {Validatable<EnumerableMapValue<TValue>>} [_validator] validator for additional base type validation
   * @memberof EnumValidator
   */
  constructor(
    private readonly _enum: E,
    private readonly _validator?: Validatable<EnumerableBase<EnumerableValue<E>>>
  ) {
    super();
  }

  protected validateBaseType(value_: unknown): EnumerableValue<E> {
    if (this._validator && !this._validator.isValid(value_)) {
      this.throwValidationError('value does not match enums base type');
    }

    if (!this.isEnumValue(this._enum, value_)) {
      this.throwValidationError('value does not exist in enum');
    }

    return value_;
  }

  private isEnumValue(enum_: E, value_: unknown): value_ is EnumerableValue<E> {
    const entries = Object.entries(enum_);

    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i];

      if (/^[0-9]$/.exec(key)) {
        continue;
      }

      if (value === value_) {
        return true;
      }
    }

    return false;
  }
}
