import { Validator } from '.';
import type { Validatable } from '../types';

export type AnyValidatable = Validatable<any> & {
  /**
   * reject nullish values (undefined, null)
   *
   * @since 1.0.0
   */
  get notNullish(): AnyValidatable;
  /**
   * reject falsy values (undefined, null, 0, false, '', NaN, 0n, ...)
   *
   * @since 1.0.0
   */
  get notFalsy(): AnyValidatable;
};

/**
 * This validator should only be used when a value is indeterminate or when you want to bypass deep validation of an object
 *
 * @since 1.0.0
 * @export
 * @class AnyValidator
 * @extends {Validator<any>}
 * @implements {AnyValidatable}
 */
export class AnyValidator
  extends Validator<any>
  implements AnyValidatable
{
  public get notNullish(): AnyValidatable {
    return this.setupCondition(value_ => this.checkNullish(value_));
  }

  public get notFalsy(): AnyValidatable {
    return this.setupCondition(value_ => this.checkFalsy(value_));
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
