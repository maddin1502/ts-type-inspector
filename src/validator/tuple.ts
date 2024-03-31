import {
  ExtendedValidationParameters,
  TupleItemValidatables,
  Validatable
} from '@/types.js';
import type { EmptyObject } from 'ts-lib-extended';
import { Validator } from './index.js';

/**
 * Validator for tuple based values. Each entry has to match its specified validator
 *
 * @export
 * @template {unknown[]} Out
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @since 3.0.0
 */
export type TupleValidatable<
  Out extends unknown[],
  EVP extends ExtendedValidationParameters = EmptyObject
> = Validatable<Out, EVP> & {
  /**
   * Reject tuples that contain more entries than have been validated
   *
   * @readonly
   * @type {TupleValidatable<Out, EVP>}
   * @since 3.0.0
   */
  get noOverload(): TupleValidatable<Out, EVP>;
};

/**
 * Validator for tuple based values. Each entry has to match its specified validator
 *
 * @export
 * @class TupleValidator
 * @template {unknown[]} Out
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @extends {Validator<Out, EVP>}
 * @implements {TupleValidatable<Out, EVP>}
 * @since 3.0.0
 */
export class TupleValidator<
    Out extends unknown[],
    EVP extends ExtendedValidationParameters = EmptyObject
  >
  extends Validator<Out, EVP>
  implements TupleValidatable<Out, EVP>
{
  private readonly _itemValidators: TupleItemValidatables<Out>;

  constructor(...itemValidators_: TupleItemValidatables<Out>) {
    super();
    this._itemValidators = itemValidators_;
  }

  public get noOverload(): TupleValidatable<Out, EVP> {
    return this.setupCondition((value_) => this.checkOverload(value_));
  }

  protected validateBaseType(value_: unknown): Out {
    if (!Array.isArray(value_)) {
      this.throwValidationError('value is not an array');
    }

    if (value_.length < this._itemValidators.length) {
      this.throwValidationError('too few entries');
    }

    for (let i = 0; i < this._itemValidators.length; i++) {
      try {
        this._itemValidators[i].validate(value_[i]);
      } catch (reason_) {
        this.rethrowError(reason_, i);
      }
    }

    return value_ as Out;
  }

  private checkOverload(value_: unknown[]): void {
    if (value_.length > this._itemValidators.length) {
      this.throwValidationError('value is overloaded');
    }
  }
}
