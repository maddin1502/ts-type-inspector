import { Validator } from '.';
import { Validatable } from '../types';

export class NotValidator<B, N extends B, E extends Exclude<B, N>> extends Validator<Exclude<B, N>, B>
{
  constructor(
    private _validator: Validatable<N>
  ) {
    super();
  }

  protected validateBaseType(value_: B): Exclude<B, N> {
    if (this._validator.isValid(value_)) {
      this.throwValidationError('value matches validator');
    }

    return value_ as Exclude<B, N>;
  }
}


const b: string | number | boolean = null as any;
const n: boolean = null as any;


function test<B, N extends B>(b:B, n:N): Exclude<B, N> {
  return null as any as Exclude<B, N>;
}

const fun = test(b, n);


const val = new NotValidator(null as any as Validatable<boolean>).validate(b)
