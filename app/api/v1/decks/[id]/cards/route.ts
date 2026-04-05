import { jsonError, jsonSuccess, readJsonBody } from "@/features/anki/backend/api";
import { addCard } from "@/features/anki/backend/service";

export const dynamic = "force-dynamic";

interface DeckCardsRouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Creates a new card in a user-owned deck.
 * @param request Incoming JSON request containing card fields.
 * @param context Next route context containing the deck id.
 * @returns JSON response containing the created card.
 */
export async function POST(request: Request, context: DeckCardsRouteContext) {
  try {
    const { id } = await context.params;
    const body = await readJsonBody(request);
    const card = await addCard(id, body);
    return jsonSuccess(card, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
