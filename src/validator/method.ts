import { RangeValidator, RangeValidatorInterface } from './range';

export type MethodType = (...args_: any[]) => any;

export class MethodValidator<TValue extends MethodType>
  extends RangeValidator<TValue, number, MethodType | number>
  implements MethodValidatorInterface<TValue>
{
  private _paramsCount: number | undefined;
  protected readonly minErrorMessage: string = 'too few parameters';
  protected readonly maxErrorMessage: string = 'too many parameters';

  constructor() {
    super();
  }

  public params(count_: number): this {
    this._paramsCount = count_;
    return this;
  }

  protected validateValue(value_: unknown): TValue {
    if (typeof value_ !== 'function') {
      this.throwValidationError('value is not a method');
    }

    if (this._paramsCount !== undefined && this._paramsCount !== value_.length) {
      this.throwValidationError('incorrect params count');
    }

    return super.validateValue(value_ as TValue);
  }

  protected applyMin(min_: number, value_: TValue): boolean {
    return value_.length >= min_;
  }

  protected applyMax(max_: number, value_: TValue): boolean {
    return value_.length <= max_;
  }

  protected matches(item_: number | TValue, value_: TValue): boolean {
    return typeof item_ === 'number' ? value_.length === item_ : value_ === item_;
  }
}

/**
 * Validator for method-like values.
 * Unfortunately (for technical reasons), this validator can only validate the number of parameters.
 *
 * @export
 * @interface MethodValidatorInterface
 * @extends {(RangeValidatorInterface<TValue, number, MethodType | number>)}
 * @template TValue
 */
export interface MethodValidatorInterface<TValue extends MethodType>
  extends RangeValidatorInterface<TValue, number, MethodType | number>
{
  /**
   * parameter count has to match given number
   *
   * @param {number} count_
   * @return {*}  {this}
   * @memberof MethodValidatorInterface
   */
  params(count_: number): this;
}
