export const VALIDATION_ERROR_MARKER = '__isValidationError';

export class ValidationError extends Error {
  public readonly [VALIDATION_ERROR_MARKER] = true;
  public readonly propertyPath: string | undefined;
  public readonly originalErrorMessage: string;

  constructor(
    errorMessage_: string,
    public readonly propertyTrace?: ReadonlyArray<PropertyKey>,
    public readonly subErrors?: ReadonlyArray<Error>
  ) {
    const propertyPath = propertyTrace?.join('.');
    let errorMessage: string;

    if (propertyPath) {
      errorMessage = `${errorMessage_} (${propertyPath})`;
    } else {
      errorMessage = errorMessage_;
    }

    super(errorMessage);

    if (propertyPath) {
      this.propertyPath = propertyPath;
    }

    this.originalErrorMessage = errorMessage_;
  }
}
