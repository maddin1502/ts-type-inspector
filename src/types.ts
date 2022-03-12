import type { ArrayItem, MinArray } from 'ts-lib-extended';
import { ValidationError } from './error';

export type MethodLike = (...args_: any[]) => any;
export type ObjectLike = Record<PropertyKey, any>;
export type AnyLike = number | string | boolean | ObjectLike | MethodLike | undefined | symbol | null;
export type CustomValidation<V> = (value_: V) => string | undefined;
export interface Validatable<V extends I, I = unknown> {
  readonly validationError: ValidationError | undefined;

  custom(validation_: CustomValidation<V>): this;
  error(message_: string | (() => string)): this;
  validate(value_: I): V;
  isValid(value_: I): value_ is V;
}
export type PropertyValidators<V extends ObjectLike> = { readonly [key in keyof V]-?: Validatable<V[key]> };
// TODO: readonly MinArray
export type UnitedValidators<V = any> = MinArray<Validatable<V>, 2>;
export type UnitedValidatorsItem<U extends UnitedValidators>
  = ArrayItem<U> extends Validatable<infer V>
    ? V
    : never;
// TODO: or readonly MinArray?
export type StrictValues<V extends AnyLike = AnyLike> = ReadonlyArray<V>;
export type StrictValuesItem<S extends StrictValues> = ArrayItem<S>;
export type ArrayItemValidator<A extends any[] = any[]> = Validatable<ArrayItem<A>>;
export type ArrayItemValidatorArray<A extends ArrayItemValidator>
  = A extends Validatable<infer V>
    ? V[]
    : never;

export type ValidationCondition<V> = (value_: V) => void | never;
