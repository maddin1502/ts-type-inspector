import { Validator } from '.';

/**
 * Validator for boolean values
 *
 * @export
 * @class BooleanValidator
 * @extends {Validator<boolean>}
 */
export class BooleanValidator extends Validator<boolean> {
  private _justTrue: boolean;
  private _justFalse: boolean;

  constructor() {
    super();
    this._justTrue = false;
    this._justFalse = false;
  }

  /**
   * allow just true
   *
   * @readonly
   * @type {this}
   * @memberof BooleanValidator
   */
  public get true(): this {
    this._justTrue = true;
    return this;
  }

  /**
   * allow just false
   *
   * @readonly
   * @type {this}
   * @memberof BooleanValidator
   */
  public get false(): this {
    this._justFalse = true;
    return this;
  }

  protected validateValue(value_: unknown): boolean {
    if (typeof value_ !== 'boolean') {
      this.throwValidationError('value is not a boolean');
    }

    if (this._justTrue && !value_) {
      this.throwValidationError('value is false');
    }

    if (this._justFalse && value_) {
      this.throwValidationError('value is true');
    }

    return value_;
  }
}
