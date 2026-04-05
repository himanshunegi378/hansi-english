import type { Card, Deck } from "@/generated/prisma/client";
import type { CardDto, DeckDetail, DeckSummary, ReviewResult, StudyCardDto } from "./types";

/**
 * Converts a Prisma card record into the public API card shape.
 * @param card Prisma card record.
 * @returns Serialized card payload.
 */
export function toCardDto(card: Card): CardDto {
  return {
    id: card.id,
    deckId: card.deckId,
    front: card.front,
    back: card.back,
    interval: card.interval,
    ease: card.ease,
    nextReview: card.nextReview.toISOString(),
    createdAt: card.createdAt.toISOString(),
    updatedAt: card.updatedAt.toISOString(),
  };
}

/**
 * Converts a Prisma deck plus cards into the public deck detail shape.
 * @param deck Deck record with nested cards.
 * @returns Serialized deck payload.
 */
export function toDeckDetail(deck: Deck & { cards: Card[] }): DeckDetail {
  return {
    id: deck.id,
    name: deck.name,
    description: deck.description,
    createdAt: deck.createdAt.toISOString(),
    updatedAt: deck.updatedAt.toISOString(),
    cards: deck.cards.map(toCardDto),
  };
}

/**
 * Converts a Prisma card into the study queue payload.
 * @param card Prisma card record.
 * @returns Study queue item.
 */
export function toStudyCardDto(card: Card): StudyCardDto {
  return {
    id: card.id,
    front: card.front,
    back: card.back,
  };
}

/**
 * Creates a serialized deck summary with computed counts.
 * @param deck Deck fields and card counts.
 * @returns Deck summary payload.
 */
export function toDeckSummary(deck: {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  totalCards: number;
  dueCards: number;
}): DeckSummary {
  return {
    id: deck.id,
    name: deck.name,
    description: deck.description,
    totalCards: deck.totalCards,
    dueCards: deck.dueCards,
    createdAt: deck.createdAt.toISOString(),
  };
}

/**
 * Converts updated review state into the review response shape.
 * @param card Updated card record after review submission.
 * @returns Review response payload.
 */
export function toReviewResult(card: Card): ReviewResult {
  return {
    id: card.id,
    newInterval: card.interval,
    newEase: card.ease,
    nextReview: card.nextReview.toISOString(),
  };
}
