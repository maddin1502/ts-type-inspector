import { Validator } from '.';

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
  private _falsy: boolean;
  private _truthy: boolean;

  constructor() {
    super();
    this._notNullish = false;
    this._falsy = false;
    this._truthy = false;
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
