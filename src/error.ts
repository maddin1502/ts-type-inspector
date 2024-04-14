const VALIDATION_ERROR_MARKER = Symbol('VALIDATION_ERROR_MARKER');

export class ValidationError extends Error {
  protected readonly [VALIDATION_ERROR_MARKER] = true;
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

/**
 * determine whether a value is a ValidationError
 *
 * @export
 * @param {unknown} reason_
 * @returns {reason_ is ValidationError}
 * @since 3.2.0
 */
export function isValidationError(
  reason_: unknown
): reason_ is ValidationError {
  return (
    typeof reason_ === 'object' &&
    reason_ !== null &&
    VALIDATION_ERROR_MARKER in reason_ &&
    reason_[VALIDATION_ERROR_MARKER] === true
  );
}
