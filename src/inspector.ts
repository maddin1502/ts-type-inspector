import type { Dictionary, DictionaryValue, Enumerable } from 'ts-lib-extended';
import type {
  AnyLike,
  CustomValidation,
  MethodLike,
  ObjectLike,
  PartialPropertyValidatables,
  PropertyValidatables,
  UnionValidatables,
  Validatable
} from './types.js';
import { AnyValidator } from './validator/any.js';
import { ArrayValidator } from './validator/array.js';
import { BooleanValidator } from './validator/boolean.js';
import { CustomValidator } from './validator/custom.js';
import { DateValidator } from './validator/date.js';
import { DictionaryValidator } from './validator/dictionary.js';
import { EnumValidator } from './validator/enum.js';
import { ExcludeValidator } from './validator/exclude.js';
import { Validator } from './validator/index.js';
import { MethodValidator } from './validator/method.js';
import { NullValidator } from './validator/null.js';
import { NullishValidator } from './validator/nullish.js';
import { NumberValidator } from './validator/number.js';
import { ObjectValidator } from './validator/object.js';
import { OptionalValidator } from './validator/optional.js';
import { PartialValidator } from './validator/partial.js';
import { StrictValidator } from './validator/strict.js';
import { StringValidator } from './validator/string.js';
import { UndefinedValidator } from './validator/undefined.js';
import { UnionValidator } from './validator/union.js';

/**
 * Collection of gadgets for type inspection
 *
 * @export
 * @class TypeInspector
 * @since 1.0.0
 */
export class TypeInspector {
  /**
   * Validate string values.
   *
   * @public
   * @readonly
   * @type {StringValidator}
   * @since 1.0.0
   */
  public get string(): StringValidator {
    return new StringValidator();
  }

  /**
   * Validate numeric values.
   *
   * @public
   * @readonly
   * @type {NumberValidator}
   * @since 1.0.0
   */
  public get number(): NumberValidator {
    return new NumberValidator();
  }

  /**
   * Validate boolean values.
   *
   * @public
   * @readonly
   * @type {BooleanValidator}
   * @since 1.0.0
   */
  public get boolean(): BooleanValidator {
    return new BooleanValidator();
  }

  /**
   * Validate method-like values.
   * Unfortunately (for technical reasons), this validator can only validate the number of parameters.
   *
   * @public
   * @readonly
   * @type {MethodValidator<MethodLike>}
   * @since 1.0.0
   */
  public get method(): MethodValidator<MethodLike> {
    return new MethodValidator<MethodLike>();
  }

  /**
   * Validate data values.
   *
   * @public
   * @readonly
   * @type {DateValidator}
   * @since 1.0.0
   */
  public get date(): DateValidator {
    return new DateValidator();
  }

  /**
   * Validate undefined values... The value has to be undefined to match this validator
   *
   * @public
   * @readonly
   * @type {UndefinedValidator}
   * @since 1.0.0
   */
  public get undefined(): UndefinedValidator {
    return new UndefinedValidator();
  }

  /**
   * Validate null values... The value has to be null to match this validator
   *
   * @public
   * @readonly
   * @type {NullValidator}
   * @since 1.0.0
   */
  public get null(): NullValidator {
    return new NullValidator();
  }

  /**
   * Validate nullish values
   *
   * @public
   * @readonly
   * @type {NullishValidator}
   * @since 1.0.0
   */
  public get nullish(): NullishValidator {
    return new NullishValidator();
  }

  /**
   * Validate values through strict equality (===). Keep in mind that objects are compared by reference
   *
   * @public
   * @template {AnyLike[]} V
   * @param {...V} values_
   * @returns {StrictValidator<V>}
   * @since 1.0.0
   */
  public strict<V extends AnyLike[]>(...values_: V): StrictValidator<V> {
    return new StrictValidator<V>(...values_);
  }

  /**
   * Validate array values
   *
   * @public
   * @template Item
   * @param {Validatable<Item>} itemValidator_
   * @returns {ArrayValidator<Item>}
   * @since 1.0.0
   */
  public array<const Item>(
    itemValidator_: Validatable<Item>
  ): ArrayValidator<Item> {
    return new ArrayValidator<Item>(itemValidator_);
  }

