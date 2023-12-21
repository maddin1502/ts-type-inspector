import type { Validatable, ValidationParameters } from '../types.js';
import { Validator } from './index.js';

/**
 * This validator should only be used when a value is indeterminate or when you want to bypass deep validation of an object
 *
 * @export
 * @template {ValidationParameters} [P={}]
 * @since 1.0.0
 */
export type AnyValidatable<P extends ValidationParameters = {}> = Validatable<any, unknown, P> & {
  /**
   * reject nullish values (undefined, null)
   *
   * @readonly
   * @type {AnyValidatable<P>}
   * @since 1.0.0
   */
  get notNullish(): AnyValidatable<P>;
  /**
   * reject falsy values (undefined, null, 0, false, '', NaN, 0n, ...)
   *
   * @readonly
   * @type {AnyValidatable<P>}
   * @since 1.0.0
   */
  get notFalsy(): AnyValidatable<P>;
};

/**
 * This validator should only be used when a value is indeterminate or when you want to bypass deep validation of an object
 *
 * @export
 * @class AnyValidator
 * @template {ValidationParameters} [P={}]
 * @extends {Validator<any, unknown, P>}
 * @implements {AnyValidatable<P>}
 * @since 1.0.0
 */
export class AnyValidator<P extends ValidationParameters = {}>
  extends Validator<any, unknown, P>
  implements AnyValidatable<P>
{
  public get notNullish(): AnyValidatable<P> {
    return this.setupCondition((value_) => this.checkNullish(value_));
  }

  public get notFalsy(): AnyValidatable<P> {
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
