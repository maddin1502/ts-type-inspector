import type { EmptyObject } from 'ts-lib-extended';
import type {
  ExtendedValidationParameters,
  UnionValidatables,
  UnionValidatablesItem,
  Validator
} from '../types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for union type values (like "string | number")
 *
 * @export
 * @interface UnionValidator
 * @template {UnionValidatables} V
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @extends {Validator<UnionValidatablesItem<V>, EVP>}
 * @since 1.0.0
 */
export interface UnionValidator<
  V extends UnionValidatables,
  EVP extends ExtendedValidationParameters = EmptyObject
> extends Validator<UnionValidatablesItem<V>, EVP> {}

/**
 * Validator for union type values (like "string | number")
 *
 * @export
 * @class DefaultUnionValidator
 * @template {UnionValidatables} V
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @extends {DefaultValidator<UnionValidatablesItem<V>, EVP>}
 * @implements {UnionValidator<V, EVP>}
 * @since 1.0.0
 */
export class DefaultUnionValidator<
    V extends UnionValidatables,
    EVP extends ExtendedValidationParameters = EmptyObject
  >
  extends DefaultValidator<UnionValidatablesItem<V>, EVP>
  implements UnionValidator<V, EVP>
{
  private readonly _validators: V;

  constructor(...validators_: V) {
    super();
    this._validators = validators_;
  }

  protected validateBaseType(value_: unknown): UnionValidatablesItem<V> {
    const errors: Error[] = [];

    for (let i = 0; i < this._validators.length; i++) {
      const validator = this._validators[i];

      try {
        validator.validate(value_);
        break;
      } catch (reason_) {
        errors.push(this.detectError(reason_).error);
      }
    }

    if (errors.length === this._validators.length) {
      this.throwValidationError(
        'value does not match any of the possible types',
        undefined,
        errors
      );
    }

    return value_ as UnionValidatablesItem<V>;
  }
}
