import type {
  AnyLike,
  Constructor,
  Dictionary,
  DictionaryValue,
  Enumerable,
  MethodLike,
  RecordLike
} from 'ts-lib-extended';
import type {
  CustomValidation,
  PartialPropertyValidators,
  PropertyValidators,
  TupleItemValidators,
  UnionValidators,
  ValidationParamsMapper,
  Validator
} from './types.js';
import { DefaultAnyValidator } from './validator/any.js';
import { DefaultArrayValidator } from './validator/array.js';
import { DefaultBooleanValidator } from './validator/boolean.js';
import { DefaultCustomValidator } from './validator/custom.js';
import { DefaultDateValidator } from './validator/date.js';
import { DefaultDictionaryValidator } from './validator/dictionary.js';
import { DefaultBigIntValidator } from './validator/bigint.js';
import { DefaultEnumValidator } from './validator/enum.js';
import { DefaultExcludeValidator } from './validator/exclude.js';
import { DefaultValidator } from './validator/index.js';
import { DefaultInstanceValidator } from './validator/instance.js';
import { DefaultLazyValidator } from './validator/lazy.js';
import { DefaultMapValidator } from './validator/map.js';
import {
  DefaultNestedValidator,
  type NestedValidator
} from './validator/nested.js';
import { DefaultMethodValidator } from './validator/method.js';
import { DefaultSetValidator } from './validator/set.js';
import { DefaultSymbolValidator } from './validator/symbol.js';
import { DefaultNullValidator } from './validator/null.js';
import { DefaultNullishValidator } from './validator/nullish.js';
import { DefaultNumberValidator } from './validator/number.js';
import { DefaultObjectValidator } from './validator/object.js';
import { DefaultOptionalValidator } from './validator/optional.js';
import { DefaultPartialValidator } from './validator/partial.js';
import { DefaultStrictValidator } from './validator/strict.js';
import { DefaultStringValidator } from './validator/string.js';
import { DefaultTupleValidator } from './validator/tuple.js';
import { DefaultUndefinedValidator } from './validator/undefined.js';
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
    return new DefaultMethodValidator();
  }

  /**
   * Validate date values.
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
   * @type {DefaultUndefinedValidator}
   * @since 1.0.0
   */
  public get undefined(): DefaultUndefinedValidator {
    return new DefaultUndefinedValidator();
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
    return new DefaultStrictValidator(...values_);
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
    return new DefaultArrayValidator(itemValidator_);
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
    return new DefaultUnionValidator(...validators_);
  }

  /**
   * Validate object based values. Each property has to match its specified validator
   *
   * @public
   * @template {RecordLike} Out
   * @template {PropertyValidators<Out>} PV the concrete property validators map
   * @param {PV & PropertyValidators<Out>} propertyValidators_ Validators for each object property
   * @returns {DefaultObjectValidator<Out, unknown, PV>}
   * @since 1.0.0
   */
  public object<
    Out extends RecordLike,
    PV extends PropertyValidators<Out> = PropertyValidators<Out>
  >(
    propertyValidators_: PV & PropertyValidators<Out>
  ): DefaultObjectValidator<Out, unknown, PV> {
    return new DefaultObjectValidator(propertyValidators_);
  }

  /**
   * Validator for object based values. This is an **UNSAFE** validator that only validates some properties and ignores others
   *
   * @public
   * @template {RecordLike} Out
   * @template {PartialPropertyValidators<Out>} PV the concrete property validators map
   * @param {PV & PartialPropertyValidators<Out>} propertyValidators_
   * @returns {DefaultPartialValidator<Out, unknown, PV>}
   * @since 2.0.0
   */
  public partial<
    Out extends RecordLike,
    PV extends PartialPropertyValidators<Out> = PartialPropertyValidators<Out>
  >(
    propertyValidators_: PV & PartialPropertyValidators<Out>
  ): DefaultPartialValidator<Out, unknown, PV> {
    return new DefaultPartialValidator(propertyValidators_);
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
    return new DefaultDictionaryValidator(itemValidator_);
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
   * @template {Enumerable} E
   * @param {E} enum_ the enum instance itself, NOT a value from enum
   * @param {boolean} [allowFlags=false] (since 3.3.0) allow flagged values
   * @returns {DefaultEnumValidator<E>}
   * @since 1.0.2
   */
  public enum<E extends Enumerable>(
    enum_: E,
    allowFlags: boolean = false
  ): DefaultEnumValidator<E> {
    return new DefaultEnumValidator(enum_, allowFlags);
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
    validator_: DefaultValidator<Exclude<In, Out>> // use DefaultValidator class and NOT Validator type to prevent the use of conditions
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
  public tuple<const Out extends unknown[]>(
    ...itemValidators_: TupleItemValidators<Out>
  ): DefaultTupleValidator<Out> {
    return new DefaultTupleValidator(itemValidators_);
  }

  /**
   * Validate bigint values.
   *
   * @public
   * @readonly
   * @type {DefaultBigIntValidator}
   * @since 4.0.0
   */
  public get bigint(): DefaultBigIntValidator {
    return new DefaultBigIntValidator();
  }

  /**
   * Validate symbol values.
   *
   * @public
   * @readonly
   * @type {DefaultSymbolValidator}
   * @since 4.0.0
   */
  public get symbol(): DefaultSymbolValidator {
    return new DefaultSymbolValidator();
  }

  /**
   * Validate class instances through the `instanceof` operator.
   *
   * @public
   * @template Out
   * @param {Constructor<Out>} constructor_ the class/constructor to check against
   * @returns {DefaultInstanceValidator<Out>}
   * @since 4.0.0
   */
  public instance<Out>(
    constructor_: Constructor<Out>
  ): DefaultInstanceValidator<Out> {
    return new DefaultInstanceValidator(constructor_);
  }

  /**
   * Validate Map values. Each key and value has to match its validator.
   *
   * @public
   * @template K
   * @template V
   * @param {Validator<K>} keyValidator_ validator for the map keys
   * @param {Validator<V>} valueValidator_ validator for the map values
   * @returns {DefaultMapValidator<K, V>}
   * @since 4.0.0
   */
  public map<K, V>(
    keyValidator_: Validator<K>,
    valueValidator_: Validator<V>
  ): DefaultMapValidator<K, V> {
    return new DefaultMapValidator(keyValidator_, valueValidator_);
  }

  /**
   * Validate Set values. Each item has to match the item validator.
   *
   * @public
   * @template V
   * @param {Validator<V>} itemValidator_ validator for the set items
   * @returns {DefaultSetValidator<V>}
   * @since 4.0.0
   */
  public set<V>(itemValidator_: Validator<V>): DefaultSetValidator<V> {
    return new DefaultSetValidator(itemValidator_);
  }

  /**
   * Resolve a validator lazily (on validation). Use this for recursive or
   * self-referential schemas where the validator has to reference itself.
   *
   * @public
   * @template Out
   * @param {() => Validator<Out>} validatorFactory_ produces the actual validator on demand
   * @returns {DefaultLazyValidator<Out>}
   * @since 4.0.0
   */
  public lazy<Out>(
    validatorFactory_: () => Validator<Out>
  ): DefaultLazyValidator<Out> {
    return new DefaultLazyValidator(validatorFactory_);
  }

  /**
   * Wrap a validator so the parent's validation params get mapped to the nested
   * validator's params. Use this to forward (and transform) validation params
   * into nested/sub validators.
   *
   * @public
   * @template Out the value type the wrapped validator produces
   * @template ChildValidationParams params the wrapped validator expects
   * @template [ParentValidationParams=unknown] params handed in by the parent validator
   * @param {Validator<Out, ChildValidationParams>} validator_ the nested validator
   * @param {ValidationParamsMapper<ChildValidationParams, ParentValidationParams>} withParams_ maps the parent params to the nested validator's params
   * @returns {NestedValidator<Out, ParentValidationParams>}
   * @since 4.0.0
   */
  public nested<Out, ChildValidationParams, ParentValidationParams = unknown>(
    validator_: Validator<Out, ChildValidationParams>,
    withParams_: ValidationParamsMapper<
      ChildValidationParams,
      ParentValidationParams
    >
  ): NestedValidator<Out, ParentValidationParams> {
    return new DefaultNestedValidator<
      Out,
      ParentValidationParams,
      ChildValidationParams
    >(validator_, withParams_);
  }
}
