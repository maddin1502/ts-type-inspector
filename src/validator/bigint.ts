import type { Validator } from '@/types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for bigint values
 *
 * @export
 * @interface BigIntValidator
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {Validator<bigint, ValidationParams>}
 * @since 4.0.0
 */
export interface BigIntValidator<ValidationParams = unknown> extends Validator<
  bigint,
  ValidationParams
> {
  /**
   * accept positive values only (zero is not positive)
   *
   * @readonly
   * @type {this}
   * @since 4.0.0
   */
  get positive(): this;
  /**
   * accept negative values only (zero is not negative)
   *
   * @readonly
   * @type {this}
   * @since 4.0.0
   */
  get negative(): this;
  /**
   * reject 0n
   *
   * @readonly
   * @type {this}
   * @since 4.0.0
   */
  get rejectZero(): this;
  /**
   * validate minimum value
   *
   * @param {bigint} min_
   * @returns {this}
   * @since 4.0.0
   */
  min(min_: bigint): this;
  /**
   * validate maximum value
   *
   * @param {bigint} max_
   * @returns {this}
   * @since 4.0.0
   */
  max(max_: bigint): this;
  /**
   * define accepted values
   *
   * @param {...ReadonlyArray<bigint>} values_
   * @returns {this}
   * @since 4.0.0
   */
  accept(...values_: ReadonlyArray<bigint>): this;
  /**
   * define rejected values
   *
   * @param {...ReadonlyArray<bigint>} values_
   * @returns {this}
   * @since 4.0.0
   */
  reject(...values_: ReadonlyArray<bigint>): this;
}

/**
 * Validator for bigint values
 *
 * @export
 * @class DefaultBigIntValidator
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {DefaultValidator<bigint, ValidationParams>}
 * @implements {BigIntValidator<ValidationParams>}
 * @since 4.0.0
 */
export class DefaultBigIntValidator<ValidationParams = unknown>
  extends DefaultValidator<bigint, ValidationParams>
  implements BigIntValidator<ValidationParams>
{
  public get positive(): this {
    return this.setupCondition((value_) => this.checkPositive(value_));
  }

  public get negative(): this {
    return this.setupCondition((value_) => this.checkNegative(value_));
  }

  public get rejectZero(): this {
    return this.setupCondition((value_) => this.checkZero(value_));
  }

  public min(min_: bigint): this {
    return this.setupCondition((value_) => this.checkMin(value_, min_));
  }

  public max(max_: bigint): this {
    return this.setupCondition((value_) => this.checkMax(value_, max_));
  }

  public accept(...values_: ReadonlyArray<bigint>): this {
    return this.setupCondition((value_) => this.checkAccepted(value_, values_));
  }

  public reject(...values_: ReadonlyArray<bigint>): this {
    return this.setupCondition((value_) => this.checkRejected(value_, values_));
  }

  protected validateBaseType(
    value_: unknown,
    _params_?: ValidationParams
  ): bigint {
    if (typeof value_ === 'bigint') {
      return value_;
    }

    this.throwValidationError('value is not a bigint');
  }

  private checkPositive(value_: bigint): void {
    if (value_ <= 0n) {
      this.throwValidationError('bigint is not positive');
    }
  }

  private checkNegative(value_: bigint): void {
    if (value_ >= 0n) {
      this.throwValidationError('bigint is not negative');
    }
  }

  private checkZero(value_: bigint): void {
    if (value_ === 0n) {
      this.throwValidationError('bigint is 0');
    }
  }

  private checkMin(value_: bigint, min_: bigint): void {
    if (value_ < min_) {
      this.throwValidationError('bigint is less than minimum');
    }
  }

  private checkMax(value_: bigint, max_: bigint): void {
    if (value_ > max_) {
      this.throwValidationError('bigint is greater than maximum');
    }
  }

  private checkAccepted(
    value_: bigint,
    accepted_: ReadonlyArray<bigint>
  ): void {
    if (!accepted_.includes(value_)) {
      this.throwValidationError('bigint is not accepted');
    }
  }

  private checkRejected(
    value_: bigint,
    rejected_: ReadonlyArray<bigint>
  ): void {
    if (rejected_.includes(value_)) {
      this.throwValidationError('bigint is rejected');
    }
  }
}
