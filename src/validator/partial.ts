import type { PartialPropertyValidators, Validator } from '@/types.js';
import type { InstanceLike } from 'ts-lib-extended';
import { PropertiesValidator, type PVOUT, type PVPar } from './property.js';

/**
 * Validator for object based values. This is an **UNSAFE** validator that only validates some properties and ignores others
 *
 * @export
 * @interface PartialValidator
 * @template {InstanceLike} Out
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {Validator<Out, ValidationParams>}
 * @since 2.0.0
 */
export interface PartialValidator<
  Out extends InstanceLike,
  ValidationParams = unknown
> extends Validator<Out, ValidationParams> {}

/**
 * Validator for object based values. This is an **UNSAFE** validator that only validates some properties and ignores others
 *
 * @export
 * @class DefaultPartialValidator
 * @template {InstanceLike} Out
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {DefaultValidator<Out, ValidationParams>}
 * @implements {PartialValidator<Out, ValidationParams>}
 * @since 2.0.0
 */
export class DefaultPartialValidator<PV extends PartialPropertyValidators<any>>
  extends PropertiesValidator<PV>
  implements PartialValidator<PVOUT<PV>, PVPar<PV>>
{
  protected validateBaseType(value_: unknown, params_?: PVPar<PV>): PVOUT<PV> {
    if (!this.isObjectLike(value_)) {
      this.throwValidationError('value is not an object');
    }

    for (const validatorKey in this._propertyValidators) {
      try {
        const propertyValidator = this._propertyValidators[validatorKey];

        if (propertyValidator) {
          this.validateNested(value_[validatorKey], propertyValidator, params_);
        }
      } catch (reason_) {
        this.rethrowError(reason_, validatorKey);
      }
    }

    return value_;
  }

  private isObjectLike(value_: unknown): value_ is PVOUT<PV> {
    return typeof value_ === 'object' && value_ !== null;
  }
}
