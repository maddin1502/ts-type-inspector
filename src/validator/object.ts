import { Validator } from '.';
import type { ObjectLike, PropertyValidators } from '../types';

/**
 * Validator for object based values. Each property has to match its specified validator
 *
 * @since 1.0.0
 * @export
 * @class ObjectValidator
 * @extends {Validator<V>}
 * @template V
 */
export class ObjectValidator<V extends ObjectLike> extends Validator<V> {
  constructor(
    private readonly _propertyValidators: PropertyValidators<V>
  ) {
    super();
  }

  /**
   * reject objects that contain more keys than have been validated
   * USE FOR POJOs ONLY!. Getter/Setter/Methods will lead to false negative results
   *
   * @readonly
   * @type {this}
   * @memberof ObjectValidator
   */
  public get noOverload(): this {
    return this.setupCondition(value_ => this.checkOverload(value_));
  }

  protected validateBaseType(value_: unknown): V {
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
