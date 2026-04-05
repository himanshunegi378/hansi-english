import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  CardDto,
  CreateCardInput,
  CreateDeckInput,
  DeckDetail,
  DeckSummary,
  ReviewCardInput,
  ReviewResult,
  StudyCardDto,
} from "../backend/types";

interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

interface ApiRequestResult<T, TMeta extends Record<string, unknown>> {
  data: T;
  meta: TMeta;
}

/**
 * Structured API error with HTTP metadata for client-side handling.
 */
export class AnkiApiError extends Error {
  code: string;
  status: number;

  /**
   * Creates a typed API error.
   * @param status HTTP status code.
   * @param code Stable server error code.
   * @param message User-facing error message.
   */
  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "AnkiApiError";
    this.code = code;
    this.status = status;
  }
}

/**
 * Parses a JSON API response and preserves typed metadata.
 * @param response Fetch response object.
 * @returns Parsed API payload with metadata.
 */
async function parseResponse<T, TMeta extends Record<string, unknown> = Record<string, never>>(
  response: Response,
): Promise<ApiRequestResult<T, TMeta>> {
  if (response.status === 204) {
    return {
      data: undefined as T,
      meta: {} as TMeta,
    };
  }

  const payload = (await response.json()) as
    | ApiErrorResponse
    | ApiSuccessResponse<T>;

  if (!response.ok) {
    if ("error" in payload) {
      throw new AnkiApiError(
        response.status,
        payload.error.code,
        payload.error.message,
      );
    }

    throw new AnkiApiError(response.status, "UNKNOWN_ERROR", "Request failed.");
  }

  return {
    data: (payload as ApiSuccessResponse<T>).data,
    meta:
      "meta" in payload && payload.meta
        ? (payload.meta as TMeta)
        : ({} as TMeta),
  };
}

/**
 * Executes an Anki API request and unwraps the standard response envelope.
 * @param path API path under `/api/v1`.
 * @param options Fetch options and optional JSON body.
 * @returns The typed `data` payload from the API response.
 */
async function request<T>(path: string, options?: FetchOptions): Promise<T> {
  const headers = new Headers(options?.headers);

  if (options?.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    ...options,
    body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
    headers,
  });

  const payload = await parseResponse<T>(response);
  return payload.data;
}

/**
 * Executes an Anki API request and returns both data and metadata.
 * @param path API path under `/api/v1`.
 * @param options Fetch options and optional JSON body.
 * @returns The typed `data` payload and `meta` from the API response.
 */
async function requestWithMeta<
  T,
  TMeta extends Record<string, unknown> = Record<string, never>,
>(path: string, options?: FetchOptions): Promise<ApiRequestResult<T, TMeta>> {
  const headers = new Headers(options?.headers);

  if (options?.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    ...options,
    body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
    headers,
  });

  return parseResponse<T, TMeta>(response);
}

/**
 * Loads the current user's deck list from the REST API.
 * @returns Deck summaries for the authenticated user.
 */
export function listDecksRequest() {
  return request<DeckSummary[]>("/api/v1/decks", {
    cache: "no-store",
  });
}

/**
 * Creates a new deck.
 * @param input Deck name and description.
 * @returns The created deck summary payload.
 */
export function createDeckRequest(input: CreateDeckInput) {
  return request<{
    createdAt: string;
    description: string | null;
    id: string;
    name: string;
  }>("/api/v1/decks", {
    body: input,
    method: "POST",
  });
}

/**
 * Loads a single deck with all of its cards.
 * @param deckId Deck id to fetch.
 * @returns The deck detail payload.
 */
export function getDeckRequest(deckId: string) {
  return request<DeckDetail>(`/api/v1/decks/${deckId}`, {
    cache: "no-store",
  });
}

/**
 * Deletes a deck by id.
 * @param deckId Deck id to delete.
 */
export function deleteDeckRequest(deckId: string) {
  return request<void>(`/api/v1/decks/${deckId}`, {
    method: "DELETE",
  });
}

/**
 * Creates a new card in a deck.
 * @param deckId Parent deck id.
 * @param input Card front and back values.
 * @returns The created card payload.
 */
export function createCardRequest(deckId: string, input: CreateCardInput) {
  return request<CardDto>(`/api/v1/decks/${deckId}/cards`, {
    body: input,
    method: "POST",
  });
}

/**
 * Updates an existing card.
 * @param cardId Card id to update.
 * @param input Updated card values.
 * @returns The updated card payload.
 */
export function updateCardRequest(cardId: string, input: CreateCardInput) {
  return request<CardDto>(`/api/v1/cards/${cardId}`, {
    body: input,
    method: "PUT",
  });
}

/**
 * Deletes an existing card.
 * @param cardId Card id to delete.
 */
export function deleteCardRequest(cardId: string) {
  return request<void>(`/api/v1/cards/${cardId}`, {
    method: "DELETE",
  });
}

/**
 * Loads the due card queue for a deck.
 * @param deckId Deck id to fetch.
 * @returns Due cards and total due metadata.
 */
export async function getStudyQueueRequest(deckId: string) {
  const payload = await requestWithMeta<StudyCardDto[], { totalDue?: number }>(
    `/api/v1/decks/${deckId}/study`,
    {
    cache: "no-store",
    },
  );

  return {
    data: payload.data,
    meta: {
      totalDue: payload.meta.totalDue ?? payload.data.length,
    },
  };
}

/**
 * Submits a review grade for a card.
 * @param cardId Card id to review.
 * @param input Review grade payload.
 * @returns The updated review state.
 */
export function reviewCardRequest(cardId: string, input: ReviewCardInput) {
  return request<ReviewResult>(`/api/v1/cards/${cardId}/review`, {
    body: input,
    method: "POST",
  });
}
