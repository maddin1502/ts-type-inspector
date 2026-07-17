import {
  castToBigint,
  castToBoolean,
  castToDate,
  castToJson,
  castToNumber,
  castToString,
  type Caster
} from '@/cast.js';
import { ValidationError, isValidationError } from '@/error.js';
import type {
  CustomValidation,
  ValidationCondition,
  ValidationErrorHandler,
  Validator
} from '@/types.js';
import type { CastFactories } from './cast-factories.js';
import type { BigIntValidator } from './bigint.js';
import type { BooleanValidator } from './boolean.js';
import type { DateValidator } from './date.js';
import type { NumberValidator } from './number.js';
import type { StringValidator } from './string.js';

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
export abstract class DefaultValidator<
  Out,
  ValidationParams = unknown
> implements Validator<Out, ValidationParams> {
  /**
   * Factories for the cast targets (asString/asNumber/...), injected once at
   * bootstrap via {@link useCastFactories}. Kept out of a static import to
   * break the base <-> subclass import cycle.
   */
  private static _castFactories: CastFactories | undefined;

  private _validationError: ValidationError | undefined;
  private _transform:
    | ((value_: unknown, params_?: ValidationParams) => unknown)
    | undefined;
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

  /**
   * Inject the {@link CastFactories} used by the cast API. Called once by the
   * inspector at bootstrap (after all validator classes are defined).
   *
   * @public
   * @static
   * @param {CastFactories} castFactories_
   * @since 4.1.0
   */
  public static useCastFactories(castFactories_: CastFactories): void {
    DefaultValidator._castFactories = castFactories_;
  }

  private get castFactories(): CastFactories {
    if (DefaultValidator._castFactories === undefined) {
      throw new Error('cast factories are not registered');
    }

    return DefaultValidator._castFactories;
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
    const baseValue =
      this._transform === undefined
        ? value_
        : this._transform(value_, params_);
    const value = this.validateBaseType(baseValue, params_);

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

  public validOrDefault(
    value_: unknown,
    params_?: ValidationParams
  ): Out | undefined {
    // return the validated value: for casting validators this is the CONVERTED
    // value, not the original input
    try {
      return this.validate(value_, params_);
    } catch {
      return undefined;
    }
  }

  public validOrFallback(
    value_: unknown,
    fallback_: Out,
    params_?: ValidationParams
  ): Out {
    return this.validOrDefault(value_, params_) ?? fallback_;
  }

  public get asString(): StringValidator {
    return this.deriveCast(this.castFactories.string(), castToString);
  }

  public get asNumber(): NumberValidator {
    return this.deriveCast(this.castFactories.number(), castToNumber);
  }

  public get asBoolean(): BooleanValidator {
    return this.deriveCast(this.castFactories.boolean(), castToBoolean);
  }

  public get asBigint(): BigIntValidator {
    return this.deriveCast(this.castFactories.bigint(), castToBigint);
  }

  public get asDate(): DateValidator {
    return this.deriveCast(this.castFactories.date(), castToDate);
  }

  public asType<T, V extends Validator<T>>(
    caster_: Caster<T, ValidationParams>,
    target_: V
  ): V;
  public asType<T>(caster_: Caster<T, ValidationParams>): Validator<T>;
  public asType<T>(
    caster_: Caster<T, ValidationParams>,
    target_?: Validator<T>
  ): Validator<T> {
    const target =
      target_ ?? (this.castFactories.passthrough() as DefaultValidator<T>);
    return this.deriveCast(this.asDefaultValidator(target), caster_);
  }

  public asJson<T, V extends Validator<T>>(target_: V): V {
    this.applyCast(
      this.asDefaultValidator(target_),
      castToJson as Caster<T, ValidationParams>
    );
    return target_;
  }

  protected abstract validateBaseType(
    value_: unknown,
    params_?: ValidationParams
  ): Out;

  protected detectError(
    reason_: unknown,
    propertyTraces_?: PropertyKey[]
  ): { error: Error; originalMessage?: string } {
    if (isValidationError(reason_)) {
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

  /**
   * Install a pre-processing transform that runs before {@link validateBaseType}.
   * Used by the cast API to feed a converted value into a follow-up validator.
   *
   * @protected
   * @param {(value_: unknown, params_?: ValidationParams) => unknown} transform_
   * @returns {this}
   * @since 4.1.0
   */
  protected setTransform(
    transform_: (value_: unknown, params_?: ValidationParams) => unknown
  ): this {
    this._transform = transform_;
    return this;
  }

  /**
   * Wire up a cast: `target_` first runs THIS validator, then the cast, before
   * applying its own validation. Returns `target_` so its concrete type stays
   * available for method chaining.
   */
  private deriveCast<T, V extends DefaultValidator<T>>(
    target_: V,
    caster_: Caster<T, ValidationParams>
  ): V {
    this.applyCast(target_, caster_);
    return target_;
  }

  private applyCast<T>(
    target_: DefaultValidator<T>,
    caster_: Caster<T, ValidationParams>
  ): void {
    target_.setTransform((value_, params_) => {
      const source = this.validate(value_, params_ as ValidationParams);

      try {
        return caster_(source, params_ as ValidationParams);
      } catch (reason_) {
        target_.rethrowError(reason_);
      }
    });
  }

  private asDefaultValidator<T>(
    validator_: Validator<T>
  ): DefaultValidator<T> {
    if (validator_ instanceof DefaultValidator) {
      return validator_ as DefaultValidator<T>;
    }

    throw new Error('cast target must be a Default* validator');
  }

  private hasMessage(value_: unknown): value_ is { message: unknown } {
    return typeof value_ === 'object' && value_ !== null && 'message' in value_;
  }
}
