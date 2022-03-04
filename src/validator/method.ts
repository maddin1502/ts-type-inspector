import { Validator } from '.';
import type { MethodLike } from '../types';

/**
 * Validator for method-like values.
 * Unfortunately (for technical reasons), this validator can only validate the number of parameters.
 *
 * @export
 * @class MethodValidator
 * @extends {Validator<V>}
 * @template V
 */
export class MethodValidator<V extends MethodLike> extends Validator<V> {
  /**
   * specify exact params count
   *
   * @since 1.0.0
   * @param {number} count_
   * @return {*}  {this}
   * @memberof MethodValidator
   */
  public count(count_: number): this {
    return this.setupCondition(value_ => this.checkCount(value_, count_));
  }

  /**
   * specify minimum params count
   *
   * @since 1.0.0
   * @param {number} min_
   * @return {*}  {this}
   * @memberof MethodValidator
   */
  public min(min_: number): this {
    return this.setupCondition(value_ => this.checkMin(value_, min_));
  }

  /**
   * specify maximum params count
   *
   * @since 1.0.0
   * @param {number} max_
   * @return {*}  {this}
   * @memberof MethodValidator
   */
  public max(max_: number): this {
    return this.setupCondition(value_ => this.checkMax(value_, max_));
  }

  protected validateBaseType(value_: unknown): V {
    if (typeof value_ !== 'function') {
      this.throwValidationError('value is not a method');
    }

    return value_ as V;
  }

  private checkCount(value_: V, count_: number): void {
    if (count_ !== value_.length) {
      this.throwValidationError('incorrect params count');
    }
  }

  private checkMin(value_: V, min_: number): void {
    if (value_.length < min_) {
      this.throwValidationError('too few parameters');
    }
  }

  private checkMax(value_: V, max_: number): void {
    if (value_.length > max_) {
      this.throwValidationError('too many parameters');
    }
  }
}
