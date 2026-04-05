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

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = (await response.json()) as
    | ApiErrorResponse
    | ApiSuccessResponse<T>;

  if (!response.ok) {
    throw new Error("error" in payload ? payload.error.message : "Request failed.");
  }

  return (payload as ApiSuccessResponse<T>).data;
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
  const response = await fetch(`/api/v1/decks/${deckId}/study`, {
    cache: "no-store",
  });
  const payload = (await response.json()) as
    | ApiErrorResponse
    | ApiSuccessResponse<StudyCardDto[]>;

  if (!response.ok) {
    throw new Error("error" in payload ? payload.error.message : "Request failed.");
  }

  return {
    data: (payload as ApiSuccessResponse<StudyCardDto[]>).data,
    meta: "meta" in payload && payload.meta ? payload.meta : {},
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
