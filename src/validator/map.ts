import type { ValidationError } from '@/error.js';
import type { PropertyValidator, Validator } from '@/types.js';
import { ContainerValidator } from './container.js';

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
 * @extends {ContainerValidator<Map<K, V>, ValidationParams>}
 * @implements {MapValidator<K, V, ValidationParams>}
 * @since 4.0.0
 */
export class DefaultMapValidator<K, V, ValidationParams = unknown>
  extends ContainerValidator<Map<K, V>, ValidationParams>
  implements MapValidator<K, V, ValidationParams>
{
  constructor(
    private readonly _keyValidator: PropertyValidator<K, ValidationParams>,
    private readonly _valueValidator: PropertyValidator<V, ValidationParams>
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

      this.validateChild(errors, () => key, this._keyValidator, trace, params_);
      this.validateChild(
        errors,
        () => val,
        this._valueValidator,
        trace,
        params_
      );
    }

    this.throwOnErrors(errors, 'one or more entries are invalid');

    return value_ as Map<K, V>;
  }

  private keyTrace(key_: unknown): PropertyKey | undefined {
    const type = typeof key_;

    return type === 'string' || type === 'number' || type === 'symbol'
      ? (key_ as PropertyKey)
      : undefined;
  }
}
