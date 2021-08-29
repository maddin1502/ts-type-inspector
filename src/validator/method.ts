import { Validator } from '.';
import type { MethodType } from '../types';

/**
 * Validator for method-like values.
 * Unfortunately (for technical reasons), this validator can only validate the number of parameters.
 *
 * @export
 * @class MethodValidator
 * @extends {Validator<TValue>}
 * @template TValue
 */
export class MethodValidator<TValue extends MethodType> extends Validator<TValue>
{
  private _minParams: number | undefined;
  private _maxParams: number | undefined;
  private _paramsCount: number | undefined;
  protected readonly minErrorMessage: string = 'too few parameters';
  protected readonly maxErrorMessage: string = 'too many parameters';

  constructor() {
    super();
  }

  /**
   * specific parameter count
   *
   * @param {number} count_
   * @return {*}  {this}
   * @memberof MethodValidator
   */
  public params(count_: number): this {
    this._paramsCount = count_;
    return this;
  }

  /**
   * minimum params count
   *
   * @param {number} parms_
   * @return {*}  {this}
   * @memberof MethodValidator
   */
  public min(parms_: number): this {
    this._minParams = parms_;
    return this;
  }

  /**
   * maximum params count
   *
   * @param {number} parms_
   * @return {*}  {this}
   * @memberof MethodValidator
   */
  public max(parms_: number): this {
    this._maxParams = parms_;
    return this;
  }

  protected validateValue(value_: unknown): TValue {
    if (typeof value_ !== 'function') {
      this.throwValidationError('value is not a method');
    }

    if (this._paramsCount !== undefined && this._paramsCount !== value_.length) {
      this.throwValidationError('incorrect params count');
    }

    if (this._minParams && value_.length < this._minParams) {
      this.throwValidationError('too few parameters');
    }

    if (this._maxParams && value_.length > this._maxParams) {
      this.throwValidationError('too many parameters');
    }

    return value_ as TValue;
  }
}
