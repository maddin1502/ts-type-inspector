// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { Validator } from './index.js';
// import type { ObjectLike, PartialPropertyValidators, PropertyValidators, SelectPropertyValidators, Validatable } from '../types.js';
// import { ObjectValidatable, ObjectValidator } from "./object";

// export type IntersectIn<PV extends PartialPropertyValidators> = PV extends PartialPropertyValidators<infer In> ? In : never;
// export type IntersectOut<IIn extends IntersectIn<PartialPropertyValidators>> = IIn extends IntersectIn<infer Out> ? Out : never;
// // export type IntersectOut<PV extends PartialPropertyValidators> = PV extends PartialPropertyValidators<infer Out> ? Out : never;
// // export type IntersectValidators<In extends IntersectIn<any>> = In extends IntersectIn<infer PV> ? PV : never;

// export type IntersectValidatable<In extends IntersectIn<PV>, PV extends PartialPropertyValidators<In> = PartialPropertyValidators<In>> = Validatable<IntersectOut<PV>>;

// // const aaaa: IntersectValidatable<{a:number;b:number},{a: Validatable<number>}> = null as any;
// // const aaaaaaa = aaaa.validate(null)
// // aaaaaaa.


// /**
//  * Validator for object based values. This is a "unsafe" validator that only validates some properties and ignores others
//  */
// // export class IntersectValidator<Out extends IntersectIn<PV>, PV extends PartialPropertyValidators<any> = PartialPropertyValidators<Out>>
// //   extends Validator<IntersetOut<Out>>
// //   implements IntersectValidatable<Out, PV>
// // {
// export class IntersectValidator<Out extends ObjectLike, Base extends Out = Out>
//   extends ObjectValidator<Out>
//   implements ObjectValidatable<Out>
//   // implements IntersectValidatable<Out, PV>
// {
//   // constructor(
//   //   private readonly _propertyValidators: PropertyValidators<Base>
//   // ) {
//   //   super(_propertyValidators);
//   // }

//   // protected validateBaseType(value_: unknown): IntersetOut<In> {
//   //   if (!this.isObjectLike(value_)) {
//   //     this.throwValidationError('value is not an object');
//   //   }

//   //   for (const validatorKey in this._propertyValidators) {
//   //     try {
//   //       this._propertyValidators[validatorKey]?.validate(value_[validatorKey]);
//   //     } catch (reason_) {
//   //       this.rethrowError(reason_, validatorKey);
//   //     }
//   //   }

//   //   return value_ as IntersetOut<In>;
//   // }

//   // private isObjectLike(value_: unknown): value_ is ObjectLike {
//   //   return typeof value_ === 'object' && value_ !== null;
//   // }
// }


// // const x = new IntersectValidator<{a:number;b:number}>({

// // });
// // const xx = x.validate(null);
// // xx
