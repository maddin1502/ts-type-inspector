import type {
  Enumerable,
  EnumerableBase,
  EnumerableValue
} from 'ts-lib-extended';
import { enumerableObject } from 'ts-lib-extended';
import type { Validatable } from '../types.js';
import { Validator } from './index.js';

/**
 * Validator for enum values
 *
 * @since 1.0.2
 * @export
 * @template E
 */
export type EnumValidatable<E extends Enumerable> = Validatable<
  EnumerableValue<E>
> & {
  /**
   * additional base type validation for enum values
   *
   * @since 1.0.2
   */
  values(
    validator_: Validatable<EnumerableBase<EnumerableValue<E>>>
  ): EnumValidatable<E>;
};

/**
 * Validator for enum values
 *
 * @since 1.0.2
 * @export
 * @class EnumValidator
 * @extends {Validator<EnumerableValue<E>>}
 * @implements {EnumValidatable<E>}
 * @template E
 */
export class EnumValidator<E extends Enumerable>
  extends Validator<EnumerableValue<E>>
  implements EnumValidatable<E>
{
  constructor(private readonly _enum: E) {
    super();
  }

  public values(
    validator_: Validatable<EnumerableBase<EnumerableValue<E>>>
  ): EnumValidatable<E> {
    return this.setupCondition((value_) =>
      this.checkValues(value_, validator_)
    );
  }

  protected validateBaseType(value_: unknown): EnumerableValue<E> {
    if (!this.isEnumValue(this._enum, value_)) {
      this.throwValidationError('value does not exist in enum');
    }

    return value_;
  }

  private isEnumValue(enum_: E, value_: unknown): value_ is EnumerableValue<E> {
    const values = enumerableObject.values(enum_);

    for (let i = 0; i < values.length; i++) {
      if (values[i] === value_) {
        return true;
      }
    }

    return false;
  }

  private checkValues(
    value_: EnumerableValue<E>,
    validator_: Validatable<EnumerableBase<EnumerableValue<E>>>
  ): void {
    if (!validator_.isValid(value_)) {
      this.throwValidationError('value does not match enums base type');
    }
  }
}
