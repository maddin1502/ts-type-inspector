import type { Validatable, ValidationParameters } from '../types.js';
import { Validator } from './index.js';

/**
 * This validator should only be used when a value is indeterminate or when you want to bypass deep validation of an object
 *
 * @export
 * @template [In=unknown]
 * @template {ValidationParameters} [P={}]
 * @since 1.0.0
 */
export type AnyValidatable<In = unknown, P extends ValidationParameters = {}> = Validatable<any, In, P> & {
  /**
   * reject nullish values (undefined, null)
   *
   * @readonly
   * @type {AnyValidatable<In, P>}
   * @since 1.0.0
   */
  get notNullish(): AnyValidatable<In, P>;
  /**
   * reject falsy values (undefined, null, 0, false, '', NaN, 0n, ...)
   *
   * @readonly
   * @type {AnyValidatable<In, P>}
   * @since 1.0.0
   */
  get notFalsy(): AnyValidatable<In, P>;
};

/**
 * This validator should only be used when a value is indeterminate or when you want to bypass deep validation of an object
 *
 * @export
 * @class AnyValidator
 * @template [In=unknown]
 * @template {ValidationParameters} [P={}]
 * @extends {Validator<any, In, P>}
 * @implements {AnyValidatable<In, P>}
 * @since 1.0.0
 */
export class AnyValidator<In = unknown, P extends ValidationParameters = {}>
  extends Validator<any, In, P>
  implements AnyValidatable<In, P>
{
  public get notNullish(): AnyValidatable<In, P> {
    return this.setupCondition((value_) => this.checkNullish(value_));
  }

  public get notFalsy(): AnyValidatable<In, P> {
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
