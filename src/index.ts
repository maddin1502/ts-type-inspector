import { TypeInspector } from './inspector.js';

export type {
  AnyLike,
  InstanceLike,
  MethodLike,
  RecordLike
} from 'ts-lib-extended';
export {
  flattenValidationError,
  isValidationError,
  ValidationError,
  type FlatValidationError
} from './error.js';
export type * from './types.js';
export { DefaultAnyValidator, type AnyValidator } from './validator/any.js';
export {
  DefaultArrayValidator,
  type ArrayValidator
} from './validator/array.js';
export {
  DefaultBigIntValidator,
  type BigIntValidator
} from './validator/bigint.js';
export {
  DefaultBooleanValidator,
  type BooleanValidator
} from './validator/boolean.js';
export {
  DefaultCustomValidator,
  type CustomValidator
} from './validator/custom.js';
export { DefaultDateValidator, type DateValidator } from './validator/date.js';
export {
  DefaultDictionaryValidator,
  type DictionaryValidator
} from './validator/dictionary.js';
export { DefaultEnumValidator, type EnumValidator } from './validator/enum.js';
export {
  DefaultExcludeValidator,
  type ExcludeValidator
} from './validator/exclude.js';
export { DefaultValidator } from './validator/index.js';
export {
  DefaultInstanceValidator,
  type InstanceValidator
} from './validator/instance.js';
export { DefaultLazyValidator, type LazyValidator } from './validator/lazy.js';
export { DefaultMapValidator, type MapValidator } from './validator/map.js';
export {
  DefaultMethodValidator,
  type MethodValidator
} from './validator/method.js';
export { DefaultNullValidator, type NullValidator } from './validator/null.js';
export {
  DefaultNullishValidator,
  type NullishValidator
} from './validator/nullish.js';
export {
  DefaultNumberValidator,
  type NumberValidator
} from './validator/number.js';
export {
  DefaultObjectValidator,
  type ObjectValidator
} from './validator/object.js';
export {
  DefaultOptionalValidator,
  type OptionalValidator
} from './validator/optional.js';
export {
  DefaultPartialValidator,
  type PartialValidator
} from './validator/partial.js';
export { DefaultSetValidator, type SetValidator } from './validator/set.js';
export {
  DefaultStrictValidator,
  type StrictValidator
} from './validator/strict.js';
export {
  DefaultStringValidator,
  type StringValidator
} from './validator/string.js';
export {
  DefaultSymbolValidator,
  type SymbolValidator
} from './validator/symbol.js';
export {
  DefaultTupleValidator,
  type TupleValidator
} from './validator/tuple.js';
export {
  DefaultUndefinedValidator,
  DefaulUndefinedValidator,
  type UndefinedValidator
} from './validator/undefined.js';
export {
  DefaultUnionValidator,
  type UnionValidator
} from './validator/union.js';

export const ti = new TypeInspector();

export { TypeInspector };
export default ti;
