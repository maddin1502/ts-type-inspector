import type { ObjectLike, TupleItemValidators, Validator } from '../types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for tuple based values. Each item has to match its specified validator
 *
 * @export
 * @interface TupleValidator
 * @template {unknown[]} Out
 * @template {ObjectLike} [ValidationParams=any] extended validation parameters
 * @extends {Validator<Out, ValidationParams>}
 * @since 3.0.0
 */
export interface TupleValidator<
  Out extends unknown[],
  ValidationParams extends ObjectLike = any
> extends Validator<Out, ValidationParams> {
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
 * @template {ObjectLike} [ValidationParams=any] extended validation parameters
 * @extends {DefaultValidator<Out, ValidationParams>}
 * @implements {TupleValidator<Out, ValidationParams>}
 * @since 3.0.0
 */
export class DefaultTupleValidator<
    Out extends unknown[],
    ValidationParams extends ObjectLike = any
  >
  extends DefaultValidator<Out, ValidationParams>
  implements TupleValidator<Out, ValidationParams>
{
  private readonly _itemValidators: TupleItemValidators<Out>;

  constructor(...itemValidators_: TupleItemValidators<Out>) {
    super();
    this._itemValidators = itemValidators_;
  }

  public get noOverload(): this {
    return this.setupCondition((value_) => this.checkOverload(value_));
  }

  protected validateBaseType(
    value_: unknown,
    _params_?: ValidationParams
  ): Out {
    if (!Array.isArray(value_)) {
      this.throwValidationError('value is not an tuple');
    }

    if (value_.length < this._itemValidators.length) {
      this.throwValidationError('too few items');
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
