import { Validator } from '.';

/**
 * Validator for numeric values
 *
 * @export
 * @class NumberValidator
 * @extends {RangeValidator<number>}
 * @implements {NumberValidatorInterface}
 */
export class NumberValidator extends Validator<number> {
  /**
   * accept positive values only (zero is not positive)
   *
   * @since 1.0.0
   * @readonly
   * @type {this}
   * @memberof NumberValidator
   */
  public get positive(): this {
    return this.setupCondition(value_ => this.checkPositive(value_));
  }

  /**
   * accept negative values only (zero is not negative)
   *
   * @since 1.0.0
   * @readonly
   * @type {this}
   * @memberof NumberValidator
   */
  public get negative(): this {
    return this.setupCondition(value_ => this.checkNegative(value_));
  }

  /**
   * reject NaN and Infinity
   *
   * @readonly
   * @type {this}
   * @memberof NumberValidator
   */
  public get finite(): this {
    return this.setupCondition(value_ => this.checkFinite(value_));
  }

  /**
   * reject NaN
   *
   * @since 1.0.0
   * @readonly
   * @type {this}
   * @memberof NumberValidator
   */
  public get rejectNaN(): this {
    return this.setupCondition(value_ => this.checkNaN(value_));
  }

  /**
   * reject INFINITY
   *
   * @since 1.0.0
   * @readonly
   * @type {this}
   * @memberof NumberValidator
   */
  public get rejectInfinity(): this {
    return this.setupCondition(value_ => this.checkInfinity(value_));
  }

  /**
   * reject 0
   *
   * @since 1.0.0
   * @readonly
   * @type {this}
   * @memberof NumberValidator
   */
  public get rejectZero(): this {
    return this.setupCondition(value_ => this.checkZero(value_));
  }

  /**
   * validate minimum value
   *
   * @since 1.0.0
   * @param {number} min_
   * @return {*}  {this}
   * @memberof NumberValidator
   */
  public min(min_: number): this {
    return this.setupCondition(value_ => this.checkMin(value_, min_));
  }

  /**
   * validate maximum value
   *
   * @since 1.0.0
   * @param {number} max_
   * @return {*}  {this}
   * @memberof NumberValidator
   */
  public max(max_: number): this {
    return this.setupCondition(value_ => this.checkMax(value_, max_));
  }

  /**
   * define accepted numbers
   *
   * @since 1.0.0
   * @param {...ReadonlyArray<number>} numbers_
   * @return {*}  {this}
   * @memberof NumberValidator
   */
  public accept(...numbers_: ReadonlyArray<number>): this {
    return this.setupCondition(value_ => this.checkAccepted(value_, numbers_));
  }

  /**
   * define rejected numbers
   *
   * @since 1.0.0
   * @param {...ReadonlyArray<number>} numbers_
   * @return {*}  {this}
   * @memberof NumberValidator
   */
  public deny(...numbers_: ReadonlyArray<number>): this {
    return this.setupCondition(value_ => this.checkRejected(value_, numbers_));
  }

  protected validateBaseType(value_: unknown): number {
    if (typeof value_ !== 'number') {
      this.throwValidationError('value is not a number');
    }

    return value_;
  }

  private checkFinite(value_: number): void {
    if (!isFinite(value_)) {
      this.throwValidationError('number is not finite');
    }
  }

  private checkNaN(value_: number): void {
    if (isNaN(value_)) {
      this.throwValidationError('number is NaN');
    }
  }

  private checkInfinity(value_: number): void {
    if (value_ === Infinity) {
      this.throwValidationError('number is infinite');
    }
  }

  private checkZero(value_: number): void {
    if (value_ === 0) {
      this.throwValidationError('number is 0');
    }
  }

  private checkMin(value_: number, min_: number): void {
    if (value_ < min_) {
      this.throwValidationError('number is less than minimum');
    }
  }

  private checkMax(value_: number, max_: number): void {
    if (value_ > max_) {
      this.throwValidationError('number is greater than maximum');
    }
  }

  private checkNegative(value_: number): void {
    if (value_ >= 0) {
      this.throwValidationError('number is not negative');
    }
  }

  private checkPositive(value_: number): void {
    if (value_ <= 0) {
      this.throwValidationError('number is not positive');
    }
  }

  private checkAccepted(value_: number, accepted_: ReadonlyArray<number>): void {
    if (!accepted_.includes(value_)) {
      this.throwValidationError('number is not accepted');
    }
  }

  private checkRejected(value_: number, rejected_: ReadonlyArray<number>): void {
    if (rejected_.includes(value_)) {
      this.throwValidationError('number is denied');
    }
  }
}
