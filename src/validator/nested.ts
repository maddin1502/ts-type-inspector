import type { NestedValidateWith } from '@/types.js';
import { DefaultValidator } from './index.js';

export class NestedValidator<
  Out,
  ValidationParams = unknown
> extends DefaultValidator<Out, ValidationParams> {
  constructor(
    private useValidator_: NestedValidateWith<Out, ValidationParams>
  ) {
    super();
  }

  protected validateBaseType(
    value_: unknown,
    params_?: ValidationParams | undefined
  ): Out {
    let nestedValidationParams: unknown;

    const nestedValidator = this.useValidator_((cval_, cparams_) => {
      nestedValidationParams = cparams_;
      return cval_;
    }, params_);

    return nestedValidator.validate(value_, nestedValidationParams);
  }
}
