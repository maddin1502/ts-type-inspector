import { TypeInspector } from './inspector';

export { ValidationError } from './error';
export type {
  AnyLike,
  CustomValidation,
  DateLike,
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
} from './types';
export { AnyValidator } from './validator/any.js';
export type { AnyValidatable } from './validator/any.js';
export { ArrayValidator } from './validator/array.js';
export type { ArrayValidatable } from './validator/array.js';
export { BooleanValidator } from './validator/boolean.js';
export type { BooleanValidatable } from './validator/boolean.js';
export { CustomValidator } from './validator/custom.js';
export type { CustomValidatable } from './validator/custom.js';
export { DateValidator } from './validator/date.js';
export type { DateValidatable } from './validator/date.js';
export { DictionaryValidator } from './validator/dictionary.js';
export type { DictionaryValidatable } from './validator/dictionary.js';
export { EnumValidator } from './validator/enum.js';
export type { EnumValidatable } from './validator/enum.js';
export { ExcludeValidator } from './validator/exclude.js';
export type { ExcludeValidatable } from './validator/exclude.js';
export { Validator } from './validator/index.js';
export {} from './validator/intersect.js';
export type {} from './validator/intersect.js';
export { MethodValidator } from './validator/method.js';
export type { MethodValidatable } from './validator/method.js';
export { NullValidator } from './validator/null.js';
export type { NullValidatable } from './validator/null.js';
export { NullishValidator } from './validator/nullish.js';
export type { NullishValidatable } from './validator/nullish.js';
export { NumberValidator } from './validator/number.js';
export type { NumberValidatable } from './validator/number.js';
export { ObjectValidator } from './validator/object.js';
export type { ObjectValidatable } from './validator/object.js';
export { PartialValidator } from './validator/partial.js';
export type { PartialValidatable } from './validator/partial.js';
export { StrictValidator } from './validator/strict.js';
export type { StrictValidatable } from './validator/strict.js';
export { StringValidator } from './validator/string.js';
export type { StringValidatable } from './validator/string.js';
export { UndefinedValidator } from './validator/undefined.js';
export type { UndefinedValidatable } from './validator/undefined.js';
export { UnionValidator } from './validator/union.js';
export type { UnionValidatable } from './validator/union.js';

const ti = new TypeInspector();

export { TypeInspector, ti };
export default ti;
