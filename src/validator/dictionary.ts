import type {
  Dictionary,
  DictionaryKey,
  DictionaryValue
} from 'ts-lib-extended';
import type { ContainerValidationParameters, Validator } from '../types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for dictionary objects
 *
 * @export
 * @interface DictionaryValidator
 * @template {Dictionary} Out
 * @template [ItemValidationParams=any]
 * @template {ContainerValidationParameters<ItemValidationParams>} [ValidationParams=ContainerValidationParameters<ItemValidationParams>]
 * @extends {Validator<Out, ValidationParams>}
 * @since 1.0.0
 */
export interface DictionaryValidator<
  Out extends Dictionary,
  ItemValidationParams = any,
  ValidationParams extends ContainerValidationParameters<ItemValidationParams> = ContainerValidationParameters<ItemValidationParams>
> extends Validator<Out, ValidationParams> {
  /**
   * additional dictionary key validation
   *
   * @param {Validator<DictionaryKey<Out>>} validator_
   * @returns {this}
   * @since 1.0.0
   */
  keys(validator_: Validator<DictionaryKey<Out>>): this;
}

/**
 * Validator for dictionary objects
 *
 * @export
 * @class DefaultDictionaryValidator
 * @template {Dictionary} Out
 * @template [ItemValidationParams=any]
 * @template {ContainerValidationParameters<ItemValidationParams>} [ValidationParams=ContainerValidationParameters<ItemValidationParams>]
 * @extends {DefaultValidator<Out, ValidationParams>}
 * @implements {DictionaryValidator<Out, ValidationParams, ValidationParams>}
 * @since 1.0.0
 */
export class DefaultDictionaryValidator<
    Out extends Dictionary,
    ItemValidationParams = any,
    ValidationParams extends ContainerValidationParameters<ItemValidationParams> = ContainerValidationParameters<ItemValidationParams>
  >
  extends DefaultValidator<Out, ValidationParams>
  implements DictionaryValidator<Out, ItemValidationParams, ValidationParams>
{
  constructor(
    private readonly _itemValidator: Validator<
      DictionaryValue<Out>,
      ItemValidationParams
    >
  ) {
    super();
  }

  public keys(validator_: Validator<DictionaryKey<Out>>): this {
    return this.setupCondition((value_) => this.checkKeys(value_, validator_));
  }

  protected validateBaseType(value_: unknown, params_?: ValidationParams): Out {
    if (!this.isDictionary(value_)) {
      this.throwValidationError('value is not a dictionary');
    }

    for (const dictionaryKey in value_) {
      try {
        this._itemValidator.validate(
          value_[dictionaryKey],
          params_?.itemValidationParams
        );
      } catch (reason_) {
        this.rethrowError(reason_, dictionaryKey);
      }
    }

    return value_ as Out;
  }

  private isDictionary(value_: unknown): value_ is Dictionary<any> {
    return typeof value_ === 'object' && value_ !== null;
  }

  private checkKeys(
    value_: Dictionary<any>,
    keyValidator_: Validator<DictionaryKey<Out>>
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
