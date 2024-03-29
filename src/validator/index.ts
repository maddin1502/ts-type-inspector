import { VALIDATION_ERROR_MARKER, ValidationError } from '../error.js';
import type {
  CustomValidation,
  Validatable,
  ValidationCondition,
  ValidationErrorHandler
} from '../types.js';

export abstract class Validator<Out extends In, In = unknown>
  implements Validatable<Out, In>
{
  private _validationError: ValidationError | undefined;
  private _customValidations: CustomValidation<Out>[];
  private _errorHandlers: ValidationErrorHandler[];
  private _conditions: ValidationCondition<Out>[];

  constructor() {
    this._conditions = [];
    this._customValidations = [];
    this._errorHandlers = [];
  }

  public get validationError(): ValidationError | undefined {
    return this._validationError;
  }

  public custom(validation_: CustomValidation<Out>): this {
    this._customValidations.push(validation_);
    return this;
  }

  public onError(handler_: ValidationErrorHandler): this {
    this._errorHandlers.push(handler_);
    return this;
  }

  public validate(value_: In): Out {
    const value = this.validateBaseType(value_);

    for (let i = 0; i < this._conditions.length; i++) {
      this._conditions[i](value);
    }

    for (let i = 0; i < this._customValidations.length; i++) {
      const customValidationResult = this._customValidations[i](value);

      if (customValidationResult !== undefined) {
        this.throwValidationError(customValidationResult);
      }
    }

    this._validationError = undefined;
    return value;
  }

  public isValid(value_: In): value_ is Out {
    try {
      this.validate(value_);
      return true;
    } catch {
      return false;
    }
  }

  protected abstract validateBaseType(value_: In): Out;

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

  protected rethrowError(reason_: unknown, trace_?: PropertyKey): never {
    const propertyTraces: PropertyKey[] = trace_ === undefined ? [] : [trace_];
    const { error, originalMessage } = this.detectError(
      reason_,
      propertyTraces
    );
    this.throwValidationError(
      originalMessage ?? error.message,
      propertyTraces,
      [error]
    );
  }

  protected throwValidationError(
    message_: string,
    propertyTrace_?: ReadonlyArray<PropertyKey>,
    subErrors_?: ReadonlyArray<Error>
  ): never {
    let validationError = new ValidationError(
      message_,
      propertyTrace_,
      subErrors_
    );

    for (let i = 0; i < this._errorHandlers.length; i++) {
      const handlerMessage = this._errorHandlers[i](validationError);

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

  protected setupCondition(condition_: ValidationCondition<Out>): this {
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
