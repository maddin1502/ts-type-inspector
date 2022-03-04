import { Validator } from '.';
import { email, uri } from '@sideway/address';
import { URL } from 'url';

/**
 * Validator for string values.
 *
 * @export
 * @class StringValidator
 * @extends {Validator<string>}
 */
export class StringValidator extends Validator<string> {
  /**
   * define minimum string length
   *
   * @param {number} min_
   * @return {*}  {this}
   * @memberof StringValidator
   */
  public shortest(min_: number): this {
    return this.setupCondition(value_ => this.checkShortest(value_, min_));
  }

  /**
   * define maximum string length
   *
   * @param {number} max_
   * @return {*}  {this}
   * @memberof StringValidator
   */
  public longest(max_: number): this {
    return this.setupCondition(value_ => this.checkLongest(value_, max_));
  }

  /**
   * define accepted values or patterns
   *
   * @param {(...ReadonlyArray<(string | RegExp)>)} accepted_
   * @return {*}  {this}
   * @memberof StringValidator
   */
  public accept(...accepted_: ReadonlyArray<(string | RegExp)>): this {
    return this.setupCondition(value_ => this.checkAccept(value_, accepted_));
  }

  /**
   * define rejected values or patterns
   *
   * @param {(...ReadonlyArray<(string | RegExp)>)} rejected_
   * @return {*}  {this}
   * @memberof StringValidator
   */
  public reject(...rejected_: ReadonlyArray<(string | RegExp)>): this {
    return this.setupCondition(value_ => this.checkRejected(value_, rejected_));
  }

  /**
   * specify exact string length
   *
   * @param {number} length_
   * @return {*}  {this}
   * @memberof StringValidator
   */
  public length(length_: number): this {
    return this.setupCondition(value_ => this.checkLength(value_, length_));
  }

  /**
   * reject empty string
   *
   * @readonly
   * @type {this}
   * @memberof StringValidator
   */
  public get rejectEmpty(): this {
    return this.setupCondition(value_ => this.checkEmpty(value_));
  }

  /**
   * value has to be a base64 encoded string
   *
   * @readonly
   * @type {this}
   * @memberof StringValidator
   */
  public get base64(): this {
    return this.setupCondition(value_ => this.checkBase64(value_));
  }

  /**
   * value has to be a json string (stringified instance)
   *
   * @readonly
   * @type {this}
   * @memberof StringValidator
   */
  public get json(): this {
    return this.setupCondition(value_ => this.checkJson(value_));
  }

  /**
   * string has to be a valid ISO8601 date string
   *
   * @readonly
   * @type {this}
   * @memberof StringValidator
   */
  public get date(): this {
    return this.setupCondition(value_ => this.checkDate(value_));
  }

  /**
   * string has to be convertable to a number
   *
   * @readonly
   * @type {this}
   * @memberof StringValidator
   */
  public get numeric(): this {
    return this.setupCondition(value_ => this.checkNumeric(value_));
  }

  /**
   * string has to be an uuid
   *
   * @readonly
   * @type {this}
   * @memberof StringValidator
   */
  public get uuid(): this {
    return this.setupCondition(value_ => this.checkUuid(value_));
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
