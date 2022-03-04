import type { ArrayItem } from 'ts-lib-extended';
import { Validator } from '.';
import type { ArrayItemValidator, ArrayItemValidatorArray } from '../types';

/**
 * Validator for array-like values
 *
 * @since 1.0.0
 * @export
 * @class ArrayValidator
 * @extends {Validator<A>}
 * @template A
 * @template V
 */
export class ArrayValidator<A extends ArrayItemValidatorArray<V>, V extends ArrayItemValidator = ArrayItemValidator<A>> extends Validator<A> {
  constructor(
    private readonly _itemValidator: V
  ) {
    super();
  }

  /**
   * specify array length
   *
   * @since 1.0.0
   * @param {number} length_
   * @return {*}  {this}
   * @memberof ArrayValidator
   */
  public length(length_: number): this {
    return this.setupCondition(value_ => this.checkLength(value_, length_));
  }

  /**
   * specify minimum array length
   *
   * @since 1.0.0
   * @param {number} min_
   * @return {*}  {this}
   * @memberof ArrayValidator
   */
  public min(min_: number): this {
    return this.setupCondition(value_ => this.checkMin(value_, min_));
  }

  /**
   * specify maximum array length
   *
   * @since 1.0.0
   * @param {number} max_
   * @return {*}  {this}
   * @memberof ArrayValidator
   */
  public max(max_: number): this {
    return this.setupCondition(value_ => this.checkMax(value_, max_));
  }

  /**
   * define accepted values
   *
   * @since 1.0.0
   * @param {...ReadonlyArray<ArrayItem<A>>} items_
   * @return {*}  {this}
   * @memberof ArrayValidator
   */
  public accept(...items_: ReadonlyArray<ArrayItem<A>>): this {
    return this.setupCondition(value_ => this.checkAccepted(value_, items_));
  }

  /**
   * define rejected values
   *
   * @since 1.0.0
   * @param {...ReadonlyArray<ArrayItem<A>>} items_
   * @return {*}  {this}
   * @memberof ArrayValidator
   */
  public reject(...items_: ReadonlyArray<ArrayItem<A>>): this {
    return this.setupCondition(value_ => this.checkRejected(value_, items_));
  }

  protected validateBaseType(value_: unknown): A {
    if (!Array.isArray(value_)) {
      this.throwValidationError('value is not an array');
    }

    for (let i = 0; i < value_.length; i++) {
      try {
        this._itemValidator.validate(value_[i]);
      } catch (reason_) {
        this.rethrowError(reason_, i);
      }
    }

    return value_ as A;
  }

  private checkLength(value_: A, length_: number): void {
    if (value_.length !== length_) {
      this.throwValidationError('deviant length');
    }
  }

  private checkMin(value_: A, min_: number): void {
    if (value_.length < min_) {
      this.throwValidationError('too few items');
    }
  }

  private checkMax(value_: A, max_: number): void {
    if (value_.length > max_) {
      this.throwValidationError('too many items');
    }
  }

  private checkAccepted(value_: A, acceptedItems_: ReadonlyArray<any>): void {
    for (let i = 0; i < value_.length; i++) {
      if (!acceptedItems_.includes(value_[i])) {
        this.throwValidationError('item is not accepted');
      }
    }
  }

  private checkRejected(value_: A, rejectedItems_: ReadonlyArray<any>): void {
    for (let i = 0; i < value_.length; i++) {
      if (rejectedItems_.includes(value_[i])) {
        this.throwValidationError('item is rejected');
      }
    }
  }
}
