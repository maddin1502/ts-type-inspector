import type {
  UnionValidatables,
  UnionValidatablesItem,
  Validatable
} from '../types.js';
import { Validator } from './index.js';

/**
 * Validator for union type values (like "string | number")
 *
 * @since 1.0.0
 * @export
 * @template V
 */
export type UnionValidatable<V extends UnionValidatables> = Validatable<
  UnionValidatablesItem<V>
>;

/**
 * Validator for union type values (like "string | number")
 *
 * @since 1.0.0
 * @export
 * @class UnionValidator
 * @extends {Validator<UnionValidatablesItem<V>>}
 * @implements {UnionValidatable<V>}
 * @template V
 */
export class UnionValidator<V extends UnionValidatables>
  extends Validator<UnionValidatablesItem<V>>
  implements UnionValidatable<V>
{
  private _validators: V;

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
