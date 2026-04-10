/**
 * Application error used to map quiz domain failures to HTTP responses.
 */
export class QuizError extends Error {
  readonly code: string;
  readonly details?: Record<string, unknown>;
  readonly status: number;

  /**
   * Creates a quiz domain error with an HTTP-safe status and code.
   * @param status HTTP status code to return from route handlers.
   * @param code Stable machine-readable error code.
   * @param message Human-readable error message.
   * @param details Optional structured metadata for clients.
   */
  constructor(status: number, code: string, message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = "QuizError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Converts unknown failures into a consistent quiz error shape.
 * @param error Thrown value from a route or service boundary.
 * @returns A normalized quiz error instance.
 */
export function toQuizError(error: unknown): QuizError {
  if (error instanceof QuizError) {
    return error;
  }

  if (error instanceof Error) {
    return new QuizError(500, "INTERNAL_SERVER_ERROR", error.message || "Something went wrong.");
  }

  return new QuizError(500, "INTERNAL_SERVER_ERROR", "Something went wrong.");
}
