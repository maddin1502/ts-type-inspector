import type { Validator } from '@/types.js';

const NESTED_VALIDATOR_MARKER = Symbol('NESTED_VALIDATOR_MARKER');

/**
 * Descriptor produced by `ti.nested(...)`. It is NOT a standalone validator -
 * it only lives inside a container's property/item validators and forwards
 * (and maps) the parent's validation params to the wrapped validator.
 *
 * Being a distinct type (not a `Validator`) is what lets TypeScript infer the
 * parent params type automatically from the surrounding validator.
 *
 * @export
 * @interface NestedValidator
 * @template Out
 * @template [ParentValidationParams=unknown] params handed in by the parent validator
 * @since 4.0.0
 */
export interface NestedValidator<Out, ParentValidationParams = unknown> {
  readonly [NESTED_VALIDATOR_MARKER]: true;
  /**
   * validate a value with the wrapped validator, mapping the parent params to
   * the wrapped validator's params
   *
   * @param {unknown} value_
   * @param {ParentValidationParams | undefined} parentParams_
   * @returns {Out}
   */
  validateNested(
    value_: unknown,
    parentParams_: ParentValidationParams | undefined
  ): Out;
}

/**
 * Default implementation of {@link NestedValidator}.
 *
 * @export
 * @class DefaultNestedValidator
 * @template Out
 * @template [ParentValidationParams=unknown] params handed in by the parent validator
 * @template [ChildValidationParams=unknown] params the wrapped validator expects
 * @implements {NestedValidator<Out, ParentValidationParams>}
 * @since 4.0.0
 */
export class DefaultNestedValidator<
  Out,
  ParentValidationParams = unknown,
  ChildValidationParams = unknown
> implements NestedValidator<Out, ParentValidationParams>
{
  public readonly [NESTED_VALIDATOR_MARKER] = true;

  /**
   * Creates an instance of DefaultNestedValidator.
   *
   * @constructor
   * @param {Validator<Out, ChildValidationParams>} _validator the wrapped (nested) validator
   * @param {(parentParams_: ParentValidationParams | undefined) => ChildValidationParams | undefined} _withParams maps the parent params to the wrapped validator's params
   */
  constructor(
    private readonly _validator: Validator<Out, ChildValidationParams>,
    private readonly _withParams: (
      parentParams_: ParentValidationParams | undefined
    ) => ChildValidationParams | undefined
  ) {}

  public validateNested(
    value_: unknown,
    parentParams_: ParentValidationParams | undefined
  ): Out {
    return this._validator.validate(value_, this._withParams(parentParams_));
  }
}

/**
 * determine whether a value is a {@link NestedValidator}
 *
 * @export
 * @param {unknown} value_
 * @returns {value_ is NestedValidator<unknown, unknown>}
 * @since 4.0.0
 */
export function isNestedValidator(
  value_: unknown
): value_ is NestedValidator<unknown, unknown> {
  return (
    typeof value_ === 'object' &&
    value_ !== null &&
    NESTED_VALIDATOR_MARKER in value_
  );
}
