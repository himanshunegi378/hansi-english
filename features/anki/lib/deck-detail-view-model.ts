import { format } from "date-fns";
import type { DeckDetail as DeckDetailDto } from "../backend/types";
import type { AnkiDeckDetailViewModel } from "../types/ui";

/**
 * Maps the raw deck detail payload into the page view model.
 * @param deck Raw deck detail data.
 * @returns Formatted deck view model.
 */
export function toDeckViewModel(deck: DeckDetailDto): AnkiDeckDetailViewModel {
  return {
    ...deck,
    cards: deck.cards.map((card) => ({
      ...card,
      nextReviewLabel: format(new Date(card.nextReview), "PPp"),
    })),
    studyHref: `/anki/${deck.id}/study`,
    totalCards: deck.cards.length,
  };
}
