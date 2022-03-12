import type { Dictionary, DictionaryValue, Enumerable, EnumerableBase, EnumerableValue } from 'ts-lib-extended';
import type {
  ArrayItemValidator,
  ArrayItemValidatorArray,
  CustomValidation,
  MethodLike,
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
import { CustomValidator } from './validator/custom';
import { DateValidator } from './validator/date';
import { DictionaryValidator } from './validator/dictionary';
import { EnumValidator } from './validator/enum';
import { MethodValidator } from './validator/method';
import { NullValidator } from './validator/null';
import { NullishValidator } from './validator/nullish';
import { NumberValidator } from './validator/number';
import { ObjectValidator } from './validator/object';
import { OptionalValidator } from './validator/optional';
import { StrictValidator } from './validator/strict';
import { StringValidator } from './validator/string';
import { UndefinedValidator } from './validator/undefined';
import { UnionValidator } from './validator/union';

/**
 * Collection of gadgets for type inspection
 *
 * @export
 * @class TypeInspector
 */
export class TypeInspector {
  /**
   * Validate string values.
   *
   * @since 1.0.0
   * @readonly
   * @type {StringValidator}
   * @memberof TypeInspector
   */
  public get string(): StringValidator { return new StringValidator(); }

  /**
   * Validate numeric values.
   *
   * @since 1.0.0
   * @readonly
   * @type {NumberValidator}
   * @memberof TypeInspector
   */
  public get number(): NumberValidator { return new NumberValidator(); }

  /**
   * Validate boolean values.
   *
   * @since 1.0.0
   * @readonly
   * @type {BooleanValidator}
   * @memberof TypeInspector
   */
  public get boolean(): BooleanValidator { return new BooleanValidator(); }

  /**
   * Validate method-like values.
   * Unfortunately (for technical reasons), this validator can only validate the number of parameters.
   *
   * @since 1.0.0
   * @readonly
   * @type {MethodValidator<MethodLike>}
   * @memberof TypeInspector
   */
  public get method(): MethodValidator<MethodLike> {
    return new MethodValidator<MethodLike>();
  }

  /**
   * Validate data values.
   *
   * @since 1.0.0
   * @readonly
   * @type {DateValidator}
   * @memberof TypeInspector
   */
  public get date(): DateValidator { return new DateValidator(); }

  /**
   * Validate undefined values... The value has to be undefined to match this validator
   *
   * @since 1.0.0
   * @readonly
   * @type {UndefinedValidator}
   * @memberof TypeInspector
   */
  public get undefined(): UndefinedValidator { return new UndefinedValidator(); }

  /**
   * Validate null values... The value has to be null to match this validator
   *
   * @since 1.0.0
   * @readonly
   * @type {NullValidator}
   * @memberof TypeInspector
   */
  public get null(): NullValidator { return new NullValidator(); }

  /**
   * Validate nullish values
   *
   * @readonly
   * @type {NullishValidator}
   * @memberof TypeInspector
   */
  public get nullish(): NullishValidator { return new NullishValidator(); }

  /**
   * Validate values through strict equality (===). Keep in mind that objects are compared by reference
   *
   * @since 1.0.0
   * @template V
   * @template S
   * @param {...S} values_ List of values that are accepted
   * @return {*}  {StrictValidator<V, S>}
   * @memberof TypeInspector
   */
  public strict<V extends StrictValuesItem<S>, S extends StrictValues = StrictValues<V>>(...values_: S): StrictValidator<V, S> {
    return new StrictValidator<V, S>(...values_);
  }

  /**
   * Validate array values
   *
   * @since 1.0.0
   * @template A
   * @template V
   * @param {V} itemValidator_ Validator for array items
   * @return {*}  {ArrayValidator<A>}
   * @memberof TypeInspector
   */
  public array<A extends ArrayItemValidatorArray<V>, V extends ArrayItemValidator = ArrayItemValidator<A>>(itemValidator_: V): ArrayValidator<A> {
    return new ArrayValidator<A>(itemValidator_);
  }

  /**
   * Validate union types like "string | number" or optional properties.
   * At least one validator have to match for a positive result
   *
   * @since 1.0.0
   * @template V
   * @template U
   * @param {...U} validators_ Validators for each part of the union type
   * @return {*}  {UnionValidator<V>}
   * @memberof TypeInspector
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
   * @param {PropertyValidators<V>} propertyValidators_ Validators for each object property
   * @return {*}  {ObjectValidator<V>}
   * @memberof TypeInspector
   */
  public object<V extends ObjectLike>(propertyValidators_: PropertyValidators<V>): ObjectValidator<V> {
    return new ObjectValidator<V>(propertyValidators_);
  }

  /**
   * Validate dictionary values.
   *
   * @since 1.0.0
   * @template V
   * @param {Validatable<DictionaryValue<V>>} itemValidator_ Validator for dictionary values
   * @return {*}  {DictionaryValidator<V>}
   * @memberof TypeInspector
   */
  public dictionary<V extends Dictionary>(itemValidator_: Validatable<DictionaryValue<V>>): DictionaryValidator<V> {
    return new DictionaryValidator<V>(itemValidator_);
  }

  /**
   * This validator should only be used when a value is indeterminate or when you want to bypass deep validation of an object
   *
   * @since 1.0.0
   * @readonly
   * @type {AnyValidator}
   * @memberof TypeInspector
   */
  public get any(): AnyValidator {
    return new AnyValidator();
  }

  /**
   * Validate for optional properties/values
   *
   * @since 1.0.0
   * @template V
   * @param {Validatable<V>} validator_ Validator for the non-optional part
   * @return {*}  {OptionalValidator<V>}
   * @memberof TypeInspector
   */
  public optional<V>(validator_: Validatable<V>): OptionalValidator<V> {
    return new OptionalValidator(validator_);
  }

  /**
   * Validate with custom validation
   *
   * @since 1.0.0
   * @template V
   * @param {CustomValidation<unknown>} validationCallback_ Return an error message if validation fails; else undefined
   * @return {*}  {CustomValidator<V>}
   * @memberof TypeInspector
   */
  public custom<V>(validationCallback_: CustomValidation<unknown>): CustomValidator<V> {
    return new CustomValidator(validationCallback_);
  }

  /**
   * Validate enum values
   *
   * @since 1.0.0
   * @template E
   * @param {E} enum_
   * @param {Validatable<EnumerableBase<E>>} [validator_] validator for additional base type validation
   * @return {*}  {EnumValidator<E>}
   * @memberof TypeInspector
   */
  public enum<E extends Enumerable<unknown>>(
    enum_: E,
    validator_?: Validatable<EnumerableBase<EnumerableValue<E>>>
  ): EnumValidator<E> {
    return new EnumValidator(enum_, validator_);
  }
}
