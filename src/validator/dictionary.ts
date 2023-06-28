import type {
  Dictionary,
  DictionaryKey,
  DictionaryValue
} from 'ts-lib-extended';
import type { Validatable } from '../types.js';
import { Validator } from './index.js';

/**
 * Validator for dictionary objects
 *
 * @since 1.0.0
 * @export
 * @template Out
 */
export type DictionaryValidatable<Out extends Dictionary> = Validatable<Out> & {
  /**
   * additional dictionary key validation
   *
   * @since 1.0.0
   */
  keys(validator_: Validatable<DictionaryKey<Out>>): DictionaryValidatable<Out>;
};

/**
 * Validator for dictionary objects
 *
 * @since 1.0.0
 * @export
 * @class DictionaryValidator
 * @extends {Validator<Out>}
 * @implements {DictionaryValidatable<Out>}
 * @template Out
 */
export class DictionaryValidator<Out extends Dictionary>
  extends Validator<Out>
  implements DictionaryValidatable<Out>
{
  constructor(
    private readonly _itemValidator: Validatable<DictionaryValue<Out>>
  ) {
    super();
  }

  public keys(
    validator_: Validatable<DictionaryKey<Out>>
  ): DictionaryValidatable<Out> {
    return this.setupCondition((value_) => this.checkKeys(value_, validator_));
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

  private checkKeys(
    value_: Dictionary<any>,
    keyValidator_: Validatable<DictionaryKey<Out>>
  ): void {
    for (const dictionaryKey in value_) {
      try {
        keyValidator_.validate(dictionaryKey);
      } catch (reason_) {
        this.rethrowError(reason_, dictionaryKey);
      }
    }
  }
}
