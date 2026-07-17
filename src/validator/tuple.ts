import type { ValidationError } from '@/error.js';
import type { TupleItemValidators, Validator } from '@/types.js';
import { ContainerValidator } from './container.js';

/**
 * Validator for tuple based values. Each item has to match its specified validator
 *
 * @export
 * @interface TupleValidator
 * @template {unknown[]} Out
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {Validator<Out, ValidationParams>}
 * @since 3.0.0
 */
export interface TupleValidator<
  Out extends unknown[],
  ValidationParams = unknown
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
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {ContainerValidator<Out, ValidationParams>}
 * @implements {TupleValidator<Out, ValidationParams>}
 * @since 3.0.0
 */
export class DefaultTupleValidator<
  const Out extends unknown[],
  ValidationParams = unknown
>
  extends ContainerValidator<Out, ValidationParams>
  implements TupleValidator<Out, ValidationParams>
{
  private readonly _itemValidators: TupleItemValidators<Out, ValidationParams>;

  constructor(itemValidators_: TupleItemValidators<Out, ValidationParams>) {
    super();
    this._itemValidators = itemValidators_;
  }

  public get noOverload(): this {
    return this.setupCondition((value_) => this.checkOverload(value_));
  }

  protected validateBaseType(value_: unknown, params_?: ValidationParams): Out {
    if (!Array.isArray(value_)) {
      this.throwValidationError('value is not a tuple');
    }

    if (value_.length < this._itemValidators.length) {
      this.throwValidationError('too few items');
    }

    const errors: ValidationError[] = [];
    const source: unknown[] = value_;
    let result: unknown[] = source;

    for (let i = 0; i < this._itemValidators.length; i++) {
      this.validateChild(
        errors,
        () => source[i],
        this._itemValidators[i],
        i,
        params_,
        (validated) => {
          if (result === source) {
            result = [...source];
          }

          result[i] = validated;
        }
      );
    }

    this.throwOnErrors(errors, 'one or more items are invalid');

    return result as Out;
  }

  private checkOverload(value_: unknown[]): void {
    if (value_.length > this._itemValidators.length) {
      this.throwValidationError('value is overloaded');
    }
  }
}
