import { DictionaryInterface } from '@hbc/custom-types';
import { Validator, ValidatorInterface } from '.';

export class DictionaryValidator<TValue>
  extends Validator<DictionaryInterface<TValue>>
  implements DictionaryValidatorInterface<TValue>
{
  private _keysValidator: ValidatorInterface<string> | undefined;

  constructor(
    private _itemValidator: ValidatorInterface<TValue>
  ) {
    super();
  }

  public keys(validator_: ValidatorInterface<string>): this {
    this._keysValidator = validator_;
    return this;
  }

  protected validateValue(value_: unknown): DictionaryInterface<TValue> {
    if (typeof value_ !== 'object' || value_ === null) {
      this.throwValidationError('value is not an object');
    }

    const propertyKeys = Object.keys(value_);

    for (let i = 0; i < propertyKeys.length; i++) {
      const propertyKey = propertyKeys[i];

      try {
        this._keysValidator?.validate(propertyKey);
        this._itemValidator.validate((value_ as any)[propertyKey]);
      } catch (error_) {
        // TODO: error origin is lost at this point -> key or item error???
        this.rethrowError(error_, propertyKey);
      }
    }

    return value_ as DictionaryInterface<TValue>;
  }
}

/**
 * Validator for dictionary objects
 *
 * @export
 * @interface DictionaryValidatorInterface
 * @extends {ValidatorInterface<DictionaryInterface<T>>}
 * @template T
 */
export interface DictionaryValidatorInterface<T> extends ValidatorInterface<DictionaryInterface<T>> {
  /**
   * dictionary keys have to match specific entries
   *
   * @param {ValidatorInterface<string>} validator_ string validator for key validation
   * @return {*}  {this}
   * @memberof DictionaryValidatorInterface
   */
  keys(validator_: ValidatorInterface<string>): this;
}
