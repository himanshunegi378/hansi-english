/**
 * Application error used to map Anki domain failures to HTTP responses.
 */
export class AnkiError extends Error {
  readonly code: string;
  readonly status: number;

  /**
   * Creates an Anki domain error with an HTTP-safe status and code.
   * @param status HTTP status code to return from route handlers.
   * @param code Stable machine-readable error code.
   * @param message Human-readable error message.
   */
  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "AnkiError";
    this.status = status;
    this.code = code;
  }
}

/**
 * Converts unknown failures into a consistent Anki error shape.
 * @param error Thrown value from a route or service boundary.
 * @returns A normalized Anki error instance.
 */
export function toAnkiError(error: unknown): AnkiError {
  if (error instanceof AnkiError) {
    return error;
  }

  if (error instanceof Error) {
    return new AnkiError(500, "INTERNAL_SERVER_ERROR", error.message || "Something went wrong.");
  }

  return new AnkiError(500, "INTERNAL_SERVER_ERROR", "Something went wrong.");
}
