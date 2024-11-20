import type { PropertyValidators, Validator } from '@/types.js';
import type { InstanceLike } from 'ts-lib-extended';
import { PropertiesValidator, type PVOUT, type PVPar } from './property.js';

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
 * @extends {DefaultValidator<Out, ValidationParams>}
 * @implements {ObjectValidator<Out, ValidationParams>}
 * @since 1.0.0
 */
export class DefaultObjectValidator<PV extends PropertyValidators<any>>
  extends PropertiesValidator<PV>
  implements Validator<PVOUT<PV>, PVPar<PV>>
{
  public get noOverload(): this {
    return this.setupCondition((value_) => this.checkOverload(value_));
  }

  protected validateBaseType(value_: unknown, params_?: PVPar<PV>): PVOUT<PV> {
    if (!this.isObjectLike(value_)) {
      this.throwValidationError('value is not an object');
    }

    // keep optional parameters in mind! The value must be validated even if it is undefined
    for (const validatorKey in this._propertyValidators) {
      try {
        this.validateNested(
          value_[validatorKey],
          this._propertyValidators[validatorKey],
          params_
        );
      } catch (reason_) {
        this.rethrowError(reason_, validatorKey);
      }
    }

    return value_;
  }

  private isObjectLike(value_: unknown): value_ is PVOUT<PV> {
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
