import { jsonError, jsonSuccess, readJsonBody } from "@/features/anki/backend/api";
import { reviewCard } from "@/features/anki/backend/service";

export const dynamic = "force-dynamic";

interface CardReviewRouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Submits a spaced-repetition review for a user-owned card.
 * @param request Incoming JSON request containing the review grade.
 * @param context Next route context containing the card id.
 * @returns JSON response containing the updated review state.
 */
export async function POST(request: Request, context: CardReviewRouteContext) {
  try {
    const { id } = await context.params;
    const body = await readJsonBody(request);
    const result = await reviewCard(id, body);
    return jsonSuccess(result);
  } catch (error) {
    return jsonError(error);
  }
}
