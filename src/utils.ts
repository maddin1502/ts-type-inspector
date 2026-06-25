import type { RecordLike } from 'ts-lib-extended';

/**
 * Type guard for non-null object values.
 * Note: arrays are objects too and therefore pass this check.
 *
 * @export
 * @template {object} [T=RecordLike]
 * @param {unknown} value_
 * @returns {value_ is T}
 * @since 4.0.0
 */
export function isObject<T extends object = RecordLike>(
  value_: unknown
): value_ is T {
  return typeof value_ === 'object' && value_ !== null;
}
