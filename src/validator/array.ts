import type {
  ContainerExtendedValidationParameters,
  EmptyObject,
  ExtendedValidationParameters,
  Validatable
} from '../types.js';
import { Validator } from './index.js';

/**
 * Validator for array values
 *
 * @export
 * @template Out
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @template {ContainerExtendedValidationParameters<EVP>} [CEVP=EmptyObject]
 * @since 1.0.0
 */
export type ArrayValidatable<
  Out,
  EVP extends ExtendedValidationParameters = EmptyObject,
  CEVP extends ContainerExtendedValidationParameters<EVP> = EmptyObject
> = Validatable<Out[], CEVP> & {
  /**
   * validate exact array length
   *
   * @param {number} length_
   * @returns {ArrayValidatable<Out, EVP, CEVP>}
   * @since 1.0.0
   */
  length(length_: number): ArrayValidatable<Out, EVP, CEVP>;
  /**
   * validate minimum array length
   *
   * @param {number} min_
   * @returns {ArrayValidatable<Out, EVP, CEVP>}
   * @since 1.0.0
   */
  min(min_: number): ArrayValidatable<Out, EVP, CEVP>;
  /**
   * validate maximum array length
   *
   * @param {number} max_
   * @returns {ArrayValidatable<Out, EVP, CEVP>}
   * @since 1.0.0
   */
  max(max_: number): ArrayValidatable<Out, EVP, CEVP>;
  /**
   * define accepted values
   *
   * @param {...ReadonlyArray<Out>} items_
   * @returns {ArrayValidatable<Out, EVP, CEVP>}
   * @since 1.0.0
   */
  accept(...items_: ReadonlyArray<Out>): ArrayValidatable<Out, EVP, CEVP>;
  /**
   * define rejected values
   *
   * @param {...ReadonlyArray<Out>} items_
   * @returns {ArrayValidatable<Out, EVP, CEVP>}
   * @since 1.0.0
   */
  reject(...items_: ReadonlyArray<Out>): ArrayValidatable<Out, EVP, CEVP>;
};

/**
 * Validator for array values
 *
 * @export
 * @class ArrayValidator
 * @template Out
 * @template {ExtendedValidationParameters} [EVP=EmptyObject]
 * @template {ContainerExtendedValidationParameters<EVP>} [CEVP=EmptyObject]
 * @extends {Validator<Out[], CEVP>}
 * @implements {ArrayValidatable<Out, EVP, CEVP>}
 * @since 1.0.0
 */
export class ArrayValidator<
    const Out,
    EVP extends ExtendedValidationParameters = EmptyObject,
    CEVP extends ContainerExtendedValidationParameters<EVP> = EmptyObject
  >
  extends Validator<Out[], CEVP>
  implements ArrayValidatable<Out, EVP, CEVP>
{
  /**
   * Creates an instance of ArrayValidator.
   *
   * @constructor
   * @param {Validatable<Out, EVP>} _itemValidator
   * @since 1.0.0
   */
  constructor(private readonly _itemValidator: Validatable<Out, EVP>) {
    super();
  }

  public length(length_: number): ArrayValidatable<Out, EVP, CEVP> {
    return this.setupCondition((value_) => this.checkLength(value_, length_));
  }

  public min(min_: number): ArrayValidatable<Out, EVP, CEVP> {
    return this.setupCondition((value_) => this.checkMin(value_, min_));
  }

  public max(max_: number): ArrayValidatable<Out, EVP, CEVP> {
    return this.setupCondition((value_) => this.checkMax(value_, max_));
  }

  public accept(
    ...items_: ReadonlyArray<Out>
  ): ArrayValidatable<Out, EVP, CEVP> {
    return this.setupCondition((value_) => this.checkAccepted(value_, items_));
  }

  public reject(
    ...items_: ReadonlyArray<Out>
  ): ArrayValidatable<Out, EVP, CEVP> {
    return this.setupCondition((value_) => this.checkRejected(value_, items_));
  }

  protected validateBaseType(value_: unknown, params_?: CEVP): Out[] {
    if (!Array.isArray(value_)) {
      this.throwValidationError('value is not an array');
    }

    for (let i = 0; i < value_.length; i++) {
      try {
        this._itemValidator.validate(
          value_[i],
          params_?.extendedItemValidationParameters
        );
      } catch (reason_) {
        this.rethrowError(reason_, i);
      }
    }

    return value_ as Out[];
  }

  private checkLength(value_: Out[], length_: number): void {
    if (value_.length !== length_) {
      this.throwValidationError('deviant length');
    }
  }

  private checkMin(value_: Out[], min_: number): void {
    if (value_.length < min_) {
      this.throwValidationError('too few items');
    }
  }

  private checkMax(value_: Out[], max_: number): void {
    if (value_.length > max_) {
      this.throwValidationError('too many items');
    }
  }

  private checkAccepted(
    value_: Out[],
    acceptedItems_: ReadonlyArray<any>
  ): void {
    for (let i = 0; i < value_.length; i++) {
      if (!acceptedItems_.includes(value_[i])) {
        this.throwValidationError('item is not accepted');
      }
    }
  }

  private checkRejected(
    value_: Out[],
    rejectedItems_: ReadonlyArray<any>
  ): void {
    for (let i = 0; i < value_.length; i++) {
      if (rejectedItems_.includes(value_[i])) {
        this.throwValidationError('item is rejected');
      }
    }
  }
}
