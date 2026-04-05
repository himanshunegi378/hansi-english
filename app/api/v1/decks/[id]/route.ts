import { jsonError, jsonSuccess } from "@/features/anki/backend/api";
import { getDeck, removeDeck } from "@/features/anki/backend/service";

export const dynamic = "force-dynamic";

interface DeckRouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Loads a single user-owned deck and its cards.
 * @param _request Incoming request object.
 * @param context Next route context containing the deck id.
 * @returns JSON response containing the deck detail.
 */
export async function GET(_request: Request, context: DeckRouteContext) {
  try {
    const { id } = await context.params;
    const deck = await getDeck(id);
    return jsonSuccess(deck);
  } catch (error) {
    return jsonError(error);
  }
}

/**
 * Deletes a single user-owned deck.
 * @param _request Incoming request object.
 * @param context Next route context containing the deck id.
 * @returns Empty `204` response on success.
 */
export async function DELETE(_request: Request, context: DeckRouteContext) {
  try {
    const { id } = await context.params;
    await removeDeck(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return jsonError(error);
  }
}
