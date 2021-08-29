import { Validator } from '.';

// TODO: use AnyLike to avoid misuse?

/**
 * USE THIS FOR ANY TYPES ONLY !!!!
 * Actually this validator does not validate.
 *
 * @export
 * @class AnyValidator
 * @extends {Validator<any>}
 */
export class AnyValidator extends Validator<any> {
  private _notNullish: boolean;

  constructor() {
    super();
    this._notNullish = false;
  }

  /**
   * forbid nullish values (undefined, null)
   *
   * @readonly
   * @type {this}
   * @memberof AnyValidator
   */
  public get notNullish(): this {
    this._notNullish = true;
    return this;
  }

  protected validateValue(value_: unknown): any {
    if (this._notNullish && (value_ === null || value_ === undefined)) {
      this.throwValidationError('value is nullish');
    }

    return value_;
  }
}
