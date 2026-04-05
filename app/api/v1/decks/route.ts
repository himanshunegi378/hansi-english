import { jsonError, jsonSuccess, readJsonBody } from "@/features/anki/backend/api";
import { createDeck, listDecks } from "@/features/anki/backend/service";

export const dynamic = "force-dynamic";

/**
 * Lists all decks for the authenticated user.
 * @returns JSON response containing deck summaries.
 */
export async function GET() {
  try {
    const decks = await listDecks();
    return jsonSuccess(decks);
  } catch (error) {
    return jsonError(error);
  }
}

/**
 * Creates a new deck for the authenticated user.
 * @param request Incoming JSON request containing deck fields.
 * @returns JSON response containing the created deck.
 */
export async function POST(request: Request) {
  try {
    const body = await readJsonBody(request);
    const deck = await createDeck(body);
    return jsonSuccess(deck, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
