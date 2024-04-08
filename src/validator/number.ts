import type { Validator } from '../types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for numeric values
 *
 * @export
 * @interface NumberValidator
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {Validator<number, ValidationParams>}
 * @since 1.0.0
 */
export interface NumberValidator<ValidationParams = unknown>
  extends Validator<number, ValidationParams> {
  /**
   * accept positive values only (zero is not positive)
   *
   * @readonly
   * @type {this}
   * @since 1.0.0
   */
  get positive(): this;
  /**
   * accept negative values only (zero is not negative)
   *
   * @readonly
   * @type {this}
   * @since 1.0.0
   */
  get negative(): this;
  /**
   * reject NaN and Infinity
   *
   * @readonly
   * @type {this}
   * @since 1.0.0
   */
  get finite(): this;
  /**
   * reject NaN
   *
   * @readonly
   * @type {this}
   * @since 1.0.0
   */
  get rejectNaN(): this;
  /**
   * reject Infinity
   *
   * @readonly
   * @type {this}
   * @since 1.0.0
   */
  get rejectInfinity(): this;
  /**
   * reject 0
   *
   * @readonly
   * @type {this}
   * @since 1.0.0
   */
  get rejectZero(): this;
  /**
   * validate minimum value
   *
   * @param {number} min_
   * @returns {this}
   * @since 1.0.0
   */
  min(min_: number): this;
  /**
   * validate maximum value
   *
   * @param {number} max_
   * @returns {this}
   * @since 1.0.0
   */
  max(max_: number): this;
  /**
   * define accepted numbers
   *
   * @param {...ReadonlyArray<number>} numbers_
   * @returns {this}
   * @since 1.0.0
   */
  accept(...numbers_: ReadonlyArray<number>): this;
  /**
   * define rejected numbers
   *
   * @param {...ReadonlyArray<number>} numbers_
   * @returns {this}
   * @since 1.0.0
   */
  reject(...numbers_: ReadonlyArray<number>): this;
}

/**
 * Validator for numeric values
 *
 * @export
 * @class DefaultNumberValidator
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {DefaultValidator<number, ValidationParams>}
 * @implements {NumberValidator<ValidationParams>}
 * @since 1.0.0
 */
export class DefaultNumberValidator<ValidationParams = unknown>
  extends DefaultValidator<number, ValidationParams>
  implements NumberValidator<ValidationParams>
{
  public get positive(): this {
    return this.setupCondition((value_) => this.checkPositive(value_));
  }

  public get negative(): this {
    return this.setupCondition((value_) => this.checkNegative(value_));
  }

  public get finite(): this {
    return this.setupCondition((value_) => this.checkFinite(value_));
  }

  public get rejectNaN(): this {
    return this.setupCondition((value_) => this.checkNaN(value_));
  }

  public get rejectInfinity(): this {
    return this.setupCondition((value_) => this.checkInfinity(value_));
  }

  public get rejectZero(): this {
    return this.setupCondition((value_) => this.checkZero(value_));
  }

  public min(min_: number): this {
    return this.setupCondition((value_) => this.checkMin(value_, min_));
  }

  public max(max_: number): this {
    return this.setupCondition((value_) => this.checkMax(value_, max_));
  }

  public accept(...numbers_: ReadonlyArray<number>): this {
    return this.setupCondition((value_) =>
      this.checkAccepted(value_, numbers_)
    );
  }

  public reject(...numbers_: ReadonlyArray<number>): this {
    return this.setupCondition((value_) =>
      this.checkRejected(value_, numbers_)
    );
  }

  protected validateBaseType(
    value_: unknown,
    _params_?: ValidationParams
  ): number {
    if (typeof value_ === 'number') {
      return value_;
    }

    this.throwValidationError('value is not a number');
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

  private checkAccepted(
    value_: number,
    accepted_: ReadonlyArray<number>
  ): void {
    if (!accepted_.includes(value_)) {
      this.throwValidationError('number is not accepted');
    }
  }

  private checkRejected(
    value_: number,
    rejected_: ReadonlyArray<number>
  ): void {
    if (rejected_.includes(value_)) {
      this.throwValidationError('number is rejected');
    }
  }
}
