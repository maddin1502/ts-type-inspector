import type { EmptyObject } from 'ts-lib-extended';
import type { ExtendedValidationParameters, Validatable } from '../types.js';
import { Validator } from './index.js';

/**
 * Validator for numeric values
 *
 * @export
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @since 1.0.0
 */
export type NumberValidatable<
  EVP extends ExtendedValidationParameters = EmptyObject
> = Validatable<number, EVP> & {
  /**
   * accept positive values only (zero is not positive)
   *
   * @readonly
   * @type {NumberValidatable<EVP>}
   * @since 1.0.0
   */
  get positive(): NumberValidatable<EVP>;
  /**
   * accept negative values only (zero is not negative)
   *
   * @readonly
   * @type {NumberValidatable<EVP>}
   * @since 1.0.0
   */
  get negative(): NumberValidatable<EVP>;
  /**
   * reject NaN and Infinity
   *
   * @readonly
   * @type {NumberValidatable<EVP>}
   * @since 1.0.0
   */
  get finite(): NumberValidatable<EVP>;
  /**
   * reject NaN
   *
   * @readonly
   * @type {NumberValidatable<EVP>}
   * @since 1.0.0
   */
  get rejectNaN(): NumberValidatable<EVP>;
  /**
   * reject Infinity
   *
   * @readonly
   * @type {NumberValidatable<EVP>}
   * @since 1.0.0
   */
  get rejectInfinity(): NumberValidatable<EVP>;
  /**
   * reject 0
   *
   * @readonly
   * @type {NumberValidatable<EVP>}
   * @since 1.0.0
   */
  get rejectZero(): NumberValidatable<EVP>;
  /**
   * validate minimum value
   *
   * @param {number} min_
   * @returns {NumberValidatable<EVP>}
   * @since 1.0.0
   */
  min(min_: number): NumberValidatable<EVP>;
  /**
   * validate maximum value
   *
   * @param {number} max_
   * @returns {NumberValidatable<EVP>}
   * @since 1.0.0
   */
  max(max_: number): NumberValidatable<EVP>;
  /**
   * define accepted numbers
   *
   * @param {...ReadonlyArray<number>} numbers_
   * @returns {NumberValidatable<EVP>}
   * @since 1.0.0
   */
  accept(...numbers_: ReadonlyArray<number>): NumberValidatable<EVP>;
  /**
   * define rejected numbers
   *
   * @param {...ReadonlyArray<number>} numbers_
   * @returns {NumberValidatable<EVP>}
   * @since 1.0.0
   */
  reject(...numbers_: ReadonlyArray<number>): NumberValidatable<EVP>;
};

/**
 * Validator for numeric values
 *
 * @export
 * @class NumberValidator
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @extends {Validator<number, EVP>}
 * @implements {NumberValidatable<EVP>}
 * @since 1.0.0
 */
export class NumberValidator<
    EVP extends ExtendedValidationParameters = EmptyObject
  >
  extends Validator<number, EVP>
  implements NumberValidatable<EVP>
{
  public get positive(): NumberValidatable<EVP> {
    return this.setupCondition((value_) => this.checkPositive(value_));
  }

  public get negative(): NumberValidatable<EVP> {
    return this.setupCondition((value_) => this.checkNegative(value_));
  }

  public get finite(): NumberValidatable<EVP> {
    return this.setupCondition((value_) => this.checkFinite(value_));
  }

  public get rejectNaN(): NumberValidatable<EVP> {
    return this.setupCondition((value_) => this.checkNaN(value_));
  }

  public get rejectInfinity(): NumberValidatable<EVP> {
    return this.setupCondition((value_) => this.checkInfinity(value_));
  }

  public get rejectZero(): NumberValidatable<EVP> {
    return this.setupCondition((value_) => this.checkZero(value_));
  }

  public min(min_: number): NumberValidatable<EVP> {
    return this.setupCondition((value_) => this.checkMin(value_, min_));
  }

  public max(max_: number): NumberValidatable<EVP> {
    return this.setupCondition((value_) => this.checkMax(value_, max_));
  }

  public accept(...numbers_: ReadonlyArray<number>): NumberValidatable<EVP> {
    return this.setupCondition((value_) =>
      this.checkAccepted(value_, numbers_)
    );
  }

  public reject(...numbers_: ReadonlyArray<number>): NumberValidatable<EVP> {
    return this.setupCondition((value_) =>
      this.checkRejected(value_, numbers_)
    );
  }

  protected validateBaseType(value_: unknown): number {
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
