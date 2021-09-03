import { ValidationError } from './error';

export type MethodLike = (...args_: any[]) => any;
export type ObjectLike = Record<PropertyKey, any>;
export type SizedObject<T = any> = { readonly length: T };
export type IndexedObject<T extends number> = {
  [index in T]: any;
} & SizedObject<number>;
export type AnyLike = number | string | boolean | ObjectLike | MethodLike | undefined | symbol | null;
export type CustomValidation<TValue> = (value_: TValue) => string | undefined;
export interface Validatable<TValue> {
  readonly validationError: ValidationError | undefined;

  custom(validation_: CustomValidation<TValue>): this;
  error(message_: string | (() => string)): this;
  validate(value_: unknown): TValue;
  isValid(value_: unknown): value_ is TValue;
}
export type PropertyValidators<TValue extends ObjectLike> = { [key in keyof TValue]-?: Validatable<TValue[key]> };
