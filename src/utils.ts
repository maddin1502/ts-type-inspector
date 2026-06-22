import type { InstanceLike } from 'ts-lib-extended';

/**
 * Type guard for non-null object values.
 * Note: arrays are objects too and therefore pass this check.
 *
 * @export
 * @template {object} [T=InstanceLike]
 * @param {unknown} value_
 * @returns {value_ is T}
 * @since 3.4.0
 */
export function isObject<T extends object = InstanceLike>(
  value_: unknown
): value_ is T {
  return typeof value_ === 'object' && value_ !== null;
}
