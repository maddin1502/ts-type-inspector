import type { Validatable } from '../types.js';
import { Validator } from './index.js';

/**
 * Validator for numeric values
 *
 * @since 1.0.0
 * @export
 */
export type NumberValidatable = Validatable<number> & {
  /**
   * accept positive values only (zero is not positive)
   *
   * @since 1.0.0
   */
  get positive(): NumberValidatable;
  /**
   * accept negative values only (zero is not negative)
   *
   * @since 1.0.0
   */
  get negative(): NumberValidatable;
  /**
   * reject NaN and Infinity
   *
   * @since 1.0.0
   */
  get finite(): NumberValidatable;
  /**
   * reject NaN
   *
   * @since 1.0.0
   */
  get rejectNaN(): NumberValidatable;
  /**
   * reject Infinity
   *
   * @since 1.0.0
   */
  get rejectInfinity(): NumberValidatable;
  /**
   * reject 0
   *
   * @since 1.0.0
   */
  get rejectZero(): NumberValidatable;
  /**
   * validate minimum value
   *
   * @since 1.0.0
   */
  min(min_: number): NumberValidatable;
  /**
   * validate maximum value
   *
   * @since 1.0.0
   */
  max(max_: number): NumberValidatable;
  /**
   * define accepted numbers
   *
   * @since 1.0.0
   */
  accept(...numbers_: ReadonlyArray<number>): NumberValidatable;
  /**
   * define rejected numbers
   *
   * @since 1.0.0
   */
  reject(...numbers_: ReadonlyArray<number>): NumberValidatable;
};

/**
 * Validator for numeric values
 *
 * @since 1.0.0
 * @export
 * @class NumberValidator
 * @extends {RangeValidator<number>}
 * @implements {NumberValidatorInterface}
 */
export class NumberValidator
  extends Validator<number>
  implements NumberValidatable
{
  public get positive(): NumberValidatable {
    return this.setupCondition((value_) => this.checkPositive(value_));
  }

  public get negative(): NumberValidatable {
    return this.setupCondition((value_) => this.checkNegative(value_));
  }

  public get finite(): NumberValidatable {
    return this.setupCondition((value_) => this.checkFinite(value_));
  }

  public get rejectNaN(): NumberValidatable {
    return this.setupCondition((value_) => this.checkNaN(value_));
  }

  public get rejectInfinity(): NumberValidatable {
    return this.setupCondition((value_) => this.checkInfinity(value_));
  }

  public get rejectZero(): NumberValidatable {
    return this.setupCondition((value_) => this.checkZero(value_));
  }

  public min(min_: number): NumberValidatable {
    return this.setupCondition((value_) => this.checkMin(value_, min_));
  }

  public max(max_: number): NumberValidatable {
    return this.setupCondition((value_) => this.checkMax(value_, max_));
  }

  public accept(...numbers_: ReadonlyArray<number>): NumberValidatable {
    return this.setupCondition((value_) =>
      this.checkAccepted(value_, numbers_)
    );
  }

  public reject(...numbers_: ReadonlyArray<number>): NumberValidatable {
    return this.setupCondition((value_) =>
      this.checkRejected(value_, numbers_)
    );
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
