import type { Dictionary, DictionaryKey, DictionaryValue } from 'ts-lib-extended';
import { Validator } from '.';
import { Validatable } from '../types';

/**
 * Validator for dictionary objects
 *
 * @export
 * @class DictionaryValidator
 * @extends {Validator<TValue>}
 * @template TValue
 */
export class DictionaryValidator<TValue extends Dictionary> extends Validator<TValue> {
  private _keyValidator: Validatable<DictionaryKey<TValue>> | undefined;

  constructor(
    private _itemValidator: Validatable<DictionaryValue<TValue>>
  ) {
    super();
  }

  /**
   * additional dictionary key validation
   *
   * @param {ValidatorInterface<DictionaryKey<TValue>>} validator_
   * @return {*}  {this}
   * @memberof DictionaryValidator
   */
  public key(validator_: Validatable<DictionaryKey<TValue>>): this {
    this._keyValidator = validator_;
    return this;
  }

  protected validateValue(value_: unknown): TValue {
    if (!this.isDictionary(value_)) {
      this.throwValidationError('value is not a dictionary');
    }

    for (const dictionaryKey in value_) {
      try {
        this._keyValidator?.validate(dictionaryKey);
        this._itemValidator.validate(value_[dictionaryKey]);
      } catch (reason_) {
        // TODO: error origin is lost at this point -> key or item error???
        this.rethrowError(reason_, dictionaryKey);
      }
    }

    return value_ as TValue;
  }

  private isDictionary(value_: unknown): value_ is Dictionary<any> {
    // TODO: is there any validatable differnce between dictionary and standard object?
    return typeof value_ === 'object' && value_ !== null;
  }
}
