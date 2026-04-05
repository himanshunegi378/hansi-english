import { redirect } from "next/navigation";
import { auth } from "@/auth";
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

  return <AnkiStudyPage deckId={deckId} />;
}
