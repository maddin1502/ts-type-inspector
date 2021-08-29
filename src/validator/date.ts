import type { MinArray } from 'ts-lib-extended';
import { Validator } from '.';

type DateLike = string | number | Date;

/**
 * Validator for date objects
 *
 * @export
 * @class DateValidator
 * @extends {Validator<Date>}
 */
export class DateValidator extends Validator<Date>
{
  private _min: string | number | Date | undefined;
  private _max: string | number | Date | undefined;
  private _allowed: MinArray<DateLike, 1> | undefined;
  private _denied: MinArray<DateLike, 1> | undefined;

  /**
   * earliest date
   *
   * @param {DateLike} date_
   * @return {*}  {this}
   * @memberof DateValidator
   */
  public min(date_: DateLike): this {
    this._min = date_;
    return this;
  }

  /**
   * latest date
   *
   * @param {DateLike} date_
   * @return {*}  {this}
   * @memberof DateValidator
   */
  public max(date_: DateLike): this {
    this._max = date_;
    return this;
  }

  /**
   * allowed dates
   *
   * @param {...MinArray<DateLike, 1>} items_
   * @return {*}  {this}
   * @memberof DateValidator
   */
  public allow(...items_: MinArray<DateLike, 1>): this {
    this._allowed = items_;
    return this;
  }

  /**
   * denied dates
   *
   * @param {...MinArray<DateLike, 1>} items_
   * @return {*}  {this}
   * @memberof DateValidator
   */
  public deny(...items_: MinArray<DateLike, 1>): this {
    this._denied = items_;
    return this;
  }

  protected validateValue(value_: unknown): Date {
    if (!this.isDate(value_)) {
      this.throwValidationError('value is not a date');
    }

    const valueTime = this.toTime(value_);

    if (isNaN(valueTime)) {
      this.throwValidationError('date is invalid');
    }

    if (this._min) {
      const minTime = this.toTime(this._min);

      if (!isNaN(minTime) && valueTime < minTime) {
        this.throwValidationError('date is earlier than the minimum');
      }
    }

    if (this._max) {
      const maxTime = this.toTime(this._max);

      if (!isNaN(maxTime) && valueTime > maxTime) {
        this.throwValidationError('date is later than the maximum');
      }
    }

    if (this._allowed) {
      let matched = false;

      for (let i = 0; i < this._allowed.length; i++) {
        if (valueTime === this.toTime(this._allowed[i])) {
          matched = true;
          break;
        }
      }

      if (!matched) {
        this.throwValidationError('date is not allowed');
      }
    }

    if (this._denied) {
      for (let i = 0; i < this._denied.length; i++) {
        if (valueTime === this.toTime(this._denied[i])) {
          this.throwValidationError('date is denied');
        }
      }
    }

    return value_;
  }

  private isDate(value_: unknown): value_ is Date {
    return !!value_ && Object.prototype.toString.call(value_) === '[object Date]';
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
}
