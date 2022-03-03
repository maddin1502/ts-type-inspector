import { ValidationError, VALIDATION_ERROR_MARKER } from '../error';
import type { CustomValidation, Validatable, ValidationCondition } from '../types';

export abstract class Validator<V> implements Validatable<V> {
  private _validationError: ValidationError | undefined;
  private _customValidation: CustomValidation<V> | undefined;
  private _customErrorMessage: string | undefined | (() => string);
  private _conditions: ValidationCondition<V>[];

  constructor() {
    this._conditions = [];
  }

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
   * @param {CustomValidation<V>} evaluation_
   * @return {*}  {this}
   * @memberof Validator
   */
  public custom(evaluation_: CustomValidation<V>): this {
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
   * @param {unknown} value_
   * @return {*}  {V}
   * @memberof Validator
   */
  public validate(value_: unknown): V {
    const value = this.validateBaseType?.(value_) ?? value_ as V;

    for (let i = 0; i < this._conditions.length; i++) {
      this._conditions[i](value);
    }
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
   * @return {*}  {value_ is V} true if valid; false if invalid; this is a type predicate - asserted type will be associated to value if true
   * @memberof Validator
   */
  public isValid(value_: unknown): value_ is V {
    try {
      this.validate(value_);
      return true;
    } catch {
      return false;
    }
  }

  protected abstract validateBaseType(value_: unknown): V;

  protected detectError(reason_: unknown, propertyTraces_?: PropertyKey[]): Error {
    if (this.isValidationError(reason_)) {
      if (reason_.propertyTrace && propertyTraces_) {
        propertyTraces_.push(...reason_.propertyTrace);
      }
      return reason_;
    } else if (reason_ instanceof Error) {
      return reason_;
    } else if (this.hasMessage(reason_) && typeof reason_.message === 'string' && reason_.message !== '') {
      return new Error(reason_.message);
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

  protected setupCondition(condition_: ValidationCondition<V>): this {
    this._conditions.push(condition_);
    return this;
  }

  private isValidationError(reason_: unknown): reason_ is ValidationError {
    return typeof reason_ === 'object' && reason_ !== null && VALIDATION_ERROR_MARKER in reason_;
  }

  private hasMessage(value_: unknown): value_ is { message: any } {
    return typeof value_ === 'object' && value_ !== null && 'message' in value_;
  }
}
