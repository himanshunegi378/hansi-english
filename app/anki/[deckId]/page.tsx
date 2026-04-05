import { format, formatDistanceToNow } from "date-fns";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { AnkiError } from "@/features/anki/backend/errors";
import { getDeck } from "@/features/anki/backend/service";
import { AnkiDeckDetailPage } from "@/features/anki/pages/anki-deck-detail-page";

interface AnkiDeckPageProps {
  params: Promise<{
    deckId: string;
  }>;
}

/**
 * Renders one deck-management route for authenticated learners.
 * @param props Dynamic route params containing the deck id.
 * @returns The deck detail page or `404` when missing.
 */
export default async function AnkiDeckPage({ params }: AnkiDeckPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { deckId } = await params;
  let deck;

  try {
    deck = await getDeck(deckId);
  } catch (error) {
    if (error instanceof AnkiError && error.status === 404) {
      notFound();
    }

    throw error;
  }

  const now = new Date();

  return (
    <AnkiDeckDetailPage
      deck={{
        ...deck,
        cards: deck.cards.map((card) => ({
          ...card,
          nextReviewLabel: format(new Date(card.nextReview), "PPp"),
        })),
        createdAtLabel: formatDistanceToNow(new Date(deck.createdAt), { addSuffix: true }),
        dueCards: deck.cards.filter((card) => new Date(card.nextReview).getTime() <= now.getTime()).length,
        studyHref: `/anki/${deck.id}/study`,
        totalCards: deck.cards.length,
        updatedAtLabel: formatDistanceToNow(new Date(deck.updatedAt), { addSuffix: true }),
      }}
    />
  );
}
