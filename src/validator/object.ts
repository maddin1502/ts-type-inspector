import { Validator } from '.';
import type { ObjectLike } from '../types';

export type PropertyValidators<TValue extends ObjectLike> = { [key in keyof TValue]-?: Validator<TValue[key]> };

/**
 * Validator for object based values. Each property has to match its specified validator
 *
 * @export
 * @class ObjectValidator
 * @extends {Validator<TValue>}
 * @template TValue
 */
export class ObjectValidator<TValue extends ObjectLike> extends Validator<TValue> {
  private _noOverload: boolean;

  constructor(
    private _propertyValidators: PropertyValidators<TValue>
  ) {
    super();
    this._noOverload = false;
  }

  /**
   * Reject objects that contain more keys than have been validated
   * USE FOR POJOs ONLY!. Getter/Setter/Methods will lead to false negative results
   *
   * @readonly
   * @type {this}
   * @memberof ObjectValidator
   */
  public get noOverload(): this {
    this._noOverload = true;
    return this;
  }

  protected validateValue(value_: unknown): TValue {
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

    if (this._noOverload) {
      for (const propertyKey in value_) {
        if (!(propertyKey in this._propertyValidators)) {
          this.throwValidationError('value is overloaded');
        }
      }
    }

    return value_;
  }

  private isObjectLike(value_: unknown): value_ is ObjectLike {
    return typeof value_ === 'object' && value_ !== null;
  }
}
