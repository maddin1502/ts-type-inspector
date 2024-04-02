import type {
  ExtendedValidationParameters,
  NoParameters,
  Validator
} from '../types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for boolean values
 *
 * @export
 * @interface BooleanValidator
 * @template {ExtendedValidationParameters} [EVP=NoParameters]
 * @extends {Validator<boolean, EVP>}
 * @since 1.0.0
 */
export interface BooleanValidator<
  EVP extends ExtendedValidationParameters = NoParameters
> extends Validator<boolean, EVP> {
  /**
   * accept just true
   *
   * @readonly
   * @type {this}
   * @since 1.0.0
   */
  get true(): this;
  /**
   * accept just false
   *
   * @readonly
   * @type {this}
   * @since 1.0.0
   */
  get false(): this;
}

/**
 * Validator for boolean values
 *
 * @export
 * @class DefaultBooleanValidator
 * @template {ExtendedValidationParameters} [EVP=NoParameters]
 * @extends {DefaultValidator<boolean, EVP>}
 * @implements {BooleanValidator<EVP>}
 * @since 1.0.0
 */
export class DefaultBooleanValidator<
    EVP extends ExtendedValidationParameters = NoParameters
  >
  extends DefaultValidator<boolean, EVP>
  implements BooleanValidator<EVP>
{
  public get true(): this {
    return this.setupCondition((value_) => this.checkTrue(value_));
  }

  public get false(): this {
    return this.setupCondition((value_) => this.checkFalse(value_));
  }

  protected validateBaseType(value_: unknown, _params_?: EVP): boolean {
    if (typeof value_ === 'boolean') {
      return value_;
    }

    this.throwValidationError('value is not a boolean');
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
