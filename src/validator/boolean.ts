import { Validator } from '.';

/**
 * Validator for boolean values
 *
 * @export
 * @class BooleanValidator
 * @extends {Validator<boolean>}
 */
export class BooleanValidator extends Validator<boolean> {
  /**
   * allow just true
   *
   * @since 1.0.0
   * @readonly
   * @type {this}
   * @memberof BooleanValidator
   */
  public get true(): this {
    return this.setupCondition(value_ => this.checkTrue(value_));
  }

  /**
   * allow just false
   *
   * @since 1.0.0
   * @readonly
   * @type {this}
   * @memberof BooleanValidator
   */
  public get false(): this {
    return this.setupCondition(value_ => this.checkFalse(value_));
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
