export type MethodLike = (...args_: any[]) => any;
export type ObjectLike = Record<PropertyKey, any>;
export type SizedObject<T = any> = { readonly length: T };
export type IndexedObject<T extends number> = {
  [index in T]: any;
} & SizedObject<number>;
export type AnyLike = number | string | boolean | ObjectLike | MethodLike | undefined | symbol | null;
