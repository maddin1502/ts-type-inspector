import type { Dictionary, DictionaryValue, Enumerable } from 'ts-lib-extended';
import type {
  AnyLike,
  CustomValidation,
  MethodLike,
  ObjectLike,
  PartialPropertyValidators,
  PropertyValidators,
  TupleItemValidators,
  UnionValidators,
  Validator
} from './types.js';
import { DefaultAnyValidator } from './validator/any.js';
import { DefaultArrayValidator } from './validator/array.js';
import { DefaultBooleanValidator } from './validator/boolean.js';
import { DefaultCustomValidator } from './validator/custom.js';
import { DefaultDateValidator } from './validator/date.js';
import { DefaultDictionaryValidator } from './validator/dictionary.js';
import { DefaultEnumValidator } from './validator/enum.js';
import { DefaultExcludeValidator } from './validator/exclude.js';
import { DefaultValidator } from './validator/index.js';
import { DefaultMethodValidator } from './validator/method.js';
import { DefaultNullValidator } from './validator/null.js';
import { DefaultNullishValidator } from './validator/nullish.js';
import { DefaultNumberValidator } from './validator/number.js';
import { DefaultObjectValidator } from './validator/object.js';
import { DefaultOptionalValidator } from './validator/optional.js';
import { DefaultPartialValidator } from './validator/partial.js';
import { DefaultStrictValidator } from './validator/strict.js';
import { DefaultStringValidator } from './validator/string.js';
import { DefaultTupleValidator } from './validator/tuple.js';
import { DefaulUndefinedValidator } from './validator/undefined.js';
import { DefaultUnionValidator } from './validator/union.js';

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
   * @type {DefaultStringValidator}
   * @since 1.0.0
   */
  public get string(): DefaultStringValidator {
    return new DefaultStringValidator();
  }

  /**
   * Validate numeric values.
   *
   * @public
   * @readonly
   * @type {DefaultNumberValidator}
   * @since 1.0.0
   */
  public get number(): DefaultNumberValidator {
    return new DefaultNumberValidator();
  }

  /**
   * Validate boolean values.
   *
   * @public
   * @readonly
   * @type {DefaultBooleanValidator}
   * @since 1.0.0
   */
  public get boolean(): DefaultBooleanValidator {
    return new DefaultBooleanValidator();
  }

  /**
   * Validate method-like values.
   * Unfortunately (for technical reasons), this validator can only validate the number of parameters.
   *
   * @public
   * @readonly
   * @type {DefaultMethodValidator<MethodLike>}
   * @since 1.0.0
   */
  public get method(): DefaultMethodValidator<MethodLike> {
    return new DefaultMethodValidator<MethodLike>();
  }

  /**
   * Validate data values.
   *
   * @public
   * @readonly
   * @type {DefaultDateValidator}
   * @since 1.0.0
   */
  public get date(): DefaultDateValidator {
    return new DefaultDateValidator();
  }

  /**
   * Validate undefined values... The value has to be undefined to match this validator
   *
   * @public
   * @readonly
   * @type {DefaulUndefinedValidator}
   * @since 1.0.0
   */
  public get undefined(): DefaulUndefinedValidator {
    return new DefaulUndefinedValidator();
  }

  /**
   * Validate null values... The value has to be null to match this validator
   *
   * @public
   * @readonly
   * @type {DefaultNullValidator}
   * @since 1.0.0
   */
  public get null(): DefaultNullValidator {
    return new DefaultNullValidator();
  }

  /**
   * Validate nullish values
   *
   * @public
   * @readonly
   * @type {DefaultNullishValidator}
   * @since 1.0.0
   */
  public get nullish(): DefaultNullishValidator {
    return new DefaultNullishValidator();
  }

  /**
   * Validate values through strict equality (===). Keep in mind that objects are compared by reference
   *
   * @public
   * @template {AnyLike[]} V
   * @param {...V} values_
   * @returns {DefaultStrictValidator<V>}
   * @since 1.0.0
   */
  public strict<V extends AnyLike[]>(...values_: V): DefaultStrictValidator<V> {
    return new DefaultStrictValidator<V>(...values_);
  }

  /**
   * Validate array values
   *
   * @public
   * @template Item
   * @param {Validator<Item>} itemValidator_
   * @returns {DefaultArrayValidator<Item>}
   * @since 1.0.0
   */
  public array<const Item>(
    itemValidator_: Validator<Item>
  ): DefaultArrayValidator<Item> {
    return new DefaultArrayValidator<Item>(itemValidator_);
  }

  /**
   * Validate union types like "string | number" or optional properties.
   * At least one validator have to match for a positive result
   *
   * @public
   * @template {UnionValidators} V
   * @param {...V} validators_ Validators for each part of the union type
   * @returns {DefaultUnionValidator<V>}
   * @since 1.0.0
   */
  public union<V extends UnionValidators>(
    ...validators_: V
  ): DefaultUnionValidator<V> {
    return new DefaultUnionValidator<V>(...validators_);
  }

  /**
   * Validate object based values. Each property has to match its specified validator
   *
   * @public
   * @template {ObjectLike} Out
   * @param {PropertyValidators<Out>} propertyValidators_ Validators for each object property
   * @returns {DefaultObjectValidator<Out>}
   * @since 1.0.0
   */
  public object<Out extends ObjectLike>(
    propertyValidators_: PropertyValidators<Out>
  ): DefaultObjectValidator<Out> {
    return new DefaultObjectValidator<Out>(propertyValidators_);
  }

  /**
   * Validator for object based values. This is an **UNSAFE** validator that only validates some properties and ignores others
   *
   * @public
   * @template {ObjectLike} Out
   * @param {PartialPropertyValidators<Out>} propertyValidators_
   * @returns {DefaultPartialValidator<Out>}
   * @since 2.0.0
   */
  public partial<Out extends ObjectLike>(
    propertyValidators_: PartialPropertyValidators<Out>
  ): DefaultPartialValidator<Out> {
    return new DefaultPartialValidator<Out>(propertyValidators_);
  }

  /**
   * Validate dictionary values.
   *
   * @public
   * @template {Dictionary} V
   * @param {Validator<DictionaryValue<V>>} itemValidator_ Validator for dictionary values
   * @returns {DefaultDictionaryValidator<V>}
   * @since 1.0.0
   */
  public dictionary<V extends Dictionary>(
    itemValidator_: Validator<DictionaryValue<V>>
  ): DefaultDictionaryValidator<V> {
    return new DefaultDictionaryValidator<V>(itemValidator_);
  }

  /**
   * This validator should only be used when a value is indeterminate or when you want to bypass deep validation of an object
   *
   * @public
   * @readonly
   * @type {DefaultAnyValidator}
   * @since 1.0.0
   */
  public get any(): DefaultAnyValidator {
    return new DefaultAnyValidator();
  }

  /**
   * Validate for optional properties/values
   *
   * @public
   * @template V
   * @param {Validator<V>} validator_
   * @returns {DefaultOptionalValidator<V>}
   * @since 1.0.0
   */
  public optional<V>(validator_: Validator<V>): DefaultOptionalValidator<V> {
    return new DefaultOptionalValidator(validator_);
  }

  /**
   * Validate with custom validation
   *
   * @public
   * @template V
   * @param {CustomValidation<unknown>} validationCallback_ Return an error message if validation fails; else undefined
   * @returns {DefaultCustomValidator<V>}
   * @since 1.0.0
   */
  public custom<V>(
    validationCallback_: CustomValidation<unknown>
  ): DefaultCustomValidator<V> {
    return new DefaultCustomValidator(validationCallback_);
  }

  /**
   * Validate enum values
   *
   * @public
   * @template {Enumerable<unknown>} E
   * @param {E} enum_ the enum instance itself, NOT a value from enum
   * @returns {DefaultEnumValidator<E>}
   * @since 1.0.2
   */
  public enum<E extends Enumerable<unknown>>(
    enum_: E
  ): DefaultEnumValidator<E> {
    return new DefaultEnumValidator(enum_);
  }

  /**
   * This validator is able to validate if a type doesn't exist in a KNOWN union type.
   * The generics "Out" and "In" have to be set. "In" describes the incoming union type and "Out" the desired output type.
   * The passed validator checks whether the undesired types (= In - Out) exist in the value.
   *
   * @public
   * @template {In} Out
   * @template In
   * @param {DefaultValidator<Exclude<In, Out>>} validator_
   * @returns {DefaultExcludeValidator<Out, In>}
   * @since 1.1.0
   */
  public exclude<Out extends In, In>(
    validator_: DefaultValidator<Exclude<In, Out>>  // use DefaultValidator class and NOT Validator type to prevent the use of conditions
  ): DefaultExcludeValidator<Out, In> {
    return new DefaultExcludeValidator(validator_);
  }

  /**
   * Validate tuple values
   *
   * @public
   * @template {unknown[]} Out
   * @param {...TupleItemValidators<Out>} itemValidators_ ordered set of validators for each tuple item
   * @returns {DefaultTupleValidator<Out>}
   * @since 3.0.0
   */
  public tuple<Out extends unknown[]>(
    ...itemValidators_: TupleItemValidators<Out>
  ): DefaultTupleValidator<Out> {
    return new DefaultTupleValidator<Out>(...itemValidators_);
  }
}
