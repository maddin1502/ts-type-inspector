import type { Dictionary, DictionaryKey, DictionaryValue } from 'ts-lib-extended';
import { Validator } from '.';
import type { Validatable } from '../types';

/**
 * Validator for dictionary objects
 *
 * @export
 * @class DictionaryValidator
 * @extends {Validator<V>}
 * @template V
 */
export class DictionaryValidator<V extends Dictionary> extends Validator<V> {
  private _keyValidator: Validatable<DictionaryKey<V>> | undefined;

  constructor(
    private _itemValidator: Validatable<DictionaryValue<V>>
  ) {
    super();
  }

  /**
   * additional dictionary key validation
   *
   * @param {ValidatorInterface<DictionaryKey<V>>} validator_
   * @return {*}  {this}
   * @memberof DictionaryValidator
   */
  public key(validator_: Validatable<DictionaryKey<V>>): this {
    this._keyValidator = validator_;
    return this;
  }

  protected validateBaseType(value_: unknown): V {
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

    return value_ as V;
  }

  private isDictionary(value_: unknown): value_ is Dictionary<any> {
    // TODO: is there any validatable differnce between dictionary and standard object?
    return typeof value_ === 'object' && value_ !== null;
  }
}
