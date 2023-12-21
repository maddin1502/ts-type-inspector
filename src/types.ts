import { ArrayItem, MinArray } from 'ts-lib-extended';
import { ValidationError } from './error.js';

export type ValidationParameters = Record<string, any>;
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
export type CustomValidation<V, P extends ValidationParameters = {}> = (value_: V, params_?: P) => string | undefined;
export type ValidationErrorHandler<P extends ValidationParameters = {}> = (error_: ValidationError, params_?: P) => string | void;
export interface Validatable<Out extends In, In = unknown, P extends ValidationParameters = {}> {
  /**
   * retrieve error from last validation; undefined if validation succeeded
   *
   * @type {(ValidationError | undefined)}
   * @memberof Validatable
   */
  readonly validationError: ValidationError | undefined;
  /**
   * add a custom validation; return a error message if validation fails
   *
   * @param {CustomValidation<Out, P>} validation_
   * @param {P} params_
   * @return {*}  {this}
   * @memberof Validatable
   */
  custom(validation_: CustomValidation<Out, P>, params_?: P): this;
  /**
   * Perform an action when a validation error occurs.
   * HINT: can also be used to customize the error message
   *
   * @param {ValidationErrorHandler<P>} handler_
   * @return {*}  {this}
   * @memberof Validatable
   */
  onError(handler_: ValidationErrorHandler<P>): this;
  /**
   * validate value; throws an error on failure
   *
   * @param {In} value_
   * @param {P} params_
   * @return {*}  {Out}
   * @memberof Validatable
   */
  validate(value_: In, params_?: P): Out;
  /**
   * validate value
   *
   * @param {In} value_
   * @param {P} params_
   * @return {*}  {value_ is Out} true if valid; false if invalid; this is a type predicate - asserted type will be associated to value if true
   * @memberof Validatable
   */
  isValid(value_: In, params_?: P): value_ is Out;
}
export type PropertyValidatables<V extends ObjectLike> = {
  readonly [key in keyof V]-?: Validatable<V[key]>;
};
export type PartialPropertyValidatables<V = any> = {
  readonly [key in keyof V]?: Validatable<V[key]>;
};
export type SelectPropertyValidatables<
  V extends ObjectLike,
  K extends keyof V
> = { readonly [key in K]?: Validatable<V[key]> };
export type UnionValidatables<V = any> = MinArray<Validatable<V>, 2>;
export type UnionValidatablesItem<U extends UnionValidatables> =
  ArrayItem<U> extends Validatable<infer V> ? V : never;
export type ValidationCondition<V> = (value_: V) => void | never;
export type DateLike = string | number | Date;
