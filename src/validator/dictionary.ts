import type {
  Dictionary,
  DictionaryKey,
  DictionaryValue
} from 'ts-lib-extended';
import type {
  EmptyObject,
  ExtendedValidationParameters,
  Validatable
} from '../types.js';
import { Validator } from './index.js';

/**
 * Validator for dictionary objects
 *
 * @export
 * @template {Dictionary} Out
 * @template {ExtendedValidationParameters} [EVPI=EmptyObject]
 * @template {{ itemValidatorParams?: EVPI }} [EVP=EmptyObject]
 * @since 1.0.0
 */
export type DictionaryValidatable<
  Out extends Dictionary,
  EVPI extends ExtendedValidationParameters = EmptyObject,
  EVP extends { itemValidatorParams?: EVPI } = EmptyObject
> = Validatable<Out, EVP> & {
  /**
   * additional dictionary key validation
   *
   * @param {Validatable<DictionaryKey<Out>>} validator_
   * @returns {DictionaryValidatable<Out, EVPI, EVP>}
   * @since 1.0.0
   */
  keys(
    validator_: Validatable<DictionaryKey<Out>>
  ): DictionaryValidatable<Out, EVPI, EVP>;
};

/**
 * Validator for dictionary objects
 *
 * @export
 * @class DictionaryValidator
 * @template {Dictionary} Out
 * @template {ExtendedValidationParameters} [EVPI=EmptyObject]
 * @template {{ itemValidatorParams?: EVPI }} [EVP=EmptyObject]
 * @extends {Validator<Out, EVP>}
 * @implements {DictionaryValidatable<Out, EVPI, EVP>}
 * @since 1.0.0
 */
export class DictionaryValidator<
    Out extends Dictionary,
    EVPI extends ExtendedValidationParameters = EmptyObject,
    EVP extends { itemValidatorParams?: EVPI } = EmptyObject
  >
  extends Validator<Out, EVP>
  implements DictionaryValidatable<Out, EVPI, EVP>
{
  constructor(
    private readonly _itemValidator: Validatable<DictionaryValue<Out>, EVPI>
  ) {
    super();
  }

  public keys(
    validator_: Validatable<DictionaryKey<Out>>
  ): DictionaryValidatable<Out, EVPI, EVP> {
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
    // TODO: is there any validatable difference between dictionary and standard object?
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
