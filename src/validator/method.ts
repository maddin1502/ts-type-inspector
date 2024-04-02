import type {
  ExtendedValidationParameters,
  MethodLike,
  NoParameters,
  Validator
} from '../types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for method-like values.
 * Unfortunately (for technical reasons), this validator can only validate the number of parameters.
 *
 * @export
 * @interface MethodValidator
 * @template {MethodLike} Out
 * @template {ExtendedValidationParameters} [EVP=NoParameters]
 * @extends {Validator<Out, EVP>}
 * @since 1.0.0
 */
export interface MethodValidator<
  Out extends MethodLike,
  EVP extends ExtendedValidationParameters = NoParameters
> extends Validator<Out, EVP> {
  /**
   * validate exact params count
   *
   * @param {number} count_
   * @returns {this}
   * @since 1.0.0
   */
  count(count_: number): this;
  /**
   * validate minimum params count
   *
   * @param {number} min_
   * @returns {this}
   * @since 1.0.0
   */
  min(min_: number): this;
  /**
   * validate maximum params count
   *
   * @param {number} max_
   * @returns {this}
   * @since 1.0.0
   */
  max(max_: number): this;
}

/**
 * Validator for method-like values.
 * Unfortunately (for technical reasons), this validator can only validate the number of parameters.
 *
 * @export
 * @class DefaultMethodValidator
 * @template {MethodLike} Out
 * @template {ExtendedValidationParameters} [EVP=NoParameters]
 * @extends {DefaultValidator<Out, EVP>}
 * @implements {MethodValidator<Out, EVP>}
 * @since 1.0.0
 */
export class DefaultMethodValidator<
    Out extends MethodLike,
    EVP extends ExtendedValidationParameters = NoParameters
  >
  extends DefaultValidator<Out, EVP>
  implements MethodValidator<Out, EVP>
{
  public count(count_: number): this {
    return this.setupCondition((value_) => this.checkCount(value_, count_));
  }

  public min(min_: number): this {
    return this.setupCondition((value_) => this.checkMin(value_, min_));
  }

  public max(max_: number): this {
    return this.setupCondition((value_) => this.checkMax(value_, max_));
  }

  protected validateBaseType(value_: unknown): Out {
    if (typeof value_ === 'function') {
      return value_ as Out;
    }

    this.throwValidationError('value is not a method');
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
