import { Validator } from '.';
import { email, uri } from '@sideway/address';
import { URL } from 'url';

/**
 * Validator for string values.
 * EMPTY STRINGS ARE REJECTED BY DEFAULT! Use "allowEmpty()" to allow empty strings
 *
 * @export
 * @class StringValidator
 * @extends {Validator<string>}
 */
export class StringValidator extends Validator<string> {
  private _min: number | undefined;
  private _max: number | undefined;
  private _allowed: (string | RegExp)[] | undefined;
  private _denied: (string | RegExp)[] | undefined;
  private _length: number | undefined;
  private _allowEmpty: boolean;
  private _base64: boolean;
  private _json: boolean;
  private _date: boolean;
  private _numeric: boolean;
  private _uuid: boolean;
  private _mail: boolean;
  private _uri: boolean;
  private _url: boolean;

  constructor() {
    super();
    this._allowEmpty = false;
    this._base64 = false;
    this._json = false;
    this._date = false;
    this._numeric = false;
    this._uuid = false;
    this._mail = false;
    this._uri = false;
    this._url = false;
  }

  /**
   * minimum string length
   *
   * @param {number} length_
   * @return {*}  {this}
   * @memberof StringValidator
   */
  public min(length_: number): this {
    this._min = length_;
    return this;
  }

  /**
   * maximum string length
   *
   * @param {number} length_
   * @return {*}  {this}
   * @memberof StringValidator
   */
  public max(length_: number): this {
    this._max = length_;
    return this;
  }

  /**
   * allowed values or patterns
   *
   * @param {(...(string | RegExp)[])} allowed_
   * @return {*}  {this}
   * @memberof StringValidator
   */
  public allow(...allowed_: (string | RegExp)[]): this {
    this._allowed = allowed_;
    return this;
  }

  /**
   * denied values or patterns
   *
   * @param {(...(string | RegExp)[])} allowed_
   * @return {*}  {this}
   * @memberof StringValidator
   */
  public deny(...denied_: (string | RegExp)[]): this {
    this._denied = denied_;
    return this;
  }

  /**
   * value has to match a specific string length
   *
   * @param {number} value_
   * @return {*}  {this}
   * @memberof StringValidator
   */
  public length(value_: number): this {
    this._length = value_;
    return this;
  }

  /**
   * allow empty string
   *
   * @readonly
   * @type {this}
   * @memberof StringValidator
   */
  public get allowEmpty(): this {
    this._allowEmpty = true;
    return this;
  }

  /**
   * value has to be a base64 encoded string
   *
   * @readonly
   * @type {this}
   * @memberof StringValidator
   */
  public get base64(): this {
    this._base64 = true;
    return this;
  }

  /**
   * value has to be a json string (stringified instance)
   *
   * @readonly
   * @type {this}
   * @memberof StringValidator
   */
  public get json(): this {
    this._json = true;
    return this;
  }

  /**
   * string has to be a valid ISO8601 date string
   *
   * @readonly
   * @type {this}
   * @memberof StringValidator
   */
  public get date(): this {
    this._date = true;
    return this;
  }

  /**
   * string has to be convertable to a number
   *
   * @readonly
   * @type {this}
   * @memberof StringValidator
   */
  public get numeric(): this {
    this._numeric = true;
    return this;
  }

  /**
   * string has to be an uuid
   *
   * @readonly
   * @type {this}
   * @memberof StringValidator
   */
  public get uuid(): this {
    this._uuid = true;
    return this;
  }

  /**
   * string has to be an email.
   * HINT: this validation is not perfect. False negative results may occure.
   *
   * @readonly
   * @type {this}
   * @memberof StringValidator
   */
  public get email(): this {
    this._mail = true;
    return this;
  }

  public get uri(): this {
    this._uri = true;
    return this;
  }

  public get url(): this {
    this._url = true;
    return this;
  }

  protected validateBaseType(value_: unknown): string {
    if (typeof value_ !== 'string') {
      this.throwValidationError('value is not a string');
    }

    if (!this._allowEmpty && value_ === '') {
      this.throwValidationError('string is empty');
    }

    if (this._length !== undefined && value_.length !== this._length) {
      this.throwValidationError('string has invalid length');
    }

    if (this._min && value_.length < this._min) {
      this.throwValidationError('string length is too short');
    }

    if (this._max && value_.length > this._max) {
      this.throwValidationError('string length is too long');
    }

    if (this._allowed) {
      let matched = false;

      for (let i = 0; i < this._allowed.length; i++) {
        if (this.matches(this._allowed[i], value_)) {
          matched = true;
          break;
        }
      }

      if (!matched) {
        this.throwValidationError('string is not allowed');
      }
    }

    if (this._denied) {
      for (let i = 0; i < this._denied.length; i++) {
        if (this.matches(this._denied[i], value_)) {
          this.throwValidationError('string is denied');
        }
      }
    }

    if (
      this._base64
      && !/^([0-9a-zA-Z+\/]{4})*(([0-9a-zA-Z+\/]{2}==)|([0-9a-zA-Z+\/]{3}=))?$/.test(value_)
    ) {
      this.throwValidationError('string is not base64 encoded');
    }

    if (this._json && !this.isJsonString(value_)) {
      this.throwValidationError('string is not a json string');
    }

    if (this._date && isNaN(new Date(value_).getTime())) {
      this.throwValidationError('string is not iso 8601 date');
    }

    if (this._numeric && isNaN(Number(value_))) {
      this.throwValidationError('string is not numeric');
    }

    if (
      this._uuid
      && !/^[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}$/.test(value_)
    ) {
      this.throwValidationError('string is not an uuid');
    }

    if (this._mail && !email.isValid(value_)) {
      this.throwValidationError('string is not an email');
    }

    if (this._uri && !uri.regex({ allowQuerySquareBrackets: true }).regex.test(value_)) {
      this.throwValidationError('string is not a uri');
    }

    if (this._url) {
      try {
        new URL(value_); // requires WebWorkers in browser
      } catch {
        this.throwValidationError('string is not a url');
      }
    }

    return value_;
  }

  protected matches(item_: string | RegExp, value_: string): boolean {
    if (typeof item_ === 'string') {
      return item_ === value_;
    } else {
      return item_.test(value_);
    }
  }

  private isJsonString(value_: string): boolean {
    try {
      JSON.parse(value_);
    } catch {
      return false;
    }

    return true;
  }
}
