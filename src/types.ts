export type MethodType = (...args_: any[]) => any;
export type SizedObject<T = any> = { readonly length: T };
export type IndexedObject<T extends number> = {
  [index in T]: any;
} & SizedObject<number>;
export type BaseType = number | string | boolean | Record<PropertyKey, any> | ((...args_: any[]) => any) | undefined | symbol;
