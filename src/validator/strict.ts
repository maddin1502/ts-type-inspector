import type { ArrayItem } from 'ts-lib-extended';
import type {
  AnyLike,
  EmptyObject,
  ExtendedValidationParameters,
  Validatable
} from '../types.js';
import { Validator } from './index.js';

/**
 * Validator for precisely defined values (not just of specific type)
 * Keep in mind that object are compaired by reference (equality)
 *
 * @export
 * @template {AnyLike[]} V
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @since 1.0.0
 */
export type StrictValidatable<
  V extends AnyLike[],
  EVP extends ExtendedValidationParameters = EmptyObject
> = Validatable<ArrayItem<V>, EVP>;

/**
 * Validator for precisely defined values (not just of specific type)
 * Keep in mind that object are compaired by reference (equality)
 *
 * @export
 * @class StrictValidator
 * @template {AnyLike[]} V
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @extends {Validator<ArrayItem<V>, EVP>}
 * @implements {StrictValidatable<V, EVP>}
 * @since 1.0.0
 */
export class StrictValidator<
    V extends AnyLike[],
    EVP extends ExtendedValidationParameters = EmptyObject
  >
  extends Validator<ArrayItem<V>, EVP>
  implements StrictValidatable<V, EVP>
{
  private _strictValues: V;

  constructor(...strictValues_: V) {
    super();
    this._strictValues = strictValues_;
  }

  protected validateBaseType(value_: unknown): ArrayItem<V> {
    if (!this._strictValues.some((strictValue_) => strictValue_ === value_)) {
      this.throwValidationError('no equality found');
    }

    return value_ as ArrayItem<V>;
  }
}
