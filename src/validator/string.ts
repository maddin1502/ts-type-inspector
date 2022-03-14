import { email, uri } from '@sideway/address';
import { Validator } from '.';
import type { Validatable } from '../types';

export type StringValidatable = Validatable<string> & {
  /**
   * define minimum string length
   *
   * @since 1.0.0
   */
  shortest(min_: number): StringValidatable;
  /**
   * define maximum string length
   *
   * @since 1.0.0
   */
  longest(max_: number): StringValidatable;
  /**
   * define accepted values or patterns
   *
   * @since 1.0.0
   */
  accept(...accepted_: ReadonlyArray<(string | RegExp)>): StringValidatable;
  /**
   * define rejected values or patterns
   *
   * @since 1.0.0
   */
  reject(...rejected_: ReadonlyArray<(string | RegExp)>): StringValidatable;
  /**
   * specify exact string length
   *
   * @since 1.0.0
   */
  length(length_: number): StringValidatable;
  /**
   * reject empty string
   *
   * @since 1.0.0
   */
  get rejectEmpty(): StringValidatable;
  /**
   * value has to be a base64 encoded string
   *
   * @since 1.0.0
   */
  get base64(): StringValidatable;
  /**
   * value has to be a json string (stringified instance)
   * HINT: This check uses try-catch on JSON.parse. Keep this in mind for performance reasons (multiple parsing)
   *
   * @since 1.0.0
   */
  get json(): StringValidatable;
  /**
   * string has to be a valid ISO8601 date string
   *
   * @since 1.0.0
   */
  get date(): StringValidatable;
  /**
   * string has to be convertable to a number
   *
   * @since 1.0.0
   */
  get numeric(): StringValidatable;
  /**
   * string has to be an uuid (e.g. db91dc9f-9481-4843-a74b-4d027114102e)
   *
   * @since 1.0.0
   */
  get uuid(): StringValidatable;
  /**
   * string has to be an email.
   *
   * @since 1.0.0
   */
  get email(): StringValidatable;
  /**
   * string has to be an uri
   *
   * @since 1.0.0
   */
  get uri(): StringValidatable;
  /**
   * string has to be an url
   *
   * @since 1.0.0
   * @requires "WebWorker" lib when used in frontend web application
   */
  get url(): StringValidatable;
  /**
   * string has to contain hexadecimal characters only
   *
   * @since 1.0.0
   */
  get hex(): StringValidatable;
};

/**
 * Validator for string values.
 *
 * @since 1.0.0
 * @export
 * @class StringValidator
 * @extends {Validator<string>}
 * @implements {StringValidatable}
 */
export class StringValidator
  extends Validator<string>
  implements StringValidatable
{
  public shortest(min_: number): this {
    return this.setupCondition(value_ => this.checkShortest(value_, min_));
  }

  public longest(max_: number): this {
    return this.setupCondition(value_ => this.checkLongest(value_, max_));
  }

  public accept(...accepted_: ReadonlyArray<(string | RegExp)>): this {
    return this.setupCondition(value_ => this.checkAccepted(value_, accepted_));
  }

  public reject(...rejected_: ReadonlyArray<(string | RegExp)>): this {
    return this.setupCondition(value_ => this.checkRejected(value_, rejected_));
  }

  public length(length_: number): this {
    return this.setupCondition(value_ => this.checkLength(value_, length_));
  }

  public get rejectEmpty(): this {
    return this.setupCondition(value_ => this.checkEmpty(value_));
  }

  public get base64(): this {
    return this.setupCondition(value_ => this.checkBase64(value_));
  }

  public get json(): this {
    return this.setupCondition(value_ => this.checkJson(value_));
  }

  public get date(): this {
    return this.setupCondition(value_ => this.checkDate(value_));
  }

  public get numeric(): this {
    return this.setupCondition(value_ => this.checkNumeric(value_));
  }

  public get uuid(): this {
    return this.setupCondition(value_ => this.checkUuid(value_));
  }

  public get email(): this {
    return this.setupCondition(value_ => this.checkEmail(value_));
  }

  public get uri(): this {
    return this.setupCondition(value_ => this.checkUri(value_));
  }

  public get url(): this {
    return this.setupCondition(value_ => this.checkUrl(value_));
  }

  public get hex(): this {
    return this.setupCondition(value_ => this.checkHex(value_));
  }

  protected validateBaseType(value_: unknown): string {
    if (typeof value_ !== 'string') {
      this.throwValidationError('value is not a string');
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

  private checkEmpty(value_: string): void {
    if (value_ === '') {
      this.throwValidationError('string is empty');
    }
  }

  private checkShortest(value_: string, shortest_: number): void {
    if (value_.length < shortest_) {
      this.throwValidationError('string length is too short');
    }
  }

  private checkLongest(value_: string, longest_: number): void {
    if (value_.length > longest_) {
      this.throwValidationError('string length is too long');
    }
  }

  private checkLength(value_: string, length_: number): void {
    if (value_.length !== length_) {
      this.throwValidationError('string has invalid length');
    }
  }

  private checkAccepted(value_: string, accepted_: ReadonlyArray<(string | RegExp)>): void {
    for (let i = 0; i < accepted_.length; i++) {
      if (this.matches(accepted_[i], value_)) {
        return;
      }
    }

    this.throwValidationError('string is not accepted');
  }

  private checkRejected(value_: string, rejected_: ReadonlyArray<(string | RegExp)>): void {
    for (let i = 0; i < rejected_.length; i++) {
      if (this.matches(rejected_[i], value_)) {
        this.throwValidationError('string is rejected');
      }
    }
  }

  private checkBase64(value_: string): void {
    if (!/^([0-9a-zA-Z+\/]{4})*(([0-9a-zA-Z+\/]{2}==)|([0-9a-zA-Z+\/]{3}=))?$/.test(value_)) {
      this.throwValidationError('string is not base64 encoded');
    }
  }

  private checkJson(value_: string): void {
    if (!this.isJsonString(value_)) {
      this.throwValidationError('string is not a valid json string');
    }
  }

  private checkDate(value_: string): void {
    if (isNaN(new Date(value_).getTime())) {
      this.throwValidationError('string is not iso 8601 date string');
    }
  }

  private checkNumeric(value_: string): void {
    if (!isFinite(Number(value_))) {
      this.throwValidationError('string is not numeric');
    }
  }

  private checkUuid(value_: string): void {
    if (!/^[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}$/.test(value_)) {
      this.throwValidationError('string is not an uuid');
    }
  }

  private checkHex(value_: string): void {
    if (!/^[0-9a-fA-F]+$/.test(value_)) {
      this.throwValidationError('string is not a hexadecimal value');
    }
  }

  private checkEmail(value_: string): void {
    if (!email.isValid(value_)) {
      this.throwValidationError('string is not an email address');
    }
  }

  private checkUri(value_: string): void {
    if (!uri.regex({ allowQuerySquareBrackets: true }).regex.test(value_)) {
      this.throwValidationError('string is not a uri');
    }
  }

  private checkUrl(value_: string): void {
    if (!URL) {
      this.throwValidationError('URL is not defined! Please use "Webworker" lib for frontend web applications');
    }

    try {
      new URL(value_); // requires WebWorkers in browser
    } catch {
      this.throwValidationError('string is not a url');
    }
  }
}
