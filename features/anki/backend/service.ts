import { createCardSchema, createDeckSchema, reviewCardSchema, updateCardSchema } from "./schemas";
import { requireAnkiUserId } from "./auth";
import { AnkiError } from "./errors";
import { toCardDto, toDeckDetail, toDeckSummary, toReviewResult, toStudyCardDto } from "./mappers";
import { calculateReviewState } from "./review";
import * as repository from "./repository";
import type { CreateCardInput, CreateDeckInput, ReviewCardInput, StudyQueueResponse, UpdateCardInput } from "./types";

/**
 * Lists all decks for the current user with total and due card counts.
 * @returns Serialized deck summaries for the authenticated user.
 */
export async function listDecks() {
  const userId = await requireAnkiUserId();
  const now = new Date();
  const decks = await repository.listDecksByUserId(userId, now);

  return decks.map((deck) =>
    toDeckSummary({
      id: deck.id,
      name: deck.name,
      description: deck.description,
      createdAt: deck.createdAt,
      totalCards: deck._count.cards,
      dueCards: deck.cards.length,
    }),
  );
}

/**
 * Creates a new deck for the current user.
 * @param input Raw request payload.
 * @returns Serialized deck response.
 */
export async function createDeck(input: CreateDeckInput | unknown) {
  const userId = await requireAnkiUserId();
  const result = createDeckSchema.safeParse(input);

  if (!result.success) {
    throw new AnkiError(400, "VALIDATION_ERROR", result.error.issues[0]?.message ?? "Invalid deck payload.");
  }

  const deck = await repository.createDeck(userId, result.data);

  return {
    id: deck.id,
    name: deck.name,
    description: deck.description,
    createdAt: deck.createdAt.toISOString(),
  };
}

/**
 * Loads one deck and its cards for the current user.
 * @param deckId Deck id from the route params.
 * @returns Serialized deck detail.
 */
export async function getDeck(deckId: string) {
  const userId = await requireAnkiUserId();
  const deck = await repository.findDeckById(deckId, userId);

  if (!deck) {
    throw new AnkiError(404, "NOT_FOUND", "Deck not found.");
  }

  return toDeckDetail(deck);
}

/**
 * Deletes a user-owned deck.
 * @param deckId Deck id from the route params.
 */
export async function removeDeck(deckId: string): Promise<void> {
  const userId = await requireAnkiUserId();
  const deck = await repository.findDeckById(deckId, userId);

  if (!deck) {
    throw new AnkiError(404, "NOT_FOUND", "Deck not found.");
  }

  await repository.deleteDeck(deckId);
}

/**
 * Creates a new card inside a user-owned deck.
 * @param deckId Deck id from the route params.
 * @param input Raw request payload.
 * @returns Serialized card response.
 */
export async function addCard(deckId: string, input: CreateCardInput | unknown) {
  const userId = await requireAnkiUserId();
  const deck = await repository.findDeckById(deckId, userId);

  if (!deck) {
    throw new AnkiError(404, "NOT_FOUND", "Deck not found.");
  }

  const result = createCardSchema.safeParse(input);
  if (!result.success) {
    throw new AnkiError(400, "VALIDATION_ERROR", result.error.issues[0]?.message ?? "Invalid card payload.");
  }

  const card = await repository.createCard(deckId, result.data);
  return toCardDto(card);
}

/**
 * Updates a user-owned card.
 * @param cardId Card id from the route params.
 * @param input Raw request payload.
 * @returns Serialized updated card.
 */
export async function editCard(cardId: string, input: UpdateCardInput | unknown) {
  const userId = await requireAnkiUserId();
  const card = await repository.findCardById(cardId, userId);

  if (!card) {
    throw new AnkiError(404, "NOT_FOUND", "Card not found.");
  }

  const result = updateCardSchema.safeParse(input);
  if (!result.success) {
    throw new AnkiError(400, "VALIDATION_ERROR", result.error.issues[0]?.message ?? "Invalid card payload.");
  }

  const updatedCard = await repository.updateCard(cardId, result.data);
  return toCardDto(updatedCard);
}

/**
 * Deletes a user-owned card.
 * @param cardId Card id from the route params.
 */
export async function removeCard(cardId: string): Promise<void> {
  const userId = await requireAnkiUserId();
  const card = await repository.findCardById(cardId, userId);

  if (!card) {
    throw new AnkiError(404, "NOT_FOUND", "Card not found.");
  }

  await repository.deleteCard(cardId);
}

/**
 * Lists due cards for a user-owned deck.
 * @param deckId Deck id from the route params.
 * @returns Study queue payload with metadata.
 */
export async function getStudyQueue(deckId: string): Promise<StudyQueueResponse> {
  const userId = await requireAnkiUserId();
  const deck = await repository.findDeckById(deckId, userId);

  if (!deck) {
    throw new AnkiError(404, "NOT_FOUND", "Deck not found.");
  }

  const dueCards = await repository.listDueCards(deckId, userId, new Date());

  return {
    data: dueCards.map(toStudyCardDto),
    meta: {
      totalDue: dueCards.length,
    },
  };
}

/**
 * Applies a spaced-repetition review to a user-owned card.
 * @param cardId Card id from the route params.
 * @param input Raw request payload.
 * @returns Updated review state for the card.
 */
export async function reviewCard(cardId: string, input: ReviewCardInput | unknown) {
  const userId = await requireAnkiUserId();
  const card = await repository.findCardById(cardId, userId);

  if (!card) {
    throw new AnkiError(404, "NOT_FOUND", "Card not found.");
  }

  const result = reviewCardSchema.safeParse(input);
  if (!result.success) {
    throw new AnkiError(400, "VALIDATION_ERROR", result.error.issues[0]?.message ?? "Invalid review payload.");
  }

  const now = new Date();
  const nextState = calculateReviewState({
    now,
    grade: result.data.grade,
    interval: card.interval,
    ease: card.ease,
  });

  const updatedCard = await repository.updateCardReview({
    cardId,
    userId,
    grade: result.data.grade,
    newInterval: nextState.interval,
    newEase: nextState.ease,
    nextReview: nextState.nextReview,
  });

  return toReviewResult(updatedCard);
}
