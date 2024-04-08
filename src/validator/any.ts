import type { Validator } from '@/types.js';
import { DefaultValidator } from './index.js';

/**
 * This validator should only be used when a value is indeterminate or when you want to bypass deep validation of an object
 *
 * @export
 * @interface AnyValidator
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {Validator<any, ValidationParams>}
 * @since 1.0.0
 */
export interface AnyValidator<ValidationParams = unknown>
  extends Validator<any, ValidationParams> {
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
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {DefaultValidator<any, ValidationParams>}
 * @implements {AnyValidator<ValidationParams>}
 * @since 1.0.0
 */
export class DefaultAnyValidator<ValidationParams = unknown>
  extends DefaultValidator<any, ValidationParams>
  implements AnyValidator<ValidationParams>
{
  public get notNullish(): this {
    return this.setupCondition((value_) => this.checkNullish(value_));
  }

  public get notFalsy(): this {
    return this.setupCondition((value_) => this.checkFalsy(value_));
  }

  protected validateBaseType(
    value_: unknown,
    _params_?: ValidationParams
  ): any {
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
