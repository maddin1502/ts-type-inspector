import type { ArrayItem, MinArray } from 'ts-lib-extended';
import type { ValidationError } from './error.js';

export type MethodLike = (...args_: any[]) => any;
export type ObjectLike = Record<PropertyKey, any>;
export type AnyLike =
  | number
  | string
  | boolean
  | ObjectLike
  | MethodLike
  | undefined
  | symbol
  | null;
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
}
export type PropertyValidators<
  V extends ObjectLike,
  ValidationParams = unknown
> = {
  readonly [key in keyof V]-?:
    | Validator<V[key]>
    | ((
        params_: ValidationParams | undefined,
        use_: <Val extends Validator<V[key]>>(
          validator_: Val
        ) => {
          with: (
            propValidationParams_?: ValidationParamsFromValidator<Val>
          ) => Val;
        }
      ) => Validator<V[key]>);
};
export type ValidationParamsFromValidator<V extends Validator<any>> =
  V extends Validator<any, infer P> ? P : never;

export type PartialPropertyValidators<V, ValidationParams = unknown> = {
  readonly [key in keyof V]?: Validator<V[key], ValidationParams>;
};
export type SelectPropertyValidators<
  V extends ObjectLike,
  K extends keyof V
> = { readonly [key in K]?: Validator<V[key]> };
export type UnionValidators<V = any> = MinArray<Validator<V>, 2>;
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
  [index in keyof A]: Validator<A[index], ValidationParams>;
};