  /**
   * Validate union types like "string | number" or optional properties.
   * At least one validator have to match for a positive result
   *
   * @public
   * @template {UnionValidatables} V
   * @param {...V} validators_ Validators for each part of the union type
   * @returns {UnionValidator<V>}
   * @since 1.0.0
   */
  public union<V extends UnionValidatables>(
    ...validators_: V
  ): UnionValidator<V> {
    return new UnionValidator<V>(...validators_);
  }

  /**
   * Validate object based values. Each property has to match its specified validator
   *
   * @public
   * @template {ObjectLike} Out
   * @param {PropertyValidatables<Out>} propertyValidators_ Validators for each object property
   * @returns {ObjectValidator<Out>}
   * @since 1.0.0
   */
  public object<Out extends ObjectLike>(
    propertyValidators_: PropertyValidatables<Out>
  ): ObjectValidator<Out> {
    return new ObjectValidator<Out>(propertyValidators_);
  }

  /**
   * Validator for object based values. This is an **UNSAFE** validator that only validates some properties and ignores others
   *
   * @public
   * @template {ObjectLike} Out
   * @param {PartialPropertyValidatables<Out>} propertyValidators_
   * @returns {PartialValidator<Out>}
   * @since 2.0.0
   */
  public partial<Out extends ObjectLike>(
    propertyValidators_: PartialPropertyValidatables<Out>
  ): PartialValidator<Out> {
    return new PartialValidator<Out>(propertyValidators_);
  }

  /**
   * Validate dictionary values.
   *
   * @public
   * @template {Dictionary} V
   * @param {Validatable<DictionaryValue<V>>} itemValidator_ Validator for dictionary values
   * @returns {DictionaryValidator<V>}
   * @since 1.0.0
   */
  public dictionary<V extends Dictionary>(
    itemValidator_: Validatable<DictionaryValue<V>>
  ): DictionaryValidator<V> {
    return new DictionaryValidator<V>(itemValidator_);
  }

  /**
   * This validator should only be used when a value is indeterminate or when you want to bypass deep validation of an object
   *
   * @public
   * @readonly
   * @type {AnyValidator}
   * @since 1.0.0
   */
  public get any(): AnyValidator {
    return new AnyValidator();
  }

  /**
   * Validate for optional properties/values
   *
   * @public
   * @template V
   * @param {Validatable<V>} validator_
   * @returns {OptionalValidator<V>}
   * @since 1.0.0
   */
  public optional<V>(validator_: Validatable<V>): OptionalValidator<V> {
    return new OptionalValidator(validator_);
  }

  /**
   * Validate with custom validation
   *
   * @public
   * @template V
   * @param {CustomValidation<unknown>} validationCallback_ Return an error message if validation fails; else undefined
   * @returns {CustomValidator<V>}
   * @since 1.0.0
   */
  public custom<V>(
    validationCallback_: CustomValidation<unknown>
  ): CustomValidator<V> {
    return new CustomValidator(validationCallback_);
  }

  /**
   * Validate enum values
   *
   * @public
   * @template {Enumerable<unknown>} E
   * @param {E} enum_ the enum instance itself, NOT a value from enum
   * @returns {EnumValidator<E>}
   * @since 1.0.2
   */
  public enum<E extends Enumerable<unknown>>(enum_: E): EnumValidator<E> {
    return new EnumValidator(enum_);
  }

  /**
   * This validator is able to validate if a type doesn't exist in a KNOWN union type.
   * The generics "Out" and "In" have to be set. "In" describes the incoming union type and "Out" the desired output type.
   * The passed validator checks whether the undesired types (= In - Out) exist in the value.
   *
   * @public
   * @template {In} Out
   * @template In
   * @param {Validator<Exclude<In, Out>>} validator_
   * @returns {ExcludeValidator<Out, In>}
   * @since 1.1.0
   */
  public exclude<Out extends In, In>(
    validator_: Validator<Exclude<In, Out>>
  ): ExcludeValidator<Out, In> {
    return new ExcludeValidator(validator_);
  }
}
