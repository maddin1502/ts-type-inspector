import type { CustomValidation, ObjectLike, Validator } from '../types.js';
import { DefaultValidator } from './index.js';

/**
 * Validator for custom value validation.
 *
 * @export
 * @interface CustomValidator
 * @template Out
 * @template {ObjectLike} [ValidationParams=any] extended validation parameters
 * @extends {Validator<Out, ValidationParams>}
 * @since 1.0.0
 */
export interface CustomValidator<Out, ValidationParams extends ObjectLike = any>
  extends Validator<Out, ValidationParams> {}

/**
 * Validator for custom value validation.
 *
 * @export
 * @class DefaultCustomValidator
 * @template Out
 * @template {ObjectLike} [ValidationParams=any] extended validation parameters
 * @extends {DefaultValidator<Out, ValidationParams>}
 * @implements {CustomValidator<Out, ValidationParams>}
 * @since 1.0.0
 */
export class DefaultCustomValidator<
    Out,
    ValidationParams extends ObjectLike = any
  >
  extends DefaultValidator<Out, ValidationParams>
  implements CustomValidator<Out, ValidationParams>
{
  /**
   * Creates an instance of CustomValidator.
   *
   * @constructor
   * @param {CustomValidation<unknown, ValidationParams>} _validationCallback  Return an error message if validation fails; else undefined
   */
  constructor(
    private readonly _validationCallback: CustomValidation<
      unknown,
      ValidationParams
    >
  ) {
    super();
  }

  protected validateBaseType(
    value_: unknown,
    _params_?: ValidationParams
  ): Out {
    const result = this._validationCallback(value_);

    if (result === undefined) {
      return value_ as Out;
    }

    this.throwValidationError(result);
  }
}
