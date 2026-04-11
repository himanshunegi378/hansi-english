import { queryOptions } from "@tanstack/react-query";
import { listStoriesByDeckIdAction } from "@/features/create-story-from-deck";
import {
  getDeckRequest,
  getStudyQueueRequest,
  listDecksRequest,
} from "./lib/anki-api-client";
import { ankiQueryKeys } from "./query-key";

/**
 * Creates query options for loading the authenticated user's decks.
 * @returns React Query options for the deck list.
 */
export function listDecksQueryOptions() {
  return queryOptions({
    queryKey: ankiQueryKeys.decks.list(),
    queryFn: listDecksRequest,
  });
}

/**
 * Creates query options for loading one deck and its cards.
 * @param deckId Deck id to fetch.
 * @returns React Query options for deck detail.
 */
export function deckDetailQueryOptions(deckId: string) {
  return queryOptions({
    queryKey: ankiQueryKeys.decks.detail(deckId),
    queryFn: () => getDeckRequest(deckId),
  });
}

/**
 * Creates query options for loading all saved stories linked to a deck.
 * @param deckId Deck id to fetch stories for.
 * @returns React Query options for deck stories.
 */
export function deckStoriesQueryOptions(deckId: string) {
  return queryOptions({
    queryKey: ankiQueryKeys.decks.stories(deckId),
    queryFn: () => listStoriesByDeckIdAction(deckId),
  });
}

/**
 * Creates query options for loading a deck's study queue.
 * @param deckId Deck id to fetch.
 * @returns React Query options for the study queue.
 */
export function studyQueueQueryOptions(deckId: string) {
  return queryOptions({
    queryKey: ankiQueryKeys.study.queue(deckId),
    queryFn: () => getStudyQueueRequest(deckId),
  });
}
