import { getAttemptResult, jsonError, jsonSuccess } from "@/features/quiz/backend";

export const dynamic = "force-dynamic";

interface AttemptResultRouteContext {
  params: Promise<{
    attemptId: string;
  }>;
}

/**
 * Loads the graded result for one quiz attempt.
 * @param _request Incoming request object.
 * @param context Route context containing the attempt id.
 * @returns JSON response containing the attempt result.
 */
export async function GET(_request: Request, context: AttemptResultRouteContext) {
  try {
    const { attemptId } = await context.params;
    const result = await getAttemptResult(attemptId);
    return jsonSuccess(result);
  } catch (error) {
    return jsonError(error);
  }
}
