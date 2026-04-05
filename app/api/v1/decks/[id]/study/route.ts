import { jsonError, jsonSuccess } from "@/features/anki/backend/api";
import { getStudyQueue } from "@/features/anki/backend/service";

export const dynamic = "force-dynamic";

interface DeckStudyRouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Returns the due-card study queue for a user-owned deck.
 * @param _request Incoming request object.
 * @param context Next route context containing the deck id.
 * @returns JSON response containing due cards and queue metadata.
 */
export async function GET(_request: Request, context: DeckStudyRouteContext) {
  try {
    const { id } = await context.params;
    const queue = await getStudyQueue(id);
    return jsonSuccess(queue.data, { meta: queue.meta });
  } catch (error) {
    return jsonError(error);
  }
}
