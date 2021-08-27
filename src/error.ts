export const VALIDATION_ERROR_MARKER = '__isValidationError';

export class ValidationError extends Error {
  public readonly [VALIDATION_ERROR_MARKER] = true;
  public readonly propertyPath: string | undefined;

  constructor(
    errorMessage_: string,
    public readonly propertyTrace?: ReadonlyArray<PropertyKey>,
    public readonly subErrors?: ReadonlyArray<Error>
  ) {
    super(errorMessage_);

    if (this.propertyTrace && this.propertyTrace.length > 0) {
      this.propertyPath = this.propertyTrace.join('.');
    }
  }
}
