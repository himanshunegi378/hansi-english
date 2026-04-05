import { jsonError, jsonSuccess, readJsonBody } from "@/features/anki/backend/api";
import { editCard, removeCard } from "@/features/anki/backend/service";

export const dynamic = "force-dynamic";

interface CardRouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Updates a user-owned card.
 * @param request Incoming JSON request containing updated card fields.
 * @param context Next route context containing the card id.
 * @returns JSON response containing the updated card.
 */
export async function PUT(request: Request, context: CardRouteContext) {
  try {
    const { id } = await context.params;
    const body = await readJsonBody(request);
    const card = await editCard(id, body);
    return jsonSuccess(card);
  } catch (error) {
    return jsonError(error);
  }
}

/**
 * Deletes a user-owned card.
 * @param _request Incoming request object.
 * @param context Next route context containing the card id.
 * @returns Empty `204` response on success.
 */
export async function DELETE(_request: Request, context: CardRouteContext) {
  try {
    const { id } = await context.params;
    await removeCard(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return jsonError(error);
  }
}
