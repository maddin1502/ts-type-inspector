import { VALIDATION_ERROR_MARKER, ValidationError } from '../error.js';
import type {
  CustomValidation,
  ValidationCondition,
  ValidationErrorHandler,
  Validator
} from '@/types.js';

/**
 * Base class of ALL validators, which contains the main validation logic that is not type-related.
 * Use this to define your very own fancy validator.
 *
 * @export
 * @abstract
 * @class DefaultValidator
 * @template Out
 * @template [ValidationParams=unknown] extended validation parameters
 * @implements {Validator<Out, ValidationParams>}
 * @since 1.0.0
 */
export abstract class DefaultValidator<Out, ValidationParams = unknown>
  implements Validator<Out, ValidationParams>
{
  private _validationError: ValidationError | undefined;
  private readonly _customValidations: CustomValidation<
    Out,
    ValidationParams
  >[];
  private readonly _errorHandlers: ValidationErrorHandler<ValidationParams>[];
  private readonly _conditions: ValidationCondition<Out, ValidationParams>[];

  constructor() {
    this._conditions = [];
    this._customValidations = [];
    this._errorHandlers = [];
  }

  public get validationError(): ValidationError | undefined {
    return this._validationError;
  }

  public custom(validation_: CustomValidation<Out, ValidationParams>): this {
    this._customValidations.push(validation_);
    return this;
  }

  public onError(handler_: ValidationErrorHandler<ValidationParams>): this {
    this._errorHandlers.push(handler_);
    return this;
  }

  public validate(value_: unknown, params_?: ValidationParams): Out {
    const value = this.validateBaseType(value_, params_);

    for (let i = 0; i < this._conditions.length; i++) {
      this._conditions[i](value, params_);
    }

    for (let i = 0; i < this._customValidations.length; i++) {
      const customValidationResult = this._customValidations[i](value, params_);

      if (customValidationResult !== undefined) {
        this.throwValidationError(
          customValidationResult,
          undefined,
          undefined,
          params_
        );
      }
    }

    this._validationError = undefined;
    return value;
  }

  public isValid(value_: unknown, params_?: ValidationParams): value_ is Out {
    try {
      this.validate(value_, params_);
      return true;
    } catch {
      return false;
    }
  }

  protected abstract validateBaseType(
    value_: unknown,
    params_?: ValidationParams
  ): Out;

  protected detectError(
    reason_: unknown,
    propertyTraces_?: PropertyKey[]
  ): { error: Error; originalMessage?: string } {
    if (this.isValidationError(reason_)) {
      if (reason_.propertyTrace && propertyTraces_) {
        propertyTraces_.push(...reason_.propertyTrace);
      }
      return { error: reason_, originalMessage: reason_.originalErrorMessage };
    } else if (reason_ instanceof Error) {
      return { error: reason_ };
    } else if (
      this.hasMessage(reason_) &&
      typeof reason_.message === 'string' &&
      reason_.message !== ''
    ) {
      return { error: new Error(reason_.message) };
    } else {
      return { error: new Error('unknown error') };
    }
  }

  protected rethrowError(
    reason_: unknown,
    trace_?: PropertyKey,
    params_?: ValidationParams
  ): never {
    const propertyTraces: PropertyKey[] = trace_ === undefined ? [] : [trace_];
    const { error, originalMessage } = this.detectError(
      reason_,
      propertyTraces
    );
    this.throwValidationError(
      originalMessage ?? error.message,
      propertyTraces,
      [error],
      params_
    );
  }

  protected throwValidationError(
    message_: string,
    propertyTrace_?: ReadonlyArray<PropertyKey>,
    subErrors_?: ReadonlyArray<Error>,
    params_?: ValidationParams
  ): never {
    let validationError = new ValidationError(
      message_,
      propertyTrace_,
      subErrors_
    );

    for (let i = 0; i < this._errorHandlers.length; i++) {
      const handlerMessage = this._errorHandlers[i](validationError, params_);

      if (handlerMessage) {
        validationError = new ValidationError(
          handlerMessage,
          propertyTrace_,
          subErrors_
        );
      }
    }

    throw (this._validationError = validationError);
  }

  protected setupCondition(
    condition_: ValidationCondition<Out, ValidationParams>
  ): this {
    this._conditions.push(condition_);
    return this;
  }

  private isValidationError(reason_: unknown): reason_ is ValidationError {
    return (
      typeof reason_ === 'object' &&
      reason_ !== null &&
      VALIDATION_ERROR_MARKER in reason_
    );
  }

  private hasMessage(value_: unknown): value_ is { message: any } {
    return typeof value_ === 'object' && value_ !== null && 'message' in value_;
  }
}
