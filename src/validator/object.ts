import type {
  ObjectLike,
  PropertyValidatables,
  Validatable
} from '../types.js';
import { Validator } from './index.js';

/**
 * Validator for object based values. Each property has to match its specified validator
 *
 * @since 1.0.0
 * @export
 * @template Out
 */
export type ObjectValidatable<Out extends ObjectLike> = Validatable<Out> & {
  /**
   * Reject objects that contain more keys than have been validated
   * USE FOR POJOs ONLY!. Getter/Setter/Methods will lead to false negative results
   *
   * @since 1.0.0
   */
  get noOverload(): ObjectValidatable<Out>;
};

/**
 * Validator for object based values. Each property has to match its specified validator
 *
 * @since 1.0.0
 * @export
 * @class ObjectValidator
 * @extends {Validator<Out>}
 * @implements {ObjectValidatable<Out>}
 * @template Out
 */
export class ObjectValidator<Out extends ObjectLike>
  extends Validator<Out>
  implements ObjectValidatable<Out>
{
  constructor(private readonly _propertyValidators: PropertyValidatables<Out>) {
    super();
  }

  public get noOverload(): ObjectValidatable<Out> {
    return this.setupCondition((value_) => this.checkOverload(value_));
  }

  protected validateBaseType(value_: unknown): Out {
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
