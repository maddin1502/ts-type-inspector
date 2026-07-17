/**
 * A cast function turns an incoming `unknown` value into a concrete type `T`.
 * It MUST throw (any error) when the value cannot be cast - the surrounding
 * validator turns that throw into a regular {@link ValidationError}.
 *
 * @export
 * @template T the target type the value is cast to
 * @template [ValidationParams=unknown] extended validation parameters
 * @since 4.1.0
 */
export type Caster<T, ValidationParams = unknown> = (
  value_: unknown,
  params_?: ValidationParams
) => T;

/**
 * Cast an unknown value to `string`.
 * Accepts strings as-is and stringifies finite numbers, bigints and booleans.
 *
 * @export
 * @param {unknown} value_
 * @returns {string}
 * @since 4.1.0
 */
export function castToString(value_: unknown): string {
  switch (typeof value_) {
    case 'string':
      return value_;
    case 'number':
      if (Number.isFinite(value_)) {
        return String(value_);
      }
      break;
    case 'bigint':
    case 'boolean':
      return String(value_);
  }

  throw new Error('value cannot be cast to string');
}

/**
 * Cast an unknown value to `number`.
 * Accepts numbers as-is; parses numeric strings (non-empty, non-NaN),
 * converts bigints and maps booleans to 1/0.
 *
 * @export
 * @param {unknown} value_
 * @returns {number}
 * @since 4.1.0
 */
export function castToNumber(value_: unknown): number {
  switch (typeof value_) {
    case 'number':
      return value_;
    case 'bigint':
      return Number(value_);
    case 'boolean':
      return value_ ? 1 : 0;
    case 'string': {
      const trimmed = value_.trim();

      if (trimmed !== '') {
        const result = Number(trimmed);

        if (!Number.isNaN(result)) {
          return result;
        }
      }

      break;
    }
  }

  throw new Error('value cannot be cast to number');
}

/**
 * Cast an unknown value to `boolean`.
 * Accepts booleans as-is; maps the strings 'true'/'1'/'yes' and 'false'/'0'/'no'
 * (case-insensitive), the numbers 1/0 and the bigints 1n/0n.
 *
 * @export
 * @param {unknown} value_
 * @returns {boolean}
 * @since 4.1.0
 */
export function castToBoolean(value_: unknown): boolean {
  switch (typeof value_) {
    case 'boolean':
      return value_;
    case 'number':
      if (value_ === 1) return true;
      if (value_ === 0) return false;
      break;
    case 'bigint':
      if (value_ === 1n) return true;
      if (value_ === 0n) return false;
      break;
    case 'string': {
      const normalized = value_.trim().toLowerCase();

      if (normalized === 'true' || normalized === '1' || normalized === 'yes') {
        return true;
      }

      if (
        normalized === 'false' ||
        normalized === '0' ||
        normalized === 'no'
      ) {
        return false;
      }

      break;
    }
  }

  throw new Error('value cannot be cast to boolean');
}

/**
 * Cast an unknown value to `bigint`.
 * Accepts bigints as-is; converts integer numbers, parses integer strings and
 * maps booleans to 1n/0n.
 *
 * @export
 * @param {unknown} value_
 * @returns {bigint}
 * @since 4.1.0
 */
export function castToBigint(value_: unknown): bigint {
  switch (typeof value_) {
    case 'bigint':
      return value_;
    case 'number':
      if (Number.isInteger(value_)) {
        return BigInt(value_);
      }
      break;
    case 'boolean':
      return value_ ? 1n : 0n;
    case 'string': {
      const trimmed = value_.trim();

      if (trimmed !== '') {
        try {
          return BigInt(trimmed);
        } catch {
          // fall through to the shared error below
        }
      }

      break;
    }
  }

  throw new Error('value cannot be cast to bigint');
}

/**
 * Cast an unknown value to a (valid) `Date`.
 * Accepts valid Date instances as-is and builds a Date from numbers (timestamp)
 * and strings (parseable date). Invalid dates are rejected.
 *
 * @export
 * @param {unknown} value_
 * @returns {Date}
 * @since 4.1.0
 */
export function castToDate(value_: unknown): Date {
  if (value_ instanceof Date) {
    if (!Number.isNaN(value_.getTime())) {
      return value_;
    }
  } else if (typeof value_ === 'string' || typeof value_ === 'number') {
    const date = new Date(value_);

    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  throw new Error('value cannot be cast to date');
}

/**
 * Parse a JSON string into an unknown value. Used by `asJson` to hand the parsed
 * structure to a follow-up (container) validator.
 *
 * @export
 * @param {unknown} value_ has to be a JSON string
 * @returns {unknown}
 * @since 4.1.0
 */
export function castToJson(value_: unknown): unknown {
  if (typeof value_ !== 'string') {
    throw new Error('value is not a json string');
  }

  try {
    return JSON.parse(value_);
  } catch {
    throw new Error('value is not a valid json string');
  }
}
