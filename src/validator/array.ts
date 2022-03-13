import type { ArrayItem } from 'ts-lib-extended';
import { Validator } from '.';
import type { ArrayItemValidator, ArrayItemValidatorArray } from '../types';

/**
 * Validator for array values
 *
 * @since 1.0.0
 * @export
 * @class ArrayValidator
 * @extends {Validator<Out>}
 * @template Out
 * @template V
 */
export class ArrayValidator<Out extends ArrayItemValidatorArray<V>, V extends ArrayItemValidator = ArrayItemValidator<Out>> extends Validator<Out> {
  constructor(
    private readonly _itemValidator: V
  ) {
    super();
  }

  /**
   * validate exact array length
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
   * validate minimum array length
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
   * validate maximum array length
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
   * @param {...ReadonlyArray<ArrayItem<Out>>} items_
   * @return {*}  {this}
   * @memberof ArrayValidator
   */
  public accept(...items_: ReadonlyArray<ArrayItem<Out>>): this {
    return this.setupCondition(value_ => this.checkAccepted(value_, items_));
  }

  /**
   * define rejected values
   *
   * @since 1.0.0
   * @param {...ReadonlyArray<ArrayItem<Out>>} items_
   * @return {*}  {this}
   * @memberof ArrayValidator
   */
  public reject(...items_: ReadonlyArray<ArrayItem<Out>>): this {
    return this.setupCondition(value_ => this.checkRejected(value_, items_));
  }

  protected validateBaseType(value_: unknown): Out {
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

    return value_ as Out;
  }

  private checkLength(value_: Out, length_: number): void {
    if (value_.length !== length_) {
      this.throwValidationError('deviant length');
    }
  }

  private checkMin(value_: Out, min_: number): void {
    if (value_.length < min_) {
      this.throwValidationError('too few items');
    }
  }

  private checkMax(value_: Out, max_: number): void {
    if (value_.length > max_) {
      this.throwValidationError('too many items');
    }
  }

  private checkAccepted(value_: Out, acceptedItems_: ReadonlyArray<any>): void {
    for (let i = 0; i < value_.length; i++) {
      if (!acceptedItems_.includes(value_[i])) {
        this.throwValidationError('item is not accepted');
      }
    }
  }

  private checkRejected(value_: Out, rejectedItems_: ReadonlyArray<any>): void {
    for (let i = 0; i < value_.length; i++) {
      if (rejectedItems_.includes(value_[i])) {
        this.throwValidationError('item is rejected');
      }
    }
  }
}
