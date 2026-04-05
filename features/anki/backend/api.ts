import { type ApiErrorResponse, type ApiSuccessResponse } from "./types";
import { AnkiError, toAnkiError } from "./errors";

/**
 * Reads a JSON request body and returns a validation-friendly error on failure.
 * @param request Incoming route handler request.
 * @returns Parsed JSON payload.
 */
export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new AnkiError(400, "INVALID_JSON", "Request body must be valid JSON.");
  }
}

/**
 * Builds a consistent JSON success response envelope.
 * @param data API response payload.
 * @param init Optional status and metadata.
 * @returns HTTP response with serialized JSON body.
 */
export function jsonSuccess<T>(
  data: T,
  init?: { meta?: Record<string, unknown>; status?: number },
): Response {
  const body: ApiSuccessResponse<T> = {
    data,
    ...(init?.meta ? { meta: init.meta } : {}),
  };

  return Response.json(body, {
    status: init?.status ?? 200,
  });
}

/**
 * Builds a consistent JSON error response envelope.
 * @param error Unknown thrown value from a route boundary.
 * @returns HTTP error response with a normalized payload.
 */
export function jsonError(error: unknown): Response {
  const normalizedError = toAnkiError(error);
  const body: ApiErrorResponse = {
    error: {
      code: normalizedError.code,
      message: normalizedError.message,
    },
  };

  return Response.json(body, {
    status: normalizedError.status,
  });
}
