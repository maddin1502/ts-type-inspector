import { VALIDATION_ERROR_MARKER, ValidationError } from '../error.js';
import type {
  CustomValidation,
  ExtendedValidationParameters,
  NoParameters,
  ValidationCondition,
  ValidationErrorHandler,
  Validator
} from '../types.js';

export abstract class DefaultValidator<
  Out,
  P extends ExtendedValidationParameters = NoParameters
> implements Validator<Out, P>
{
  private _validationError: ValidationError | undefined;
  private readonly _customValidations: CustomValidation<Out, P>[];
  private readonly _errorHandlers: ValidationErrorHandler<P>[];
  private readonly _conditions: ValidationCondition<Out, P>[];

  constructor() {
    this._conditions = [];
    this._customValidations = [];
    this._errorHandlers = [];
  }

  public get validationError(): ValidationError | undefined {
    return this._validationError;
  }

  public custom(validation_: CustomValidation<Out, P>): this {
    this._customValidations.push(validation_);
    return this;
  }

  public onError(handler_: ValidationErrorHandler<P>): this {
    this._errorHandlers.push(handler_);
    return this;
  }

  public validate(value_: unknown, params_?: P): Out {
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

  public isValid(value_: unknown, params_?: P): value_ is Out {
    try {
      this.validate(value_, params_);
      return true;
    } catch {
      return false;
    }
  }

  protected abstract validateBaseType(value_: unknown, params_?: P): Out;

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
    params_?: P
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
    params_?: P
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

  protected setupCondition(condition_: ValidationCondition<Out, P>): this {
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
