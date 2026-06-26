import type { ArrayItem, MinArray, RecordLike } from 'ts-lib-extended';
import type { ValidationError } from './error.js';
import type { NestedValidator } from './validator/nested.js';

export type CustomValidation<V, ValidationParams = unknown> = (
  value_: V,
  params_?: ValidationParams
) => string | undefined;
export type ValidationErrorHandler<ValidationParams> = (
  error_: ValidationError,
  params_?: ValidationParams
) => string | void;
export interface Validator<Out, ValidationParams = unknown> {
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
