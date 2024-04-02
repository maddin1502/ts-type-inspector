import type {
  ExtendedValidationParameters,
  NoParameters,
  Validator
} from '../types.js';
import { DefaultValidator } from './index.js';

/**
 * This validator should only be used when a value is indeterminate or when you want to bypass deep validation of an object
 *
 * @export
 * @interface AnyValidator
 * @template {ExtendedValidationParameters} [EVP=NoParameters]
 * @extends {Validator<any, EVP>}
 * @since 1.0.0
 */
export interface AnyValidator<
  EVP extends ExtendedValidationParameters = NoParameters
> extends Validator<any, EVP> {
  /**
   * reject nullish values (undefined, null)
   *
   * @readonly
   * @type {this}
   * @since 1.0.0
   */
  get notNullish(): this;
  /**
   * reject falsy values (undefined, null, 0, false, '', NaN, 0n, ...)
   *
   * @readonly
   * @type {this}
   * @since 1.0.0
   */
  get notFalsy(): this;
}

/**
 * This validator should only be used when a value is indeterminate or when you want to bypass deep validation of an object
 *
 * @export
 * @class DefaultAnyValidator
 * @template {ExtendedValidationParameters} [EVP=NoParameters]
 * @extends {DefaultValidator<any, EVP>}
 * @implements {AnyValidator<EVP>}
 * @since 1.0.0
 */
export class DefaultAnyValidator<
    EVP extends ExtendedValidationParameters = NoParameters
  >
  extends DefaultValidator<any, EVP>
  implements AnyValidator<EVP>
{
  public get notNullish(): this {
    return this.setupCondition((value_) => this.checkNullish(value_));
  }

  public get notFalsy(): this {
    return this.setupCondition((value_) => this.checkFalsy(value_));
  }

  protected validateBaseType(value_: unknown, _params_?: EVP): any {
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
