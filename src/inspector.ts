import type { Dictionary, DictionaryValue, Enumerable } from 'ts-lib-extended';
import type {
  AnyLike,
  CustomValidation,
  MethodLike,
  ObjectLike,
  PropertyValidatables,
  UnionValidatables,
  Validatable
} from './types.js';
import { Validator } from './validator/index.js';
import { AnyValidator } from './validator/any.js';
import { ArrayValidator } from './validator/array.js';
import { BooleanValidator } from './validator/boolean.js';
import { CustomValidator } from './validator/custom.js';
import { DateValidator } from './validator/date.js';
import { DictionaryValidator } from './validator/dictionary.js';
import { EnumValidator } from './validator/enum.js';
import { ExcludeValidator } from './validator/exclude.js';
import { MethodValidator } from './validator/method.js';
import { NullValidator } from './validator/null.js';
import { NullishValidator } from './validator/nullish.js';
import { NumberValidator } from './validator/number.js';
import { ObjectValidator } from './validator/object.js';
import { OptionalValidator } from './validator/optional.js';
import { StrictValidator } from './validator/strict.js';
import { StringValidator } from './validator/string.js';
import { UndefinedValidator } from './validator/undefined.js';
import { UnionValidator } from './validator/union.js';

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
  public get string(): StringValidator {
    return new StringValidator();
  }

  /**
   * Validate numeric values.
   *
   * @since 1.0.0
   * @readonly
   * @type {NumberValidator}
   * @memberof TypeInspector
   */
  public get number(): NumberValidator {
    return new NumberValidator();
  }

  /**
   * Validate boolean values.
   *
   * @since 1.0.0
   * @readonly
   * @type {BooleanValidator}
   * @memberof TypeInspector
   */
  public get boolean(): BooleanValidator {
    return new BooleanValidator();
  }

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
  public get date(): DateValidator {
    return new DateValidator();
  }

  /**
   * Validate undefined values... The value has to be undefined to match this validator
   *
   * @since 1.0.0
   * @readonly
   * @type {UndefinedValidator}
   * @memberof TypeInspector
   */
  public get undefined(): UndefinedValidator {
    return new UndefinedValidator();
  }

  /**
   * Validate null values... The value has to be null to match this validator
   *
   * @since 1.0.0
   * @readonly
   * @type {NullValidator}
   * @memberof TypeInspector
   */
  public get null(): NullValidator {
    return new NullValidator();
  }

  /**
   * Validate nullish values
   *
   * @readonly
   * @type {NullishValidator}
   * @memberof TypeInspector
   */
  public get nullish(): NullishValidator {
    return new NullishValidator();
  }

  /**
   * Validate values through strict equality (===). Keep in mind that objects are compared by reference
   *
   * @since 1.0.0
   * @template V
   * @param {...V} values_
   * @return {*}  {StrictValidator<V>}
   * @memberof TypeInspector
   */
  public strict<V extends AnyLike[]>(...values_: V): StrictValidator<V> {
    return new StrictValidator<V>(...values_);
  }

  /**
   * Validate array values
   *
   * @since 1.0.0
   * @template Item
   * @param {Validatable<Item>} itemValidator_
   * @return {*}  {ArrayValidator<Item>}
   * @memberof TypeInspector
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
   * @template V
   * @param {...V} validators_ Validators for each part of the union type
   * @returns {UnionValidator<V>}
   */
  public union<V extends UnionValidatables>(
    ...validators_: V
  ): UnionValidator<V> {
    return new UnionValidator<V>(...validators_);
  }

  /**
   * Validate object based values. Each property has to match its specified validator
   *
   * @since 1.0.0
   * @template Out
   * @param {PropertyValidatables<Out>} propertyValidators_ Validators for each object property
   * @return {*}  {ObjectValidator<Out>}
   * @memberof TypeInspector
   */
  public object<Out extends ObjectLike>(
    propertyValidators_: PropertyValidatables<Out>
  ): ObjectValidator<Out> {
    return new ObjectValidator<Out>(propertyValidators_);
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
  public dictionary<V extends Dictionary>(
    itemValidator_: Validatable<DictionaryValue<V>>
  ): DictionaryValidator<V> {
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
   * @public
   * @template V
   * @param {Validatable<V>} validator_ Validator for the non-optional part
   * @returns {OptionalValidator<V>}
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
  public custom<V>(
    validationCallback_: CustomValidation<unknown>
  ): CustomValidator<V> {
    return new CustomValidator(validationCallback_);
  }

  /**
   * Validate enum values
   *
   * @since 1.0.2
   * @template E
   * @param {E} enum_ the enum instance itself, NOT a value from enum
   * @return {*}  {EnumValidator<E>}
   * @memberof TypeInspector
   */
  enum<E extends Enumerable<unknown>>(enum_: E): EnumValidator<E> {
    return new EnumValidator(enum_);
  }

  /**
   * This validator is able to validate if a type doesn't exist in a KNOWN union type.
   * The generics "Out" and "In" have to be set. "In" describes the incoming union type and "Out" the desired output type.
   * The passed validator checks whether the undesired types (= In - Out) exist in the value.
   *
   * @since 1.1.0
   * @template Out
   * @template In
   * @param {Validator<Exclude<In, Out>>} validator_
   * @return {*}  {ExcludeValidator<Out, In>}
   * @memberof TypeInspector
   */
  public exclude<Out extends In, In>(
    validator_: Validator<Exclude<In, Out>>
  ): ExcludeValidator<Out, In> {
    return new ExcludeValidator(validator_);
  }

  // public intersect<In extends ObjectLike, K extends keyof In>(propertyValidators_: SelectPropertyValidators<In, K>): IntersectValidatable<In, K> {
  //   return new IntersectValidator<In, K>(propertyValidators_);
  // }
}

// const xyz = new TypeInspector();
// const affe = xyz.intersect<{a:number;b:number}, 'a'>({a:xyz.number}).validate(null);
// affe.

// function bla<T>(param: { [key in keyof T]?: undefined }): { [key in keyof typeof param]: T[key] } {
//   return null as any;
// }
// function bla<T, X extends keyof T>(param: { [key in X]: undefined }): { [key in X]: T[key] } {
//   return null as any;
// }

// const x = bla<{a:number;b:number}>({a:undefined});
// x



// type HasNames = { names: readonly string[] };
// function getNamesExactly<const T extends HasNames>(arg: T): T["names"] {
//     return arg.names;
// }
// const names = getNamesExactly({ names: ["Alice", "Bob", "Eve"] });

// const ti = new TypeInspector()
