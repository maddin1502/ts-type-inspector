import type { ArrayItem, MinArray } from 'ts-lib-extended';
import { Validator } from '.';
import type { ArrayItemValidator, ArrayItemValidatorArray, IndexedObject, SizedObject } from '../types';

/**
 * Validator for array-like values
 *
 * @export
 * @class ArrayValidator
 * @extends {Validator<A>}
 * @template A
 */
export class ArrayValidator<A extends ArrayItemValidatorArray<V>, V extends ArrayItemValidator = ArrayItemValidator<A>> extends Validator<A> {
  private _length: number | undefined;
  private _min: number | undefined;
  private _max: number | undefined;
  private _allowed: MinArray<ArrayItem<A>, 1> | undefined;
  private _denied: MinArray<ArrayItem<A>, 1> | undefined;

  constructor(
    private _itemValidator: V
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
   * @param {...MinArray<ArrayItem<A>, 1>} items_
   * @return {*}  {this}
   * @memberof ArrayValidator
   */
  public allow(...items_: MinArray<ArrayItem<A>, 1>): this {
    this._allowed = items_;
    return this;
  }

  /**
   * denied items
   *
   * @param {...MinArray<ArrayItem<A>, 1>} items_
   * @return {*}  {this}
   * @memberof ArrayValidator
   */
  public deny(...items_: MinArray<ArrayItem<A>, 1>): this {
    this._denied = items_;
    return this;
  }

  protected validateValue(value_: unknown): A {
    if (!this.withNumericLength(value_)) {
      this.throwValidationError('value is not an array');
    }

    if (this._length !== undefined && value_.length !== this._length) {
      this.throwValidationError('deviant length');
    }

    if (this._min !== undefined && value_.length < this._min) {
      this.throwValidationError('too few items');
    }

    if (this._max !== undefined && value_.length > this._max) {
      this.throwValidationError('too many items');
    }

    for (let i = 0; i < value_.length; i++) {
      if (!this.isIndexed(value_, i)) {
        this.throwValidationError('array could not be indexed');
      }

      const item = value_[i];

      if (this._allowed && !this._allowed.includes(item)) {
        this.throwValidationError('item is not allowed');
      }

      if (this._denied && this._denied.includes(item)) {
        this.throwValidationError('item is denied');
      }

      try {
        this._itemValidator.validate(item);
      } catch (reason_) {
        this.rethrowError(reason_, i);
      }
    }

    return value_ as A;
  }

  private isIndexed<T extends number>(value_: SizedObject<number>, index_: T): value_ is IndexedObject<T> {
    return index_ in value_;
  }

  private withLength(value_: unknown): value_ is SizedObject {
    return typeof value_ === 'object' && value_ !== null && 'length' in value_;
  }

  private withNumericLength(value_: unknown): value_ is SizedObject<number> {
    return this.withLength(value_) && typeof value_.length === 'number' && !isNaN(value_.length);
  }
}
