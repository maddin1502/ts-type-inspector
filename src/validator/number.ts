import { RangeValidator, RangeValidatorInterface } from './range';

export class NumberValidator
  extends RangeValidator<number>
  implements NumberValidatorInterface
{
  private _onlyPositiv: boolean;
  private _onlyNegative: boolean;
  private _allowNaN: boolean;
  private _allowInfinity: boolean;
  private _notZero: boolean;

  constructor() {
    super();
    this._onlyPositiv = false;
    this._onlyNegative = false;
    this._allowNaN = false;
    this._allowInfinity = false;
    this._notZero = false;
  }

  public positive(): this {
    this._onlyPositiv = true;
    return this;
  }

  public negative(): this {
    this._onlyNegative = true;
    return this;
  }

  public allowNaN(): this {
    this._allowNaN = true;
    return this;
  }

  public allowInfinity(): this {
    this._allowInfinity = true;
    return this;
  }

  public notZero(): this {
    this._notZero = true;
    return this;
  }

  protected validateValue(value_: unknown): number {
    if (typeof value_ !== 'number') {
      this.throwValidationError('value is not a number');
    }

    if (!this._allowNaN && isNaN(value_)) {
      this.throwValidationError('value is NaN');
    }

    if (!this._allowInfinity && value_ === Infinity) {
      this.throwValidationError('value is Infinite');
    }

    if (this._notZero && value_ === 0) {
      this.throwValidationError('value is 0');
    }

    if (this._onlyNegative && value_ >= 0) {
      this.throwValidationError('value is >= 0');
    }

    if (this._onlyPositiv && value_ <= 0) {
      this.throwValidationError('value is <= 0');
    }

    return super.validateValue(value_);
  }

  protected applyMin(min_: number, value_: number): boolean {
    return value_ >= min_;
  }

  protected applyMax(max_: number, value_: number): boolean {
    return value_ <= max_;
  }

  protected matches(item_: number, value_: number): boolean {
    return item_ === value_;
  }
}

/**
 * Validator for number values
 * NaN IS REJECTED BY DEFAULT! Use "allowNaN()" to allow NaN
 * INFINITY IS REJECTED BY DEFAULT! Use "allowInfinity()" to allow INFINITY
 *
 * @export
 * @interface NumberValidatorInterface
 * @extends {RangeValidatorInterface<number>}
 */
export interface NumberValidatorInterface extends RangeValidatorInterface<number> {
  /**
   * allow positive values only (zero is not positive)
   *
   * @return {*}  {this}
   * @memberof NumberValidatorInterface
   */
  positive(): this;
  /**
   * allow negative values only (zero is not negative)
   *
   * @return {*}  {this}
   * @memberof NumberValidatorInterface
   */
  negative(): this;
  /**
   * allow NaN
   *
   * @return {*}  {this}
   * @memberof NumberValidatorInterface
   */
  allowNaN(): this;
  /**
   * allow INFINITY
   *
   * @return {*}  {this}
   * @memberof NumberValidatorInterface
   */
  allowInfinity(): this;
  /**
   * forbid 0
   *
   * @return {*}  {this}
   * @memberof NumberValidatorInterface
   */
  notZero(): this;
}
