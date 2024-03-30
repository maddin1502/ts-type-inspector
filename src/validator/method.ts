import type { EmptyObject } from 'ts-lib-extended';
import type {
  ExtendedValidationParameters,
  MethodLike,
  Validatable
} from '../types.js';
import { Validator } from './index.js';

/**
 * Validator for method-like values.
 * Unfortunately (for technical reasons), this validator can only validate the number of parameters.
 *
 * @export
 * @template {MethodLike} Out
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @since 1.0.0
 */
export type MethodValidatable<
  Out extends MethodLike,
  EVP extends ExtendedValidationParameters = EmptyObject
> = Validatable<Out, EVP> & {
  /**
   * validate exact params count
   *
   * @param {number} count_
   * @returns {MethodValidatable<Out, EVP>}
   * @since 1.0.0
   */
  count(count_: number): MethodValidatable<Out, EVP>;
  /**
   * validate minimum params count
   *
   * @param {number} min_
   * @returns {MethodValidatable<Out, EVP>}
   * @since 1.0.0
   */
  min(min_: number): MethodValidatable<Out, EVP>;
  /**
   * validate maximum params count
   *
   * @param {number} max_
   * @returns {MethodValidatable<Out, EVP>}
   * @since 1.0.0
   */
  max(max_: number): MethodValidatable<Out, EVP>;
};

/**
 * Validator for method-like values.
 * Unfortunately (for technical reasons), this validator can only validate the number of parameters.
 *
 * @export
 * @class MethodValidator
 * @template {MethodLike} Out
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @extends {Validator<Out, EVP>}
 * @implements {MethodValidatable<Out, EVP>}
 * @since 1.0.0
 */
export class MethodValidator<
    Out extends MethodLike,
    EVP extends ExtendedValidationParameters = EmptyObject
  >
  extends Validator<Out, EVP>
  implements MethodValidatable<Out, EVP>
{
  public count(count_: number): MethodValidatable<Out, EVP> {
    return this.setupCondition((value_) => this.checkCount(value_, count_));
  }

  public min(min_: number): MethodValidatable<Out, EVP> {
    return this.setupCondition((value_) => this.checkMin(value_, min_));
  }

  public max(max_: number): MethodValidatable<Out, EVP> {
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
