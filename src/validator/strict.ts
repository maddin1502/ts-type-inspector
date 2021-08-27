import { Validator, ValidatorInterface } from '.';
import { MethodType } from './method';

export type StrictValueType = string | number | boolean | object | MethodType | undefined | null;

export class StrictValidator<TValue extends StrictValueType>
  extends Validator<TValue>
  implements StrictValidatorInterface<TValue>
{
  constructor(
    private _strictValue: TValue
  ) {
    super();
  }

  protected validateValue(value_: unknown): TValue {
    if (value_ !== this._strictValue) {
      this.throwValidationError(`value does not strictly equal '${this._strictValue}'`);
    }

    return value_ as TValue;
  }
}

/**
 * Validator for precisely defined values (not just of specific type)
 *
 * @export
 * @interface StrictValidatorInterface
 * @extends {ValidatorInterface<TValue>}
 * @template TValue
 */
export interface StrictValidatorInterface<TValue extends StrictValueType> extends ValidatorInterface<TValue> {}
