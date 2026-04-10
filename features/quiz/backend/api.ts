import type { ApiErrorResponse, ApiSuccessResponse } from "./types";
import { QuizError, toQuizError } from "./errors";

/**
 * Reads a JSON request body and returns a validation-friendly error on failure.
 * @param request Incoming route handler request.
 * @returns Parsed JSON payload.
 */
export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new QuizError(400, "INVALID_JSON", "Request body must be valid JSON.");
  }
}

/**
 * Reads an optional JSON request body, allowing empty payloads while rejecting malformed JSON.
 * @param request Incoming route handler request.
 * @returns Parsed JSON payload or an empty object when the body is empty.
 */
export async function readOptionalJsonBody(request: Request): Promise<unknown> {
  const rawBody = await request.text();

  if (rawBody.trim().length === 0) {
    return {};
  }

  try {
    return JSON.parse(rawBody) as unknown;
  } catch {
    throw new QuizError(400, "INVALID_JSON", "Request body must be valid JSON.");
  }
}

/**
 * Builds a consistent JSON success response envelope.
 * @param data API response payload.
 * @param init Optional response metadata.
 * @returns HTTP response with serialized JSON body.
 */
export function jsonSuccess<T>(data: T, init?: { status?: number }): Response {
  const body: ApiSuccessResponse<T> = {
    success: true,
    data,
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
  const normalizedError = toQuizError(error);
  const body: ApiErrorResponse = {
    success: false,
    error: {
      code: normalizedError.code,
      message: normalizedError.message,
      ...(normalizedError.details ? { details: normalizedError.details } : {}),
    },
  };

  return Response.json(body, {
    status: normalizedError.status,
  });
}
