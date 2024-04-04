import { ContainerExtendedValidationParameters } from '@/index.js';
import type {
  ObjectLike,
  PartialPropertyValidators,
  Validator
} from '../types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for object based values. This is an **UNSAFE** validator that only validates some properties and ignores others
 *
 * @export
 * @interface PartialValidator
 * @template {ObjectLike} Out
 * @template [ItemValidationParams=any]
 * @template {ContainerExtendedValidationParameters<ItemValidationParams>} [ValidationParams=ContainerExtendedValidationParameters<ItemValidationParams>]
 * @extends {Validator<Out, ValidationParams>}
 * @since 2.0.0
 */
export interface PartialValidator<
  Out extends ObjectLike,
  ItemValidationParams = any,
  ValidationParams extends ContainerExtendedValidationParameters<ItemValidationParams> = ContainerExtendedValidationParameters<ItemValidationParams>
> extends Validator<Out, ValidationParams> {}

/**
 * Validator for object based values. This is an **UNSAFE** validator that only validates some properties and ignores others
 *
 * @export
 * @class DefaultPartialValidator
 * @template {ObjectLike} Out
 * @template [ItemValidationParams=any]
 * @template {ContainerExtendedValidationParameters<ItemValidationParams>} [ValidationParams=ContainerExtendedValidationParameters<ItemValidationParams>]
 * @extends {DefaultValidator<Out, ValidationParams>}
 * @implements {PartialValidator<Out, ValidationParams>}
 * @since 2.0.0
 */
export class DefaultPartialValidator<
    Out extends ObjectLike,
    ItemValidationParams = any,
    ValidationParams extends ContainerExtendedValidationParameters<ItemValidationParams> = ContainerExtendedValidationParameters<ItemValidationParams>
  >
  extends DefaultValidator<Out, ValidationParams>
  implements PartialValidator<Out, ItemValidationParams, ValidationParams>
{
  constructor(
    private readonly _propertyValidators: PartialPropertyValidators<
      Out,
      ItemValidationParams
    >
  ) {
    super();
  }

  protected validateBaseType(
    value_: unknown,
    _params_?: ValidationParams
  ): Out {
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
