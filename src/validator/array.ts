import { ArrayItem, MinArray } from 'ts-lib-extended';
import { Validator } from '.';

/**
 * Validator for array-like values
 *
 * @export
 * @class ArrayValidator
 * @extends {Validator<TValue>}
 * @template TValue
 */
export class ArrayValidator<TValue extends ArrayLike<any>>
  extends Validator<TValue>
{
  private _length: number | undefined;
  private _min: number | undefined;
  private _max: number | undefined;
  private _allowed: MinArray<ArrayItem<TValue>, 1> | undefined;
  private _forbidden: MinArray<ArrayItem<TValue>, 1> | undefined;

  constructor(
    private _itemValidator: Validator<TValue>
  ) {
    super();
  }

  /**
   * specific array length
   *
   * @param {number} value_
   * @return {*}  {this}
   * @memberof ArrayValidator
   */
  public length(value_: number): this {
    this._length = value_;
    return this;
  }

  /**
   * minimum array length
   *
   * @param {number} length_
   * @return {*}  {this}
   * @memberof ArrayValidator
   */
  public min(length_: number): this {
    this._min = length_;
    return this;
  }

  /**
   * maximum array length
   *
   * @param {number} length_
   * @return {*}  {this}
   * @memberof ArrayValidator
   */
  public max(length_: number): this {
    this._max = length_;
    return this;
  }

  /**
   * allowed items
   *
   * @param {...MinArray<ArrayItem<TValue>, 1>} items_
   * @return {*}  {this}
   * @memberof ArrayValidator
   */
  public allow(...items_: MinArray<ArrayItem<TValue>, 1>): this {
    this._allowed = items_;
    return this;
  }

  /**
   * forbidden items
   *
   * @param {...MinArray<ArrayItem<TValue>, 1>} items_
   * @return {*}  {this}
   * @memberof ArrayValidator
   */
  public forbid(...items_: MinArray<ArrayItem<TValue>, 1>): this {
    this._forbidden = items_;
    return this;
  }

  protected validateValue(value_: unknown): TValue {
    if (!this.hasNumericLength(value_)) {
      this.throwValidationError('value is not an array');
    }

    if (this._length !== undefined && value_.length !== this._length) {
      this.throwValidationError('invalid array length');
    }

    if (this._min !== undefined && value_.length < this._min) {
      this.throwValidationError('too few items');
    }

    if (this._max !== undefined && value_.length > this._max) {
      this.throwValidationError('too many items');
    }

    for (let i = 0; i < value_.length; i++) {
      if (!this.isIndexable(value_, i)) {
        this.throwValidationError('value is not indexable');
      }

      const item = value_[i];

      if (this._allowed && !this._allowed.includes(item)) {
        this.throwValidationError('item is not allowed');
      }

      if (this._forbidden && this._forbidden.includes(item)) {
        this.throwValidationError('item is forbidden');
      }

      try {
        this._itemValidator.validate(item);
      } catch (error_) {
        this.rethrowError(error_, i);
      }
    }

    return value_ as TValue;
  }

  private isIndexable(value_: { length: number }, index_: number): value_ is { length: number; [i: number]: any } {
    return index_ in value_;
  }

  private hasLengthProp(value_: unknown): value_ is { length: any } {
    return typeof value_ === 'object' && value_ !== null && 'length' in value_;
  }

  private hasNumericLength(value_: unknown): value_ is { length: number } {
    return this.hasLengthProp(value_) && typeof value_.length === 'number' && !isNaN(value_.length);
  }
}
