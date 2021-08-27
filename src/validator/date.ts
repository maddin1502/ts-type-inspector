import { MinArray } from 'ts-lib-extended';
import { RangeValidator, RangeValidatorInterface } from './range';

export class DateValidator
  extends RangeValidator<Date, number | Date | string, Date | number | string>
  implements DateValidatorInterface
{
  private _min: string | number | Date | undefined;
  private _max: string | number | Date | undefined;
  private _allowed: MinArray<string | number | Date, 1> | undefined;
  private _forbidden: MinArray<string | number | Date, 1> | undefined;

  public get min(date_: string | number | Date): this {
    this._min = date_;
    return this;
  }

  public get max(date_: string | number | Date): this {
    this._max = date_;
    return this;
  }

  public get allow(...items_: MinArray<string | number | Date, 1>): this {
    this._allowed = items_;
    return this;
  }

  public get forbid(...items_: MinArray<string | number | Date, 1>): this {
    this._forbidden = items_;
    return this;
  }

  protected matches(item_: string | number | Date, value_: Date): boolean {
    const itemNumber = this.toNumber(item_);
    return !isNaN(itemNumber) && this.toNumber(value_) === itemNumber;
  }

  protected validateValue(value_: unknown): Date {
    if (!this.isDate(value_)) {
      this.throwValidationError('value is not a date');
    }

    if (isNaN(value_.getTime())) {
      this.throwValidationError('invalid date');
    }

    if (this._min !== undefined || this._max !== undefined || this._allowed !== undefined || this._forbidden !== undefined) {
      const valueNumber = this.toNumber(value_);

      if (this._min) {
        const minValue = this.toNumber(this._min);

        if (!isNaN(minValue) && valueNumber < minValue) {
          this.throwValidationError('date is earlier than the minimum');
        }
      }

      if (this._max) {
        const maxValue = this.toNumber(this._max);

        if (!isNaN(maxValue) && valueNumber > maxValue) {
          this.throwValidationError('date is later than the minimum');
        }
      }

      if (this._allowed) {
        let notMatched = 0;

        for (let i = 0; i < this._allowed.length; i++) {
          const itemNumber = this.toNumber(this._allowed[i]);

          if (!isNaN(itemNumber) && valueNumber !== itemNumber) {
            notMatched++;
          }
        }
      }
    }

    return super.validateValue(value_);
  }

  private isDate(value_: unknown): value_ is Date {
    return !!value_ && Object.prototype.toString.call(value_) === '[object Date]';
  }

  private toNumber(value_: number | Date | string ): number {
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

/**
 * Validator for date objects
 *
 * @export
 * @interface DateValidatorInterface
 * @extends {(RangeValidatorInterface<Date, number | Date | string, Date | number | string>)}
 */
export interface DateValidatorInterface extends RangeValidatorInterface<Date, number | Date | string, Date | number | string> {}
