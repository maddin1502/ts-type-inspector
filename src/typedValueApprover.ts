import type { ArrayItem, Dictionary, DictionaryValue, MinArray } from 'ts-lib-extended';
import type { AnyLike, MethodLike, ObjectLike, PropertyValidators, Validatable } from './types';
import { AnyValidator } from './validator/any';
import { ArrayValidator } from './validator/array';
import { BooleanValidator } from './validator/boolean';
import { DateValidator } from './validator/date';
import { DictionaryValidator } from './validator/dictionary';
import { MethodValidator } from './validator/method';
import { NumberValidator } from './validator/number';
import { ObjectValidator } from './validator/object';
import { OptionalValidator } from './validator/optional';
import { StrictValidator } from './validator/strict';
import { StringValidator } from './validator/string';
import { UndefinedValidator } from './validator/undefined';
import type { ValidatorsValue } from './validator/union';
import { UnionValidator } from './validator/union';

export class TypedValueApprover {
  /**
   * Validate string values.
   * EMPTY STRINGS ARE REJECTED BY DEFAULT! Use "allowEmpty()" to allow emptry strings
   *
   * @readonly
   * @type {StringValidator}
   * @memberof TypedValueApprover
   */
  public get string(): StringValidator { return new StringValidator(); }

  /**
   * Validate numeric values.
   * NaN IS REJECTED BY DEFAULT! Use "allowNaN()" to allow NaN
   * INFINITY IS REJECTED BY DEFAULT! Use "allowInfinity()" to allow INFINITY
   *
   * @readonly
   * @type {NumberValidator}
   * @memberof TypedValueApprover
   */
  public get number(): NumberValidator { return new NumberValidator(); }

  /**
   * Validate boolean values
   *
   * @readonly
   * @type {BooleanValidator}
   * @memberof TypedValueApprover
   */
  public get boolean(): BooleanValidator { return new BooleanValidator(); }

  /**
   * Validate method-like values.
   * Unfortunately (for technical reasons), this validator can only validate the number of parameters.
   *
   * @template TValue
   * @return {*}  {MethodValidator<TValue>}
   * @memberof TypedValueApprover
   */
  public method<TValue extends MethodLike>(): MethodValidator<TValue> {
    return new MethodValidator<TValue>();
  }

  /**
   * Validate data values
   *
   * @readonly
   * @type {DateValidator}
   * @memberof TypedValueApprover
   */
  public get date(): DateValidator { return new DateValidator(); }

  /**
   * Validate undefined values... The value has to be undefined to match this validator
   *
   * @readonly
   * @type {UndefinedValidator}
   * @memberof TypedValueApprover
   */
  public get undefined(): UndefinedValidator { return new UndefinedValidator(); }

  /**
   * Validate values through strict equality (===). Keep in mind that objects are compared by reference
   *
   * @template TValue
   * @template A
   * @param {...A} values_
   * @return {*}  {StrictValidator<TValue, A>}
   * @memberof TypedValueApprover
   */
  public strict<TValue extends ArrayItem<A>, A extends MinArray<AnyLike, 1> = MinArray<TValue, 1>>(...values_: A): StrictValidator<TValue, A> {
    return new StrictValidator<TValue, A>(...values_);
  }

  /**
   * Validate array-like values
   *
   * @template TValue
   * @param {Validatable<ArrayItem<TValue>>} itemValidator_
   * @return {*}  {ArrayValidator<TValue>}
   * @memberof TypedValueApprover
   */
  public array<TValue extends ArrayLike<any>>(itemValidator_: Validatable<ArrayItem<TValue>>): ArrayValidator<TValue> {
    return new ArrayValidator<TValue>(itemValidator_);
  }

  /**
   * Validate union types like "string | number" or optional properties.
   * At least one validator have to match for a positive result
   *
   * @template TValue
   * @template A
   * @param {...A} validators_
   * @return {*}  {UnionValidator<TValue>}
   * @memberof TypedValueApprover
   */
  public union<TValue extends ValidatorsValue<A>, A extends MinArray<Validatable<any>, 2> = MinArray<Validatable<TValue>, 2>>(
    ...validators_: A
  ): UnionValidator<TValue> {
    return new UnionValidator<TValue, A>(...validators_);
  }

  /**
   * Validate object based values. Each property has to match its specified validator
   *
   * @template TValue
   * @param {PropertyValidators<TValue>} propertyValidators_
   * @return {*}  {ObjectValidator<TValue>}
   * @memberof TypedValueApprover
   */
  public object<TValue extends ObjectLike>(propertyValidators_: PropertyValidators<TValue>): ObjectValidator<TValue> {
    return new ObjectValidator<TValue>(propertyValidators_);
  }

  /**
   * Validate dictionary values.
   *
   * @template TValue
   * @param {Validatable<DictionaryValue<TValue>>} itemValidator_
   * @return {*}  {DictionaryValidator<TValue>}
   * @memberof TypedValueApprover
   */
  public dictionary<TValue extends Dictionary>(itemValidator_: Validatable<DictionaryValue<TValue>>): DictionaryValidator<TValue> {
    return new DictionaryValidator<TValue>(itemValidator_);
  }

  /**
   * USE THIS FOR ANY TYPES ONLY !!!!
   * Actually this validator does not validate.
   *
   * @readonly
   * @type {AnyValidator}
   * @memberof TypedValueApprover
   */
  public get any(): AnyValidator {
    return new AnyValidator();
  }

  /**
   * Validator for optional properties/values
   *
   * @template TValue
   * @param {Validatable<TValue>} validator_
   * @return {*}  {OptionalValidator<TValue>}
   * @memberof TypedValueApprover
   */
  public optional<TValue>(validator_: Validatable<TValue>): OptionalValidator<TValue> {
    return new OptionalValidator(validator_);
  }
}
