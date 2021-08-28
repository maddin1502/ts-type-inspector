import { ValidationError, VALIDATION_ERROR_MARKER } from '../error';

export type CustomValidationType<TValue> = (value_: TValue) => string | undefined;

export abstract class Validator<TValue> implements ValidatorInterface<TValue> {
  private _validationError: ValidationError | undefined;
  private _customValidation: CustomValidationType<TValue> | undefined;
  private _customErrorMessage: string | undefined | (() => string);

  public get validationError(): ValidationError | undefined { return this._validationError; }

  public custom(evaluation_: CustomValidationType<TValue>): this {
    this._customValidation = evaluation_;
    return this;
  }

  public error(message_: string | (() => string)): this {
    this._customErrorMessage = message_;
    return this;
  }

  public validate(value_: unknown): TValue {
    const value = this.validateValue(value_);
    const customEvaluationResult = this._customValidation?.(value);

    if (customEvaluationResult !== undefined) {
      this.throwValidationError(customEvaluationResult);
    }

    return value;
  }

  public isValid(value_: unknown): value_ is TValue {
    try {
      this.validate(value_);
      return true;
    } catch {
      return false;
    }
  }

  protected abstract validateValue(value_: unknown): TValue;

  protected rethrowError(reason_: unknown, trace_?: PropertyKey): never {
    const propertyTraces: PropertyKey[] = trace_ === undefined ? [] : [trace_];

    let error: Error;

    if (this.isValidationError(reason_)) {
      error = reason_;

      if (reason_.propertyTrace) {
        propertyTraces.push(...reason_.propertyTrace);
      }
    } else if (reason_ instanceof Error) {
      error = reason_;
    } else if (this.hasMessage(reason_) && typeof reason_.message === 'string' && reason_.message !== '') {
      error = new Error(reason_.message);
    } else {
      message = 'unknown error';
    }

    this.throwValidationError(error.message, propertyTraces, [error]);
  }

  protected throwValidationError(
    message_: string,
    propertyTrace_?: ReadonlyArray<PropertyKey>,
    subErrors_?: ReadonlyArray<Error>
  ): never {
    let errorMessage: string;

    switch (typeof this._customErrorMessage) {
      case 'string':
        errorMessage = this._customErrorMessage;
        break;
      case 'function':
        errorMessage = this._customErrorMessage();
        break;
      default:
        errorMessage = message_;
        break;
    }

    this._validationError = new ValidationError(errorMessage, propertyTrace_, subErrors_);
    throw this._validationError;
  }

  protected isValidationError(reason_: unknown): reason_ is ValidationError {
    return typeof reason_ === 'object' && reason_ !== null && VALIDATION_ERROR_MARKER in reason_;
  }

  private hasMessage(value_: unknown): value_ is { message: any } {
    return typeof value_ === 'object' && value_ !== null && 'message' in value_;
  }
}

export interface ValidatorInterface<TValue> {
  /**
   * set if validation fails
   *
   * @type {(ValidationError | undefined)}
   * @memberof ValidatorInterface
   */
  readonly validationError: ValidationError | undefined;

  /**
   * validates value -> true if valid; false if invalid
   *
   * @param {unknown} value_
   * @return {*}  {value_ is TValue}
   * @memberof ValidatorInterface
   */
  isValid(value_: unknown): value_ is TValue;
  /**
   * validates value -> throws error if invalid
   *
   * @param {unknown} value_
   * @return {*}  {TValue}
   * @memberof ValidatorInterface
   */
  validate(value_: unknown): TValue;
  /**
   * custom validation callback; return a error message if validation fails
   *
   * @param {CustomValidationType<TValue>} validation_
   * @return {*}  {this}
   * @memberof ValidatorInterface
   */
  custom(validation_: CustomValidationType<TValue>): this;
  /**
   * custom error message (overrides all coded messages)
   *
   * @param {(string | (() => string))} message_
   * @return {*}  {this}
   * @memberof ValidatorInterface
   */
  error(message_: string | (() => string)): this;
}
