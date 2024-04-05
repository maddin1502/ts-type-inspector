import type { ObjectLike, PropertyValidators, Validator } from '../types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for object based values. Each property has to match its specified validator
 *
 * @export
 * @interface ObjectValidator
 * @template {ObjectLike} Out
 * @template {ObjectLike} [ValidationParams=any] extended validation parameters
 * @extends {Validator<Out, ValidationParams>}
 * @since 1.0.0
 */
export interface ObjectValidator<
  Out extends ObjectLike,
  ValidationParams extends ObjectLike = any
> extends Validator<Out, ValidationParams> {
  /**
   * Reject objects that contain more keys than have been validated
   * USE FOR POJOs ONLY!. Getter/Setter/Methods will lead to false negative results
   *
   * @readonly
   * @type {this}
   * @since 1.0.0
   */
  get noOverload(): this;
}

/**
 * Validator for object based values. Each property has to match its specified validator
 *
 * @export
 * @class DefaultObjectValidator
 * @template {ObjectLike} Out
 * @template {ObjectLike} [ValidationParams=any] extended validation parameters
 * @extends {DefaultValidator<Out, ValidationParams>}
 * @implements {ObjectValidator<Out, ValidationParams>}
 * @since 1.0.0
 */
export class DefaultObjectValidator<
    Out extends ObjectLike,
    ValidationParams extends ObjectLike = any
  >
  extends DefaultValidator<Out, ValidationParams>
  implements ObjectValidator<Out, ValidationParams>
{
  constructor(private readonly _propertyValidators: PropertyValidators<Out>) {
    super();
  }

  public get noOverload(): this {
    return this.setupCondition((value_) => this.checkOverload(value_));
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
        // keep optional parameters in mind! The value must be validated even if it is undefined
        this._propertyValidators[validatorKey].validate(value_[validatorKey]);
      } catch (reason_) {
        this.rethrowError(reason_, validatorKey);
      }
    }

    return value_;
  }

  private isObjectLike(value_: unknown): value_ is ObjectLike {
    return typeof value_ === 'object' && value_ !== null;
  }

  private checkOverload(value_: ObjectLike): void {
    for (const propertyKey in value_) {
      if (!(propertyKey in this._propertyValidators)) {
        this.throwValidationError('value is overloaded');
      }
    }
  }
}
