import {
  ContainerExtendedValidationParameters,
  ExtendedValidationParameters,
  NoParameters,
  TupleItemValidators,
  Validator
} from '@/types.js';

import { DefaultValidator } from './index.js';

/**
 * Validator for tuple based values. Each item has to match its specified validator
 *
 * @export
 * @interface TupleValidator
 * @template {unknown[]} Out
 * @template {ExtendedValidationParameters} [EVP=NoParameters]
 * @template {ContainerExtendedValidationParameters<EVP>} [CEVP=ContainerExtendedValidationParameters<EVP>]
 * @extends {Validator<Out, EVP>}
 * @since 3.0.0
 */
export interface TupleValidator<
  Out extends unknown[],
  EVP extends ExtendedValidationParameters = NoParameters,
  CEVP extends ContainerExtendedValidationParameters<EVP> = ContainerExtendedValidationParameters<EVP>
> extends Validator<Out, CEVP> {
  /**
   * Reject tuples that contain more items than have been validated
   *
   * @readonly
   * @type {this}
   * @since 3.0.0
   */
  get noOverload(): this;
}

/**
 * Validator for tuple based values. Each item has to match its specified validator
 *
 * @export
 * @class DefaultTupleValidator
 * @template {unknown[]} Out
 * @template {ExtendedValidationParameters} [EVP=NoParameters]
 * @template {ContainerExtendedValidationParameters<EVP>} [CEVP=ContainerExtendedValidationParameters<EVP>]
 * @extends {DefaultValidator<Out, EVP>}
 * @implements {TupleValidator<Out, EVP>}
 * @since 3.0.0
 */
export class DefaultTupleValidator<
    Out extends unknown[],
    EVP extends ExtendedValidationParameters = NoParameters,
    CEVP extends ContainerExtendedValidationParameters<EVP> = ContainerExtendedValidationParameters<EVP>
  >
  extends DefaultValidator<Out, CEVP>
  implements TupleValidator<Out, EVP, CEVP>
{
  private readonly _itemValidators: TupleItemValidators<Out>;

  constructor(...itemValidators_: TupleItemValidators<Out>) {
    super();
    this._itemValidators = itemValidators_;
  }

  public get noOverload(): this {
    return this.setupCondition((value_) => this.checkOverload(value_));
  }

  protected validateBaseType(value_: unknown, params_?: CEVP): Out {
    if (!Array.isArray(value_)) {
      this.throwValidationError('value is not an tuple');
    }

    if (value_.length < this._itemValidators.length) {
      this.throwValidationError('too few items');
    }

    for (let i = 0; i < this._itemValidators.length; i++) {
      try {
        this._itemValidators[i].validate(
          value_[i],
          params_?.extendedItemValidationParameters
        );
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
