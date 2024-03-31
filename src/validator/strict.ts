import type { ArrayItem, EmptyObject } from 'ts-lib-extended';
import type {
  AnyLike,
  ExtendedValidationParameters,
  Validator
} from '../types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for precisely defined values (not just of specific type)
 * Keep in mind that object are compaired by reference (equality)
 *
 * @export
 * @interface StrictValidator
 * @template {AnyLike[]} V
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @extends {Validator<ArrayItem<V>, EVP>}
 * @since 1.0.0
 */
export interface StrictValidator<
  V extends AnyLike[],
  EVP extends ExtendedValidationParameters = EmptyObject
> extends Validator<ArrayItem<V>, EVP> {}

/**
 * Validator for precisely defined values (not just of specific type)
 * Keep in mind that object are compaired by reference (equality)
 *
 * @export
 * @class DefaultStrictValidator
 * @template {AnyLike[]} V
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @extends {DefaultValidator<ArrayItem<V>, EVP>}
 * @implements {StrictValidator<V, EVP>}
 * @since 1.0.0
 */
export class DefaultStrictValidator<
    V extends AnyLike[],
    EVP extends ExtendedValidationParameters = EmptyObject
  >
  extends DefaultValidator<ArrayItem<V>, EVP>
  implements StrictValidator<V, EVP>
{
  private readonly _strictValues: V;

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
