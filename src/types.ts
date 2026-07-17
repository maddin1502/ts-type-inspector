import type { ArrayItem, MinArray, RecordLike } from 'ts-lib-extended';
import type { Caster } from './cast.js';
import type { ValidationError } from './error.js';
import type { BigIntValidator } from './validator/bigint.js';
import type { BooleanValidator } from './validator/boolean.js';
import type { DateValidator } from './validator/date.js';
import type { NestedValidator } from './validator/nested.js';
import type { NumberValidator } from './validator/number.js';
import type { StringValidator } from './validator/string.js';

export type CustomValidation<V, ValidationParams = unknown> = (
  value_: V,
  params_?: ValidationParams
) => string | undefined;
export type ValidationErrorHandler<ValidationParams> = (
  error_: ValidationError,
  params_?: ValidationParams
) => string | void;

/**
 * A cast entry point. It can be used in two ways:
 * - directly as the standard (default) target validator, e.g. `ti.asString.length(5)`
 * - called with your OWN follow-up validator that matches the cast type, e.g.
 *   `ti.asString(mySpecialStringValidator).mySpecialCheck` - the passed
 *   validator's concrete type stays available for chaining
 *
 * @export
 * @template T the cast target type
 * @template {Validator<T>} D the standard target validator (used when not called)
 * @since 4.1.0
 */
export type CastValidator<T, D extends Validator<T>> = D & {
  <V extends Validator<T>>(validator_: V): V;
};

/**
 * The cast surface every validator exposes. A cast first validates the value
 * with the current validator, then converts (casts) the (validated) value to a
 * new type and hands it to a follow-up validator that can be chained further.
 * A failed cast produces a regular {@link ValidationError}.
 *
 * @export
 * @interface Castable
 * @template [ValidationParams=unknown] extended validation parameters
 * @since 4.1.0
 */
export interface Castable<ValidationParams = unknown> {
  /**
   * cast the (validated) value to a string and continue with a string validator.
   * Call with your own `Validator<string>` to use a custom follow-up validator.
   *
   * @readonly
   * @type {CastValidator<string, StringValidator>}
   * @since 4.1.0
   */
  get asString(): CastValidator<string, StringValidator>;
  /**
   * cast the (validated) value to a number and continue with a number validator.
   * Call with your own `Validator<number>` to use a custom follow-up validator.
   *
   * @readonly
   * @type {CastValidator<number, NumberValidator>}
   * @since 4.1.0
   */
  get asNumber(): CastValidator<number, NumberValidator>;
  /**
   * cast the (validated) value to a boolean and continue with a boolean validator.
   * Call with your own `Validator<boolean>` to use a custom follow-up validator.
   *
   * @readonly
   * @type {CastValidator<boolean, BooleanValidator>}
   * @since 4.1.0
   */
  get asBoolean(): CastValidator<boolean, BooleanValidator>;
  /**
   * cast the (validated) value to a bigint and continue with a bigint validator.
   * Call with your own `Validator<bigint>` to use a custom follow-up validator.
   *
   * @readonly
   * @type {CastValidator<bigint, BigIntValidator>}
   * @since 4.1.0
   */
  get asBigint(): CastValidator<bigint, BigIntValidator>;
  /**
   * cast the (validated) value to a Date and continue with a date validator.
   * Call with your own `Validator<Date>` to use a custom follow-up validator.
   *
   * @readonly
   * @type {CastValidator<Date, DateValidator>}
   * @since 4.1.0
   */
  get asDate(): CastValidator<Date, DateValidator>;
  /**
   * cast the (validated) value with a custom cast callback, continuing with the
   * given follow-up validator (its concrete type stays available for chaining)
   *
   * @template T the cast target type
   * @template {Validator<T>} V the follow-up validator
   * @param {Caster<T, ValidationParams>} caster_ turns the value into `T` (throws on failure)
   * @param {V} target_ validator applied to the cast value
   * @returns {V}
   * @since 4.1.0
   */
  asType<T, V extends Validator<T>>(
    caster_: Caster<T, ValidationParams>,
    target_: V
  ): V;
  /**
   * cast the (validated) value with a custom cast callback
   *
   * @template T the cast target type
   * @param {Caster<T, ValidationParams>} caster_ turns the value into `T` (throws on failure)
   * @returns {Validator<T>}
   * @since 4.1.0
   */
  asType<T>(caster_: Caster<T, ValidationParams>): Validator<T>;
  /**
   * parse the (validated) value as a JSON string, then validate the parsed
   * structure with the given follow-up validator (kept for chaining)
   *
   * @template T the parsed/validated type
   * @template {Validator<T>} V the follow-up validator
   * @param {V} target_ validator applied to the parsed value
   * @returns {V}
   * @since 4.1.0
   */
  asJson<T, V extends Validator<T>>(target_: V): V;
}

