import type { ObjectLike, Validator } from '../types.js';
import { DefaultValidator } from './index.js';

/**
 * This validator is able to validate if a type doesn't exist in a KNOWN union type.
 * The generics "Out" and "In" have to be set. "In" describes the incoming union type and "Out" the desired output type.
 * The passed validator checks whether the undesired types (= In - Out) exist in the value.
 *
 * @export
 * @interface ExcludeValidator
 * @template {In} Out
 * @template In
 * @template {ObjectLike} [ValidationParams=any] extended validation parameters
 * @extends {Validator<Out, ValidationParams>}
 * @since 1.1.0
 */
export interface ExcludeValidator<
  Out extends In,
  In,
  ValidationParams extends ObjectLike = any
> extends Validator<Out, ValidationParams> {}

/**
 * This validator is able to validate if a type doesn't exist in a KNOWN union type.
 * The generics "Out" and "In" have to be set. "In" describes the incoming union type and "Out" the desired output type.
 * The passed validator checks whether the undesired types (= In - Out) exist in the value.
 *
 * @export
 * @class DefaultExcludeValidator
 * @template {In} Out
 * @template In
 * @template {ObjectLike} [ValidationParams=any] extended validation parameters
 * @extends {DefaultValidator<Out, ValidationParams>}
 * @implements {ExcludeValidator<Out, In, ValidationParams>}
 * @since 1.1.0
 */
export class DefaultExcludeValidator<
    Out extends In,
    In,
    ValidationParams extends ObjectLike = any
  >
  extends DefaultValidator<Out, ValidationParams>
  implements ExcludeValidator<Out, In, ValidationParams>
{
  /**
   * Creates an instance of DefaultExcludeValidator.
   *
   * @constructor
   * @param {DefaultValidator<Exclude<In, Out>>} _validator DO NOT USE CONDITIONS
   */
  constructor(
    private readonly _validator: DefaultValidator<Exclude<In, Out>> // use DefaultValidator class and NOT Validator type to prevent the use of conditions
  ) {
    super();
  }

  protected validateBaseType(value_: In, _params_?: ValidationParams): Out {
    if (this._validator.isValid(value_)) {
      this.throwValidationError('value is excluded');
    }

    return value_ as Out;
  }
}
