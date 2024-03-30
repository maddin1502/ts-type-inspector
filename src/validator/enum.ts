import type {
  EmptyObject,
  Enumerable,
  EnumerableBase,
  EnumerableValue
} from 'ts-lib-extended';
import { enumerableObject } from 'ts-lib-extended';
import type { ExtendedValidationParameters, Validatable } from '../types.js';
import { Validator } from './index.js';

/**
 * Validator for enum values
 *
 * @export
 * @template {Enumerable} E
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @since 1.0.2
 */
export type EnumValidatable<
  E extends Enumerable,
  EVP extends ExtendedValidationParameters = EmptyObject
> = Validatable<EnumerableValue<E>, EVP> & {
  /**
   * additional base type validation for enum values
   *
   * @since 1.0.2
   */
  values(
    validator_: Validatable<EnumerableBase<EnumerableValue<E>>>
  ): EnumValidatable<E, EVP>;
};

/**
 * Validator for enum values
 *
 * @export
 * @class EnumValidator
 * @template {Enumerable} E
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @extends {Validator<EnumerableValue<E>, EVP>}
 * @implements {EnumValidatable<E, EVP>}
 * @since 1.0.2
 */
export class EnumValidator<
    E extends Enumerable,
    EVP extends ExtendedValidationParameters = EmptyObject
  >
  extends Validator<EnumerableValue<E>, EVP>
  implements EnumValidatable<E, EVP>
{
  constructor(private readonly _enum: E) {
    super();
  }

  public values(
    validator_: Validatable<EnumerableBase<EnumerableValue<E>>>
  ): EnumValidatable<E, EVP> {
    return this.setupCondition((value_) =>
      this.checkValues(value_, validator_)
    );
  }

  protected validateBaseType(value_: unknown): EnumerableValue<E> {
    if (this.isEnumValue(this._enum, value_)) {
      return value_;
    }

    this.throwValidationError('value does not exist in enum');
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
