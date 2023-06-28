import type { DateLike, Validatable } from '../types.js';
import { Validator } from './index.js';

/**
 * Validator for date objects
 *
 * @since 1.0.0
 * @export
 */
export type DateValidatable = Validatable<Date> & {
  /**
   * define earliest accepted date
   *
   * @since 1.0.0
   */
  earliest(earliest_: DateLike): DateValidatable;
  /**
   * define latest accepted date
   *
   * @since 1.0.0
   */
  latest(latest_: DateLike): DateValidatable;
  /**
   * define accepted dates
   *
   * @since 1.0.0
   */
  accept(...items_: ReadonlyArray<DateLike>): DateValidatable;
  /**
   * define rejected dates
   *
   * @since 1.0.0
   */
  reject(...items_: ReadonlyArray<DateLike>): DateValidatable;
};

/**
 * Validator for date objects
 *
 * @since 1.0.0
 * @export
 * @class DateValidator
 * @extends {Validator<Date>}
 * @implements {DateValidatable}
 */
export class DateValidator extends Validator<Date> implements DateValidatable {
  public earliest(earliest_: DateLike): DateValidatable {
    return this.setupCondition((value_) =>
      this.checkEarliest(value_, earliest_)
    );
  }

  public latest(latest_: DateLike): DateValidatable {
    return this.setupCondition((value_) => this.checkLatest(value_, latest_));
  }

  public accept(...items_: ReadonlyArray<DateLike>): DateValidatable {
    return this.setupCondition((value_) => this.checkAccepted(value_, items_));
  }

  public reject(...items_: ReadonlyArray<DateLike>): DateValidatable {
    return this.setupCondition((value_) => this.checkRejected(value_, items_));
  }

  protected validateBaseType(value_: unknown): Date {
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
    const valueTime = this.toTime(value_);
    const earliestTime = this.toTime(earliest_);

    if (!isNaN(earliestTime) && valueTime < earliestTime) {
      this.throwValidationError('date is too early');
    }
  }

  private checkLatest(value_: Date, latest_: DateLike): void {
    const valueTime = this.toTime(value_);
    const latestTime = this.toTime(latest_);

    if (!isNaN(latestTime) && valueTime > latestTime) {
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
