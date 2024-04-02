import type { ArrayItem, MinArray } from 'ts-lib-extended';
import type { ValidationError } from './error.js';

export type ExtendedValidationParameters = Record<string, any>;
export type NoParameters = NonNullable<unknown>;
export type ContainerExtendedValidationParameters<
  EVP extends ExtendedValidationParameters = NoParameters
> = {
  [key: string]: any;
  extendedItemValidationParameters?: EVP;
};
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
export type CustomValidation<
  V,
  EVP extends ExtendedValidationParameters = NoParameters
> = (value_: V, params_?: EVP) => string | undefined;
export type ValidationErrorHandler<
  EVP extends ExtendedValidationParameters = NoParameters
> = (error_: ValidationError, params_?: EVP) => string | void;
export interface Validator<
  Out,
  EVP extends ExtendedValidationParameters = NoParameters
> {
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
   * @param {CustomValidation<Out, EVP>} validation_
   * @param {?EVP} [params_]
   * @returns {this}
   */
  custom(validation_: CustomValidation<Out, EVP>, params_?: EVP): this;
  /**
   * Perform an action when a validation error occurs.
   * HINT: can also be used to customize the error message
   *
   * @param {ValidationErrorHandler<EVP>} handler_
   * @returns {this}
   */
  onError(handler_: ValidationErrorHandler<EVP>): this;
  /**
   * validate value; throws an error on failure
   *
   * @param {unknown} value_
   * @param {?EVP} [params_]
   * @returns {Out}
   */
  validate(value_: unknown, params_?: EVP): Out;
  /**
   * validate value
   *
   * @param {unknown} value_
   * @param {?EVP} [params_]
   * @returns {value_ is Out} true if valid; false if invalid; this is a type predicate - asserted type will be associated to value if true
   */
  isValid(value_: unknown, params_?: EVP): value_ is Out;
}
export type PropertyValidatables<V extends ObjectLike> = {
  readonly [key in keyof V]-?: Validator<V[key]>;
};
export type PartialPropertyValidatables<V = any> = {
  readonly [key in keyof V]?: Validator<V[key]>;
};
export type SelectPropertyValidatables<
  V extends ObjectLike,
  K extends keyof V
> = { readonly [key in K]?: Validator<V[key]> };
export type UnionValidatables<V = any> = MinArray<Validator<V>, 2>;
export type UnionValidatablesItem<U extends UnionValidatables> =
  ArrayItem<U> extends Validator<infer V> ? V : never;
export type ValidationCondition<
  V,
  P extends ExtendedValidationParameters = NoParameters
> = (value_: V, params_?: P) => void | never;
export type DateLike = string | number | Date;
export type TupleItemValidators<A extends unknown[]> = {
  [index in keyof A]: Validator<A[index]>;
};
