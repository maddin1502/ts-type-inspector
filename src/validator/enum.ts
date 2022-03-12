import { Enumerable, EnumerableBase, EnumerableValue } from 'ts-lib-extended';
import { Validator } from '.';
import { Validatable } from '../types';

/**
 * Validator for enum values
 *
 * @since 1.0.2
 * @export
 * @class EnumValidator
 * @extends {Validator<EnumerableValue<E>>}
 * @template E
 */
export class EnumValidator<E extends Enumerable<unknown>>
  extends Validator<EnumerableValue<E>>
{
  constructor(
    private readonly _enum: E
  ) {
    super();
  }

  /**
   * additional base type validation for enum values
   *
   * @since 1.0.2
   * @param {Validatable<EnumerableBase<EnumerableValue<E>>>} validator_
   * @return {*}  {this}
   * @memberof EnumValidator
   */
  public values(validator_: Validatable<EnumerableBase<EnumerableValue<E>>>): this {
    return this.setupCondition(value_ => this.checkValues(value_, validator_));
  }

  protected validateBaseType(value_: unknown): EnumerableValue<E> {
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

  private checkValues(value_: EnumerableValue<E>, validator_: Validatable<EnumerableBase<EnumerableValue<E>>>): void {
    if (!validator_.isValid(value_)) {
      this.throwValidationError('value does not match enums base type');
    }
  }
}
