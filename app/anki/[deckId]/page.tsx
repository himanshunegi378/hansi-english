import { redirect } from "next/navigation";
import { auth } from "@/auth";
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

  return <AnkiDeckDetailPage deckId={deckId} />;
}
