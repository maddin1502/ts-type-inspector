import { Validator } from '.';
import type { Validatable } from '../types';

export type BooleanValidatable = Validatable<boolean> & {
  /**
   * accept just true
   *
   * @since 1.0.0
   */
  get true(): BooleanValidatable;
  /**
   * accept just false
   *
   * @since 1.0.0
   */
  get false(): BooleanValidatable;
};

/**
 * Validator for boolean values
 *
 * @since 1.0.0
 * @export
 * @class BooleanValidator
 * @extends {Validator<boolean>}
 * @implements {BooleanValidatable}
 */
export class BooleanValidator
  extends Validator<boolean>
  implements BooleanValidatable
{
  public get true(): BooleanValidatable {
    return this.setupCondition(value_ => this.checkTrue(value_));
  }

  public get false(): BooleanValidatable {
    return this.setupCondition(value_ => this.checkFalse(value_));
  }

  protected validateBaseType(value_: unknown): boolean {
    if (typeof value_ !== 'boolean') {
      this.throwValidationError('value is not a boolean');
    }

    return value_;
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
