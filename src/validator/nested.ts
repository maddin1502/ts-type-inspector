import type { NestedValidationParams, Validator } from '@/types.js';
import { DefaultValidator } from './index.js';

export class NestedValidator<
  Out,
  ParentValidationParams,
  V extends Validator<Out> = Validator<Out>
> extends DefaultValidator<Out> {
  constructor(
    private _validator: V,
    private _withParams: (parentParams_: ParentValidationParams | undefined) => NestedValidationParams<V> | undefined,
  ) {
    super();
  }

  protected validateBaseType(
    value_: unknown,
    params_?: ParentValidationParams | undefined
  ): Out {
    return this._validator.validate(value_, this._withParams(params_));
  }
}
