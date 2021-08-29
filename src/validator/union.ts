import { Validator } from './index';

export type ValidatorsType<TValue = any> = Validator<TValue>[];
export type UnionValidatorsType<V extends ValidatorsType>
  = V['length'] extends 0 | 1
    ? [ Validator<any>, Validator<any> ]
    : V;
export type ValidatorsItemType<V extends ValidatorsType>
  = V extends ArrayLike<Validator<infer P>> ? P : never;

/**
 * Validator for union type values (like "string | number")
 *
 * @export
 * @class UnionValidator
 * @extends {Validator<ValidatorsItemType<V>>}
 * @template V
 */
export class UnionValidator<V extends ValidatorsType> extends Validator<ValidatorsItemType<V>> {
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
      } catch (reason_) {
        validationErrors.push(reason_);
      }
    }

    if (validationErrors.length === this._validators.length) {
      this.throwValidationError('value does not match any of the possible types', undefined, validationErrors);
    }

    return value_ as ValidatorsItemType<V>;
  }
}
