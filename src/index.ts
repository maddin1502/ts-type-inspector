import { TypeInspector } from './inspector.js';

export { ValidationError } from './error.js';
export type {
  AnyLike,
  ContainerExtendedValidationParameters,
  CustomValidation,
  DateLike,
  ExtendedValidationParameters,
  MethodLike,
  ObjectLike,
  PartialPropertyValidatables,
  PropertyValidatables,
  SelectPropertyValidatables,
  UnionValidatables,
  UnionValidatablesItem,
  Validatable,
  ValidationCondition,
  ValidationErrorHandler
} from './types.js';
export { AnyValidator, type AnyValidatable } from './validator/any.js';
export { ArrayValidator, type ArrayValidatable } from './validator/array.js';
export {
  BooleanValidator,
  type BooleanValidatable
} from './validator/boolean.js';
export { CustomValidator, type CustomValidatable } from './validator/custom.js';
export { DateValidator, type DateValidatable } from './validator/date.js';
export {
  DictionaryValidator,
  type DictionaryValidatable
} from './validator/dictionary.js';
export { EnumValidator, type EnumValidatable } from './validator/enum.js';
export {
  ExcludeValidator,
  type ExcludeValidatable
} from './validator/exclude.js';
export { Validator } from './validator/index.js';
export { MethodValidator, type MethodValidatable } from './validator/method.js';
export { NullValidator, type NullValidatable } from './validator/null.js';
export {
  NullishValidator,
  type NullishValidatable
} from './validator/nullish.js';
export { NumberValidator, type NumberValidatable } from './validator/number.js';
export { ObjectValidator, type ObjectValidatable } from './validator/object.js';
export {
  PartialValidator,
  type PartialValidatable
} from './validator/partial.js';
export { StrictValidator, type StrictValidatable } from './validator/strict.js';
export { StringValidator, type StringValidatable } from './validator/string.js';
export {
  UndefinedValidator,
  type UndefinedValidatable
} from './validator/undefined.js';
export { UnionValidator, type UnionValidatable } from './validator/union.js';

export const ti = new TypeInspector();

export { TypeInspector };
export default ti;
