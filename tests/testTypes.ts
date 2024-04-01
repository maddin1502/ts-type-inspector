import { DefaultValidator } from '@/index.js';

export type TestExtendedValidationParameters = {
  failOn: 'validate' | 'condition' | 'custom';
};

export class ExtendedValidationParametersValidator extends DefaultValidator<
  unknown,
  TestExtendedValidationParameters
> {
  constructor() {
    super();
    this.custom((_, params_) => {
      console.log('custom', params_)
      if (params_?.failOn === 'custom') {
        return 'extended failure on custom';
      }
    });
  }

  public get extendedFailureCondition() {
    this.setupCondition((_, params_) => {
      console.log('setupCondition', params_)
      if (params_?.failOn === 'condition') {
        this.throwValidationError('extended failure on condition');
      }
    });
    return this;
  }

  protected validateBaseType(
    value_: unknown,
    params_?: TestExtendedValidationParameters | undefined
  ): unknown {
    console.log('validateBaseType', params_)
    if (params_?.failOn === 'validate') {
      this.throwValidationError('extended failure on validate');
    }

    return value_;
  }
}
