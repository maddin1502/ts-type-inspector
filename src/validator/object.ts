import type { EmptyObject } from 'ts-lib-extended';
import type {
  ExtendedValidationParameters,
  ObjectLike,
  PropertyValidatables,
  Validatable
} from '../types.js';
import { Validator } from './index.js';

/**
 * Validator for object based values. Each property has to match its specified validator
 *
 * @export
 * @template {ObjectLike} Out
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @since 1.0.0
 */
export type ObjectValidatable<
  Out extends ObjectLike,
  EVP extends ExtendedValidationParameters = EmptyObject
> = Validatable<Out, EVP> & {
  /**
   * Reject objects that contain more keys than have been validated
   * USE FOR POJOs ONLY!. Getter/Setter/Methods will lead to false negative results
   *
   * @readonly
   * @type {ObjectValidatable<Out, EVP>}
   * @since 1.0.0
   */
  get noOverload(): ObjectValidatable<Out, EVP>;
};

/**
 * Validator for object based values. Each property has to match its specified validator
 *
 * @export
 * @class ObjectValidator
 * @template {ObjectLike} Out
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @extends {Validator<Out, EVP>}
 * @implements {ObjectValidatable<Out, EVP>}
 * @since 1.0.0
 */
export class ObjectValidator<
    Out extends ObjectLike,
    EVP extends ExtendedValidationParameters = EmptyObject
  >
  extends Validator<Out, EVP>
  implements ObjectValidatable<Out, EVP>
{
  constructor(private readonly _propertyValidators: PropertyValidatables<Out>) {
    super();
  }

  public get noOverload(): ObjectValidatable<Out, EVP> {
    return this.setupCondition((value_) => this.checkOverload(value_));
  }

  protected validateBaseType(value_: unknown): Out {
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
