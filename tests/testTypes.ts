import { DefaultStringValidator, DefaultValidator } from '@/index.js';

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
      if (params_?.failOn === 'custom') {
        return 'extended failure on custom';
      }
    });
  }

  public get extendedFailureCondition() {
    this.setupCondition((_, params_) => {
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
    if (params_?.failOn === 'validate') {
      this.throwValidationError('extended failure on validate');
    }

    return value_;
  }
}

export type TestStringValidationParams = { notEmpty?: boolean };

export class TestStringValidator extends DefaultStringValidator<TestStringValidationParams> {
  constructor() {
    super();
    this.custom((value_, params_) => {
      if (params_?.notEmpty && value_ === '') {
        return 'empty is not allowed';
      }
    });
  }
}
