import { defaults, validator as patternValidator } from '@hbc/id-utils';
import { validating } from '@hbc/utils';
import { RangeValidator, RangeValidatorInterface } from './range';

type PatternConfigType = { format: string, alphabet: string };

export class StringValidator
  extends RangeValidator<string, number, string | RegExp>
  implements StringValidatorInterface
{
  private _length: number | undefined;
  private _allowEmpty: boolean;
  private _base64: boolean;
  private _json: boolean;
  private _date: boolean;
  private _numeric: boolean;
  private _patternConfig: PatternConfigType | undefined;
  private _uuid: boolean;
  private _mail: boolean;
  protected readonly minErrorMessage: string = 'string length is too short';
  protected readonly maxErrorMessage: string = 'string length is too long';

  constructor() {
    super();
    this._allowEmpty = false;
    this._base64 = false;
    this._json = false;
    this._date = false;
    this._numeric = false;
    this._uuid = false;
    this._mail = false;
  }

  public length(value_: number): this {
    this._length = value_;
    return this;
  }

  public allowEmpty(): this {
    this._allowEmpty = true;
    return this;
  }

  public base64(): this {
    this._base64 = true;
    return this;
  }

  public json(): this {
    this._json = true;
    return this;
  }

  public date(): this {
    this._date = true;
    return this;
  }

  public numeric(): this {
    this._numeric = true;
    return this;
  }

  public pattern(config_: PatternConfigType): this {
    this._patternConfig = config_;
    return this;
  }

  public uuid(): this {
    this._uuid = true;
    return this;
  }

  public email(): this {
    this._mail = true;
    return this;
  }

  protected validateValue(value_: unknown): string {
    if (typeof value_ !== 'string') {
      this.throwValidationError('value is not a string');
    }

    if (!this._allowEmpty && value_ === '') {
      this.throwValidationError('value is empty');
    }

    if (this._length !== undefined && value_.length !== this._length) {
      this.throwValidationError('value has invalid length');
    }

    if (this._base64) {
      try {
        validating.base64(value_);
      } catch {
        this.throwValidationError('string is not base64 encoded');
      }
    }

    if (this._json && !this.isJsonString(value_)) {
      this.throwValidationError('value is not json');
    }

    if (this._date && isNaN(new Date(value_).getTime())) {
      this.throwValidationError('string is not iso 8601 date');
    }

    if (this._numeric && isNaN(Number(value_))) {
      this.throwValidationError('string is not numeric');
    }

    if (this._patternConfig !== undefined && !patternValidator.isValid(value_, this._patternConfig.format, this._patternConfig.alphabet)) {
      this.throwValidationError('string does not match pattern');
    }

    if (this._uuid && !patternValidator.isValid(value_, defaults.structure, defaults.alphabet)) {
      this.throwValidationError('string is not an uuid');
    }

    // regex and explanation: https://ui.dev/validate-email-address-javascript/
    if (
      this._mail
      && ! /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.([a-zA-Z](-?[a-zA-Z0-9])+|[0-9]{3})$/.test(value_)
    ) {
      this.throwValidationError('string is not an email');
    }

    return super.validateValue(value_);
  }

  protected applyMin(min_: number, value_: string): boolean {
    return value_.length >= min_;
  }

  protected applyMax(max_: number, value_: string): boolean {
    return value_.length <= max_;
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

/**
 * Validator for string values.
 * EMPTY STRINGS ARE REJECTED BY DEFAULT! Use "allowEmpty()" to allow empty strings
 *
 * @export
 * @interface StringValidatorInterface
 * @extends {(RangeValidatorInterface<string, number, string | RegExp>)}
 */
export interface StringValidatorInterface extends RangeValidatorInterface<string, number, string | RegExp> {
  /**
   * value has to match a specific string length
   *
   * @param {number} value_
   * @return {*}  {this}
   * @memberof StringValidatorInterface
   */
  length(value_: number): this;
  /**
   * allow empty string
   *
   * @return {*}  {this}
   * @memberof StringValidatorInterface
   */
  allowEmpty(): this;
  /**
   * value has to be a json string (stringified instance)
   *
   * @return {*}  {this}
   * @memberof StringValidatorInterface
   */
  json(): this;
  /**
   * value has to be a base64 encoded string
   *
   * @return {*}  {this}
   * @memberof StringValidatorInterface
   */
  base64(): this;
  /**
   * string has to be a valid ISO8601 date string
   *
   * @return {*}  {this}
   * @memberof StringValidatorInterface
   */
  date(): this;
  /**
   * string has to be convertable to a number
   *
   * @return {*}  {this}
   * @memberof StringValidatorInterface
   */
  numeric(): this;
  /**
   * string has to match a specific pattern with specific characters
   *
   * @param {PatternConfigType} config_
   * @return {*}  {this}
   * @memberof StringValidatorInterface
   */
  pattern(config_: PatternConfigType): this;
  /**
   * string has to be an uuid
   *
   * @return {*}  {this}
   * @memberof StringValidatorInterface
   */
  uuid(): this;
  /**
   * string has to be an email
   *
   * @return {*}  {this}
   * @memberof StringValidatorInterface
   */
  email(): this;
}
