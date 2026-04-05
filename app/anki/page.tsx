import type { Metadata } from "next";
import { formatDistanceToNow } from "date-fns";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { listDecks } from "@/features/anki/backend/service";
import { AnkiDeckListPage } from "@/features/anki/pages/anki-deck-list-page";

export const metadata: Metadata = {
  title: "Anki Decks - Hansi English",
  description: "Review and manage your spaced-repetition decks in Hansi English.",
};

/**
 * Renders the deck-library route for authenticated learners.
 * @returns The Anki deck list page.
 */
export default async function AnkiPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const decks = await listDecks();

  return (
    <AnkiDeckListPage
      decks={decks.map((deck) => ({
        ...deck,
        createdAtLabel: formatDistanceToNow(new Date(deck.createdAt), {
          addSuffix: true,
        }),
        href: `/anki/${deck.id}`,
        studyHref: `/anki/${deck.id}/study`,
      }))}
    />
  );
}
