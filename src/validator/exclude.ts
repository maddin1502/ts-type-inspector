import { Validator } from '.';
import type { Validatable } from '../types';

export type ExcludeValidatable<Out extends In, In> = Validatable<Out, In>;

/**
 * This validator is able to validate if a type doesn't exist in a KNOWN union type.
 * The generics "Out" and "In" have to be set. "In" describes the incoming union type and "Out" the desired output type.
 * The passed validator checks whether the undesired types (= In - Out) exist in the value.
 *
 * @since 1.1.0
 * @export
 * @class ExcludeValidator
 * @extends {Validator<Out, In>}
 * @implements {ExcludeValidatable<Out, In>}
 * @template Out
 * @template In
 */
export class ExcludeValidator<Out extends In, In>
  extends Validator<Out, In>
  implements ExcludeValidatable<Out, In>
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
