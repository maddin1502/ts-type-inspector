import { Validator } from '.';

/**
 * This validator should only be used when a value is indeterminate or when you want to bypass deep validation of an object
 *
 * @since 1.0.0
 * @export
 * @class AnyValidator
 * @extends {Validator<any>}
 */
export class AnyValidator extends Validator<any> {
  /**
   * forbid nullish values (undefined, null)
   *
   * @since 1.0.0
   * @readonly
   * @type {this}
   * @memberof AnyValidator
   */
  public get notNullish(): this {
    return this.setupCondition(value_ => this.checkNullish(value_));
  }

  /**
   * forbid falsy values (undefined, null, 0, false, '', NaN, 0n, ...)
   *
   * @since 1.0.0
   * @readonly
   * @type {this}
   * @memberof AnyValidator
   */
  public get notFalsy(): this {
    return this.setupCondition(value_ => this.checkFalsy(value_));
  }

  protected validateBaseType(value_: unknown): any {
    return value_ as any;
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
