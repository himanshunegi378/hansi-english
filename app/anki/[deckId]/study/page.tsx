import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { AnkiError } from "@/features/anki/backend/errors";
import { getDeck, getStudyQueue } from "@/features/anki/backend/service";
import { AnkiStudyPage } from "@/features/anki/pages/anki-study-page";

interface AnkiStudyRouteProps {
  params: Promise<{
    deckId: string;
  }>;
}

/**
 * Renders the focused deck-study route for authenticated learners.
 * @param props Dynamic route params containing the deck id.
 * @returns The study-session page or `404` when the deck is missing.
 */
export default async function AnkiStudyRoute({ params }: AnkiStudyRouteProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { deckId } = await params;
  let deck;
  let queue;

  try {
    [deck, queue] = await Promise.all([getDeck(deckId), getStudyQueue(deckId)]);
  } catch (error) {
    if (error instanceof AnkiError && error.status === 404) {
      notFound();
    }

    throw error;
  }

  return (
    <AnkiStudyPage
      deckTitle={deck.name}
      cards={queue.data.map((card) => ({
        ...card,
        deckTitle: deck.name,
      }))}
    />
  );
}
