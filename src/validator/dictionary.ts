import type { Dictionary, DictionaryKey, DictionaryValue } from 'ts-lib-extended';
import { Validator } from '.';
import type { Validatable } from '../types';

/**
 * Validator for dictionary objects
 *
 * @since 1.0.0
 * @export
 * @class DictionaryValidator
 * @extends {Validator<V>}
 * @template V
 */
export class DictionaryValidator<V extends Dictionary> extends Validator<V> {
  constructor(
    private readonly _itemValidator: Validatable<DictionaryValue<V>>
  ) {
    super();
  }

  /**
   * additional dictionary key validation
   *
   * @since 1.0.0
   * @param {Validatable<DictionaryKey<V>>} validator_
   * @return {*}  {this}
   * @memberof DictionaryValidator
   */
  public keys(validator_: Validatable<DictionaryKey<V>>): this {
    return this.setupCondition(value_ => this.checkKeys(value_, validator_));
  }

  protected validateBaseType(value_: unknown): V {
    if (!this.isDictionary(value_)) {
      this.throwValidationError('value is not a dictionary');
    }

    for (const dictionaryKey in value_) {
      try {
        this._itemValidator.validate(value_[dictionaryKey]);
      } catch (reason_) {
        this.rethrowError(reason_, dictionaryKey);
      }
    }

    return value_ as V;
  }

  private isDictionary(value_: unknown): value_ is Dictionary<any> {
    // TODO: is there any validatable differnce between dictionary and standard object?
    return typeof value_ === 'object' && value_ !== null;
  }

  private checkKeys(value_: Dictionary<any>, keyValidator_: Validatable<DictionaryKey<V>>): void {
    for (const dictionaryKey in value_) {
      try {
        keyValidator_.validate(dictionaryKey);
      } catch (reason_) {
        this.rethrowError(reason_, dictionaryKey);
      }
    }
  }
}
