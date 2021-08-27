import { Validator, ValidatorInterface } from '.';

export abstract class MatchValidator<TValue, TMatch = TValue>
  extends Validator<TValue>
  implements MatchValidatorInterface<TValue, TMatch>
{
  private _allowedValues: ReadonlyArray<TMatch> | undefined;
  private _forbiddenValues: ReadonlyArray<TMatch> | undefined;
  protected readonly allowErrorMessage = 'value is not allowed';
  protected readonly forbidErrorMessage = 'value is forbidden';

  public allow(...values_: ReadonlyArray<TMatch>): this {
    this._allowedValues = values_;
    return this;
  }

  public forbid(...values_: ReadonlyArray<TMatch>): this {
    this._forbiddenValues = values_;
    return this;
  }

  protected validateValue(value_: TValue): TValue {
    this.validateMatch(value_, this._allowedValues, 'allow');
    this.validateMatch(value_, this._forbiddenValues, 'forbid');
    return value_;
  }

  private validateMatch(
    value_: TValue,
    items_: ReadonlyArray<TMatch> | undefined,
    mode_: 'allow' | 'forbid'
  ): TValue {
    if (
      items_
      && items_.length > 0
      && (this.someMatches(items_, value_) ? mode_ === 'forbid' : mode_ === 'allow')
    ) {
      this.throwValidationError(mode_ === 'allow' ? this.allowErrorMessage : this.forbidErrorMessage);
    }

    return value_;
  }

  private someMatches(items_: ReadonlyArray<TMatch>, value_: TValue): boolean {
    for (let i = 0; i < items_.length; i++) {
      if (this.matches(items_[i], value_)) {
        return true;
      }
    }

    return false;
  }

  protected abstract matches(item_: TMatch, value_: TValue): boolean;
}

/**
 * Validator base for value filtering
 *
 * @export
 * @interface MatchValidatorInterface
 * @extends {ValidatorInterface<TValue>}
 * @template TValue
 * @template TMatch
 */
export interface MatchValidatorInterface<TValue, TMatch = TValue> extends ValidatorInterface<TValue> {
  /**
   * value has to match specific entries
   *
   * @param {...ReadonlyArray<TMatch>} values_ alowed entries
   * @return {*}  {this}
   * @memberof MatchValidatorInterface
   */
  allow(...values_: ReadonlyArray<TMatch>): this;
  /**
   * value must NOT match specific entries
   *
   * @param {...ReadonlyArray<TMatch>} values_ forbidden entries
   * @return {*}  {this}
   * @memberof MatchValidatorInterface
   */
  forbid(...values_: ReadonlyArray<TMatch>): this;
}
