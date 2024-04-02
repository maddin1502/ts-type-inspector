import type {
  ContainerExtendedValidationParameters,
  ExtendedValidationParameters,
  NoParameters,
  ObjectLike,
  PropertyValidatables,
  Validator
} from '../types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for object based values. Each property has to match its specified validator
 *
 * @export
 * @interface ObjectValidator
 * @template {ObjectLike} Out
 * @template {ExtendedValidationParameters} [EVP=NoParameters]
 * @template {ContainerExtendedValidationParameters<EVP>} [CEVP=ContainerExtendedValidationParameters<EVP>]
 * @extends {Validator<Out, EVP>}
 * @since 1.0.0
 */
export interface ObjectValidator<
  Out extends ObjectLike,
  EVP extends ExtendedValidationParameters = NoParameters,
  CEVP extends ContainerExtendedValidationParameters<EVP> = ContainerExtendedValidationParameters<EVP>
> extends Validator<Out, CEVP> {
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
 * @template {ObjectLike} Out
 * @template {ExtendedValidationParameters} [EVP=NoParameters]
 * @template {ContainerExtendedValidationParameters<EVP>} [CEVP=ContainerExtendedValidationParameters<EVP>]
 * @extends {DefaultValidator<Out, EVP>}
 * @implements {ObjectValidator<Out, EVP>}
 * @since 1.0.0
 */
export class DefaultObjectValidator<
    Out extends ObjectLike,
    EVP extends ExtendedValidationParameters = NoParameters,
    CEVP extends ContainerExtendedValidationParameters<EVP> = ContainerExtendedValidationParameters<EVP>
  >
  extends DefaultValidator<Out, CEVP>
  implements ObjectValidator<Out, EVP, CEVP>
{
  constructor(private readonly _propertyValidators: PropertyValidatables<Out>) {
    super();
  }

  public get noOverload(): this {
    return this.setupCondition((value_) => this.checkOverload(value_));
  }

  protected validateBaseType(value_: unknown, params_?: CEVP): Out {
    if (!this.isObjectLike(value_)) {
      this.throwValidationError('value is not an object');
    }

    for (const validatorKey in this._propertyValidators) {
      try {
        // keep optional parameters in mind! The value must be validated even if it is undefined
        this._propertyValidators[validatorKey].validate(
          value_[validatorKey],
          params_?.extendedItemValidationParameters
        );
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
