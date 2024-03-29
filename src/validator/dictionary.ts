import type {
  Dictionary,
  DictionaryKey,
  DictionaryValue
} from 'ts-lib-extended';
import type {
  ContainerExtendedValidationParameters,
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
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @template {ContainerExtendedValidationParameters<EVP>} [CEVP=EmptyObject]
 * @since 1.0.0
 */
export type DictionaryValidatable<
  Out extends Dictionary,
  EVP extends ExtendedValidationParameters = EmptyObject,
  CEVP extends ContainerExtendedValidationParameters<EVP> = EmptyObject
> = Validatable<Out, CEVP> & {
  /**
   * additional dictionary key validation
   *
   * @param {Validatable<DictionaryKey<Out>>} validator_
   * @returns {DictionaryValidatable<Out, EVP, CEVP>}
   * @since 1.0.0
   */
  keys(
    validator_: Validatable<DictionaryKey<Out>>
  ): DictionaryValidatable<Out, EVP, CEVP>;
};

/**
 * Validator for dictionary objects
 *
 * @export
 * @class DictionaryValidator
 * @template {Dictionary} Out
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @template {ContainerExtendedValidationParameters<EVP>} [CEVP=EmptyObject]
 * @extends {Validator<Out, CEVP>}
 * @implements {DictionaryValidatable<Out, EVP, CEVP>}
 * @since 1.0.0
 */
export class DictionaryValidator<
    Out extends Dictionary,
    EVP extends ExtendedValidationParameters = EmptyObject,
    CEVP extends ContainerExtendedValidationParameters<EVP> = EmptyObject
  >
  extends Validator<Out, CEVP>
  implements DictionaryValidatable<Out, EVP, CEVP>
{
  constructor(
    private readonly _itemValidator: Validatable<DictionaryValue<Out>, EVP>
  ) {
    super();
  }

  public keys(
    validator_: Validatable<DictionaryKey<Out>>
  ): DictionaryValidatable<Out, EVP, CEVP> {
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
