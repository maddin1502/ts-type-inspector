import type {
  EmptyObject,
  ExtendedValidationParameters,
  Validatable
} from '../types.js';
import { Validator } from './index.js';

/**
 * This validator should only be used when a value is indeterminate or when you want to bypass deep validation of an object
 *
 * @export
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @since 1.0.0
 */
export type AnyValidatable<
  EVP extends ExtendedValidationParameters = EmptyObject
> = Validatable<any, EVP> & {
  /**
   * reject nullish values (undefined, null)
   *
   * @readonly
   * @type {AnyValidatable<EVP>}
   * @since 1.0.0
   */
  get notNullish(): AnyValidatable<EVP>;
  /**
   * reject falsy values (undefined, null, 0, false, '', NaN, 0n, ...)
   *
   * @readonly
   * @type {AnyValidatable<EVP>}
   * @since 1.0.0
   */
  get notFalsy(): AnyValidatable<EVP>;
};

/**
 * This validator should only be used when a value is indeterminate or when you want to bypass deep validation of an object
 *
 * @export
 * @class AnyValidator
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @extends {Validator<any, EVP>}
 * @implements {AnyValidatable<EVP>}
 * @since 1.0.0
 */
export class AnyValidator<
    EVP extends ExtendedValidationParameters = EmptyObject
  >
  extends Validator<any, EVP>
  implements AnyValidatable<EVP>
{
  public get notNullish(): AnyValidatable<EVP> {
    return this.setupCondition((value_) => this.checkNullish(value_));
  }

  public get notFalsy(): AnyValidatable<EVP> {
    return this.setupCondition((value_) => this.checkFalsy(value_));
  }

  protected validateBaseType(value_: unknown): any {
    return value_;
  }

  private checkNullish(value_: any): void {
    if (value_ === null || value_ === undefined) {
      this.throwValidationError('value is nullish');
    }
  }

  private checkFalsy(value_: any): void {
    if (!value_) {
      this.throwValidationError('value is falsy');
    }
  }
}