export interface Validator<Out, ValidationParams = unknown>
  extends Castable<ValidationParams> {
  /**
   * retrieve error from last validation; undefined if validation succeeded
   *
   * @readonly
   * @type {(ValidationError | undefined)}
   */
  readonly validationError: ValidationError | undefined;
  /**
   * add a custom validation; return a error message if validation fails
   *
   * @param {CustomValidation<Out, ValidationParams>} validation_
   * @param {?ValidationParams} [params_]
   * @returns {this}
   */
  custom(
    validation_: CustomValidation<Out, ValidationParams>,
    params_?: ValidationParams
  ): this;
  /**
   * Perform an action when a validation error occurs.
   * HINT: can also be used to customize the error message
   *
   * @param {ValidationErrorHandler<ValidationParams>} handler_
   * @returns {this}
   */
  onError(handler_: ValidationErrorHandler<ValidationParams>): this;
  /**
   * validate value; throws an error on failure
   *
   * @param {unknown} value_
   * @param {?ValidationParams} [params_]
   * @returns {Out}
   */
  validate(value_: unknown, params_?: ValidationParams): Out;
  /**
   * validate value
   *
   * @param {unknown} value_
   * @param {?ValidationParams} [params_]
   * @returns {value_ is Out} true if valid; false if invalid; this is a type predicate - asserted type will be associated to value if true
   */
  isValid(value_: unknown, params_?: ValidationParams): value_ is Out;
  /**
   * validate value; return the validated value (same reference) when valid, else undefined
   *
   * @param {unknown} value_
   * @param {?ValidationParams} [params_]
   * @returns {Out | undefined}
   * @since 4.0.0
   */
  validOrDefault(value_: unknown, params_?: ValidationParams): Out | undefined;
  /**
   * validate value; return the validated value (same reference) when valid, else the given fallback
   *
   * @param {unknown} value_
   * @param {Out} fallback_
   * @param {?ValidationParams} [params_]
   * @returns {Out}
   * @since 4.0.0
   */
  validOrFallback(
    value_: unknown,
    fallback_: Out,
    params_?: ValidationParams
  ): Out;
}

export type NestedValidationParams<CV extends Validator<unknown>> =
  CV extends Validator<unknown, infer P> ? P : never;
export type ValidatorOut<V extends Validator<unknown>> =
  V extends Validator<infer Out> ? Out : never;
/**
 * Maps a parent validator's params to the params a (nested) child validator
 * expects. This is the signature of the conversion callback used by `ti.nested`.
 *
 * @since 4.0.0
 */
export type ValidationParamsMapper<
  ValidationParams,
  ParentValidationParams = unknown
> = (parentParams_?: ParentValidationParams) => ValidationParams | undefined;

/**
 * A property/item validator: either a plain validator or a {@link NestedValidator}
 * (created via `ti.nested`) that forwards the parent's validation params.
 *
 * @since 4.0.0
 */
export type PropertyValidator<Out, ParentValidationParams = unknown> =
  | Validator<Out>
  | NestedValidator<Out, ParentValidationParams>;

export type PropertyValidators<
  V extends RecordLike,
  ValidationParams = unknown
> = {
  readonly [key in keyof V]-?: PropertyValidator<V[key], ValidationParams>;
};

export type PartialPropertyValidators<
  V extends RecordLike,
  ValidationParams = unknown
> = Partial<PropertyValidators<V, ValidationParams>>;
export type SelectPropertyValidators<
  V extends RecordLike,
  K extends keyof V
> = { readonly [key in K]?: Validator<V[key]> };
export type UnionValidators<V = unknown> = MinArray<Validator<V>, 2>;
export type UnionValidatorsItem<U extends UnionValidators> =
  ArrayItem<U> extends Validator<infer V> ? V : never;
export type ValidationCondition<V, ValidationParams = unknown> = (
  value_: V,
  params_?: ValidationParams
) => void | never;
export type DateLike = string | number | Date;
export type TupleItemValidators<
  A extends unknown[],
  ValidationParams = unknown
> = {
  [index in keyof A]: PropertyValidator<A[index], ValidationParams>;
};
