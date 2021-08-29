import { ValidatorInterface } from './validator';
import { AnyValidator, AnyValidatorInterface } from './validator/any';
import { ArrayValidator, ArrayValidatorInterface } from './validator/array';
import { BooleanValidator, BooleanValidatorInterface } from './validator/boolean';
import { DateValidator, DateValidatorInterface } from './validator/date';
import { DictionaryValidator, DictionaryValidatorInterface } from './validator/dictionary';
import { MethodType, MethodValidator, MethodValidatorInterface } from './validator/method';
import { NumberValidator, NumberValidatorInterface } from './validator/number';
import { ObjectValidator, ObjectValidatorInterface } from './validator/object';
import { OptionalValidator, OptionalValidatorInterface } from './validator/optional';
import { EqualsValidator, EqualsValidatorInterface, StrictValueType } from './validator/equals';
import { StringValidator, StringValidatorInterface } from './validator/string';
import { UndefinedValidator, UndefinedValidatorInterface } from './validator/undefined';
import { UnionValidator, UnionValidatorInterface, UnionValidatorsType, ValidatorsType } from './validator/union';
import { ArrayItem } from 'ts-lib-extended';

export class TypedValueApprover {
  /**
   * Validate string values.
   * EMPTY STRINGS ARE REJECTED BY DEFAULT! Use "allowEmpty()" to allow emptry strings
   *
   * @return {*}  {StringValidatorInterface}
   * @memberof TypedValueApproverInterface
   */
  public get string(): StringValidatorInterface { return new StringValidator(); }

  /**
   * Validate numeric values.
   * NaN IS REJECTED BY DEFAULT! Use "allowNaN()" to allow NaN
   * INFINITY IS REJECTED BY DEFAULT! Use "allowInfinity()" to allow INFINITY
   *
   * @return {*}  {NumberValidatorInterface}
   * @memberof TypedValueApproverInterface
   */
  public get number(): NumberValidatorInterface { return new NumberValidator(); }

  /**
   * Validate boolean values
   *
   * @return {*}  {BooleanValidatorInterface}
   * @memberof TypedValueApproverInterface
   */
  public get boolean(): BooleanValidatorInterface { return new BooleanValidator(); }

  /**
   * Validate method-like values.
   * Unfortunately (for technical reasons), this validator can only validate the number of parameters.
   *
   * @template T
   * @return {*}  {MethodValidatorInterface<T>}
   * @memberof TypedValueApproverInterface
   */
  public method<T extends MethodType>(): MethodValidatorInterface<T> {
    return new MethodValidator<T>();
  }

  /**
   * Validate data values
   *
   * @return {*}  {DateValidatorInterface}
   * @memberof TypedValueApproverInterface
   */
  public get date(): DateValidatorInterface { return new DateValidator(); }

  /**
   * Validate undefined values... The value has to be undefined to match this validator
   *
   * @return {*}  {UndefinedValidatorInterface}
   * @memberof TypedValueApproverInterface
   */
  public get undefined(): UndefinedValidatorInterface { return new UndefinedValidator(); }

  /**
   * Validate values through strict equality (===). Keep in mind that objects are compared by reference
   *
   * @template T
   * @param {T} value_ the comparison value
   * @return {*}  {StrictValidatorInterface<T>}
   * @memberof TypedValueApproverInterface
   */
  public strict<T extends StrictValueType>(value_: T): EqualsValidatorInterface<T> {
    return new EqualsValidator<T>(value_);
  }

  /**
   * Validate array-like values
   *
   * @template T
   * @param {ValidatorInterface<T>} itemValidator_ Validator, which is applied to each item
   * @return {*}  {ArrayValidatorInterface<T>}
   * @memberof TypedValueApproverInterface
   */
  public array<T extends ArrayLike<any>>(itemValidator_: ValidatorInterface<ArrayItem<T>>): ArrayValidatorInterface<T> {
    return new ArrayValidator<T>(itemValidator_);
  }

  /**
   * Validate union types like "string | number" or optional properties.
   * At least one validator have to match for a positive result
   *
   * @template T
   * @param {...UnionValidatorsType<T>} validators_ List of applicable validators
   * @return {*}  {UnionValidatorInterface<T>}
   * @memberof TypedValueApproverInterface
   */
  public union<T extends ValidatorsType>(
    ...validators_: UnionValidatorsType<T>
  ): UnionValidatorInterface<T> {
    return new UnionValidator<T>(...validators_);
  }

  /**
   * Validate object based values. Each property has to match its specified validator
   * NULL IS REJECTED BY DEFAULT! Use "allowNull()" to allow null.
   *
   * @template T
   * @param {{ [key in keyof T]-?: ValidatorInterface<T[key]> }} propertyValidators_ Property related validators
   * @return {*}  {ObjectValidatorInterface<T>}
   * @memberof TypedValueApproverInterface
   */
  public object<T extends Record<string, unknown>>(propertyValidators_: { [key in keyof T]-?: ValidatorInterface<T[key]>; }): ObjectValidatorInterface<T> {
    return new ObjectValidator(propertyValidators_);
  }

  /**
   * Validate dictionary values.
   *
   * @template T
   * @param {ValidatorInterface<T>} itemValidator_ Validator, which is applied to each dictionary-value
   * @return {*}  {DictionaryValidatorInterface<T>}
   * @memberof TypedValueApproverInterface
   */
  public dictionary<T>(itemValidator_: ValidatorInterface<T>): DictionaryValidatorInterface<T> {
    return new DictionaryValidator<T>(itemValidator_);
  }

  /**
   * USE THIS FOR ANY TYPES ONLY !!!!
   * Actually this validator does not validate.
   *
   * @return {*}  {AnyValidatorInterface}
   * @memberof TypedValueApproverInterface
   */
  public get any(): AnyValidatorInterface {
    return new AnyValidator();
  }

  /**
   * Validator for optional properties/values
   *
   * @template T
   * @param {ValidatorInterface<T>} validator_
   * @return {*}  {OptionalValidatorInterface<T>}
   * @memberof TypedValueApproverInterface
   */
  public optional<T>(validator_: ValidatorInterface<T>): OptionalValidatorInterface<T> {
    return new OptionalValidator(validator_);
  }
}
