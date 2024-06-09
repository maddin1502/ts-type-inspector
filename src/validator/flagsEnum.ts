import {
  enumerableObject,
  type Enumerable,
  type EnumerableValue
} from 'ts-lib-extended';
import { DefaultEnumValidator, type EnumValidator } from './enum.js';

/**
 * Validator for flagged enum values
 *
 * @export
 * @interface FlagsEnumValidator
 * @template {Enumerable<number>} E
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {EnumValidator<E, ValidationParams>}
 * @since 3.3.0
 */
export interface FlagsEnumValidator<
  E extends Enumerable<number>,
  ValidationParams = unknown
> extends EnumValidator<E, ValidationParams> {}

/**
 * Validator for flagged enum values
 *
 * @export
 * @class DefaultFlagsEnumValidator
 * @template {Enumerable<number>} E
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {DefaultEnumValidator<E, ValidationParams>}
 * @implements {FlagsEnumValidator<E, ValidationParams>}
 * @since 3.3.0
 */
export class DefaultFlagsEnumValidator<
    E extends Enumerable<number>,
    ValidationParams = unknown
  >
  extends DefaultEnumValidator<E, ValidationParams>
  implements FlagsEnumValidator<E, ValidationParams>
{
  private readonly _allFlags: number;

  constructor(enum_: E) {
    super(enum_);

    const values = enumerableObject.values(enum_);
    let allFlags = 0;

    for (let i = 0; i < values.length; i++) {
      const enumValue = values[i];

      if (typeof enumValue === 'number') {
        allFlags |= enumValue;
      }
    }

    this._allFlags = allFlags;
  }

  protected override isEnumValue(
    enum_: E,
    value_: unknown
  ): value_ is EnumerableValue<E> {
    return (
      super.isEnumValue(enum_, value_) ||
      (typeof value_ === 'number' && (this._allFlags & value_) === value_)
    );
  }
}
