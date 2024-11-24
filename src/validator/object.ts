import type { PropertyValidators, Validator } from '@/types.js';
import type { InstanceLike } from 'ts-lib-extended';
import { PropertiesValidator } from './property.js';

/**
 * Validator for object based values. Each property has to match its specified validator
 *
 * @export
 * @interface ObjectValidator
 * @template {InstanceLike} Out
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {Validator<Out, ValidationParams>}
 * @since 1.0.0
 */
export interface ObjectValidator<
  Out extends InstanceLike,
  ValidationParams = unknown
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
 * @template {InstanceLike} Out
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {PropertiesValidator<Out, ValidationParams, PropertyValidators<Out, ValidationParams>>}
 * @implements {Validator<Out, ValidationParams>}
 * @since 1.0.0
 */
export class DefaultObjectValidator<
    Out extends InstanceLike,
    ValidationParams = unknown
  >
  extends PropertiesValidator<
    Out,
    ValidationParams,
    PropertyValidators<Out, ValidationParams>
  >
  implements Validator<Out, ValidationParams>
{
  public get noOverload(): this {
    return this.setupCondition((value_) => this.checkOverload(value_));
  }

  protected validateBaseType(value_: unknown, params_?: ValidationParams): Out {
    if (!this.isObjectLike(value_)) {
      this.throwValidationError('value is not an object');
    }

    // keep optional parameters in mind! The value must be validated even if it is undefined
    for (const validatorKey in this._propertyValidators) {
      try {
        this._propertyValidators[validatorKey].validate(
          value_[validatorKey],
          params_
        );
      } catch (reason_) {
        this.rethrowError(reason_, validatorKey);
      }
    }

    return value_;
  }

  private isObjectLike(value_: unknown): value_ is InstanceLike {
    return typeof value_ === 'object' && value_ !== null;
  }

  private checkOverload(value_: InstanceLike): void {
    for (const propertyKey in value_) {
      if (!(propertyKey in this._propertyValidators)) {
        this.throwValidationError('value is overloaded');
      }
    }
  }
}
