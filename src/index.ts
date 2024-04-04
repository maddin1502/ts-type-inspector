import { TypeInspector } from './inspector.js';

export { ValidationError } from './error.js';
export type {
  AnyLike,
  ContainerValidationParameters as ContainerExtendedValidationParameters,
  CustomValidation,
  DateLike,
  MethodLike,
  ObjectLike,
  PartialPropertyValidators,
  PropertyValidators,
  SelectPropertyValidators,
  TupleItemValidators,
  UnionValidators,
  UnionValidatorsItem,
  ValidationCondition,
  ValidationErrorHandler,
  Validator
} from './types.js';
export { DefaultAnyValidator, type AnyValidator } from './validator/any.js';
export {
  DefaultArrayValidator,
  type ArrayValidator
} from './validator/array.js';
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
export {
  DefaultStrictValidator,
  type StrictValidator
} from './validator/strict.js';
export {
  DefaultStringValidator,
  type StringValidator
} from './validator/string.js';
export {
  DefaultTupleValidator,
  type TupleValidator
} from './validator/tuple.js';
export {
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
