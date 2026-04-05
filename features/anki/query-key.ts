/**
 * Canonical TanStack Query keys for the Anki module.
 */
export const ankiQueryKeys = {
  all: ["anki"] as const,
  decks: {
    all: ["anki", "decks"] as const,
    detail: (deckId: string) => ["anki", "decks", "detail", deckId] as const,
    list: () => ["anki", "decks", "list"] as const,
  },
  study: {
    all: ["anki", "study"] as const,
    queue: (deckId: string) => ["anki", "study", "queue", deckId] as const,
  },
};
