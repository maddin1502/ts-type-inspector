import type { Validator } from '@/types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for boolean values
 *
 * @export
 * @interface BooleanValidator
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {Validator<boolean, ValidationParams>}
 * @since 1.0.0
 */
export interface BooleanValidator<ValidationParams = unknown>
  extends Validator<boolean, ValidationParams> {
  /**
   * accept just true
   *
   * @readonly
   * @type {this}
   * @since 1.0.0
   */
  get true(): this;
  /**
   * accept just false
   *
   * @readonly
   * @type {this}
   * @since 1.0.0
   */
  get false(): this;
}

/**
 * Validator for boolean values
 *
 * @export
 * @class DefaultBooleanValidator
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {DefaultValidator<boolean, ValidationParams>}
 * @implements {BooleanValidator<ValidationParams>}
 * @since 1.0.0
 */
export class DefaultBooleanValidator<ValidationParams = unknown>
  extends DefaultValidator<boolean, ValidationParams>
  implements BooleanValidator<ValidationParams>
{
  public get true(): this {
    return this.setupCondition((value_) => this.checkTrue(value_));
  }

  public get false(): this {
    return this.setupCondition((value_) => this.checkFalse(value_));
  }

  protected validateBaseType(
    value_: unknown,
    _params_?: ValidationParams
  ): boolean {
    if (typeof value_ === 'boolean') {
      return value_;
    }

    this.throwValidationError('value is not a boolean');
  }

  private checkTrue(value_: boolean): void {
    if (!value_) {
      this.throwValidationError('boolean is false');
    }
  }

  private checkFalse(value_: boolean): void {
    if (value_) {
      this.throwValidationError('boolean is true');
    }
  }
}
