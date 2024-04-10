import type { NestedValidator, Validator } from '@/types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for array values
 *
 * @export
 * @interface ArrayValidator
 * @template Out
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {Validator<Out[], ValidationParams>}
 * @since 1.0.0
 */
export interface ArrayValidator<Out, ValidationParams = unknown>
  extends Validator<Out[], ValidationParams> {
  /**
   * validate exact array length
   *
   * @param {number} length_
   * @returns {this}
   * @since 1.0.0
   */
  length(length_: number): this;
  /**
   * validate minimum array length
   *
   * @param {number} min_
   * @returns {this}
   * @since 1.0.0
   */
  min(min_: number): this;
  /**
   * validate maximum array length
   *
   * @param {number} max_
   * @returns {this}
   * @since 1.0.0
   */
  max(max_: number): this;
  /**
   * define accepted values
   *
   * @param {...ReadonlyArray<Out>} items_
   * @returns {this}
   * @since 1.0.0
   */
  accept(...items_: ReadonlyArray<Out>): this;
  /**
   * define rejected values
   *
   * @param {...ReadonlyArray<Out>} items_
   * @returns {this}
   * @since 1.0.0
   */
  reject(...items_: ReadonlyArray<Out>): this;
}

/**
 * Validator for array values
 *
 * @export
 * @class DefaultArrayValidator
 * @template Out
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {DefaultValidator<Out[], ValidationParams>}
 * @implements {ArrayValidator<Out, ItemValidationParams, ValidationParams>}
 * @since 1.0.0
 */
export class DefaultArrayValidator<const Out, ValidationParams = unknown>
  extends DefaultValidator<Out[], ValidationParams>
  implements ArrayValidator<Out, ValidationParams>
{
  constructor(
    private readonly _itemValidator: NestedValidator<Out, ValidationParams>
  ) {
    super();
  }

  public length(length_: number): this {
    return this.setupCondition((value_) => this.checkLength(value_, length_));
  }

  public min(min_: number): this {
    return this.setupCondition((value_) => this.checkMin(value_, min_));
  }

  public max(max_: number): this {
    return this.setupCondition((value_) => this.checkMax(value_, max_));
  }

  public accept(...items_: ReadonlyArray<Out>): this {
    return this.setupCondition((value_) => this.checkAccepted(value_, items_));
  }

  public reject(...items_: ReadonlyArray<Out>): this {
    return this.setupCondition((value_) => this.checkRejected(value_, items_));
  }

  protected validateBaseType(
    value_: unknown,
    params_?: ValidationParams
  ): Out[] {
    if (!Array.isArray(value_)) {
      this.throwValidationError('value is not an array');
    }

    for (let i = 0; i < value_.length; i++) {
      try {
        this.validateNested(value_[i], this._itemValidator, params_);
      } catch (reason_) {
        this.rethrowError(reason_, i);
      }
    }

    return value_ as Out[];
  }

  private checkLength(value_: Out[], length_: number): void {
    if (value_.length !== length_) {
      this.throwValidationError('deviant length');
    }
  }

  private checkMin(value_: Out[], min_: number): void {
    if (value_.length < min_) {
      this.throwValidationError('too few items');
    }
  }

  private checkMax(value_: Out[], max_: number): void {
    if (value_.length > max_) {
      this.throwValidationError('too many items');
    }
  }

  private checkAccepted(
    value_: Out[],
    acceptedItems_: ReadonlyArray<any>
  ): void {
    for (let i = 0; i < value_.length; i++) {
      if (!acceptedItems_.includes(value_[i])) {
        this.throwValidationError('item is not accepted');
      }
    }
  }

  private checkRejected(
    value_: Out[],
    rejectedItems_: ReadonlyArray<any>
  ): void {
    for (let i = 0; i < value_.length; i++) {
      if (rejectedItems_.includes(value_[i])) {
        this.throwValidationError('item is rejected');
      }
    }
  }
}
