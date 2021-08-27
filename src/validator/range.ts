import { MatchValidator, MatchValidatorInterface } from './match';

export abstract class RangeValidator<TValue, TRange = number, TMatch = TValue>
  extends MatchValidator<TValue, TMatch>
  implements RangeValidatorInterface<TValue, TRange, TMatch>
{
  private _minValue: TRange | undefined;
  private _maxValue: TRange | undefined;
  protected readonly minErrorMessage: string = 'value < min';
  protected readonly maxErrorMessage: string = 'value > max';

  public min(value_: TRange): this {
    this._minValue = value_;
    return this;
  }

  public max(value_: TRange): this {
    this._maxValue = value_;
    return this;
  }

  protected validateValue(value_: TValue): TValue {
    if (this._minValue !== undefined && !this.applyMin(this._minValue, value_)) {
      this.throwValidationError(this.minErrorMessage);
    }

    if (this._maxValue !== undefined && !this.applyMax(this._maxValue, value_)) {
      this.throwValidationError(this.maxErrorMessage);
    }

    return super.validateValue(value_);
  }

  protected abstract applyMin(min_: TRange, value_: TValue): boolean;
  protected abstract applyMax(max_: TRange, value_: TValue): boolean;
}

/**
 * Validator base for range filtering
 *
 * @export
 * @interface RangeValidatorInterface
 * @extends {MatchValidatorInterface<TValue, TMatch>}
 * @template TValue
 * @template TRange
 * @template TMatch
 */
export interface RangeValidatorInterface<TValue, TRange = number, TMatch = TValue>
  extends MatchValidatorInterface<TValue, TMatch>
{
  /**
   * minimal allowed value
   *
   * @param {TRange} value_
   * @return {*}  {this}
   * @memberof RangeValidatorInterface
   */
  min(value_: TRange): this;
  /**
   * maximal allowed value
   *
   * @param {TRange} value_
   * @return {*}  {this}
   * @memberof RangeValidatorInterface
   */
  max(value_: TRange): this;
}
