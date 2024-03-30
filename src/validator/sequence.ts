import {
  EmptyObject,
  ExtendedValidationParameters,
  ItemValidatables,
  Validatable
} from '@/types.js';
import { Validator } from './index.js';

export type SequenceValidatable<
  Out extends unknown[],
  EVP extends ExtendedValidationParameters = EmptyObject
> = Validatable<Out, EVP> & {
  get noOverload(): SequenceValidatable<Out, EVP>;
};

export class SequenceValidator<
    Out extends unknown[],
    EVP extends ExtendedValidationParameters = EmptyObject
  >
  extends Validator<Out, EVP>
  implements SequenceValidatable<Out, EVP>
{
  private readonly _itemValidators: ItemValidatables<Out>;

  constructor(...itemValidators_: ItemValidatables<Out>) {
    super();
    this._itemValidators = itemValidators_;
  }

  public get noOverload(): SequenceValidatable<Out, EVP> {
    return this.setupCondition((value_) => this.checkOverload(value_));
  }

  protected validateBaseType(value_: unknown): Out {
    if (!Array.isArray(value_)) {
      this.throwValidationError('value is not an array');
    }

    if (value_.length < this._itemValidators.length) {
      this.throwValidationError('too few items');
    }

    for (let i = 0; i < this._itemValidators.length; i++) {
      try {
        this._itemValidators[i].validate(value_[i]);
      } catch (reason_) {
        this.rethrowError(reason_, i);
      }
    }

    return value_ as Out;
  }

  private checkOverload(value_: unknown[]): void {
    if (value_.length > this._itemValidators.length) {
      this.throwValidationError('value is overloaded');
    }
  }
}

// type ItemValidatables<A extends unknown[]> = { [index in keyof A]: Validatable<A[index]> };

// function test<A extends any[]>(...items_: [...A]): A {
//  return items_;
// }

// function test2<A extends unknown[]>(...items_: [...A]): A {
//  return items_;
// }
// function test3<const A extends unknown[]>(...items_: A): A {
//  return items_;
// }
// function test4<const A extends unknown[]>(...items_: ItemValidatables<A>): A {
//  return items_ as A;
// }
// function test5<A extends unknown[]>(value_: unknown, noOverload: boolean, ...items_: ItemValidatables<A>): A {
//   if (!Array.isArray(value_)) {
//     throw new Error('not array');
//   }

//   if (value_.length < items_.length) {
//     throw new Error('too few entries');
//   }

//   if (noOverload && value_.length > items_.length) {
//     throw new Error('too many entries');
//   }

//   for (let i = 0; i < items_.length; i++) {
//     const item = items_[i];

//     if (!item.isValid(value_[i])) {
//       throw new Error('item not valid')
//     }
//   }

//   return value_ as A;
// }

// const ti = new TypeInspector();

// const x = test(1,2, 'affe');
// const x2 = test2(1,2, 'affe');
// const x3 = test3(1,2, 'affe');
// const x4 = test4(ti.number, ti.strict(2), ti.strict('affe'));
// const x5 = test5([], true, ti.number, ti.strict(2), ti.strict('affe'));
