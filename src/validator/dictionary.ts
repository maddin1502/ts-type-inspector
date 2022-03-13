import type { Dictionary, DictionaryKey, DictionaryValue } from 'ts-lib-extended';
import { Validator } from '.';
import type { Validatable } from '../types';

/**
 * Validator for dictionary objects
 *
 * @since 1.0.0
 * @export
 * @class DictionaryValidator
 * @extends {Validator<Out>}
 * @template Out
 */
export class DictionaryValidator<Out extends Dictionary> extends Validator<Out> {
  constructor(
    private readonly _itemValidator: Validatable<DictionaryValue<Out>>
  ) {
    super();
  }

  /**
   * additional dictionary key validation
   *
   * @since 1.0.0
   * @param {Validatable<DictionaryKey<Out>>} validator_
   * @return {*}  {this}
   * @memberof DictionaryValidator
   */
  public keys(validator_: Validatable<DictionaryKey<Out>>): this {
    return this.setupCondition(value_ => this.checkKeys(value_, validator_));
  }

  protected validateBaseType(value_: unknown): Out {
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

    return value_ as Out;
  }

  private isDictionary(value_: unknown): value_ is Dictionary<any> {
    // TODO: is there any validatable differnce between dictionary and standard object?
    return typeof value_ === 'object' && value_ !== null;
  }

  private checkKeys(value_: Dictionary<any>, keyValidator_: Validatable<DictionaryKey<Out>>): void {
    for (const dictionaryKey in value_) {
      try {
        keyValidator_.validate(dictionaryKey);
      } catch (reason_) {
        this.rethrowError(reason_, dictionaryKey);
      }
    }
  }
}
