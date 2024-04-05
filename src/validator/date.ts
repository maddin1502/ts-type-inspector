import type { DateLike, ObjectLike, Validator } from '../types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for date objects
 *
 * @export
 * @interface DateValidator
 * @template {ObjectLike} [ValidationParams=any] extended validation parameters
 * @extends {Validator<Date, ValidationParams>}
 * @since 1.0.0
 */
export interface DateValidator<ValidationParams extends ObjectLike = any>
  extends Validator<Date, ValidationParams> {
  /**
   * define earliest accepted date
   *
   * @param {DateLike} earliest_
   * @returns {this}
   * @since 1.0.0
   */
  earliest(earliest_: DateLike): this;
  /**
   * define latest accepted date
   *
   * @param {DateLike} latest_
   * @returns {this}
   * @since 1.0.0
   */
  latest(latest_: DateLike): this;
  /**
   * define accepted dates
   *
   * @param {...ReadonlyArray<DateLike>} items_
   * @returns {this}
   * @since 1.0.0
   */
  accept(...items_: ReadonlyArray<DateLike>): this;
  /**
   * define rejected dates
   *
   * @param {...ReadonlyArray<DateLike>} items_
   * @returns {this}
   * @since 1.0.0
   */
  reject(...items_: ReadonlyArray<DateLike>): this;
}

/**
 * Validator for date objects
 *
 * @export
 * @class DefaultDateValidator
 * @template {ObjectLike} [ValidationParams=any] extended validation parameters
 * @extends {DefaultValidator<Date, ValidationParams>}
 * @implements {DateValidator<ValidationParams>}
 * @since 1.0.0
 */
export class DefaultDateValidator<ValidationParams extends ObjectLike = any>
  extends DefaultValidator<Date, ValidationParams>
  implements DateValidator<ValidationParams>
{
  public earliest(earliest_: DateLike): this {
    return this.setupCondition((value_) =>
      this.checkEarliest(value_, earliest_)
    );
  }

  public latest(latest_: DateLike): this {
    return this.setupCondition((value_) => this.checkLatest(value_, latest_));
  }

  public accept(...items_: ReadonlyArray<DateLike>): this {
    return this.setupCondition((value_) => this.checkAccepted(value_, items_));
  }

  public reject(...items_: ReadonlyArray<DateLike>): this {
    return this.setupCondition((value_) => this.checkRejected(value_, items_));
  }

  protected validateBaseType(
    value_: unknown,
    _params_?: ValidationParams
  ): Date {
    if (!this.isDate(value_)) {
      this.throwValidationError('value is not a date');
    }

    if (isNaN(this.toTime(value_))) {
      this.throwValidationError('date is invalid');
    }

    return value_;
  }

  private isDate(value_: unknown): value_ is Date {
    return (
      !!value_ && Object.prototype.toString.call(value_) === '[object Date]'
    );
  }

  private toTime(value_: DateLike): number {
    switch (typeof value_) {
      case 'number':
        return value_;
      case 'string':
        return new Date(value_).getTime();
      default:
        return value_.getTime();
    }
  }

  private checkEarliest(value_: Date, earliest_: DateLike): void {
    const earliestTime = this.toTime(earliest_);

    if (!isNaN(earliestTime) && this.toTime(value_) < earliestTime) {
      this.throwValidationError('date is too early');
    }
  }

  private checkLatest(value_: Date, latest_: DateLike): void {
    const latestTime = this.toTime(latest_);

    if (!isNaN(latestTime) && this.toTime(value_) > latestTime) {
      this.throwValidationError('date is too late');
    }
  }

  private checkAccepted(
    value_: Date,
    acceptedItems_: ReadonlyArray<DateLike>
  ): void {
    const valueTime = this.toTime(value_);

    for (let i = 0; i < acceptedItems_.length; i++) {
      if (valueTime === this.toTime(acceptedItems_[i])) {
        return;
      }
    }

    this.throwValidationError('date is not accepted');
  }

  private checkRejected(
    value_: Date,
    rejectedItems_: ReadonlyArray<DateLike>
  ): void {
    const valueTime = this.toTime(value_);

    for (let i = 0; i < rejectedItems_.length; i++) {
      if (valueTime === this.toTime(rejectedItems_[i])) {
        this.throwValidationError('date is rejected');
      }
    }
  }
}
