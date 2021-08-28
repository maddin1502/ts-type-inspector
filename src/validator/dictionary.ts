import { Dictionary, DictionaryKey, DictionaryValue } from 'ts-lib-extended';
import { Validator, ValidatorInterface } from '.';

/**
 * Validator for dictionary objects
 *
 * @export
 * @class DictionaryValidator
 * @extends {Validator<TValue>}
 * @template TValue
 */
export class DictionaryValidator<TValue extends Dictionary> extends Validator<TValue> {
  private _keysValidator: ValidatorInterface<string> | undefined;

  constructor(
    private _itemValidator: ValidatorInterface<DictionaryValue<TValue>>
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
  public keys(validator_: ValidatorInterface<DictionaryKey<TValue>>): this {
    this._keysValidator = validator_;
    return this;
  }

  protected validateValue(value_: unknown): TValue {
    if (!this.isDictionary(value_)) {
      this.throwValidationError('value is not a dictionary');
    }

    const keys = Object.keys(value_);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      try {
        this._keysValidator?.validate(key);
        this._itemValidator.validate(value_[key]);
      } catch (reason_) {
        // TODO: error origin is lost at this point -> key or item error???
        this.rethrowError(reason_, key);
      }
    }

    return value_ as TValue;
  }

  private isDictionary(value_: unknown): value_ is Dictionary<any> {
    // TODO: is there any validatable differnce between dictionary and standard object?
    return typeof value_ !== 'object' || value_ === null;
  }
}
