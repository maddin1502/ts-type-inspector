import type {
  EmptyObject,
  Enumerable,
  EnumerableBase,
  EnumerableValue
} from 'ts-lib-extended';
import { enumerableObject } from 'ts-lib-extended';
import type { ExtendedValidationParameters, Validator } from '../types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for enum values
 *
 * @export
 * @interface EnumValidator
 * @template {Enumerable} E
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @extends {Validator<EnumerableValue<E>, EVP>}
 * @since 1.0.2
 */
export interface EnumValidator<
  E extends Enumerable,
  EVP extends ExtendedValidationParameters = EmptyObject
> extends Validator<EnumerableValue<E>, EVP> {
  /**
   * additional base type validation for enum values
   *
   * @since 1.0.2
   */
  values(validator_: Validator<EnumerableBase<EnumerableValue<E>>>): this;
}

/**
 * Validator for enum values
 *
 * @export
 * @class DefaultEnumValidator
 * @template {Enumerable} E
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @extends {DefaultValidator<EnumerableValue<E>, EVP>}
 * @implements {EnumValidator<E, EVP>}
 * @since 1.0.2
 */
export class DefaultEnumValidator<
    E extends Enumerable,
    EVP extends ExtendedValidationParameters = EmptyObject
  >
  extends DefaultValidator<EnumerableValue<E>, EVP>
  implements EnumValidator<E, EVP>
{
  constructor(private readonly _enum: E) {
    super();
  }

  public values(
    validator_: Validator<EnumerableBase<EnumerableValue<E>>>
  ): this {
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
    validator_: Validator<EnumerableBase<EnumerableValue<E>>>
  ): void {
    if (!validator_.isValid(value_)) {
      this.throwValidationError('value does not match enums base type');
    }
  }
}
