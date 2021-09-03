import { ValidationError, VALIDATION_ERROR_MARKER } from '../error';
import { CustomValidation, Validatable } from '../types';

export abstract class Validator<TValue> implements Validatable<TValue> {
  private _validationError: ValidationError | undefined;
  private _customValidation: CustomValidation<TValue> | undefined;
  private _customErrorMessage: string | undefined | (() => string);

  /**
   * set if validation has failed
   *
   * @readonly
   * @type {(ValidationError | undefined)}
   * @memberof Validator
   */
  public get validationError(): ValidationError | undefined { return this._validationError; }

  /**
   * add a custom validation; return a error message if validation fails
   *
   * @param {CustomValidation<TValue>} evaluation_
   * @return {*}  {this}
   * @memberof Validator
   */
  public custom(evaluation_: CustomValidation<TValue>): this {
    this._customValidation = evaluation_;
    return this;
  }

  /**
   * custom error message (overrides all hard coded messages)
   *
   * @param {(string | (() => string))} message_
   * @return {*}  {this}
   * @memberof Validator
   */
  public error(message_: string | (() => string)): this {
    this._customErrorMessage = message_;
    return this;
  }

  /**
   * validate value
   *
   * @throws {ValidationError} if validation fails
   * @param {unknown} value_
   * @return {*}  {TValue} returns validated value with asserted type (same reference)
   * @memberof Validator
   */
  public validate(value_: unknown): TValue {
    const value = this.validateValue(value_);
    const customEvaluationResult = this._customValidation?.(value);

    if (customEvaluationResult !== undefined) {
      this.throwValidationError(customEvaluationResult);
    }

    return value;
  }

  /**
   * validate value
   *
   * @param {unknown} value_
   * @return {*}  {value_ is TValue} true if valid; false if invalid; this is a type predicate - asserted type will be associated to value if true
   * @memberof Validator
   */
  public isValid(value_: unknown): value_ is TValue {
    try {
      this.validate(value_);
      return true;
    } catch {
      return false;
    }
  }

  protected abstract validateValue(value_: unknown): TValue;

  protected detectError(reason_: unknown, propertyTraces_?: PropertyKey[]): Error {
    if (this.isValidationError(reason_)) {
      if (reason_.propertyTrace && propertyTraces_) {
        propertyTraces_.push(...reason_.propertyTrace);
      }
      return reason_;
    } else if (reason_ instanceof Error) {
      return reason_;
    } else if (this.hasMessage(reason_) && typeof reason_.message === 'string' && reason_.message !== '') {
      return  new Error(reason_.message);
    } else {
      return new Error('unknown error');
    }
  }

  protected rethrowError(reason_: unknown, trace_?: PropertyKey): never {
    const propertyTraces: PropertyKey[] = trace_ === undefined ? [] : [trace_];
    const error = this.detectError(reason_, propertyTraces);
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

    throw this._validationError = new ValidationError(errorMessage, propertyTrace_, subErrors_);
  }

  private isValidationError(reason_: unknown): reason_ is ValidationError {
    return typeof reason_ === 'object' && reason_ !== null && VALIDATION_ERROR_MARKER in reason_;
  }

  private hasMessage(value_: unknown): value_ is { message: any } {
    return typeof value_ === 'object' && value_ !== null && 'message' in value_;
  }
}
