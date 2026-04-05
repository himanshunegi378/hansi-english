import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
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

  return <AnkiDeckListPage />;
}
