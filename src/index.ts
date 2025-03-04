import { TypeInspector } from './inspector.js';

export type { AnyLike, InstanceLike, MethodLike } from 'ts-lib-extended';
export { isValidationError, ValidationError } from './error.js';
export type * from './types.js';
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

// type TEST = {
//   affe: string;
//   tiger: string;
// };

// class MeinTest extends DefaultObjectValidator<TEST, { flag: boolean }> {}
// class MeinNestedTest extends DefaultStringValidator<boolean> {}

// const xxx = new MeinTest({
//   tiger: ti.nested(new MeinNestedTest(), (params_) => params_?.flag),
//   affe: ti.string
// });

// const zzz = ti.object({
//   affe: ti.string,
//   tiger: ti.nested<string, unknown>(
//     new MeinNestedTest(),
//     (params_) => params_?.flag
//   )
// });

// const xpAffe = xxx.prop('affe');
// const xpTiger = xxx.prop('tiger');
// const zpAffe = zzz.prop('affe');
// const zpTiger = zzz.prop('tiger');

// function xxxxx<T extends InstanceLike>(): <
//   PV extends PropertyValidators<T, { flag: boolean }>
// >(
//   ov_: PV
// ) => PV {
//   return null as any;
// }

// const fkodfkp = xxxxx<TEST>()({
//   affe: ti.string,
//   tiger: ti.nested(new MeinNestedTest(), (pp_) => pp_?.flag)
// });

// function yyyyy<T extends InstanceLike, P = unknown>(): <
//   PV extends PropertyValidators<T, P>
// >(
//   ov_: PV
// ) => PV {
//   return null as any;
// }

// const joijoijopjop = yyyyy<TEST, { flag: boolean }>()({
//   affe: ti.string,
//   tiger: ti.nested(new MeinNestedTest(), (pp_) => pp_?.flag)
// });

// function zzzzz<PV extends PropertyValidators<any, unknown>>(): (pv_: PV) => PV {
//   return null as any;
// }

// const ljuiufdrztjz = zzzzz()({
//   affe: ti.string,
//   tiger: ti.nested(new MeinNestedTest(), (pp_) => pp_?.flag)
// } as const);

// ljuiufdrztjz.affe;
