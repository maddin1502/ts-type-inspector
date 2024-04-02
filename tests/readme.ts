import { ti, DefaultOptionalValidator } from '@/index.js';

export type MyData = string | undefined;

export type MyDataExtendedValidationParameter = {
  valueRequired?: boolean;
};

export class MyDataOptionalValidator extends DefaultOptionalValidator<
  MyData,
  MyDataExtendedValidationParameter
> {
  constructor() {
    super(ti.string);

    // 1. option - use the custom condition
    this.custom((value_, params_) => {
      if (params_?.valueRequired && value_ === undefined) {
        return 'data is required';
      }
    });
  }

  // 2. option - create a new condition
  public get failWhenRequired() {
    this.setupCondition((value_, params_) => {
      if (params_?.valueRequired && value_ === undefined) {
        this.throwValidationError('data is required');
      }
    });
    return this;
  }

  // 3. option - extend base type validation
  protected validateBaseType(
    value_: unknown,
    params_?: MyDataExtendedValidationParameter | undefined
  ): MyData {
    const base = super.validateBaseType(value_);

    if (params_?.valueRequired && base === undefined) {
      this.throwValidationError('data is required');
    }

    return base;
  }
}

const mdov = new MyDataOptionalValidator();
const value: MyData = undefined;
mdov.isValid(value); // true
mdov.isValid(value, { valueRequired: true }); // false

// export type CommonData = {
//   data: string | undefined;
// };

// export class CommonDataValidator extends DefaultObjectValidator<CommonData> {
//   constructor() {
//     super({
//       data: ti.optional(ti.string)
//     });
//   }
// }

// export type CommonDataExtendedValidationParameter = {
//   valueRequired?: boolean;
// };

// export class InfluencableCommonDataValidator extends DefaultObjectValidator<
//   CommonData,
//   NoParameters,
//   CommonDataExtendedValidationParameter
// > {
//   constructor() {
//     super({
//       data: ti.optional(ti.string)
//     });

//     // 1. option - use the custom condition
//     this.custom((value_, params_) => {
//       if (params_?.valueRequired && value_.data === undefined) {
//         return 'data is required';
//       }
//     });
//   }

//   // 2. option - create a new condition
//   public get failWhenRequired() {
//     this.setupCondition((value_, params_) => {
//       if (params_?.valueRequired && value_.data === undefined) {
//         this.throwValidationError('data is required');
//       }
//     });
//     return this;
//   }

//   // 3. option - extend base type validation
//   protected validateBaseType(
//     value_: unknown,
//     params_?: CommonDataExtendedValidationParameter | undefined
//   ): CommonData {
//     const base = super.validateBaseType(value_, params_);

//     if (params_?.valueRequired && base.data === undefined) {
//       this.throwValidationError('data is required');
//     }

//     return base;
//   }
// }

// const cdv = new InfluencableCommonDataValidator();
// const value: CommonData = { data: undefined };
// cdv.isValid(value); // true
// cdv.isValid(value, { valueRequired: true }); // false
