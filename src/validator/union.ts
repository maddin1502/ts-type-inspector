import { Validator, ValidatorInterface } from './index';

export type ValidatorsType<TValue = any> = ValidatorInterface<TValue>[];
export type UnionValidatorsType<V extends ValidatorsType>
  = V['length'] extends 0 | 1
    ? [ ValidatorInterface<any>, ValidatorInterface<any> ]
    : V;
export type ValidatorsItemType<V extends ValidatorsType>
  = V extends ArrayLike<ValidatorInterface<infer P>> ? P : never;

export class UnionValidator<V extends ValidatorsType>
  extends Validator<ValidatorsItemType<V>>
  implements UnionValidatorInterface<V>
{
  private _validators: UnionValidatorsType<V>;

  constructor(
    ...validators_: UnionValidatorsType<V>
  ) {
    super();
    this._validators = validators_;
  }

  protected validateValue(value_: unknown): ValidatorsItemType<V> {
    const validationErrors: Error[] = [];

    for (let i = 0; i < this._validators.length; i++) {
      try {
        this._validators[i].validate(value_);
        break;
      } catch (error_) {
        validationErrors.push(error_);
      }
    }

    if (validationErrors.length === this._validators.length) {
      this.throwValidationError('value does not match any of the possible types', undefined, validationErrors);
    }

    return value_ as ValidatorsItemType<V>;
  }
}

/**
 * Validator for union type values (like "string | number")
 *
 * @export
 * @interface UnionValidatorInterface
 * @extends {ValidatorInterface<ValidatorsItemType<V>>}
 * @template V
 */
export interface UnionValidatorInterface<V extends ValidatorsType> extends ValidatorInterface<ValidatorsItemType<V>> { }
