import type { ArrayItem } from 'ts-lib-extended';
import { Validator } from '.';
import type { ArrayItemValidator, ArrayItemValidatorArray, Validatable } from '../types';

export type ArrayValidatable<Out extends ArrayItemValidatorArray<V>, V extends ArrayItemValidator = ArrayItemValidator<Out>>
  = Validatable<Out> & {
    /**
     * validate exact array length
     *
     * @since 1.0.0
     */
    length(length_: number): ArrayValidatable<Out, V>;
    /**
     * validate minimum array length
     *
     * @since 1.0.0
     */
    min(min_: number): ArrayValidatable<Out, V>;
    /**
     * validate maximum array length
     *
     * @since 1.0.0
     */
    max(max_: number): ArrayValidatable<Out, V>;
    /**
     * define accepted values
     *
     * @since 1.0.0
     */
    accept(...items_: ReadonlyArray<ArrayItem<Out>>): ArrayValidatable<Out, V>;
    /**
     * define rejected values
     *
     * @since 1.0.0
     */
    reject(...items_: ReadonlyArray<ArrayItem<Out>>): ArrayValidatable<Out, V>;
  };

/**
 * Validator for array values
 *
 * @since 1.0.0
 * @export
 * @class ArrayValidator
 * @extends {Validator<Out>}
 * @implements {ArrayValidatable<Out, V>}
 * @template Out
 * @template V
 */
export class ArrayValidator<Out extends ArrayItemValidatorArray<V>, V extends ArrayItemValidator = ArrayItemValidator<Out>>
  extends Validator<Out>
  implements ArrayValidatable<Out, V>
{
  constructor(
    private readonly _itemValidator: V
  ) {
    super();
  }

  public length(length_: number): ArrayValidatable<Out, V> {
    return this.setupCondition(value_ => this.checkLength(value_, length_));
  }

  public min(min_: number): ArrayValidatable<Out, V> {
    return this.setupCondition(value_ => this.checkMin(value_, min_));
  }

  public max(max_: number): ArrayValidatable<Out, V> {
    return this.setupCondition(value_ => this.checkMax(value_, max_));
  }

  public accept(...items_: ReadonlyArray<ArrayItem<Out>>): ArrayValidatable<Out, V> {
    return this.setupCondition(value_ => this.checkAccepted(value_, items_));
  }

  public reject(...items_: ReadonlyArray<ArrayItem<Out>>): ArrayValidatable<Out, V> {
    return this.setupCondition(value_ => this.checkRejected(value_, items_));
  }

  protected validateBaseType(value_: unknown): Out {
    if (!Array.isArray(value_)) {
      this.throwValidationError('value is not an array');
    }

    for (let i = 0; i < value_.length; i++) {
      try {
        this._itemValidator.validate(value_[i]);
      } catch (reason_) {
        this.rethrowError(reason_, i);
      }
    }

    return value_ as Out;
  }

  private checkLength(value_: Out, length_: number): void {
    if (value_.length !== length_) {
      this.throwValidationError('deviant length');
    }
  }

  private checkMin(value_: Out, min_: number): void {
    if (value_.length < min_) {
      this.throwValidationError('too few items');
    }
  }

  private checkMax(value_: Out, max_: number): void {
    if (value_.length > max_) {
      this.throwValidationError('too many items');
    }
  }

  private checkAccepted(value_: Out, acceptedItems_: ReadonlyArray<any>): void {
    for (let i = 0; i < value_.length; i++) {
      if (!acceptedItems_.includes(value_[i])) {
        this.throwValidationError('item is not accepted');
      }
    }
  }

  private checkRejected(value_: Out, rejectedItems_: ReadonlyArray<any>): void {
    for (let i = 0; i < value_.length; i++) {
      if (rejectedItems_.includes(value_[i])) {
        this.throwValidationError('item is rejected');
      }
    }
  }
}
