import type {
  ExtendedValidationParameters,
  NoParameters,
  Validator
} from '../types.js';
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
 * @template {ExtendedValidationParameters} [EVP=NoParameters]
 * @extends {Validator<Out, EVP>}
 * @since 1.1.0
 */
export interface ExcludeValidator<
  Out extends In,
  In,
  EVP extends ExtendedValidationParameters = NoParameters
> extends Validator<Out, EVP> {}

/**
 * This validator is able to validate if a type doesn't exist in a KNOWN union type.
 * The generics "Out" and "In" have to be set. "In" describes the incoming union type and "Out" the desired output type.
 * The passed validator checks whether the undesired types (= In - Out) exist in the value.
 *
 * @export
 * @class DefaultExcludeValidator
 * @template {In} Out
 * @template In
 * @template {ExtendedValidationParameters} [EVP=NoParameters]
 * @extends {DefaultValidator<Out, EVP>}
 * @implements {ExcludeValidator<Out, In, EVP>}
 * @since 1.1.0
 */
export class DefaultExcludeValidator<
    Out extends In,
    In,
    EVP extends ExtendedValidationParameters = NoParameters
  >
  extends DefaultValidator<Out, EVP>
  implements ExcludeValidator<Out, In, EVP>
{
  constructor(
    private readonly _validator: DefaultValidator<Exclude<In, Out>> // use Validator class and NOT Validatable type to prevent the use of conditions
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
