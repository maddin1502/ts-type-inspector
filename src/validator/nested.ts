import type { NestedValidateWith, NestedValidationParams, Validator } from '@/types.js';
import { DefaultValidator } from './index.js';

export class NestedValidator<
  Out,
  ParentValidationParams,
  V extends Validator<Out> = Validator<Out>
> extends DefaultValidator<Out> {
  constructor(
    private _validator: V,
    private _withParams: (parentParams_: ParentValidationParams | undefined) => NestedValidationParams<V> | undefined,
    // private useValidator_: NestedValidateWith<Out, ParentValidationParams>
  ) {
    super();
  }

  protected validateBaseType(
    value_: unknown,
    params_?: ParentValidationParams | undefined
  ): Out {
    return this._validator.validate(value_, this._withParams(params_));
    // let nestedValidationParams: unknown;

    // const nestedValidator = this.useValidator_((cval_, cparams_) => {
    //   nestedValidationParams = cparams_;
    //   return cval_;
    // }, params_);

    // return nestedValidator.validate(value_, nestedValidationParams);
  }
}
