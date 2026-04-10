import { getAttempt, jsonError, jsonSuccess } from "@/features/quiz/backend";

export const dynamic = "force-dynamic";

interface AttemptRouteContext {
  params: Promise<{
    attemptId: string;
  }>;
}

/**
 * Loads one quiz attempt detail.
 * @param _request Incoming request object.
 * @param context Route context containing the attempt id.
 * @returns JSON response containing the attempt detail.
 */
export async function GET(_request: Request, context: AttemptRouteContext) {
  try {
    const { attemptId } = await context.params;
    const attempt = await getAttempt(attemptId);
    return jsonSuccess(attempt);
  } catch (error) {
    return jsonError(error);
  }
}
