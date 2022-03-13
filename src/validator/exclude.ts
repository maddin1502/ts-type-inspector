import { Validator } from '.';
import { Validatable } from '../types';
import { NumberValidator } from './number';
import { StringValidator } from './string';

// export class ExcludeValidator<In, Out extends In> extends Validator<Out, In>
// {
//   constructor(
//     private _validator: Validatable<Exclude<In, Out>, In>
//   ) {
//     super();
//   }

//   protected validateBaseType(value_: In): Out {
//     if (this._validator.isValid(value_)) {
//       this.throwValidationError('value matches validator');
//     }

//     return value_ as Out;
//   }
// }

export class ExcludeValidator<In, Out extends In> extends Validator<Out, In>
{
  constructor(
    private _validator: Validatable<Exclude<In, Out>>
  ) {
    super();
  }

  protected validateBaseType(value_: In): Out {
    if (this._validator.isValid(value_)) {
      value_
      this.throwValidationError('value is excluded');
    }

    return value_ as Out;
  }
}

function filter(incoming_: string | number): string {
  return new ExcludeValidator<string | number, string>(new NumberValidator()).validate(incoming_);
}
