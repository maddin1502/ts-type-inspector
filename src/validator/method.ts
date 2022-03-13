import { Validator } from '.';
import type { MethodLike } from '../types';

/**
 * Validator for method-like values.
 * Unfortunately (for technical reasons), this validator can only validate the number of parameters.
 *
 * @since 1.0.0
 * @export
 * @class MethodValidator
 * @extends {Validator<Out>}
 * @template Out
 */
export class MethodValidator<Out extends MethodLike> extends Validator<Out> {
  /**
   * validate exact params count
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
   * validate minimum params count
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
   * validate maximum params count
   *
   * @since 1.0.0
   * @param {number} max_
   * @return {*}  {this}
   * @memberof MethodValidator
   */
  public max(max_: number): this {
    return this.setupCondition(value_ => this.checkMax(value_, max_));
  }

  protected validateBaseType(value_: unknown): Out {
    if (typeof value_ !== 'function') {
      this.throwValidationError('value is not a method');
    }

    return value_ as Out;
  }

  private checkCount(value_: Out, count_: number): void {
    if (count_ !== value_.length) {
      this.throwValidationError('incorrect params count');
    }
  }

  private checkMin(value_: Out, min_: number): void {
    if (value_.length < min_) {
      this.throwValidationError('too few parameters');
    }
  }

  private checkMax(value_: Out, max_: number): void {
    if (value_.length > max_) {
      this.throwValidationError('too many parameters');
    }
  }
}
