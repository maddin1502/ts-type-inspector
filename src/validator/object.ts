import type { ValidationError } from '@/error.js';
import type { PropertyValidators, Validator } from '@/types.js';
import { isObject } from '@/utils.js';
import type { RecordLike } from 'ts-lib-extended';
import { DefaultValidator } from './index.js';

/**
 * Validator for object based values. Each property has to match its specified validator
 *
 * @export
 * @interface ObjectValidator
 * @template {RecordLike} Out
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {Validator<Out, ValidationParams>}
 * @since 1.0.0
 */
export interface ObjectValidator<
  Out extends RecordLike,
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
 * @template {RecordLike} Out
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {DefaultValidator<Out, ValidationParams>}
 * @implements {ObjectValidator<Out, ValidationParams>}
 * @since 1.0.0
 */
export class DefaultObjectValidator<
  Out extends RecordLike,
  ValidationParams = unknown
>
  extends DefaultValidator<Out, ValidationParams>
  implements ObjectValidator<Out, ValidationParams>
{
  constructor(
    private readonly _propertyValidators: PropertyValidators<
      Out,
      ValidationParams
    >
  ) {
    super();
  }

  public get noOverload(): this {
    return this.setupCondition((value_) => this.checkOverload(value_));
  }

  protected validateBaseType(value_: unknown, params_?: ValidationParams): Out {
    if (!isObject(value_)) {
      this.throwValidationError('value is not an object');
    }

    const errors: ValidationError[] = [];

    // keep optional parameters in mind! The value must be validated even if it is undefined
    for (const validatorKey in this._propertyValidators) {
      try {
        this.validateNested(
          value_[validatorKey],
          this._propertyValidators[validatorKey],
          params_
        );
      } catch (reason_) {
        if (this.aggregatesErrors) {
          errors.push(this.collectNestedError(reason_, validatorKey));
        } else {
          this.rethrowError(reason_, validatorKey);
        }
      }
    }

    if (errors.length > 0) {
      this.throwValidationError(
        'one or more properties are invalid',
        undefined,
        errors
      );
    }

    return value_;
  }

  private checkOverload(value_: RecordLike): void {
    for (const propertyKey in value_) {
      if (!(propertyKey in this._propertyValidators)) {
        this.throwValidationError('value is overloaded');
      }
    }
  }
}
