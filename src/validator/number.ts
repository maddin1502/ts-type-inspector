import { Validator } from '.';

/**
 * Validator for number values
 * NaN IS REJECTED BY DEFAULT! Use "allowNaN()" to allow NaN
 * INFINITY IS REJECTED BY DEFAULT! Use "allowInfinity()" to allow INFINITY
 *
 * @export
 * @class NumberValidator
 * @extends {RangeValidator<number>}
 * @implements {NumberValidatorInterface}
 */
export class NumberValidator extends Validator<number>
{
  private _min: number | undefined;
  private _max: number | undefined;
  private _allowed: number[] | undefined;
  private _forbidden: number[] | undefined;
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

  /**
   * allow positive values only (zero is not positive)
   *
   * @readonly
   * @type {this}
   * @memberof NumberValidator
   */
  public get positive(): this {
    this._onlyPositiv = true;
    return this;
  }

  /**
   * allow negative values only (zero is not negative)
   *
   * @readonly
   * @type {this}
   * @memberof NumberValidator
   */
  public get negative(): this {
    this._onlyNegative = true;
    return this;
  }

  /**
   * allow NaN
   *
   * @readonly
   * @type {this}
   * @memberof NumberValidator
   */
  public get allowNaN(): this {
    this._allowNaN = true;
    return this;
  }

  /**
   * allow INFINITY
   *
   * @readonly
   * @type {this}
   * @memberof NumberValidator
   */
  public get allowInfinity(): this {
    this._allowInfinity = true;
    return this;
  }

  /**
   * forbid 0
   *
   * @readonly
   * @type {this}
   * @memberof NumberValidator
   */
  public get notZero(): this {
    this._notZero = true;
    return this;
  }

  /**
   * minimum value
   *
   * @param {number} number_
   * @return {*}  {this}
   * @memberof NumberValidator
   */
  public min(number_: number): this {
    this._min = number_;
    return this;
  }

  /**
   * maximum value
   *
   * @param {number} number_
   * @return {*}  {this}
   * @memberof NumberValidator
   */
  public max(number_: number): this {
    this._max = number_;
    return this;
  }

  /**
   * allowed numbers
   *
   * @param {...number[]} numbers_
   * @return {*}  {this}
   * @memberof NumberValidator
   */
  public allow(...numbers_: number[]): this {
    this._allowed = numbers_;
    return this;
  }

  /**
   * forbidden numbers
   *
   * @param {...number[]} numbers_
   * @return {*}  {this}
   * @memberof NumberValidator
   */
  public forbid(...numbers_: number[]): this {
    this._forbidden = numbers_;
    return this;
  }

  protected validateValue(value_: unknown): number {
    if (typeof value_ !== 'number') {
      this.throwValidationError('value is not a number');
    }

    if (!this._allowNaN && isNaN(value_)) {
      this.throwValidationError('number is NaN'); //TODO: better message?
    }

    if (!this._allowInfinity && value_ === Infinity) {
      this.throwValidationError('number is infinite');
    }

    if (this._notZero && value_ === 0) {
      this.throwValidationError('number is 0');
    }

    if (this._min && value_ < this._min) {
      this.throwValidationError('number is less than minimum');
    }

    if (this._max && value_ > this._max) {
      this.throwValidationError('number is greater than maximum');
    }

    if (this._onlyNegative && value_ >= 0) {
      this.throwValidationError('number is >= 0');
    }

    if (this._onlyPositiv && value_ <= 0) {
      this.throwValidationError('number is <= 0');
    }

    if (this._allowed && !this._allowed.includes(value_)) {
      this.throwValidationError('number is not allowed');
    }

    if (this._forbidden && this._forbidden.includes(value_)) {
      this.throwValidationError('number is forbidden');
    }

    return value_;
  }
}
