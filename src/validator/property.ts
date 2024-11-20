import type { PartialPropertyValidators } from '@/types.js';
import type { InstanceLike } from 'ts-lib-extended';
import { DefaultValidator } from './index.js';

export type PVOUT<T extends PartialPropertyValidators<any>> =
  T extends PartialPropertyValidators<infer P> ? P : never;
export type PVPar<T extends PartialPropertyValidators<any>> =
  T extends PartialPropertyValidators<any, infer P> ? P : never;

export abstract class PropertiesValidator<
  PV extends PartialPropertyValidators<any, any>,
  Out extends InstanceLike = PVOUT<PV>,
  ValidationParams = PVPar<PV>
> extends DefaultValidator<Out, ValidationParams> {
  constructor(protected readonly _propertyValidators: PV) {
    super();
  }

  public prop<Key extends keyof PV>(name_: Key): PV[Key] {
    return this._propertyValidators[name_];
  }
}
