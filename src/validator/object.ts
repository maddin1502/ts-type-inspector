import { Validator, ValidatorInterface } from '.';

export type PropertyValidatorsType<TValue extends object> = { [key in keyof TValue]-?: ValidatorInterface<TValue[key]> };

export class ObjectValidator<TValue extends object>
  extends Validator<TValue>
  implements ObjectValidatorInterface<TValue>
{
  private _allowNull: boolean;
  private _noOverload: boolean;

  constructor(
    private _propertyValidators: PropertyValidatorsType<TValue>
  ) {
    super();
    this._allowNull = false;
    this._noOverload = false;
  }

  public allowNull(): this {
    this._allowNull = true;
    return this;
  }

  public noOverload(): this {
    this._noOverload = true;
    return this;
  }

  protected validateValue(value_: unknown): TValue {
    if (typeof value_ !== 'object') {
      this.throwValidationError('value is not an object');
    }

    if (value_ !== null) {
      const propertyKeys = Object.keys(this._propertyValidators) as (keyof PropertyValidatorsType<TValue>)[];

      for (let i = 0; i < propertyKeys.length; i++) {
        const propertyKey = propertyKeys[i];
        const validator = this._propertyValidators[propertyKey];

        try {
          // keep optional parameters in mind! The value must be validated even if it is undefined
          validator.validate((value_ as any)[propertyKey]);
        } catch (error_) {
          this.rethrowError(error_, propertyKey);
        }
      }
    }

    if (!this._allowNull && value_ === null) {
      this.throwValidationError('value is null');
    }

    if (value_ !== null && this._noOverload) {
      const propertyKeys = Object.keys(value_);

      for (let i = 0; i < propertyKeys.length; i++) {
        const propertyKey = propertyKeys[i];

        if (!(propertyKey in this._propertyValidators)) {
          this.throwValidationError('value is overloaded');
        }
      }
    }

    return value_ as TValue;
  }
}

/**
 * Validator for object based values. Each property has to match its specified validator
 * NULL IS REJECTED BY DEFAULT! Use "allowNull()" to allow null.
 *
 * @export
 * @interface ObjectValidatorInterface
 * @extends {ValidatorInterface<TValue>}
 * @template TValue
 */
export interface ObjectValidatorInterface<TValue extends object> extends ValidatorInterface<TValue> {
  /**
   * allow null
   *
   * @return {*}  {this}
   * @memberof ObjectValidatorInterface
   */
  allowNull(): this;
  /**
   * Reject objects that contain more keys than have been validated
   * USE FOR POJOs ONLY!. Getter/Setter/Methods will lead to false negative results
   *
   * @return {*}  {this}
   * @memberof ObjectValidatorInterface
   */
  noOverload(): this;
}
