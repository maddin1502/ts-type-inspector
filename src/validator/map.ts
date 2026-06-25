import type { ValidationError } from '@/error.js';
import type { NestedValidator, Validator } from '@/types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for Map values. Each key and value has to match its validator.
 *
 * @export
 * @interface MapValidator
 * @template K
 * @template V
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {Validator<Map<K, V>, ValidationParams>}
 * @since 4.0.0
 */
export interface MapValidator<
  K,
  V,
  ValidationParams = unknown
> extends Validator<Map<K, V>, ValidationParams> {}

/**
 * Validator for Map values. Each key and value has to match its validator.
 *
 * @export
 * @class DefaultMapValidator
 * @template K
 * @template V
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {DefaultValidator<Map<K, V>, ValidationParams>}
 * @implements {MapValidator<K, V, ValidationParams>}
 * @since 4.0.0
 */
export class DefaultMapValidator<K, V, ValidationParams = unknown>
  extends DefaultValidator<Map<K, V>, ValidationParams>
  implements MapValidator<K, V, ValidationParams>
{
  constructor(
    private readonly _keyValidator: NestedValidator<K, ValidationParams>,
    private readonly _valueValidator: NestedValidator<V, ValidationParams>
  ) {
    super();
  }

  protected validateBaseType(
    value_: unknown,
    params_?: ValidationParams
  ): Map<K, V> {
    if (!(value_ instanceof Map)) {
      this.throwValidationError('value is not a map');
    }

    const map = value_ as Map<unknown, unknown>;
    const errors: ValidationError[] = [];

    for (const [key, val] of map) {
      const trace = this.keyTrace(key);

      try {
        this.validateNested(key, this._keyValidator, params_);
      } catch (reason_) {
        if (this.aggregatesErrors) {
          errors.push(this.collectNestedError(reason_, trace));
        } else {
          this.rethrowError(reason_, trace);
        }
      }

      try {
        this.validateNested(val, this._valueValidator, params_);
      } catch (reason_) {
        if (this.aggregatesErrors) {
          errors.push(this.collectNestedError(reason_, trace));
        } else {
          this.rethrowError(reason_, trace);
        }
      }
    }

    if (errors.length > 0) {
      this.throwValidationError(
        'one or more entries are invalid',
        undefined,
        errors
      );
    }

    return value_ as Map<K, V>;
  }

  private keyTrace(key_: unknown): PropertyKey | undefined {
    const type = typeof key_;

    return type === 'string' || type === 'number' || type === 'symbol'
      ? (key_ as PropertyKey)
      : undefined;
  }
}
