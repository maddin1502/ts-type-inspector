import type {
  EmptyObject,
  ExtendedValidationParameters,
  Validatable
} from '../types.js';
import { Validator } from './index.js';

/**
 * This validator is able to validate if a type doesn't exist in a KNOWN union type.
 * The generics "Out" and "In" have to be set. "In" describes the incoming union type and "Out" the desired output type.
 * The passed validator checks whether the undesired types (= In - Out) exist in the value.
 *
 * @export
 * @template {In} Out
 * @template In
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @since 1.1.0
 */
export type ExcludeValidatable<
  Out extends In,
  In,
  EVP extends ExtendedValidationParameters = EmptyObject
> = Validatable<Out, EVP>;

/**
 * This validator is able to validate if a type doesn't exist in a KNOWN union type.
 * The generics "Out" and "In" have to be set. "In" describes the incoming union type and "Out" the desired output type.
 * The passed validator checks whether the undesired types (= In - Out) exist in the value.
 *
 * @export
 * @class ExcludeValidator
 * @template {In} Out
 * @template In
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @extends {Validator<Out, EVP>}
 * @implements {ExcludeValidatable<Out, In, EVP>}
 * @since 1.1.0
 */
export class ExcludeValidator<
    Out extends In,
    In,
    EVP extends ExtendedValidationParameters = EmptyObject
  >
  extends Validator<Out, EVP>
  implements ExcludeValidatable<Out, In, EVP>
{
  constructor(
    private readonly _validator: Validator<Exclude<In, Out>> // use Validator class and NOT Validatable type to prevent the use of conditions
  ) {
    super();
  }

  protected validateBaseType(value_: In): Out {
    if (this._validator.isValid(value_)) {
      this.throwValidationError('value is excluded');
    }

    return value_ as Out;
  }
}
