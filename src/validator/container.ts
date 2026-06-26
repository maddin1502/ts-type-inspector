import { ValidationError } from '@/error.js';
import type { PropertyValidator } from '@/types.js';
import { DefaultValidator } from './index.js';
import { isNestedValidator } from './nested.js';

/**
 * Base class for validators that contain/iterate nested validators (object,
 * partial, array, tuple, dictionary, map, set). Holds the shared logic for
 * forwarding params into nested validators and for the opt-in "aggregate"
 * (collect-all) mode.
 *
 * Value validators (string, number, ...) extend {@link DefaultValidator}
 * directly and therefore do NOT expose `aggregate` - it would be meaningless
 * for them.
 *
 * @export
 * @abstract
 * @class ContainerValidator
 * @template Out
 * @template [ValidationParams=unknown] extended validation parameters
 * @extends {DefaultValidator<Out, ValidationParams>}
 * @since 4.0.0
 */
export abstract class ContainerValidator<
  Out,
  ValidationParams = unknown
> extends DefaultValidator<Out, ValidationParams> {
  private _aggregateErrors = false;

  /**
   * Collect ALL nested invalidities instead of failing on the first one.
   * The thrown ValidationError carries one sub-error per invalid child.
   *
   * @readonly
   * @type {this}
   * @since 4.0.0
   */
  public get aggregate(): this {
    this._aggregateErrors = true;
    return this;
  }

  /**
   * Validate a single nested child. In aggregate mode the invalidity is
   * collected into `errors_`; otherwise it is rethrown immediately (fail fast).
   *
   * The child value is read lazily via `getValue_` so that throwing getters are
   * caught and turned into proper validation errors.
   *
   * @template ChildOut
   * @param {ValidationError[]} errors_ collector for aggregate mode
   * @param {() => unknown} getValue_ reads the child value (inside the try)
   * @param {PropertyValidator<ChildOut, ValidationParams>} propertyValidator_
   * @param {PropertyKey | undefined} trace_ property key / index for the error path
   * @param {?ValidationParams} [params_]
   * @since 4.0.0
   */
  protected validateChild<ChildOut>(
    errors_: ValidationError[],
    getValue_: () => unknown,
    propertyValidator_: PropertyValidator<ChildOut, ValidationParams>,
    trace_: PropertyKey | undefined,
    params_?: ValidationParams
  ): void {
    try {
      this.validateNested(getValue_(), propertyValidator_, params_);
    } catch (reason_) {
      if (this._aggregateErrors) {
        errors_.push(this.collectNestedError(reason_, trace_));
      } else {
        this.rethrowError(reason_, trace_);
      }
    }
  }

  /**
   * Throw an aggregate ValidationError if any invalidities were collected.
   *
   * @param {ReadonlyArray<ValidationError>} errors_
   * @param {string} message_ message of the aggregate error
   * @since 4.0.0
   */
  protected throwOnErrors(
    errors_: ReadonlyArray<ValidationError>,
    message_: string
  ): void {
    if (errors_.length > 0) {
      this.throwValidationError(message_, undefined, errors_);
    }
  }

  private validateNested<NestedOut>(
    value_: unknown,
    propertyValidator_: PropertyValidator<NestedOut, ValidationParams>,
    params_?: ValidationParams
  ): void {
    if (isNestedValidator(propertyValidator_)) {
      // ti.nested: maps + forwards the parent's params to the wrapped validator
      propertyValidator_.validateNested(value_, params_);
    } else {
      // plain validator: forward params too (it ignores them if unused)
      propertyValidator_.validate(value_, params_);
    }
  }

  private collectNestedError(
    reason_: unknown,
    trace_?: PropertyKey
  ): ValidationError {
    const propertyTraces: PropertyKey[] = trace_ === undefined ? [] : [trace_];
    const { error, originalMessage } = this.detectError(
      reason_,
      propertyTraces
    );
    return new ValidationError(
      originalMessage ?? error.message,
      propertyTraces,
      [error]
    );
  }
}
