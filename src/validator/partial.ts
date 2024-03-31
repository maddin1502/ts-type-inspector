import type { EmptyObject } from 'ts-lib-extended';
import type {
  ExtendedValidationParameters,
  ObjectLike,
  PartialPropertyValidatables,
  Validator
} from '../types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for object based values. This is an **UNSAFE** validator that only validates some properties and ignores others
 *
 * @export
 * @interface PartialValidator
 * @template {ObjectLike} Out
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @extends {Validator<Out, EVP>}
 * @since 2.0.0
 */
export interface PartialValidator<
  Out extends ObjectLike,
  EVP extends ExtendedValidationParameters = EmptyObject
> extends Validator<Out, EVP> {}

/**
 * Validator for object based values. This is an **UNSAFE** validator that only validates some properties and ignores others
 *
 * @export
 * @class DefaultPartialValidator
 * @template {ObjectLike} Out
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @extends {DefaultValidator<Out, EVP>}
 * @implements {PartialValidator<Out, EVP>}
 * @since 2.0.0
 */
export class DefaultPartialValidator<
    Out extends ObjectLike,
    EVP extends ExtendedValidationParameters = EmptyObject
  >
  extends DefaultValidator<Out, EVP>
  implements PartialValidator<Out, EVP>
{
  constructor(
    private readonly _propertyValidators: PartialPropertyValidatables<Out>
  ) {
    super();
  }

  protected validateBaseType(value_: unknown): Out {
    if (!this.isObjectLike(value_)) {
      this.throwValidationError('value is not an object');
    }

    for (const validatorKey in this._propertyValidators) {
      try {
        this._propertyValidators[validatorKey]?.validate(value_[validatorKey]);
      } catch (reason_) {
        this.rethrowError(reason_, validatorKey);
      }
    }

    return value_;
  }

  private isObjectLike(value_: unknown): value_ is ObjectLike {
    return typeof value_ === 'object' && value_ !== null;
  }
}
