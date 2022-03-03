import type { Dictionary, DictionaryValue } from 'ts-lib-extended';
import type {
  ArrayItemValidator,
  ArrayItemValidatorArray, MethodLike,
  ObjectLike,
  PropertyValidators,
  StrictValues,
  StrictValuesItem,
  UnitedValidators,
  UnitedValidatorsItem,
  Validatable
} from './types';
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
import { UnionValidator } from './validator/union';

export class TypedValueApprover {
  /**
   * Validate string values.
   * EMPTY STRINGS ARE REJECTED BY DEFAULT! Use "allowEmpty()" to allow emptry strings
   *
   * @since 1.0.0
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
   * @since 1.0.0
   * @readonly
   * @type {NumberValidator}
   * @memberof TypedValueApprover
   */
  public get number(): NumberValidator { return new NumberValidator(); }

  /**
   * Validate boolean values
   *
   * @since 1.0.0
   * @readonly
   * @type {BooleanValidator}
   * @memberof TypedValueApprover
   */
  public get boolean(): BooleanValidator { return new BooleanValidator(); }

  /**
   * Validate method-like values.
   * Unfortunately (for technical reasons), this validator can only validate the number of parameters.
   *
   * @since 1.0.0
   * @template V
   * @return {*}  {MethodValidator<V>}
   * @memberof TypedValueApprover
   */
  public method<V extends MethodLike>(): MethodValidator<V> {
    return new MethodValidator<V>();
  }

  /**
   * Validate data values
   *
   * @since 1.0.0
   * @readonly
   * @type {DateValidator}
   * @memberof TypedValueApprover
   */
  public get date(): DateValidator { return new DateValidator(); }

  /**
   * Validate undefined values... The value has to be undefined to match this validator
   *
   * @since 1.0.0
   * @readonly
   * @type {UndefinedValidator}
   * @memberof TypedValueApprover
   */
  public get undefined(): UndefinedValidator { return new UndefinedValidator(); }

  /**
   * Validate values through strict equality (===). Keep in mind that objects are compared by reference
   *
   * @since 1.0.0
   * @template V
   * @template S
   * @param {...S} values_
   * @return {*}  {StrictValidator<V, S>}
   * @memberof TypedValueApprover
   */
  public strict<V extends StrictValuesItem<S>, S extends StrictValues = StrictValues<V>>(...values_: S): StrictValidator<V, S> {
    return new StrictValidator<V, S>(...values_);
  }

  /**
   * Validate array-like values
   *
   * @since 1.0.0
   * @template A
   * @template V
   * @param {V} itemValidator_
   * @return {*}  {ArrayValidator<A>}
   * @memberof TypedValueApprover
   */
  public array<A extends ArrayItemValidatorArray<V>, V extends ArrayItemValidator = ArrayItemValidator<A>>(itemValidator_: V): ArrayValidator<A> {
    return new ArrayValidator<A>(itemValidator_);
  }

  // public arrayLike<A extends ArrayLikeItemValidatorArray<V>, V extends ArrayLikeItemValidator = ArrayLikeItemValidator<A>>(itemValidator_: V): ArrayLikeValidator<A> {
  //   return new ArrayLikeValidator<A>(itemValidator_);
  // }

  /**
   * Validate union types like "string | number" or optional properties.
   * At least one validator have to match for a positive result
   *
   * @since 1.0.0
   * @template V
   * @template U
   * @param {...U} validators_
   * @return {*}  {UnionValidator<V>}
   * @memberof TypedValueApprover
   */
  public union<V extends UnitedValidatorsItem<U>, U extends UnitedValidators = UnitedValidators<V>>(
    ...validators_: U
  ): UnionValidator<V> {
    return new UnionValidator<V, U>(...validators_);
  }

  /**
   * Validate object based values. Each property has to match its specified validator
   *
   * @since 1.0.0
   * @template V
   * @param {PropertyValidators<V>} propertyValidators_
   * @return {*}  {ObjectValidator<V>}
   * @memberof TypedValueApprover
   */
  public object<V extends ObjectLike>(propertyValidators_: PropertyValidators<V>): ObjectValidator<V> {
    return new ObjectValidator<V>(propertyValidators_);
  }

  /**
   * Validate dictionary values.
   *
   * @since 1.0.0
   * @template V
   * @param {Validatable<DictionaryValue<V>>} itemValidator_
   * @return {*}  {DictionaryValidator<V>}
   * @memberof TypedValueApprover
   */
  public dictionary<V extends Dictionary>(itemValidator_: Validatable<DictionaryValue<V>>): DictionaryValidator<V> {
    return new DictionaryValidator<V>(itemValidator_);
  }

  /**
   * USE THIS FOR ANY TYPES ONLY !!!!
   * Actually this validator does not validate.
   *
   * @since 1.0.0
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
   * @since 1.0.0
   * @template V
   * @param {Validatable<V>} validator_
   * @return {*}  {OptionalValidator<V>}
   * @memberof TypedValueApprover
   */
  public optional<V>(validator_: Validatable<V>): OptionalValidator<V> {
    return new OptionalValidator(validator_);
  }
}


const xyz: TypedValueApprover = null as any;

const affe = xyz.array(xyz.string).validate(null)
