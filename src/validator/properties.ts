import type { PartialPropertyValidators } from '@/types.js';
import type { RecordLike } from 'ts-lib-extended';
import { ContainerValidator } from './container.js';

/**
 * Base class for validators built from a map of per-property validators
 * (object, partial). Stores the property validators and exposes them via
 * {@link prop} / {@link props}.
 *
 * @export
 * @abstract
 * @class PropertiesValidator
 * @template {RecordLike} Out
 * @template ValidationParams extended validation parameters
 * @template {PartialPropertyValidators<Out, ValidationParams>} PV the concrete property validators map
 * @extends {ContainerValidator<Out, ValidationParams>}
 * @since 4.0.0
 */
export abstract class PropertiesValidator<
  Out extends RecordLike,
  ValidationParams,
  PV extends PartialPropertyValidators<Out, ValidationParams>
> extends ContainerValidator<Out, ValidationParams> {
  /**
   * Creates an instance of PropertiesValidator.
   *
   * @constructor
   * @param {PV} _propertyValidators the validators for each property
   */
  constructor(protected readonly _propertyValidators: PV) {
    super();
  }

  /**
   * Retrieve the validator defined for a specific property.
   *
   * @template {keyof PV} Key
   * @param {Key} key_
   * @returns {PV[Key]}
   * @since 4.0.0
   */
  public prop<Key extends keyof PV>(key_: Key): PV[Key] {
    return this._propertyValidators[key_];
  }

  /**
   * Retrieve the validators defined for all properties.
   *
   * @returns {PV}
   * @since 4.0.0
   */
  public props(): PV {
    return this._propertyValidators;
  }
}
