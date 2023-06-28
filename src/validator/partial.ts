import type {
  ObjectLike,
  PartialPropertyValidatables,
  Validatable
} from '../types.js';
import { Validator } from './index.js';

/**
 * Validator for object based values. This is a "unsafe" validator that only validates some properties and ignores others
 *
 * @since 2.0.0
 * @export
 * @template Out
 */
export type PartialValidatable<Out extends ObjectLike> = Validatable<Out>;

/**
 * Validator for object based values. This is a "unsafe" validator that only validates some properties and ignores others
 *
 * @since 2.0.0
 * @export
 * @class PartialValidator
 * @extends {Validator<Out>}
 * @implements {PartialValidatable<Out>}
 * @template Out
 */
export class PartialValidator<Out extends ObjectLike>
  extends Validator<Out>
  implements PartialValidatable<Out>
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
