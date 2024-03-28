import type {
  EmptyObject,
  ExtendedValidationParameters,
  Validatable
} from '../types.js';
import { Validator } from './index.js';

/**
 * Validator for boolean values
 *
 * @export
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @since 1.0.0
 */
export type BooleanValidatable<
  EVP extends ExtendedValidationParameters = EmptyObject
> = Validatable<boolean, EVP> & {
  /**
   * accept just true
   *
   * @readonly
   * @type {BooleanValidatable<EVP>}
   * @since 1.0.0
   */
  get true(): BooleanValidatable<EVP>;
  /**
   * accept just false
   *
   * @readonly
   * @type {BooleanValidatable<EVP>}
   * @since 1.0.0
   */
  get false(): BooleanValidatable<EVP>;
};

/**
 * Validator for boolean values
 *
 * @export
 * @class BooleanValidator
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @extends {Validator<boolean, EVP>}
 * @implements {BooleanValidatable<EVP>}
 * @since 1.0.0
 */
export class BooleanValidator<
    EVP extends ExtendedValidationParameters = EmptyObject
  >
  extends Validator<boolean, EVP>
  implements BooleanValidatable<EVP>
{
  public get true(): BooleanValidatable<EVP> {
    return this.setupCondition((value_) => this.checkTrue(value_));
  }

  public get false(): BooleanValidatable<EVP> {
    return this.setupCondition((value_) => this.checkFalse(value_));
  }

  protected validateBaseType(value_: unknown): boolean {
    if (typeof value_ !== 'boolean') {
      this.throwValidationError('value is not a boolean');
    }

    return value_;
  }

  private checkTrue(value_: boolean): void {
    if (!value_) {
      this.throwValidationError('boolean is false');
    }
  }

  private checkFalse(value_: boolean): void {
    if (value_) {
      this.throwValidationError('boolean is true');
    }
  }
}
